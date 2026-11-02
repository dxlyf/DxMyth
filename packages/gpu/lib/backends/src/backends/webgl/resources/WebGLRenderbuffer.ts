import type { TextureFormat } from '../../../core/enums';
import { BackendError, UnsupportedError, ValidationError } from '../../../core/errors';
import { Resource } from '../../../core/Resource';
import type { NativeRenderbuffer } from '../native';
import type { WebGLContext } from '../WebGLContext';
import { renderbufferFormat } from '../util/glEnums';

/** 渲染缓冲描述。 */
export interface RenderbufferDesc {
  label?: string;
  width: number;
  height: number;
  /** 默认 `'depth16unorm'`，用于深度附件。 */
  format?: TextureFormat;
  samples?: number;
}

/** WebGL1 渲染缓冲封装，主要用于深度 / 模板附件。 */
export class WebGLRenderbuffer extends Resource<NativeRenderbuffer> {
  readonly width: number;
  readonly height: number;
  readonly format: TextureFormat;
  readonly #context: WebGLContext;
  readonly #desc: RenderbufferDesc;

  constructor(context: WebGLContext, native: NativeRenderbuffer, desc: RenderbufferDesc) {
    super(native, { label: desc.label });
    this.#context = context;
    const gl = context.gl;

    if (!Number.isInteger(desc.width) || desc.width <= 0) {
      throw new ValidationError('渲染缓冲宽度必须是大于 0 的整数');
    }
    if (!Number.isInteger(desc.height) || desc.height <= 0) {
      throw new ValidationError('渲染缓冲高度必须是大于 0 的整数');
    }
    if ((desc.samples ?? 1) !== 1) {
      throw new UnsupportedError('多重采样渲染缓冲（WebGL1）', 'webgl');
    }

    const format = desc.format ?? 'depth16unorm';
    if (format === 'depth24plus-stencil8') {
      if (context.extensions.get('OES_packed_depth_stencil') === null) {
        throw new UnsupportedError('打包深度模板缓冲（缺少 OES_packed_depth_stencil）', 'webgl');
      }
    }

    const internalFormat = renderbufferFormat(gl, format);
    this.width = desc.width;
    this.height = desc.height;
    this.format = format;
    this.#desc = { ...desc };

    const state = context.state;
    const previous = state.getBoundRenderbuffer();
    state.bindRenderbuffer(gl.RENDERBUFFER, native);
    try {
      gl.renderbufferStorage(gl.RENDERBUFFER, internalFormat, desc.width, desc.height);
    } finally {
      state.bindRenderbuffer(gl.RENDERBUFFER, previous);
    }
  }

  /** 创建参数，供上下文恢复使用。 */
  get descriptor(): Readonly<RenderbufferDesc> {
    return this.#desc;
  }

  /** 绑定渲染缓冲。 */
  bind(): void {
    this.#context.state.bindRenderbuffer(this.#context.gl.RENDERBUFFER, this.handle);
  }

  /** 上下文恢复：重新分配存储。 */
  override restore(): void {
    const gl = this.#context.gl;
    const native = gl.createRenderbuffer();
    if (native === null) {
      throw new BackendError('恢复渲染缓冲失败', { code: 'ERR_WEBGL' });
    }
    const internalFormat = renderbufferFormat(gl, this.format);
    const state = this.#context.state;
    const previous = state.getBoundRenderbuffer();
    state.bindRenderbuffer(gl.RENDERBUFFER, native);
    try {
      gl.renderbufferStorage(gl.RENDERBUFFER, internalFormat, this.width, this.height);
    } catch (error) {
      state.bindRenderbuffer(gl.RENDERBUFFER, previous);
      gl.deleteRenderbuffer(native);
      throw error;
    }
    state.bindRenderbuffer(gl.RENDERBUFFER, previous);
    this.markRestored(native);
  }

  protected override destroyNative(native: NativeRenderbuffer): void {
    this.#context.state.onRenderbufferDestroyed(native);
    this.#context.gl.deleteRenderbuffer(native);
  }
}
