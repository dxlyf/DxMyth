import { Resource } from '../../../core/Resource';
import type { WebGPUContext } from '../WebGPUContext';

/** WebGPU 绑定组。 */
export class WebGPUBindGroup extends Resource<GPUBindGroup> {
  constructor(_context: WebGPUContext, native: GPUBindGroup, label?: string) {
    super(native, { label });
  }

  protected override destroyNative(): void {
    // 绑定组由 GC 回收。
  }
}
