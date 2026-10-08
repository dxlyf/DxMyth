/**
 * CPU-side packing for the two WGSL uniform blocks the WebGPU backend uses.
 *
 * This module is deliberately free of any `GPU*` types so it can be unit
 * tested (and cross-checked for byte offsets) in plain Node through Vite's SSR
 * pipeline.
 *
 * ## Byte layout
 *
 * `FrameUniforms` (bind group 0, binding 0) — **1072 bytes = 268 floats**:
 *
 * | field                | offset (B) | offset (floats) | size |
 * | -------------------- | ---------- | --------------- | ---- |
 * | `viewMatrix`         | 0          | 0               | 64   |
 * | `projectionMatrix`   | 64         | 16              | 64   |
 * | `viewProjectionMatrix`| 128       | 32              | 64   |
 * | `cameraPosition`     | 192        | 48              | 16   |
 * | `ambientColor`       | 208        | 52              | 16   |
 * | `hemisphereSky`      | 224        | 56              | 16   |
 * | `hemisphereGround`   | 240        | 60              | 16   |
 * | `directionalCounts`  | 256        | 64              | 16   |
 * | `directionalData[16]`| 272        | 68              | 256  |
 * | `pointData[16]`      | 528        | 132             | 256  |
 * | `spotData[16]`       | 784        | 196             | 256  |
 * | `fogColor`           | 1040       | 260             | 16   |
 * | `fogParams`          | 1056       | 264             | 16   |
 *
 * The offsets above are the natural std140/WGSL layout: `array<vec4<f32>, N>`
 * has a 16-byte stride inside a uniform struct, so no implicit padding is
 * inserted anywhere and the struct ends exactly at **1072 bytes = 268 floats**
 * (`4*16` matrices/vec4 prefix + `16*16` directional + `16*16` point
 * + `16*16` spot + `2*16` fog). The task brief's prose mentions 976/244, but
 * that arithmetic drops the 96-byte `viewProjectionMatrix` and the 256-byte
 * `spotData` block; the field list is what is frozen, and this is its size.
 * The uniform buffer is a multiple of 16, so it needs no padding.
 *
 * `ObjectUniforms` (bind group 1, binding 0) — **196 bytes = 49 floats**:
 *
 * | field               | offset (B) | offset (floats) |
 * | ------------------- | ---------- | --------------- |
 * | `modelMatrix`       | 0          | 0               |
 * | `normalMatrix`      | 64         | 16              |
 * | `diffuse`           | 128        | 32              |
 * | `emissive`          | 144        | 36              |
 * | `specularShininess` | 160        | 40              |
 * | `roughnessMetalness`| 176        | 44              |
 * | `uvTransform`       | 192        | 48              |
 * | `flags`             | 256        | 64              |
 *
 * `uvTransform` is a full `mat4x4<f32>` (not `mat3x3<f32>`) precisely so the
 * offsets stay trivial; the shader only reads its upper-left 3x3.
 */

import type { Camera } from '../../core/Camera';
import type { LightState } from '../../core/LightState';
import {
  MAX_DIRECTIONAL_LIGHTS,
  MAX_POINT_LIGHTS,
  MAX_SPOT_LIGHTS,
} from '../../core/LightState';
import type { Material } from '../../materials/Material';
import type { Object3D } from '../../core/Object3D';
import type { Texture } from '../../textures/Texture';

// ------------------------------------------------------------ frame layout --

/** Total `FrameUniforms` size in bytes (and floats where noted). */
export const FRAME_UNIFORM_BYTES = 1072;
export const FRAME_UNIFORM_FLOATS = FRAME_UNIFORM_BYTES / 4;

/** Float offsets of every `FrameUniforms` field. */
export const FRAME_FIELD_OFFSETS = {
  viewMatrix: 0,
  projectionMatrix: 16,
  viewProjectionMatrix: 32,
  cameraPosition: 48,
  ambientColor: 52,
  hemisphereSky: 56,
  hemisphereGround: 60,
  directionalCounts: 64,
  /** First element of the `array<vec4<f32>, 16>`; 2 vec4 per directional light. */
  directionalData: 68,
  /** First element of the `array<vec4<f32>, 16>`; 2 vec4 per point light. */
  pointData: 132,
  /** First element of the `array<vec4<f32>, 16>`; 4 vec4 per spot light. */
  spotData: 196,
  fogColor: 260,
  fogParams: 264,
} as const;

