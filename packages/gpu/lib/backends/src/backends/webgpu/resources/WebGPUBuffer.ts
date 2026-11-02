import type { BufferDesc } from '../../../core/descriptors';
import { Resource } from '../../../core/Resource';
import type { WebGPUContext } from '../WebGPUContext';

/** WebGPU 缓冲区封装。 */
export class WebGPUBuffer extends Resource<GPUBuffer> {
  readonly size: number;
  readonly usage: number;
  readonly #context: WebGPUContext;

  constructor(context: WebGPUContext, native: GPUBuffer, desc: BufferDesc, size: number) {
    super(native, { label: desc.label });
    this.#context = context;
    this.size = size;
    this.usage = native.usage;
  }

  /** 从 CPU 写入数据。 */
  write(data: ArrayBufferView, offset = 0): void {
    this.#context.device.queue.writeBuffer(
      this.handle,
      offset,
      data.buffer,
      data.byteOffset,
      data.byteLength,
    );
  }

  /** 映射缓冲区；默认 `GPUMapMode.READ`（值为 1）。 */
  async mapAsync(mode = 1): Promise<void> {
    await this.handle.mapAsync(mode);
  }

  /** 获取映射区间。 */
  getMappedRange(offset = 0, size?: number): ArrayBuffer {
    return this.handle.getMappedRange(offset, size);
  }

  /** 解除映射。 */
  unmap(): void {
    this.handle.unmap();
  }

  protected override destroyNative(native: GPUBuffer): void {
    native.destroy();
  }
}
