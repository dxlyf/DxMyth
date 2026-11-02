import type { WebGPUBindGroup } from '../resources/WebGPUBindGroup';
import type { WebGPUComputePipeline } from '../resources/WebGPUComputePipeline';

/** 高层计算通道，包装 `GPUComputePassEncoder`。 */
export class WebGPUComputePass {
  readonly #native: GPUComputePassEncoder;

  constructor(native: GPUComputePassEncoder) {
    this.#native = native;
  }

  /** 设置管线。 */
  setPipeline(pipeline: WebGPUComputePipeline | GPUComputePipeline): void {
    this.#native.setPipeline(
      pipeline instanceof Object && 'handle' in pipeline
        ? (pipeline as WebGPUComputePipeline).handle
        : (pipeline as GPUComputePipeline),
    );
  }

  /** 设置绑定组。 */
  setBindGroup(
    index: number,
    group: WebGPUBindGroup | GPUBindGroup,
    dynamicOffsets?: Iterable<number>,
  ): void {
    const native =
      group instanceof Object && 'handle' in group
        ? (group as WebGPUBindGroup).handle
        : (group as GPUBindGroup);
    if (dynamicOffsets === undefined) {
      this.#native.setBindGroup(index, native);
    } else {
      this.#native.setBindGroup(index, native, Array.from(dynamicOffsets));
    }
  }

  /** 派发计算。 */
  dispatchWorkgroups(workgroupCountX: number, workgroupCountY = 1, workgroupCountZ = 1): void {
    this.#native.dispatchWorkgroups(workgroupCountX, workgroupCountY, workgroupCountZ);
  }

  /** 结束通道。 */
  end(): void {
    this.#native.end();
  }
}
