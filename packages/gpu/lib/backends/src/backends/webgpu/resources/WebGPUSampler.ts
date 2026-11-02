import { Resource } from '../../../core/Resource';
import type { WebGPUContext } from '../WebGPUContext';

/** WebGPU 采样器。 */
export class WebGPUSampler extends Resource<GPUSampler> {
  readonly descriptor: Readonly<GPUSamplerDescriptor>;

  constructor(_context: WebGPUContext, native: GPUSampler, descriptor: GPUSamplerDescriptor) {
    super(native, { label: descriptor.label });
    this.descriptor = { ...descriptor };
  }

  protected override destroyNative(): void {
    // 采样器由 GC 回收。
  }
}
