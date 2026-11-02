import { GLCapabilities, type GLFeature, type GLLimits } from './caps.js';
import { GLState } from './state.js';
import { GLStatsTracker, type GLStats } from './stats.js';
import { GLProgram, type GLProgramReflection, type ProgramDescriptor } from './program.js';
import { GLBuffer, type BufferDescriptor } from './buffer.js';
import { GLTexture, type TextureDescriptor, type TextureSource } from './texture.js';
import { GLSampler, type SamplerDescriptor } from './sampler.js';
import { GLVertexArray, type VertexArrayDescriptor } from './vertex-array.js';
import { GLFramebuffer, type FramebufferDescriptor } from './framebuffer.js';
import { GLUniformBuffer, type UniformBufferDescriptor } from './uniform-block.js';
import { GLCapabilityError, GLError, GLResourceError, GLStateError, GLUniformError } from './errors.js';
import {
  GLENUM,
  primitiveToGL,
  type GL,
  type GLPrimitive,
} from './enums.js';
import { uniformByteSize, type UniformValue } from './uniform.js';
import { GLDrawPlan, type DrawPlanDescriptor } from './draw-plan.js';
import type { DrawState } from './draw-types.js';

export type { BlendState, DepthState, DrawState } from './draw-types.js';

export interface WebGLBackendOptions {
  canvas?: HTMLCanvasElement | OffscreenCanvas;
  /** Take over an existing context instead of creating one. */
  context?: WebGLRenderingContext | WebGL2RenderingContext;
  version?: 1 | 2;
  attributes?: WebGLContextAttributes;
  requiredExtensions?: readonly string[];
  debug?: {
    validate?: boolean;
    checkErrors?: boolean;
    trackResources?: boolean;
  };
}

export interface DrawCommand {
  program: GLProgram;
  vao: GLVertexArray;
  count: number;
  mode?: GLPrimitive;
  first?: number;
  instances?: number;
  index?: { buffer: GLBuffer; type: 'uint16' | 'uint32'; byteOffset?: number };
  uniforms?: Record<string, UniformValue>;
  textures?: Record<string, GLTexture | { texture: GLTexture; sampler?: GLSampler }>;
  /** Uniform blocks bound for this draw; values are the block names in the shader. */
  blocks?: Record<string, GLUniformBuffer | { buffer: GLUniformBuffer; offset?: number; size?: number }>;
  state?: DrawState;
}

export interface PassDescriptor {
  target?: GLFramebuffer | null;
  viewport?: readonly [number, number, number, number];
  scissor?: readonly [number, number, number, number] | null;
  clear?: {
    color?: readonly [number, number, number, number];
    depth?: number;
    stencil?: number;
  };
}

export interface ReadPixelsOptions {
  flipY?: boolean;
}

interface Disposable {
  destroy(): void;
}

interface ANGLEInstancedArrays {
  drawArraysInstancedANGLE(mode: number, first: number, count: number, instances: number): void;
  drawElementsInstancedANGLE(mode: number, count: number, type: number, offset: number, instances: number): void;
}

function detectVersion(context: WebGLRenderingContext | WebGL2RenderingContext): 1 | 2 {
  return typeof (context as WebGL2RenderingContext).texStorage2D === 'function' ? 2 : 1;
}

function createContext(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  version: 1 | 2,
  attributes: WebGLContextAttributes | undefined,
): GL | null {
  const id = version === 2 ? 'webgl2' : 'webgl';
  const context = (canvas as HTMLCanvasElement).getContext(id, attributes);
  return (context as WebGLRenderingContext | WebGL2RenderingContext | null) ?? null;
}

export class WebGLBackend {
  readonly gl: GL;
  readonly version: 1 | 2;
  readonly caps: GLCapabilities;
  readonly state: GLState;
  readonly stats: GLStats;

  private readonly tracker: GLStatsTracker;
  private readonly resources = new Set<Disposable>();
  private readonly lostListeners = new Set<() => void>();
  private readonly canvas: HTMLCanvasElement | OffscreenCanvas | null;
  private currentProgram: GLProgram | null = null;
  private lostFlag = false;

