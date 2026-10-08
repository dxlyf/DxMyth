import type { BufferGeometry } from '../../core/BufferGeometry';
import type { BufferAttribute } from '../../core/BufferAttribute';
import type { GL } from './GLProgram';
import type { WebGLState } from './WebGLState';

/** Attribute locations the shader library expects; fixed so VAOs are portable. */
export const ATTRIBUTE_LOCATIONS: Record<string, number> = {
  position: 0,
  normal: 1,
  uv: 2,
  color: 3,
  uv1: 4,
  uv2: 5,
  tangent: 6,
  skinIndex: 7,
  skinWeight: 8,
};

interface AttributeRecord {
  buffer: WebGLBuffer;
  version: number;
  bytes: number;
}

interface GeometryRecord {
  attributes: Map<string, AttributeRecord>;
  index: AttributeRecord | null;
  vao: WebGLVertexArrayObject | null;
  /** Set when the index buffer changed and the VAO needs a rebind. */
  indexDirty: boolean;
}

/**
 * CPU-side buffer cache.
 *
 * Each geometry gets one GPU buffer per attribute plus an optional element
 * buffer and (on WebGL2) a VAO. Attribute uploads are version-checked against
 * `BufferAttribute.version`, so `attribute.markNeedsUpdate()` is all it takes
 * to push new data.
 */
export class WebGLGeometries {
  private readonly gl: GL;
  private readonly state: WebGLState;
  private readonly isWebGL2: boolean;
  private readonly records = new WeakMap<BufferGeometry, GeometryRecord>();
  private readonly tracked = new Set<BufferGeometry>();

  private bytesUsed = 0;
  private uploadsThisFrame = 0;

  constructor(gl: GL, state: WebGLState, isWebGL2: boolean) {
    this.gl = gl;
    this.state = state;
    this.isWebGL2 = isWebGL2;
  }

  /** Registers a geometry so `dispose()` can free its buffers. */
  track(geometry: BufferGeometry): void {
    if (this.tracked.has(geometry)) return;
    this.tracked.add(geometry);
    geometry.addEventListener('dispose', (event) => this.release(event.target));
  }

  private record(geometry: BufferGeometry): GeometryRecord {
    let record = this.records.get(geometry);
    if (!record) {
      record = {
        attributes: new Map(),
        index: null,
        vao: this.isWebGL2 ? this.gl.createVertexArray() : null,
        indexDirty: false,
      };
      this.records.set(geometry, record);
      this.track(geometry);
    }
    return record;
  }

  /** Uploads (or refreshes) one attribute buffer and returns its handle. */
  private uploadAttribute(
    record: GeometryRecord,
    name: string,
    attribute: BufferAttribute,
  ): WebGLBuffer {
    const gl = this.gl;
    let entry = record.attributes.get(name);
    const bytes = attribute.array.byteLength;

    if (!entry) {
      const buffer = gl.createBuffer();
      if (!buffer) throw new Error('mini3d: gl.createBuffer() returned null');
      entry = { buffer, version: -1, bytes };
      record.attributes.set(name, entry);
    }

    if (entry.version !== attribute.version) {
      this.state.bindArrayBuffer(entry.buffer);
      const previousBytes = entry.bytes;
      gl.bufferData(gl.ARRAY_BUFFER, attribute.array, usageToGL(gl, attribute.usage));
      entry.version = attribute.version;
      entry.bytes = bytes;
      this.bytesUsed += bytes - previousBytes;
      this.uploadsThisFrame++;
    }
    return entry.buffer;
  }

