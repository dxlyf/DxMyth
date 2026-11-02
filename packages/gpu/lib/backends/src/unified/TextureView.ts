import type { WebGPUTextureView } from '../backends/webgpu/resources/WebGPUTextureView';
import type { BackendKind, TextureFormat } from '../core/enums';
import type { Device } from './Device';
import type { Texture } from './Texture';
import type { TextureViewDescriptor } from './types';

/** 统一的纹理视图；画布视图也可用此类型表示。 */
export class TextureView {
  readonly label: string | undefined;
  readonly texture: Texture | null;
  readonly format: TextureFormat;
  readonly width: number;
  readonly height: number;
  readonly isCanvas: boolean;
  readonly #device: Device;
  readonly #gpuView: WebGPUTextureView | null;
  readonly #canvasView: GPUTextureView | null;
  #destroyed = false;

  /** @internal 由 Texture / Device 创建。 */
  constructor(
    device: Device,
    texture: Texture | null,
    gpuView: WebGPUTextureView | null,
    desc: TextureViewDescriptor,
    canvasView: GPUTextureView | null = null,
  ) {
    this.#device = device;
    this.label = desc.label;
    this.texture = texture;
    this.format = desc.format ?? texture?.format ?? device.format;
    this.width = texture?.width ?? device.width;
    this.height = texture?.height ?? device.height;
    this.isCanvas = texture === null;
    this.#gpuView = gpuView;
    this.#canvasView = canvasView;
  }

  /** WebGPU 原生视图；WebGL 后端返回 `null`。 */
  get gpuView(): GPUTextureView | null {
    if (this.#canvasView !== null) {
      return this.#canvasView;
    }
    return this.#gpuView?.handle ?? null;
  }

  /** 销毁视图；幂等。 */
  destroy(): void {
    if (this.#destroyed) {
      return;
    }
    this.#destroyed = true;
    this.#gpuView?.destroy();
  }

  /** @internal */
  get device(): Device {
    return this.#device;
  }

  /** @internal WebGL 后端需要纹理对象。 */
  get glTexture() {
    return this.texture?.glTexture ?? null;
  }

  /** @internal 是否可用于 WebGL 渲染目标。 */
  get webglRenderable(): boolean {
    return this.isCanvas || this.texture?.glTexture !== null;
  }

  /** @internal 后端类型。 */
  get backend(): BackendKind {
    return this.#device.backend;
  }
}
