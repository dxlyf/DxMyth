/**
 * Per-type uniform setters.
 *
 * Each setter keeps a cache of the values it last uploaded and returns without
 * touching GL when nothing changed, which is what makes a frame that re-uploads
 * the same material essentially free.
 *
 * The setters are defined as free functions (rather than methods on the uniform
 * classes) for the same reason three.js does it: they are called through a
 * single assigned reference, so the engine can keep them monomorphic.
 *
 * The `type` constants are hard-coded rather than read from the context so the
 * dispatch tables work on a WebGL1 context, where several of the WebGL2 enum
 * names (`SAMPLER_2D_SHADOW`, `SAMPLER_2D_ARRAY`, 鈥? do not exist.
 */
import type { GL } from './GLTypes';

/** A uniform node's mutable state, as seen by the setters. */
export interface SetterTarget {
  /** `gl.getUniformLocation()` result; never null for a reflected uniform. */
  addr: WebGLUniformLocation;
  /** Last uploaded values, indexed the same way the setter writes them. */
  cache: number[];
  /** Element count for array uniforms (`activeInfo.size`). */
  size: number;
  /** GL type constant, needed by samplers to pick the fallback texture. */
  type: number;
}

/** The context plus whatever the setters need to bind textures. */
export interface SetterContext {
  gl: GL;
  /** Callbacks used by the sampler setters. */
  textures: UniformTextureBinder;
}

/**
 * What a sampler setter calls back into. Implemented by `WebGLTextures`; the
 * interface keeps this module free of a dependency on the texture cache.
 */
export interface UniformTextureBinder {
  /** Reserves the next free texture unit. */
  allocateTextureUnit(): number;
  /** Binds `texture` (or a 1x1 fallback) to `unit`. */
  bind(
    texture: unknown,
    unit: number,
    kind: '2d' | 'cube' | '3d' | '2d-array',
    isNormalMap: boolean,
  ): void;
}

/** GL enum values used by the dispatch tables. */
const GL_FLOAT = 0x1406;
const GL_FLOAT_VEC2 = 0x8b50;
const GL_FLOAT_VEC3 = 0x8b51;
const GL_FLOAT_VEC4 = 0x8b52;
const GL_INT = 0x1404;
const GL_BOOL = 0x8b56;
const GL_INT_VEC2 = 0x8b53;
const GL_INT_VEC3 = 0x8b54;
const GL_INT_VEC4 = 0x8b55;
const GL_UNSIGNED_INT = 0x1405;
const GL_FLOAT_MAT2 = 0x8b5a;
const GL_FLOAT_MAT3 = 0x8b5b;
const GL_FLOAT_MAT4 = 0x8b5c;
const GL_SAMPLER_2D = 0x8b5e;
const GL_SAMPLER_CUBE = 0x8b60;
const GL_SAMPLER_3D = 0x8b5f;
const GL_SAMPLER_2D_ARRAY = 0x8dc1;
const GL_SAMPLER_2D_SHADOW = 0x8b62;
const GL_SAMPLER_CUBE_SHADOW = 0x8dc5;
const GL_SAMPLER_2D_ARRAY_SHADOW = 0x8dc4;
const GL_SAMPLER_EXTERNAL_OES = 0x8d66;
const GL_INT_SAMPLER_2D = 0x8dca;
const GL_UNSIGNED_INT_SAMPLER_2D = 0x8dd2;
const GL_INT_SAMPLER_3D = 0x8dcb;
const GL_UNSIGNED_INT_SAMPLER_3D = 0x8dd3;
const GL_INT_SAMPLER_CUBE = 0x8dcc;
const GL_UNSIGNED_INT_SAMPLER_CUBE = 0x8dd4;
const GL_INT_SAMPLER_2D_ARRAY = 0x8dcf;
const GL_UNSIGNED_INT_SAMPLER_2D_ARRAY = 0x8dd7;

// ------------------------------------------------------------- array caches --

/** Shared scratch arrays, keyed by length, so uploads allocate nothing. */
const arrayCacheF32: Float32Array[] = [];
const arrayCacheI32: Int32Array[] = [];

