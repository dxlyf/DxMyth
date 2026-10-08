import { Color } from '../math/Color';
import { Matrix3 } from '../math/Matrix3';
import { Vector2 } from '../math/Vector2';
import { Material } from './Material';
import type { MaterialParameters, Uniform, Uniforms } from './Material';
import type { Texture } from '../textures/Texture';
import { MultiplyOperation } from '../constants';
import type { CombineOperation, MaterialKind, Side } from '../constants';

export type MeshLambertMaterialUniforms = Uniforms & {
  diffuse: Uniform<Color>;
  opacity: Uniform<number>;
  alphaTest: Uniform<number>;
  emissive: Uniform<Color>;
  diffuseMap: Uniform<Texture | null>;
  alphaMap: Uniform<Texture | null>;
  aoMap: Uniform<Texture | null>;
  aoMapIntensity: Uniform<number>;
  emissiveMap: Uniform<Texture | null>;
  specularMap: Uniform<Texture | null>;
  normalMap: Uniform<Texture | null>;
  normalScale: Uniform<Vector2>;
  envMap: Uniform<Texture | null>;
  envMapIntensity: Uniform<number>;
  uvTransform: Uniform<Matrix3>;
};

export type MeshLambertMaterialOptions = MaterialParameters & {
  color?: number | string | Color;
  emissive?: number | string | Color;
  emissiveIntensity?: number;
  map?: Texture | null;
  alphaMap?: Texture | null;
  aoMap?: Texture | null;
  aoMapIntensity?: number;
  lightMap?: Texture | null;
  lightMapIntensity?: number;
  emissiveMap?: Texture | null;
  specularMap?: Texture | null;
  normalMap?: Texture | null;
  normalScale?: Vector2 | [number, number];
  envMap?: Texture | null;
  envMapIntensity?: number;
  combine?: CombineOperation;
  reflectivity?: number;
  side?: Side;
  wireframe?: boolean;
  vertexColors?: boolean;
  flatShading?: boolean;
  fog?: boolean;
};

/**
 * Per-fragment Lambert (Gouraud-equivalent result, evaluated per pixel).
 *
 * Uniforms: `diffuse`, `opacity`, `emissive`, `diffuseMap`, `alphaMap`,
 * `aoMap`, `aoMapIntensity`, `emissiveMap`, `specularMap`, `normalMap`,
 * `normalScale`, `envMap`, `envMapIntensity`, `uvTransform`, `alphaTest`.
 */
export class MeshLambertMaterial extends Material {
  override kind: MaterialKind = 'lambert';
  readonly isMeshLambertMaterial = true;

  color: Color;
  emissive: Color;
  emissiveIntensity = 1;
  map: Texture | null = null;
  alphaMap: Texture | null = null;
  aoMap: Texture | null = null;
  aoMapIntensity = 1;
  lightMap: Texture | null = null;
  lightMapIntensity = 1;
  emissiveMap: Texture | null = null;
  specularMap: Texture | null = null;
  normalMap: Texture | null = null;
  normalScale: Vector2;
  envMap: Texture | null = null;
  envMapIntensity = 1;
  combine: CombineOperation = MultiplyOperation;
  reflectivity = 1;
  fog = false;

  override uniforms: MeshLambertMaterialUniforms;

  constructor(options: MeshLambertMaterialOptions = {}) {
    super('lambert');
    this.color = new Color(0xffffff);
    this.emissive = new Color(0x000000);
    this.normalScale = new Vector2(1, 1);
    this.uniforms = {
      diffuse: { value: this.color },
      opacity: { value: 1 },
      alphaTest: { value: 0 },
      emissive: { value: this.emissive },
      diffuseMap: { value: null },
      alphaMap: { value: null },
      aoMap: { value: null },
      aoMapIntensity: { value: 1 },
      emissiveMap: { value: null },
      specularMap: { value: null },
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
    if (this.emissiveMap !== null) {
      auto.USE_EMISSIVEMAP = true;
      auto.USE_UV = true;
    }
    if (this.specularMap !== null) {
      auto.USE_SPECULARMAP = true;
      auto.USE_UV = true;
    }
    if (this.normalMap !== null) {
      auto.USE_NORMALMAP = true;
      auto.USE_UV = true;
    }
    if (this.envMap !== null) {
      auto.USE_ENVMAP = true;
      auto.ENVMAP_MODE_REFLECTION = true;
      const mode = this.combine === 'add' ? 'ADD' : this.combine === 'mix' ? 'MIX' : 'MULTIPLY';
      auto[`ENVMAP_BLENDING_${mode}`] = true;
    }
    if (this.vertexColors) auto.USE_COLOR = true;
    if (this.alphaTest > 0) auto.USE_ALPHATEST = true;
    if (this.fog) auto.USE_FOG = true;
    if (this.flatShading) auto.FLAT_SHADED = true;
    return { ...auto, ...this.defines };
  }

  override copy(source: MeshLambertMaterial): this {
    super.copy(source);
    this.color.copy(source.color);
    this.emissive.copy(source.emissive);
    this.emissiveIntensity = source.emissiveIntensity;
    this.map = source.map;
    this.alphaMap = source.alphaMap;
    this.aoMap = source.aoMap;
    this.aoMapIntensity = source.aoMapIntensity;
    this.lightMap = source.lightMap;
    this.lightMapIntensity = source.lightMapIntensity;
    this.emissiveMap = source.emissiveMap;
    this.specularMap = source.specularMap;
    this.normalMap = source.normalMap;
    this.normalScale.copy(source.normalScale);
    this.envMap = source.envMap;
    this.envMapIntensity = source.envMapIntensity;
    this.combine = source.combine;
    this.reflectivity = source.reflectivity;
    this.fog = source.fog;
    this.uniforms.diffuse.value = this.color;
    this.uniforms.opacity.value = this.opacity;
    this.uniforms.emissive.value = this.emissive;
    this.uniforms.diffuseMap.value = this.map;
    this.uniforms.alphaMap.value = this.alphaMap;
    this.uniforms.aoMap.value = this.aoMap;
    this.uniforms.aoMapIntensity.value = this.aoMapIntensity;
    this.uniforms.emissiveMap.value = this.emissiveMap;
    this.uniforms.specularMap.value = this.specularMap;
    this.uniforms.normalMap.value = this.normalMap;
    this.uniforms.normalScale.value = this.normalScale;
    this.uniforms.envMap.value = this.envMap;
    this.uniforms.envMapIntensity.value = this.envMapIntensity;
    this.uniforms.uvTransform.value.copy(source.uniforms.uvTransform.value);
    return this;
  }

  override clone(): MeshLambertMaterial {
    return new MeshLambertMaterial().copy(this);
  }

  /**
   * Keeps `uvTransform` in step with the diffuse texture's `matrix`, which is
   * derived from the texture's `offset` / `repeat` / `center` / `rotation`.
   */
  override refreshUniforms(): void {
    super.refreshUniforms();
  }
}
