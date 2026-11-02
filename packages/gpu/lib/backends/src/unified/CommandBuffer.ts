/** 统一的命令缓冲。WebGL 后端为空对象。 */
export class CommandBuffer {
  readonly label: string | undefined;
  readonly #gpu: GPUCommandBuffer | null;

  /** @internal */
  constructor(gpu: GPUCommandBuffer | null, label?: string) {
    this.#gpu = gpu;
    this.label = label;
  }

  /** WebGPU 原生命令缓冲。 */
  get gpuCommandBuffer(): GPUCommandBuffer | null {
    return this.#gpu;
  }
}