/**
 * Flattens `array` of `VectorN`/`MatrixN`-like objects into a `Float32Array`.
 * A flat numeric array is returned as-is, which is the common case for the
 * library's packed light arrays.
 */
function flatten(array: unknown, nBlocks: number, blockSize: number): Float32Array | ArrayLike<number> {
  const source = array as ArrayLike<unknown>;
  const first = source[0] as { toArray?: (target: number[], offset: number) => void } | number;

  if (typeof first === 'number') return source as ArrayLike<number>;
  const n = nBlocks * blockSize;
  let scratch = arrayCacheF32[n];
  if (scratch === undefined) {
    scratch = new Float32Array(n);
    arrayCacheF32[n] = scratch;
  }
  if (nBlocks !== 0 && first && typeof first.toArray === 'function') {
    (first.toArray as unknown as (target: Float32Array, offset: number) => void)(scratch, 0);
    for (let i = 1, offset = 0; i !== nBlocks; i++) {
      offset += blockSize;
      const element = source[i] as { toArray(t: Float32Array, o: number): void };
      element.toArray(scratch, offset);
    }
  }
  return scratch;
}

function arraysEqual(a: ArrayLike<number>, b: ArrayLike<number>): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function copyArray(target: number[], source: ArrayLike<number>): void {
  for (let i = 0, l = source.length; i < l; i++) target[i] = source[i];
  // A cache array starts empty, so its length must be set explicitly: the
  // `arraysEqual` guard compares lengths, and an index-only write would leave it
  // at 0 and never match.
  target.length = source.length;
}

/** Reserves `n` consecutive texture units. */
function allocTexUnits(textures: UniformTextureBinder, n: number): Int32Array {
  let units = arrayCacheI32[n];
  if (units === undefined) {
    units = new Int32Array(n);
    arrayCacheI32[n] = units;
  }
  for (let i = 0; i !== n; i++) units[i] = textures.allocateTextureUnit();
  return units;
}

// ---------------------------------------------------------------- scalars ---

function setValueV1f(this: SetterTarget, ctx: SetterContext, v: number): void {
  if (this.cache[0] === v) return;
  ctx.gl.uniform1f(this.addr, v);
  this.cache[0] = v;
}

function setValueV2f(this: SetterTarget, ctx: SetterContext, v: never): void {
  const value = v as unknown as { x?: number; y?: number } & ArrayLike<number>;
  const cache = this.cache;
  if (value.x !== undefined) {
    if (cache[0] === value.x && cache[1] === value.y) return;
    ctx.gl.uniform2f(this.addr, value.x, value.y as number);
    cache[0] = value.x;
    cache[1] = value.y as number;
  } else {
    if (arraysEqual(cache, value)) return;
    ctx.gl.uniform2fv(this.addr, value as Float32List);
    copyArray(cache, value);
  }
}

function setValueV3f(this: SetterTarget, ctx: SetterContext, v: never): void {
  const value = v as unknown as {
    x?: number;
    y?: number;
    z?: number;
    r?: number;
    g?: number;
    b?: number;
  } & ArrayLike<number>;
  const cache = this.cache;
  if (value.x !== undefined) {
    if (cache[0] === value.x && cache[1] === value.y && cache[2] === value.z) return;
    ctx.gl.uniform3f(this.addr, value.x, value.y as number, value.z as number);
    cache[0] = value.x;
    cache[1] = value.y as number;
    cache[2] = value.z as number;
  } else if (value.r !== undefined) {
    // `Color` and anything else with r/g/b channels.
    if (cache[0] === value.r && cache[1] === value.g && cache[2] === value.b) return;
    ctx.gl.uniform3f(this.addr, value.r, value.g as number, value.b as number);
    cache[0] = value.r;
    cache[1] = value.g as number;
    cache[2] = value.b as number;
  } else {
    if (arraysEqual(cache, value)) return;
    ctx.gl.uniform3fv(this.addr, value as Float32List);
    copyArray(cache, value);
  }
}

