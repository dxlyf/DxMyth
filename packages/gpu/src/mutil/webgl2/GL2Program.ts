import {
  GL_ACTIVE_ATTRIBUTES,
  GL_ACTIVE_UNIFORM_BLOCKS,
  GL_ACTIVE_UNIFORMS,
  GL_COMPILE_STATUS,
  GL_FRAGMENT_SHADER,
  GL_LINK_STATUS,
  GL_UNIFORM_ARRAY_STRIDE,
  GL_UNIFORM_BLOCK_DATA_SIZE,
  GL_UNIFORM_BLOCK_INDEX,
  GL_UNIFORM_IS_ROW_MAJOR,
  GL_UNIFORM_MATRIX_STRIDE,
  GL_UNIFORM_OFFSET,
  GL_UNIFORM_TYPE,
  GL_VERTEX_SHADER,
} from './constants.js';
import { GL2DisposedError, GL2Error, GL2ProgramError } from './errors.js';
import type { GL2State } from './GL2State.js';
import { uniformTypeFromGL } from './mappings.js';
import { numbersEqual, toNumberArray } from '../internal/pure.js';
import type {
  GL2AttributeInfoLike,
  GL2ProgramRef,
  GL2Stats,
  GL2UniformBlockInfo,
  GL2UniformBlockMember,
  GL2UniformInfo,
  GL2Uniforms,
  GL2UniformValue,
} from './types.js';

export type GL2Defines = Readonly<Record<string, string | number | boolean>>;

export function injectGL2Defines(source: string, defines?: GL2Defines): string {
  if (!defines) return source;
  const lines: string[] = [];
  for (const key of Object.keys(defines)) {
    const value = defines[key];
    lines.push(`#define ${key} ${typeof value === 'boolean' ? (value ? '1' : '0') : String(value)}`);
  }
  if (lines.length === 0) return source;
  const header = /^[ \t]*#version[^\n]*\n/.exec(source);
  if (header) {
    const at = header[0].length;
    return `${source.slice(0, at)}${lines.join('\n')}\n${source.slice(at)}`;
  }
  return `${lines.join('\n')}\n${source}`;
}

function uniformComponentCount(type: GL2UniformInfo['type']): number {
  switch (type) {
    case 'vec2': case 'ivec2': case 'uvec2': case 'bvec2': return 2;
    case 'vec3': case 'ivec3': case 'uvec3': case 'bvec3': return 3;
    case 'vec4': case 'ivec4': case 'uvec4': case 'bvec4': return 4;
    case 'mat2': return 4;
    case 'mat3': return 9;
    case 'mat4': return 16;
    default: return 1;
  }
}

function snapshot(value: GL2UniformValue): number | number[] {
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  return toNumberArray(value);
}

function cachedEquals(cached: number | number[], value: GL2UniformValue): boolean {
  if (typeof cached === 'number') {
    if (typeof value === 'number') return cached === value;
    if (typeof value === 'boolean') return cached === (value ? 1 : 0);
    return false;
  }
  if (typeof value === 'number' || typeof value === 'boolean') return false;
  return numbersEqual(cached, value);
}

function asNumbers(value: GL2UniformValue, name: string, expected: number): number[] {
  if (typeof value === 'number') return [value];
  if (typeof value === 'boolean') return [value ? 1 : 0];
  const array = Array.from(value as ArrayLike<number>);
  if (expected > 1 && array.length !== expected) {
    throw new GL2Error(`Uniform "${name}" expects ${expected} numbers but received ${array.length}`);
  }
  if (array.length % expected !== 0) {
    throw new GL2Error(`Uniform "${name}" expects a multiple of ${expected} numbers but received ${array.length}`);
  }
  return array;
}

/**
 * A linked WebGL2 program with:
 *  - deterministic sampler unit assignment,
 *  - uniform block reflection (std140 offsets),
 *  - a per-program uniform value cache (identical values never reach the driver),
 *  - cached uniform block bindings.
 */
