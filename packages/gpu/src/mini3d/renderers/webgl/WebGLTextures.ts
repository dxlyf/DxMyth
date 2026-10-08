import type { Texture } from '../../textures/Texture';
import type { DataTexture } from '../../textures/DataTexture';
import type { GL } from './GLProgram';

/** Internal per-texture GPU record. */
interface TextureRecord {
  handle: WebGLTexture;
  /** `texture.version` at the last successful upload. */
  version: number;
  width: number;
  height: number;
  bytes: number;
  /** True when the upload needs the `flipY` orientation applied. */
  flipY: boolean;
}

interface FormatInfo {
  internalFormat: number;
  format: number;
  type: number;
}

export interface TextureCapabilities {
  isWebGL2: boolean;
  maxTextureSize: number;
  maxTextureUnits: number;
  maxAnisotropy: number;
  supportsFloat: boolean;
  supportsHalfFloat: boolean;
  supportsDepthTexture: boolean;
  anisotropyExtension: { TEXTURE_MAX_ANISOTROPY_EXT: number } | null;
  halfFloatLinear: boolean;
}

/**
 * Owns every `WebGLTexture` the renderer has uploaded, keyed by the JS
 * `Texture` object. Handles re-upload on `version` change, mipmap generation,
 * wrap/filter translation and a 1x1 fallback so samplers are always bound.
 */
export class WebGLTextures {
  private readonly gl: GL;
  private readonly capabilities: TextureCapabilities;
  private readonly records = new WeakMap<Texture, TextureRecord>();
  /** Textures disposed through their own event while still cached. */
  private readonly tracked = new Set<Texture>();

  /** White, 1x1 fallback used for every unbound sampler slot. */
  readonly fallbackTexture: WebGLTexture;
  /** Mid-grey fallback, matching three.js' default normal map expectation. */
  readonly normalFallbackTexture: WebGLTexture;

  private uploadsThisFrame = 0;
  private bytesUsed = 0;

  constructor(gl: GL, capabilities: TextureCapabilities) {
    this.gl = gl;
    this.capabilities = capabilities;
    this.fallbackTexture = this.createSolidTexture(255, 255, 255, 255);
    this.normalFallbackTexture = this.createSolidTexture(128, 128, 255, 255);
  }

  /** Creates a 1x1 RGBA8 texture with the given byte value. */
  private createSolidTexture(r: number, g: number, b: number, a: number): WebGLTexture {
    const gl = this.gl;
    const texture = gl.createTexture();
    if (!texture) throw new Error('mini3d: gl.createTexture() returned null');
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([r, g, b, a]),
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
  }

