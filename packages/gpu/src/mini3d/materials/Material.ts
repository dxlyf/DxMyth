import { EventDispatcher } from '../core/EventDispatcher';
import { Color } from '../math/Color';
import { Matrix3 } from '../math/Matrix3';
import { Matrix4 } from '../math/Matrix4';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { Vector4 } from '../math/Vector4';
import { FrontSide, LessEqualDepth, NormalBlending } from '../constants';
import type { Blending, DepthFunc, MaterialKind, Side } from '../constants';
import type { Texture } from '../textures/Texture';

/**
 * The shader program description handed to `Material.onBeforeCompile`.
 *
 * Backends build this object from the material + its `ShaderLib` entry, call
 * the hook (when present) and then compile whatever comes back. `defines`
 * already contains the automatic `USE_*` macros derived from the material's
 * textures/switches merged with the user's `material.defines`.
 */
export interface ShaderSource {
  vertexShader: string;
  fragmentShader: string;
  defines: Record<string, string | number | boolean>;
  uniforms: Record<string, { value: unknown }>;
}

export interface MaterialEventMap {
  dispose: { target: Material };
}

/**
 * The subset of `Material` fields that every constructor option object
 * accepts. Declared as a `type` (not an `interface`) so it keeps an implicit
 * index signature and can be fed straight to `setValues`.
 */
export type MaterialParameters = {
  name?: string;
  transparent?: boolean;
  opacity?: number;
  blending?: Blending;
  side?: Side;
  depthTest?: boolean;
  depthWrite?: boolean;
  depthFunc?: DepthFunc;
  colorWrite?: boolean;
  visible?: boolean;
  alphaTest?: number;
  polygonOffset?: boolean;
  polygonOffsetFactor?: number;
  polygonOffsetUnits?: number;
  flatShading?: boolean;
  vertexColors?: boolean;
  wireframe?: boolean;
  toneMapped?: boolean;
  defines?: Record<string, string | number | boolean>;
  uniforms?: Uniforms;
  userData?: Record<string, unknown>;
  onBeforeCompile?: (shader: ShaderSource) => void;
};

/** A single uniform slot. Kept structurally identical to three.js. */
export interface Uniform<T = unknown> {  value: T;
}

export type Uniforms = Record<string, Uniform>;

let nextMaterialId = 1;

/** Random-ish identifier; only needs to be unique inside one process. */
function generateUuid(): string {
  const a = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0');
  const b = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0');
  return `${a}-${b}`;
}

/**
 * Uniform name to the texture field that feeds it, where the two differ.
 *
 * Most slots share a name; `diffuseMap` is fed by the `map` field. A module-level
 * constant rather than a class static: subclasses reach `refreshUniforms()`
 * through `super`, and a `private static` field compiles to a native `#` field
 * that cannot be read through a subclass reference, which silently defeated the
 * lookup.
 */
const TEXTURE_UNIFORM_TO_FIELD: Record<string, string> = {
  diffuseMap: 'map',
};

/**
 * Uniform name to the material field that feeds it, for the scalar and colour
 * values whose uniform name differs from the field name.
 */
const VALUE_UNIFORM_TO_FIELD: Record<string, string> = {
  diffuse: 'color',
};

/**
 * `true` when `key` is an own, initialised data property of `object`.
 *
 * `setValues` uses this instead of `key in object` so that prototype methods
 * (`clone`, `dispose`, ...) are not silently accepted as "known properties".
 */
function hasOwn(object: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(object, key);
}

/**
 * Assigns one `setValues` entry, preserving the identity of math objects
 * (so `{ color: 0xff0000 }` mutates the existing `Color` rather than
 * replacing it with a number).
 */
