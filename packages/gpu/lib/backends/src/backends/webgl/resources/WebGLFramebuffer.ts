import { TextureUsage } from '../../../core/enums';
import { BackendError, UnsupportedError, ValidationError } from '../../../core/errors';
import { isColorFormat, isDepthFormat, isStencilFormat } from '../../../core/format';
import { Resource } from '../../../core/Resource';
import type { NativeFramebuffer } from '../native';
import type { WebGLContext } from '../WebGLContext';
import { checkFramebufferStatus } from '../util/glCheck';
import type { WebGLRenderbuffer } from './WebGLRenderbuffer';
import { WebGLTexture } from './WebGLTexture';

/** 帧缓冲附件。 */
export type FramebufferAttachment = WebGLTexture | WebGLRenderbuffer;

/** 帧缓冲描述。 */
export interface FramebufferDesc {
  label?: string;
  /** 颜色附件列表；WebGL2 支持多个（MRT）。 */
  colors?: readonly FramebufferAttachment[];
  /** 单颜色附件别名，等价于 `colors: [color]`。 */
  color?: FramebufferAttachment;
  depth?: FramebufferAttachment;
  stencil?: FramebufferAttachment;
}

function isDepthStencilCombined(resource: FramebufferAttachment): boolean {
  return isDepthFormat(resource.format) && isStencilFormat(resource.format);
}

/** WebGL 帧缓冲对象（FBO）封装。 */
export class WebGLFramebuffer extends Resource<NativeFramebuffer> {
  /** 所有颜色附件。 */
  readonly colors: readonly FramebufferAttachment[];
  /** 第一个颜色附件，兼容旧 API。 */
  readonly color: FramebufferAttachment | undefined;
  readonly depth: FramebufferAttachment | undefined;
  readonly stencil: FramebufferAttachment | undefined;
  readonly #context: WebGLContext;
  readonly #desc: FramebufferDesc;

  constructor(context: WebGLContext, native: NativeFramebuffer, desc: FramebufferDesc) {
    super(native, { label: desc.label });
    this.#context = context;
    const gl = context.gl;

    const colors =
      desc.colors !== undefined ? [...desc.colors] : desc.color !== undefined ? [desc.color] : [];
    if (colors.length === 0 && desc.depth === undefined && desc.stencil === undefined) {
      throw new ValidationError('帧缓冲至少需要一个颜色 / 深度 / 模板附件');
    }
    const maxColors = context.capabilities.limits.maxDrawBuffers;
    if (colors.length > maxColors) {
      throw new ValidationError(`颜色附件数量 ${colors.length} 超过上限 ${maxColors}`);
    }
    if (colors.length > 1 && typeof (gl as WebGL2RenderingContext).drawBuffers !== 'function') {
      throw new UnsupportedError('多渲染目标（WebGL1）', 'webgl');
    }

    for (const attachment of colors) {
      if (!isColorFormat(attachment.format)) {
        throw new ValidationError(`颜色附件不能使用 ${attachment.format}`);
      }
      if (attachment instanceof WebGLTexture && (attachment.usage & TextureUsage.Render) === 0) {
        throw new ValidationError('颜色纹理未声明 TextureUsage.Render 用途');
      }
    }
    if (desc.depth !== undefined && !isDepthFormat(desc.depth.format)) {
      throw new ValidationError(`深度附件必须使用深度格式，实际 ${desc.depth.format}`);
    }
    if (desc.stencil !== undefined && !isStencilFormat(desc.stencil.format)) {
      throw new ValidationError(`模板附件必须使用模板格式，实际 ${desc.stencil.format}`);
    }
    if (
      desc.depth !== undefined &&
      desc.stencil !== undefined &&
      isDepthStencilCombined(desc.depth)
    ) {
      throw new ValidationError('组合深度模板附件不能再单独提供 stencil');
    }
    for (const attachment of [desc.depth, desc.stencil]) {
      if (attachment instanceof WebGLTexture && (attachment.usage & TextureUsage.Render) === 0) {
        throw new ValidationError('深度 / 模板纹理未声明 TextureUsage.Render 用途');
      }
    }

    this.colors = colors;
    this.color = colors[0];
    this.depth = desc.depth;
    this.stencil = desc.stencil;
    this.#desc = { ...desc, colors };

    const state = context.state;
    const previous = state.getBoundFramebuffer();
    state.bindFramebuffer(gl.FRAMEBUFFER, native);
    try {
      this.#attachAll();
    } catch (error) {
      state.bindFramebuffer(gl.FRAMEBUFFER, previous);
      throw error;
    }
    state.bindFramebuffer(gl.FRAMEBUFFER, previous);
  }

  /** 创建参数，供上下文恢复使用。 */
  get descriptor(): Readonly<FramebufferDesc> {
    return this.#desc;
  }

  /** 绑定帧缓冲，后续绘制写入附件。 */
  bind(): void {
    this.#context.state.bindFramebuffer(this.#context.gl.FRAMEBUFFER, this.handle);
  }

  /** 解绑，恢复默认帧缓冲。 */
  unbind(): void {
    this.#context.state.bindFramebuffer(this.#context.gl.FRAMEBUFFER, null);
  }

  /** 上下文恢复：重新创建 FBO 并挂载附件。 */
  override restore(): void {
    const gl = this.#context.gl;
    const native = gl.createFramebuffer();
    if (native === null) {
      throw new BackendError('恢复帧缓冲失败', { code: 'ERR_WEBGL' });
    }
    const state = this.#context.state;
    const previous = state.getBoundFramebuffer();
    state.bindFramebuffer(gl.FRAMEBUFFER, native);
    try {
      this.#attachAll();
    } catch (error) {
      state.bindFramebuffer(gl.FRAMEBUFFER, previous);
      gl.deleteFramebuffer(native);
      throw error;
    }
    state.bindFramebuffer(gl.FRAMEBUFFER, previous);
    this.markRestored(native);
  }

  #attachAll(): void {
    const gl = this.#context.gl;
    this.colors.forEach((attachment, index) => {
      this.#attach(gl.COLOR_ATTACHMENT0 + index, attachment);
    });
    if (this.depth !== undefined) {
      if (isDepthStencilCombined(this.depth)) {
        this.#attach(gl.DEPTH_STENCIL_ATTACHMENT, this.depth);
      } else {
        this.#attach(gl.DEPTH_ATTACHMENT, this.depth);
      }
    }
    if (this.stencil !== undefined) {
      this.#attach(gl.STENCIL_ATTACHMENT, this.stencil);
    }
    if (this.colors.length > 1) {
      const gl2 = gl as WebGL2RenderingContext;
      gl2.drawBuffers(this.colors.map((_, index) => gl.COLOR_ATTACHMENT0 + index));
    }
    checkFramebufferStatus(gl, gl.FRAMEBUFFER);
  }

  #attach(attachment: number, resource: FramebufferAttachment): void {
    const gl = this.#context.gl;
    if (resource instanceof WebGLTexture) {
      gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, resource.handle, 0);
      return;
    }
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, attachment, gl.RENDERBUFFER, resource.handle);
  }

  protected override destroyNative(native: NativeFramebuffer): void {
    this.#context.state.onFramebufferDestroyed(native);
    this.#context.gl.deleteFramebuffer(native);
  }
}
