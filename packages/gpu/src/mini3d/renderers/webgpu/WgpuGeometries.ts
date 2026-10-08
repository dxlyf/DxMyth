/**
 * GPU buffer cache for `BufferGeometry` in the WebGPU backend.
 *
 * One `GPUBuffer` per `BufferAttribute` (version-checked against
 * `attribute.version`), one for the index buffer, plus lazily built
 * *expansion* buffers for the two topologies WebGPU cannot index:
 *
 * - `drawMode: 'line-strip'` 閳?de-indexed into a `line-list` index buffer
 *   (`0,1, 1,2, 2,3, 閳ヮ泦), so a `LineLoop` renders as a strip plus its closing
 *   segment.
 * - `drawMode: 'points'` (with an index buffer) 閳?de-indexed into a stride-1
 *   index list so every indexed point is drawn exactly once.
 *
 * Both are cached against the source index version, so re-uploading an index
 * automatically invalidates the expansion. Expansion buffers always use
 * `uint32` because `queue.writeBuffer` is 4-byte aligned.
 *
 * `queue.writeBuffer` also requires a `byteLength` that is a multiple of four,
 * so attribute uploads are zero-padded when necessary.
 */

import type { BufferAttribute } from '../../core/BufferAttribute';
import type { BufferGeometry } from '../../core/BufferGeometry';
import type { DrawMode } from '../../core/BufferGeometry';
import { safeWriteBuffer } from './WgpuUploads';

/** Attribute name 閳?WGSL `@location`, matching the frozen shader contract. */
export const ATTRIBUTE_LOCATIONS: Record<string, number> = {
  position: 0,
  normal: 1,
  uv: 2,
  color: 3,
};

/** Attributes a pipeline declares, in the order the cache key encodes them. */
export const PIPELINE_ATTRIBUTES: readonly string[] = ['position', 'normal', 'uv', 'color'];

/** `GPUPrimitiveTopology` for every `DrawMode` of the library. */
export const TOPOLOGY_FOR_DRAW_MODE: Record<DrawMode, GPUPrimitiveTopology> = {
  triangles: 'triangle-list',
  'triangle-strip': 'triangle-strip',
  lines: 'line-list',
  'line-strip': 'line-list',
  points: 'point-list',
};

/** True when WebGPU accepts an index buffer for `topology`. */
export function topologySupportsIndexed(topology: GPUPrimitiveTopology): boolean {
  return topology === 'triangle-list' || topology === 'triangle-strip' || topology === 'line-list';
}

/** One uploaded vertex attribute buffer. */
export interface WgpuAttributeRecord {
  buffer: GPUBuffer;
  /** `attribute.version` at the last upload. */
  version: number;
  /** Logical byte size of the source array (before 4-byte padding). */
  byteLength: number;
  /** Bytes actually allocated, including the pad. */
  allocated: number;
  /** `GPUVertexFormat` taken verbatim from `BufferAttribute.format`. */
  format: GPUVertexFormat;
  itemSize: number;
  offset: number;
  stride: number;
}

/** Index buffer record (`null` when the geometry is non-indexed). */
export interface WgpuIndexRecord {
  buffer: GPUBuffer;
  version: number;
  allocated: number;
  format: GPUIndexFormat;
}

/** Per-geometry GPU state. */
export interface WgpuGeometryRecord {
  attributes: Map<string, WgpuAttributeRecord>;
  index: WgpuIndexRecord | null;
  /** Expansion buffer for `points` / `line-strip`; keyed by source version. */
  expansion: {
    buffer: GPUBuffer;
    sourceVersion: number;
    count: number;
    mode: DrawMode;
    allocated: number;
  } | null;
  bytes: number;
}

/**
 * Owns every vertex/index `GPUBuffer`. Geometries are tracked weakly so a
 * dropped mesh frees its entry with the JS object, and eagerly (through
 * `track`) so `dispose()` can release everything still alive.
 */
