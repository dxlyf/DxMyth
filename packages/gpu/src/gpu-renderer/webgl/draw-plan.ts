import { GLENUM, primitiveToGL, uniformComponents, type GL, type GLPrimitive } from './enums.js';
import { GLError, GLUniformError } from './errors.js';
import type { GLCapabilities } from './caps.js';
import type { GLProgram, GLUniformRef } from './program.js';
import type { GLState } from './state.js';
import type { GLStatsTracker } from './stats.js';
import type { GLVertexArray } from './vertex-array.js';
import type { GLBuffer } from './buffer.js';
import type { GLTexture } from './texture.js';
import type { GLSampler } from './sampler.js';
import type { GLUniformBuffer } from './uniform-block.js';
import { isSamplerType } from './enums.js';
import { setUniformValue, type UniformValue } from './uniform.js';
import type { DrawState } from './draw-types.js';

export interface DrawPlanTexture {
  texture: GLTexture;
  sampler?: GLSampler;
}

export type DrawPlanTextureValue = GLTexture | DrawPlanTexture;

export interface DrawPlanDescriptor {
  label?: string;
  program: GLProgram;
  vao: GLVertexArray;
  count: number;
  mode?: GLPrimitive;
  first?: number;
  instances?: number;
  index?: { buffer: GLBuffer; type: 'uint16' | 'uint32'; byteOffset?: number };
  blocks?: Record<string, GLUniformBuffer | { buffer: GLUniformBuffer; offset?: number; size?: number }>;
  textures?: Record<string, DrawPlanTextureValue>;
  state?: DrawState;
}

export interface DrawPlanContext {
  readonly gl: GL;
  readonly version: 1 | 2;
  readonly caps: GLCapabilities;
  readonly state: GLState;
  readonly stats: GLStatsTracker;
  useProgram(program: GLProgram): void;
  bindTextureUnit(unit: number, texture: GLTexture, sampler?: GLSampler): void;
  applyState(state: DrawState): void;
  executeDraw(
    mode: number,
    count: number,
    first: number,
    instances: number,
    indexType: number | null,
    indexOffset: number,
  ): void;
}

type NumericArray = Float32Array | Int32Array | Uint32Array;

interface SlotState {
  readonly ref: GLUniformRef;
  readonly pending: NumericArray;
  readonly uploaded: NumericArray;
  readonly bytes: number;
  dirty: boolean;
}

interface ResolvedTexture {
  readonly unit: number;
  readonly texture: GLTexture;
  readonly sampler: GLSampler | undefined;
}

function numericArrayFor(ref: GLUniformRef): NumericArray | null {
  if (isSamplerType(ref.type)) return null;
  const length = uniformComponents(ref.type) * ref.size;
  if (ref.type.startsWith('mat') || ref.type.endsWith('f') || ref.type === 'f32') {
    return new Float32Array(length);
  }
  if (ref.type.endsWith('u') || ref.type === 'u32') return new Uint32Array(length);
  return new Int32Array(length);
}

function writeSlot(state: SlotState, value: UniformValue): void {
  const target = state.pending;
  if (typeof value === 'number') {
    if (target.length !== 1) {
      throw new GLUniformError(state.ref.name, `${target.length} values`, 'a single number');
    }
    target[0] = value;
    return;
  }
  if (typeof value === 'boolean') {
    if (target.length !== 1) {
      throw new GLUniformError(state.ref.name, `${target.length} values`, 'a single boolean');
    }
    target[0] = value ? 1 : 0;
    return;
  }
  if (value.length !== target.length) {
    throw new GLUniformError(state.ref.name, `${target.length} values`, `${value.length} values`);
  }
  for (let i = 0; i < target.length; i++) {
    const item = value[i];
    if (item !== undefined) target[i] = item;
  }
}

function differs(a: NumericArray, b: NumericArray): boolean {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return true;
  }
  return false;
}

/**
 * Pre-resolved draw call: uniform slots (numbers), texture units and state are
 * resolved once; `draw()` performs no name lookups, no Object.entries and no
 * per-draw allocations. Uniform values are only uploaded when they changed.
 */
export class GLDrawPlan {
  readonly label: string;
  readonly program: GLProgram;
  readonly vao: GLVertexArray;

  private readonly ctx: DrawPlanContext;
  private readonly count: number;
  private readonly mode: number;
  private readonly first: number;
  private readonly instances: number;
  private readonly index: { buffer: GLBuffer; type: number; offset: number } | null;
  private readonly blocks: Array<{
    name: string;
    buffer: GLUniformBuffer;
    offset: number;
    size: number | undefined;
  }> = [];
  private readonly textures: ResolvedTexture[];
  private readonly slots: Array<SlotState | null>;
  private readonly dirtySlots: number[] = [];
  private state: DrawState | undefined;

