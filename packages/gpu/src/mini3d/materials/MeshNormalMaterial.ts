import { Material } from './Material';
import type { MaterialParameters, Uniform, Uniforms } from './Material';
import type { MaterialKind } from '../constants';

export type MeshNormalMaterialUniforms = Uniforms & {
  opacity: Uniform<number>;
  alphaTest: Uniform<number>;
};

export type MeshNormalMaterialOptions = MaterialParameters & {
  side?: MaterialParameters['side'];
  wireframe?: boolean;
  flatShading?: boolean;
  fog?: boolean;
};

/**
 * Debug material that paints the view-space shading normal as RGB
 * (`normal * 0.5 + 0.5`). It has no colour of its own.
 *
 * Uniforms: `opacity`.
 */
export class MeshNormalMaterial extends Material {
  override kind: MaterialKind = 'normal';
  readonly isMeshNormalMaterial = true;

  fog = false;

  override uniforms: MeshNormalMaterialUniforms;

  constructor(options: MeshNormalMaterialOptions = {}) {
    super('normal');
    this.uniforms = {
      opacity: { value: 1 },
      alphaTest: { value: 0 },
    };
    this.setValues(options);
  }

  override getDefines(): Record<string, string | number | boolean> {
    const auto: Record<string, string | number | boolean> = {};
    if (this.fog) auto.USE_FOG = true;
    if (this.flatShading) auto.FLAT_SHADED = true;
    return { ...auto, ...this.defines };
  }

  override copy(source: MeshNormalMaterial): this {
    super.copy(source);
    this.fog = source.fog;
    this.uniforms.opacity.value = this.opacity;
    return this;
  }

  override clone(): MeshNormalMaterial {
    return new MeshNormalMaterial().copy(this);
  }
}
