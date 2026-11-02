import type { WebGPUPipelineLayout } from '../backends/webgpu/resources/WebGPUPipelineLayout';
import { BackendKind } from '../core/enums';
import { ValidationError } from '../core/errors';
import type { Device } from './Device';
import type { BindGroupLayout } from './BindGroupLayout';
import type { PipelineLayoutDescriptor } from './types';

/** 统一的管线布局。 */
export class PipelineLayout {
  readonly label: string | undefined;
  readonly bindGroupLayouts: readonly BindGroupLayout[];
  readonly #device: Device;
  readonly #gpu: WebGPUPipelineLayout | null;
  #destroyed = false;

  /** @internal 由 Device 创建。 */
  constructor(device: Device, desc: PipelineLayoutDescriptor) {
    this.#device = device;
    this.label = desc.label;
    this.bindGroupLayouts = [...desc.bindGroupLayouts];
    if (device.backend === BackendKind.WebGPU) {
      this.#gpu = device.gpuContext.createPipelineLayout({
        label: desc.label,
        bindGroupLayouts: this.bindGroupLayouts.map((layout) => {
          if (layout.gpuLayout === null) {
            throw new ValidationError('WebGPU 绑定组布局不可用');
          }
          return layout.gpuLayout.handle;
        }),
      });
    } else {
      this.#gpu = null;
    }
  }

  /** WebGPU 原生管线布局。 */
  get gpuLayout(): WebGPUPipelineLayout | null {
    return this.#gpu;
  }

  /** 销毁布局；幂等。 */
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
