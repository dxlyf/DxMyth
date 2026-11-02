export type TypedArray =
  | Float32Array
  | Uint32Array
  | Int32Array
  | Uint16Array
  | Int16Array
  | Uint8Array
  | Int8Array;

type TypedArrayConstructor<T extends TypedArray> = new (length: number) => T;

/**
 * Growable typed array with amortized O(1) append.
 *
 * `view` is a zero-copy window with `length` elements; `buffer` is the raw
 * backing store (capacity may be larger than length).
 */
export class GrowableArray<T extends TypedArray> {
  private data: T;
  private lengthValue = 0;

  constructor(
    private readonly ctor: TypedArrayConstructor<T>,
    capacity = 0,
  ) {
    this.data = new ctor(Math.max(0, Math.floor(capacity)));
  }

  get length(): number {
    return this.lengthValue;
  }

  get capacity(): number {
    return this.data.length;
  }

  get view(): T {
    return (this.data as TypedArray).subarray(0, this.lengthValue) as T;
  }

  get buffer(): ArrayBuffer {
    return this.data.buffer as ArrayBuffer;
  }

  reserve(capacity: number): void {
    if (capacity <= this.capacity) return;
    let next = Math.max(16, this.capacity);
    while (next < capacity) next *= 2;
    const data = new this.ctor(next);
    // Copy the whole capacity, not just `length`: callers may write through
    // views over `buffer` (e.g. the uniform block packer) without updating length.
    (data as TypedArray).set(this.data as TypedArray);
    this.data = data;
  }

  resize(length: number): void {
    if (length < 0 || !Number.isInteger(length)) {
      throw new RangeError(`invalid growable length ${length}`);
    }
    if (length > this.lengthValue) {
      this.reserve(length);
      (this.data as TypedArray).fill(0, this.lengthValue, length);
    }
    this.lengthValue = length;
  }

  push(...values: number[]): void {
    const start = this.lengthValue;
    this.resize(start + values.length);
    for (let i = 0; i < values.length; i++) {
      (this.data as TypedArray)[start + i] = values[i] as number;
    }
  }

  append(values: ArrayLike<number>): void {
    const start = this.lengthValue;
    this.resize(start + values.length);
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      if (value !== undefined) (this.data as TypedArray)[start + i] = value;
    }
  }

  set(index: number, value: number): void {
    if (index < 0 || index >= this.lengthValue) throw new RangeError(`index ${index} out of range`);
    (this.data as TypedArray)[index] = value;
  }

  clear(): void {
    this.lengthValue = 0;
  }

  toArray(): T {
    return (this.data as TypedArray).slice(0, this.lengthValue) as T;
  }
}

export class GrowableFloat32Array extends GrowableArray<Float32Array> {
  constructor(capacity = 0) {
    super(Float32Array, capacity);
  }
}

export class GrowableUint32Array extends GrowableArray<Uint32Array> {
  constructor(capacity = 0) {
    super(Uint32Array, capacity);
  }
}

export class GrowableUint16Array extends GrowableArray<Uint16Array> {
  constructor(capacity = 0) {
    super(Uint16Array, capacity);
  }
}

export class GrowableUint8Array extends GrowableArray<Uint8Array> {
  constructor(capacity = 0) {
    super(Uint8Array, capacity);
  }
}

export class GrowableInt32Array extends GrowableArray<Int32Array> {
  constructor(capacity = 0) {
    super(Int32Array, capacity);
  }
}
