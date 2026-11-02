import { GLCapabilityError, GLError, GLFramebufferError, GLResourceError } from './errors.js';
import { GLENUM, type GL, type GLTextureFormat } from './enums.js';
import type { GLCapabilities } from './caps.js';
import { getFormatInfo } from './formats.js';
import { GLTexture } from './texture.js';
import type { GLState } from './state.js';
import type { GLStatsTracker } from './stats.js';

export interface FramebufferDescriptor {
  label?: string;
  width: number;
  height: number;
  colors?: Array<{ format?: GLTextureFormat; attachment?: number }>;
  depth?: 'depth16' | 'depth24' | 'depth32f';
  /** Multisampling; requires WebGL2 and a supported sample count. */
  samples?: 0 | 2 | 4;
}

const STATUS_NAMES: Record<number, string> = {
  [GLENUM.FRAMEBUFFER_COMPLETE]: 'FRAMEBUFFER_COMPLETE',
  [GLENUM.FRAMEBUFFER_INCOMPLETE_ATTACHMENT]: 'FRAMEBUFFER_INCOMPLETE_ATTACHMENT',
  [GLENUM.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT]: 'FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT',
  [GLENUM.FRAMEBUFFER_INCOMPLETE_DIMENSIONS]: 'FRAMEBUFFER_INCOMPLETE_DIMENSIONS',
  [GLENUM.FRAMEBUFFER_UNSUPPORTED]: 'FRAMEBUFFER_UNSUPPORTED',
  [GLENUM.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE]: 'FRAMEBUFFER_INCOMPLETE_MULTISAMPLE',
};

export class GLFramebuffer {
  readonly label: string;
  readonly handle: WebGLFramebuffer;
  readonly samples: number;
  colors: GLTexture[] = [];
  depth: GLTexture | null = null;

  private readonly gl: GL;
  private readonly version: 1 | 2;
  private readonly caps: GLCapabilities;
  private readonly state: GLState;
  private readonly stats: GLStatsTracker;
  private readonly colorFormats: GLTextureFormat[];
  private readonly depthFormat: GLTextureFormat | null;
  private readonly resolveFramebuffer: WebGLFramebuffer | null;
  private colorBuffers: WebGLRenderbuffer[] = [];
  private depthBuffer: WebGLRenderbuffer | null = null;
  private widthValue: number;
  private heightValue: number;
  private destroyedFlag = false;

  constructor(
    gl: GL,
    version: 1 | 2,
    caps: GLCapabilities,
    state: GLState,
    stats: GLStatsTracker,
    desc: FramebufferDescriptor,
  ) {
    this.gl = gl;
    this.version = version;
    this.caps = caps;
    this.state = state;
    this.stats = stats;
    this.label = desc.label ?? 'framebuffer';
    this.widthValue = desc.width;
    this.heightValue = desc.height;
    this.samples = desc.samples ?? 0;

    const colors = desc.colors && desc.colors.length > 0 ? desc.colors : [{}];
    if (colors.length > caps.limits.maxColorAttachments) {
      throw new GLCapabilityError(
        'mrt',
        `"${this.label}" requests ${colors.length} color attachments, limit is ${caps.limits.maxColorAttachments}`,
      );
    }
    if (version === 1 && colors.length > 1) {
      throw new GLCapabilityError('mrt', 'multiple render targets require WebGL2');
    }
    if (this.samples > 0) {
      if (version === 1 || !caps.has('msaa')) {
        throw new GLCapabilityError('msaa', 'multisampled framebuffers require WebGL2');
      }
      if (this.samples > caps.limits.maxSamples) {
        throw new GLCapabilityError(
          'msaa',
          `"${this.label}" requests ${this.samples} samples, limit is ${caps.limits.maxSamples}`,
        );
      }
    }

    this.colorFormats = colors.map((color) => color.format ?? 'rgba8');
    this.depthFormat = desc.depth ?? null;

    if (this.samples > 0) this.verifySampleCounts();

    const handle = gl.createFramebuffer();
    if (!handle) throw new GLError('webgl/framebuffer', `unable to create framebuffer "${this.label}"`);
    this.handle = handle;

    this.resolveFramebuffer = this.samples > 0 ? gl.createFramebuffer() : null;
    if (this.samples > 0 && !this.resolveFramebuffer) {
      gl.deleteFramebuffer(handle);
      throw new GLError('webgl/framebuffer', `unable to create resolve framebuffer "${this.label}"`);
    }

    this.createAttachments();
    this.attach();
  }

