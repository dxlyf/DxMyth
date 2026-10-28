import { GL1DisposedError, GL1Error, GL1ProgramError } from './errors.js';
import { GL_ACTIVE_ATTRIBUTES, GL_ACTIVE_UNIFORMS, GL_COMPILE_STATUS, GL_FRAGMENT_SHADER, GL_LINK_STATUS, GL_VERTEX_SHADER } from './constants.js';
import type { GL1State } from './GL1State.js';
import { uniformTypeFromGL } from './mappings.js';
import { numbersEqual, toNumberArray } from '../internal/pure.js';
import type {
  GL1AttributeInfo,
  GL1ProgramRef,
  GL1Stats,
  GL1UniformInfo,
  GL1UniformValue,
  GL1Uniforms,
} from './types.js';

export type GL1Defines = Readonly<Record<string, string | number | boolean>>;

export function injectGL1Defines(source: string, defines?: GL1Defines): string {
  if (!defines) return source;
  const lines: string[] = [];
  for (const key of Object.keys(defines)) {
    const value = defines[key];
    const text = typeof value === 'boolean' ? (value ? '1' : '0') : String(value);
    lines.push(`#define ${key} ${text}`);
  }
  if (lines.length === 0) return source;
  const header = /^[ \t]*#version[^\n]*\n/.exec(source);
  if (header) {
    const at = header[0].length;
    return `${source.slice(0, at)}${lines.join('\n')}\n${source.slice(at)}`;
  }
  return `${lines.join('\n')}\n${source}`;
}

function uniformCount(type: GL1UniformInfo['type']): number {
  switch (type) {
    case 'vec2': case 'ivec2': case 'bvec2': return 2;
    case 'vec3': case 'ivec3': case 'bvec3': return 3;
    case 'vec4': case 'ivec4': case 'bvec4': return 4;
    case 'mat2': return 4;
    case 'mat3': return 9;
    case 'mat4': return 16;
    default: return 1;
  }
}

function snapshot(value: GL1UniformValue): number | number[] {
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  return toNumberArray(value);
}

function cachedEquals(cached: number | number[], value: GL1UniformValue): boolean {
  if (typeof cached === 'number') {
    return typeof value === 'number' ? cached === value : typeof value === 'boolean' ? cached === (value ? 1 : 0) : false;
  }
  if (typeof value === 'number' || typeof value === 'boolean') return false;
  return numbersEqual(cached, value);
}

function asNumbers(value: GL1UniformValue, name: string, expected: number): number[] {
  if (typeof value === 'number') return [value];
  if (typeof value === 'boolean') return [value ? 1 : 0];
  const array = Array.from(value as ArrayLike<number>);
  if (expected > 1 && array.length !== expected) {
    throw new GL1Error(`Uniform "${name}" expects ${expected} numbers but received ${array.length}`);
  }
  if (array.length % expected !== 0) {
    throw new GL1Error(`Uniform "${name}" expects a multiple of ${expected} numbers but received ${array.length}`);
  }
  return array;
}

/**
 * A linked WebGL1 program with reflection-driven uniform dispatch and a
 * per-program uniform value cache. Re-setting an identical value is free.
 */
export class GL1Program implements GL1ProgramRef {
  readonly handle: WebGLProgram;
  readonly uniforms = new Map<string, GL1UniformInfo>();
  readonly attributes = new Map<string, GL1AttributeInfo>();
  /** Uniforms that exist in the source but were optimised out by the driver. */
  readonly missingUniforms = new Set<string>();

  private readonly gl: WebGLRenderingContext;
  private readonly stats: GL1Stats;
  private readonly state: GL1State;
  private readonly cache = new Map<string, number | number[]>();
  private disposedFlag = false;

  private constructor(gl: WebGLRenderingContext, stats: GL1Stats, state: GL1State, handle: WebGLProgram) {
    this.gl = gl;
    this.stats = stats;
    this.state = state;
    this.handle = handle;
    this.reflect();
  }