export class WgpuGeometries {
  private readonly device: GPUDevice;
  private readonly records = new WeakMap<BufferGeometry, WgpuGeometryRecord>();
  private readonly tracked = new Set<BufferGeometry>();
  private bytesUsed = 0;

  constructor(device: GPUDevice) {
    this.device = device;
  }

  /** Registers a geometry so `dispose()` can free its buffers. */
  track(geometry: BufferGeometry): void {
    if (this.tracked.has(geometry)) return;
    this.tracked.add(geometry);
    geometry.addEventListener('dispose', (event) => this.release(event.target));
  }

  /** Number of tracked geometries. */
  get count(): number {
    return this.tracked.size;
  }

  /** Total GPU bytes held by vertex and index buffers. */
  get bytes(): number {
    return this.bytesUsed;
  }

  private record(geometry: BufferGeometry): WgpuGeometryRecord {
    let record = this.records.get(geometry);
    if (!record) {
      record = { attributes: new Map(), index: null, expansion: null, bytes: 0 };
      this.records.set(geometry, record);
      this.track(geometry);
    }
    return record;
  }

  /** Uploads (or refreshes) one attribute and returns its record. */
  private uploadAttribute(
    record: WgpuGeometryRecord,
    name: string,
    attribute: BufferAttribute,
  ): WgpuAttributeRecord {
    // Two independent reasons to (re)allocate: no buffer yet, and the source
    // array having grown past what the buffer can hold. `writeBuffer` reports an
    // `OperationError` when the write exceeds the destination, so a geometry
    // whose attribute is replaced with a larger array (or whose vertex count is
    // increased) must be reallocated rather than written into the old buffer.
    const required = allocSize(attribute.array.byteLength);
    let entry = record.attributes.get(name);

    if (entry && required > entry.allocated) {
      entry.buffer.destroy();
      this.bytesUsed -= entry.allocated;
      record.bytes -= entry.allocated;
      record.attributes.delete(name);
      entry = undefined;
    }

    if (!entry) {
      entry = {
        buffer: this.device.createBuffer({
          label: `mini3d.attribute.${name}`,
          size: required,
          usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        }),
        version: -1,
        byteLength: attribute.array.byteLength,
        allocated: required,
        format: attribute.format as GPUVertexFormat,
        itemSize: attribute.itemSize,
        offset: attribute.offset,
        stride: attribute.stride,
      };
      record.attributes.set(name, entry);
      record.bytes += required;
      this.bytesUsed += required;
    }

    if (entry.version !== attribute.version) {
      const data = paddedBytes(attribute);
      // `Uint8Array<ArrayBufferLike>` is not structurally assignable to
      // `GPUAllowSharedBufferSource` under the bundled `@webgpu/types`.
      safeWriteBuffer(this.device.queue, entry.buffer, 0, data);
      entry.version = attribute.version;
      entry.byteLength = attribute.array.byteLength;
      entry.format = attribute.format as GPUVertexFormat;
      entry.itemSize = attribute.itemSize;
      entry.offset = attribute.offset;
      entry.stride = attribute.stride;
    }
    return entry;
  }

  /** Uploads (or refreshes) the index buffer. */
  private uploadIndex(record: WgpuGeometryRecord, index: BufferAttribute): WgpuIndexRecord {
    const required = allocSize(index.array.byteLength);
    const format: GPUIndexFormat = index.array instanceof Uint32Array ? 'uint32' : 'uint16';

    // Growing an index array needs a reallocation for the same reason a vertex
    // array does: `writeBuffer` fails when the write exceeds the destination.
    if (record.index && required > record.index.allocated) {
      record.index.buffer.destroy();
      this.bytesUsed -= record.index.allocated;
      record.bytes -= record.index.allocated;
      record.index = null;
    }

    if (!record.index) {
      record.index = {
        buffer: this.device.createBuffer({
          label: 'mini3d.index',
          size: required,
          usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
        }),
        version: -1,
        allocated: required,
        format,
      };
      record.bytes += required;
      this.bytesUsed += required;
    }

    const entry = record.index;
    if (entry.version !== index.version || entry.format !== format) {
      const data = paddedBytes(index);
      // See the note on the vertex-buffer upload above.
      safeWriteBuffer(this.device.queue, entry.buffer, 0, data);
      entry.version = index.version;
      entry.format = format;
    }
    return entry;
  }

