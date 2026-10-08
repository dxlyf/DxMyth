import { Color } from '../math/Color';
import { Material } from './Material';
import type { MaterialParameters, Uniform, Uniforms } from './Material';
import type { MaterialKind } from '../constants';

export type LineBasicMaterialUniforms = Uniforms & {
  diffuse: Uniform<Color>;
  opacity: Uniform<number>;
  alphaTest: Uniform<number>;
};

export type LineBasicMaterialOptions = MaterialParameters & {
  color?: number | string | Color;
  /**
   * Line width in pixels. Stored for API parity, but neither WebGL nor
   * WebGPU can honour values other than 1 in portable code, so backends
   * ignore it.
   */
  linewidth?: number;
  vertexColors?: boolean;
  fog?: boolean;
};

/**
 * Vertex-coloured (optionally) unlit lines.
 *
 * Uniforms: `diffuse`, `opacity`, `alphaTest`.
 */
export class LineBasicMaterial extends Material {
  override kind: MaterialKind = 'line';
  readonly isMeshLineBasicMaterial = true;

  color: Color;
  /** Ignored by the backends; `gl.lineWidth` is capped at 1 nearly everywhere. */
  linewidth = 1;
  fog = false;

  override uniforms: LineBasicMaterialUniforms;

  constructor(options: LineBasicMaterialOptions = {}) {
    super('line');
    this.color = new Color(0xffffff);
    this.uniforms = {
      diffuse: { value: this.color },
      opacity: { value: 1 },
      alphaTest: { value: 0 },
    };
    this.setValues(options);
  }

  override getDefines(): Record<string, string | number | boolean> {
    const auto: Record<string, string | number | boolean> = {};
    if (this.vertexColors) auto.USE_COLOR = true;
    if (this.alphaTest > 0) auto.USE_ALPHATEST = true;
    if (this.fog) auto.USE_FOG = true;
    return { ...auto, ...this.defines };
  }

  override copy(source: LineBasicMaterial): this {
    super.copy(source);
    this.color.copy(source.color);
    this.linewidth = source.linewidth;
    this.fog = source.fog;
    this.uniforms.diffuse.value = this.color;
    this.uniforms.opacity.value = this.opacity;
    return this;
  }

  override clone(): LineBasicMaterial {
    return new LineBasicMaterial().copy(this);
  }
}
