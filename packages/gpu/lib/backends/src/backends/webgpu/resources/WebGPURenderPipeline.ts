import { Resource } from '../../../core/Resource';
import type { WebGPUContext } from '../WebGPUContext';

/** WebGPU 渲染管线。 */
export class WebGPURenderPipeline extends Resource<GPURenderPipeline> {
  constructor(_context: WebGPUContext, native: GPURenderPipeline, label?: string) {
    super(native, { label });
  }

  /** 获取管线的绑定组布局。 */
  getBindGroupLayout(index: number): GPUBindGroupLayout {
    return this.handle.getBindGroupLayout(index);
  }

  protected override destroyNative(): void {
    // 渲染管线由 GC 回收。
  }
}