function setValueV4f(this: SetterTarget, ctx: SetterContext, v: never): void {
  const value = v as unknown as { x?: number; y?: number; z?: number; w?: number } & ArrayLike<number>;
  const cache = this.cache;
  if (value.x !== undefined) {
    if (cache[0] === value.x && cache[1] === value.y && cache[2] === value.z && cache[3] === value.w) {
      return;
    }
    ctx.gl.uniform4f(this.addr, value.x, value.y as number, value.z as number, value.w as number);
    cache[0] = value.x;
    cache[1] = value.y as number;
    cache[2] = value.z as number;
    cache[3] = value.w as number;
  } else {
    if (arraysEqual(cache, value)) return;
    ctx.gl.uniform4fv(this.addr, value as Float32List);
    copyArray(cache, value);
  }
}

function setValueV1i(this: SetterTarget, ctx: SetterContext, v: number | boolean): void {
  const value = typeof v === 'boolean' ? (v ? 1 : 0) : v;
  if (this.cache[0] === value) return;
  ctx.gl.uniform1i(this.addr, value);
  this.cache[0] = value;
}

function setValueV2i(this: SetterTarget, ctx: SetterContext, v: never): void {
  const value = v as unknown as { x?: number; y?: number } & ArrayLike<number>;
  const cache = this.cache;
  if (value.x !== undefined) {
    if (cache[0] === value.x && cache[1] === value.y) return;
    ctx.gl.uniform2i(this.addr, value.x, value.y as number);
    cache[0] = value.x;
    cache[1] = value.y as number;
  } else {
    if (arraysEqual(cache, value)) return;
    ctx.gl.uniform2iv(this.addr, value as Int32List);
    copyArray(cache, value);
  }
}

function setValueV3i(this: SetterTarget, ctx: SetterContext, v: never): void {
  const value = v as unknown as { x?: number; y?: number; z?: number } & ArrayLike<number>;
  const cache = this.cache;
  if (value.x !== undefined) {
    if (cache[0] === value.x && cache[1] === value.y && cache[2] === value.z) return;
    ctx.gl.uniform3i(this.addr, value.x, value.y as number, value.z as number);
    cache[0] = value.x;
    cache[1] = value.y as number;
    cache[2] = value.z as number;
  } else {
    if (arraysEqual(cache, value)) return;
    ctx.gl.uniform3iv(this.addr, value as Int32List);
    copyArray(cache, value);
  }
}

function setValueV4i(this: SetterTarget, ctx: SetterContext, v: never): void {
  const value = v as unknown as { x?: number; y?: number; z?: number; w?: number } & ArrayLike<number>;
  const cache = this.cache;
  if (value.x !== undefined) {
    if (cache[0] === value.x && cache[1] === value.y && cache[2] === value.z && cache[3] === value.w) {
      return;
    }
    ctx.gl.uniform4i(this.addr, value.x, value.y as number, value.z as number, value.w as number);
    cache[0] = value.x;
    cache[1] = value.y as number;
    cache[2] = value.z as number;
    cache[3] = value.w as number;
  } else {
    if (arraysEqual(cache, value)) return;
    ctx.gl.uniform4iv(this.addr, value as Int32List);
    copyArray(cache, value);
  }
}

// --------------------------------------------------------------- matrices ---

function setValueM2(this: SetterTarget, ctx: SetterContext, v: never): void {
  const value = v as unknown as { elements?: ArrayLike<number> } & ArrayLike<number>;
  const cache = this.cache;
  const elements = value.elements;
  if (elements === undefined) {
    if (arraysEqual(cache, value)) return;
    ctx.gl.uniformMatrix2fv(this.addr, false, value as Float32List);
    copyArray(cache, value);
  } else {
    if (arraysEqual(cache, elements)) return;
    ctx.gl.uniformMatrix2fv(this.addr, false, elements as Float32List);
    copyArray(cache, elements);
  }
}

