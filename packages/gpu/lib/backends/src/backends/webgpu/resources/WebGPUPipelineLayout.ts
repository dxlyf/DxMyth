import { Resource } from '../../../core/Resource';
import type { WebGPUContext } from '../WebGPUContext';

/** WebGPU 管线布局。 */
export class WebGPUPipelineLayout extends Resource<GPUPipelineLayout> {
  constructor(_context: WebGPUContext, native: GPUPipelineLayout, label?: string) {
    super(native, { label });
  }

  protected override destroyNative(): void {
    // 管线布局由 GC 回收。
  }
}
