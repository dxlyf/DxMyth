import type { GLCapabilities } from './caps.js';
import {
  GLProgramError,
  GLStateError,
  GLUniformError,
  type GLDiagnostic,
  type GLStage,
} from './errors.js';
import {
  GLENUM,
  glTypeToAttributeType,
  glTypeToUniformType,
  isSamplerType,
  type GLBlockFieldType,
  type GL,
  type GLAttributeType,
  type GLUniformType,
} from './enums.js';
import { setUniformValue, type UniformValue } from './uniform.js';
import type { GLState } from './state.js';
import type { GLUniformBuffer } from './uniform-block.js';
import { GLUniformBlockLayout, type GLUniformBlockField } from './uniform-block.js';

export interface ProgramDescriptor {
  label?: string;
  vertex: string;
  fragment: string;
  /** Attribute name → location, applied with bindAttribLocation before linking. */
  attributeLocations?: Record<string, number>;
  /** Optional contract: checked against runtime reflection after linking. */
  uniforms?: Record<string, GLUniformType>;
}

export interface GLAttributeRef {
  readonly location: number;
  readonly type: GLAttributeType;
  readonly size: number;
}

export interface GLUniformRef {
  /** Dense index assigned at link time; use with GLDrawPlan. */
  readonly slot: number;
  readonly name: string;
  readonly type: GLUniformType;
  readonly size: number;
  readonly location: WebGLUniformLocation;
  /** Requires the program to be current; throws GLStateError otherwise. */
  set(value: UniformValue): void;
}

export interface GLSamplerRef {
  readonly location: WebGLUniformLocation;
  readonly unit: number;
}

export interface GLUniformBlockRef {
  readonly name: string;
  readonly index: number;
  readonly binding: number;
  readonly size: number;
  readonly layout: GLUniformBlockLayout;
}

export interface GLProgramReflection {
  readonly attributes: ReadonlyMap<string, GLAttributeRef>;
  readonly uniforms: ReadonlyMap<string, GLUniformRef>;
  readonly samplers: ReadonlyMap<string, GLSamplerRef>;
  readonly uniformBlocks: ReadonlyMap<string, GLUniformBlockRef>;
  readonly activeUniformCount: number;
}

const DIAGNOSTIC = /^(?:ERROR|WARNING):\s*\d+:(\d+):\s*(.*)$/;

function parseDiagnostics(stage: GLStage, log: string, source: string): GLDiagnostic[] {
  const sourceLines = source.split(/\r?\n/);
  const diagnostics: GLDiagnostic[] = [];
  for (const rawLine of log.split(/\r?\n/)) {
    const match = DIAGNOSTIC.exec(rawLine.trim());
    if (!match) continue;
    const line = Number(match[1]);
    const message = match[2] ?? '';
    diagnostics.push({
      stage,
      line,
      column: 0,
      message,
      sourceLine: sourceLines[line - 1] ?? null,
    });
  }
  return diagnostics;
}

class UniformRef implements GLUniformRef {
  constructor(
    private readonly gl: GL,
    private readonly version: 1 | 2,
    private readonly state: GLState,
    private readonly program: WebGLProgram,
    readonly slot: number,
    readonly name: string,
    readonly type: GLUniformType,
    readonly size: number,
    readonly location: WebGLUniformLocation,
  ) {}

  set(value: UniformValue): void {
    if (this.state.currentProgram !== this.program) {
      throw new GLStateError(
        'no-program',
        `uniform "${this.name}" set while its program is not current; call useProgram first`,
      );
    }
    if (isSamplerType(this.type)) {
      throw new GLUniformError(this.name, 'a non-sampler uniform', `sampler type ${this.type}`);
    }
    setUniformValue(this.gl, this.version, this, value);
  }
}

export class GLProgram {
  readonly label: string;
  readonly handle: WebGLProgram;
  readonly reflection: GLProgramReflection;

