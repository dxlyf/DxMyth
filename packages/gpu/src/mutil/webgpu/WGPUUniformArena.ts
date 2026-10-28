import { BufferUsage, DEFAULT_UNIFORM_ALIGNMENT } from './constants.js';
import { WGPUDisposedError } from './errors.js';
import { alignTo, nextPowerOfTwo } from '../internal/pure.js';
import type { WGPUStats, WGPUUniformAllocation } from './types.js';

interface ArenaPage {
  handle: GPUBuffer;
  capacity: number;
  staging: ArrayBuffer;
  cursor: number;
  dirtyStart: number;
  dirtyEnd: number;
}

/**
 * A frame-scoped ring of uniform data.
 *
 * Allocations receive `minUniformBufferOffsetAlignment`-aligned offsets so they
 * can be bound with dynamic offsets, which means:
 *   - a single large uniform buffer instead of one buffer per draw,
 *   - one `queue.writeBuffer` per page per frame instead of one per uniform,
 *   - bind groups stay valid across frames (their key ignores the offset).
 */
export class WGPUUniformArena {
  readonly alignment: number;

  private readonly device: GPUDevice;
  private readonly stats: WGPUStats;
  private readonly initialCapacity: number;
  private readonly pages: ArenaPage[] = [];
  private disposedFlag = false;

  constructor(device: GPUDevice, stats: WGPUStats, options: { initialSize?: number; alignment?: number } = {}) {
    this.device = device;
    this.stats = stats;
    const limit = typeof device.limits?.minUniformBufferOffsetAlignment === 'number'
      ? device.limits.minUniformBufferOffsetAlignment
      : DEFAULT_UNIFORM_ALIGNMENT;
    this.alignment = Math.max(16, options.alignment ?? limit);
    this.initialCapacity = Math.max(256, options.initialSize ?? 64 * 1024);
  }

  get pageCount(): number {
    return this.pages.length;
  }

  get capacity(): number {
    let total = 0;
    for (const page of this.pages) total += page.capacity;
    return total;
  }

  /** Reset every page cursor; called once per frame. */
  beginFrame(): void {
    for (const page of this.pages) {
      page.cursor = 0;
      page.dirtyStart = Number.POSITIVE_INFINITY;
      page.dirtyEnd = 0;
    }
  }

  /**
   * Reserve space for a uniform struct and return its buffer/offset/size.
   * The returned offset is suitable as a dynamic bind-group offset.
   */
  allocate(byteLength: number): WGPUUniformAllocation {
    if (this.disposedFlag) throw new WGPUDisposedError('WGPUUniformArena');
    const bindingSize = alignTo(Math.max(4, byteLength), 16);
    const stride = alignTo(bindingSize, this.alignment);
    let page = this.pages.find((candidate) => candidate.cursor + stride <= candidate.capacity);
    if (!page) {
      page = this.createPage(Math.max(stride, this.initialCapacity));
    }
    const offset = page.cursor;
    page.cursor += stride;
    this.stats.uniformAllocations++;
    return { buffer: page.handle, offset, size: bindingSize };
  }

  /** Copy bytes into the ring and return the dynamic-offset allocation. */
  write(data: ArrayBufferView): WGPUUniformAllocation {
    if (this.disposedFlag) throw new WGPUDisposedError('WGPUUniformArena');
    const allocation = this.allocate(data.byteLength);
    const page = this.pages.find((candidate) => candidate.handle === allocation.buffer)!;
    new Uint8Array(page.staging, allocation.offset, data.byteLength).set(
      new Uint8Array(data.buffer, data.byteOffset, data.byteLength),
    );
    if (allocation.offset < page.dirtyStart) page.dirtyStart = allocation.offset;
    const end = allocation.offset + allocation.size;
    if (end > page.dirtyEnd) page.dirtyEnd = end;
    return allocation;
  }

  /** Build a bind group entry for an allocation (use with dynamic offsets). */
  entry(binding: number, allocation: WGPUUniformAllocation): { binding: number; resource: { buffer: GPUBuffer; offset: number; size: number } } {
    return { binding, resource: { buffer: allocation.buffer, offset: 0, size: allocation.size } };
  }

  /** Upload all dirty ranges. One `writeBuffer` per page, once per frame. */
  flush(): void {
    if (this.disposedFlag) return;
    for (const page of this.pages) {
      if (page.dirtyStart >= page.dirtyEnd) continue;
      const start = page.dirtyStart;
      const length = page.dirtyEnd - start;
      this.device.queue.writeBuffer(page.handle, start, new Uint8Array(page.staging, start, length));
      this.stats.uniformFlushes++;
      this.stats.uniformFlushBytes += length;
      page.dirtyStart = Number.POSITIVE_INFINITY;
      page.dirtyEnd = 0;
    }
  }

  dispose(): void {
    if (this.disposedFlag) return;
    this.disposedFlag = true;
    for (const page of this.pages) page.handle.destroy();
    this.pages.length = 0;
  }

  private createPage(capacity: number): ArenaPage {
    const capacityValue = Math.max(256, nextPowerOfTwo(capacity));
    const handle = this.device.createBuffer({
      size: capacityValue,
      usage: BufferUsage.UNIFORM | BufferUsage.COPY_DST | BufferUsage.COPY_SRC,
      label: `uniform-ring-${capacityValue}`,
    });
    this.stats.buffersCreated++;
    const page: ArenaPage = {
      handle,
      capacity: capacityValue,
      staging: new ArrayBuffer(capacityValue),
      cursor: 0,
      dirtyStart: Number.POSITIVE_INFINITY,
      dirtyEnd: 0,
    };
    this.pages.push(page);
    return page;
  }
}
