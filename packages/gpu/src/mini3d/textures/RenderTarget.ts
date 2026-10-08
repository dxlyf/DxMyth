import { EventDispatcher } from '../core/EventDispatcher';
import { Vector4 } from '../math/Vector4';
import { Texture } from './Texture';
import type { TextureDataType, TextureFormat } from '../constants';

export interface RenderTargetEventMap {
  dispose: { target: RenderTarget };
}

/** Options accepted by the `RenderTarget` constructor. */
export interface RenderTargetOptions {
  /** Width in physical pixels. */
  width?: number;
  /** Height in physical pixels. */
  height?: number;
  /**
   * Multisampling. `0` (the default) renders directly into the colour texture.
   * A positive value renders into a multisampled attachment and resolves into
   * the texture, which is WebGL2 / WebGPU only.
   */
  samples?: number;
  /** Colour attachment format; `'rgba'` by default. */
  format?: TextureFormat;
  /** Colour attachment component type; `'uint8'` by default. */
  type?: TextureDataType;
  /**
   * Create a depth attachment. Every renderer can provide a depth *renderbuffer*
   * for depth testing; `depthTexture: true` additionally makes that depth
   * readable as a texture, which is what shadow mapping and depth-based effects
   * need. A readable depth texture requires WebGL2 or WebGPU.
   */
  depth?: boolean;
  /** Expose the depth attachment as a samplable `Texture` (implies `depth`). */
  depthTexture?: boolean;
  /** Ask for a stencil buffer alongside depth. */
  stencil?: boolean;
  /** Filtering for the colour texture. `'nearest'` is the safe default. */
  magFilter?: 'nearest' | 'linear';
  minFilter?: 'nearest' | 'linear' | 'nearest-mipmap-nearest' | 'linear-mipmap-linear';
  /** Wrapping for the colour texture. */
  wrapS?: 'clamp' | 'repeat' | 'mirror';
  wrapT?: 'clamp' | 'repeat' | 'mirror';
  /** Debug label, surfaced in backend errors. */
  name?: string;
}

/**
 * An offscreen render destination: a colour `Texture` plus an optional depth
 * attachment, drawn into with `renderer.setRenderTarget(target)`.
 *
 * ```ts
 * const target = new RenderTarget({ width: 512, height: 512, depth: true });
 * renderer.setRenderTarget(target);
 * renderer.render(scene, camera);
 * renderer.setRenderTarget(null);       // back to the canvas
 * material.map = target.texture;        // the result is an ordinary texture
 * ```
 *
 * `texture` is a normal `Texture`, so anything that accepts one accepts a render
 * target's output: a material map, `scene.background`, or the input to another
 * pass. Because the colour attachment is a texture rather than a mip chain, the
 * default filters avoid mipmaps unless one is requested explicitly.
 */
export class RenderTarget extends EventDispatcher<RenderTargetEventMap> {
  readonly isRenderTarget = true;

  /** Auto-incrementing process-unique id. */
  readonly id: number;

  name = '';

  width: number;
  height: number;
  samples: number;

  /**
   * The colour attachment. Sampled like any other texture, and the object the
   * backends attach to their framebuffer / render pass.
   */
  readonly texture: Texture;

  /**
   * The depth attachment as a texture, when `depthTexture` was requested;
   * `null` when only a depth renderbuffer exists.
   */
  readonly depthTexture: Texture | null;

  /** `true` when a depth attachment of any kind exists. */
  readonly hasDepth: boolean;
  /** `true` when a stencil buffer was requested. */
  readonly hasStencil: boolean;

  /**
   * Scissor rectangle inside the target (`x`, `y`, `width`, `height`). Defaults
   * to the full target; a smaller rect restricts clearing and drawing, which is
   * how split-screen and atlas-rendering are usually expressed.
   */
  readonly scissor: Vector4;
  /** Enable the scissor rectangle. */
  scissorTest = false;

  /** Rect the viewport is set to while this target is bound. */
  readonly viewport: Vector4;

  private static nextId = 1;

  constructor(options: RenderTargetOptions = {}) {
    super();
    this.id = RenderTarget.nextId++;
    this.width = Math.max(1, Math.floor(options.width ?? 1));
    this.height = Math.max(1, Math.floor(options.height ?? 1));
    this.samples = Math.max(0, Math.floor(options.samples ?? 0));
    this.name = options.name ?? '';

    const wantsDepthTexture = options.depthTexture === true;
    this.hasDepth = options.depth === true || wantsDepthTexture;
    this.hasStencil = this.hasDepth && options.stencil === true;

    this.texture = new Texture(null, {
      width: this.width,
      height: this.height,
      ...(options.format !== undefined ? { format: options.format } : {}),
      ...(options.type !== undefined ? { type: options.type } : {}),
    });
    this.texture.name = this.name ? `${this.name}.color` : 'RenderTarget.color';
    // A render target's colour attachment is written by the GPU, not uploaded
    // from CPU pixels, so the pixel-store options are irrelevant.
    this.texture.flipY = false;
    this.texture.generateMipmaps = false;
    this.texture.magFilter = options.magFilter ?? 'linear';
    this.texture.minFilter = options.minFilter ?? 'linear';
    this.texture.wrapS = options.wrapS ?? 'clamp';
    this.texture.wrapT = options.wrapT ?? 'clamp';
    // Mark it so backends allocate storage instead of uploading CPU pixels.
    (this.texture as { isRenderTargetTexture?: boolean }).isRenderTargetTexture = true;

    this.depthTexture = wantsDepthTexture
      ? createDepthTexture(this.width, this.height, this.name)
      : null;

    this.scissor = new Vector4(0, 0, this.width, this.height);
    this.viewport = new Vector4(0, 0, this.width, this.height);
  }

