import { Color } from '../math/Color';
import { Matrix3 } from '../math/Matrix3';
import { Vector2 } from '../math/Vector2';
import { Material } from './Material';
import type { MaterialParameters, Uniform, Uniforms } from './Material';
import type { Texture } from '../textures/Texture';
import type { MaterialKind, Side } from '../constants';

export type MeshStandardMaterialUniforms = Uniforms & {
  diffuse: Uniform<Color>;
  opacity: Uniform<number>;
  alphaTest: Uniform<number>;
  emissive: Uniform<Color>;
  roughness: Uniform<number>;
  metalness: Uniform<number>;
  diffuseMap: Uniform<Texture | null>;
  alphaMap: Uniform<Texture | null>;
  aoMap: Uniform<Texture | null>;
  aoMapIntensity: Uniform<number>;
  roughnessMap: Uniform<Texture | null>;
  metalnessMap: Uniform<Texture | null>;
  emissiveMap: Uniform<Texture | null>;
  normalMap: Uniform<Texture | null>;
  normalScale: Uniform<Vector2>;
  envMap: Uniform<Texture | null>;
  envMapIntensity: Uniform<number>;
  uvTransform: Uniform<Matrix3>;
};

export type MeshStandardMaterialOptions = MaterialParameters & {
  color?: number | string | Color;
  emissive?: number | string | Color;
  emissiveIntensity?: number;
  roughness?: number;
  metalness?: number;
  map?: Texture | null;
  alphaMap?: Texture | null;
  aoMap?: Texture | null;
  aoMapIntensity?: number;
  lightMap?: Texture | null;
  lightMapIntensity?: number;
  roughnessMap?: Texture | null;
  metalnessMap?: Texture | null;
  emissiveMap?: Texture | null;
  normalMap?: Texture | null;
  normalScale?: Vector2 | [number, number];
  envMap?: Texture | null;
  envMapIntensity?: number;
  side?: Side;
  wireframe?: boolean;
  vertexColors?: boolean;
  flatShading?: boolean;
  fog?: boolean;
};

/**
 * Metallic-roughness PBR (Cook-Torrance GGX + Smith visibility + Schlick
 * Fresnel, Lambert diffuse).
 *
 * Uniforms: `diffuse`, `opacity`, `emissive`, `roughness`, `metalness`,
 * `diffuseMap`, `alphaMap`, `aoMap`, `aoMapIntensity`, `roughnessMap`,
 * `metalnessMap`, `emissiveMap`, `normalMap`, `normalScale`, `envMap`,
 * `envMapIntensity`, `uvTransform`, `alphaTest`.
 */
export class MeshStandardMaterial extends Material {
  override kind: MaterialKind = 'standard';
  readonly isMeshStandardMaterial = true;

  color: Color;
  emissive: Color;
  emissiveIntensity = 1;
  roughness = 1;
  metalness = 0;
  map: Texture | null = null;
  alphaMap: Texture | null = null;
  aoMap: Texture | null = null;
  aoMapIntensity = 1;
  lightMap: Texture | null = null;
  lightMapIntensity = 1;
  roughnessMap: Texture | null = null;
  metalnessMap: Texture | null = null;
  emissiveMap: Texture | null = null;
  normalMap: Texture | null = null;
  normalScale: Vector2;
  envMap: Texture | null = null;
  envMapIntensity = 1;
  fog = false;

  override uniforms: MeshStandardMaterialUniforms;

  constructor(options: MeshStandardMaterialOptions = {}) {
    super('standard');
    this.color = new Color(0xffffff);
    this.emissive = new Color(0x000000);
    this.normalScale = new Vector2(1, 1);
    this.uniforms = {
      diffuse: { value: this.color },
      opacity: { value: 1 },
      alphaTest: { value: 0 },
      emissive: { value: this.emissive },
      roughness: { value: this.roughness },
      metalness: { value: this.metalness },
      diffuseMap: { value: null },
      alphaMap: { value: null },
      aoMap: { value: null },
      aoMapIntensity: { value: 1 },
      roughnessMap: { value: null },
      metalnessMap: { value: null },
      emissiveMap: { value: null },
      normalMap: { value: null },
      normalScale: { value: this.normalScale },
      envMap: { value: null },
      envMapIntensity: { value: 1 },
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
    if (this.roughnessMap !== null) {
      auto.USE_ROUGHNESSMAP = true;
      auto.USE_UV = true;
    }
    if (this.metalnessMap !== null) {
      auto.USE_METALNESSMAP = true;
      auto.USE_UV = true;
    }
    if (this.emissiveMap !== null) {
      auto.USE_EMISSIVEMAP = true;
      auto.USE_UV = true;
    }
    if (this.normalMap !== null) {
      auto.USE_NORMALMAP = true;
      auto.USE_UV = true;
    }
    if (this.envMap !== null) {
      auto.USE_ENVMAP = true;
      auto.ENVMAP_MODE_REFLECTION = true;
      auto.ENVMAP_BLENDING_MULTIPLY = true;
    }
    if (this.vertexColors) auto.USE_COLOR = true;
    if (this.alphaTest > 0) auto.USE_ALPHATEST = true;
    if (this.fog) auto.USE_FOG = true;
    if (this.flatShading) auto.FLAT_SHADED = true;
    return { ...auto, ...this.defines };
  }

  override copy(source: MeshStandardMaterial): this {
    super.copy(source);
    this.color.copy(source.color);
    this.emissive.copy(source.emissive);
    this.emissiveIntensity = source.emissiveIntensity;
    this.roughness = source.roughness;
    this.metalness = source.metalness;
    this.map = source.map;
    this.alphaMap = source.alphaMap;
    this.aoMap = source.aoMap;
    this.aoMapIntensity = source.aoMapIntensity;
    this.lightMap = source.lightMap;
    this.lightMapIntensity = source.lightMapIntensity;
    this.roughnessMap = source.roughnessMap;
    this.metalnessMap = source.metalnessMap;
    this.emissiveMap = source.emissiveMap;
    this.normalMap = source.normalMap;
    this.normalScale.copy(source.normalScale);
    this.envMap = source.envMap;
    this.envMapIntensity = source.envMapIntensity;
    this.fog = source.fog;
    this.uniforms.diffuse.value = this.color;
    this.uniforms.opacity.value = this.opacity;
    this.uniforms.emissive.value = this.emissive;
    this.uniforms.roughness.value = this.roughness;
    this.uniforms.metalness.value = this.metalness;
    this.uniforms.diffuseMap.value = this.map;
    this.uniforms.alphaMap.value = this.alphaMap;
    this.uniforms.aoMap.value = this.aoMap;
    this.uniforms.aoMapIntensity.value = this.aoMapIntensity;
    this.uniforms.roughnessMap.value = this.roughnessMap;
    this.uniforms.metalnessMap.value = this.metalnessMap;
    this.uniforms.emissiveMap.value = this.emissiveMap;
    this.uniforms.normalMap.value = this.normalMap;
    this.uniforms.normalScale.value = this.normalScale;
    this.uniforms.envMap.value = this.envMap;
    this.uniforms.envMapIntensity.value = this.envMapIntensity;
    this.uniforms.uvTransform.value.copy(source.uniforms.uvTransform.value);
    return this;
  }

  override clone(): MeshStandardMaterial {
    return new MeshStandardMaterial().copy(this);
  }

  /**
   * Keeps `uvTransform` in step with the diffuse texture's `matrix`, which is
   * derived from the texture's `offset` / `repeat` / `center` / `rotation`.
   */
  override refreshUniforms(): void {
    super.refreshUniforms();
  }
}
