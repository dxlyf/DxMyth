import { Resource } from '../../../core/Resource';
import type { TextureFormat } from '../../../core/enums';
import { ValidationError } from '../../../core/errors';
import { bytesPerPixel } from '../../../core/format';
import type { WebGPUContext } from '../WebGPUContext';
import { WebGPUTextureView } from './WebGPUTextureView';

/** 纹理写入参数。 */
export interface TextureWriteOptions {
  mipLevel?: number;
  origin?: GPUOrigin3D;
}

/** WebGPU 纹理封装。 */
export class WebGPUTexture extends Resource<GPUTexture> {
  readonly width: number;
  readonly height: number;
  readonly depthOrArrayLayers: number;
  readonly format: TextureFormat;
  readonly mipLevelCount: number;
  readonly sampleCount: number;
  readonly #context: WebGPUContext;

  constructor(
    context: WebGPUContext,
    native: GPUTexture,
    desc: {
      width: number;
      height: number;
      depthOrArrayLayers: number;
      format: TextureFormat;
      mipLevelCount: number;
      sampleCount: number;
    },
  ) {
    super(native, {});
    this.#context = context;
    this.width = desc.width;
    this.height = desc.height;
    this.depthOrArrayLayers = desc.depthOrArrayLayers;
    this.format = desc.format;
    this.mipLevelCount = desc.mipLevelCount;
    this.sampleCount = desc.sampleCount;
  }

  /** 创建纹理视图并纳入资源跟踪。 */
  createView(desc?: GPUTextureViewDescriptor): WebGPUTextureView {
    const native = this.handle.createView(desc);
    const view = new WebGPUTextureView(this.#context, native);
    return this.#context.scope.track(view);
  }

  /** 从 CPU 写入基础 mip 层数据；自动处理 256 字节行对齐。 */
  write(data: ArrayBufferView, options: TextureWriteOptions = {}): void {
    const pixelBytes = bytesPerPixel(this.format);
    const unpaddedBytesPerRow = this.width * pixelBytes;
    const bytesPerRow = Math.ceil(unpaddedBytesPerRow / 256) * 256;
    const sourceBytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    const expected = unpaddedBytesPerRow * this.height;
    if (sourceBytes.byteLength < expected) {
      throw new ValidationError(
        `纹理数据不足：需要 ${expected} 字节，实际 ${sourceBytes.byteLength} 字节`,
      );
    }

    let upload = sourceBytes;
    if (bytesPerRow !== unpaddedBytesPerRow) {
      const padded = new Uint8Array(bytesPerRow * this.height);
      for (let row = 0; row < this.height; row += 1) {
        const start = row * unpaddedBytesPerRow;
        padded.set(sourceBytes.subarray(start, start + unpaddedBytesPerRow), row * bytesPerRow);
      }
      upload = padded;
    }

    this.#context.device.queue.writeTexture(
      {
        texture: this.handle,
        mipLevel: options.mipLevel ?? 0,
        origin: options.origin,
      },
      upload,
      { bytesPerRow, rowsPerImage: this.height },
      { width: this.width, height: this.height, depthOrArrayLayers: 1 },
    );
  }

  /** 释放纹理。 */
  protected override destroyNative(native: GPUTexture): void {
    native.destroy();
  }
}