  private verifySampleCounts(): void {
    const gl2 = this.gl as WebGL2RenderingContext;
    for (const format of this.colorFormats) {
      const info = getFormatInfo(this.gl, this.version, this.caps, format);
      const supported = gl2.getInternalformatParameter(GLENUM.RENDERBUFFER, info.internalFormat, GLENUM.SAMPLES);
      const counts = supported ? Array.from(supported as Int32Array) : [];
      if (!counts.includes(this.samples)) {
        throw new GLCapabilityError(
          'msaa',
          `sample count ${this.samples} is not supported for format "${format}" on this device`,
        );
      }
    }
  }

  private createRenderbuffer(internalFormat: number, width: number, height: number): WebGLRenderbuffer {
    const gl = this.gl;
    const buffer = gl.createRenderbuffer();
    if (!buffer) throw new GLError('webgl/framebuffer', `unable to create renderbuffer for "${this.label}"`);
    gl.bindRenderbuffer(GLENUM.RENDERBUFFER, buffer);
    if (this.samples > 0) {
      (gl as WebGL2RenderingContext).renderbufferStorageMultisample(
        GLENUM.RENDERBUFFER,
        this.samples,
        internalFormat,
        width,
        height,
      );
    } else {
      gl.renderbufferStorage(GLENUM.RENDERBUFFER, internalFormat, width, height);
    }
    gl.bindRenderbuffer(GLENUM.RENDERBUFFER, null);
    return buffer;
  }

  private createAttachments(): void {
    this.colors = this.colorFormats.map((format, index) => {
      return new GLTexture(this.gl, this.version, this.caps, this.state, this.stats, {
        label: `${this.label}:color${index}`,
        width: this.widthValue,
        height: this.heightValue,
        format,
        usage: { render: true },
      });
    });

    this.depth = this.depthFormat
      ? new GLTexture(this.gl, this.version, this.caps, this.state, this.stats, {
          label: `${this.label}:depth`,
          width: this.widthValue,
          height: this.heightValue,
          format: this.depthFormat,
          usage: { render: true },
        })
      : null;

    if (this.samples > 0) {
      this.colorBuffers = this.colorFormats.map((format) => {
        const info = getFormatInfo(this.gl, this.version, this.caps, format);
        return this.createRenderbuffer(info.internalFormat, this.widthValue, this.heightValue);
      });
      this.depthBuffer = this.depthFormat
        ? this.createRenderbuffer(
            getFormatInfo(this.gl, this.version, this.caps, this.depthFormat).internalFormat,
            this.widthValue,
            this.heightValue,
          )
        : null;
    }
  }

  private checkComplete(framebuffer: WebGLFramebuffer, label: string): void {
    this.gl.bindFramebuffer(GLENUM.FRAMEBUFFER, framebuffer);
    const status = this.gl.checkFramebufferStatus(GLENUM.FRAMEBUFFER);
    if (status !== GLENUM.FRAMEBUFFER_COMPLETE) {
      throw new GLFramebufferError(
        status,
        `${label} "${this.label}" is incomplete: ${STATUS_NAMES[status] ?? `0x${status.toString(16)}`}`,
      );
    }
  }

  private attach(): void {
    const gl = this.gl;
    const gl2 = gl as WebGL2RenderingContext;
    const attachments = this.colors.map((_, index) => GLENUM.COLOR_ATTACHMENT0 + index);

    if (this.samples > 0) {
      gl.bindFramebuffer(GLENUM.FRAMEBUFFER, this.handle);
      for (let i = 0; i < this.colorBuffers.length; i++) {
        gl.framebufferRenderbuffer(
          GLENUM.FRAMEBUFFER,
          GLENUM.COLOR_ATTACHMENT0 + i,
          GLENUM.RENDERBUFFER,
          this.colorBuffers[i] ?? null,
        );
      }
      if (this.depthBuffer) {
        gl.framebufferRenderbuffer(
          GLENUM.FRAMEBUFFER,
          GLENUM.DEPTH_ATTACHMENT,
          GLENUM.RENDERBUFFER,
          this.depthBuffer,
        );
      }
      if (attachments.length > 0) gl2.drawBuffers(attachments);
      this.checkComplete(this.handle, 'framebuffer');

      if (this.resolveFramebuffer) {
        this.attachTextures(this.resolveFramebuffer);
        this.checkComplete(this.resolveFramebuffer, 'resolve framebuffer');
      }
    } else {
      this.attachTextures(this.handle);
      if (attachments.length > 0) gl2.drawBuffers(attachments);
      this.checkComplete(this.handle, 'framebuffer');
    }

    this.state.bindFramebuffer(null);
    this.state.bindFramebuffer(this.handle);
  }

