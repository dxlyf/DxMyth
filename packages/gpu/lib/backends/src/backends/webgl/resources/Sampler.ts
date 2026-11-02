import type { SamplerDesc } from '../../../core/descriptors';

/** 采样器公共信息。 */
export interface Sampler {
  readonly label: string | undefined;
  readonly desc: Readonly<SamplerDesc>;
}