  constructor(options: WebGLBackendOptions) {
    const { context, canvas, attributes } = options;
    if (!context && !canvas) {
      throw new GLError('webgl/context', 'createWebGLBackend needs either a canvas or an existing context');
    }

    let gl: GL | null = context ?? null;
    let version: 1 | 2;
    if (gl) {
      version = detectVersion(gl);
    } else {
      const requested = options.version ?? 2;
      gl = createContext(canvas as HTMLCanvasElement, requested, attributes);
      version = requested;
      if (!gl && options.version === undefined) {
        gl = createContext(canvas as HTMLCanvasElement, 1, attributes);
        version = 1;
      }
      if (!gl) {
        throw new GLError('webgl/context', `unable to create a WebGL${requested} context`);
      }
    }

    this.gl = gl;
    this.version = version;
    this.canvas = canvas ?? null;
    this.caps = new GLCapabilities(gl, version, options.requiredExtensions);
    this.tracker = new GLStatsTracker();
    this.stats = this.tracker;
    this.state = new GLState(gl, version, this.caps, this.tracker);

    if (this.canvas && typeof this.canvas.addEventListener === 'function') {
      this.canvas.addEventListener('webglcontextlost', this.handleLost as EventListener);
      this.canvas.addEventListener('webglcontextrestored', this.handleRestored);
    }
  }

  private handleLost = (event: Event): void => {
    event.preventDefault();
    this.lostFlag = true;
    this.currentProgram = null;
    this.state.invalidate();
    for (const listener of this.lostListeners) listener();
  };

  private handleRestored = (): void => {
    this.lostFlag = false;
    this.currentProgram = null;
    this.state.invalidate();
  };

  get lost(): boolean {
    return this.lostFlag;
  }

  onLost(listener: () => void): () => void {
    this.lostListeners.add(listener);
    return () => this.lostListeners.delete(listener);
  }

  private checkUsable(): void {
    if (this.lostFlag) throw new GLResourceError('context', 'context-lost');
  }

  private track<T extends Disposable>(resource: T): T {
    this.resources.add(resource);
    return resource;
  }

  get drawingBufferWidth(): number {
    return this.gl.drawingBufferWidth;
  }

  get drawingBufferHeight(): number {
    return this.gl.drawingBufferHeight;
  }

  get features(): ReadonlySet<GLFeature> {
    return this.caps.features;
  }

  get limits(): GLLimits {
    return this.caps.limits;
  }

  createProgram(desc: ProgramDescriptor): GLProgram {
    this.checkUsable();
    return this.track(new GLProgram(this.gl, this.version, this.caps, this.state, desc));
  }

  createBuffer(desc: BufferDescriptor): GLBuffer {
    this.checkUsable();
    return this.track(new GLBuffer(this.gl, this.state, this.tracker, desc));
  }

  createTexture(desc: TextureDescriptor): GLTexture {
    this.checkUsable();
    return this.track(new GLTexture(this.gl, this.version, this.caps, this.state, this.tracker, desc));
  }

  createSampler(desc: SamplerDescriptor = {}): GLSampler {
    this.checkUsable();
    return this.track(new GLSampler(this.gl, this.version, this.caps, desc));
  }

  createVertexArray(desc: VertexArrayDescriptor): GLVertexArray {
    this.checkUsable();
    return this.track(new GLVertexArray(this.gl, this.caps, this.state, this.tracker, desc));
  }

  createFramebuffer(desc: FramebufferDescriptor): GLFramebuffer {
    this.checkUsable();
    return this.track(new GLFramebuffer(this.gl, this.version, this.caps, this.state, this.tracker, desc));
  }

  createUniformBuffer(desc: UniformBufferDescriptor): GLUniformBuffer {
    this.checkUsable();
    return this.track(new GLUniformBuffer(this.gl, this.version, this.caps, this.state, this.tracker, desc));
  }