  private uploadIndex(record: GeometryRecord, attribute: BufferAttribute): WebGLBuffer {
    const gl = this.gl;
    let entry = record.index;
    const bytes = attribute.array.byteLength;

    if (!entry) {
      const buffer = gl.createBuffer();
      if (!buffer) throw new Error('mini3d: gl.createBuffer() returned null');
      entry = { buffer, version: -1, bytes };
      record.index = entry;
      record.indexDirty = true;
    }
    if (entry.version !== attribute.version) {
      this.state.bindElementArrayBuffer(entry.buffer);
      const previousBytes = entry.bytes;
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, attribute.array, usageToGL(gl, attribute.usage));
      entry.version = attribute.version;
      entry.bytes = bytes;
      this.bytesUsed += bytes - previousBytes;
      this.uploadsThisFrame++;
    }
    return entry.buffer;
  }

  /**
   * Binds everything needed to draw `geometry`.
   *
   * On WebGL2 the whole binding is recorded into a VAO, so repeat draws with
   * the same geometry cost a single `bindVertexArray`. On WebGL1 the
   * attribute pointers are re-issued per draw, which is the only option.
   */
  bind(geometry: BufferGeometry, program: WebGLProgram | null): void {
    const gl = this.gl;
    const record = this.record(geometry);

    if (this.isWebGL2 && record.vao) {
      if (this.state.currentVertexArray !== record.vao) {
        this.state.bindVertexArray(record.vao);
        // The VAO remembers its own element-buffer binding.
        this.state.invalidateElementBuffer();
        this.bindAttributes(record, geometry, program);
        if (geometry.index) {
          this.uploadIndex(record, geometry.index);
          record.indexDirty = false;
        }
      }
      return;
    }

    this.state.bindVertexArray(null);
    this.bindAttributes(record, geometry, program);
    if (geometry.index) this.uploadIndex(record, geometry.index);
  }

  /** Uploads/points every attribute of `geometry` into the current VAO. */
  private bindAttributes(
    record: GeometryRecord,
    geometry: BufferGeometry,
    program: WebGLProgram | null,
  ): void {
    const gl = this.gl;
    for (const [name, attribute] of Object.entries(geometry.attributes)) {
      const buffer = this.uploadAttribute(record, name, attribute);
      this.state.bindArrayBuffer(buffer);
      const location = this.resolveLocation(name, program);
      if (location < 0) continue;
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(
        location,
        attribute.itemSize,
        glTypeFor(gl, attribute),
        attribute.normalized,
        attribute.stride,
        attribute.offset,
      );
    }
  }

  /**
   * Prefers the location the linker assigned, falling back to the documented
   * `ATTRIBUTE_LOCATIONS` convention. Both agree for the built-in shaders, so
   * this only matters for user shaders with unusual attribute names.
   */
  private resolveLocation(name: string, program: WebGLProgram | null): number {
    if (program) {
      const location = this.gl.getAttribLocation(program, name);
      if (location >= 0) return location;
      return -1;
    }
    return ATTRIBUTE_LOCATIONS[name] ?? -1;
  }

  /** Uploads everything eagerly (used by `WebGLRenderer.initGeometry`). */
  prepare(geometry: BufferGeometry): void {
    const record = this.record(geometry);
    for (const [name, attribute] of Object.entries(geometry.attributes)) {
      this.uploadAttribute(record, name, attribute);
    }
    if (geometry.index) this.uploadIndex(record, geometry.index);
  }

  get bytes(): number {
    return this.bytesUsed;
  }

  get uploadsLastFrame(): number {
    return this.uploadsThisFrame;
  }

  get count(): number {
    return this.tracked.size;
  }

  resetFrameStats(): void {
    this.uploadsThisFrame = 0;
  }

  release(geometry: BufferGeometry): void {
    const record = this.records.get(geometry);
    if (!record) return;
    const gl = this.gl;
    for (const entry of record.attributes.values()) {
      gl.deleteBuffer(entry.buffer);
      this.bytesUsed = Math.max(0, this.bytesUsed - entry.bytes);
    }
    if (record.index) {
      gl.deleteBuffer(record.index.buffer);
      this.bytesUsed = Math.max(0, this.bytesUsed - record.index.bytes);
    }
    if (record.vao) gl.deleteVertexArray(record.vao);
    this.records.delete(geometry);
    this.tracked.delete(geometry);
  }

  dispose(): void {
    for (const geometry of Array.from(this.tracked)) this.release(geometry);
    this.tracked.clear();
    this.bytesUsed = 0;
  }
}

/** Issues the attribute-pointer calls for one geometry. */
function glTypeFor(gl: GL, attribute: BufferAttribute): number {
  const array = attribute.array;
  if (array instanceof Float32Array || array instanceof Float64Array) return gl.FLOAT;
  if (array instanceof Int8Array) return gl.BYTE;
  if (array instanceof Uint8Array || array instanceof Uint8ClampedArray) return gl.UNSIGNED_BYTE;
  if (array instanceof Int16Array) return gl.SHORT;
  if (array instanceof Uint16Array) return gl.UNSIGNED_SHORT;
  if (array instanceof Int32Array) return gl.INT;
  if (array instanceof Uint32Array) return gl.UNSIGNED_INT;
  return gl.FLOAT;
}

function usageToGL(gl: GL, usage: 'static' | 'dynamic' | 'stream'): number {
  switch (usage) {
    case 'dynamic':
      return gl.DYNAMIC_DRAW;
    case 'stream':
      return gl.STREAM_DRAW;
    case 'static':
    default:
      return gl.STATIC_DRAW;
  }
}
