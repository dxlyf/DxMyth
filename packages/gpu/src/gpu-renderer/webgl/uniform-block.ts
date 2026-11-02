import { GLError, GLCapabilityError, GLResourceError, GLStateError } from './errors.js';
import { GLENUM, uniformComponents, type GL, type GLBlockFieldType, type GLUniformType } from './enums.js';
import type { GLCapabilities } from './caps.js';
import type { GLState } from './state.js';
import type { GLStatsTracker } from './stats.js';
import type { UniformValue } from './uniform.js';

export interface GLUniformBlockField {
  readonly name: string;
  readonly type: GLBlockFieldType;
  readonly offset: number;
  readonly arrayLength: number;
  readonly arrayStride: number;
  readonly matrixStride: number;
  readonly isRowMajor: boolean;
}

interface FieldLayout extends GLUniformBlockField {
  readonly components: number;
  readonly kind: 'f32' | 'i32' | 'u32' | 'mat';
}

type Views = { f32: Float32Array; i32: Int32Array; u32: Uint32Array };

function kindOf(type: GLBlockFieldType): 'f32' | 'i32' | 'u32' | 'mat' {
  if (type.startsWith('mat')) return 'mat';
  if (type.endsWith('u') || type === 'u32') return 'u32';
  if (type.endsWith('i') || type.endsWith('i32')) return 'i32';
  return 'f32';
}

/**
 * Layout of one active uniform block, taken from driver reflection
 * (`UNIFORM_OFFSET` / `UNIFORM_ARRAY_STRIDE` / `UNIFORM_MATRIX_STRIDE`), so it
 * is always std140-correct for this context without guessing.
 */
export class GLUniformBlockLayout {
  readonly name: string;
  readonly size: number;
  readonly fields: readonly GLUniformBlockField[];
  private readonly layouts: readonly FieldLayout[];
  private readonly byName = new Map<string, FieldLayout>();

  constructor(name: string, size: number, fields: readonly GLUniformBlockField[]) {
    this.name = name;
    this.size = size;
    this.fields = fields;
    const layouts: FieldLayout[] = [];
    for (const field of fields) {
      if (field.isRowMajor) {
        throw new GLError(
          'webgl/uniform-block',
          `uniform block "${name}" field "${field.name}" is row-major; declare the block as column-major (default)`,
        );
      }
      const layout: FieldLayout = {
        ...field,
        components: uniformComponents(field.type as GLUniformType),
        kind: kindOf(field.type),
      };
      layouts.push(layout);
      this.byName.set(field.name, layout);
    }
    this.layouts = layouts;
  }

  field(name: string): GLUniformBlockField | null {
    return this.byName.get(name) ?? null;
  }

  write(views: Views, base: number, values: Record<string, number | ArrayLike<number>>): void {
    for (const name in values) {
      if (!Object.prototype.hasOwnProperty.call(values, name)) continue;
      const value = values[name];
      if (value === undefined) continue;
      const field = this.byName.get(name);
      if (!field) {
        throw new GLError('webgl/uniform-block', `unknown field "${name}" in block "${this.name}"`);
      }
      this.writeField(views, base + field.offset, field, value);
    }
  }

  private writeField(
    views: Views,
    offset: number,
    field: FieldLayout,
    value: number | ArrayLike<number>,
  ): void {
    const expected = field.components * field.arrayLength;
    const data = typeof value === 'number' ? [value] : value;
    if (data.length !== expected) {
      throw new GLError(
        'webgl/uniform-block',
        `block "${this.name}" field "${field.name}" expects ${expected} values, received ${data.length}`,
      );
    }

    if (field.kind === 'mat') {
      this.writeMatrix(views.f32, offset, field, data);
    } else if (field.kind === 'i32') {
      this.writeVector(views.i32, offset, field, data);
    } else if (field.kind === 'u32') {
      this.writeVector(views.u32, offset, field, data);
    } else {
      this.writeVector(views.f32, offset, field, data);
    }
  }

  private writeVector(
    target: Float32Array | Int32Array | Uint32Array,
    offset: number,
    field: FieldLayout,
    data: ArrayLike<number>,
  ): void {
    const components = field.components;
    const stride = field.arrayStride > 0 ? field.arrayStride : components * 4;
    for (let element = 0; element < field.arrayLength; element++) {
      const elementOffset = offset + element * stride;
      for (let c = 0; c < components; c++) {
        target[(elementOffset + c * 4) / 4] = Number(data[element * components + c] ?? 0);
      }
    }
  }

  private writeMatrix(target: Float32Array, offset: number, field: FieldLayout, data: ArrayLike<number>): void {
    const columns = Math.round(Math.sqrt(field.components));
    const rows = field.components / columns;
    const matrixStride = field.matrixStride > 0 ? field.matrixStride : columns * 16;
    const elementStride = field.arrayStride > 0 ? field.arrayStride : matrixStride * columns;
    for (let element = 0; element < field.arrayLength; element++) {
      const elementOffset = offset + element * elementStride;
      for (let column = 0; column < columns; column++) {
        const columnOffset = elementOffset + column * matrixStride;
        for (let row = 0; row < rows; row++) {
          target[(columnOffset + row * 4) / 4] = Number(data[element * field.components + column * rows + row] ?? 0);
        }
      }
    }
  }
}