function assignValue(target: Record<string, unknown>, key: string, value: unknown): void {
  const current = target[key];

  if (current instanceof Color) {
    if (value instanceof Color) current.copy(value);
    else if (typeof value === 'number' || typeof value === 'string') current.set(value);
    else throw new TypeError(`mini3d.Material: cannot assign ${String(value)} to Color "${key}"`);
    return;
  }

  if (current instanceof Vector2 || current instanceof Vector3 || current instanceof Vector4) {
    const vector = current as unknown as {
      copy(v: unknown): void;
      set(...args: number[]): void;
      setScalar(s: number): void;
    };
    const VectorCtor = current.constructor as new () => unknown;
    if (value instanceof VectorCtor) {
      vector.copy(value);
    } else if (typeof value === 'number') {
      vector.setScalar(value);
    } else if (Array.isArray(value)) {
      vector.set(...(value as number[]));
    } else if (value !== null && typeof value === 'object') {
      const v = value as { x?: number; y?: number; z?: number; w?: number };
      vector.set(v.x ?? 0, v.y ?? 0, v.z ?? 0, v.w ?? 0);
    } else {
      throw new TypeError(`mini3d.Material: cannot assign ${String(value)} to "${key}"`);
    }
    return;
  }

  if (
    current !== null &&
    typeof current === 'object' &&
    value !== null &&
    typeof value === 'object' &&
    (current as { constructor?: unknown }).constructor === (value as { constructor?: unknown }).constructor &&
    typeof (current as { copy?: unknown }).copy === 'function'
  ) {
    (current as { copy: (v: unknown) => void }).copy(value);
    return;
  }

  target[key] = value;
}

/**
 * Deep-copies a uniform record: math objects are cloned so that two materials
 * never share a mutable `Color`/`Vector`/`Matrix`, while GPU resources
 * (textures, render targets, plain values) are kept by reference.
 */
export function cloneUniforms(source: Uniforms): Uniforms {
  const result: Uniforms = {};
  for (const [name, uniform] of Object.entries(source)) {
    result[name] = { value: cloneUniformValue(uniform.value) };
  }
  return result;
}

/** Clones the math objects that can appear as uniform values. */
function cloneUniformValue<T>(value: T): T {
  if (value instanceof Color) return value.clone() as unknown as T;
  if (value instanceof Vector2) return value.clone() as unknown as T;
  if (value instanceof Vector3) return value.clone() as unknown as T;
  if (value instanceof Vector4) return value.clone() as unknown as T;
  if (value instanceof Matrix3) return value.clone() as unknown as T;
  if (value instanceof Matrix4) return value.clone() as unknown as T;
  return value;
}

/**
 * Base class for everything the renderer can draw with.
 *
 * Field names/semantics match three.js so that ported code behaves the same.
 * `defines` and `uniforms` are plain records; subclasses override
 * `getDefines()` to fold their own textures and switches into `USE_*` macros.
 */
export class Material extends EventDispatcher<MaterialEventMap> {
  readonly isMaterial = true;

  /** Auto-incrementing process-unique id. */
  readonly id: number;
  /** Random string; stable across a session. */
  uuid: string;
  name = '';

  /** Discriminator used to pick the built-in shader program. */
  kind: MaterialKind = 'basic';

  transparent = false;
  opacity = 1;
  blending: Blending = NormalBlending;
  side: Side = FrontSide;

  depthTest = true;
  depthWrite = true;
  depthFunc: DepthFunc = LessEqualDepth;
  colorWrite = true;

  visible = true;
  alphaTest = 0;

  polygonOffset = false;
  polygonOffsetFactor = 0;
  polygonOffsetUnits = 0;

  flatShading = false;
  vertexColors = false;
  wireframe = false;
  toneMapped = true;

  /** Preprocessor macros injected above the shader source. */
  defines: Record<string, string | number | boolean> = {};
  /** Material uniforms; the backends upload `value` under each key. */
  uniforms: Uniforms = {};
  /** Free-form data for application code; ignored by the renderer. */
  userData: Record<string, unknown> = {};

  /**
   * Optional hook invoked by a backend right before the program is compiled.
   * Mutating `shader.vertexShader` / `fragmentShader` / `defines` / `uniforms`
   * is the supported way to customise a built-in material.
   */
  onBeforeCompile?: (shader: ShaderSource) => void;

