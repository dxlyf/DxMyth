import { GrowableUint32Array } from './growable.js';
import { mergeDirtyRanges, type DirtyRange } from './dirty.js';

export interface BlockLayoutLike {
  readonly size: number;
  write(
    views: { f32: Float32Array; i32: Int32Array; u32: Uint32Array },
    base: number,
    values: Record<string, number | ArrayLike<number>>,
  ): void;
}

export interface UniformBlockPackerOptions {
  /** Byte alignment for each block; use the backend limit (e.g. 256). */
  alignment?: number;
  /** Initial capacity in bytes. */
  capacityBytes?: number;
}

export interface PackedBlock {
  readonly offset: number;
  readonly size: number;
}

function alignUp(value: number, alignment: number): number {
  return Math.ceil(value / alignment) * alignment;
}

/**
 * Packs multiple uniform blocks into one growable byte buffer, each block
 * aligned to `alignment`. Layouts (WebGL std140 reflection or WebGPU
 * UniformLayout) write the fields; the packer only handles placement.
 *
 * Offsets stay valid across growth. `view` changes identity after growth, so
 * upload it again (or call `update` on a buffer) after `add`.
 */
export class UniformBlockPacker {
  readonly alignment: number;

  private readonly words = new GrowableUint32Array(0);
  private readonly dirty: DirtyRange[] = [];
  private used = 0;

  constructor(options: UniformBlockPackerOptions = {}) {
    this.alignment = Math.max(4, Math.floor(options.alignment ?? 256));
    if (options.capacityBytes && options.capacityBytes > 0) {
      this.reserve(options.capacityBytes);
    }
  }

  /** Byte length of the used region, rounded up to 4. */
  get byteLength(): number {
    return alignUp(this.used, 4);
  }

  get capacity(): number {
    return this.words.capacity * 4;
  }

  get view(): Uint8Array {
    return new Uint8Array(this.words.buffer, 0, this.byteLength);
  }

  get dirtyRanges(): readonly DirtyRange[] {
    return mergeDirtyRanges(this.dirty);
  }

  takeDirtyRanges(): DirtyRange[] {
    const merged = mergeDirtyRanges(this.dirty);
    this.dirty.length = 0;
    return merged;
  }

  markClean(): void {
    this.dirty.length = 0;
  }

  reserve(bytes: number): void {
    if (bytes <= 0) return;
    this.words.reserve(Math.ceil(bytes / 4));
  }

  add(layout: BlockLayoutLike, values: Record<string, number | ArrayLike<number>>): PackedBlock {
    const offset = alignUp(this.used, this.alignment);
    const size = layout.size;
    const end = offset + size;
    if (end > this.capacity) this.words.reserve(Math.ceil(end / 4));

    layout.write(
      {
        f32: new Float32Array(this.words.buffer),
        i32: new Int32Array(this.words.buffer),
        u32: new Uint32Array(this.words.buffer),
      },
      offset,
      values,
    );
    this.used = end;
    this.dirty.push({ offset, size });
    return { offset, size };
  }

  /** Appends already-packed bytes (e.g. raw std140 data). */
  addBytes(data: ArrayBufferView): PackedBlock {
    const offset = alignUp(this.used, this.alignment);
    const size = data.byteLength;
    const end = offset + size;
    if (end > this.capacity) this.words.reserve(Math.ceil(end / 4));
    new Uint8Array(this.words.buffer).set(new Uint8Array(data.buffer, data.byteOffset, data.byteLength), offset);
    this.used = end;
    this.dirty.push({ offset, size });
    return { offset, size };
  }

  clear(): void {
    this.used = 0;
    this.dirty.length = 0;
  }
}