  bindUniformBlock(
    program: GLProgram,
    name: string,
    buffer: GLUniformBuffer,
    offset = 0,
    size?: number,
  ): void {
    this.checkUsable();
    if (this.currentProgram !== program) this.useProgram(program);
    program.bindBlock(name, buffer, offset, size);
  }

  /**
   * Pre-resolved draw call: numeric uniform slots, fixed texture units and
   * state resolved once. `plan.draw()` performs no name lookups and no
   * Object.entries; uniforms are only re-uploaded when their value changed.
   */
  createDrawPlan(desc: DrawPlanDescriptor): GLDrawPlan {
    this.checkUsable();
    return new GLDrawPlan(
      {
        gl: this.gl,
        version: this.version,
        caps: this.caps,
        state: this.state,
        stats: this.tracker,
        useProgram: (program) => this.useProgram(program),
        bindTextureUnit: (unit, texture, sampler) => this.bindTextureUnit(unit, texture, sampler),
        applyState: (state) => this.applyState(state),
        executeDraw: (mode, count, first, instances, indexType, indexOffset) =>
          this.executeDraw(mode, count, first, instances, indexType, indexOffset),
      },
      desc,
    );
  }

  useProgram(program: GLProgram): void {
    this.checkUsable();
    program.ensureAlive();
    this.state.useProgram(program.handle);
    program.applySamplerUnits();
    this.currentProgram = program;
  }

  setUniforms(program: GLProgram, values: Record<string, UniformValue>): void {
    this.checkUsable();
    if (this.currentProgram !== program) this.useProgram(program);
    for (const name in values) {
      if (!Object.prototype.hasOwnProperty.call(values, name)) continue;
      const value = values[name];
      if (value === undefined) continue;
      const ref = program.uniform(name);
      if (!ref) {
        throw new GLUniformError(name, 'an active uniform', 'not found');
      }
      ref.set(value);
      this.tracker.uniformUploads += uniformByteSize(ref.type, ref.size);
    }
  }

  bindTexture(name: string, texture: GLTexture, sampler?: GLSampler): void {
    this.checkUsable();
    const program = this.currentProgram;
    if (!program) {
      throw new GLStateError('no-program', `bindTexture("${name}") needs a current program; call useProgram first`);
    }
    const ref = program.reflection.samplers.get(name);
    if (!ref) {
      const available = [...program.reflection.samplers.keys()].join(', ') || '(none)';
      throw new GLUniformError(name, 'a sampler uniform', `not found (available: ${available})`);
    }
    this.bindTextureUnit(ref.unit, texture, sampler);
  }

  private bindTextureUnit(unit: number, texture: GLTexture, sampler?: GLSampler): void {
    texture.ensureAlive();
    this.state.bindTexture(unit, texture.handle);
    if (this.version === 2) {
      this.state.bindSampler(unit, sampler?.handle ?? null);
    } else if (sampler) {
      sampler.applyToTexture(texture);
    }
  }

  bindVertexArray(vao: GLVertexArray): void {
    this.checkUsable();
    vao.bind();
  }

  beginPass(desc: PassDescriptor = {}): void {
    this.checkUsable();
    const target = desc.target ?? null;
    if (target) target.bind();
    else this.state.bindFramebuffer(null);

    const width = target?.width ?? this.drawingBufferWidth;
    const height = target?.height ?? this.drawingBufferHeight;
    if (desc.viewport) {
      this.state.setViewport(desc.viewport[0], desc.viewport[1], desc.viewport[2], desc.viewport[3]);
    } else {
      this.state.setViewport(0, 0, width, height);
    }
    this.state.setScissor(desc.scissor ?? null);

    if (desc.clear) this.clear(desc.clear);
  }

