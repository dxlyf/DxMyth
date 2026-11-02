import { ValidationError } from '../../../core/errors';
import type { WebGLBuffer } from '../../webgl/resources/WebGLBuffer';
import type { WebGL2Context } from '../WebGL2Context';

/** Uniform 块描述。 */
export interface UniformBlockDesc {
  label?: string;
  /** 绑定点，对应 `gl.bindBufferBase` 的 index。 */
  binding: number;
  /** 初始数据。 */
  data?: ArrayBufferView;
  /** 未提供数据时的字节大小。 */
  size?: number;
}

/**
 * WebGL2 uniform 块（UBO）。
 *
 * 只负责缓冲与绑定点管理；布局（std140）由调用方按需计算。
 */
export class WebGL2UniformBlock {
  readonly buffer: WebGLBuffer;
  readonly binding: number;
  readonly #context: WebGL2Context;

  constructor(context: WebGL2Context, buffer: WebGLBuffer, binding: number) {
    if (!Number.isInteger(binding) || binding < 0) {
      throw new ValidationError(`bindBufferBase 的绑定点必须是非负整数：${binding}`);
    }
    this.#context = context;
    this.buffer = buffer;
    this.binding = binding;
    this.bind();
  }

  /** 重新绑定到 UBO 绑定点。 */
  bind(): void {
    const gl = this.#context.gl2;
    gl.bindBufferBase(gl.UNIFORM_BUFFER, this.binding, this.buffer.handle);
  }

  /** 更新块数据。 */
  update(data: ArrayBufferView, offset = 0): void {
    this.buffer.update(data, offset);
  }
}
