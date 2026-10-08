import { Color } from '../math/Color';
import { Matrix3 } from '../math/Matrix3';
import { Material } from './Material';
import type { MaterialParameters, Uniform, Uniforms } from './Material';
import type { Texture } from '../textures/Texture';
import type { MaterialKind } from '../constants';

export type PointsMaterialUniforms = Uniforms & {
  diffuse: Uniform<Color>;
  opacity: Uniform<number>;
  /** Point size in pixels (scaled by perspective when attenuating). */
  size: Uniform<number>;
  alphaTest: Uniform<number>;
  /** Point size in pixels (scaled by perspective when attenuating). */
  sizeAttenuation: Uniform<number>;
  diffuseMap: Uniform<Texture | null>;
  uvTransform: Uniform<Matrix3>;
};

export type PointsMaterialOptions = MaterialParameters & {
  color?: number | string | Color;
  size?: number;
  sizeAttenuation?: boolean;
  map?: Texture | null;
  alphaMap?: Texture | null;
  alphaTest?: number;
  vertexColors?: boolean;
  fog?: boolean;
};

/**
 * Screen-facing point sprites.
 *
 * Uniforms: `diffuse`, `opacity`, `size`, `sizeAttenuation`, `diffuseMap`,
 * `uvTransform`, `alphaTest`.
 */
export class PointsMaterial extends Material {
  override kind: MaterialKind = 'points';
  readonly isMeshPointsMaterial = true;

  color: Color;
  size = 1;
  sizeAttenuation = true;
  map: Texture | null = null;
  alphaMap: Texture | null = null;
  fog = false;

  override uniforms: PointsMaterialUniforms;

  constructor(options: PointsMaterialOptions = {}) {
    super('points');
    this.color = new Color(0xffffff);
    this.uniforms = {
      diffuse: { value: this.color },
      opacity: { value: 1 },
      size: { value: this.size },
      alphaTest: { value: 0 },
      sizeAttenuation: { value: 1 },
      diffuseMap: { value: null },
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
    if (this.vertexColors) auto.USE_COLOR = true;
    if (this.alphaTest > 0) auto.USE_ALPHATEST = true;
    if (this.fog) auto.USE_FOG = true;
    if (this.sizeAttenuation) auto.USE_SIZEATTENUATION = true;
    return { ...auto, ...this.defines };
  }

  override copy(source: PointsMaterial): this {
    super.copy(source);
    this.color.copy(source.color);
    this.size = source.size;
    this.sizeAttenuation = source.sizeAttenuation;
    this.map = source.map;
    this.alphaMap = source.alphaMap;
    this.fog = source.fog;
    this.uniforms.diffuse.value = this.color;
    this.uniforms.opacity.value = this.opacity;
    this.uniforms.size.value = this.size;
    this.uniforms.sizeAttenuation.value = this.sizeAttenuation ? 1 : 0;
    this.uniforms.diffuseMap.value = this.map;
    this.uniforms.uvTransform.value.copy(source.uniforms.uvTransform.value);
    return this;
  }

  override clone(): PointsMaterial {
    return new PointsMaterial().copy(this);
  }

  /**
   * Keeps `uvTransform` in step with the diffuse texture's `matrix`, which is
   * derived from the texture's `offset` / `repeat` / `center` / `rotation`.
   */
  override refreshUniforms(): void {
    super.refreshUniforms();
  }
}
