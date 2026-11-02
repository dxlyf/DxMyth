import type { SamplerDesc } from '../../../core/descriptors';
import { UnsupportedError, ValidationError } from '../../../core/errors';
import { addressMode, filterMode, minFilter } from '../util/glEnums';
import type { Sampler } from './Sampler';

/**
 * WebGL1 采样器。
 *
 * WebGL1 没有采样器对象，采样状态直接存储在纹理上。这里只保存参数，
 * 由 {@link WebGLSampler.apply} 在绑定时写入纹理。
 */
export class WebGLSampler implements Sampler {
  readonly label: string | undefined;
  readonly desc: Readonly<SamplerDesc>;

  constructor(desc: SamplerDesc = {}) {
    const lodMin = desc.lodMinClamp ?? 0;
    const lodMax = desc.lodMaxClamp ?? 1000;
    if (lodMin > lodMax) {
      throw new ValidationError(`lodMinClamp 不能大于 lodMaxClamp：${lodMin} > ${lodMax}`);
    }
    this.label = desc.label;
    this.desc = { ...desc };
  }

  /** 把采样参数写入当前绑定的纹理。 */
  apply(gl: WebGLRenderingContext, target: number): void {
    const desc = this.desc;
    if (desc.compare !== undefined) {
      throw new UnsupportedError('比较采样器（WebGL1）', 'webgl');
    }
    gl.texParameteri(
      target,
      gl.TEXTURE_MIN_FILTER,
      minFilter(gl, desc.minFilter ?? 'linear', desc.mipmapFilter),
    );
    gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, filterMode(gl, desc.magFilter ?? 'linear'));
    gl.texParameteri(
      target,
      gl.TEXTURE_WRAP_S,
      addressMode(gl, desc.addressModeU ?? 'clamp-to-edge'),
    );
    gl.texParameteri(
      target,
      gl.TEXTURE_WRAP_T,
      addressMode(gl, desc.addressModeV ?? 'clamp-to-edge'),
    );
  }
}
