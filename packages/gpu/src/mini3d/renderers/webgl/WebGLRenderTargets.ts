import {
  type RenderTarget,
} from '../../textures/RenderTarget';
import type { GL } from './GLTypes';
import type { WebGLTextures } from './WebGLTextures';

/** GPU state for one `RenderTarget`. */
interface TargetRecord {
  /** Framebuffer the pass draws into (multisampled when `samples > 0`). */
  drawFramebuffer: WebGLFramebuffer;
  /** Framebuffer holding the colour texture, the blit destination. */
  resolveFramebuffer: WebGLFramebuffer | null;
  /** Depth (and stencil) renderbuffer, when the target has no depth texture. */
  depthBuffer: WebGLRenderbuffer | null;
  colorBuffer: WebGLRenderbuffer | null;
  /** Attachment versions and shape the framebuffer was built from. */
  colorVersion: number;
  depthVersion: number;
  width: number;
  height: number;
  samples: number;
}

/**
 * Owns the framebuffers behind `RenderTarget`.
 *
 * A framebuffer is rebuilt whenever an attachment's version or the target's size
 * changes, so resizing a target goes through the same path as creating one.
 * Multisampled targets get two framebuffers: one for drawing, and one holding the
 * colour texture that `resolveMultisample()` blits into.
 */
export class WebGLRenderTargets {
  private readonly gl: GL;
  private readonly textures: WebGLTextures;
  private readonly isWebGL2: boolean;
  private readonly records = new WeakMap<RenderTarget, TargetRecord>();
  private readonly tracked = new Set<RenderTarget>();
  /** Framebuffer currently bound as the draw target. */
  private boundDraw: WebGLFramebuffer | null = null;
  private boundTarget: RenderTarget | null = null;
  private bytesUsed = 0;

  constructor(gl: GL, textures: WebGLTextures, isWebGL2: boolean) {
    this.gl = gl;
    this.textures = textures;
    this.isWebGL2 = isWebGL2;
  }

  /** Total GPU bytes held by renderbuffer attachments. */
  get bytes(): number {
    return this.bytesUsed;
  }

  get count(): number {
    return this.tracked.size;
  }

  /** Forces the next `bind` to rebind, even for the same target. */
  invalidate(): void {
    this.boundDraw = null;
    this.boundTarget = null;
  }

  /**
   * Binds `target`, or the default framebuffer when `null`.
   *
   * The cache is only trusted for the "same target, already bound" case. Any
   * other transition binds unconditionally, because operations that touch
   * `glBindFramebuffer` directly (the multisample resolve blit) can otherwise
   * leave the cache claiming a binding that is no longer current.
   */
  bind(target: RenderTarget | null): void {
    const gl = this.gl;
    if (target === null) {
      if (this.boundDraw !== null || this.boundTarget !== null) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      this.boundDraw = null;
      this.boundTarget = null;
      return;
    }

    this.track(target);
    const record = this.record(target);
    if (record.drawFramebuffer === this.boundDraw && this.boundTarget === target) return;
    // Always bind when the target changed, even if the framebuffer object is the
    // same one the cache remembers.
    gl.bindFramebuffer(gl.FRAMEBUFFER, record.drawFramebuffer);
    this.boundDraw = record.drawFramebuffer;
    this.boundTarget = target;
  }

  /** The target currently bound, or `null`. */
  get current(): RenderTarget | null {
    return this.boundTarget;
  }

  /** `true` when `target` draws into a multisampled attachment. */
  isMultisampled(target: RenderTarget): boolean {
    const record = this.records.get(target);
    return record !== undefined && record.samples > 0 && record.resolveFramebuffer !== null;
  }

  /**
   * Reads a pixel back from a target's colour attachment, for tests and
   * diagnostics. Binds the resolve framebuffer (or the draw framebuffer when the
   * target is not multisampled) and restores the previous binding.
   */
  readPixel(target: RenderTarget, x = 0, y = 0): [number, number, number, number] {
    const gl = this.gl;
    const record = this.records.get(target);
    if (!record) return [0, 0, 0, 0];
    const previous = gl.getParameter(gl.FRAMEBUFFER_BINDING) as WebGLFramebuffer | null;
    gl.bindFramebuffer(gl.FRAMEBUFFER, record.resolveFramebuffer ?? record.drawFramebuffer);
    const pixel = new Uint8Array(4);
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    gl.bindFramebuffer(gl.FRAMEBUFFER, previous);
    this.invalidate();
    return [pixel[0], pixel[1], pixel[2], pixel[3]];
  }

