import { WebGPUError } from './errors.js';

export type UniformFieldType =
  | 'f32'
  | 'i32'
  | 'u32'
  | 'vec2f'
  | 'vec3f'
  | 'vec4f'
  | 'vec2i'
  | 'vec3i'
  | 'vec4i'
  | 'vec2u'
  | 'vec3u'
  | 'vec4u'
  | 'mat2x2f'
  | 'mat3x3f'
  | 'mat4x4f';

export interface UniformFieldDescriptor {
  name: string;
  type: UniformFieldType;
  arrayLength?: number;
}

export interface UniformLayoutDescriptor {
  label?: string;
  fields: UniformFieldDescriptor[];
}

interface TypeInfo {
  align: number;
  size: number;
  components: number;
  kind: 'f32' | 'i32' | 'u32' | 'mat';
}

const TYPE_INFO: Record<UniformFieldType, TypeInfo> = {
  f32: { align: 4, size: 4, components: 1, kind: 'f32' },
  i32: { align: 4, size: 4, components: 1, kind: 'i32' },
  u32: { align: 4, size: 4, components: 1, kind: 'u32' },
  vec2f: { align: 8, size: 8, components: 2, kind: 'f32' },
  vec3f: { align: 16, size: 12, components: 3, kind: 'f32' },
  vec4f: { align: 16, size: 16, components: 4, kind: 'f32' },
  vec2i: { align: 8, size: 8, components: 2, kind: 'i32' },
  vec3i: { align: 16, size: 12, components: 3, kind: 'i32' },
  vec4i: { align: 16, size: 16, components: 4, kind: 'i32' },
  vec2u: { align: 8, size: 8, components: 2, kind: 'u32' },
  vec3u: { align: 16, size: 12, components: 3, kind: 'u32' },
  vec4u: { align: 16, size: 16, components: 4, kind: 'u32' },
  mat2x2f: { align: 8, size: 16, components: 4, kind: 'mat' },
  mat3x3f: { align: 16, size: 48, components: 9, kind: 'mat' },
  mat4x4f: { align: 16, size: 64, components: 16, kind: 'mat' },
};

function alignUp(value: number, alignment: number): number {
  return Math.ceil(value / alignment) * alignment;
}

interface FieldLayout {
  name: string;
  type: UniformFieldType;
  arrayLength: number;
  offset: number;
  stride: number;
  size: number;
  info: TypeInfo;
}

type Writable = Record<string, number | ArrayLike<number>>;

/**
 * WGSL uniform address-space layout for a flat set of fields.
 * Arrays use `stride = alignUp(elementSize, elementAlign)`; the block is 16-byte aligned.
 */
export class UniformLayout {
  readonly label: string;
  readonly fields: readonly FieldLayout[];
  readonly size: number;
  private readonly byName = new Map<string, FieldLayout>();

  constructor(desc: UniformLayoutDescriptor) {
    this.label = desc.label ?? 'uniforms';
    let offset = 0;
    let maxAlign = 1;
    const fields: FieldLayout[] = [];

    for (const field of desc.fields) {
      const info = TYPE_INFO[field.type];
      if (!info) throw new WebGPUError('webgpu/uniform', `unknown uniform type "${field.type}"`);
      const arrayLength = field.arrayLength ?? 1;
      if (!Number.isInteger(arrayLength) || arrayLength < 1) {
        throw new WebGPUError('webgpu/uniform', `invalid arrayLength for "${field.name}"`);
      }
      const stride = alignUp(info.size, info.align);
      const size = stride * arrayLength;
      offset = alignUp(offset, info.align);
      const layout: FieldLayout = {
        name: field.name,
        type: field.type,
        arrayLength,
        offset,
        stride,
        size,
        info,
      };
      fields.push(layout);
      this.byName.set(field.name, layout);
      offset += size;
      maxAlign = Math.max(maxAlign, info.align);
    }

    this.fields = fields;
    this.size = Math.max(alignUp(offset, Math.max(16, maxAlign)), 16);
  }

  field(name: string): FieldLayout | null {
    return this.byName.get(name) ?? null;
  }

  write(views: { f32: Float32Array; i32: Int32Array; u32: Uint32Array }, base: number, values: Writable): void {
    for (const name in values) {
      if (!Object.prototype.hasOwnProperty.call(values, name)) continue;
      const value = values[name];
      if (value === undefined) continue;
      const field = this.byName.get(name);
      if (!field) throw new WebGPUError('webgpu/uniform', `unknown uniform field "${name}" in "${this.label}"`);
      this.writeField(views, base + field.offset, field, value);
    }
  }

  private writeField(
    views: { f32: Float32Array; i32: Int32Array; u32: Uint32Array },
    offset: number,
    field: FieldLayout,
    value: number | ArrayLike<number>,
  ): void {
    const expected = field.info.components * field.arrayLength;
    const data = typeof value === 'number' ? [value] : value;
    if (data.length !== expected) {
      throw new WebGPUError(
        'webgpu/uniform',
        `uniform "${field.name}" expects ${expected} values, received ${data.length}`,
      );
    }

    if (field.info.kind === 'f32') {
      this.writeFloatVector(views.f32, offset, data, field);
    } else if (field.info.kind === 'i32') {
      this.writeIntVector(views.i32, offset, data, field);
    } else if (field.info.kind === 'u32') {
      this.writeIntVector(views.u32, offset, data, field);
    } else {
      this.writeMatrix(views.f32, offset, data, field);
    }
  }

  private writeFloatVector(target: Float32Array, offset: number, data: ArrayLike<number>, field: FieldLayout): void {
    const components = field.info.components;
    for (let element = 0; element < field.arrayLength; element++) {
      const base = (offset + element * field.stride) / 4;
      for (let c = 0; c < components; c++) {
        target[base + c] = Number(data[element * components + c] ?? 0);
      }
    }
  }