  private clear(clear: NonNullable<PassDescriptor['clear']>): void {
    this.state.setColorMask(true, true, true, true);
    this.state.setDepthMask(true);
    let mask = 0;
    if (clear.color) {
      const [r, g, b, a] = clear.color;
      this.gl.clearColor(r, g, b, a);
      mask |= GLENUM.COLOR_BUFFER_BIT;
    }
    if (clear.depth !== undefined) {
      this.gl.clearDepth(clear.depth);
      mask |= GLENUM.DEPTH_BUFFER_BIT;
    }
    if (clear.stencil !== undefined) {
      this.gl.clearStencil(clear.stencil);
      mask |= GLENUM.STENCIL_BUFFER_BIT;
    }
    if (mask !== 0) this.gl.clear(mask);
  }

  endPass(): void {
    this.state.bindFramebuffer(null);
    this.state.setViewport(0, 0, this.drawingBufferWidth, this.drawingBufferHeight);
    this.state.setScissor(null);
  }

  draw(cmd: DrawCommand): void {
    this.checkUsable();
    if (cmd.count < 0) throw new GLError('webgl/draw', `negative draw count ${cmd.count}`);
    if (cmd.count === 0) return;

    cmd.program.ensureAlive();
    cmd.vao.ensureAlive();
    if (cmd.program !== this.currentProgram) this.useProgram(cmd.program);
    cmd.vao.bind();

    if (cmd.blocks) {
      for (const name in cmd.blocks) {
        if (!Object.prototype.hasOwnProperty.call(cmd.blocks, name)) continue;
        const binding = cmd.blocks[name];
        if (!binding) continue;
        if (binding instanceof GLUniformBuffer) cmd.program.bindBlock(name, binding);
        else cmd.program.bindBlock(name, binding.buffer, binding.offset ?? 0, binding.size);
      }
    }

    if (cmd.index) {
      if (cmd.index.buffer.target !== GLENUM.ELEMENT_ARRAY_BUFFER) {
        throw new GLError('webgl/draw', 'index buffer must be created with target "index"');
      }
      cmd.index.buffer.ensureAlive();
      this.state.bindElementBuffer(cmd.index.buffer.handle);
    }

    if (cmd.textures) {
      for (const name in cmd.textures) {
        if (!Object.prototype.hasOwnProperty.call(cmd.textures, name)) continue;
        const binding = cmd.textures[name];
        if (!binding) continue;
        if (binding instanceof GLTexture) this.bindTexture(name, binding);
        else this.bindTexture(name, binding.texture, binding.sampler);
      }
    }

    if (cmd.uniforms) this.setUniforms(cmd.program, cmd.uniforms);
    if (cmd.state) this.applyState(cmd.state);

    if (cmd.index?.type === 'uint32') this.caps.require('uint32-index');
    this.executeDraw(
      primitiveToGL(cmd.mode ?? 'triangles'),
      cmd.count,
      cmd.first ?? 0,
      cmd.instances ?? 1,
      cmd.index ? (cmd.index.type === 'uint32' ? GLENUM.UNSIGNED_INT : GLENUM.UNSIGNED_SHORT) : null,
      cmd.index?.byteOffset ?? 0,
    );
  }

  private executeDraw(
    mode: number,
    count: number,
    first: number,
    instances: number,
    indexType: number | null,
    indexOffset: number,
  ): void {
    if (indexType === null) {
      if (instances > 1) this.drawArraysInstanced(mode, first, count, instances);
      else this.gl.drawArrays(mode, first, count);
    } else if (instances > 1) {
      this.drawElementsInstanced(mode, count, indexType, indexOffset, instances);
    } else {
      this.gl.drawElements(mode, count, indexType, indexOffset);
    }
    this.tracker.drawCalls++;
    this.tracker.instances += instances;
  }

  private drawArraysInstanced(mode: number, first: number, count: number, instances: number): void {
    if (this.version === 2) {
      (this.gl as WebGL2RenderingContext).drawArraysInstanced(mode, first, count, instances);
      return;
    }
    const ext = this.caps.extension<ANGLEInstancedArrays>('ANGLE_instanced_arrays');
    if (!ext) throw new GLCapabilityError('instancing', 'instanced draws need ANGLE_instanced_arrays');
    ext.drawArraysInstancedANGLE(mode, first, count, instances);
  }