/** Float counts of the per-light `vec4` lanes. */
export const DIRECTIONAL_LIGHT_VECS = 2;
export const POINT_LIGHT_VECS = 2;
export const SPOT_LIGHT_VECS = 4;

/** Total `ObjectUniforms` size in bytes (and floats). */
export const OBJECT_UNIFORM_BYTES = 196;
export const OBJECT_UNIFORM_FLOATS = OBJECT_UNIFORM_BYTES / 4;

/** Float offsets of every `ObjectUniforms` field. */
export const OBJECT_FIELD_OFFSETS = {
  modelMatrix: 0,
  normalMatrix: 16,
  diffuse: 32,
  emissive: 36,
  specularShininess: 40,
  roughnessMetalness: 44,
  uvTransform: 48,
  flags: 64,
} as const;

/**
 * A `LightState` shaped exactly like the one `collectLights()` produces.
 * Declared structurally so callers can pass either a real `LightState` or a
 * hand-built literal.
 */
export interface WgpuLightSource {
  readonly ambient: { r: number; g: number; b: number };
  readonly hemisphereSky: { r: number; g: number; b: number };
  readonly hemisphereGround: { r: number; g: number; b: number };
  directionalCount: number;
  pointCount: number;
  spotCount: number;
  readonly directionalData: Float32Array;
  readonly pointData: Float32Array;
  readonly spotData: Float32Array;
}

/** Parameters for one `FrameUniforms` upload. */
export interface FrameUniformInput {
  /**
   * Projection matrix with the OpenGL→WebGPU clip-space depth remap already
   * applied (see {@link writeClipSpaceRemap}).
   */
  projectionMatrix: { elements: ArrayLike<number> };
  viewMatrix: { elements: ArrayLike<number> };
  /** `projectionMatrix * viewMatrix` with the same remap applied. */
  viewProjectionMatrix: { elements: ArrayLike<number> };
  cameraPosition: { x: number; y: number; z: number };
  lightState: WgpuLightSource;
  /** `scene.fog`, or `null` when the scene has no fog. */
  fog: FogLike | null;
}

/** Structural view of `Fog` / `FogExp2` from `src/core/Fog.ts`. */
export interface FogLike {
  color: { r: number; g: number; b: number };
  near?: number;
  far?: number;
  density?: number;
}

/** Parameters for one `ObjectUniforms` upload. */
export interface ObjectUniformInput {
  object: Object3D;
  material: Material;
  /** `normalMatrix` reused by this draw (upper-left 3x3 of `inverse(model)ᵀ`). */
  normalMatrix?: { elements: ArrayLike<number> };
}

/** The material fields the WebGPU backend reads. */
export interface WgpuMaterialView {
  color?: { r: number; g: number; b: number };
  emissive?: { r: number; g: number; b: number };
  specular?: { r: number; g: number; b: number };
  shininess?: number;
  roughness?: number;
  metalness?: number;
  normalScale?: { x: number; y: number };
  size?: number;
  sizeAttenuation?: boolean;
  map?: Texture | null;
  alphaMap?: Texture | null;
  normalMap?: Texture | null;
  emissiveMap?: Texture | null;
  specularMap?: Texture | null;
  roughnessMap?: Texture | null;
  metalnessMap?: Texture | null;
  aoMap?: Texture | null;
}

/** Narrow a `Material` to the optional fields the built-in materials expose. */
export function materialView(material: Material): WgpuMaterialView {
  return material as Material & WgpuMaterialView;
}

// ---------------------------------------------------------------- matrices --

