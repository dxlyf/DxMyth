import { GLUniformError } from './errors.js';
import { uniformComponents, type GL, type GLUniformType } from './enums.js';

export type UniformValue = number | boolean | readonly number[] | Float32Array | Int32Array | Uint32Array;

export interface UniformTarget {
  readonly name: string;
  readonly type: GLUniformType;
  readonly size: number;
  readonly location: WebGLUniformLocation;
}

function isTyped(value: UniformValue): value is Float32Array | Int32Array | Uint32Array {
  return value instanceof Float32Array || value instanceof Int32Array || value instanceof Uint32Array;
}

function describe(value: UniformValue): string {
  if (typeof value === 'number' || typeof value === 'boolean') return `scalar ${String(value)}`;
  if (isTyped(value)) return `${value.constructor.name}(${value.length})`;
  return `array(${value.length})`;
}

function toFloatArray(value: UniformValue): Float32Array | readonly number[] | number[] {
  if (typeof value === 'number') return [value];
  if (typeof value === 'boolean') return [value ? 1 : 0];
  return value as Float32Array | readonly number[];
}

function toIntArray(value: UniformValue): Int32Array | readonly number[] | number[] {
  if (typeof value === 'number') return [value | 0];
  if (typeof value === 'boolean') return [value ? 1 : 0];
  if (value instanceof Int32Array) return value;
  const out: number[] = [];
  for (const item of value) out.push(item | 0);
  return out;
}

function toUintArray(value: UniformValue): Uint32Array | readonly number[] | number[] {
  if (typeof value === 'number') return [value >>> 0];
  if (typeof value === 'boolean') return [value ? 1 : 0];
  if (value instanceof Uint32Array) return value;
  const out: number[] = [];
  for (const item of value) out.push(item >>> 0);
  return out;
}

function scalarOf(value: UniformValue): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  const first = value[0];
  if (first === undefined) {
    throw new GLUniformError('<scalar>', 'a number', describe(value));
  }
  return first;
}

function checkLength(target: UniformTarget, value: UniformValue, expected: number): void {
  if (typeof value === 'number' || typeof value === 'boolean') {
    if (expected !== 1) {
      throw new GLUniformError(target.name, `${expected} values for ${target.type}[${target.size}]`, describe(value));
    }
    return;
  }
  if (value.length !== expected) {
    throw new GLUniformError(
      target.name,
      `${expected} values for ${target.type}[${target.size}]`,
      describe(value),
    );
  }
}

/** Uploads one uniform. Returns the number of payload bytes. */
export function setUniformValue(
  gl: GL,
  version: 1 | 2,
  target: UniformTarget,
  value: UniformValue,
): number {
  const { location, type, size } = target;
  const components = uniformComponents(type);

  switch (type) {
    case 'f32':
      gl.uniform1f(location, scalarOf(value));
      return 4;
    case 'vec2f':
    case 'vec3f':
    case 'vec4f': {
      const expected = components * size;
      checkLength(target, value, expected);
      const data = toFloatArray(value);
      if (type === 'vec2f') gl.uniform2fv(location, data as Float32List);
      else if (type === 'vec3f') gl.uniform3fv(location, data as Float32List);
      else gl.uniform4fv(location, data as Float32List);
      return expected * 4;
    }
    case 'i32':
      gl.uniform1i(location, scalarOf(value) | 0);
      return 4;
    case 'vec2i':
    case 'vec3i':
    case 'vec4i': {
      if (version === 1) {
        throw new GLUniformError(target.name, 'integer vectors require WebGL2', 'WebGL1 context');
      }
      const expected = components * size;
      checkLength(target, value, expected);
      const gl2 = gl as WebGL2RenderingContext;
      const data = toIntArray(value);
      if (type === 'vec2i') gl2.uniform2iv(location, data as Int32List);
      else if (type === 'vec3i') gl2.uniform3iv(location, data as Int32List);
      else gl2.uniform4iv(location, data as Int32List);
      return expected * 4;
    }
    case 'u32':
      if (version === 1) throw new GLUniformError(target.name, 'uint uniforms require WebGL2', 'WebGL1 context');
      (gl as WebGL2RenderingContext).uniform1ui(location, scalarOf(value) >>> 0);
      return 4;
    case 'vec2u':
    case 'vec3u':
    case 'vec4u': {
      if (version === 1) {
        throw new GLUniformError(target.name, 'uint vectors require WebGL2', 'WebGL1 context');
      }
      const expected = components * size;
      checkLength(target, value, expected);
      const gl2 = gl as WebGL2RenderingContext;
      const data = toUintArray(value);
      if (type === 'vec2u') gl2.uniform2uiv(location, data as Uint32List);
      else if (type === 'vec3u') gl2.uniform3uiv(location, data as Uint32List);
      else gl2.uniform4uiv(location, data as Uint32List);
      return expected * 4;
    }
    case 'mat2':
    case 'mat3':
    case 'mat4': {
      const expected = components * size;
      checkLength(target, value, expected);
      const data = toFloatArray(value) as Float32List;
      if (type === 'mat2') gl.uniformMatrix2fv(location, false, data);
      else if (type === 'mat3') gl.uniformMatrix3fv(location, false, data);
      else gl.uniformMatrix4fv(location, false, data);
      return expected * 4;
    }
    default:
      throw new GLUniformError(target.name, 'a non-sampler uniform', describe(value));
  }
}

export function uniformByteSize(type: GLUniformType, size: number): number {
  return uniformComponents(type) * size * 4;
}