function setValueM3(this: SetterTarget, ctx: SetterContext, v: never): void {
  const value = v as unknown as { elements?: ArrayLike<number> } & ArrayLike<number>;
  const cache = this.cache;
  const elements = value.elements;
  if (elements === undefined) {
    if (arraysEqual(cache, value)) return;
    ctx.gl.uniformMatrix3fv(this.addr, false, value as Float32List);
    copyArray(cache, value);
  } else {
    if (arraysEqual(cache, elements)) return;
    ctx.gl.uniformMatrix3fv(this.addr, false, elements as Float32List);
    copyArray(cache, elements);
  }
}

function setValueM4(this: SetterTarget, ctx: SetterContext, v: never): void {
  const value = v as unknown as { elements?: ArrayLike<number> } & ArrayLike<number>;
  const cache = this.cache;
  const elements = value.elements;
  if (elements === undefined) {
    if (arraysEqual(cache, value)) return;
    ctx.gl.uniformMatrix4fv(this.addr, false, value as Float32List);
    copyArray(cache, value);
  } else {
    if (arraysEqual(cache, elements)) return;
    ctx.gl.uniformMatrix4fv(this.addr, false, elements as Float32List);
    copyArray(cache, elements);
  }
}

// -------------------------------------------------------------- samplers ---

/** `true` when the sampler reads a cube map. */
function isCubeSampler(type: number): boolean {
  return (
    type === GL_SAMPLER_CUBE ||
    type === GL_INT_SAMPLER_CUBE ||
    type === GL_UNSIGNED_INT_SAMPLER_CUBE ||
    type === GL_SAMPLER_CUBE_SHADOW
  );
}

function is3DSampler(type: number): boolean {
  return type === GL_SAMPLER_3D || type === GL_INT_SAMPLER_3D || type === GL_UNSIGNED_INT_SAMPLER_3D;
}

function is2DArraySampler(type: number): boolean {
  return (
    type === GL_SAMPLER_2D_ARRAY ||
    type === GL_INT_SAMPLER_2D_ARRAY ||
    type === GL_UNSIGNED_INT_SAMPLER_2D_ARRAY ||
    type === GL_SAMPLER_2D_ARRAY_SHADOW
  );
}

function samplerKind(type: number): '2d' | 'cube' | '3d' | '2d-array' {
  if (isCubeSampler(type)) return 'cube';
  if (is3DSampler(type)) return '3d';
  if (is2DArraySampler(type)) return '2d-array';
  return '2d';
}

/**
 * A single texture. The unit is allocated on every upload (the renderer resets
 * its allocator per program bind), and the `uniform1i` call is skipped when the
 * unit did not change.
 */
function setValueT1(
  this: SetterTarget,
  ctx: SetterContext,
  v: unknown,
  isNormalMap: boolean,
): void {
  const unit = ctx.textures.allocateTextureUnit();
  if (this.cache[0] !== unit) {
    ctx.gl.uniform1i(this.addr, unit);
    this.cache[0] = unit;
  }
  ctx.textures.bind(v, unit, '2d', isNormalMap);
}

function setValueT6(
  this: SetterTarget,
  ctx: SetterContext,
  v: unknown,
  isNormalMap: boolean,
): void {
  const unit = ctx.textures.allocateTextureUnit();
  if (this.cache[0] !== unit) {
    ctx.gl.uniform1i(this.addr, unit);
    this.cache[0] = unit;
  }
  ctx.textures.bind(v, unit, 'cube', isNormalMap);
}

function setValueT3D1(
  this: SetterTarget,
  ctx: SetterContext,
  v: unknown,
  isNormalMap: boolean,
): void {
  const unit = ctx.textures.allocateTextureUnit();
  if (this.cache[0] !== unit) {
    ctx.gl.uniform1i(this.addr, unit);
    this.cache[0] = unit;
  }
  ctx.textures.bind(v, unit, '3d', isNormalMap);
}

function setValueT2DArray1(
  this: SetterTarget,
  ctx: SetterContext,
  v: unknown,
  isNormalMap: boolean,
): void {
  const unit = ctx.textures.allocateTextureUnit();
  if (this.cache[0] !== unit) {
    ctx.gl.uniform1i(this.addr, unit);
    this.cache[0] = unit;
  }
  ctx.textures.bind(v, unit, '2d-array', isNormalMap);
}