/**
 * Clip-space depth remap from OpenGL (`z ∈ [-1, 1]`) to WebGPU
 * (`z ∈ [0, 1]`), stored **column-major** exactly like `Matrix4.elements`:
 *
 * ```
 * [1, 0, 0,   0,
 *  0, 1, 0,   0,
 *  0, 0, 0.5, 0.5,
 *  0, 0, 0,   1]
 * ```
 *
 * `Matrix4.makePerspective` / `makeOrthographic` ignore `camera.coordinateSystem`
 * (the parameter is accepted and `void`ed), so every camera matrix this backend
 * uploads is pre-multiplied by this constant instead — the camera's own
 * `projectionMatrix` is never mutated, so the WebGL backend and `unproject()`
 * keep working on the same camera object.
 */
export const CLIP_SPACE_REMAP: readonly number[] = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 0.5, 0.5,
  0, 0, 0, 1,
];

/**
 * Writes `zRemap * projection` into `out` (a 16-element column-major array).
 *
 * Generic over `Float32Array | number[]` so the same helper can feed both the
 * typed uniform cache and a plain array in tests.
 */
export function writeClipSpaceRemap(
  out: Float32Array | number[],
  projection: { elements: ArrayLike<number> },
): void {
  const pe = projection.elements;
  // Row 3 of the remap is [0, 0, 0.5, 0.5]; every other row is the identity, so
  // only the third row of the product differs from the input.
  for (let column = 0; column < 4; column++) {
    const base = column * 4;
    out[base + 0] = pe[base + 0];
    out[base + 1] = pe[base + 1];
    out[base + 2] = pe[base + 2] * 0.5 + pe[base + 3] * 0.5;
    out[base + 3] = pe[base + 3];
  }
}

/** Writes `projection * view` followed by the clip-space remap into `out`. */
export function writeViewProjection(
  out: Float32Array | number[],
  projection: { elements: ArrayLike<number> },
  view: { elements: ArrayLike<number> },
): void {
  const pe = projection.elements;
  const ve = view.elements;
  const product = _vpScratch;
  for (let column = 0; column < 4; column++) {
    const b = column * 4;
    const b0 = ve[b];
    const b1 = ve[b + 1];
    const b2 = ve[b + 2];
    const b3 = ve[b + 3];
    for (let row = 0; row < 4; row++) {
      product[b + row] =
        pe[row] * b0 + pe[4 + row] * b1 + pe[8 + row] * b2 + pe[12 + row] * b3;
    }
  }
  writeClipSpaceRemap(out, { elements: product });
}

/**
 * Writes the upper-left 3x3 of `inverse(upperLeft(model))ᵀ` — the normal
 * matrix — into a `mat4x4<f32>` lane (the fourth column/row stay identity) so
 * the WGSL side can multiply `normalMatrix * vec4(normal, 0.0)` directly.
 */
export function writeNormalMatrix(
  out: Float32Array | number[],
  model: { elements: ArrayLike<number> },
): void {
  const e = model.elements;
  const a00 = e[0], a01 = e[1], a02 = e[2];
  const a10 = e[4], a11 = e[5], a12 = e[6];
  const a20 = e[8], a21 = e[9], a22 = e[10];

  const b01 = a22 * a11 - a12 * a21;
  const b11 = -a22 * a10 + a12 * a20;
  const b21 = a21 * a10 - a11 * a20;
  const det = a00 * b01 + a01 * b11 + a02 * b21;
  const invDet = det === 0 || !Number.isFinite(det) ? 1 : 1 / det;

  // inverse(A)ᵀ stored column-major in a mat4x4: the transpose swaps the
  // usual row/column placement.
  out[0] = b01 * invDet;
  out[1] = b11 * invDet;
  out[2] = b21 * invDet;
  out[3] = 0;

  out[4] = (-a22 * a01 + a02 * a21) * invDet;
  out[5] = (a22 * a00 - a02 * a20) * invDet;
  out[6] = (-a21 * a00 + a01 * a20) * invDet;
  out[7] = 0;

  out[8] = (a12 * a01 - a02 * a11) * invDet;
  out[9] = (-a12 * a00 + a02 * a10) * invDet;
  out[10] = (a11 * a00 - a01 * a10) * invDet;
  out[11] = 0;

  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
}

