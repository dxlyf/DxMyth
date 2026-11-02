import { Resource } from '../../../core/Resource';
import type { WebGPUContext } from '../WebGPUContext';

/** 创建着色器模块的描述。 */
export interface ShaderModuleDesc {
  label?: string;
  /** WGSL 源码。 */
  code: string;
}

/** WebGPU 着色器模块。 */
export class WebGPUShaderModule extends Resource<GPUShaderModule> {
  readonly code: string;

  constructor(context: WebGPUContext, native: GPUShaderModule, desc: ShaderModuleDesc) {
    super(native, { label: desc.label });
    this.code = desc.code;
    void context;
  }

  /** 获取编译信息（若驱动提供）。 */
  async getCompilationInfo(): Promise<GPUCompilationInfo> {
    return this.handle.getCompilationInfo();
  }

  protected override destroyNative(): void {
    // 着色器模块没有显式销毁接口，交给 GC。
  }
}
