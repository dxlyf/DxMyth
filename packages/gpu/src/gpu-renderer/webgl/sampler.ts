import { GLCapabilityError } from './errors.js';
import { GLENUM, filterToGL, wrapToGL, type GL, type GLFilter, type GLWrap } from './enums.js';
import type { GLCapabilities } from './caps.js';
import type { GLTexture } from './texture.js';

export interface SamplerDescriptor {
  minFilter?: GLFilter;
  magFilter?: GLFilter;
  wrapS?: GLWrap;
  wrapT?: GLWrap;
  anisotropy?: number;
}

const DEFAULTS: Required<Omit<SamplerDescriptor, 'anisotropy'>> = {
  minFilter: 'linear',
  magFilter: 'linear',
  wrapS: 'clamp-to-edge',
  wrapT: 'clamp-to-edge',
};

/**
 * WebGL2: a native sampler object.
 * WebGL1: a parameter set that the backend writes onto the bound texture
 *         (semantically equivalent, not a degradation).
 */
export class GLSampler {
  readonly handle: WebGLSampler | null;
  readonly minFilter: GLFilter;
  readonly magFilter: GLFilter;
  readonly wrapS: GLWrap;
  readonly wrapT: GLWrap;
  readonly anisotropy: number | undefined;
  private readonly gl: GL;

  constructor(gl: GL, version: 1 | 2, caps: GLCapabilities, desc: SamplerDescriptor = {}) {
    this.gl = gl;
    this.minFilter = desc.minFilter ?? DEFAULTS.minFilter;
    this.magFilter = desc.magFilter ?? DEFAULTS.magFilter;
    this.wrapS = desc.wrapS ?? DEFAULTS.wrapS;
    this.wrapT = desc.wrapT ?? DEFAULTS.wrapT;
    this.anisotropy = desc.anisotropy;

    if (version === 1 || !caps.has('sampler-object')) {
      this.handle = null;
      if (desc.anisotropy !== undefined && !caps.has('anisotropy')) {
        throw new GLCapabilityError('anisotropy', 'anisotropic filtering needs EXT_texture_filter_anisotropic');
      }
      return;
    }

    const gl2 = gl as WebGL2RenderingContext;
    const handle = gl2.createSampler();
    if (!handle) throw new Error('unable to create sampler');
    this.handle = handle;
    gl2.samplerParameteri(handle, GLENUM.TEXTURE_MIN_FILTER, filterToGL(this.minFilter));
    gl2.samplerParameteri(handle, GLENUM.TEXTURE_MAG_FILTER, filterToGL(this.magFilter));
    gl2.samplerParameteri(handle, GLENUM.TEXTURE_WRAP_S, wrapToGL(this.wrapS));
    gl2.samplerParameteri(handle, GLENUM.TEXTURE_WRAP_T, wrapToGL(this.wrapT));
    if (desc.anisotropy !== undefined) {
      const ext = caps.extension<{ MAX_TEXTURE_MAX_ANISOTROPY_EXT: number }>('EXT_texture_filter_anisotropic');
      if (!ext) {
        throw new GLCapabilityError('anisotropy', 'anisotropic filtering needs EXT_texture_filter_anisotropic');
      }
      const max = Number(gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT) ?? 1);
      gl2.samplerParameterf(handle, GLENUM.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(desc.anisotropy, max));
    }
  }

  /** WebGL1 path: apply the parameters to the currently bound texture. */
  applyToTexture(texture: GLTexture): void {
    texture.setParameters({
      minFilter: this.minFilter,
      magFilter: this.magFilter,
      wrapS: this.wrapS,
      wrapT: this.wrapT,
      ...(this.anisotropy !== undefined ? { anisotropy: this.anisotropy } : {}),
    });
  }

  destroy(): void {
    if (this.handle) (this.gl as WebGL2RenderingContext).deleteSampler(this.handle);
  }
}
