import { GrowableUint8Array } from './growable.js';
import { mergeDirtyRanges, type DirtyRange } from './dirty.js';

export type AttributeFormat =
  | 'float32x1'
  | 'float32x2'
  | 'float32x3'
  | 'float32x4'
  | 'uint32x1'
  | 'uint32x2'
  | 'uint32x3'
  | 'uint32x4'
  | 'sint32x1'
  | 'sint32x2'
  | 'sint32x3'
  | 'sint32x4'
  | 'uint16x2'
  | 'uint16x4'
  | 'sint16x2'
  | 'sint16x4'
  | 'uint8x4norm'
  | 'sint8x4norm';

type ComponentKind = 'f32' | 'u32' | 'i32' | 'u16' | 'i16' | 'u8' | 'i8';

interface FormatInfo {
  components: number;
  bytes: number;
  kind: ComponentKind;
  normalized: boolean;
}

const FORMATS: Record<AttributeFormat, FormatInfo> = {
  float32x1: { components: 1, bytes: 4, kind: 'f32', normalized: false },
  float32x2: { components: 2, bytes: 4, kind: 'f32', normalized: false },
  float32x3: { components: 3, bytes: 4, kind: 'f32', normalized: false },
  float32x4: { components: 4, bytes: 4, kind: 'f32', normalized: false },
  uint32x1: { components: 1, bytes: 4, kind: 'u32', normalized: false },
  uint32x2: { components: 2, bytes: 4, kind: 'u32', normalized: false },
  uint32x3: { components: 3, bytes: 4, kind: 'u32', normalized: false },
  uint32x4: { components: 4, bytes: 4, kind: 'u32', normalized: false },
  sint32x1: { components: 1, bytes: 4, kind: 'i32', normalized: false },
  sint32x2: { components: 2, bytes: 4, kind: 'i32', normalized: false },
  sint32x3: { components: 3, bytes: 4, kind: 'i32', normalized: false },
  sint32x4: { components: 4, bytes: 4, kind: 'i32', normalized: false },
  uint16x2: { components: 2, bytes: 2, kind: 'u16', normalized: false },
  uint16x4: { components: 4, bytes: 2, kind: 'u16', normalized: false },
  sint16x2: { components: 2, bytes: 2, kind: 'i16', normalized: false },
  sint16x4: { components: 4, bytes: 2, kind: 'i16', normalized: false },
  uint8x4norm: { components: 4, bytes: 1, kind: 'u8', normalized: true },
  sint8x4norm: { components: 4, bytes: 1, kind: 'i8', normalized: true },
};

export interface InterleavedAttributeDescriptor {
  name: string;
  format: AttributeFormat;
  /** Explicit byte offset; auto-packed when omitted. */
  offset?: number;
}

export interface InterleavedAttribute {
  readonly name: string;
  readonly format: AttributeFormat;
  readonly offset: number;
  readonly components: number;
  readonly byteLength: number;
  readonly normalized: boolean;
}

export interface InterleavedBufferOptions {
  attributes: readonly InterleavedAttributeDescriptor[];
  /** Bytes per vertex; derived (and padded to 4) when omitted. */
  stride?: number;
  /** Pre-allocate this many vertices. */
  initialVertices?: number;
}

function alignUp(value: number, alignment: number): number {
  return Math.ceil(value / alignment) * alignment;
}

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

/**
 * Packs separate per-attribute arrays into one interleaved vertex buffer.
 * Layout is derived once; `write` interleaves a stream, `resize` changes the
 * vertex count without rebuilding the object.
 */
export class InterleavedBuffer {
  readonly stride: number;
  readonly attributes: readonly InterleavedAttribute[];

  private readonly bytes: GrowableUint8Array;
  private readonly byName = new Map<string, InterleavedAttribute>();
  private readonly dirty: DirtyRange[] = [];
  private vertexCountValue = 0;

  constructor(options: InterleavedBufferOptions) {
    if (options.attributes.length === 0) {
      throw new Error('[gpu-renderer] InterleavedBuffer needs at least one attribute');
    }

    const attributes: InterleavedAttribute[] = [];
    let cursor = 0;

    for (const descriptor of options.attributes) {
      const info = FORMATS[descriptor.format];
      if (!info) throw new Error(`[gpu-renderer] unknown attribute format "${descriptor.format}"`);
      const offset = descriptor.offset ?? alignUp(cursor, info.bytes);
      if (offset % info.bytes !== 0) {
        throw new Error(
          `[gpu-renderer] attribute "${descriptor.name}" offset ${offset} must be a multiple of ${info.bytes}`,
        );
      }
      const byteLength = info.components * info.bytes;
      const attribute: InterleavedAttribute = {
        name: descriptor.name,
        format: descriptor.format,
        offset,
        components: info.components,
        byteLength,
        normalized: info.normalized,
      };
      attributes.push(attribute);
      this.byName.set(attribute.name, attribute);
      cursor = Math.max(cursor, offset + byteLength);
    }

    for (let i = 0; i < attributes.length; i++) {
      for (let j = i + 1; j < attributes.length; j++) {
        const a = attributes[i];
        const b = attributes[j];
        if (!a || !b) continue;
        if (a.name === b.name) throw new Error(`[gpu-renderer] duplicate attribute "${a.name}"`);
        if (a.offset < b.offset + b.byteLength && b.offset < a.offset + a.byteLength) {
          throw new Error(`[gpu-renderer] attributes "${a.name}" and "${b.name}" overlap`);
        }
      }
    }

    const stride = options.stride ?? alignUp(cursor, 4);
    if (stride % 4 !== 0) {
      throw new Error(`[gpu-renderer] vertex stride ${stride} must be a multiple of 4`);
    }
    if (stride < cursor) {
      throw new Error(`[gpu-renderer] vertex stride ${stride} is smaller than the attribute payload ${cursor}`);
    }

    this.stride = stride;
    this.attributes = attributes;
    this.bytes = new GrowableUint8Array(0);
    if (options.initialVertices) this.reserve(options.initialVertices);
  }