  /** Frees every GPU object owned by `target`. */
  release(target: RenderTarget): void {
    const gl = this.gl;
    const record = this.records.get(target);
    if (!record) {
      this.tracked.delete(target);
      return;
    }
    if (this.boundTarget === target) this.invalidate();
    gl.deleteFramebuffer(record.drawFramebuffer);
    if (record.resolveFramebuffer) gl.deleteFramebuffer(record.resolveFramebuffer);
    if (record.depthBuffer) gl.deleteRenderbuffer(record.depthBuffer);
    if (record.colorBuffer) gl.deleteRenderbuffer(record.colorBuffer);
    this.bytesUsed = Math.max(0, this.bytesUsed - estimateBytes(record));
    this.records.delete(target);
    this.tracked.delete(target);
  }

  /** Frees every tracked target; used by `renderer.dispose()`. */
  dispose(): void {
    for (const target of [...this.tracked]) this.release(target);
  }

  /**
   * Copies the multisampled attachment into the target's colour texture.
   *
   * Called after the pass finishes, before the target is sampled.
   */
  resolveMultisample(target: RenderTarget): void {
    const gl = this.gl;
    const record = this.records.get(target);
    if (!record || !record.resolveFramebuffer) return;

    const previousRead = gl.getParameter(gl.READ_FRAMEBUFFER_BINDING) as WebGLFramebuffer | null;
    const previousDraw = gl.getParameter(gl.DRAW_FRAMEBUFFER_BINDING) as WebGLFramebuffer | null;
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, record.drawFramebuffer);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, record.resolveFramebuffer);
    gl.blitFramebuffer(
      0,
      0,
      target.width,
      target.height,
      0,
      0,
      target.width,
      target.height,
      gl.COLOR_BUFFER_BIT,
      gl.NEAREST,
    );
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, previousRead);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, previousDraw);
    // The blit re-bound the draw framebuffer pair, so the cache is stale.
    this.invalidate();
  }

  private track(target: RenderTarget): void {
    if (this.tracked.has(target)) return;
    this.tracked.add(target);
    target.addEventListener('dispose', (event) => this.release(event.target));
  }

  /** Returns the record for `target`, (re)building it when stale. */
  private record(target: RenderTarget): TargetRecord {
    const existing = this.records.get(target);
    const colorVersion = target.texture.version;
    const depthVersion = target.depthTexture ? target.depthTexture.version : -1;

    if (
      existing &&
      existing.colorVersion === colorVersion &&
      existing.depthVersion === depthVersion &&
      existing.width === target.width &&
      existing.height === target.height &&
      existing.samples === target.samples
    ) {
      return existing;
    }

    if (existing) this.releaseGpu(existing, target);
    const record = this.build(target);
    this.records.set(target, record);
    this.bytesUsed += estimateBytes(record);
    this.invalidate();
    return record;
  }

  private releaseGpu(record: TargetRecord, target: RenderTarget): void {
    const gl = this.gl;
    if (this.boundTarget === target) this.invalidate();
    gl.deleteFramebuffer(record.drawFramebuffer);
    if (record.resolveFramebuffer) gl.deleteFramebuffer(record.resolveFramebuffer);
    if (record.depthBuffer) gl.deleteRenderbuffer(record.depthBuffer);
    if (record.colorBuffer) gl.deleteRenderbuffer(record.colorBuffer);
    this.bytesUsed = Math.max(0, this.bytesUsed - estimateBytes(record));
  }

  private build(target: RenderTarget): TargetRecord {
    const gl = this.gl;
    // Multisampling needs `renderbufferStorageMultisample` (WebGL2 / WebGPU).
    const wantsMultisample = target.samples > 0 && this.isWebGL2;
    const samples = Math.max(1, Math.min(Math.floor(target.samples), this.maxSamples()));
    const depthPoint = this.depthAttachmentPoint(target.hasStencil);
    const depthFormat = target.hasStencil ? gl.DEPTH_STENCIL : gl.DEPTH_COMPONENT16;

    // A depth *texture* is shared by both framebuffers, so it is allocated once.
    const depthHandle = target.depthTexture
      ? this.textures.acquireRenderTargetDepth(target.depthTexture)
      : null;

    const drawFramebuffer = gl.createFramebuffer();
    if (!drawFramebuffer) throw new Error('mini3d: gl.createFramebuffer() returned null');

    let colorBuffer: WebGLRenderbuffer | null = null;
    let resolveFramebuffer: WebGLFramebuffer | null = null;
    let depthBuffer: WebGLRenderbuffer | null = null;

    // --- draw framebuffer ---
    gl.bindFramebuffer(gl.FRAMEBUFFER, drawFramebuffer);
    if (wantsMultisample) {
      colorBuffer = gl.createRenderbuffer();
      if (!colorBuffer) throw new Error('mini3d: gl.createRenderbuffer() returned null');
      gl.bindRenderbuffer(gl.RENDERBUFFER, colorBuffer);
      gl.renderbufferStorageMultisample(
        gl.RENDERBUFFER,
        samples,
        gl.RGBA8,
        target.width,
        target.height,
      );
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, colorBuffer);
    } else {
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        this.textures.acquireRenderTargetColor(target.texture),
        0,
      );
    }

    if (depthHandle !== null) {
      gl.framebufferTexture2D(gl.FRAMEBUFFER, depthPoint, gl.TEXTURE_2D, depthHandle, 0);
    } else if (target.hasDepth) {
      depthBuffer = gl.createRenderbuffer();
      if (!depthBuffer) throw new Error('mini3d: gl.createRenderbuffer() returned null');
      gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
      if (wantsMultisample) {
        gl.renderbufferStorageMultisample(
          gl.RENDERBUFFER,
          samples,
          depthFormat,
          target.width,
          target.height,
        );
      } else {
        gl.renderbufferStorage(gl.RENDERBUFFER, depthFormat, target.width, target.height);
      }
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, depthPoint, gl.RENDERBUFFER, depthBuffer);
    }
    this.checkComplete(target, drawFramebuffer, wantsMultisample ? 'multisampled' : 'colour');

    // --- resolve framebuffer (holds the samplable colour texture) ---
    if (wantsMultisample) {
      resolveFramebuffer = gl.createFramebuffer();
      if (!resolveFramebuffer) throw new Error('mini3d: gl.createFramebuffer() returned null');
      // Explicit bind: `checkComplete` leaves whatever it bound in place, so the
      // attachment below must not rely on ambient state.
      gl.bindFramebuffer(gl.FRAMEBUFFER, resolveFramebuffer);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        this.textures.acquireRenderTargetColor(target.texture),
        0,
      );
      if (depthHandle !== null) {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, depthPoint, gl.TEXTURE_2D, depthHandle, 0);
      }
      this.checkComplete(target, resolveFramebuffer, 'resolve');
    }

    // The next `bind` must not assume either framebuffer is current.
    this.invalidate();

    return {
      drawFramebuffer,
      resolveFramebuffer,
      depthBuffer,
      colorBuffer,
      colorVersion: target.texture.version,
      depthVersion: target.depthTexture ? target.depthTexture.version : -1,
      width: target.width,
      height: target.height,
      samples: wantsMultisample ? samples : 0,
    };
  }

  /**
   * Depth attachment point: a combined depth-stencil texture needs
   * `DEPTH_STENCIL_ATTACHMENT`, a depth-only one `DEPTH_ATTACHMENT`.
   */
  private depthAttachmentPoint(stencil: boolean): number {
    const gl = this.gl;
    return stencil ? gl.DEPTH_STENCIL_ATTACHMENT : gl.DEPTH_ATTACHMENT;
  }

  private maxSamples(): number {
    const gl = this.gl;
    return (gl.getParameter(gl.MAX_SAMPLES) as number | undefined) ?? 4;
  }

  private checkComplete(
    target: RenderTarget,
    framebuffer: WebGLFramebuffer,
    stage: string,
  ): void {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status === gl.FRAMEBUFFER_COMPLETE) return;
    const name = target.name || `#${target.id}`;
    throw new Error(
      `mini3d.WebGLRenderer: render target "${name}" is incomplete at the ${stage} stage ` +
        `(status 0x${status.toString(16)}, ${target.width}x${target.height}` +
        `${target.depthTexture ? ', depth texture' : target.hasDepth ? ', depth buffer' : ''}, ` +
        `${target.samples} sample(s)). A depth *texture* attachment requires WebGL2 or ` +
        'WEBGL_depth_texture; multisampling requires WebGL2.',
    );
  }
}

/** Rough byte cost of one framebuffer's attachments. */
function estimateBytes(record: TargetRecord): number {
  const pixels = record.width * record.height;
  const colour = record.colorBuffer ? pixels * 4 : 0;
  const depth = record.depthBuffer ? pixels * 4 : 0;
  // The multisampled colour buffer is the extra cost over the resolve texture.
  return Math.round(colour * Math.max(1, record.samples) + depth * Math.max(1, record.samples));
}