// ------------------------------------------------------------- pure arrays --

function setValueV1fArray(this: SetterTarget, ctx: SetterContext, v: ArrayLike<number>): void {
  ctx.gl.uniform1fv(this.addr, v as Float32List);
}

function setValueV2fArray(this: SetterTarget, ctx: SetterContext, v: never): void {
  ctx.gl.uniform2fv(this.addr, flatten(v, this.size, 2) as Float32List);
}

function setValueV3fArray(this: SetterTarget, ctx: SetterContext, v: never): void {
  ctx.gl.uniform3fv(this.addr, flatten(v, this.size, 3) as Float32List);
}

function setValueV4fArray(this: SetterTarget, ctx: SetterContext, v: never): void {
  ctx.gl.uniform4fv(this.addr, flatten(v, this.size, 4) as Float32List);
}

function setValueM2Array(this: SetterTarget, ctx: SetterContext, v: never): void {
  ctx.gl.uniformMatrix2fv(this.addr, false, flatten(v, this.size, 4) as Float32List);
}

function setValueM3Array(this: SetterTarget, ctx: SetterContext, v: never): void {
  ctx.gl.uniformMatrix3fv(this.addr, false, flatten(v, this.size, 9) as Float32List);
}

function setValueM4Array(this: SetterTarget, ctx: SetterContext, v: never): void {
  ctx.gl.uniformMatrix4fv(this.addr, false, flatten(v, this.size, 16) as Float32List);
}

function setValueV1iArray(this: SetterTarget, ctx: SetterContext, v: ArrayLike<number>): void {
  ctx.gl.uniform1iv(this.addr, v as Int32List);
}

function setValueV2iArray(this: SetterTarget, ctx: SetterContext, v: ArrayLike<number>): void {
  ctx.gl.uniform2iv(this.addr, v as Int32List);
}

function setValueV3iArray(this: SetterTarget, ctx: SetterContext, v: ArrayLike<number>): void {
  ctx.gl.uniform3iv(this.addr, v as Int32List);
}

function setValueV4iArray(this: SetterTarget, ctx: SetterContext, v: ArrayLike<number>): void {
  ctx.gl.uniform4iv(this.addr, v as Int32List);
}

/** An array of samplers binds one texture per element, in consecutive units. */
function setValueT1Array(this: SetterTarget, ctx: SetterContext, v: unknown[]): void {
  const n = v.length;
  const units = allocTexUnits(ctx.textures, n);
  if (!arraysEqual(this.cache, units)) {
    ctx.gl.uniform1iv(this.addr, units as Int32List);
    copyArray(this.cache, units);
  }
  for (let i = 0; i !== n; i++) ctx.textures.bind(v[i], units[i], '2d', false);
}

function setValueT6Array(this: SetterTarget, ctx: SetterContext, v: unknown[]): void {
  const n = v.length;
  const units = allocTexUnits(ctx.textures, n);
  if (!arraysEqual(this.cache, units)) {
    ctx.gl.uniform1iv(this.addr, units as Int32List);
    copyArray(this.cache, units);
  }
  for (let i = 0; i !== n; i++) ctx.textures.bind(v[i], units[i], 'cube', false);
}

// -------------------------------------------------------------- dispatch ---

/** A setter takes the context, the value, and whether it is a normal map. */
export type UniformSetter = (
  this: SetterTarget,
  ctx: SetterContext,
  value: never,
  isNormalMap: boolean,
) => void;