  private readonly gl: GL;
  private readonly state: GLState;
  private readonly uniformBufferOffsetAlignment: number;
  private readonly samplerMap = new Map<string, GLSamplerRef>();
  private readonly uniformMap = new Map<string, GLUniformRef>();
  private readonly uniformList: GLUniformRef[] = [];
  private readonly attributeMap = new Map<string, GLAttributeRef>();
  private readonly blockMap = new Map<string, GLUniformBlockRef>();
  private destroyedFlag = false;
  private samplerUnitsApplied = false;

  constructor(gl: GL, version: 1 | 2, caps: GLCapabilities, state: GLState, desc: ProgramDescriptor) {
    this.gl = gl;
    this.state = state;
    this.uniformBufferOffsetAlignment = Math.max(1, caps.limits.uniformBufferOffsetAlignment);
    this.label = desc.label ?? 'program';

    const vertexShader = this.compile(gl.VERTEX_SHADER, 'vertex', desc.vertex, desc.label);
    let fragmentShader: WebGLShader | undefined;
    try {
      fragmentShader = this.compile(gl.FRAGMENT_SHADER, 'fragment', desc.fragment, desc.label);
    } catch (error) {
      gl.deleteShader(vertexShader);
      throw error;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      throw new GLProgramError({
        stage: 'link',
        label: this.label,
        log: 'unable to create program object',
        diagnostics: [],
        source: '',
      });
    }

    if (desc.attributeLocations) {
      for (const [name, location] of Object.entries(desc.attributeLocations)) {
        gl.bindAttribLocation(program, location, name);
      }
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (!gl.getProgramParameter(program, GLENUM.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(program) ?? '';
      gl.deleteProgram(program);
      throw new GLProgramError({
        stage: 'link',
        label: this.label,
        log,
        diagnostics: [],
        source: `${desc.vertex}\n${desc.fragment}`,
      });
    }

    this.handle = program;

    const attributeCount = Number(gl.getProgramParameter(program, GLENUM.ACTIVE_ATTRIBUTES) ?? 0);
    for (let i = 0; i < attributeCount; i++) {
      const info = gl.getActiveAttrib(program, i);
      if (!info) continue;
      this.attributeMap.set(info.name, {
        location: gl.getAttribLocation(program, info.name),
        type: glTypeToAttributeType(info.type),
        size: info.size,
      });
    }
    if (desc.attributeLocations) {
      for (const name of Object.keys(desc.attributeLocations)) {
        if (!this.attributeMap.has(name)) {
          const available = [...this.attributeMap.keys()].join(', ') || '(none)';
          gl.deleteProgram(program);
          this.destroyedFlag = true;
          throw new GLProgramError({
            stage: 'link',
            label: this.label,
            log: `attribute location bound for missing attribute "${name}"`,
            diagnostics: [],
            source: `${desc.vertex}\n${desc.fragment}`,
          });
        }
      }
    }

    const uniformCount = Number(gl.getProgramParameter(program, GLENUM.ACTIVE_UNIFORMS) ?? 0);
    const samplerNames: string[] = [];
    for (let i = 0; i < uniformCount; i++) {
      const info = gl.getActiveUniform(program, i);
      if (!info) continue;
      const name = info.name.replace(/\[0\]$/, '');
      const type = glTypeToUniformType(info.type);
      if (!type) continue;
      const location = gl.getUniformLocation(program, info.name);
      if (!location) continue;
      const slot = this.uniformList.length;
      const ref = new UniformRef(gl, version, state, program, slot, name, type, info.size, location);
      this.uniformMap.set(name, ref);
      this.uniformList.push(ref);
      if (isSamplerType(type)) samplerNames.push(name);
    }

    samplerNames.sort();
    if (samplerNames.length > caps.limits.maxCombinedTextureUnits) {
      gl.deleteProgram(program);
      this.destroyedFlag = true;
      throw new GLProgramError({
        stage: 'link',
        label: this.label,
        log: `too many sampler uniforms (${samplerNames.length} > ${caps.limits.maxCombinedTextureUnits})`,
        diagnostics: [],
        source: '',
      });
    }
    samplerNames.forEach((name, unit) => {
      const ref = this.uniformMap.get(name);
      if (!ref) return;
      this.samplerMap.set(name, { location: ref.location, unit });
    });

    if (desc.uniforms) {
      for (const [name, expected] of Object.entries(desc.uniforms)) {
        const ref = this.uniformMap.get(name);
        if (!ref) {
          gl.deleteProgram(program);
          this.destroyedFlag = true;
          throw new GLUniformError(name, expected, 'not active in this program');
        }
        if (ref.type !== expected) {
          gl.deleteProgram(program);
          this.destroyedFlag = true;
          throw new GLUniformError(name, expected, ref.type);
        }
      }
    }

    if (version === 2) {
      const gl2 = gl as WebGL2RenderingContext;
      const blockCount = Number(gl2.getProgramParameter(program, GLENUM.ACTIVE_UNIFORM_BLOCKS) ?? 0);
      if (blockCount > caps.limits.maxUniformBufferBindings) {
        gl.deleteProgram(program);
        this.destroyedFlag = true;
        throw new GLProgramError({
          stage: 'link',
          label: this.label,
          log: `${blockCount} uniform blocks exceed the limit of ${caps.limits.maxUniformBufferBindings}`,
          diagnostics: [],
          source: '',
        });
      }
      const blocks: Array<{ name: string; index: number; size: number }> = [];
      for (let i = 0; i < blockCount; i++) {
        const name = gl2.getActiveUniformBlockName(program, i) ?? `block${i}`;
        const size = Number(gl2.getActiveUniformBlockParameter(program, i, GLENUM.UNIFORM_BLOCK_DATA_SIZE) ?? 0);
        blocks.push({ name, index: i, size });
      }
      blocks.sort((a, b) => a.name.localeCompare(b.name));

      for (let binding = 0; binding < blocks.length; binding++) {
        const block = blocks[binding];
        if (!block) continue;
        gl2.uniformBlockBinding(program, block.index, binding);

        const active = Number(
          gl2.getActiveUniformBlockParameter(program, block.index, GLENUM.UNIFORM_BLOCK_ACTIVE_UNIFORMS) ?? 0,
        );
        const fields: GLUniformBlockField[] = [];
        if (active > 0) {
          const indices = gl2.getActiveUniformBlockParameter(
            program,
            block.index,
            GLENUM.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES,
          ) as Uint32Array | null;
          if (indices) {
            const offsets = gl2.getActiveUniforms(program, indices, GLENUM.UNIFORM_OFFSET) as number[];
            const arrayStrides = gl2.getActiveUniforms(program, indices, GLENUM.UNIFORM_ARRAY_STRIDE) as number[];
            const matrixStrides = gl2.getActiveUniforms(program, indices, GLENUM.UNIFORM_MATRIX_STRIDE) as number[];
            const rowMajor = gl2.getActiveUniforms(program, indices, GLENUM.UNIFORM_IS_ROW_MAJOR) as number[];

            for (let k = 0; k < active; k++) {
              const uniformIndex = indices[k];
              if (uniformIndex === undefined) continue;
              const info = gl2.getActiveUniform(program, uniformIndex);
              if (!info) continue;
              const type = glTypeToUniformType(info.type);
              if (!type || isSamplerType(type)) continue;
              fields.push({
                name: info.name.replace(/\[0\]$/, ''),
                type: type as GLBlockFieldType,
                offset: Number(offsets[k] ?? 0),
                arrayLength: info.size,
                arrayStride: Number(arrayStrides[k] ?? 0),
                matrixStride: Number(matrixStrides[k] ?? 0),
                isRowMajor: Number(rowMajor[k] ?? 0) !== 0,
              });
            }
          }
        }

        const layout = new GLUniformBlockLayout(block.name, block.size, fields);
        this.blockMap.set(block.name, {
          name: block.name,
          index: block.index,
          binding,
          size: block.size,
          layout,
        });
      }
    }

    this.reflection = {
      attributes: this.attributeMap,
      uniforms: this.uniformMap,
      samplers: this.samplerMap,
      uniformBlocks: this.blockMap,
      activeUniformCount: this.uniformMap.size,
    };
  }

  private compile(type: number, stage: GLStage, source: string, label: string | undefined): WebGLShader {
    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new GLProgramError({
        stage,
        label: label ?? 'program',
        log: 'unable to create shader object',
        diagnostics: [],
        source,
      });
    }
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, GLENUM.COMPILE_STATUS)) {
      const log = this.gl.getShaderInfoLog(shader) ?? '';
      this.gl.deleteShader(shader);
      throw new GLProgramError({
        stage,
        label: label ?? 'program',
        log,
        diagnostics: parseDiagnostics(stage, log, source),
        source,
      });
    }
    return shader;
  }

  get destroyed(): boolean {
    return this.destroyedFlag;
  }

  ensureAlive(): void {
    if (this.destroyedFlag) {
      throw new GLStateError('invalid-order', `program "${this.label}" has been destroyed`);
    }
  }

  /** Writes the link-time sampler unit assignments once per program. */
  applySamplerUnits(): void {
    if (this.samplerUnitsApplied) return;
    for (const sampler of this.samplerMap.values()) {
      this.gl.uniform1i(sampler.location, sampler.unit);
    }
    this.samplerUnitsApplied = true;
  }

  uniform(name: string): GLUniformRef | null {
    return this.uniformMap.get(name.replace(/\[0\]$/, '')) ?? null;
  }

  /** Dense slot for the hot path; throws when the name is not active. */
  uniformSlot(name: string): number {
    const ref = this.uniform(name);
    if (!ref) throw new GLUniformError(name, 'an active uniform', 'not found');
    return ref.slot;
  }

  uniformAt(slot: number): GLUniformRef | null {
    return this.uniformList[slot] ?? null;
  }

  uniformBlock(name: string): GLUniformBlockRef | null {
    return this.blockMap.get(name) ?? null;
  }

  uniformBlockLayout(name: string): GLUniformBlockLayout | null {
    return this.blockMap.get(name)?.layout ?? null;
  }

  /**
   * Binds a uniform buffer to the link-time binding point of `name`.
   * `offset` must be a multiple of `caps.limits.uniformBufferOffsetAlignment`.
   */
  bindBlock(name: string, buffer: GLUniformBuffer, offset = 0, size?: number): void {
    if (this.destroyedFlag) throw new GLStateError('invalid-order', `program "${this.label}" is destroyed`);
    const block = this.blockMap.get(name);
    if (!block) {
      const available = [...this.blockMap.keys()].join(', ') || '(none)';
      throw new GLUniformError(name, 'an active uniform block', `not found (available: ${available})`);
    }
    buffer.ensureAlive();
    const length = size ?? buffer.byteLength - offset;
    if (offset < 0 || length <= 0 || offset + length > buffer.byteLength) {
      throw new GLUniformError(name, 'a valid buffer range', `${offset}+${length} of ${buffer.byteLength}`);
    }
    if (offset % this.uniformBufferOffsetAlignment !== 0) {
      throw new GLUniformError(
        name,
        `offset aligned to ${this.uniformBufferOffsetAlignment}`,
        String(offset),
      );
    }
    if (length < block.size) {
      throw new GLUniformError(
        name,
        `at least ${block.size} bytes (block size)`,
        `${length} bytes`,
      );
    }
    this.state.bindUniformBuffer(block.binding, buffer.handle, offset, length);
  }

  get uniformCount(): number {
    return this.uniformList.length;
  }

  destroy(): void {
    if (this.destroyedFlag) return;
    if (this.state.currentProgram === this.handle) this.state.useProgram(null);
    this.gl.deleteProgram(this.handle);
    this.destroyedFlag = true;
  }
}
