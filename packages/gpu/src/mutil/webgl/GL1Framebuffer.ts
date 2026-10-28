import {
  GL_COLOR_ATTACHMENT0,
  GL_DEPTH_ATTACHMENT,
  GL_DEPTH_COMPONENT16,
  GL_DEPTH_STENCIL,
  GL_DEPTH_STENCIL_ATTACHMENT,
  GL_FRAMEBUFFER,
  GL_FRAMEBUFFER_BINDING,
  GL_FRAMEBUFFER_COMPLETE,
  GL_RENDERBUFFER,
  GL_STENCIL_ATTACHMENT,
  GL_STENCIL_INDEX8,
  GL_TEXTURE_2D,
} from './constants.js';
import { GL1DisposedError, GL1FramebufferError } from './errors.js';
import type { GL1State } from './GL1State.js';
import { GL1Texture } from './GL1Texture.js';
import type { GL1FramebufferOptions, GL1FramebufferRef, GL1Stats, GL1TextureRef } from './types.js';

/**
 * An off-screen render target. Resizing re-specifies the existing colour
 * texture and renderbuffer instead of creating new GPU resources.
 */
export class GL1Framebuffer implements GL1FramebufferRef {
  width: number;
  height: number;

  private readonly gl: WebGLRenderingContext;
  private readonly stats: GL1Stats;
  private readonly state: GL1State;
  private readonly handleValue: WebGLFramebuffer;
  private readonly colorTexture: GL1Texture;
  private readonly options: GL1FramebufferOptions;
  private depthBuffer: WebGLRenderbuffer | null = null;
  private stencilBuffer: WebGLRenderbuffer | null = null;
  private disposedFlag = false;

  constructor(gl: WebGLRenderingContext, stats: GL1Stats, state: GL1State, options: GL1FramebufferOptions) {
    if (options.width <= 0 || options.height <= 0) throw new Error('Framebuffer size must be positive');
    this.gl = gl;
    this.stats = stats;
    this.state = state;
    this.options = { ...options };
    this.width = options.width;
    this.height = options.height;
    const handle = gl.createFramebuffer();
    if (!handle) throw new Error('Failed to create WebGL framebuffer');
    this.handleValue = handle;
    stats.framebuffersCreated++;
    stats.glCalls++;
    const filter = options.linear === false ? 'nearest' : 'linear';
    this.colorTexture = new GL1Texture(gl, stats, state, {
      format: options.colorFormat ?? 'rgba8',
      minFilter: filter,
      magFilter: filter,
      wrapS: 'clamp-to-edge',
      wrapT: 'clamp-to-edge',
      generateMipmaps: false,
    });
    this.colorTexture.reserve(this.width, this.height);
    const previous = gl.getParameter(GL_FRAMEBUFFER_BINDING) as WebGLFramebuffer | null;
    this.allocateAttachments();
    this.checkComplete();
    this.state.bindFramebuffer(GL_FRAMEBUFFER, previous);
  }

  get handle(): WebGLFramebuffer {
    return this.handleValue;
  }

  get texture(): GL1TextureRef {
    return this.colorTexture;
  }

  get disposed(): boolean {
    return this.disposedFlag;
  }

  /** Make this target the active draw framebuffer. */
  bind(): this {
    if (this.disposedFlag) throw new GL1DisposedError('GL1Framebuffer');
    this.state.bindFramebuffer(GL_FRAMEBUFFER, this.handleValue);
    return this;
  }

  unbind(): this {
    this.state.bindFramebuffer(GL_FRAMEBUFFER, null);
    return this;
  }

  /**
   * Resize in place. Only the storage is re-specified; the framebuffer,
   * texture and renderbuffer objects are reused.
   */
  resize(width: number, height: number): this {
    if (this.disposedFlag) throw new GL1DisposedError('GL1Framebuffer');
    if (width === this.width && height === this.height) {
      this.stats.stateSkipped++;
      return this;
    }
    this.width = width;
    this.height = height;
    const previous = this.gl.getParameter(GL_FRAMEBUFFER_BINDING) as WebGLFramebuffer | null;
    this.colorTexture.reserve(width, height);
    this.state.bindFramebuffer(GL_FRAMEBUFFER, this.handleValue);
    this.allocateAttachments();
    this.checkComplete();
    this.state.bindFramebuffer(GL_FRAMEBUFFER, previous);
    this.stats.framebufferResizes++;
    return this;
  }

  private allocateAttachments(): void {
    const gl = this.gl;
    const options = this.options;
    this.state.bindFramebuffer(GL_FRAMEBUFFER, this.handleValue);
    gl.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, this.colorTexture.handle, 0);
    this.stats.glCalls++;
    if (options.depth && options.stencil) {
      if (!this.depthBuffer) {
        this.depthBuffer = this.createRenderbuffer(GL_DEPTH_STENCIL, this.width, this.height);
        gl.framebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_STENCIL_ATTACHMENT, GL_RENDERBUFFER, this.depthBuffer);
        this.stats.glCalls++;
      } else {
        this.bindRenderbuffer(this.depthBuffer, GL_DEPTH_STENCIL, this.width, this.height);
      }
    } else if (options.depth) {
      if (!this.depthBuffer) {
        this.depthBuffer = this.createRenderbuffer(GL_DEPTH_COMPONENT16, this.width, this.height);
        gl.framebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, this.depthBuffer);
        this.stats.glCalls++;
      } else {
        this.bindRenderbuffer(this.depthBuffer, GL_DEPTH_COMPONENT16, this.width, this.height);
      }
    } else if (options.stencil) {
      if (!this.stencilBuffer) {
        this.stencilBuffer = this.createRenderbuffer(GL_STENCIL_INDEX8, this.width, this.height);
        gl.framebufferRenderbuffer(GL_FRAMEBUFFER, GL_STENCIL_ATTACHMENT, GL_RENDERBUFFER, this.stencilBuffer);
        this.stats.glCalls++;
      } else {
        this.bindRenderbuffer(this.stencilBuffer, GL_STENCIL_INDEX8, this.width, this.height);
      }
    }
  }

  private createRenderbuffer(internalFormat: number, width: number, height: number): WebGLRenderbuffer {
    const gl = this.gl;
    const renderbuffer = gl.createRenderbuffer();
    if (!renderbuffer) throw new Error('Failed to create WebGL renderbuffer');
    this.stats.glCalls++;
    this.bindRenderbuffer(renderbuffer, internalFormat, width, height);
    return renderbuffer;
  }

  private bindRenderbuffer(renderbuffer: WebGLRenderbuffer, internalFormat: number, width: number, height: number): void {
    const gl = this.gl;
    gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(GL_RENDERBUFFER, internalFormat, width, height);
    this.stats.glCalls += 2;
    gl.bindRenderbuffer(GL_RENDERBUFFER, null);
    this.stats.glCalls++;
  }

  private checkComplete(): void {
    const status = this.gl.checkFramebufferStatus(GL_FRAMEBUFFER);
    this.stats.glCalls++;
    if (status !== GL_FRAMEBUFFER_COMPLETE) {
      this.dispose();
      throw new GL1FramebufferError('Framebuffer is incomplete', status);
    }
  }

  dispose(): void {
    if (this.disposedFlag) return;
    this.disposedFlag = true;
    const gl = this.gl;
    gl.deleteFramebuffer(this.handleValue);
    this.stats.glCalls++;
    if (this.depthBuffer) gl.deleteRenderbuffer(this.depthBuffer);
    if (this.stencilBuffer) gl.deleteRenderbuffer(this.stencilBuffer);
    this.colorTexture.dispose();
  }
}
