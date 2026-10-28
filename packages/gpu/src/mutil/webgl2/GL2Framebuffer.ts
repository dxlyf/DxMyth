import {
  GL_COLOR_ATTACHMENT0,
  GL_DEPTH24_STENCIL8,
  GL_DEPTH_ATTACHMENT,
  GL_DEPTH_COMPONENT24,
  GL_DEPTH_STENCIL_ATTACHMENT,
  GL_FRAMEBUFFER,
  GL_FRAMEBUFFER_BINDING,
  GL_FRAMEBUFFER_COMPLETE,
  GL_RENDERBUFFER,
  GL_STENCIL_ATTACHMENT,
  GL_STENCIL_INDEX8,
  GL_TEXTURE_2D,
} from './constants.js';
import { GL2DisposedError, GL2FramebufferError } from './errors.js';
import type { GL2SamplerCache } from './GL2Sampler.js';
import type { GL2State } from './GL2State.js';
import { GL2Texture } from './GL2Texture.js';
import type { GL2FramebufferOptions, GL2FramebufferRef, GL2Stats, GL2TextureRef } from './types.js';

/**
 * A WebGL2 render target with multi-render-target support and optional
 * sampleable depth. Resizing re-specifies storage in place: the framebuffer,
 * colour textures and renderbuffers are all reused.
 */
export class GL2Framebuffer implements GL2FramebufferRef {
  width: number;
  height: number;

  private readonly gl: WebGL2RenderingContext;
  private readonly stats: GL2Stats;
  private readonly state: GL2State;
  private readonly samplers: GL2SamplerCache;
  private readonly handleValue: WebGLFramebuffer;
  private readonly colorTextures: GL2Texture[];
  private readonly options: GL2FramebufferOptions;
  private depthTextureValue: GL2Texture | null = null;
  private depthBuffer: WebGLRenderbuffer | null = null;
  private stencilBuffer: WebGLRenderbuffer | null = null;
  private disposedFlag = false;