  private attachTextures(framebuffer: WebGLFramebuffer): void {
    const gl = this.gl;
    const gl2 = gl as WebGL2RenderingContext;
    gl.bindFramebuffer(GLENUM.FRAMEBUFFER, framebuffer);
    for (let i = 0; i < this.colors.length; i++) {
      const texture = this.colors[i];
      if (!texture) continue;
      gl.framebufferTexture2D(
        GLENUM.FRAMEBUFFER,
        GLENUM.COLOR_ATTACHMENT0 + i,
        GLENUM.TEXTURE_2D,
        texture.handle,
        0,
      );
    }
    if (this.depth) {
      gl.framebufferTexture2D(
        GLENUM.FRAMEBUFFER,
        GLENUM.DEPTH_ATTACHMENT,
        GLENUM.TEXTURE_2D,
        this.depth.handle,
        0,
      );
    }
    if (this.version === 2) {
      gl2.drawBuffers(this.colors.map((_, index) => GLENUM.COLOR_ATTACHMENT0 + index));
    }
  }

  get width(): number {
    return this.widthValue;
  }

  get height(): number {
    return this.heightValue;
  }

  get destroyed(): boolean {
    return this.destroyedFlag;
  }

  ensureAlive(): void {
    if (this.destroyedFlag) throw new GLResourceError(this.label, 'destroyed');
  }

  bind(): void {
    this.ensureAlive();
    this.state.bindFramebuffer(this.handle);
  }

  /** Resolves multisampled attachments into the sampleable textures. */
  resolve(): void {
    this.ensureAlive();
    if (this.samples === 0 || !this.resolveFramebuffer) return;
    const gl2 = this.gl as WebGL2RenderingContext;
    const width = this.widthValue;
    const height = this.heightValue;

    gl2.bindFramebuffer(GLENUM.READ_FRAMEBUFFER, this.handle);
    gl2.bindFramebuffer(GLENUM.DRAW_FRAMEBUFFER, this.resolveFramebuffer);

    for (let i = 0; i < this.colors.length; i++) {
      gl2.readBuffer(GLENUM.COLOR_ATTACHMENT0 + i);
      gl2.drawBuffers([GLENUM.COLOR_ATTACHMENT0 + i]);
      gl2.blitFramebuffer(0, 0, width, height, 0, 0, width, height, GLENUM.COLOR_BUFFER_BIT, 0x2600);
    }
    if (this.depth && this.depthBuffer) {
      gl2.blitFramebuffer(
        0,
        0,
        width,
        height,
        0,
        0,
        width,
        height,
        GLENUM.DEPTH_BUFFER_BIT,
        0x2600,
      );
    }

    gl2.drawBuffers(this.colors.map((_, index) => GLENUM.COLOR_ATTACHMENT0 + index));
    gl2.bindFramebuffer(GLENUM.DRAW_FRAMEBUFFER, null);
    gl2.bindFramebuffer(GLENUM.READ_FRAMEBUFFER, null);
  }

  readPixels(x: number, y: number, width: number, height: number): Uint8Array {
    this.ensureAlive();
    if (this.samples > 0) {
      this.resolve();
      this.state.bindFramebuffer(this.resolveFramebuffer);
    } else {
      this.state.bindFramebuffer(this.handle);
    }
    this.state.setPackAlignment(1);
    const pixels = new Uint8Array(width * height * 4);
    this.gl.readPixels(x, y, width, height, GLENUM.RGBA, GLENUM.UNSIGNED_BYTE, pixels);
    return pixels;
  }

  resize(width: number, height: number): void {
    this.ensureAlive();
    if (width === this.widthValue && height === this.heightValue) return;
    this.widthValue = width;
    this.heightValue = height;

    for (const texture of this.colors) texture.destroy();
    this.depth?.destroy();
    for (const buffer of this.colorBuffers) this.gl.deleteRenderbuffer(buffer);
    if (this.depthBuffer) this.gl.deleteRenderbuffer(this.depthBuffer);

    this.createAttachments();
    this.attach();
  }

  destroy(): void {
    if (this.destroyedFlag) return;
    if (this.state.currentFramebuffer === this.handle || this.state.currentFramebuffer === this.resolveFramebuffer) {
      this.state.bindFramebuffer(null);
    }
    for (const texture of this.colors) texture.destroy();
    this.depth?.destroy();
    for (const buffer of this.colorBuffers) this.gl.deleteRenderbuffer(buffer);
    if (this.depthBuffer) this.gl.deleteRenderbuffer(this.depthBuffer);
    if (this.resolveFramebuffer) this.gl.deleteFramebuffer(this.resolveFramebuffer);
    this.gl.deleteFramebuffer(this.handle);
    this.destroyedFlag = true;
  }
}
