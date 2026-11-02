import type { VertexAttributeDesc } from '../../../core/descriptors';
import { BackendError, UnsupportedError } from '../../../core/errors';
import { Resource } from '../../../core/Resource';
import type { NativeVertexArray } from '../native';
import type { WebGLContext } from '../WebGLContext';
import type { WebGLAttribute } from './WebGLAttribute';
import type { WebGLProgram } from './WebGLProgram';

/** 创建顶点数组对象的描述。 */
export interface VertexArrayDesc {
  label?: string;
  attributes: VertexAttributeDesc[];
  /** 用于按名称解析属性位置的程序。 */
  program?: WebGLProgram;
}

/** 顶点数组对象（WebGL1 通过 OES_vertex_array_object 提供）。 */
export class WebGLVertexArray extends Resource<NativeVertexArray> {
  readonly attributes: readonly WebGLAttribute[];
  readonly #context: WebGLContext;

  constructor(
    context: WebGLContext,
    native: NativeVertexArray,
    attributes: readonly WebGLAttribute[],
    label?: string,
  ) {
    super(native, { label });
    this.#context = context;
    this.attributes = attributes;
  }

  /** 绑定此顶点数组。 */
  bind(): void {
    this.#context.state.bindVertexArray(this.handle);
  }

  /** 上下文恢复：重新创建 VAO 并重新应用属性。 */
  override restore(): void {
    const gl = this.#context.gl;
    const gl2 = gl as WebGL2RenderingContext;
    let native: NativeVertexArray | null;
    if (typeof gl2.createVertexArray === 'function') {
      native = gl2.createVertexArray();
    } else {
      const extension = this.#context.extensions.vertexArrayObject;
      if (extension === null) {
        throw new UnsupportedError('顶点数组对象（缺少 OES_vertex_array_object）', 'webgl');
      }
      native = extension.createVertexArrayOES();
    }
    if (native === null) {
      throw new BackendError('恢复顶点数组对象失败', { code: 'ERR_WEBGL' });
    }

    const state = this.#context.state;
    const previous = state.getBoundVertexArray();
    state.bindVertexArray(native);
    try {
      for (const attribute of this.attributes) {
        attribute.apply(gl, state, this.#context.extensions);
      }
    } catch (error) {
      state.bindVertexArray(previous);
      if (typeof gl2.deleteVertexArray === 'function') {
        gl2.deleteVertexArray(native);
      } else {
        this.#context.extensions.vertexArrayObject?.deleteVertexArrayOES(native);
      }
      throw error;
    }
    state.bindVertexArray(previous);
    this.markRestored(native);
  }

  protected override destroyNative(native: NativeVertexArray): void {
    this.#context.state.onVertexArrayDestroyed(native);
    const gl2 = this.#context.gl as WebGL2RenderingContext;
    if (typeof gl2.deleteVertexArray === 'function') {
      gl2.deleteVertexArray(native);
      return;
    }
    this.#context.extensions.vertexArrayObject?.deleteVertexArrayOES(native);
  }
}
