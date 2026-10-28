import { GL_ARRAY_BUFFER, GL_ELEMENT_ARRAY_BUFFER } from './constants.js';
import { GL1DisposedError } from './errors.js';
import type { GL1State } from './GL1State.js';
import { bufferUsage } from './mappings.js';
import { nextPowerOfTwo } from '../internal/pure.js';
import type { GL1BufferRef, GL1BufferUsage, GL1Stats } from './types.js';

let nextBufferId = 1;

function byteLengthOf(data: BufferSource): number {
  return ArrayBuffer.isView(data) ? data.byteLength : data.byteLength;
}

/**
 * A GPU buffer with:
 *  - capacity-based growth (rarely reallocates),
 *  - in-place `bufferSubData` updates,
 *  - optional orphaning for streaming data,
 *  - redundant-bind elimination through the shared state cache.
 */
export class GL1Buffer implements GL1BufferRef {
  /** Process-unique id, used for vertex-array cache keys. */
  readonly id = nextBufferId++;
  readonly target: number;
  readonly usage: number;

  private readonly gl: WebGLRenderingContext;
  private readonly stats: GL1Stats;
  private readonly state: GL1State;
  private handleValue: WebGLBuffer;
  private capacity = 0;
  private length = 0;
  private disposedFlag = false;

  constructor(gl: WebGLRenderingContext, stats: GL1Stats, state: GL1State, target: number, usage: GL1BufferUsage) {
    this.gl = gl;
    this.stats = stats;
    this.state = state;
    this.target = target;
    this.usage = bufferUsage(usage);
    const handle = gl.createBuffer();
    if (!handle) throw new Error('Failed to create WebGL buffer');
    this.handleValue = handle;
    stats.buffersCreated++;
    stats.glCalls++;
  }

  static array(gl: WebGLRenderingContext, stats: GL1Stats, state: GL1State, usage: GL1BufferUsage = 'static'): GL1Buffer {
    return new GL1Buffer(gl, stats, state, GL_ARRAY_BUFFER, usage);
  }

  static element(gl: WebGLRenderingContext, stats: GL1Stats, state: GL1State, usage: GL1BufferUsage = 'static'): GL1Buffer {
    return new GL1Buffer(gl, stats, state, GL_ELEMENT_ARRAY_BUFFER, usage);
  }

  get handle(): WebGLBuffer {
    return this.handleValue;
  }

  get byteLength(): number {
    return this.length;
  }

  get capacityBytes(): number {
    return this.capacity;
  }

  get disposed(): boolean {
    return this.disposedFlag;
  }

  bind(): this {
    this.state.bindBuffer(this.target, this.handleValue);
    return this;
  }

  /**
   * Upload a complete replacement. Reuses the existing GPU allocation when it
   * already fits, so repeated updates do not create new resources.
   */
  setData(data: BufferSource): this {
    this.assertLive();
    this.bind();
    const bytes = byteLengthOf(data);
    if (bytes > this.capacity) {
      this.allocate(bytes);
    }
    this.gl.bufferSubData(this.target, 0, data);
    this.stats.glCalls++;
    this.stats.bufferUploadBytes += bytes;
    this.length = bytes;
    return this;
  }

  /**
   * Write a sub-range. `byteOffset` is relative to the start of the buffer.
   * Grows the allocation only when the write does not fit.
   */
  update(data: BufferSource, byteOffset = 0): this {
    this.assertLive();
    this.bind();
    const bytes = byteLengthOf(data);
    const end = byteOffset + bytes;
    if (end > this.capacity) {
      this.allocate(end);
    }
    this.gl.bufferSubData(this.target, byteOffset, data);
    this.stats.glCalls++;
    this.stats.bufferUploadBytes += bytes;
    if (end > this.length) this.length = end;
    return this;
  }