  /** Uploads (or refreshes) `texture` and returns its GL handle. */
  upload(texture: Texture): WebGLTexture {
    const gl = this.gl;
    const existing = this.records.get(texture);
    if (existing && existing.version === texture.version) return existing.handle;

    const handle = existing?.handle ?? gl.createTexture();
    if (!handle) throw new Error('mini3d: gl.createTexture() returned null');

    // `premultiplyAlpha`/`unpackAlignment` are pixel-store state; restore after.
    const previousAlignment = gl.getParameter(gl.UNPACK_ALIGNMENT) as number;
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, texture.unpackAlignment);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, texture.flipY ? 1 : 0);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha ? 1 : 0);

    gl.bindTexture(gl.TEXTURE_2D, handle);
    const startBytes = this.bytesUsed;

    try {
      this.applyParameters(gl, texture);
      const info = this.formatFor(texture);
      const source = texture.image as TexImageSource | null;

      if ((texture as unknown as Partial<DataTexture>).isDataTexture === true && (texture as DataTexture).data) {
        const data = (texture as DataTexture).data;
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          info.internalFormat,
          texture.width,
          texture.height,
          0,
          info.format,
          info.type,
          data as ArrayBufferView,
        );
        // Data textures never get GPU-side mipmaps from the driver; make them.
        if (texture.generateMipmaps) gl.generateMipmap(gl.TEXTURE_2D);
      } else if (source) {
        this.uploadImage(gl, texture, source, info, 0);
        if (texture.generateMipmaps) gl.generateMipmap(gl.TEXTURE_2D);
      } else if ((texture as { isRenderTargetTexture?: boolean }).isRenderTargetTexture === true) {
        // Render target attachment: storage only, the GPU writes the contents.
        // Allocating at the texture's own size is what makes it attachable; the
        // 1x1 placeholder below would fail `checkFramebufferStatus`.
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          info.internalFormat,
          texture.width,
          texture.height,
          0,
          info.format,
          info.type,
          null,
        );
      } else {
        // No CPU data at all: allocate a 1x1 placeholder so sampling is defined.
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          1,
          1,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          new Uint8Array([0, 0, 0, 0]),
        );
      }

      // Upload every explicit mip level that came with the texture.
      if (texture.mipmaps.length > 0) {
        for (let level = 0; level < texture.mipmaps.length; level++) {
          const mipmap = texture.mipmaps[level];
          gl.texImage2D(
            gl.TEXTURE_2D,
            level + 1,
            info.internalFormat,
            mipmap.width,
            mipmap.height,
            0,
            info.format,
            info.type,
            mipmap.data as ArrayBufferView,
          );
        }
      }

      const bytes =
        texture.width * texture.height * bytesPerTexel(texture.format, texture.type);
      const record: TextureRecord = {
        handle,
        version: texture.version,
        width: texture.width,
        height: texture.height,
        bytes,
        flipY: texture.flipY,
      };
      this.records.set(texture, record);
      this.bytesUsed = startBytes + bytes;
      this.uploadsThisFrame++;
      return handle;
    } finally {
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, previousAlignment);
    }
  }

  /** `texImage2D` from an image/canvas/video source (may need a resize path). */
  private uploadImage(
    gl: GL,
    texture: Texture,
    source: TexImageSource,
    info: FormatInfo,
    level: number,
  ): void {
    try {
      gl.texImage2D(gl.TEXTURE_2D, level, info.internalFormat, info.format, info.type, source);
    } catch (error) {
      // Non-power-of-two video frames on WebGL1 can fail here; retry via the
      // CPU-scaled path by drawing into a scratch canvas.
      if (!this.capabilities.isWebGL2) {
        const canvas = createScratchCanvas(texture.width, texture.height);
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(source as CanvasImageSource, 0, 0, texture.width, texture.height);
            gl.texImage2D(
              gl.TEXTURE_2D,
              level,
              info.internalFormat,
              info.format,
              info.type,
              canvas,
            );
            return;
          }
        }
      }
      throw error;
    }
  }

  /** Translates wrap/filter/anisotropy settings onto the bound texture. */
  private applyParameters(gl: GL, texture: Texture): void {
    const wrapS = wrapToGL(gl, texture.wrapS);
    const wrapT = wrapToGL(gl, texture.wrapT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilterToGL(gl, texture.magFilter));

    let minFilter = minFilterToGL(gl, texture.minFilter);
    // Mipmap filters are invalid without mipmaps: fall back to linear.
    const needsMipmaps = isMipmapFilter(texture.minFilter);
    if (needsMipmaps && !texture.generateMipmaps && texture.mipmaps.length === 0) {
      minFilter = gl.LINEAR;
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);

    if (texture.anisotropy > 1 && this.capabilities.anisotropyExtension) {
      const ext = this.capabilities.anisotropyExtension;
      gl.texParameterf(
        gl.TEXTURE_2D,
        ext.TEXTURE_MAX_ANISOTROPY_EXT,
        Math.min(texture.anisotropy, this.capabilities.maxAnisotropy),
      );
    }
  }

  /** Picks internal format / format / type from the texture description. */
  private formatFor(texture: Texture): FormatInfo {
    const gl = this.gl;
    const halfFloat = gl.HALF_FLOAT ?? 0x8d61;

    if (texture.format === 'depth' || texture.format === 'depth-stencil') {
      return depthFormatInfo(gl, texture.format === 'depth-stencil', this.capabilities.isWebGL2);
    }

    if (texture.type === 'float32') {
      return {
        internalFormat: this.capabilities.isWebGL2 ? gl.RGBA32F : gl.RGBA,
        format: gl.RGBA,
        type: gl.FLOAT,
      };
    }
    if (texture.type === 'float16') {
      return {
        internalFormat: this.capabilities.isWebGL2 ? gl.RGBA16F : gl.RGBA,
        format: gl.RGBA,
        type: halfFloat,
      };
    }

    switch (texture.format) {
      case 'rgb':
        return { internalFormat: gl.RGB, format: gl.RGB, type: gl.UNSIGNED_BYTE };
      case 'r':
        return {
          internalFormat: this.capabilities.isWebGL2 ? gl.R8 : gl.LUMINANCE,
          format: this.capabilities.isWebGL2 ? gl.RED : gl.LUMINANCE,
          type: gl.UNSIGNED_BYTE,
        };
      case 'rg':
        return {
          internalFormat: this.capabilities.isWebGL2 ? gl.RG8 : gl.LUMINANCE_ALPHA,
          format: this.capabilities.isWebGL2 ? gl.RG : gl.LUMINANCE_ALPHA,
          type: gl.UNSIGNED_BYTE,
        };
      case 'rgba':
      case 'rgba-float':
      case 'rgb-float':
      default:
        return { internalFormat: gl.RGBA, format: gl.RGBA, type: gl.UNSIGNED_BYTE };
    }
  }

  /** Binds `texture` to `unit`, uploading it first when necessary. */
  bind(texture: Texture, unit: number): void {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + unit);
    const handle = this.upload(texture);
    gl.bindTexture(gl.TEXTURE_2D, handle);
  }

  /**
   * Allocates (or returns) the GPU texture for a render target's colour
   * attachment.
   *
   * A render target's colour texture has no CPU pixels: its contents are written
   * by the GPU, so it only needs storage. When `samples > 0` the attachment is a
   * multisampled renderbuffer instead and this allocation only backs the resolve
   * blit destination, which is why the sample count is not passed on.
   */
  acquireRenderTargetColor(texture: Texture): WebGLTexture {
    return this.upload(texture);
  }

  /**
   * Allocates (or returns) the GPU texture for a render target's depth
   * attachment.
   *
   * Depth *texture* attachments require WebGL2 or `WEBGL_depth_texture`; the
   * error names that requirement rather than failing later at
   * `checkFramebufferStatus`.
   */
  acquireRenderTargetDepth(texture: Texture): WebGLTexture {
    if (!this.capabilities.isWebGL2 && !this.capabilities.supportsDepthTexture) {
      throw new Error(
        'mini3d.WebGLRenderer: a depth texture attachment requires WebGL2 or the ' +
          'WEBGL_depth_texture extension. Use `RenderTarget({ depth: true })` for a ' +
          'depth buffer that is not sampled.',
      );
    }
    return this.upload(texture);
  }

  /** Binds the white fallback to `unit` (used for absent samplers). */
  bindFallback(unit: number, normalMap = false): void {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, normalMap ? this.normalFallbackTexture : this.fallbackTexture);
  }

  /** Drops the GPU texture for `texture`, if any. */
  release(texture: Texture): void {
    const record = this.records.get(texture);
    if (!record) return;
    this.gl.deleteTexture(record.handle);
    this.bytesUsed = Math.max(0, this.bytesUsed - record.bytes);
    this.records.delete(texture);
    this.tracked.delete(texture);
  }

  /** Registers a texture so `dispose()` can release it. */
  track(texture: Texture): void {
    if (this.tracked.has(texture)) return;
    this.tracked.add(texture);
    texture.addEventListener('dispose', (event) => this.release(event.target));
  }

  get count(): number {
    return this.tracked.size;
  }

  get bytes(): number {
    return this.bytesUsed;
  }

  get uploadsLastFrame(): number {
    return this.uploadsThisFrame;
  }

  /** Called once per frame by the renderer. */
  resetFrameStats(): void {
    this.uploadsThisFrame = 0;
  }

  dispose(): void {
    for (const texture of Array.from(this.tracked)) {
      this.release(texture);
    }
    this.tracked.clear();
    this.gl.deleteTexture(this.fallbackTexture);
    this.gl.deleteTexture(this.normalFallbackTexture);
    this.bytesUsed = 0;
  }
}