export interface UniformBufferDescriptor {
  label?: string;
  /** Layout from `program.uniformBlockLayout(name)`; enables `set(values)`. */
  layout?: GLUniformBlockLayout;
  /** Raw std140 data when no layout is provided. */
  data?: ArrayBufferView;
  byteLength?: number;
  usage?: 'static' | 'dynamic';
}

const USAGE = {
  static: GLENUM.STATIC_DRAW,
  dynamic: GLENUM.DYNAMIC_DRAW,
} as const;

/** WebGL2 uniform buffer (UNIFORM_BUFFER). WebGL1 has no equivalent. */
export class GLUniformBuffer {
  readonly label: string;
  readonly handle: WebGLBuffer;
  readonly byteLength: number;
  readonly layout: GLUniformBlockLayout | null;

  private readonly gl: GL;
  private readonly state: GLState;
  private readonly stats: GLStatsTracker;
  private readonly staging: ArrayBuffer | null = null;
  private readonly views: Views | null = null;
  private destroyedFlag = false;

  constructor(
    gl: GL,
    version: 1 | 2,
    caps: GLCapabilities,
    state: GLState,
    stats: GLStatsTracker,
    desc: UniformBufferDescriptor,
  ) {
    if (version === 1 || !caps.has('uniform-buffer')) {
      throw new GLCapabilityError('uniform-buffer', 'uniform buffer objects require WebGL2');
    }
    this.gl = gl;
    this.state = state;
    this.stats = stats;
    this.label = desc.label ?? 'uniform-buffer';
    this.layout = desc.layout ?? null;

    const byteLength = desc.byteLength ?? desc.layout?.size ?? desc.data?.byteLength ?? 0;
    if (!Number.isInteger(byteLength) || byteLength <= 0) {
      throw new GLError('webgl/uniform-block', `invalid byteLength ${byteLength} for "${this.label}"`);
    }
    if (byteLength > caps.limits.maxUniformBlockSize) {
      throw new GLError(
        'webgl/uniform-block',
        `"${this.label}" is ${byteLength} bytes; limit is ${caps.limits.maxUniformBlockSize}`,
      );
    }
    if (desc.layout && byteLength < desc.layout.size) {
      throw new GLError(
        'webgl/uniform-block',
        `"${this.label}" is ${byteLength} bytes but its layout needs ${desc.layout.size}`,
      );
    }
    this.byteLength = byteLength;

    const handle = gl.createBuffer();
    if (!handle) throw new GLError('webgl/uniform-block', `unable to create uniform buffer "${this.label}"`);
    this.handle = handle;

    gl.bindBuffer(GLENUM.UNIFORM_BUFFER, handle);
    if (desc.data) {
      gl.bufferData(GLENUM.UNIFORM_BUFFER, desc.data, USAGE[desc.usage ?? 'dynamic']);
    } else {
      gl.bufferData(GLENUM.UNIFORM_BUFFER, byteLength, USAGE[desc.usage ?? 'dynamic']);
    }
    gl.bindBuffer(GLENUM.UNIFORM_BUFFER, null);
    this.stats.bufferUploads += byteLength;

    if (this.layout) {
      this.staging = new ArrayBuffer(byteLength);
      this.views = {
        f32: new Float32Array(this.staging),
        i32: new Int32Array(this.staging),
        u32: new Uint32Array(this.staging),
      };
    }
  }

  get destroyed(): boolean {
    return this.destroyedFlag;
  }

  ensureAlive(): void {
    if (this.destroyedFlag) throw new GLResourceError(this.label, 'destroyed');
  }

  /** Writes fields through the block layout and uploads the whole block. */
  set(values: Record<string, number | ArrayLike<number>>): void {
    this.ensureAlive();
    if (!this.layout || !this.staging || !this.views) {
      throw new GLStateError('invalid-order', `"${this.label}" has no layout; use update() instead of set()`);
    }
    this.layout.write(this.views, 0, values);
    this.flush();
  }

  /** Uploads the CPU staging buffer (used together with `layout`). */
  flush(): void {
    this.ensureAlive();
    if (!this.staging) return;
    this.gl.bindBuffer(GLENUM.UNIFORM_BUFFER, this.handle);
    this.gl.bufferSubData(GLENUM.UNIFORM_BUFFER, 0, this.staging);
    this.gl.bindBuffer(GLENUM.UNIFORM_BUFFER, null);
    this.stats.bufferUploads += this.byteLength;
  }

  update(data: ArrayBufferView, byteOffset = 0): void {
    this.ensureAlive();
    if (byteOffset < 0 || byteOffset + data.byteLength > this.byteLength) {
      throw new GLError(
        'webgl/uniform-block',
        `update of "${this.label}" out of range: ${byteOffset} + ${data.byteLength} > ${this.byteLength}`,
      );
    }
    this.gl.bindBuffer(GLENUM.UNIFORM_BUFFER, this.handle);
    this.gl.bufferSubData(GLENUM.UNIFORM_BUFFER, byteOffset, data);
    this.gl.bindBuffer(GLENUM.UNIFORM_BUFFER, null);
    this.stats.bufferUploads += data.byteLength;
  }

  destroy(): void {
    if (this.destroyedFlag) return;
    this.state.forgetUniformBuffer(this.handle);
    this.gl.deleteBuffer(this.handle);
    this.destroyedFlag = true;
  }
}