  /** Uploads every attribute plus the index of `geometry`. */
  prepare(geometry: BufferGeometry): WgpuGeometryRecord {
    const record = this.record(geometry);
    for (const [name, attribute] of Object.entries(geometry.attributes)) {
      this.uploadAttribute(record, name, attribute);
    }
    if (geometry.index) this.uploadIndex(record, geometry.index);
    return record;
  }

  /** The uploaded attribute records of `geometry`, uploading as needed. */
  attributes(geometry: BufferGeometry): Map<string, WgpuAttributeRecord> {
    const record = this.prepare(geometry);
    return record.attributes;
  }

  /** The uploaded index record of `geometry`, or `null` when non-indexed. */
  index(geometry: BufferGeometry): WgpuIndexRecord | null {
    const record = this.prepare(geometry);
    return record.index;
  }

  /**
   * Builds (or returns) the index buffer a **line strip** draws with.
   *
   * WebGPU has no non-indexed `line-strip`; the strip is expressed as a
   * `line-list` whose index buffer is `0,1, 1,2, 2,3, 閳ヮ泦 over
   * `vertexCount` vertices, which also supplies the closing segment of a
   * `LineLoop` (the loop geometry repeats its first vertex).
   *
   * Returns `null` when fewer than two vertices are available.
   */
  lineStripIndex(
    geometry: BufferGeometry,
    vertexCount: number,
  ): { buffer: GPUBuffer; count: number; format: GPUIndexFormat } | null {
    if (vertexCount < 2) return null;
    return this.expand(geometry, 'line-strip', vertexCount, false);
  }

  /**
   * Builds (or returns) the identity index buffer an **indexed point cloud**
   * draws with. Non-indexed point clouds need no expansion at all, so this is
   * only called when `geometry.index` is set.
   */
  pointsIndex(
    geometry: BufferGeometry,
    vertexCount: number,
  ): { buffer: GPUBuffer; count: number; format: GPUIndexFormat } | null {
    if (vertexCount < 1) return null;
    return this.expand(geometry, 'points', vertexCount, true);
  }

