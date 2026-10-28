import { TextureUsage } from './constants.js';
import { WGPUDisposedError } from './errors.js';
import type { WGPUStats } from './types.js';

let nextTextureId = 1;

export interface WGPUTextureDescriptorLike {
  label?: string;
  width: number;
  height: number;
  format: GPUTextureFormat;
  usage?: number;
  mipLevelCount?: number;
  sampleCount?: number;
  dimension?: GPUTextureDimension;
}

export interface WGPUTextureUploadOptions {
  mipLevel?: number;
  origin?: GPUOrigin3D;
  bytesPerRow?: number;
  rowsPerImage?: number;
  width?: number;
  height?: number;
  depthOrArrayLayers?: number;
  premultipliedAlpha?: boolean;
}

/** Bytes per pixel for the texture formats this module can size automatically. */
export function textureBytesPerPixel(format: GPUTextureFormat): number {
  switch (format) {
    case 'r8unorm':
    case 'r8snorm':
    case 'r8uint':
    case 'r8sint':
      return 1;
    case 'rg8unorm':
    case 'rg8snorm':
    case 'rg8uint':
    case 'rg8sint':
    case 'r16float':
    case 'r16uint':
    case 'r16sint':
    case 'depth16unorm':
      return 2;
    case 'rgba16float':
    case 'rgba16uint':
    case 'rgba16sint':
    case 'rg32float':
    case 'rg32uint':
    case 'rg32sint':
      return 8;
    case 'rgba32float':
    case 'rgba32uint':
    case 'rgba32sint':
      return 16;
    default:
      return 4;
  }
}

/** A texture wrapper with a cached default view. */
export class WGPUTexture {
  readonly id = nextTextureId++;
  readonly handle: GPUTexture;
  readonly width: number;
  readonly height: number;
  readonly format: GPUTextureFormat;
  readonly usage: number;
  readonly mipLevelCount: number;
  readonly sampleCount: number;
  readonly label: string | undefined;

  private readonly device: GPUDevice;
  private readonly stats: WGPUStats;
  private defaultView: GPUTextureView | null = null;
  private disposedFlag = false;

  constructor(
    device: GPUDevice,
    stats: WGPUStats,
    handle: GPUTexture,
    descriptor: { width: number; height: number; format: GPUTextureFormat; usage: number; mipLevelCount: number; sampleCount: number; label?: string },
  ) {
    this.device = device;
    this.stats = stats;
    this.handle = handle;
    this.width = descriptor.width;
    this.height = descriptor.height;
    this.format = descriptor.format;
    this.usage = descriptor.usage;
    this.mipLevelCount = descriptor.mipLevelCount;
    this.sampleCount = descriptor.sampleCount;
    this.label = descriptor.label;
  }

  get disposed(): boolean {
    return this.disposedFlag;
  }

  /** Cached `createView()` result, so a frame does not allocate new views. */
  get view(): GPUTextureView {
    if (this.disposedFlag) throw new WGPUDisposedError('WGPUTexture');
    if (!this.defaultView) this.defaultView = this.handle.createView();
    return this.defaultView;
  }

  createView(descriptor: GPUTextureViewDescriptor = {}): GPUTextureView {
    if (this.disposedFlag) throw new WGPUDisposedError('WGPUTexture');
    return this.handle.createView(descriptor);
  }