  constructor(gl: WebGL2RenderingContext, stats: GL2Stats, state: GL2State, samplers: GL2SamplerCache, options: GL2FramebufferOptions) {
    if (options.width <= 0 || options.height <= 0) throw new Error('Framebuffer size must be positive');
    this.gl = gl;
    this.stats = stats;
    this.state = state;
    this.samplers = samplers;
    this.options = { ...options };
    this.width = options.width;
    this.height = options.height;
    const handle = gl.createFramebuffer();
    if (!handle) throw new Error('Failed to create WebGL2 framebuffer');
    this.handleValue = handle;
    stats.framebuffersCreated++;
    stats.glCalls++;

    const attachments = options.colorAttachments && options.colorAttachments.length > 0 ? options.colorAttachments : [{}];
    this.colorTextures = attachments.map((attachment) => {
      const texture = new GL2Texture(gl, stats, state, samplers, {
        format: attachment.format ?? 'rgba8',
        minFilter: attachment.linear === false ? 'nearest' : 'linear',
        magFilter: attachment.linear === false ? 'nearest' : 'linear',
        immutable: false,
        generateMipmaps: false,
      });
      texture.reserve(this.width, this.height);
      return texture;
    });

    const previous = gl.getParameter(GL_FRAMEBUFFER_BINDING) as WebGLFramebuffer | null;
    this.state.bindFramebuffer(GL_FRAMEBUFFER, this.handleValue);
    for (let i = 0; i < this.colorTextures.length; i++) {
      gl.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0 + i, GL_TEXTURE_2D, this.colorTextures[i]!.handle, 0);
      stats.glCalls++;
    }
    const drawBuffers: number[] = [];
    for (let i = 0; i < this.colorTextures.length; i++) drawBuffers.push(GL_COLOR_ATTACHMENT0 + i);
    gl.drawBuffers(drawBuffers);
    stats.glCalls++;
    this.allocateDepth();
    this.checkComplete();
    this.state.bindFramebuffer(GL_FRAMEBUFFER, previous);
  }

  get handle(): WebGLFramebuffer {
    return this.handleValue;
  }

  get textures(): readonly GL2TextureRef[] {
    return this.colorTextures;
  }

  get depthTexture(): GL2TextureRef | null {
    return this.depthTextureValue;
  }

  get attachmentCount(): number {
    return this.colorTextures.length;
  }

  get disposed(): boolean {
    return this.disposedFlag;
  }

  bind(): this {
    if (this.disposedFlag) throw new GL2DisposedError('GL2Framebuffer');
    this.state.bindFramebuffer(GL_FRAMEBUFFER, this.handleValue);
    return this;
  }

  unbind(): this {
    this.state.bindFramebuffer(GL_FRAMEBUFFER, null);
    return this;
  }

  resize(width: number, height: number): this {
    if (this.disposedFlag) throw new GL2DisposedError('GL2Framebuffer');
    if (width <= 0 || height <= 0) throw new Error('Framebuffer size must be positive');
    if (width === this.width && height === this.height) {
      this.stats.stateSkipped++;
      return this;
    }
    this.width = width;
    this.height = height;
    const previous = this.gl.getParameter(GL_FRAMEBUFFER_BINDING) as WebGLFramebuffer | null;
    for (const texture of this.colorTextures) texture.reserve(width, height);
    this.depthTextureValue?.reserve(width, height);
    this.state.bindFramebuffer(GL_FRAMEBUFFER, this.handleValue);
    if (this.depthBuffer) this.reallocateRenderbuffer(this.depthBuffer, this.depthBufferFormat(), width, height);
    if (this.stencilBuffer) this.reallocateRenderbuffer(this.stencilBuffer, GL_STENCIL_INDEX8, width, height);
    this.checkComplete();
    this.state.bindFramebuffer(GL_FRAMEBUFFER, previous);
    this.stats.framebufferResizes++;
    return this;
  }

  private allocateDepth(): void {
    const gl = this.gl;
    const options = this.options;
    const wantsDepth = options.depth !== false;
    const wantsStencil = options.stencil === true;
    if (!wantsDepth && !wantsStencil) return;
    if (options.depthTexture && wantsDepth) {
      this.depthTextureValue = new GL2Texture(gl, this.stats, this.state, this.samplers, {
        format: wantsStencil ? 'depth24-stencil8' : 'depth24',
        minFilter: 'nearest',
        magFilter: 'nearest',
        immutable: false,
        generateMipmaps: false,
      });
      this.depthTextureValue.reserve(this.width, this.height);
      gl.framebufferTexture2D(
        GL_FRAMEBUFFER,
        wantsStencil ? GL_DEPTH_STENCIL_ATTACHMENT : GL_DEPTH_ATTACHMENT,
        GL_TEXTURE_2D,
        this.depthTextureValue.handle,
        0,
      );
      this.stats.glCalls++;
      return;
    }
    if (wantsDepth) {
      if (!this.depthBuffer) {
        this.depthBuffer = this.createRenderbuffer(this.depthBufferFormat(), this.width, this.height);
        gl.framebufferRenderbuffer(GL_FRAMEBUFFER, wantsStencil ? GL_DEPTH_STENCIL_ATTACHMENT : GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, this.depthBuffer);
        this.stats.glCalls++;
      }
      return;
    }
    if (!this.stencilBuffer) {
      this.stencilBuffer = this.createRenderbuffer(GL_STENCIL_INDEX8, this.width, this.height);
      gl.framebufferRenderbuffer(GL_FRAMEBUFFER, GL_STENCIL_ATTACHMENT, GL_RENDERBUFFER, this.stencilBuffer);
      this.stats.glCalls++;
    }
  }

  private depthBufferFormat(): number {
    return this.options.stencil ? GL_DEPTH24_STENCIL8 : GL_DEPTH_COMPONENT24;
  }

  private createRenderbuffer(internalFormat: number, width: number, height: number): WebGLRenderbuffer {
    const renderbuffer = this.gl.createRenderbuffer();
    if (!renderbuffer) throw new Error('Failed to create WebGL2 renderbuffer');
    this.stats.glCalls++;
    this.reallocateRenderbuffer(renderbuffer, internalFormat, width, height);
    return renderbuffer;
  }

  private reallocateRenderbuffer(renderbuffer: WebGLRenderbuffer, internalFormat: number, width: number, height: number): void {
    const gl = this.gl;
    gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(GL_RENDERBUFFER, internalFormat, width, height);
    gl.bindRenderbuffer(GL_RENDERBUFFER, null);
    this.stats.glCalls += 3;
  }

  private checkComplete(): void {
    const status = this.gl.checkFramebufferStatus(GL_FRAMEBUFFER);
    this.stats.glCalls++;
    if (status !== GL_FRAMEBUFFER_COMPLETE) {
      this.dispose();
      throw new GL2FramebufferError('Framebuffer is incomplete', status);
    }
  }

  dispose(): void {
    if (this.disposedFlag) return;
    this.disposedFlag = true;
    this.gl.deleteFramebuffer(this.handleValue);
    this.stats.glCalls++;
    if (this.depthBuffer) this.gl.deleteRenderbuffer(this.depthBuffer);
    if (this.stencilBuffer) this.gl.deleteRenderbuffer(this.stencilBuffer);
    for (const texture of this.colorTextures) texture.dispose();
    this.depthTextureValue?.dispose();
  }
}