  /**
   * Shared expansion implementation.
   *
   * `pairs` builds the `0,1, 1,2, 閳ヮ泦 strip index list; otherwise an identity
   * map over either the geometry's own index array (`useSourceIndex`) or the
   * vertex order is generated.
   */
  private expand(
    geometry: BufferGeometry,
    mode: DrawMode,
    count: number,
    useSourceIndex: boolean,
  ): { buffer: GPUBuffer; count: number; format: GPUIndexFormat } {
    const source = useSourceIndex ? geometry.index : null;
    const record = this.record(geometry);
    const sourceVersion = source ? source.version : -1;
    const cached = record.expansion;

    if (
      cached &&
      cached.mode === mode &&
      cached.sourceVersion === sourceVersion &&
      cached.count === count
    ) {
      return { buffer: cached.buffer, count: cached.count, format: 'uint32' };
    }

    const values = new Uint32Array(Math.max(1, count));
    if (mode === 'line-strip') {
      buildStripPairs(values, count);
    } else {
      for (let i = 0; i < count; i++) {
        values[i] = source ? Number(source.array[i]) : i;
      }
    }

    const allocated = allocSize(values.byteLength);
    if (cached && cached.allocated >= allocated) {
      safeWriteBuffer(this.device.queue, cached.buffer, 0, values);
      cached.sourceVersion = sourceVersion;
      cached.count = count;
      cached.mode = mode;
      return { buffer: cached.buffer, count, format: 'uint32' };
    }

    if (cached) {
      cached.buffer.destroy();
      record.bytes -= cached.allocated;
      this.bytesUsed -= cached.allocated;
    }

    const buffer = this.device.createBuffer({
      label: mode === 'line-strip' ? 'mini3d.lineStrip' : 'mini3d.points',
      size: allocated,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    safeWriteBuffer(this.device.queue, buffer, 0, values);
    record.expansion = { buffer, sourceVersion, count, mode, allocated };
    record.bytes += allocated;
    this.bytesUsed += allocated;
    return { buffer, count, format: 'uint32' };
  }

  /** Frees every buffer owned by `geometry`. */
  release(geometry: BufferGeometry): void {
    const record = this.records.get(geometry);
    if (!record) return;
    for (const entry of record.attributes.values()) entry.buffer.destroy();
    record.attributes.clear();
    record.index?.buffer.destroy();
    record.expansion?.buffer.destroy();
    this.bytesUsed = Math.max(0, this.bytesUsed - record.bytes);
    record.bytes = 0;
    this.records.delete(geometry);
    this.tracked.delete(geometry);
  }

  dispose(): void {
    for (const geometry of Array.from(this.tracked)) this.release(geometry);
    this.tracked.clear();
    this.bytesUsed = 0;
  }
}

// ------------------------------------------------------------------ helpers --

/**
 * Fills `target` with the line-strip expansion `0,1, 1,2, 2,3, 閳ヮ泦 for
 * `count` vertices, i.e. `2 * (count - 1)` index entries.
 */
export function buildStripPairs(target: Uint32Array, count: number): void {
  const segments = Math.max(0, count - 1);
  for (let segment = 0; segment < segments; segment++) {
    target[segment * 2] = segment;
    target[segment * 2 + 1] = segment + 1;
  }
}

/** Rounds a byte size up to the next multiple of four (minimum four). */
export function allocSize(size: number): number {
  return Math.max(4, (size + 3) & ~3);
}

/**
 * A `Uint8Array` of the attribute's bytes, zero-padded up to a multiple of
 * four. Returns a view over the source buffer when no padding is needed.
 */
export function paddedBytes(attribute: BufferAttribute): Uint8Array {
  const array = attribute.array;
  const view = new Uint8Array(array.buffer as ArrayBuffer, array.byteOffset, array.byteLength);
  const allocated = allocSize(array.byteLength);
  if (allocated === array.byteLength) return view;
  const padded = new Uint8Array(allocated);
  padded.set(view, 0);
  return padded;
}

/**
 * `GPUVertexBufferLayout[]` for one geometry, in `@location` order. Only the
 * attributes the geometry actually provides are declared, matching what the
 * WGSL entry point consumes.
 */
export function vertexBufferLayouts(
  attributes: Map<string, WgpuAttributeRecord>,
): GPUVertexBufferLayout[] {
  const layouts: GPUVertexBufferLayout[] = [];
  for (const name of PIPELINE_ATTRIBUTES) {
    const record = attributes.get(name);
    const location = ATTRIBUTE_LOCATIONS[name];
    if (!record || location === undefined) continue;
    layouts.push({
      arrayStride: record.stride,
      stepMode: 'vertex',
      attributes: [{ shaderLocation: location, offset: record.offset, format: record.format }],
    });
  }
  return layouts;
}

/** Stable signature of the vertex formats a pipeline must declare. */
export function vertexLayoutKey(attributes: Map<string, WgpuAttributeRecord>): string {
  const parts: string[] = [];
  for (const name of PIPELINE_ATTRIBUTES) {
    const record = attributes.get(name);
    if (!record) continue;
    parts.push(`${name}:${record.format}@${record.offset}/${record.stride}`);
  }
  return parts.length > 0 ? parts.join(',') : 'none';
}
