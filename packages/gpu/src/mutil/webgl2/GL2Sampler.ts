import {
  GL_COMPARE_REF_TO_TEXTURE,
  GL_TEXTURE_COMPARE_FUNC,
  GL_TEXTURE_COMPARE_MODE,
  GL_TEXTURE_MAG_FILTER,
  GL_TEXTURE_MAX_ANISOTROPY_EXT,
  GL_TEXTURE_MIN_FILTER,
  GL_TEXTURE_WRAP_S,
  GL_TEXTURE_WRAP_T,
} from './constants.js';
import { GL2DisposedError } from './errors.js';
import { compareFunc, textureFilter, textureWrap } from './mappings.js';
import type { GL2SamplerOptions, GL2Stats } from './types.js';

function normalize(options: GL2SamplerOptions): Required<Omit<GL2SamplerOptions, 'anisotropy'>> & { anisotropy: number } {
  return {
    minFilter: options.minFilter ?? 'linear',
    magFilter: options.magFilter ?? 'linear',
    wrapS: options.wrapS ?? 'clamp-to-edge',
    wrapT: options.wrapT ?? 'clamp-to-edge',
    compareFunc: options.compareFunc ?? 'always',
    anisotropy: options.anisotropy ?? 0,
  };
}

function samplerKey(options: GL2SamplerOptions, maxAnisotropy: number): string {
  const n = normalize(options);
  const anisotropy = Math.min(Math.max(n.anisotropy, 0), maxAnisotropy);
  return `${n.minFilter}|${n.magFilter}|${n.wrapS}|${n.wrapT}|${n.compareFunc}|${anisotropy}`;
}

/**
 * A WebGL2 sampler object. Sampler objects move filtering/wrapping out of the
 * texture, so switching sampler state never requires a texture re-bind and
 * never re-specifies texture parameters.
 */
export class GL2Sampler {
  readonly handle: WebGLSampler;
  readonly options: Readonly<GL2SamplerOptions>;
  readonly key: string;

  constructor(handle: WebGLSampler, options: Readonly<GL2SamplerOptions>, key: string) {
    this.handle = handle;
    this.options = options;
    this.key = key;
  }
}

/** Caches sampler objects by their resolved state. */
export class GL2SamplerCache {
  private readonly gl: WebGL2RenderingContext;
  private readonly stats: GL2Stats;
  private readonly samplers = new Map<string, GL2Sampler>();
  private readonly maxAnisotropy: number;
  private readonly anisotropyExt: EXT_texture_filter_anisotropic | null;
  private disposedFlag = false;

  constructor(gl: WebGL2RenderingContext, stats: GL2Stats) {
    this.gl = gl;
    this.stats = stats;
    this.anisotropyExt = gl.getExtension('EXT_texture_filter_anisotropic');
    this.maxAnisotropy = this.anisotropyExt
      ? (gl.getParameter(this.anisotropyExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number)
      : 1;
  }

  get(options: GL2SamplerOptions = {}): GL2Sampler {
    if (this.disposedFlag) throw new GL2DisposedError('GL2SamplerCache');
    const key = samplerKey(options, this.maxAnisotropy);
    const existing = this.samplers.get(key);
    if (existing) {
      this.stats.samplerCacheHits++;
      return existing;
    }
    const normalized = normalize(options);
    const handle = this.gl.createSampler();
    if (!handle) throw new Error('Failed to create WebGL2 sampler');
    const gl = this.gl;
    gl.samplerParameteri(handle, GL_TEXTURE_MIN_FILTER, textureFilter(normalized.minFilter));
    gl.samplerParameteri(handle, GL_TEXTURE_MAG_FILTER, textureFilter(normalized.magFilter));
    gl.samplerParameteri(handle, GL_TEXTURE_WRAP_S, textureWrap(normalized.wrapS));
    gl.samplerParameteri(handle, GL_TEXTURE_WRAP_T, textureWrap(normalized.wrapT));
    if (normalized.compareFunc !== 'always') {
      gl.samplerParameteri(handle, GL_TEXTURE_COMPARE_MODE, GL_COMPARE_REF_TO_TEXTURE);
      gl.samplerParameteri(handle, GL_TEXTURE_COMPARE_FUNC, compareFunc(normalized.compareFunc));
    }
    if (this.anisotropyExt && normalized.anisotropy > 1) {
      gl.samplerParameterf(handle, GL_TEXTURE_MAX_ANISOTROPY_EXT, Math.min(normalized.anisotropy, this.maxAnisotropy));
    }
    this.stats.samplersCreated++;
    this.stats.glCalls += 6;
    const sampler = new GL2Sampler(handle, { ...options }, key);
    this.samplers.set(key, sampler);
    return sampler;
  }

  get size(): number {
    return this.samplers.size;
  }

  dispose(): void {
    if (this.disposedFlag) return;
    this.disposedFlag = true;
    for (const sampler of this.samplers.values()) this.gl.deleteSampler(sampler.handle);
    this.samplers.clear();
  }
}
