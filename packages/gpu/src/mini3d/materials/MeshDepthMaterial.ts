import { Material } from './Material';
import type { MaterialParameters, Uniform, Uniforms } from './Material';
import { BasicDepthPacking } from '../constants';
import type { DepthPacking, MaterialKind } from '../constants';

export type MeshDepthMaterialUniforms = Uniforms & {
  opacity: Uniform<number>;
  alphaTest: Uniform<number>;
  /** Camera near/far, exposed for backends that linearise depth manually. */
  near: Uniform<number>;
  far: Uniform<number>;
};

export type MeshDepthMaterialOptions = MaterialParameters & {
  depthPacking?: DepthPacking;
  near?: number;
  far?: number;
  side?: MaterialParameters['side'];
  wireframe?: boolean;
  alphaTest?: number;
};

/**
 * Writes depth to the framebuffer. With `depthPacking: 'basic'` the red
 * channel gets `1 - gl_FragCoord.z`; with `'rgba'` it is packed into RGBA so
 * 32-bit precision survives an 8-bit framebuffer.
 *
 * Uniforms: `opacity`, `near`, `far`.
 */
export class MeshDepthMaterial extends Material {
  override kind: MaterialKind = 'depth';
  readonly isMeshDepthMaterial = true;

  depthPacking: DepthPacking = BasicDepthPacking;
  /** Placeholder camera planes; the built-in shaders use NDC depth. */
  near = 0.1;
  far = 2000;

  override uniforms: MeshDepthMaterialUniforms;

  constructor(options: MeshDepthMaterialOptions = {}) {
    super('depth');
    this.uniforms = {
      opacity: { value: 1 },
      alphaTest: { value: 0 },
      near: { value: this.near },
      far: { value: this.far },
    };
    this.setValues(options);
  }

  override getDefines(): Record<string, string | number | boolean> {
    const auto: Record<string, string | number | boolean> = {};
    if (this.depthPacking === 'rgba') auto.DEPTH_PACKING_RGBA = true;
    if (this.alphaTest > 0) auto.USE_ALPHATEST = true;
    if (this.vertexColors) auto.USE_COLOR = true;
    return { ...auto, ...this.defines };
  }

  override copy(source: MeshDepthMaterial): this {
    super.copy(source);
    this.depthPacking = source.depthPacking;
    this.near = source.near;
    this.far = source.far;
    this.uniforms.opacity.value = this.opacity;
    this.uniforms.near.value = this.near;
    this.uniforms.far.value = this.far;
    return this;
  }

  override clone(): MeshDepthMaterial {
    return new MeshDepthMaterial().copy(this);
  }
}
