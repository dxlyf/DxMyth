import type { WebGPUShaderModule } from '../backends/webgpu/resources/WebGPUShaderModule';
import { BackendKind } from '../core/enums';
import { ValidationError } from '../core/errors';
import type { Device } from './Device';
import type { GlslShaderPair, ShaderModuleDescriptor } from './types';

/** 统一定义跨后端着色器模块。 */
export class ShaderModule {
  readonly label: string | undefined;
  readonly #device: Device;
  readonly #gpu: WebGPUShaderModule | null;
  readonly #glsl: GlslShaderPair | null;
  readonly #glsl2: GlslShaderPair | null;
  #destroyed = false;

  /** @internal 由 Device 创建。 */
  constructor(device: Device, desc: ShaderModuleDescriptor, gpu: WebGPUShaderModule | null) {
    this.#device = device;
    this.label = desc.label;
    this.#gpu = gpu;
    this.#glsl = desc.code.glsl ?? null;
    this.#glsl2 = desc.code.glsl2 ?? null;
  }

  /** WebGPU 原生模块。 */
  get gpuModule(): WebGPUShaderModule | null {
    return this.#gpu;
  }

  /** 按后端选择 GLSL 源码。 */
  glslFor(backend: BackendKind): GlslShaderPair {
    const sources = backend === BackendKind.WebGL2 ? (this.#glsl2 ?? this.#glsl) : this.#glsl;
    if (sources === null) {
      throw new ValidationError(
        backend === BackendKind.WebGL2
          ? 'WebGL2 着色器需要 code.glsl2 或 code.glsl'
          : 'WebGL1 着色器需要 code.glsl',
      );
    }
    return sources;
  }

  /** 销毁模块；幂等。 */
  destroy(): void {
    if (this.#destroyed) {
      return;
    }
    this.#destroyed = true;
    this.#gpu?.destroy();
  }

  /** @internal */
  get device(): Device {
    return this.#device;
  }
}