  private drawElementsInstanced(
    mode: number,
    count: number,
    type: number,
    offset: number,
    instances: number,
  ): void {
    if (this.version === 2) {
      (this.gl as WebGL2RenderingContext).drawElementsInstanced(mode, count, type, offset, instances);
      return;
    }
    const ext = this.caps.extension<ANGLEInstancedArrays>('ANGLE_instanced_arrays');
    if (!ext) throw new GLCapabilityError('instancing', 'instanced draws need ANGLE_instanced_arrays');
    ext.drawElementsInstancedANGLE(mode, count, type, offset, instances);
  }

  private applyState(state: DrawState): void {
    if (state.blend === false) {
      this.state.disableBlend();
    } else if (state.blend) {
      this.state.setBlend(
        true,
        state.blend.srcFactor ?? 'one',
        state.blend.dstFactor ?? 'zero',
        state.blend.srcAlphaFactor ?? state.blend.srcFactor ?? 'one',
        state.blend.dstAlphaFactor ?? state.blend.dstFactor ?? 'zero',
        state.blend.equation ?? 'add',
        state.blend.alphaEquation ?? state.blend.equation ?? 'add',
        state.blend.color,
      );
    }

    if (state.depth === false) {
      this.state.setDepthTest(false);
      this.state.setDepthMask(false);
    } else if (state.depth) {
      this.state.setDepthTest(state.depth.test ?? true);
      if (state.depth.write !== undefined) this.state.setDepthMask(state.depth.write);
      if (state.depth.compare) this.state.setDepthFunc(state.depth.compare);
      if (state.depth.range) this.state.setDepthRange(state.depth.range[0], state.depth.range[1]);
    }

    if (state.cull) this.state.setCull(state.cull);
    if (state.frontFace) this.state.setFrontFace(state.frontFace);
    if (state.colorMask) this.state.setColorMask(...state.colorMask);
    if (state.polygonOffset === false) this.state.disablePolygonOffset();
    else if (state.polygonOffset) this.state.setPolygonOffset(state.polygonOffset[0], state.polygonOffset[1]);
  }

  readPixels(
    x: number,
    y: number,
    width: number,
    height: number,
    options: ReadPixelsOptions = {},
  ): Uint8Array {
    this.checkUsable();
    this.state.setPackAlignment(1);
    const pixels = new Uint8Array(width * height * 4);
    this.gl.readPixels(x, y, width, height, GLENUM.RGBA, GLENUM.UNSIGNED_BYTE, pixels);
    if (!options.flipY) return pixels;
    const flipped = new Uint8Array(pixels.length);
    const row = width * 4;
    for (let rowIndex = 0; rowIndex < height; rowIndex++) {
      const sourceStart = (height - 1 - rowIndex) * row;
      flipped.set(pixels.subarray(sourceStart, sourceStart + row), rowIndex * row);
    }
    return flipped;
  }

  flush(): void {
    this.gl.flush();
  }

  dispose(): void {
    for (const resource of this.resources) {
      try {
        resource.destroy();
      } catch {
        // dispose must not throw halfway through
      }
    }
    this.resources.clear();
    if (this.canvas && typeof this.canvas.removeEventListener === 'function') {
      this.canvas.removeEventListener('webglcontextlost', this.handleLost as EventListener);
      this.canvas.removeEventListener('webglcontextrestored', this.handleRestored);
    }
  }
}

export function createWebGLBackend(options: WebGLBackendOptions): WebGLBackend {
  return new WebGLBackend(options);
}

export type {
  BufferDescriptor,
  FramebufferDescriptor,
  GLProgramReflection,
  SamplerDescriptor,
  TextureDescriptor,
  TextureSource,
  VertexArrayDescriptor,
  GLStats,
  GLFeature,
  GLLimits,
};
