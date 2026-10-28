import { GL_ARRAY_BUFFER, GL_ELEMENT_ARRAY_BUFFER, GL_UNIFORM_BUFFER } from './constants.js';
import { GL2DisposedError } from './errors.js';
import type { GL2State } from './GL2State.js';
import { bufferUsage } from './mappings.js';
import { nextPowerOfTwo } from '../internal/pure.js';
import type { GL2BufferRef, GL2BufferUsage, GL2Stats } from './types.js';

function byteLengthOf(data: BufferSource): number {
  return ArrayBuffer.isView(data) ? data.byteLength : data.byteLength;
}

/**
 * A capacity-managed GPU buffer. Growth is power-of-two so steady-state
 * updates reuse the same allocation instead of creating new resources.
 */
export class GL2Buffer implements GL2BufferRef {
  readonly id: number;
  readonly target: number;
  readonly usage: number;

  private readonly gl: WebGL2RenderingContext;
  private readonly stats: GL2Stats;
  protected readonly state: GL2State;
  private handleValue: WebGLBuffer;
  private capacity = 0;
  private length = 0;
  private disposedFlag = false;
  private static nextId = 1;

  constructor(gl: WebGL2RenderingContext, stats: GL2Stats, state: GL2State, target: number, usage: GL2BufferUsage) {
    this.id = GL2Buffer.nextId++;
    this.gl = gl;
    this.stats = stats;
    this.state = state;
    this.target = target;
    this.usage = bufferUsage(usage);
    const handle = gl.createBuffer();
    if (!handle) throw new Error('Failed to create WebGL2 buffer');
    this.handleValue = handle;
    stats.buffersCreated++;
    stats.glCalls++;
  }

  static array(gl: WebGL2RenderingContext, stats: GL2Stats, state: GL2State, usage: GL2BufferUsage = 'static'): GL2Buffer {
    return new GL2Buffer(gl, stats, state, GL_ARRAY_BUFFER, usage);
  }

  static element(gl: WebGL2RenderingContext, stats: GL2Stats, state: GL2State, usage: GL2BufferUsage = 'static'): GL2Buffer {
    return new GL2Buffer(gl, stats, state, GL_ELEMENT_ARRAY_BUFFER, usage);
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

  setData(data: BufferSource): this {
    this.assertLive();
    this.bind();
    const bytes = byteLengthOf(data);
    if (bytes > this.capacity) this.allocate(bytes);
    this.gl.bufferSubData(this.target, 0, data);
    this.stats.glCalls++;
    this.stats.bufferUploadBytes += bytes;
    this.length = bytes;
    return this;
  }

  update(data: BufferSource, byteOffset = 0): this {
    this.assertLive();
    this.bind();
    const bytes = byteLengthOf(data);
    const end = byteOffset + bytes;
    if (end > this.capacity) this.allocate(end);
    this.gl.bufferSubData(this.target, byteOffset, data);
    this.stats.glCalls++;
    this.stats.bufferUploadBytes += bytes;
    if (end > this.length) this.length = end;
    return this;
  }

  reserve(bytes: number): this {
    this.assertLive();
    if (bytes <= this.capacity) return this;
    this.bind();
    this.allocate(bytes);
    return this;
  }

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

  private allocate(bytes: number): void {
    const capacity = Math.max(256, nextPowerOfTwo(bytes));
    this.gl.bufferData(this.target, capacity, this.usage);
    this.stats.glCalls++;
    this.stats.bufferReallocations++;
    this.capacity = capacity;
    this.length = 0;
  }

  private assertLive(): void {
    if (this.disposedFlag) throw new GL2DisposedError('GL2Buffer');
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

/** A std140 uniform buffer with cached binding points. */
export class GL2UniformBuffer extends GL2Buffer {
  constructor(gl: WebGL2RenderingContext, stats: GL2Stats, state: GL2State, usage: GL2BufferUsage = 'dynamic') {
    super(gl, stats, state, GL_UNIFORM_BUFFER, usage);
  }

  /** Bind this buffer to a UBO binding point (cached, no redundant calls). */
  bindBase(index: number): this {
    this.state.bindUniformBufferBase(index, this.handle);
    return this;
  }
}

export class GL2BufferPool {
  private readonly gl: WebGL2RenderingContext;
  private readonly stats: GL2Stats;
  private readonly state: GL2State;
  private readonly maxFree: number;
  private readonly free = new Map<number, GL2Buffer[]>();
  private disposedFlag = false;

  constructor(gl: WebGL2RenderingContext, stats: GL2Stats, state: GL2State, options: { maxFreePerTarget?: number } = {}) {
    this.gl = gl;
    this.stats = stats;
    this.state = state;
    this.maxFree = Math.max(0, options.maxFreePerTarget ?? 16);
  }

  get disposed(): boolean {
    return this.disposedFlag;
  }

  acquire(options: { target?: 'array' | 'element' | 'uniform'; usage?: GL2BufferUsage; byteLength?: number } = {}): GL2Buffer {
    if (this.disposedFlag) throw new GL2DisposedError('GL2BufferPool');
    const target = options.target === 'element'
      ? GL_ELEMENT_ARRAY_BUFFER
      : options.target === 'uniform'
        ? GL_UNIFORM_BUFFER
        : GL_ARRAY_BUFFER;
    const bucket = this.free.get(target);
    const needed = options.byteLength ?? 0;
    if (bucket && bucket.length > 0) {
      let index = bucket.findIndex((buffer) => buffer.capacityBytes >= needed);
      if (index < 0) index = bucket.length - 1;
      const [buffer] = bucket.splice(index, 1) as [GL2Buffer];
      buffer.orphan();
      this.stats.buffersReused++;
      return buffer;
    }
    if (target === GL_UNIFORM_BUFFER) return new GL2UniformBuffer(this.gl, this.stats, this.state, options.usage ?? 'dynamic');
    return new GL2Buffer(this.gl, this.stats, this.state, target, options.usage ?? 'dynamic');
  }

  release(buffer: GL2Buffer): void {
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