function bytesPerTexel(format: string, type: string): number {
  const typeBytes = type === 'uint8' ? 1 : type === 'float16' ? 2 : 4;
  switch (format) {
    case 'r':
    case 'depth':
      return typeBytes;
    case 'rg':
      return typeBytes * 2;
    case 'rgb':
    case 'rgb-float':
      return typeBytes * 3;
    default:
      return typeBytes * 4;
  }
}

function wrapToGL(gl: GL, wrap: string): number {
  switch (wrap) {
    case 'repeat':
      return gl.REPEAT;
    case 'mirror':
      return gl.MIRRORED_REPEAT;
    case 'clamp':
    default:
      return gl.CLAMP_TO_EDGE;
  }
}

function magFilterToGL(gl: GL, filter: string): number {
  return filter === 'nearest' ? gl.NEAREST : gl.LINEAR;
}

function minFilterToGL(gl: GL, filter: string): number {
  switch (filter) {
    case 'nearest':
      return gl.NEAREST;
    case 'linear':
      return gl.LINEAR;
    case 'nearest-mipmap-nearest':
      return gl.NEAREST_MIPMAP_NEAREST;
    case 'linear-mipmap-nearest':
      return gl.LINEAR_MIPMAP_NEAREST;
    case 'nearest-mipmap-linear':
      return gl.NEAREST_MIPMAP_LINEAR;
    case 'linear-mipmap-linear':
    default:
      return gl.LINEAR_MIPMAP_LINEAR;
  }
}

function isMipmapFilter(filter: string): boolean {
  return filter.includes('mipmap');
}

/**
 * `FormatInfo` for a depth or depth-stencil attachment.
 *
 * The internal format is where the drivers differ: WebGL2 wants a sized format
 * (`DEPTH_COMPONENT24`, `DEPTH24_STENCIL8`), while WebGL1 only understands the
 * unsized `DEPTH_COMPONENT` / `DEPTH_STENCIL` pair together with the
 * `WEBGL_depth_texture` extension.
 */
function depthFormatInfo(gl: GL, stencil: boolean, isWebGL2: boolean): FormatInfo {
  const DEPTH_STENCIL = gl.DEPTH_STENCIL ?? 0x84f9;
  const UNSIGNED_INT_24_8 = gl.UNSIGNED_INT_24_8 ?? 0x84fa;
  if (stencil) {
    return {
      internalFormat: isWebGL2 ? gl.DEPTH24_STENCIL8 : DEPTH_STENCIL,
      format: DEPTH_STENCIL,
      type: UNSIGNED_INT_24_8,
    };
  }
  return {
    internalFormat: isWebGL2 ? gl.DEPTH_COMPONENT24 : gl.DEPTH_COMPONENT,
    format: gl.DEPTH_COMPONENT,
    type: gl.UNSIGNED_INT,
  };
}

/** Creates an offscreen 2D canvas when the environment provides one. */
function createScratchCanvas(width: number, height: number): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);
  return canvas;
}