/** Writes the upper-left 3x3 of a `Matrix3` into a `mat4x4<f32>` lane. */
export function writeUvTransform(
  out: Float32Array | number[],
  matrix: { elements: ArrayLike<number> },
): void {
  const e = matrix.elements;
  out[0] = e[0]; out[1] = e[1]; out[2] = e[2]; out[3] = 0;
  out[4] = e[3]; out[5] = e[4]; out[6] = e[5]; out[7] = 0;
  out[8] = e[6]; out[9] = e[7]; out[10] = e[8]; out[11] = 0;
  out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;
}

// ----------------------------------------------------------------- helpers --

/** `Math.min(Math.max(value, 0), max)` with a floor for `NaN`. */
export function clampLightCount(value: number, max: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(Math.trunc(value), 0), max);
}

/**
 * Writes the packed light lanes into a `FrameUniforms` array.
 *
 * The packing matches `LightState`'s documented layout exactly (8 floats per
 * directional/point light, 16 per spot light) and is copied — not shared — so
 * the buffer can be written in one `writeBuffer` call.
 */
export function packLightData(target: Float32Array, state: WgpuLightSource): void {
  const directionalCount = clampLightCount(state.directionalCount, MAX_DIRECTIONAL_LIGHTS);
  const pointCount = clampLightCount(state.pointCount, MAX_POINT_LIGHTS);
  const spotCount = clampLightCount(state.spotCount, MAX_SPOT_LIGHTS);

  const directionalBase = FRAME_FIELD_OFFSETS.directionalData;
  for (let i = 0; i < directionalCount * 8; i++) {
    target[directionalBase + i] = state.directionalData[i];
  }

  const pointBase = FRAME_FIELD_OFFSETS.pointData;
  for (let i = 0; i < pointCount * 8; i++) {
    target[pointBase + i] = state.pointData[i];
  }

  const spotBase = FRAME_FIELD_OFFSETS.spotData;
  for (let i = 0; i < spotCount * 16; i++) {
    target[spotBase + i] = state.spotData[i];
  }

  const counts = FRAME_FIELD_OFFSETS.directionalCounts;
  target[counts + 0] = directionalCount;
  target[counts + 1] = pointCount;
  target[counts + 2] = spotCount;
  target[counts + 3] = 0;
}

/**
 * Packs one `FrameUniforms` block into `target` (a `Float32Array` of at least
 * {@link FRAME_UNIFORM_FLOATS} entries) and returns it.
 *
 * `projectionMatrix`/`viewProjectionMatrix` must already carry the
 * OpenGL→WebGPU depth remap.
 */
export function packFrameUniforms(
  target: Float32Array,
  input: FrameUniformInput,
): Float32Array {
  if (target.length < FRAME_UNIFORM_FLOATS) {
    throw new RangeError(
      `mini3d.WebGPURenderer: FrameUniforms needs ${FRAME_UNIFORM_FLOATS} floats, got ${target.length}`,
    );
  }

  writeMatrix4(target, FRAME_FIELD_OFFSETS.viewMatrix, input.viewMatrix);
  writeMatrix4(target, FRAME_FIELD_OFFSETS.projectionMatrix, input.projectionMatrix);
  writeMatrix4(target, FRAME_FIELD_OFFSETS.viewProjectionMatrix, input.viewProjectionMatrix);

  const o = FRAME_FIELD_OFFSETS;
  const camera = input.cameraPosition;
  target[o.cameraPosition + 0] = camera.x;
  target[o.cameraPosition + 1] = camera.y;
  target[o.cameraPosition + 2] = camera.z;
  target[o.cameraPosition + 3] = 1;

  const state = input.lightState;
  writeColor(target, o.ambientColor, state.ambient);
  writeColor(target, o.hemisphereSky, state.hemisphereSky);
  writeColor(target, o.hemisphereGround, state.hemisphereGround);

  packLightData(target, state);
  writeFog(target, input.fog);
  return target;
}