/** Singular (non-array) uniform setter for a GL type, or `undefined`. */
export function getSingularSetter(type: number): UniformSetter | undefined {
  switch (type) {
    case GL_FLOAT:
      return setValueV1f as UniformSetter;
    case GL_FLOAT_VEC2:
      return setValueV2f as UniformSetter;
    case GL_FLOAT_VEC3:
      return setValueV3f as UniformSetter;
    case GL_FLOAT_VEC4:
      return setValueV4f as UniformSetter;
    case GL_FLOAT_MAT2:
      return setValueM2 as UniformSetter;
    case GL_FLOAT_MAT3:
      return setValueM3 as UniformSetter;
    case GL_FLOAT_MAT4:
      return setValueM4 as UniformSetter;
    case GL_INT:
    case GL_BOOL:
      return setValueV1i as UniformSetter;
    case GL_INT_VEC2:
      return setValueV2i as UniformSetter;
    case GL_INT_VEC3:
      return setValueV3i as UniformSetter;
    case GL_INT_VEC4:
      return setValueV4i as UniformSetter;
    case GL_SAMPLER_2D:
    case GL_SAMPLER_EXTERNAL_OES:
    case GL_INT_SAMPLER_2D:
    case GL_UNSIGNED_INT_SAMPLER_2D:
    case GL_SAMPLER_2D_SHADOW:
      return setValueT1 as UniformSetter;
    case GL_SAMPLER_3D:
      return setValueT3D1 as UniformSetter;
    case GL_SAMPLER_CUBE:
    case GL_SAMPLER_CUBE_SHADOW:
      return setValueT6 as UniformSetter;
    case GL_SAMPLER_2D_ARRAY:
    case GL_SAMPLER_2D_ARRAY_SHADOW:
      return setValueT2DArray1 as UniformSetter;
    default:
      return undefined;
  }
}

/** Array uniform setter for a GL type, or `undefined`. */
export function getPureArraySetter(type: number): UniformSetter | undefined {
  switch (type) {
    case GL_FLOAT:
      return setValueV1fArray as UniformSetter;
    case GL_FLOAT_VEC2:
      return setValueV2fArray as UniformSetter;
    case GL_FLOAT_VEC3:
      return setValueV3fArray as UniformSetter;
    case GL_FLOAT_VEC4:
      return setValueV4fArray as UniformSetter;
    case GL_FLOAT_MAT2:
      return setValueM2Array as UniformSetter;
    case GL_FLOAT_MAT3:
      return setValueM3Array as UniformSetter;
    case GL_FLOAT_MAT4:
      return setValueM4Array as UniformSetter;
    case GL_INT:
    case GL_BOOL:
      return setValueV1iArray as UniformSetter;
    case GL_INT_VEC2:
      return setValueV2iArray as UniformSetter;
    case GL_INT_VEC3:
      return setValueV3iArray as UniformSetter;
    case GL_INT_VEC4:
      return setValueV4iArray as UniformSetter;
    case GL_SAMPLER_2D:
    case GL_SAMPLER_EXTERNAL_OES:
    case GL_INT_SAMPLER_2D:
    case GL_UNSIGNED_INT_SAMPLER_2D:
    case GL_SAMPLER_2D_SHADOW:
      return setValueT1Array as UniformSetter;
    case GL_SAMPLER_CUBE:
    case GL_SAMPLER_CUBE_SHADOW:
      return setValueT6Array as UniformSetter;
    default:
      return undefined;
  }
}

/** `true` for every sampler type, which is what needs a texture unit. */
export function isSamplerType(type: number): boolean {
  return (
    type === GL_SAMPLER_2D ||
    type === GL_SAMPLER_CUBE ||
    type === GL_SAMPLER_3D ||
    type === GL_SAMPLER_2D_ARRAY ||
    type === GL_SAMPLER_2D_SHADOW ||
    type === GL_SAMPLER_CUBE_SHADOW ||
    type === GL_SAMPLER_2D_ARRAY_SHADOW ||
    type === GL_SAMPLER_EXTERNAL_OES ||
    type === GL_INT_SAMPLER_2D ||
    type === GL_UNSIGNED_INT_SAMPLER_2D ||
    type === GL_INT_SAMPLER_3D ||
    type === GL_UNSIGNED_INT_SAMPLER_3D ||
    type === GL_INT_SAMPLER_CUBE ||
    type === GL_UNSIGNED_INT_SAMPLER_CUBE ||
    type === GL_INT_SAMPLER_2D_ARRAY ||
    type === GL_UNSIGNED_INT_SAMPLER_2D_ARRAY
  );
}

/** The sampler kind a setter should bind, exposed for tests. */
export { samplerKind };
