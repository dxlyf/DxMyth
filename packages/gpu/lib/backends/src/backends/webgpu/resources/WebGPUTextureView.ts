import { Resource } from '../../../core/Resource';
import type { WebGPUContext } from '../WebGPUContext';

/** WebGPU 纹理视图。视图本身没有显式销毁接口。 */
export class WebGPUTextureView extends Resource<GPUTextureView> {
  constructor(_context: WebGPUContext, native: GPUTextureView) {
    super(native);
  }

  protected override destroyNative(): void {
    // 纹理视图由 GC 回收。
  }
}
