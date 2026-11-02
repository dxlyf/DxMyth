import { Resource } from '../../../core/Resource';
import type { WebGPUContext } from '../WebGPUContext';
import { WebGPUComputePass } from './WebGPUComputePass';
import { WebGPURenderPass } from './WebGPURenderPass';

type MaybeHandle<T> = T | { readonly handle: T };

function nativeHandle<T>(value: MaybeHandle<T>): T {
  return value instanceof Object && 'handle' in value
    ? (value as { readonly handle: T }).handle
    : (value as T);
}

/** WebGPU 命令编码器。 */
export class WebGPUCommandEncoder extends Resource<GPUCommandEncoder> {
  constructor(_context: WebGPUContext, native: GPUCommandEncoder, label?: string) {
    super(native, { label });
  }

  /** 开始渲染通道。 */
  beginRenderPass(desc: GPURenderPassDescriptor): WebGPURenderPass {
    return new WebGPURenderPass(this.handle.beginRenderPass(desc));
  }

  /** 开始计算通道。 */
  beginComputePass(desc?: GPUComputePassDescriptor): WebGPUComputePass {
    return new WebGPUComputePass(this.handle.beginComputePass(desc));
  }

  /** 缓冲区间拷贝。 */
  copyBufferToBuffer(
    source: MaybeHandle<GPUBuffer>,
    sourceOffset: number,
    destination: MaybeHandle<GPUBuffer>,
    destinationOffset: number,
    size: number,
  ): void {
    this.handle.copyBufferToBuffer(
      nativeHandle(source),
      sourceOffset,
      nativeHandle(destination),
      destinationOffset,
      size,
    );
  }

  /** 解析查询集结果到缓冲区。 */
  resolveQuerySet(
    querySet: MaybeHandle<GPUQuerySet>,
    firstQuery: number,
    queryCount: number,
    destination: MaybeHandle<GPUBuffer>,
    destinationOffset: number,
  ): void {
    this.handle.resolveQuerySet(
      nativeHandle(querySet),
      firstQuery,
      queryCount,
      nativeHandle(destination),
      destinationOffset,
    );
  }

  /** 结束编码并生成命令缓冲。 */
  finish(desc?: GPUCommandBufferDescriptor): GPUCommandBuffer {
    return this.handle.finish(desc);
  }

  protected override destroyNative(): void {
    // 命令编码器由 GC 回收。
  }
}
