import type { WebGPUComputePass } from '../backends/webgpu/command/WebGPUComputePass';
import { ValidationError } from '../core/errors';
import type { BindGroup } from './BindGroup';
import type { ComputePipeline } from './RenderPipeline';
import type { Device } from './Device';

/** 统一的计算通道；仅 WebGPU 支持。 */
export class ComputePassEncoder {
  readonly label: string | undefined;
  readonly #device: Device;
  readonly #gpu: WebGPUComputePass;
  #pipeline: ComputePipeline | null = null;
  #ended = false;

  /** @internal 由 CommandEncoder 创建。 */
  constructor(device: Device, pass: WebGPUComputePass, label?: string) {
    this.#device = device;
    this.#gpu = pass;
    this.label = label;
  }

  /** 设置计算管线。 */
  setPipeline(pipeline: ComputePipeline): void {
    this.#assertOpen();
    this.#pipeline = pipeline;
    this.#gpu.setPipeline(pipeline.gpuPipeline!);
  }

  /** 设置绑定组。 */
  setBindGroup(index: number, group: BindGroup): void {
    this.#assertOpen();
    this.#gpu.setBindGroup(index, group.gpuBindGroup!);
  }

  /** 派发计算工作。 */
  dispatchWorkgroups(x: number, y = 1, z = 1): void {
    this.#assertOpen();
    if (this.#pipeline === null) {
      throw new ValidationError('dispatchWorkgroups 前需要 setPipeline');
    }
    this.#gpu.dispatchWorkgroups(x, y, z);
  }

  /** 结束计算通道。 */
  end(): void {
    if (this.#ended) {
      return;
    }
    this.#ended = true;
    this.#gpu.end();
  }

  #assertOpen(): void {
    if (this.#ended) {
      throw new ValidationError('计算通道已经结束');
    }
  }

  /** @internal */
  get device(): Device {
    return this.#device;
  }
}
