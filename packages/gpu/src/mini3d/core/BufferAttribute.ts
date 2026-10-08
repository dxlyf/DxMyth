/** Typed arrays accepted as buffer attribute storage. */
export type TypedArray =
  | Float32Array
  | Float64Array
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array;

export type TypedArrayConstructor =
  | Float32ArrayConstructor
  | Float64ArrayConstructor
  | Int8ArrayConstructor
  | Uint8ArrayConstructor
  | Uint8ClampedArrayConstructor
  | Int16ArrayConstructor
  | Uint16ArrayConstructor
  | Int32ArrayConstructor
  | Uint32ArrayConstructor;

/**
 * GL / WGSL vertex format names. Backends translate these into
 * `vertexAttribPointer` calls or `GPUVertexFormat` strings.
 */
export type VertexFormat =
  | 'float32'
  | 'float32x2'
  | 'float32x3'
  | 'float32x4'
  | 'sint8'
  | 'sint8x2'
  | 'sint8x4'
  | 'uint8'
  | 'uint8x2'
  | 'uint8x4'
  | 'snorm8'
  | 'snorm8x2'
  | 'snorm8x4'
  | 'unorm8'
  | 'unorm8x2'
  | 'unorm8x4'
  | 'sint16'
  | 'sint16x2'
  | 'sint16x4'
  | 'uint16'
  | 'uint16x2'
  | 'uint16x4'
  | 'snorm16'
  | 'snorm16x2'
  | 'snorm16x4'
  | 'unorm16'
  | 'unorm16x2'
  | 'unorm16x4'
  | 'sint32'
  | 'sint32x2'
  | 'sint32x3'
  | 'sint32x4'
  | 'uint32'
  | 'uint32x2'
  | 'uint32x3'
  | 'uint32x4';

/** Semantic hint used by shader generators to name vertex inputs. */
export type AttributeSemantic =
  | 'position'
  | 'normal'
  | 'uv'
  | 'uv1'
  | 'uv2'
  | 'color'
  | 'tangent'
  | 'skinIndex'
  | 'skinWeight'
  | 'custom';

/**
 * A single named vertex buffer: raw typed-array data plus the layout metadata
 * (item size, normalisation, stride/offset) that backends need to bind it.
 */
export class BufferAttribute {
  name: string;
  array: TypedArray;
  itemSize: number;
  normalized: boolean;
  usage: 'static' | 'dynamic' | 'stream';
  /** GPU buffer revision; backends bump this to know when to re-upload. */
  version: number;
  /** Free-form semantic used by the shader builder. */
  semantic: AttributeSemantic;

  constructor(
    array: TypedArray,
    itemSize: number,
    normalized = false,
    options: {
      name?: string;
      usage?: 'static' | 'dynamic' | 'stream';
      semantic?: AttributeSemantic;
    } = {},
  ) {
    if (!ArrayBuffer.isView(array)) {
      throw new TypeError('mini3d.BufferAttribute: `array` must be a typed array');
    }
    this.array = array;
    this.itemSize = itemSize;
    this.normalized = normalized;
    this.name = options.name ?? '';
    this.usage = options.usage ?? 'static';
    this.semantic = options.semantic ?? 'custom';
    this.version = 0;
  }

  /** Number of vertices (not components). */
  get count(): number {
    return this.array.length / this.itemSize;
  }

  /** Bytes between consecutive vertices. */
  get stride(): number {
    return this.array.BYTES_PER_ELEMENT * this.itemSize;
  }

  /** Zero offset: attributes are always tightly packed in mini3d. */
  get offset(): number {
    return 0;
  }

  get bytesPerElement(): number {
    return this.array.BYTES_PER_ELEMENT;
  }

  /** GPU vertex format derived from the typed array + item size. */
  get format(): VertexFormat {
    return inferVertexFormat(this.array, this.itemSize, this.normalized);
  }

  setXYZ(index: number, x: number, y: number, z: number): this {
    const i = index * this.itemSize;
    this.array[i] = x;
    this.array[i + 1] = y;
    this.array[i + 2] = z;
    return this;
  }

  setXY(index: number, x: number, y: number): this {
    const i = index * this.itemSize;
    this.array[i] = x;
    this.array[i + 1] = y;
    return this;
  }

