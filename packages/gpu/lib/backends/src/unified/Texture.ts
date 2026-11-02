import type { WebGLTexture } from '../backends/webgl/resources/WebGLTexture';
import type { WebGPUTexture } from '../backends/webgpu/resources/WebGPUTexture';
import { BackendKind } from '../core/enums';
import { UnsupportedError, ValidationError } from '../core/errors';
import type { Device } from './Device';
import { TextureView } from './TextureView';
import type { TextureDescriptor, TextureViewDescriptor } from './types';

/** 统一的 WebGPU 风格纹理。 */
export class Texture {
  readonly label: string | undefined;
  readonly width: number;
  readonly height: number;
  readonly depthOrArrayLayers: number;
  readonly format: TextureDescriptor['format'];
  readonly usage: number;
  readonly mipLevelCount: number;
  readonly sampleCount: number;

  readonly #device: Device;
  readonly #gpu: WebGPUTexture | null;
  readonly #gl: WebGLTexture | null;
  #destroyed = false;

  constructor(device: Device, desc: TextureDescriptor) {
    const width = desc.size.width;
    const height = desc.size.height ?? 1;
    const depth = desc.size.depthOrArrayLayers ?? 1;
    if (!Number.isInteger(width) || width <= 0) {
      throw new ValidationError('纹理宽度必须是大于 0 的整数');
    }
    if (!Number.isInteger(height) || height <= 0) {
      throw new ValidationError('纹理高度必须是大于 0 的整数');
    }
    if (!Number.isInteger(depth) || depth <= 0) {
      throw new ValidationError('纹理层数必须是大于 0 的整数');
    }
    this.#device = device;
    this.label = desc.label;
    this.width = width;
    this.height = height;
    this.depthOrArrayLayers = depth;
    this.format = desc.format;
    this.usage = desc.usage;
    this.mipLevelCount = desc.mipLevelCount ?? 1;
    this.sampleCount = desc.sampleCount ?? 1;

    if (device.backend === BackendKind.WebGPU) {
      this.#gpu = device.gpuContext.createTexture({
        label: desc.label,
        width,
        height,
        depthOrArrayLayers: depth,
        format: desc.format,
        usage: desc.usage,
        mipLevelCount: this.mipLevelCount,
        sampleCount: this.sampleCount,
      });
      this.#gl = null;
      return;
    }

    if (depth !== 1) {
      throw new UnsupportedError('WebGL 纹理数组 / 3D 纹理', device.backend);
    }
    if (this.sampleCount !== 1) {
      throw new UnsupportedError('WebGL 多重采样纹理', device.backend);
    }
    this.#gl = device.glContext.createTexture({
      label: desc.label,
      width,
      height,
      format: desc.format,
      usage: desc.usage,
      mipLevelCount: this.mipLevelCount,
    });
    this.#gpu = null;
  }

  /** 是否为 WebGPU 后端资源。 */
  get isGpu(): boolean {
    return this.#gpu !== null;
  }

  /** WebGPU 原生纹理。 */
  get gpuTexture(): WebGPUTexture | null {
    return this.#gpu;
  }

  /** WebGL 原生纹理。 */
  get glTexture(): WebGLTexture | null {
    return this.#gl;
  }

  /** 创建纹理视图。 */
  createView(desc: TextureViewDescriptor = {}): TextureView {
    if (this.#device.backend === BackendKind.WebGPU) {
      if (this.#gpu === null) {
        throw new ValidationError('WebGPU 纹理不可用');
      }
      const view = this.#gpu.createView({
        label: desc.label,
        format: desc.format as GPUTextureFormat | undefined,
        dimension: desc.dimension,
        aspect: desc.aspect,
        baseMipLevel: desc.baseMipLevel,
        mipLevelCount: desc.mipLevelCount,
        baseArrayLayer: desc.baseArrayLayer,
        arrayLayerCount: desc.arrayLayerCount,
      });
      return new TextureView(this.#device, this, view, desc);
    }
    return new TextureView(this.#device, this, null, desc);
  }

  /** 销毁纹理；幂等。 */
  destroy(): void {
    if (this.#destroyed) {
      return;
    }
    this.#destroyed = true;
    this.#gpu?.destroy();
    this.#gl?.destroy();
  }

  /** @internal */
  get device(): Device {
    return this.#device;
  }
}
