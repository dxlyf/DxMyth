import { BufferUsage } from './constants.js';
import { WGPUDisposedError } from './errors.js';
import { nextPowerOfTwo } from '../internal/pure.js';
import type { WGPUStats } from './types.js';

let nextBufferId = 1;

/** A GPU buffer wrapper with a cached identity and a write helper. */
export class WGPUBuffer {
  readonly id = nextBufferId++;
  readonly handle: GPUBuffer;
  readonly size: number;
  readonly usage: number;
  readonly label: string | undefined;

  private readonly device: GPUDevice;
  private readonly stats: WGPUStats;
  private disposedFlag = false;

  constructor(device: GPUDevice, stats: WGPUStats, handle: GPUBuffer, size: number, usage: number, label?: string) {
    this.device = device;
    this.stats = stats;
    this.handle = handle;
    this.size = size;
    this.usage = usage;
    this.label = label;
  }

  get disposed(): boolean {
    return this.disposedFlag;
  }

  /** One `queue.writeBuffer` call. Prefer the uniform arena for many writes. */
  write(data: ArrayBufferView, offset = 0): this {
    if (this.disposedFlag) throw new WGPUDisposedError('WGPUBuffer');
    this.device.queue.writeBuffer(this.handle, offset, data as unknown as GPUAllowSharedBufferSource);
    this.stats.bufferWrites++;
    this.stats.bufferWriteBytes += data.byteLength;
    return this;
  }

  destroy(): void {
    if (this.disposedFlag) return;
    this.handle.destroy();
    this.disposedFlag = true;
  }

  dispose(): void {
    this.destroy();
  }
}

export interface WGPUBufferPoolOptions {
  /** Largest number of idle buffers retained. Defaults to 32. */
  maxFreeBuffers?: number;
}

/**
 * Size-classed buffer pool. Re-acquiring a buffer for a dynamic stream avoids
 * `createBuffer`, which is a comparatively expensive driver allocation.
 */
export class WGPUBufferPool {
  private readonly device: GPUDevice;
  private readonly stats: WGPUStats;
  private readonly maxFree: number;
  private readonly buckets = new Map<string, WGPUBuffer[]>();
  private disposedFlag = false;

  constructor(device: GPUDevice, stats: WGPUStats, options: WGPUBufferPoolOptions = {}) {
    this.device = device;
    this.stats = stats;
    this.maxFree = Math.max(0, options.maxFreeBuffers ?? 32);
  }

  get disposed(): boolean {
    return this.disposedFlag;
  }

  acquire(options: { size: number; usage?: number; label?: string }): WGPUBuffer {
    if (this.disposedFlag) throw new WGPUDisposedError('WGPUBufferPool');
    const usage = options.usage ?? (BufferUsage.VERTEX | BufferUsage.COPY_DST);
    const sizeClass = Math.max(256, nextPowerOfTwo(Math.max(1, options.size)));
    const key = `${usage}:${sizeClass}`;
    const bucket = this.buckets.get(key);
    if (bucket && bucket.length > 0) {
      this.stats.buffersReused++;
      return bucket.pop()!;
    }
    const handle = this.device.createBuffer({ size: sizeClass, usage, label: options.label ?? `pooled-${sizeClass}` });
    this.stats.buffersCreated++;
    return new WGPUBuffer(this.device, this.stats, handle, sizeClass, usage, options.label);
  }

  release(buffer: WGPUBuffer): void {
    if (this.disposedFlag || buffer.disposed) return;
    const key = `${buffer.usage}:${buffer.size}`;
    const bucket = this.buckets.get(key) ?? [];
    if (bucket.length >= this.maxFree) {
      buffer.destroy();
      return;
    }
    bucket.push(buffer);
    this.buckets.set(key, bucket);
  }

  get size(): number {
    let total = 0;
    for (const bucket of this.buckets.values()) total += bucket.length;
    return total;
  }

  dispose(): void {
    if (this.disposedFlag) return;
    this.disposedFlag = true;
    for (const bucket of this.buckets.values()) {
      for (const buffer of bucket) buffer.destroy();
    }
    this.buckets.clear();
  }
}

export { BufferUsage };
