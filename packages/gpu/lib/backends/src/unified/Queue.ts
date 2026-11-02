import type { WebGPUContext } from '../backends/webgpu/WebGPUContext';
import { BackendKind } from '../core/enums';
import { ValidationError } from '../core/errors';
import type { Buffer } from './Buffer';
import type { CommandBuffer } from './CommandBuffer';
import type { Device } from './Device';
import type { TextureCopyDestination, TextureDataLayout } from './types';

/** 统一的 WebGPU 风格队列。 */
export class Queue {
  readonly #device: Device;

  /** @internal */
  constructor(device: Device) {
    this.#device = device;
  }

  /** 写入缓冲区。 */
  writeBuffer(
    buffer: Buffer,
    bufferOffset: number,
    data: ArrayBufferView,
    dataOffset = 0,
    size = data.byteLength - dataOffset,
  ): void {
    if (bufferOffset < 0 || dataOffset < 0 || size < 0) {
      throw new ValidationError('缓冲区写入范围无效');
    }
    if (dataOffset + size > data.byteLength) {
      throw new ValidationError('源数据范围超出');
    }
    const bytes = new Uint8Array(data.buffer, data.byteOffset + dataOffset, size);
    if (this.#device.backend === BackendKind.WebGPU) {
      const native = buffer.gpuBuffer?.handle;
      if (native === undefined) {
        throw new ValidationError('缓冲区不是 WebGPU 资源');
      }
      (this.#device.context as WebGPUContext).device.queue.writeBuffer(
        native,
        bufferOffset,
        bytes.buffer,
        bytes.byteOffset,
        bytes.byteLength,
      );
      return;
    }
    buffer.write(bufferOffset, bytes);
  }

  /** 写入纹理。 */
  writeTexture(
    destination: TextureCopyDestination,
    data: ArrayBufferView,
    dataLayout: TextureDataLayout,
    size: { width: number; height?: number; depthOrArrayLayers?: number },
  ): void {
    const texture = destination.texture;
    if (this.#device.backend === BackendKind.WebGPU) {
      const native = texture.gpuTexture?.handle;
      if (native === undefined) {
        throw new ValidationError('纹理不是 WebGPU 资源');
      }
      (this.#device.context as WebGPUContext).device.queue.writeTexture(
        {
          texture: native,
          mipLevel: destination.mipLevel ?? 0,
          origin: destination.origin,
        },
        data,
        dataLayout,
        {
          width: size.width,
          height: size.height ?? 1,
          depthOrArrayLayers: size.depthOrArrayLayers ?? 1,
        },
      );
      return;
    }
    const glTexture = texture.glTexture;
    if (glTexture === null) {
      throw new ValidationError('纹理不是 WebGL 资源');
    }
    const origin = destination.origin ?? {};
    if (origin.x !== undefined || origin.y !== undefined) {
      glTexture.uploadSub(data, origin.x ?? 0, origin.y ?? 0, {
        level: destination.mipLevel,
        width: size.width,
        height: size.height ?? 1,
      });
      return;
    }
    glTexture.upload(data, {
      level: destination.mipLevel,
      width: size.width,
      height: size.height ?? 1,
    });
  }

  /** 提交命令缓冲；WebGL 后端为立即执行，提交是空操作。 */
  submit(commandBuffers: readonly CommandBuffer[]): void {
    if (this.#device.backend !== BackendKind.WebGPU) {
      return;
    }
    const native = commandBuffers
      .map((buffer) => buffer.gpuCommandBuffer)
      .filter((buffer): buffer is GPUCommandBuffer => buffer !== null);
    (this.#device.context as WebGPUContext).device.queue.submit(native);
  }

  /** 等待已提交工作完成。 */
  async onSubmittedWorkDone(): Promise<void> {
    if (this.#device.backend !== BackendKind.WebGPU) {
      return;
    }
    await (this.#device.context as WebGPUContext).device.queue.onSubmittedWorkDone();
  }
}
