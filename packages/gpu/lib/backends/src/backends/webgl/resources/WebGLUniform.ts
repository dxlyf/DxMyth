import { UnsupportedError, ValidationError } from '../../../core/errors';
import type { NativeUniformLocation } from '../native';
import type { ReflectedUniform } from '../reflection/ProgramReflection';

type UniformCategory = 'float' | 'int' | 'matrix';

interface UniformKind {
  category: UniformCategory;
  /** 标量 / 向量的分量数，矩阵的元素总数。 */
  components: number;
}

function kindOf(gl: WebGLRenderingContext, type: number): UniformKind | null {
  switch (type) {
    case gl.FLOAT:
      return { category: 'float', components: 1 };
    case gl.FLOAT_VEC2:
      return { category: 'float', components: 2 };
    case gl.FLOAT_VEC3:
      return { category: 'float', components: 3 };
    case gl.FLOAT_VEC4:
      return { category: 'float', components: 4 };
    case gl.INT:
    case gl.BOOL:
    case gl.SAMPLER_2D:
    case gl.SAMPLER_CUBE:
      return { category: 'int', components: 1 };
    case gl.INT_VEC2:
    case gl.BOOL_VEC2:
      return { category: 'int', components: 2 };
    case gl.INT_VEC3:
    case gl.BOOL_VEC3:
      return { category: 'int', components: 3 };
    case gl.INT_VEC4:
    case gl.BOOL_VEC4:
      return { category: 'int', components: 4 };
    case gl.FLOAT_MAT2:
      return { category: 'matrix', components: 4 };
    case gl.FLOAT_MAT3:
      return { category: 'matrix', components: 9 };
    case gl.FLOAT_MAT4:
      return { category: 'matrix', components: 16 };
    default:
      return null;
  }
}

function toFloat32(values: ArrayLike<number>): Float32Array {
  return values instanceof Float32Array ? values : Float32Array.from(values);
}

function toInt32(values: ArrayLike<number>): Int32Array {
  return values instanceof Int32Array ? values : Int32Array.from(values);
}

/** 程序中的一个 uniform，缓存 location 并提供类型化赋值。 */
export class WebGLUniform {
  readonly name: string;
  readonly location: NativeUniformLocation;
  readonly type: number;
  readonly size: number;
  readonly #gl: WebGLRenderingContext;
  readonly #kind: UniformKind | null;

  constructor(gl: WebGLRenderingContext, info: ReflectedUniform) {
    this.#gl = gl;
    this.name = info.name;
    this.location = info.location;
    this.type = info.type;
    this.size = info.size;
    this.#kind = kindOf(gl, info.type);
  }

  /** 设置标量或向量；矩阵请使用 {@link setArray}。 */
  set(...values: number[]): void {
    const kind = this.#requireKind();
    if (kind.category === 'matrix') {
      throw new ValidationError(`uniform「${this.name}」是矩阵，请使用 setArray()`);
    }
    if (values.length !== kind.components) {
      throw new ValidationError(
        `uniform「${this.name}」需要 ${kind.components} 个分量，实际收到 ${values.length} 个`,
      );
    }
    const gl = this.#gl;
    if (kind.category === 'float') {
      switch (kind.components) {
        case 1:
          gl.uniform1f(this.location, values[0]!);
          return;
        case 2:
          gl.uniform2f(this.location, values[0]!, values[1]!);
          return;
        case 3:
          gl.uniform3f(this.location, values[0]!, values[1]!, values[2]!);
          return;
        case 4:
          gl.uniform4f(this.location, values[0]!, values[1]!, values[2]!, values[3]!);
          return;
        default:
          return;
      }
    }
    switch (kind.components) {
      case 1:
        gl.uniform1i(this.location, values[0]!);
        return;
      case 2:
        gl.uniform2i(this.location, values[0]!, values[1]!);
        return;
      case 3:
        gl.uniform3i(this.location, values[0]!, values[1]!, values[2]!);
        return;
      case 4:
        gl.uniform4i(this.location, values[0]!, values[1]!, values[2]!, values[3]!);
        return;
      default:
        return;
    }
  }

  /** 设置数组或矩阵。 */
  setArray(values: ArrayLike<number>): void {
    const kind = this.#requireKind();
    const gl = this.#gl;

    if (kind.category === 'matrix') {
      if (values.length !== kind.components) {
        throw new ValidationError(
          `矩阵 uniform「${this.name}」需要 ${kind.components} 个元素，实际收到 ${values.length} 个`,
        );
      }
      const data = toFloat32(values);
      switch (kind.components) {
        case 4:
          gl.uniformMatrix2fv(this.location, false, data);
          return;
        case 9:
          gl.uniformMatrix3fv(this.location, false, data);
          return;
        case 16:
          gl.uniformMatrix4fv(this.location, false, data);
          return;
        default:
          return;
      }
    }

    if (values.length === 0) {
      throw new ValidationError(`uniform「${this.name}」不能设置为空数组`);
    }

    if (kind.category === 'float') {
      const data = toFloat32(values);
      switch (kind.components) {
        case 1:
          gl.uniform1fv(this.location, data);
          return;
        case 2:
          gl.uniform2fv(this.location, data);
          return;
        case 3:
          gl.uniform3fv(this.location, data);
          return;
        case 4:
          gl.uniform4fv(this.location, data);
          return;
        default:
          return;
      }
    }

    const data = toInt32(values);
    switch (kind.components) {
      case 1:
        gl.uniform1iv(this.location, data);
        return;
      case 2:
        gl.uniform2iv(this.location, data);
        return;
      case 3:
        gl.uniform3iv(this.location, data);
        return;
      case 4:
        gl.uniform4iv(this.location, data);
        return;
      default:
        return;
    }
  }

  /** 把纹理单元绑定到 sampler uniform。 */
  setTexture(unit: number): void {
    this.#gl.uniform1i(this.location, unit);
  }

  #requireKind(): UniformKind {
    if (this.#kind === null) {
      throw new UnsupportedError(`uniform 类型 0x${this.type.toString(16)}`, 'webgl');
    }
    return this.#kind;
  }
}
