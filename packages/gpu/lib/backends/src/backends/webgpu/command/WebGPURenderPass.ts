import type { WebGPUBindGroup } from '../resources/WebGPUBindGroup';
import type { WebGPUBuffer } from '../resources/WebGPUBuffer';
import type { WebGPURenderPipeline } from '../resources/WebGPURenderPipeline';

/** 高层渲染通道，包装 `GPURenderPassEncoder`。 */
export class WebGPURenderPass {
  readonly #native: GPURenderPassEncoder;

  constructor(native: GPURenderPassEncoder) {
    this.#native = native;
  }

  /** 设置管线。 */
  setPipeline(pipeline: WebGPURenderPipeline | GPURenderPipeline): void {
    this.#native.setPipeline(
      pipeline instanceof Object && 'handle' in pipeline
        ? (pipeline as WebGPURenderPipeline).handle
        : (pipeline as GPURenderPipeline),
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

  /** 设置顶点缓冲。 */
  setVertexBuffer(
    slot: number,
    buffer: WebGPUBuffer | GPUBuffer,
    offset?: number,
    size?: number,
  ): void {
    const native =
      buffer instanceof Object && 'handle' in buffer
        ? (buffer as WebGPUBuffer).handle
        : (buffer as GPUBuffer);
    this.#native.setVertexBuffer(slot, native, offset, size);
  }

  /** 设置索引缓冲。 */
  setIndexBuffer(
    buffer: WebGPUBuffer | GPUBuffer,
    format: GPUIndexFormat,
    offset?: number,
    size?: number,
  ): void {
    const native =
      buffer instanceof Object && 'handle' in buffer
        ? (buffer as WebGPUBuffer).handle
        : (buffer as GPUBuffer);
    this.#native.setIndexBuffer(native, format, offset, size);
  }

  /** 绘制。 */
  draw(vertexCount: number, instanceCount = 1, firstVertex = 0, firstInstance = 0): void {
    this.#native.draw(vertexCount, instanceCount, firstVertex, firstInstance);
  }

  /** 索引绘制。 */
  drawIndexed(
    indexCount: number,
    instanceCount = 1,
    firstIndex = 0,
    baseVertex = 0,
    firstInstance = 0,
  ): void {
    this.#native.drawIndexed(indexCount, instanceCount, firstIndex, baseVertex, firstInstance);
  }

  /** 设置视口。 */
  setViewport(
    x: number,
    y: number,
    width: number,
    height: number,
    minDepth = 0,
    maxDepth = 1,
  ): void {
    this.#native.setViewport(x, y, width, height, minDepth, maxDepth);
  }

  /** 设置裁剪矩形。 */
  setScissorRect(x: number, y: number, width: number, height: number): void {
    this.#native.setScissorRect(x, y, width, height);
  }

  /** 结束通道。 */
  end(): void {
    this.#native.end();
  }
}