  static create(
    gl: WebGLRenderingContext,
    stats: GL1Stats,
    state: GL1State,
    vertexSource: string,
    fragmentSource: string,
  ): GL1Program {
    let vsShader: WebGLShader | null = null;
    let fsShader: WebGLShader | null = null;
    const compile = (type: number, source: string): WebGLShader => {
      const shader = gl.createShader(type);
      if (!shader) throw new GL1ProgramError('Failed to create shader', '', '');
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      stats.shaderCompiles++;
      stats.glCalls += 2;
      if (!gl.getShaderParameter(shader, GL_COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(shader) ?? '';
        gl.deleteShader(shader);
        stats.glCalls += 2;
        throw new GL1ProgramError(
          type === GL_VERTEX_SHADER ? 'Vertex shader failed to compile' : 'Fragment shader failed to compile',
          type === GL_VERTEX_SHADER ? log : '',
          type === GL_FRAGMENT_SHADER ? log : '',
        );
      }
      return shader;
    };

    try {
      vsShader = compile(GL_VERTEX_SHADER, vertexSource);
      fsShader = compile(GL_FRAGMENT_SHADER, fragmentSource);
    } catch (error) {
      if (vsShader) gl.deleteShader(vsShader);
      if (fsShader) gl.deleteShader(fsShader);
      throw error;
    }
    const vertexShader = vsShader;
    const fragmentShader = fsShader;

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      throw new GL1ProgramError('Failed to create program', '', '');
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    stats.glCalls += 4;
    if (!gl.getProgramParameter(program, GL_LINK_STATUS)) {
      const log = gl.getProgramInfoLog(program) ?? '';
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      stats.glCalls += 3;
      throw new GL1ProgramError('Program failed to link', '', log);
    }
    // The linked program keeps the compiled binaries alive; dropping the shader
    // objects immediately avoids holding a second set of GPU resources.
    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    stats.glCalls += 4;
    return new GL1Program(gl, stats, state, program);
  }

  private reflect(): void {
    const gl = this.gl;
    const uniformCountValue = gl.getProgramParameter(this.handle, GL_ACTIVE_UNIFORMS) as number;
    let samplerUnit = 0;
    for (let i = 0; i < uniformCountValue; i++) {
      const info = gl.getActiveUniform(this.handle, i);
      if (!info) continue;
      const name = info.name.replace(/\[0\]$/, '');
      const type = uniformTypeFromGL(info.type);
      const location = gl.getUniformLocation(this.handle, name);
      const textureUnit = type === 'sampler2d' ? samplerUnit++ : -1;
      this.uniforms.set(name, { name, type, size: info.size, location, textureUnit });
    }
    const attributeCount = gl.getProgramParameter(this.handle, GL_ACTIVE_ATTRIBUTES) as number;
    for (let i = 0; i < attributeCount; i++) {
      const info = gl.getActiveAttrib(this.handle, i);
      if (!info) continue;
      const name = info.name.replace(/\[0\]$/, '');
      const location = gl.getAttribLocation(this.handle, name);
      if (location < 0) continue;
      this.attributes.set(name, { name, type: uniformTypeFromGL(info.type), size: info.size, location });
    }
  }

  get disposed(): boolean {
    return this.disposedFlag;
  }

  use(): void {
    if (this.disposedFlag) throw new GL1DisposedError('GL1Program');
    this.state.useProgram(this.handle);
  }

  textureUnit(name: string): number | undefined {
    const info = this.uniforms.get(name);
    return info && info.type === 'sampler2d' ? info.textureUnit : undefined;
  }

  attributeLocation(name: string): number | undefined {
    return this.attributes.get(name)?.location;
  }

  setUniforms(uniforms: GL1Uniforms): void {
    for (const name of Object.keys(uniforms)) {
      this.setUniform(name, uniforms[name]!);
    }
  }

  setUniform(name: string, value: GL1UniformValue): void {
    if (this.disposedFlag) throw new GL1DisposedError('GL1Program');
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

  private write(info: GL1UniformInfo, value: GL1UniformValue): void {
    const gl = this.gl;
    const location = info.location as WebGLUniformLocation;
    const expected = uniformCount(info.type);
    if (typeof value === 'number' || typeof value === 'boolean') {
      const scalar = typeof value === 'boolean' ? (value ? 1 : 0) : value;
      switch (info.type) {
        case 'float':
          gl.uniform1f(location, scalar);
          return;
        case 'int':
        case 'bool':
        case 'sampler2d':
          gl.uniform1i(location, scalar);
          return;
        default:
          throw new GL1Error(`Uniform "${info.name}" (${info.type}) needs an array of ${expected} numbers`);
      }
    }
    const values = asNumbers(value, info.name, expected);
    switch (info.type) {
      case 'float': gl.uniform1fv(location, values); return;
      case 'int':
      case 'bool':
      case 'sampler2d': gl.uniform1iv(location, values); return;
      case 'vec2': gl.uniform2fv(location, values); return;
      case 'vec3': gl.uniform3fv(location, values); return;
      case 'vec4': gl.uniform4fv(location, values); return;
      case 'ivec2':
      case 'bvec2': gl.uniform2iv(location, values); return;
      case 'ivec3':
      case 'bvec3': gl.uniform3iv(location, values); return;
      case 'ivec4':
      case 'bvec4': gl.uniform4iv(location, values); return;
      case 'mat2': gl.uniformMatrix2fv(location, false, values); return;
      case 'mat3': gl.uniformMatrix3fv(location, false, values); return;
      case 'mat4': gl.uniformMatrix4fv(location, false, values); return;
      default:
        throw new GL1Error(`Unsupported uniform type "${info.type}" for "${info.name}"`);
    }
  }

  /** Force the next setUniform() of every uniform to reach the driver. */
  resetUniformCache(): void {
    this.cache.clear();
  }

  dispose(): void {
    if (this.disposedFlag) return;
    this.disposedFlag = true;
    this.gl.deleteProgram(this.handle);
    this.stats.glCalls++;
    this.uniforms.clear();
    this.attributes.clear();
    this.cache.clear();
  }
}

/** Compiles each (vertex, fragment, defines) combination at most once. */
export class GL1ProgramCache {
  private readonly programs = new Map<string, GL1Program>();
  private readonly gl: WebGLRenderingContext;
  private readonly stats: GL1Stats;
  private readonly state: GL1State;

  constructor(gl: WebGLRenderingContext, stats: GL1Stats, state: GL1State) {
    this.gl = gl;
    this.stats = stats;
    this.state = state;
  }

  get size(): number {
    return this.programs.size;
  }

  get(vertexSource: string, fragmentSource: string, defines?: GL1Defines): GL1Program {
    const vs = injectGL1Defines(vertexSource, defines);
    const fs = injectGL1Defines(fragmentSource, defines);
    const key = `${vs}\u0000${fs}`;
    const existing = this.programs.get(key);
    if (existing) {
      this.stats.programsReused++;
      return existing;
    }
    const program = GL1Program.create(this.gl, this.stats, this.state, vs, fs);
    this.programs.set(key, program);
    this.stats.programsCreated++;
    return program;
  }

  has(vertexSource: string, fragmentSource: string, defines?: GL1Defines): boolean {
    const vs = injectGL1Defines(vertexSource, defines);
    const fs = injectGL1Defines(fragmentSource, defines);
    return this.programs.has(`${vs}\u0000${fs}`);
  }

  *values(): IterableIterator<GL1Program> {
    yield* this.programs.values();
  }

  /** Drops every cached program and invalidates cached uniform values. */
  clear(): void {
    for (const program of this.programs.values()) program.dispose();
    this.programs.clear();
  }
}
