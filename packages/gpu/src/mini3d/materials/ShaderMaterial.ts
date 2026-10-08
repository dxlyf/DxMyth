import { Material } from './Material';
import type { MaterialParameters, Uniforms } from './Material';
import type { GlslVersion, MaterialKind } from '../constants';

export type ShaderMaterialOptions = MaterialParameters & {
  vertexShader?: string;
  fragmentShader?: string;
  uniforms?: Uniforms;
  defines?: Record<string, string | number | boolean>;
  /** `'100 es'` (WebGL1 style) or `'300 es'`; `null` lets the backend pick. */
  glslVersion?: GlslVersion | null;
  rawShaderMaterial?: boolean;
  lights?: boolean;
  fog?: boolean;
};

/**
 * User-supplied GLSL.
 *
 * Unlike the built-in materials, a `ShaderMaterial` does not get any of the
 * `USE_*` macros derived for it: `defines` and `uniforms` are exactly what the
 * caller passed. The *backends* still bind the frame-level built-in uniforms
 * (`modelMatrix`, `modelViewMatrix`, `projectionMatrix`, `viewMatrix`,
 * `normalMatrix`, `cameraPosition`) plus the standard attributes, because
 * those live in the per-frame/per-object state, not in the material.
 *
 * `RawShaderMaterial` is identical except that even those are omitted.
 */
export class ShaderMaterial extends Material {
  override kind: MaterialKind = 'shader';
  readonly isShaderMaterial = true;

  vertexShader: string;
  fragmentShader: string;

  /** `null` means "let the backend choose the newest dialect it supports". */
  glslVersion: GlslVersion | null = null;
  /** `true` for `RawShaderMaterial`; skips all auto-injected declarations. */
  rawShaderMaterial = false;
  /** When true the backend adds the standard light uniforms to the program. */
  lights = false;
  fog = false;

  override uniforms: Uniforms;

  constructor(options: ShaderMaterialOptions = {}) {
    super('shader');
    this.vertexShader = 'void main() {\n\tgl_Position = vec4( position, 1.0 );\n}';
    this.fragmentShader = 'void main() {\n\tgl_FragColor = vec4( 1.0 );\n}';
    this.uniforms = {};
    this.setValues(options);
  }

  override copy(source: ShaderMaterial): this {
    super.copy(source);
    this.vertexShader = source.vertexShader;
    this.fragmentShader = source.fragmentShader;
    this.glslVersion = source.glslVersion;
    this.rawShaderMaterial = source.rawShaderMaterial;
    this.lights = source.lights;
    this.fog = source.fog;
    return this;
  }

  override clone(): ShaderMaterial {
    return new ShaderMaterial().copy(this);
  }
}