  private writeIntVector(
    target: Int32Array | Uint32Array,
    offset: number,
    data: ArrayLike<number>,
    field: FieldLayout,
  ): void {
    const components = field.info.components;
    for (let element = 0; element < field.arrayLength; element++) {
      const base = (offset + element * field.stride) / 4;
      for (let c = 0; c < components; c++) {
        target[base + c] = Number(data[element * components + c] ?? 0);
      }
    }
  }

  private writeMatrix(target: Float32Array, offset: number, data: ArrayLike<number>, field: FieldLayout): void {
    const columns = Math.round(Math.sqrt(field.info.components));
    const rows = field.info.components / columns;
    const columnStride = field.type === 'mat2x2f' ? 8 : 16;
    for (let element = 0; element < field.arrayLength; element++) {
      const elementOffset = offset + element * field.stride;
      for (let column = 0; column < columns; column++) {
        const base = (elementOffset + column * columnStride) / 4;
        for (let row = 0; row < rows; row++) {
          target[base + row] = Number(data[element * field.info.components + column * rows + row] ?? 0);
        }
      }
    }
  }
}

export interface UniformBlock {
  readonly buffer: GPUBuffer;
  readonly bufferId: number;
  readonly offset: number;
  readonly size: number;
  readonly layout: UniformLayout;
  set(values: Writable): void;
}

class ArenaBlock implements UniformBlock {
  buffer!: GPUBuffer;
  bufferId = 0;
  offset = 0;
  size = 0;
  layout!: UniformLayout;
  private f32: Float32Array<ArrayBufferLike> = new Float32Array(0);
  private i32: Int32Array<ArrayBufferLike> = new Int32Array(0);
  private u32: Uint32Array<ArrayBufferLike> = new Uint32Array(0);

  bind(page: Page, offset: number, size: number, layout: UniformLayout): void {
    this.buffer = page.buffer;
    this.bufferId = page.bufferId;
    this.offset = offset;
    this.size = size;
    this.layout = layout;
    this.f32 = page.f32;
    this.i32 = page.i32;
    this.u32 = page.u32;
  }

  set(values: Record<string, number | ArrayLike<number>>): void {
    this.layout.write({ f32: this.f32, i32: this.i32, u32: this.u32 }, this.offset, values);
  }
}

interface Page {
  buffer: GPUBuffer;
  bufferId: number;
  backing: ArrayBuffer;
  f32: Float32Array;
  i32: Int32Array;
  u32: Uint32Array;
  used: number;
  capacity: number;
}

/**
 * Per-frame ring of uniform buffer pages. Writes go to a CPU mirror; `flush`
 * uploads every dirty page with a single `writeBuffer` per page.
 */
export class UniformArena {
  readonly alignment: number;
  private readonly device: GPUDevice;
  private readonly pageSize: number;
  private readonly pages: Page[] = [];
  private readonly blocks: ArenaBlock[] = [];
  private pageIndex = 0;
  private blockIndex = 0;
  private nextBufferId = 1;

  constructor(device: GPUDevice, alignment: number, pageSize = 256 * 1024) {
    this.device = device;
    this.alignment = Math.max(16, alignment);
    this.pageSize = pageSize;
  }

  beginFrame(): void {
    this.pageIndex = 0;
    this.blockIndex = 0;
    for (const page of this.pages) page.used = 0;
  }

  get usedBytes(): number {
    let total = 0;
    for (const page of this.pages) total += page.used;
    return total;
  }

  allocate(layout: UniformLayout): UniformBlock {
    const size = alignUp(layout.size, 16);
    if (size > this.pageSize) {
      throw new WebGPUError(
        'webgpu/uniform',
        `uniform block "${layout.label}" (${size} bytes) exceeds the arena page size (${this.pageSize})`,
      );
    }
    let page = this.pages[this.pageIndex];
    if (!page) {
      page = this.createPage();
      this.pageIndex = this.pages.length - 1;
    }
    const offset = alignUp(page.used, this.alignment);
    if (offset + size > page.capacity) {
      this.pageIndex++;
      page = this.pages[this.pageIndex] ?? this.createPage();
      if (this.pageIndex >= this.pages.length) this.pageIndex = this.pages.length - 1;
      page.used = 0;
      return this.allocateInto(page, layout, size);
    }
    return this.allocateInto(page, layout, size);
  }

  private createPage(): Page {
    const buffer = this.device.createBuffer({
      label: `uniform-arena:${this.pages.length}`,
      size: this.pageSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const backing = new ArrayBuffer(this.pageSize);
    const page: Page = {
      buffer,
      bufferId: this.nextBufferId++,
      backing,
      f32: new Float32Array(backing),
      i32: new Int32Array(backing),
      u32: new Uint32Array(backing),
      used: 0,
      capacity: this.pageSize,
    };
    this.pages.push(page);
    return page;
  }

  private allocateInto(page: Page, layout: UniformLayout, size: number): UniformBlock {
    const offset = alignUp(page.used, this.alignment);
    page.used = offset + size;
    let block = this.blocks[this.blockIndex];
    if (!block) {
      block = new ArenaBlock();
      this.blocks[this.blockIndex] = block;
    }
    this.blockIndex++;
    block.bind(page, offset, size, layout);
    return block;
  }

  flush(queue: GPUQueue): void {
    for (const page of this.pages) {
      if (page.used === 0) continue;
      queue.writeBuffer(page.buffer, 0, page.backing, 0, alignUp(page.used, 4));
    }
  }

  destroy(): void {
    for (const page of this.pages) page.buffer.destroy();
    this.pages.length = 0;
    this.pageIndex = 0;
  }
}
