import { Resource } from '../../../core/Resource';
import type { WebGPUContext } from '../WebGPUContext';

/** WebGPU 绑定组布局。 */
export class WebGPUBindGroupLayout extends Resource<GPUBindGroupLayout> {
  constructor(_context: WebGPUContext, native: GPUBindGroupLayout, label?: string) {
    super(native, { label });
  }

  protected override destroyNative(): void {
    // 布局对象由 GC 回收。
  }
}
