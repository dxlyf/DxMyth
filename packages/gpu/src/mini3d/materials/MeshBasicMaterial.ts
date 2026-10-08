import { Color } from '../math/Color';
import { Matrix3 } from '../math/Matrix3';
import { Material } from './Material';
import type { MaterialParameters, Uniform, Uniforms } from './Material';
import type { Texture } from '../textures/Texture';
import type { MaterialKind, Side } from '../constants';

export type MeshBasicMaterialUniforms = Uniforms & {
  /** Base colour (linear working space). */
  diffuse: Uniform<Color>;
  opacity: Uniform<number>;
  alphaTest: Uniform<number>;
  diffuseMap: Uniform<Texture | null>;
  alphaMap: Uniform<Texture | null>;
  aoMap: Uniform<Texture | null>;
  aoMapIntensity: Uniform<number>;
  /** 2D texture transform, also uploaded as `uvTransform` (mat3). */
  uvTransform: Uniform<Matrix3>;
};

export type MeshBasicMaterialOptions = MaterialParameters & {
  color?: number | string | Color;
  map?: Texture | null;
  alphaMap?: Texture | null;
  aoMap?: Texture | null;
  /** Stored for API parity; the built-in shaders have no light-map chunk. */
  lightMap?: Texture | null;
  lightMapIntensity?: number;
  aoMapIntensity?: number;
  side?: Side;
  wireframe?: boolean;
  vertexColors?: boolean;
  fog?: boolean;
  reflectivity?: number;
};

/**
 * Unlit material: the surface colour is written straight to the framebuffer
 * (modulated by the diffuse/alpha/AO maps and vertex colours).
 *
 * Uniforms: `diffuse`, `opacity`, `diffuseMap`, `alphaMap`, `aoMap`,
 * `aoMapIntensity`, `uvTransform`, `alphaTest`.
 */
export class MeshBasicMaterial extends Material {
  override kind: MaterialKind = 'basic';
  readonly isMeshBasicMaterial = true;

  color: Color;
  map: Texture | null = null;
  alphaMap: Texture | null = null;
  aoMap: Texture | null = null;
  lightMap: Texture | null = null;
  lightMapIntensity = 1;
  aoMapIntensity = 1;
  /** Environment-map mix factor (three.js parity; unused by the shaders). */
  reflectivity = 1;
  fog = false;

  override uniforms: MeshBasicMaterialUniforms;

  constructor(options: MeshBasicMaterialOptions = {}) {
    super('basic');
    this.color = new Color(0xffffff);
    this.uniforms = {
      diffuse: { value: this.color },
      opacity: { value: 1 },
      alphaTest: { value: 0 },
      diffuseMap: { value: null },
      alphaMap: { value: null },
      aoMap: { value: null },
      aoMapIntensity: { value: 1 },
      uvTransform: { value: new Matrix3() },
    };
    this.setValues(options);
  }

  override getDefines(): Record<string, string | number | boolean> {
    const auto: Record<string, string | number | boolean> = {};
    if (this.map !== null) {
      auto.USE_MAP = true;
      auto.USE_UV = true;
    }
    if (this.alphaMap !== null) {
      auto.USE_ALPHAMAP = true;
      auto.USE_UV = true;
    }
    if (this.aoMap !== null) {
      auto.USE_AOMAP = true;
      auto.USE_UV = true;
    }
    if (this.vertexColors) auto.USE_COLOR = true;
    if (this.alphaTest > 0) auto.USE_ALPHATEST = true;
    if (this.fog) auto.USE_FOG = true;
    return { ...auto, ...this.defines };
  }

  override copy(source: MeshBasicMaterial): this {
    super.copy(source);
    this.color.copy(source.color);
    this.map = source.map;
    this.alphaMap = source.alphaMap;
    this.aoMap = source.aoMap;
    this.lightMap = source.lightMap;
    this.lightMapIntensity = source.lightMapIntensity;
    this.aoMapIntensity = source.aoMapIntensity;
    this.reflectivity = source.reflectivity;
    this.fog = source.fog;
    // `super.copy` replaced the uniform record; re-point every slot at this
    // material's own objects so the clone never aliases the source.
    this.uniforms.diffuse.value = this.color;
    this.uniforms.opacity.value = this.opacity;
    this.uniforms.diffuseMap.value = this.map;
    this.uniforms.alphaMap.value = this.alphaMap;
    this.uniforms.aoMap.value = this.aoMap;
    this.uniforms.aoMapIntensity.value = this.aoMapIntensity;
    this.uniforms.uvTransform.value.copy(source.uniforms.uvTransform.value);
    return this;
  }

  override clone(): MeshBasicMaterial {
    return new MeshBasicMaterial().copy(this);
  }

  /**
   * Keeps `uvTransform` in step with the diffuse texture's `matrix`, which is
   * derived from the texture's `offset` / `repeat` / `center` / `rotation`.
   */
  override refreshUniforms(): void {
    super.refreshUniforms();
  }
}