  constructor(ctx: DrawPlanContext, desc: DrawPlanDescriptor) {
    this.ctx = ctx;
    this.label = desc.label ?? 'draw-plan';
    this.program = desc.program;
    this.vao = desc.vao;
    this.count = desc.count;
    this.first = desc.first ?? 0;
    this.instances = desc.instances ?? 1;
    this.mode = primitiveToGL(desc.mode ?? 'triangles');
    this.state = desc.state;

    if (desc.count < 0) throw new GLError('webgl/draw-plan', `negative draw count ${desc.count} in "${this.label}"`);

    if (desc.index) {
      if (desc.index.buffer.target !== GLENUM.ELEMENT_ARRAY_BUFFER) {
        throw new GLError('webgl/draw-plan', `index buffer of "${this.label}" must be created with target "index"`);
      }
      desc.index.buffer.ensureAlive();
      if (desc.index.type === 'uint32') this.ctx.caps.require('uint32-index');
      this.index = {
        buffer: desc.index.buffer,
        type: desc.index.type === 'uint32' ? GLENUM.UNSIGNED_INT : GLENUM.UNSIGNED_SHORT,
        offset: desc.index.byteOffset ?? 0,
      };
    } else {
      this.index = null;
    }

    this.textures = [];
    if (desc.blocks) {
      for (const name in desc.blocks) {
        if (!Object.prototype.hasOwnProperty.call(desc.blocks, name)) continue;
        const value = desc.blocks[name];
        if (!value) continue;
        if (!desc.program.uniformBlock(name)) {
          const available = [...desc.program.reflection.uniformBlocks.keys()].join(', ') || '(none)';
          throw new GLUniformError(name, 'an active uniform block', `not found (available: ${available})`);
        }
        const binding =
          'handle' in value
            ? { buffer: value, offset: 0, size: undefined }
            : { buffer: value.buffer, offset: value.offset ?? 0, size: value.size };
        binding.buffer.ensureAlive();
        this.blocks.push({ name, buffer: binding.buffer, offset: binding.offset, size: binding.size });
      }
    }
    if (desc.textures) {
      for (const name of Object.keys(desc.textures)) {
        const value = desc.textures[name];
        if (!value) continue;
        const samplerRef = desc.program.reflection.samplers.get(name);
        if (!samplerRef) {
          const available = [...desc.program.reflection.samplers.keys()].join(', ') || '(none)';
          throw new GLUniformError(name, 'a sampler uniform', `not found (available: ${available})`);
        }
        const binding: DrawPlanTexture = 'texture' in value ? value : { texture: value };
        binding.texture.ensureAlive();
        this.textures.push({
          unit: samplerRef.unit,
          texture: binding.texture,
          sampler: binding.sampler,
        });
      }
    }

    this.slots = new Array(desc.program.uniformCount).fill(null);
    for (let slot = 0; slot < desc.program.uniformCount; slot++) {
      const ref = desc.program.uniformAt(slot);
      if (!ref) continue;
      const array = numericArrayFor(ref);
      if (!array) continue;
      this.slots[slot] = {
        ref,
        pending: array,
        uploaded: array.slice(),
        bytes: array.length * 4,
        dirty: false,
      };
    }
  }

  /** Numeric slot from `program.uniformSlot(name)`. */
  setUniform(slot: number, value: UniformValue): this {
    const state = this.slots[slot];
    if (!state) {
      throw new GLUniformError(this.label, 'a numeric uniform slot', String(slot));
    }
    writeSlot(state, value);
    if (!state.dirty && differs(state.pending, state.uploaded)) {
      state.dirty = true;
      this.dirtySlots.push(slot);
    }
    return this;
  }

  setUniformByName(name: string, value: UniformValue): this {
    return this.setUniform(this.program.uniformSlot(name), value);
  }

  setState(state: DrawState | undefined): this {
    this.state = state;
    return this;
  }

  private flushUniforms(): void {
    if (this.dirtySlots.length === 0) return;
    for (const slot of this.dirtySlots) {
      const state = this.slots[slot];
      if (!state) continue;
      if (!differs(state.pending, state.uploaded)) {
        state.dirty = false;
        continue;
      }
      setUniformValue(this.ctx.gl, this.ctx.version, state.ref, state.pending);
      state.uploaded.set(state.pending);
      state.dirty = false;
      this.ctx.stats.uniformUploads += state.bytes;
    }
    this.dirtySlots.length = 0;
  }

  draw(): void {
    this.program.ensureAlive();
    this.vao.ensureAlive();
    if (this.count === 0) return;

    this.ctx.useProgram(this.program);
    this.vao.bind();

    for (const block of this.blocks) {
      this.program.bindBlock(block.name, block.buffer, block.offset, block.size);
    }

    if (this.index) this.ctx.state.bindElementBuffer(this.index.buffer.handle);

    for (const binding of this.textures) {
      this.ctx.bindTextureUnit(binding.unit, binding.texture, binding.sampler);
    }

    this.flushUniforms();
    if (this.state) this.ctx.applyState(this.state);

    this.ctx.executeDraw(
      this.mode,
      this.count,
      this.first,
      this.instances,
      this.index ? this.index.type : null,
      this.index ? this.index.offset : 0,
    );
  }
}