  /** Bumped by `needsUpdate` so backends can invalidate cached GPU state. */
  version = 0;

  private _needsUpdate = false;

  constructor(kind: MaterialKind = 'basic') {
    super();
    this.id = nextMaterialId++;
    this.uuid = generateUuid();
    this.kind = kind;
  }

  /**
   * Setting `true` bumps `version`; backends compare it against the version
   * they compiled/uploaded last.
   */
  get needsUpdate(): boolean {
    return this._needsUpdate;
  }

  set needsUpdate(value: boolean) {
    this._needsUpdate = value;
    if (value) this.version++;
  }

  /**
   * Assigns every key of `values` onto this material.
   *
   * Throws for keys that are not properties of the material (typos must not
   * be silently ignored). Color / vector fields are mutated in place, so
   * `{ color: 0xff0000, normalScale: [1, 1] }` works.
   */
  setValues(values: Record<string, unknown>): this {
    for (const key of Object.keys(values)) {
      const value = values[key];
      if (value === undefined) continue;
      if (!hasOwn(this, key)) {
        throw new Error(
          `mini3d.${this.constructor.name}: unknown parameter "${key}" passed to setValues()`,
        );
      }
      assignValue(this as unknown as Record<string, unknown>, key, value);
    }
    return this;
  }

  /** Copies every base-class field from `source` (not the subclass fields). */
  copy(source: Material): this {
    this.name = source.name;
    this.kind = source.kind;
    this.transparent = source.transparent;
    this.opacity = source.opacity;
    this.blending = source.blending;
    this.side = source.side;
    this.depthTest = source.depthTest;
    this.depthWrite = source.depthWrite;
    this.depthFunc = source.depthFunc;
    this.colorWrite = source.colorWrite;
    this.visible = source.visible;
    this.alphaTest = source.alphaTest;
    this.polygonOffset = source.polygonOffset;
    this.polygonOffsetFactor = source.polygonOffsetFactor;
    this.polygonOffsetUnits = source.polygonOffsetUnits;
    this.flatShading = source.flatShading;
    this.vertexColors = source.vertexColors;
    this.wireframe = source.wireframe;
    this.toneMapped = source.toneMapped;
    this.onBeforeCompile = source.onBeforeCompile;
    this.defines = { ...source.defines };
    this.uniforms = cloneUniforms(source.uniforms);
    this.userData = { ...source.userData };
    this.version = 0;
    this._needsUpdate = false;
    return this;
  }

  clone(): Material {
    return new Material().copy(this);
  }

  /**
   * Defines handed to the shader compiler: automatic `USE_*` macros derived
   * from the material's own state, with `material.defines` applied on top so
   * application code always wins.
   */
  getDefines(): Record<string, string | number | boolean> {
    return { ...this.defines };
  }

  /** Names of the uniforms the backends should upload for this material. */
  get uniformNames(): string[] {
    return Object.keys(this.uniforms);
  }

  /**
   * Copies values that live outside the uniform record into it, just before the
   * backends upload.
   *
   * A material's typed fields (colour, roughness, 閳? are the authoring API, and
   * its `uniforms` record is what the shaders read; this hook is where the two
   * are reconciled for state the records cannot hold by reference. The built-in
   * materials use it for the texture matrix.
   */
  refreshUniforms(): void {
    this.syncValueUniforms();
    this.syncTextureUniforms();
    this.syncUvTransform();
  }

