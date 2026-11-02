import type { SamplerDesc } from '../../../core/descriptors';
import { BackendError } from '../../../core/errors';
import { Resource } from '../../../core/Resource';
import type { NativeSampler } from '../../webgl/native';
import type { Sampler } from '../../webgl/resources/Sampler';
import { addressMode, compareFunction, filterMode, minFilter } from '../../webgl/util/glEnums';
import type { WebGL2Context } from '../WebGL2Context';

/** WebGL2 原生采样器对象。 */
export class WebGL2Sampler extends Resource<NativeSampler> implements Sampler {
  readonly desc: Readonly<SamplerDesc>;
  readonly #context: WebGL2Context;

  constructor(context: WebGL2Context, native: NativeSampler, desc: SamplerDesc = {}) {
    super(native, { label: desc.label });
    this.#context = context;
    this.desc = { ...desc };
    this.#apply(native);
  }

  /** 绑定到纹理单元。 */
  bind(unit: number): void {
    this.#context.gl2.bindSampler(unit, this.handle);
  }

  /** 解绑纹理单元。 */
  unbind(unit: number): void {
    this.#context.gl2.bindSampler(unit, null);
  }

  /** 创建参数，供上下文恢复使用。 */
  get descriptor(): Readonly<SamplerDesc> {
    return this.desc;
  }

  /** 上下文恢复：重新创建采样器并写入参数。 */
  override restore(): void {
    const native = this.#context.gl2.createSampler();
    if (native === null) {
      throw new BackendError('恢复采样器失败', { code: 'ERR_WEBGL' });
    }
    try {
      this.#apply(native);
    } catch (error) {
      this.#context.gl2.deleteSampler(native);
      throw error;
    }
    this.markRestored(native);
  }

  #apply(native: NativeSampler): void {
    const gl = this.#context.gl2;
    const base = gl as unknown as WebGLRenderingContext;
    const desc = this.desc;
    gl.samplerParameteri(
      native,
      gl.TEXTURE_MIN_FILTER,
      minFilter(base, desc.minFilter ?? 'linear', desc.mipmapFilter),
    );
    gl.samplerParameteri(
      native,
      gl.TEXTURE_MAG_FILTER,
      filterMode(base, desc.magFilter ?? 'linear'),
    );
    gl.samplerParameteri(
      native,
      gl.TEXTURE_WRAP_S,
      addressMode(base, desc.addressModeU ?? 'clamp-to-edge'),
    );
    gl.samplerParameteri(
      native,
      gl.TEXTURE_WRAP_T,
      addressMode(base, desc.addressModeV ?? 'clamp-to-edge'),
    );
    if (desc.compare !== undefined) {
      gl.samplerParameteri(native, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
      gl.samplerParameteri(native, gl.TEXTURE_COMPARE_FUNC, compareFunction(base, desc.compare));
    }
    if (desc.lodMinClamp !== undefined) {
      gl.samplerParameterf(native, gl.TEXTURE_MIN_LOD, desc.lodMinClamp);
    }
    if (desc.lodMaxClamp !== undefined) {
      gl.samplerParameterf(native, gl.TEXTURE_MAX_LOD, desc.lodMaxClamp);
    }
    const anisotropy = this.#context.extensions.anisotropicFiltering;
    if (desc.maxAnisotropy !== undefined && anisotropy !== null) {
      gl.samplerParameterf(native, anisotropy.TEXTURE_MAX_ANISOTROPY_EXT, desc.maxAnisotropy);
    }
  }

  protected override destroyNative(native: NativeSampler): void {
    this.#context.gl2.deleteSampler(native);
  }
}