  /** Resizes the target and both attachments. */
  setSize(width: number, height: number): this {
    const nextWidth = Math.max(1, Math.floor(width));
    const nextHeight = Math.max(1, Math.floor(height));
    if (nextWidth === this.width && nextHeight === this.height) return this;

    this.width = nextWidth;
    this.height = nextHeight;
    for (const texture of [this.texture, this.depthTexture]) {
      if (!texture) continue;
      texture.width = nextWidth;
      texture.height = nextHeight;
      texture.needsUpdate = true;
    }
    this.viewport.set(0, 0, nextWidth, nextHeight);
    this.scissor.set(0, 0, nextWidth, nextHeight);
    return this;
  }

  /**
   * Restricts clearing and drawing to `(x, y, width, height)` inside the target.
   * Pass `null` to disable the scissor test.
   */
  setScissor(x: number | null, y = 0, width = this.width, height = this.height): this {
    if (x === null) {
      this.scissorTest = false;
      return this;
    }
    this.scissorTest = true;
    this.scissor.set(x, y, width, height);
    return this;
  }

  /** Restricts the viewport while this target is bound. */
  setViewport(x: number, y: number, width: number, height: number): this {
    this.viewport.set(x, y, width, height);
    return this;
  }

  /** Resets the viewport to the full target. */
  resetViewport(): this {
    this.viewport.set(0, 0, this.width, this.height);
    return this;
  }

  /**
   * Drops the attachments' versions so the next bind reallocates GPU storage.
   * The backends call this from their `needsUpdate` handling.
   */
  invalidate(): this {
    this.texture.version++;
    if (this.depthTexture) this.depthTexture.version++;
    return this;
  }

  copy(source: RenderTarget): this {
    this.name = source.name;
    this.texture.copy(source.texture);
    this.depthTexture?.copy(source.depthTexture as Texture);
    this.setSize(source.width, source.height);
    this.samples = source.samples;
    this.scissorTest = source.scissorTest;
    this.scissor.copy(source.scissor);
    this.viewport.copy(source.viewport);
    return this;
  }

  clone(): RenderTarget {
    return new RenderTarget({
      width: this.width,
      height: this.height,
      samples: this.samples,
      depth: this.hasDepth,
      depthTexture: this.depthTexture !== null,
      stencil: this.hasStencil,
    }).copy(this);
  }

  dispose(): void {
    this.dispatchEvent('dispose', { target: this });
  }
}

/**
 * A depth-only texture descriptor.
 *
 * `format: 'depth'` is the marker the backends key on, and `'float32'` is the
 * matching component type: WebGL2 wants `DEPTH_COMPONENT32F` and WebGPU
 * `depth32float`, so both give full 32-bit precision for shadow comparisons.
 */
function createDepthTexture(width: number, height: number, name: string): Texture {
  const texture = new Texture(null, { width, height, format: 'depth', type: 'float32' });
  texture.name = name ? `${name}.depth` : 'RenderTarget.depth';
  texture.flipY = false;
  texture.generateMipmaps = false;
  // `nearest` keeps the raw depth value intact; filtering it would interpolate
  // two incomparable depths.
  texture.magFilter = 'nearest';
  texture.minFilter = 'nearest';
  texture.wrapS = 'clamp';
  texture.wrapT = 'clamp';
  // Depth is data, not colour: no sRGB decode on read.
  texture.colorSpace = 'linear';
  (texture as { isDepthTexture?: boolean }).isDepthTexture = true;
  (texture as { isRenderTargetTexture?: boolean }).isRenderTargetTexture = true;
  return texture;
}

/** A `Texture` created by a `RenderTarget`, as opposed to one holding pixels. */
export function isRenderTargetTexture(texture: Texture): boolean {
  return (texture as { isRenderTargetTexture?: boolean }).isRenderTargetTexture === true;
}

/** A depth attachment texture. */
export function isDepthTexture(texture: Texture): boolean {
  return (texture as { isDepthTexture?: boolean }).isDepthTexture === true;
}

/** Narrowing helper so backends can accept `RenderTarget | null` uniformly. */
export function isRenderTarget(value: unknown): value is RenderTarget {
  return (
    value !== null &&
    typeof value === 'object' &&
    (value as { isRenderTarget?: unknown }).isRenderTarget === true
  );
}
