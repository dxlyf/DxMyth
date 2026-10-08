import { ShaderMaterial } from './ShaderMaterial';
import type { ShaderMaterialOptions } from './ShaderMaterial';
import type { MaterialKind } from '../constants';

export type RawShaderMaterialOptions = ShaderMaterialOptions;

/**
 * Exactly like `ShaderMaterial`, except that the backend injects **nothing**
 * into the source before compiling it:
 *
 * - no `attribute`/`varying`/`uniform` declarations for `position`, `normal`,
 *   `uv`, `color`, `modelMatrix`, `modelViewMatrix`, `projectionMatrix`,
 *   `viewMatrix`, `normalMatrix` or `cameraPosition`;
 * - no `USE_*` / light-count defines;
 * - no `#version` / precision prologue beyond what the caller writes.
 *
 * The source must therefore be a complete, compilable shader for the dialect
 * named by `glslVersion`. This is the only difference from `ShaderMaterial`.
 */
export class RawShaderMaterial extends ShaderMaterial {
  override kind: MaterialKind = 'raw-shader';
  readonly isRawShaderMaterial = true;

  /** Always `true`; present so the flag survives a round trip to JSON. */
  override rawShaderMaterial = true;

  override clone(): RawShaderMaterial {
    return new RawShaderMaterial().copy(this);
  }

  override copy(source: ShaderMaterial): this {
    super.copy(source);
    this.rawShaderMaterial = true;
    return this;
  }
}
