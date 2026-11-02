import { Resource } from '../../../core/Resource';
import type { WebGPUContext } from '../WebGPUContext';

/** WebGPU 计算管线。 */
export class WebGPUComputePipeline extends Resource<GPUComputePipeline> {
  constructor(_context: WebGPUContext, native: GPUComputePipeline, label?: string) {
    super(native, { label });
  }

  /** 获取管线的绑定组布局。 */
  getBindGroupLayout(index: number): GPUBindGroupLayout {
    return this.handle.getBindGroupLayout(index);
  }

  protected override destroyNative(): void {
    // 计算管线由 GC 回收。
  }
}