export class GL2Program implements GL2ProgramRef {
  readonly handle: WebGLProgram;
  readonly uniforms = new Map<string, GL2UniformInfo>();
  readonly attributes = new Map<string, GL2AttributeInfoLike>();
  readonly uniformBlocks = new Map<string, GL2UniformBlockInfo>();
  readonly missingUniforms = new Set<string>();

  private readonly gl: WebGL2RenderingContext;
  private readonly stats: GL2Stats;
  private readonly state: GL2State;
  private readonly cache = new Map<string, number | number[]>();
  private readonly blockBindings = new Map<string, number>();
  private disposedFlag = false;

  private constructor(gl: WebGL2RenderingContext, stats: GL2Stats, state: GL2State, handle: WebGLProgram) {
    this.gl = gl;
    this.stats = stats;
    this.state = state;
    this.handle = handle;
    this.reflect();
  }

  static create(
    gl: WebGL2RenderingContext,
    stats: GL2Stats,
    state: GL2State,
    vertexSource: string,
    fragmentSource: string,
  ): GL2Program {
    let vs: WebGLShader | null = null;
    let fs: WebGLShader | null = null;
    const compile = (type: number, source: string): WebGLShader => {
      const shader = gl.createShader(type);
      if (!shader) throw new GL2ProgramError('Failed to create shader', '', '');
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      stats.shaderCompiles++;
      stats.glCalls += 2;
      if (!gl.getShaderParameter(shader, GL_COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(shader) ?? '';
        gl.deleteShader(shader);
        stats.glCalls += 2;
        throw new GL2ProgramError(type === GL_VERTEX_SHADER ? 'Vertex shader failed to compile' : 'Fragment shader failed to compile', type === GL_VERTEX_SHADER ? log : '', type === GL_FRAGMENT_SHADER ? log : '');
      }
      return shader;
    };
    try {
      vs = compile(GL_VERTEX_SHADER, vertexSource);
      fs = compile(GL_FRAGMENT_SHADER, fragmentSource);
    } catch (error) {
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      throw error;
    }
    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      throw new GL2ProgramError('Failed to create program', '', '');
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    stats.glCalls += 4;
    if (!gl.getProgramParameter(program, GL_LINK_STATUS)) {
      const log = gl.getProgramInfoLog(program) ?? '';
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      stats.glCalls += 3;
      throw new GL2ProgramError('Program failed to link', '', log);
    }
    // Free the shader objects: the linked program owns the binaries.
    gl.detachShader(program, vs);
    gl.detachShader(program, fs);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    stats.glCalls += 4;
    return new GL2Program(gl, stats, state, program);
  }

  private reflect(): void {
    const gl = this.gl;
    const uniformCount = gl.getProgramParameter(this.handle, GL_ACTIVE_UNIFORMS) as number;
    const indices: number[] = [];
    for (let i = 0; i < uniformCount; i++) indices.push(i);
    const blockIndices = indices.length > 0 ? (gl.getActiveUniforms(this.handle, indices, GL_UNIFORM_BLOCK_INDEX) as Int32Array) : new Int32Array(0);
    const uniformTypes = indices.length > 0 ? (gl.getActiveUniforms(this.handle, indices, GL_UNIFORM_TYPE) as Int32Array) : new Int32Array(0);
    const offsets = indices.length > 0 ? (gl.getActiveUniforms(this.handle, indices, GL_UNIFORM_OFFSET) as Int32Array) : new Int32Array(0);
    const arrayStrides = indices.length > 0 ? (gl.getActiveUniforms(this.handle, indices, GL_UNIFORM_ARRAY_STRIDE) as Int32Array) : new Int32Array(0);
    const matrixStrides = indices.length > 0 ? (gl.getActiveUniforms(this.handle, indices, GL_UNIFORM_MATRIX_STRIDE) as Int32Array) : new Int32Array(0);
    const rowMajors = indices.length > 0 ? (gl.getActiveUniforms(this.handle, indices, GL_UNIFORM_IS_ROW_MAJOR) as Uint8Array) : new Uint8Array(0);

    const blockMembers = new Map<number, GL2UniformBlockMember[]>();
    let samplerUnit = 0;
    for (let i = 0; i < uniformCount; i++) {
      const info = gl.getActiveUniform(this.handle, i);
      if (!info) continue;
      const name = info.name.replace(/\[0\]$/, '');
      const type = uniformTypeFromGL(uniformTypes[i] ?? info.type);
      const blockIndex = blockIndices[i] ?? -1;
      const location = blockIndex >= 0 ? null : gl.getUniformLocation(this.handle, name);
      const textureUnit = type === 'sampler2d' ? samplerUnit++ : -1;
      this.uniforms.set(name, { name, type, size: info.size, location, textureUnit, blockIndex });
      if (blockIndex >= 0) {
        const members = blockMembers.get(blockIndex) ?? [];
        const arrayStride = arrayStrides[i] ?? 0;
        const matrixStride = matrixStrides[i] ?? 0;
        members.push({
          name,
          offset: offsets[i] ?? 0,
          arrayStride: arrayStride > 0 ? arrayStride : null,
          matrixStride: matrixStride > 0 ? matrixStride : null,
          rowMajor: (rowMajors[i] ?? 0) !== 0,
          type,
          size: info.size,
        });
        blockMembers.set(blockIndex, members);
      }
    }

    const attributeCount = gl.getProgramParameter(this.handle, GL_ACTIVE_ATTRIBUTES) as number;
    for (let i = 0; i < attributeCount; i++) {
      const info = gl.getActiveAttrib(this.handle, i);
      if (!info) continue;
      const name = info.name.replace(/\[0\]$/, '');
      const location = gl.getAttribLocation(this.handle, name);
      if (location < 0) continue;
      this.attributes.set(name, { name, location, type: uniformTypeFromGL(info.type), size: info.size });
    }

    const blockCount = gl.getProgramParameter(this.handle, GL_ACTIVE_UNIFORM_BLOCKS) as number;
    for (let index = 0; index < blockCount; index++) {
      const name = gl.getActiveUniformBlockName(this.handle, index) ?? `block${index}`;
      const dataSize = gl.getActiveUniformBlockParameter(this.handle, index, GL_UNIFORM_BLOCK_DATA_SIZE) as number;
      this.uniformBlocks.set(name, {
        name,
        index,
        binding: -1,
        dataSize,
        members: blockMembers.get(index) ?? [],
      });
    }
  }

  get disposed(): boolean {
    return this.disposedFlag;
  }

  use(): void {
    if (this.disposedFlag) throw new GL2DisposedError('GL2Program');
    this.state.useProgram(this.handle);
  }

  textureUnit(name: string): number | undefined {
    const info = this.uniforms.get(name);
    return info && info.type === 'sampler2d' ? info.textureUnit : undefined;
  }

  attributeLocation(name: string): number | undefined {
    return this.attributes.get(name)?.location;
  }

  /**
   * Bind a reflective uniform block to a buffer binding point. Repeated calls
   * with the same binding are free.
   */
  bindUniformBlock(name: string, binding: number): boolean {
    const info = this.uniformBlocks.get(name);
    if (!info) {
      this.stats.uniformBlockSkipped++;
      return false;
    }
    const current = this.blockBindings.get(name);
    if (current === binding) {
      this.stats.uniformBlockSkipped++;
      return true;
    }
    this.gl.uniformBlockBinding(this.handle, info.index, binding);
    this.stats.glCalls++;
    this.stats.uniformBlockBindings++;
    this.blockBindings.set(name, binding);
    return true;
  }

  setUniforms(uniforms: GL2Uniforms): void {
    for (const name of Object.keys(uniforms)) this.setUniform(name, uniforms[name]!);
  }

  setUniform(name: string, value: GL2UniformValue): void {
    if (this.disposedFlag) throw new GL2DisposedError('GL2Program');
    const info = this.uniforms.get(name);
    if (!info || info.location === null) {
      this.missingUniforms.add(name);
      this.stats.uniformSkipped++;
      return;
    }
    const cached = this.cache.get(name);
    if (cached !== undefined && cachedEquals(cached, value)) {
      this.stats.uniformSkipped++;
      return;
    }
    this.write(info, value);
    this.stats.uniformWrites++;
    this.stats.glCalls++;
    this.cache.set(name, snapshot(value));
  }

  private write(info: GL2UniformInfo, value: GL2UniformValue): void {
    const gl = this.gl;
    const location = info.location as WebGLUniformLocation;
    const expected = uniformComponentCount(info.type);
    if (typeof value === 'number' || typeof value === 'boolean') {
      const scalar = typeof value === 'boolean' ? (value ? 1 : 0) : value;
      switch (info.type) {
        case 'float': gl.uniform1f(location, scalar); return;
        case 'int':
        case 'bool':
        case 'sampler2d': gl.uniform1i(location, scalar); return;
        case 'uint': gl.uniform1ui(location, scalar >>> 0); return;
        default: throw new GL2Error(`Uniform "${info.name}" (${info.type}) needs an array of ${expected} numbers`);
      }
    }
    const values = asNumbers(value, info.name, expected);
    switch (info.type) {
      case 'float': gl.uniform1fv(location, values); return;
      case 'int':
      case 'bool':
      case 'sampler2d': gl.uniform1iv(location, values); return;
      case 'uint': gl.uniform1uiv(location, values); return;
      case 'vec2': gl.uniform2fv(location, values); return;
      case 'vec3': gl.uniform3fv(location, values); return;
      case 'vec4': gl.uniform4fv(location, values); return;
      case 'ivec2':
      case 'bvec2': gl.uniform2iv(location, values); return;
      case 'ivec3':
      case 'bvec3': gl.uniform3iv(location, values); return;
      case 'ivec4':
      case 'bvec4': gl.uniform4iv(location, values); return;
      case 'uvec2': gl.uniform2uiv(location, values); return;
      case 'uvec3': gl.uniform3uiv(location, values); return;
      case 'uvec4': gl.uniform4uiv(location, values); return;
      case 'mat2': gl.uniformMatrix2fv(location, false, values); return;
      case 'mat3': gl.uniformMatrix3fv(location, false, values); return;
      case 'mat4': gl.uniformMatrix4fv(location, false, values); return;
      default: throw new GL2Error(`Unsupported uniform type "${info.type}" for "${info.name}"`);
    }
  }

  resetUniformCache(): void {
    this.cache.clear();
    this.blockBindings.clear();
  }

  dispose(): void {
    if (this.disposedFlag) return;
    this.disposedFlag = true;
    this.gl.deleteProgram(this.handle);
    this.stats.glCalls++;
    this.uniforms.clear();
    this.attributes.clear();
    this.uniformBlocks.clear();
    this.cache.clear();
    this.blockBindings.clear();
  }
}

export class GL2ProgramCache {
  private readonly programs = new Map<string, GL2Program>();
  private readonly gl: WebGL2RenderingContext;
  private readonly stats: GL2Stats;
  private readonly state: GL2State;

  constructor(gl: WebGL2RenderingContext, stats: GL2Stats, state: GL2State) {
    this.gl = gl;
    this.stats = stats;
    this.state = state;
  }

  get size(): number {
    return this.programs.size;
  }

  get(vertexSource: string, fragmentSource: string, defines?: GL2Defines): GL2Program {
    const vs = injectGL2Defines(vertexSource, defines);
    const fs = injectGL2Defines(fragmentSource, defines);
    const key = `${vs}\u0000${fs}`;
    const existing = this.programs.get(key);
    if (existing) {
      this.stats.programsReused++;
      return existing;
    }
    const program = GL2Program.create(this.gl, this.stats, this.state, vs, fs);
    this.programs.set(key, program);
    this.stats.programsCreated++;
    return program;
  }

  *values(): IterableIterator<GL2Program> {
    yield* this.programs.values();
  }

  clear(): void {
    for (const program of this.programs.values()) program.dispose();
    this.programs.clear();
  }
}