  /** Allocate storage without uploading pixels/vertices. */
  reserve(bytes: number): this {
    this.assertLive();
    if (bytes <= this.capacity) return this;
    this.bind();
    this.allocate(bytes);
    return this;
  }

  /**
   * Allocate fresh storage for the full capacity, discarding the old contents.
   * Drivers can then hand out a new physical allocation (buffer "renaming"),
   * which avoids a stall when the previous frame's data is still in flight.
   */
  orphan(): this {
    this.assertLive();
    if (this.capacity === 0) return this;
    this.bind();
    this.gl.bufferData(this.target, this.capacity, this.usage);
    this.stats.glCalls++;
    this.stats.bufferReallocations++;
    this.length = 0;
    return this;
  }

  /** Read back the current byte length limit; growth is power-of-two. */
  private allocate(bytes: number): void {
    const capacity = Math.max(256, nextPowerOfTwo(bytes));
    this.gl.bufferData(this.target, capacity, this.usage);
    this.stats.glCalls++;
    this.stats.bufferReallocations++;
    this.capacity = capacity;
    this.length = 0;
  }

  private assertLive(): void {
    if (this.disposedFlag) throw new GL1DisposedError('GL1Buffer');
  }

  dispose(): void {
    if (this.disposedFlag) return;
    this.disposedFlag = true;
    this.gl.deleteBuffer(this.handleValue);
    this.stats.glCalls++;
    this.capacity = 0;
    this.length = 0;
  }
}

export interface GL1BufferPoolOptions {
  /** Retained released buffers per target. Defaults to 16. */
  maxFreePerTarget?: number;
}

/**
 * Recycles dynamic buffers between frames. Acquiring a released buffer skips
 * `gl.createBuffer`, which is the main way this library avoids growing the
 * number of GPU resources over the lifetime of an app.
 */
export class GL1BufferPool {
  private readonly gl: WebGLRenderingContext;
  private readonly stats: GL1Stats;
  private readonly state: GL1State;
  private readonly maxFree: number;
  private readonly free = new Map<number, GL1Buffer[]>();
  private disposedFlag = false;

  constructor(gl: WebGLRenderingContext, stats: GL1Stats, state: GL1State, options: GL1BufferPoolOptions = {}) {
    this.gl = gl;
    this.stats = stats;
    this.state = state;
    this.maxFree = Math.max(0, options.maxFreePerTarget ?? 16);
  }

  get disposed(): boolean {
    return this.disposedFlag;
  }

  acquire(options: { target?: 'array' | 'element'; usage?: GL1BufferUsage; byteLength?: number } = {}): GL1Buffer {
    if (this.disposedFlag) throw new GL1DisposedError('GL1BufferPool');
    const target = options.target === 'element' ? GL_ELEMENT_ARRAY_BUFFER : GL_ARRAY_BUFFER;
    const bucket = this.free.get(target);
    const needed = options.byteLength ?? 0;
    if (bucket && bucket.length > 0) {
      // Prefer a buffer that already fits, so no reallocation is needed.
      let index = bucket.findIndex((buffer) => buffer.capacityBytes >= needed);
      if (index < 0) index = bucket.length - 1;
      const [buffer] = bucket.splice(index, 1) as [GL1Buffer];
      buffer.orphan();
      this.stats.buffersReused++;
      return buffer;
    }
    return new GL1Buffer(this.gl, this.stats, this.state, target, options.usage ?? 'dynamic');
  }

  release(buffer: GL1Buffer): void {
    if (this.disposedFlag || buffer.disposed) return;
    const bucket = this.free.get(buffer.target) ?? [];
    if (bucket.length >= this.maxFree) {
      buffer.dispose();
      return;
    }
    bucket.push(buffer);
    this.free.set(buffer.target, bucket);
  }

  dispose(): void {
    if (this.disposedFlag) return;
    this.disposedFlag = true;
    for (const bucket of this.free.values()) {
      for (const buffer of bucket) buffer.dispose();
    }
    this.free.clear();
  }
}