  upload(source: ImageBitmapSource | ArrayBufferView, options: WGPUTextureUploadOptions = {}): this {
    if (this.disposedFlag) throw new WGPUDisposedError('WGPUTexture');
    const mipLevel = options.mipLevel ?? 0;
    const origin = options.origin ?? { x: 0, y: 0, z: 0 };
    const originDict = origin as GPUOrigin3DDict;
    const originX = Array.isArray(origin) ? (origin as number[])[0] ?? 0 : originDict.x ?? 0;
    const originY = Array.isArray(origin) ? (origin as number[])[1] ?? 0 : originDict.y ?? 0;
    if (ArrayBuffer.isView(source)) {
      const bytesPerPixel = textureBytesPerPixel(this.format);
      const bytesPerRow = options.bytesPerRow ?? this.width * bytesPerPixel;
      const rowsPerImage = options.rowsPerImage ?? this.height;
      const size = {
        width: options.width ?? this.width,
        height: options.height ?? this.height,
        depthOrArrayLayers: options.depthOrArrayLayers ?? 1,
      };
      this.device.queue.writeTexture({ texture: this.handle, mipLevel, origin }, source as unknown as GPUAllowSharedBufferSource, { bytesPerRow, rowsPerImage }, size);
      this.stats.textureUploads++;
      this.stats.textureUploadBytes += source.byteLength;
      return this;
    }
    this.device.queue.copyExternalImageToTexture(
      { source: source as GPUImageCopyExternalImageSource, origin: { x: originX, y: originY } },
      { texture: this.handle, mipLevel, premultipliedAlpha: options.premultipliedAlpha ?? false },
      { width: this.width, height: this.height },
    );
    this.stats.textureUploads++;
    this.stats.textureUploadBytes += this.width * this.height * textureBytesPerPixel(this.format);
    return this;
  }

  dispose(): void {
    if (this.disposedFlag) return;
    this.disposedFlag = true;
    this.handle.destroy();
    this.defaultView = null;
  }
}

/** A pool of textures keyed by exact descriptor, used for render targets. */
export class WGPUTexturePool {
  private readonly device: GPUDevice;
  private readonly stats: WGPUStats;
  private readonly maxFree: number;
  private readonly free = new Map<string, WGPUTexture[]>();
  private disposedFlag = false;

  constructor(device: GPUDevice, stats: WGPUStats, options: { maxFreeTextures?: number } = {}) {
    this.device = device;
    this.stats = stats;
    this.maxFree = Math.max(0, options.maxFreeTextures ?? 32);
  }

  acquire(descriptor: WGPUTextureDescriptorLike): WGPUTexture {
    if (this.disposedFlag) throw new WGPUDisposedError('WGPUTexturePool');
    const key = this.key(descriptor);
    const bucket = this.free.get(key);
    if (bucket && bucket.length > 0) {
      this.stats.texturesReused++;
      return bucket.pop()!;
    }
    const usage = descriptor.usage ?? TextureUsage.RENDER_ATTACHMENT | TextureUsage.TEXTURE_BINDING | TextureUsage.COPY_DST;
    const handle = this.device.createTexture({
      label: descriptor.label,
      size: { width: descriptor.width, height: descriptor.height, depthOrArrayLayers: 1 },
      format: descriptor.format,
      usage,
      mipLevelCount: descriptor.mipLevelCount ?? 1,
      sampleCount: descriptor.sampleCount ?? 1,
      dimension: descriptor.dimension ?? '2d',
    });
    this.stats.texturesCreated++;
    return new WGPUTexture(this.device, this.stats, handle, {
      width: descriptor.width,
      height: descriptor.height,
      format: descriptor.format,
      usage,
      mipLevelCount: descriptor.mipLevelCount ?? 1,
      sampleCount: descriptor.sampleCount ?? 1,
      label: descriptor.label,
    });
  }

  release(texture: WGPUTexture): void {
    if (this.disposedFlag || texture.disposed) return;
    const key = this.key({ width: texture.width, height: texture.height, format: texture.format, usage: texture.usage, mipLevelCount: texture.mipLevelCount, sampleCount: texture.sampleCount });
    const bucket = this.free.get(key) ?? [];
    if (bucket.length >= this.maxFree) {
      texture.dispose();
      return;
    }
    bucket.push(texture);
    this.free.set(key, bucket);
  }

  get size(): number {
    let total = 0;
    for (const bucket of this.free.values()) total += bucket.length;
    return total;
  }

  private key(descriptor: WGPUTextureDescriptorLike): string {
    const usage = descriptor.usage ?? TextureUsage.RENDER_ATTACHMENT | TextureUsage.TEXTURE_BINDING | TextureUsage.COPY_DST;
    return `${descriptor.width}x${descriptor.height}:${descriptor.format}:${usage}:${descriptor.mipLevelCount ?? 1}:${descriptor.sampleCount ?? 1}`;
  }

  dispose(): void {
    if (this.disposedFlag) return;
    this.disposedFlag = true;
    for (const bucket of this.free.values()) {
      for (const texture of bucket) texture.dispose();
    }
    this.free.clear();
  }
}