  setX(index: number, x: number): this {
    this.array[index * this.itemSize] = x;
    return this;
  }

  getX(index: number): number {
    return this.array[index * this.itemSize];
  }

  getY(index: number): number {
    return this.array[index * this.itemSize + 1];
  }

  getZ(index: number): number {
    return this.array[index * this.itemSize + 2];
  }

  setW(index: number, w: number): this {
    this.array[index * this.itemSize + 3] = w;
    return this;
  }

  getW(index: number): number {
    return this.array[index * this.itemSize + 3];
  }

  set(
    index: number,
    value: number | ArrayLike<number>,
    offset = 0,
  ): this {
    if (typeof value === 'number') {
      this.array[index * this.itemSize + offset] = value;
    } else {
      for (let i = 0; i < value.length; i++) {
        this.array[index * this.itemSize + i] = value[i];
      }
    }
    return this;
  }

  copyAt(index1: number, attribute: BufferAttribute, index2: number): this {
    const size = this.itemSize;
    for (let i = 0; i < size; i++) {
      this.array[index1 * size + i] = attribute.array[index2 * size + i];
    }
    return this;
  }

  /** Marks the attribute dirty so `needsUpdate` semantics stay explicit. */
  addUpdateRange(start: number, count: number): void {
    this.updateRanges.push({ start, count });
  }

  readonly updateRanges: { start: number; count: number }[] = [];

  clearUpdateRanges(): void {
    this.updateRanges.length = 0;
  }

  markNeedsUpdate(): this {
    this.version++;
    return this;
  }

  clone(): BufferAttribute {
    const ctor = this.array.constructor as TypedArrayConstructor;
    return new BufferAttribute(new ctor(this.array), this.itemSize, this.normalized, {
      name: this.name,
      usage: this.usage,
      semantic: this.semantic,
    });
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      itemSize: this.itemSize,
      normalized: this.normalized,
      semantic: this.semantic,
      array: Array.from(this.array),
    };
  }
}

/**
 * Interleaved attribute (kept for API parity; mini3d's generators always emit
 * tightly packed `BufferAttribute`s, but custom geometry may use this).
 */
export class InterleavedBufferAttribute extends BufferAttribute {
  readonly data: BufferAttribute;
  readonly interleavedOffset: number;

  constructor(
    data: BufferAttribute,
    itemSize: number,
    offset: number,
    normalized = false,
    name = '',
  ) {
    super(data.array, itemSize, normalized, { name });
    this.data = data;
    this.interleavedOffset = offset;
  }

  override get stride(): number {
    return this.data.stride;
  }

  override get offset(): number {
    return this.interleavedOffset * this.data.bytesPerElement;
  }
}

/** Maps a typed array + item size to a GPU vertex format token. */
export function inferVertexFormat(
  array: TypedArray,
  itemSize: number,
  normalized = false,
): VertexFormat {
  let base:
    | 'float32'
    | 'sint8' | 'snorm8'
    | 'uint8' | 'unorm8'
    | 'sint16' | 'snorm16'
    | 'uint16' | 'unorm16'
    | 'sint32' | 'uint32';
  switch (array.constructor) {
    case Float32Array:
    case Float64Array:
      base = 'float32';
      break;
    case Int8Array:
      base = normalized ? 'snorm8' : 'sint8';
      break;
    case Uint8Array:
    case Uint8ClampedArray:
      base = normalized ? 'unorm8' : 'uint8';
      break;
    case Int16Array:
      base = normalized ? 'snorm16' : 'sint16';
      break;
    case Uint16Array:
      base = normalized ? 'unorm16' : 'uint16';
      break;
    case Int32Array:
      base = 'sint32';
      break;
    case Uint32Array:
      base = 'uint32';
      break;
    default:
      throw new Error('mini3d: unsupported attribute array type');
  }
  if (itemSize === 1) return base as VertexFormat;
  return `${base}x${itemSize}` as VertexFormat;
}

/** Number of components encoded by a `VertexFormat`. */
export function vertexFormatComponents(format: VertexFormat): number {
  const match = /x([234])$/.exec(format);
  return match ? Number(match[1]) : 1;
}