/** Writes the fog block (`fogColor` + `fogParams`) from a scene fog object. */
export function writeFog(target: Float32Array, fog: FogLike | null): void {
  const o = FRAME_FIELD_OFFSETS;
  if (!fog) {
    target[o.fogColor + 0] = 0;
    target[o.fogColor + 1] = 0;
    target[o.fogColor + 2] = 0;
    target[o.fogColor + 3] = 1;
    target[o.fogParams + 0] = 1;
    target[o.fogParams + 1] = 1000;
    target[o.fogParams + 2] = 0;
    target[o.fogParams + 3] = 0;
    return;
  }

  writeColor(target, o.fogColor, fog.color);
  if (typeof fog.density === 'number') {
    // FogExp2: near/far are inert, density drives the curve.
    target[o.fogParams + 0] = 1;
    target[o.fogParams + 1] = 1000;
    target[o.fogParams + 2] = 1;
    target[o.fogParams + 3] = fog.density;
  } else {
    target[o.fogParams + 0] = fog.near ?? 1;
    target[o.fogParams + 1] = fog.far ?? 1000;
    target[o.fogParams + 2] = 1;
    target[o.fogParams + 3] = 0.00025;
  }
}

/**
 * Packs one `ObjectUniforms` block into `target` (at least
 * {@link OBJECT_UNIFORM_FLOATS} entries) and returns it.
 */
export function packObjectUniforms(
  target: Float32Array,
  input: ObjectUniformInput,
): Float32Array {
  if (target.length < OBJECT_UNIFORM_FLOATS) {
    throw new RangeError(
      `mini3d.WebGPURenderer: ObjectUniforms needs ${OBJECT_UNIFORM_FLOATS} floats, got ${target.length}`,
    );
  }

  const { object, material } = input;
  // Fold state the material derives (the texture matrix) into its uniform record
  // before reading it, exactly as the WebGL backend does.
  material.refreshUniforms();
  const o = OBJECT_FIELD_OFFSETS;
  const view = materialView(material);

  writeMatrix4(target, o.modelMatrix, object.matrixWorld);
  if (input.normalMatrix) {
    writeMatrix4(target, o.normalMatrix, input.normalMatrix);
  } else {
    writeNormalMatrix(target.subarray(o.normalMatrix, o.normalMatrix + 16), object.matrixWorld);
  }

  writeColor(target, o.diffuse, view.color ?? WHITE);
  target[o.diffuse + 3] = material.opacity;

  writeColor(target, o.emissive, view.emissive ?? BLACK);

  writeColor(target, o.specularShininess, view.specular ?? BLACK);
  target[o.specularShininess + 3] = view.shininess ?? 0;

  target[o.roughnessMetalness + 0] = view.roughness ?? 1;
  target[o.roughnessMetalness + 1] = view.metalness ?? 0;
  target[o.roughnessMetalness + 2] = material.opacity;
  target[o.roughnessMetalness + 3] = 0;

  // The texture's own `offset` / `repeat` / `center` / `rotation`, which the
  // material has already folded into `uvTransform` via `refreshUniforms()`.
  const uvSlot = material.uniforms.uvTransform as { value?: { elements: ArrayLike<number> } } | undefined;
  writeUvTransform(
    target.subarray(o.uvTransform, o.uvTransform + 16),
    uvSlot?.value ?? _identityMatrix3,
  );

  target[o.flags + 0] = material.alphaTest;
  target[o.flags + 1] = view.size ?? 1;
  target[o.flags + 2] = view.sizeAttenuation === false ? 0 : 1;
  target[o.flags + 3] = 0;

  return target;
}

/** Writes a 4-element colour lane (rgb + alpha) from anything with r/g/b. */
export function writeColor(
  target: Float32Array | number[],
  offset: number,
  color: { r: number; g: number; b: number },
  alpha = 1,
): void {
  target[offset + 0] = color.r;
  target[offset + 1] = color.g;
  target[offset + 2] = color.b;
  target[offset + 3] = alpha;
}

/** Copies 16 column-major elements out of a `Matrix4`-like object. */
export function writeMatrix4(
  target: Float32Array | number[],
  offset: number,
  matrix: { elements: ArrayLike<number> },
): void {
  const e = matrix.elements;
  for (let i = 0; i < 16; i++) target[offset + i] = e[i];
}

const WHITE = { r: 1, g: 1, b: 1 };
const BLACK = { r: 0, g: 0, b: 0 };
const _identityMatrix3 = { elements: [1, 0, 0, 0, 1, 0, 0, 0, 1] };
const _vpScratch = new Float32Array(16);