  get vertexCount(): number {
    return this.vertexCountValue;
  }

  get byteLength(): number {
    return this.vertexCountValue * this.stride;
  }

  get view(): Uint8Array {
    return this.bytes.view;
  }

  get capacity(): number {
    return Math.floor(this.bytes.capacity / this.stride);
  }

  /** Merged byte ranges changed since the last `takeDirtyRanges()` / `markClean()`. */
  get dirtyRanges(): readonly DirtyRange[] {
    return mergeDirtyRanges(this.dirty);
  }

  /** Returns the merged dirty ranges and marks the buffer clean. */
  takeDirtyRanges(): DirtyRange[] {
    const merged = mergeDirtyRanges(this.dirty);
    this.dirty.length = 0;
    return merged;
  }

  markClean(): void {
    this.dirty.length = 0;
  }

  private markDirty(offset: number, size: number): void {
    if (size > 0) this.dirty.push({ offset, size });
  }

  get layout(): { stride: number; attributes: readonly InterleavedAttribute[] } {
    return { stride: this.stride, attributes: this.attributes };
  }

  reserve(vertices: number): void {
    if (vertices < 0) throw new RangeError(`invalid vertex count ${vertices}`);
    this.bytes.reserve(vertices * this.stride);
  }

  resize(vertices: number): void {
    if (vertices < 0 || !Number.isInteger(vertices)) {
      throw new RangeError(`invalid vertex count ${vertices}`);
    }
    const byteLength = vertices * this.stride;
    const previous = this.vertexCountValue * this.stride;
    if (byteLength > this.bytes.capacity) this.bytes.reserve(byteLength);
    this.bytes.resize(byteLength);
    this.vertexCountValue = vertices;
    if (byteLength > previous) this.markDirty(previous, byteLength - previous);
  }

  clear(): void {
    this.bytes.resize(0);
    this.vertexCountValue = 0;
  }

  private ensure(vertices: number): void {
    if (vertices > this.vertexCountValue) this.resize(vertices);
  }

  private attribute(name: string): InterleavedAttribute {
    const attribute = this.byName.get(name);
    if (!attribute) throw new Error(`[gpu-renderer] unknown attribute "${name}"`);
    return attribute;
  }

  /** Interleaves a whole stream (or a slice of it) from a separate user array. */
  write(name: string, values: ArrayLike<number>, vertexOffset = 0, vertexCount?: number): this {
    const attribute = this.attribute(name);
    const count =
      vertexCount ?? Math.floor(values.length / attribute.components);
    if (count * attribute.components > values.length) {
      throw new RangeError(`[gpu-renderer] "${name}" needs ${count * attribute.components} values`);
    }
    this.ensure(vertexOffset + count);
    const view = new DataView(this.bytes.buffer);
    const info = FORMATS[attribute.format];

    for (let v = 0; v < count; v++) {
      const base = (vertexOffset + v) * this.stride + attribute.offset;
      for (let c = 0; c < attribute.components; c++) {
        const value = values[v * attribute.components + c];
        if (value === undefined) continue;
        this.writeComponent(view, base + c * info.bytes, info, value);
      }
    }
    this.markDirty(vertexOffset * this.stride, count * this.stride);
    return this;
  }

  /** Writes one vertex from named streams. */
  writeVertex(index: number, values: Record<string, ArrayLike<number>>): this {
    if (index < 0 || !Number.isInteger(index)) throw new RangeError(`invalid vertex index ${index}`);
    this.ensure(index + 1);
    const view = new DataView(this.bytes.buffer);
    for (const attribute of this.attributes) {
      const source = values[attribute.name];
      if (!source) throw new Error(`[gpu-renderer] missing attribute "${attribute.name}"`);
      const info = FORMATS[attribute.format];
      const base = index * this.stride + attribute.offset;
      for (let c = 0; c < attribute.components; c++) {
        const value = source[c];
        if (value === undefined) continue;
        this.writeComponent(view, base + c * info.bytes, info, value);
      }
    }
    this.markDirty(index * this.stride, this.stride);
    return this;
  }

  private writeComponent(view: DataView, offset: number, info: FormatInfo, raw: number): void {
    let value = raw;
    if (info.normalized) {
      if (info.kind === 'u8') value = Math.round(clamp(value, 0, 1) * 255);
      else if (info.kind === 'i8') value = Math.round(clamp(value, -1, 1) * 127);
    }
    switch (info.kind) {
      case 'f32':
        view.setFloat32(offset, value, true);
        break;
      case 'u32':
        view.setUint32(offset, value >>> 0, true);
        break;
      case 'i32':
        view.setInt32(offset, value | 0, true);
        break;
      case 'u16':
        view.setUint16(offset, value & 0xffff, true);
        break;
      case 'i16':
        view.setInt16(offset, value | 0, true);
        break;
      case 'u8':
        view.setUint8(offset, value & 0xff);
        break;
      case 'i8':
        view.setInt8(offset, value | 0);
        break;
    }
  }
}
