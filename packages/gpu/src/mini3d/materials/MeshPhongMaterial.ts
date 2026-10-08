import { Color } from '../math/Color';
import { Matrix3 } from '../math/Matrix3';
import { Vector2 } from '../math/Vector2';
import { Material } from './Material';
import type { MaterialParameters, Uniform, Uniforms } from './Material';
import type { Texture } from '../textures/Texture';
import { MultiplyOperation } from '../constants';
import type { CombineOperation, MaterialKind, Side } from '../constants';

export type MeshPhongMaterialUniforms = Uniforms & {
  diffuse: Uniform<Color>;
  opacity: Uniform<number>;
  alphaTest: Uniform<number>;
  emissive: Uniform<Color>;
  specular: Uniform<Color>;
  shininess: Uniform<number>;
  diffuseMap: Uniform<Texture | null>;
  alphaMap: Uniform<Texture | null>;
  aoMap: Uniform<Texture | null>;
  aoMapIntensity: Uniform<number>;
  specularMap: Uniform<Texture | null>;
  emissiveMap: Uniform<Texture | null>;
  normalMap: Uniform<Texture | null>;
  normalScale: Uniform<Vector2>;
  displacementMap: Uniform<Texture | null>;
  displacementScale: Uniform<number>;
  displacementBias: Uniform<number>;
  envMap: Uniform<Texture | null>;
  envMapIntensity: Uniform<number>;
  uvTransform: Uniform<Matrix3>;
};

export type MeshPhongMaterialOptions = MaterialParameters & {
  color?: number | string | Color;
  emissive?: number | string | Color;
  emissiveIntensity?: number;
  specular?: number | string | Color;
  shininess?: number;
  map?: Texture | null;
  alphaMap?: Texture | null;
  aoMap?: Texture | null;
  aoMapIntensity?: number;
  lightMap?: Texture | null;
  lightMapIntensity?: number;
  specularMap?: Texture | null;
  emissiveMap?: Texture | null;
  normalMap?: Texture | null;
  normalScale?: Vector2 | [number, number];
  displacementMap?: Texture | null;
  displacementScale?: number;
  displacementBias?: number;
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
 * Blinn-Phong: Lambert diffuse + a `shininess`-driven specular lobe.
 *
 * Uniforms: `diffuse`, `opacity`, `emissive`, `specular`, `shininess`,
 * `diffuseMap`, `alphaMap`, `aoMap`, `aoMapIntensity`, `specularMap`,
 * `emissiveMap`, `normalMap`, `normalScale`, `displacementMap`,
 * `displacementScale`, `displacementBias`, `envMap`, `envMapIntensity`,
 * `uvTransform`, `alphaTest`.
 */
export class MeshPhongMaterial extends Material {
  override kind: MaterialKind = 'phong';
  readonly isMeshPhongMaterial = true;

  color: Color;
  emissive: Color;
  emissiveIntensity = 1;
  specular: Color;
  shininess = 30;
  map: Texture | null = null;
  alphaMap: Texture | null = null;
  aoMap: Texture | null = null;
  aoMapIntensity = 1;
  lightMap: Texture | null = null;
  lightMapIntensity = 1;
  specularMap: Texture | null = null;
  emissiveMap: Texture | null = null;
  normalMap: Texture | null = null;
  normalScale: Vector2;
  displacementMap: Texture | null = null;
  displacementScale = 1;
  displacementBias = 0;
  envMap: Texture | null = null;
  envMapIntensity = 1;
  combine: CombineOperation = MultiplyOperation;
  reflectivity = 1;
  fog = false;

  override uniforms: MeshPhongMaterialUniforms;

  constructor(options: MeshPhongMaterialOptions = {}) {
    super('phong');
    this.color = new Color(0xffffff);
    this.emissive = new Color(0x000000);
    this.specular = new Color(0x111111);
    this.normalScale = new Vector2(1, 1);
    this.uniforms = {
      diffuse: { value: this.color },
      opacity: { value: 1 },
      alphaTest: { value: 0 },
      emissive: { value: this.emissive },
      specular: { value: this.specular },
      shininess: { value: this.shininess },
      diffuseMap: { value: null },
      alphaMap: { value: null },
      aoMap: { value: null },
      aoMapIntensity: { value: 1 },
      specularMap: { value: null },
      emissiveMap: { value: null },
      normalMap: { value: null },
      normalScale: { value: this.normalScale },
      displacementMap: { value: null },
      displacementScale: { value: this.displacementScale },
      displacementBias: { value: this.displacementBias },
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
    if (this.specularMap !== null) {
      auto.USE_SPECULARMAP = true;
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
    if (this.displacementMap !== null) {
      auto.USE_DISPLACEMENTMAP = true;
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

  override copy(source: MeshPhongMaterial): this {
    super.copy(source);
    this.color.copy(source.color);
    this.emissive.copy(source.emissive);
    this.emissiveIntensity = source.emissiveIntensity;
    this.specular.copy(source.specular);
    this.shininess = source.shininess;
    this.map = source.map;
    this.alphaMap = source.alphaMap;
    this.aoMap = source.aoMap;
    this.aoMapIntensity = source.aoMapIntensity;
    this.lightMap = source.lightMap;
    this.lightMapIntensity = source.lightMapIntensity;
    this.specularMap = source.specularMap;
    this.emissiveMap = source.emissiveMap;
    this.normalMap = source.normalMap;
    this.normalScale.copy(source.normalScale);
    this.displacementMap = source.displacementMap;
    this.displacementScale = source.displacementScale;
    this.displacementBias = source.displacementBias;
    this.envMap = source.envMap;
    this.envMapIntensity = source.envMapIntensity;
    this.combine = source.combine;
    this.reflectivity = source.reflectivity;
    this.fog = source.fog;
    this.uniforms.diffuse.value = this.color;
    this.uniforms.opacity.value = this.opacity;
    this.uniforms.emissive.value = this.emissive;
    this.uniforms.specular.value = this.specular;
    this.uniforms.shininess.value = this.shininess;
    this.uniforms.diffuseMap.value = this.map;
    this.uniforms.alphaMap.value = this.alphaMap;
    this.uniforms.aoMap.value = this.aoMap;
    this.uniforms.aoMapIntensity.value = this.aoMapIntensity;
    this.uniforms.specularMap.value = this.specularMap;
    this.uniforms.emissiveMap.value = this.emissiveMap;
    this.uniforms.normalMap.value = this.normalMap;
    this.uniforms.normalScale.value = this.normalScale;
    this.uniforms.displacementMap.value = this.displacementMap;
    this.uniforms.displacementScale.value = this.displacementScale;
    this.uniforms.displacementBias.value = this.displacementBias;
    this.uniforms.envMap.value = this.envMap;
    this.uniforms.envMapIntensity.value = this.envMapIntensity;
    this.uniforms.uvTransform.value.copy(source.uniforms.uvTransform.value);
    return this;
  }

  override clone(): MeshPhongMaterial {
    return new MeshPhongMaterial().copy(this);
  }

  /**
   * Keeps `uvTransform` in step with the diffuse texture's `matrix`, which is
   * derived from the texture's `offset` / `repeat` / `center` / `rotation`.
   */
  override refreshUniforms(): void {
    super.refreshUniforms();
  }
}