  /**
   * Copies the scalar and colour fields into their uniform slots.
   *
   * `opacity` is the one that matters most: the blend equation uses
   * `SRC_ALPHA`, so a material whose `opacity` field was set through
   * `setValues()` (or by direct assignment) but whose uniform still holds the
   * constructor default of `1` renders fully opaque.
   *
   * Field names are matched by trying the uniform name itself first, then the
   * known aliases, so a slot that has no corresponding field (`pointScale`,
   * `aoMapIntensity`, …) is simply left alone.
   */
  protected syncValueUniforms(): void {
    const uniforms = this.uniforms as Record<string, { value?: unknown } | undefined>;
    const source = this as unknown as Record<string, unknown>;

    for (const [field, key] of [
      ['opacity', 'opacity'],
      ['alphaTest', 'alphaTest'],
      ['color', 'diffuse'],
      ['emissive', 'emissive'],
      ['specular', 'specular'],
      ['shininess', 'shininess'],
      ['roughness', 'roughness'],
      ['metalness', 'metalness'],
      ['size', 'size'],
    ] as const) {
      const slot = uniforms[key];
      if (!slot) continue;
      const value = source[field];
      if (value === undefined) continue;
      // Colours are stored as `Color` objects; copy in place so the record keeps
      // whatever identity the material gave it.
      const current = slot.value as { copy?: (v: unknown) => void } | undefined;
      if (current && typeof current.copy === 'function' && value !== null && typeof value === 'object') {
        current.copy(value);
      } else {
        slot.value = value;
      }
    }

    // `sizeAttenuation` is a boolean field behind a float uniform.
    const attenuation = uniforms.sizeAttenuation;
    const attenuationField = source.sizeAttenuation;
    if (attenuation && typeof attenuationField === 'boolean') {
      attenuation.value = attenuationField ? 1 : 0;
    }
    void VALUE_UNIFORM_TO_FIELD;
  }

  /** First texture assigned to `map`, or `null`. */
  protected diffuseTexture(): Texture | null {
    const map = (this as unknown as { map?: Texture | null }).map;
    return map ?? null;
  }

  /**
   * Copies this material's texture fields into their uniform slots.
   *
   * The texture fields are the authoring API (for example
   * `new MeshBasicMaterial({ map })` or `material.map = texture`) while the
   * shader reads `uniforms.diffuseMap`. Without this sync the sampler keeps
   * whatever the record was constructed with (`null`), and the shader samples the
   * default white texture, so *every* texture appears as an untextured surface.
   */
  protected syncTextureUniforms(): void {
    const uniforms = this.uniforms as Record<string, { value?: unknown } | undefined>;
    const source = this as unknown as Record<string, unknown>;
    for (const key of Object.keys(uniforms)) {
      // The keys of the record are uniform names; the aliases map a uniform name
      // back to the texture field that feeds it.
      const field = TEXTURE_UNIFORM_TO_FIELD[key] ?? key;
      const value = source[field];
      // Only texture slots are synced: a `Texture`, or the explicit `null` used
      // to clear one.
      //
      // The test is structural rather than `instanceof Texture` on purpose. This
      // module is at the centre of the materials dependency graph, and importing
      // `Texture` for a runtime check here would close a cycle (`Texture` 鈫?      // `EventDispatcher` 鈫?鈥?鈫?`Material`), which leaves the binding undefined
      // in the bundled output.
      if (value === undefined) continue;
      const isTexture =
        value !== null &&
        typeof value === 'object' &&
        (value as { isTexture?: unknown }).isTexture === true;
      if (value !== null && !isTexture) continue;
      const slot = uniforms[key];
      if (!slot) continue;
      slot.value = value;
    }
  }

  /**
   * Writes `uvTransform` from the diffuse texture's `matrix`.
   *
   * A `Texture` builds `matrix` from its own `offset` / `repeat` / `center` /
   * `rotation`, so this is what makes those texture fields reach the shader:
   * `#include <uv_vertex>` multiplies `uv` by the uniform.
   */
  protected syncUvTransform(): void {
    const texture = this.diffuseTexture();
    const uniforms = this.uniforms as Record<string, { value?: unknown } | undefined>;
    const slot = uniforms.uvTransform;
    if (!slot || !(slot.value instanceof Matrix3)) return;
    if (texture) slot.value.copy(texture.matrix);
    else if (slot.value.elements[0] !== 1 || slot.value.elements[4] !== 1) slot.value.identity();
  }

  dispose(): void {
    this.dispatchEvent('dispose', { target: this });
  }
}
