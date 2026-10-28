import {
  GL_LINEAR,
  GL_NEAREST_MIPMAP_LINEAR,
  GL_REPEAT,
  GL_TEXTURE_2D,
  GL_TEXTURE_MAG_FILTER,
  GL_TEXTURE_MAX_ANISOTROPY_EXT,
  GL_TEXTURE_MIN_FILTER,
  GL_TEXTURE_WRAP_S,
  GL_TEXTURE_WRAP_T,
} from './constants.js';
import { GL1DisposedError } from './errors.js';
import type { GL1State } from './GL1State.js';
import { textureFilter, textureFormat, textureWrap } from './mappings.js';
import type {
  GL1TextureData,
  GL1TextureOptions,
  GL1TexturePoolOptions,
  GL1TextureRef,
  GL1TextureSource,
  GL1Stats,
} from './types.js';

const DEFAULT_OPTIONS: Required<Pick<GL1TextureOptions, 'format' | 'minFilter' | 'magFilter' | 'wrapS' | 'wrapT' | 'generateMipmaps' | 'flipY' | 'premultiplyAlpha' | 'unpackAlignment'>> = {
  format: 'rgba8',
  minFilter: 'linear',
  magFilter: 'linear',
  wrapS: 'clamp-to-edge',
  wrapT: 'clamp-to-edge',
  generateMipmaps: false,
  flipY: false,
  premultiplyAlpha: false,
  unpackAlignment: 4,
};

function isDomSource(source: GL1TextureSource): source is TexImageSource {
  const g = globalThis as unknown as Record<string, unknown>;
  const guards: Array<[string, (value: unknown) => boolean]> = [
    ['HTMLImageElement', (v) => v instanceof (g.HTMLImageElement as { new (...args: unknown[]): unknown })],
    ['HTMLCanvasElement', (v) => v instanceof (g.HTMLCanvasElement as { new (...args: unknown[]): unknown })],
    ['ImageBitmap', (v) => v instanceof (g.ImageBitmap as { new (...args: unknown[]): unknown })],
    ['OffscreenCanvas', (v) => v instanceof (g.OffscreenCanvas as { new (...args: unknown[]): unknown })],
    ['HTMLVideoElement', (v) => v instanceof (g.HTMLVideoElement as { new (...args: unknown[]): unknown })],
    ['ImageData', (v) => v instanceof (g.ImageData as { new (...args: unknown[]): unknown })],
    ['VideoFrame', (v) => v instanceof (g.VideoFrame as { new (...args: unknown[]): unknown })],
  ];
  for (const [name, check] of guards) {
    if (typeof g[name] === 'function' && check(source)) return true;
  }
  return false;
}

function sourceSize(source: TexImageSource | GL1TextureData): { width: number; height: number } {
  const value = source as unknown as Record<string, number>;
  const width = value.videoWidth ?? value.width ?? value.naturalWidth ?? 0;
  const height = value.videoHeight ?? value.height ?? value.naturalHeight ?? 0;
  return { width, height };
}

/**
 * A 2D texture that remembers both its sampler parameters and the last uploaded
 * source, so re-binding or re-uploading the same content costs nothing.
 */
export class GL1Texture implements GL1TextureRef {
  private readonly gl: WebGLRenderingContext;
  private readonly stats: GL1Stats;
  private readonly state: GL1State;
  private readonly handleValue: WebGLTexture;
  private readonly params = new Map<number, number>([
    [GL_TEXTURE_MIN_FILTER, GL_NEAREST_MIPMAP_LINEAR],
    [GL_TEXTURE_MAG_FILTER, GL_LINEAR],
    [GL_TEXTURE_WRAP_S, GL_REPEAT],
    [GL_TEXTURE_WRAP_T, GL_REPEAT],
  ]);
  private readonly anisotropyExt: EXT_texture_filter_anisotropic | null;
  private options: GL1TextureOptions;
  private widthValue = 0;
  private heightValue = 0;
  private mipmapsReady = false;
  private dirty = true;
  private lastSource: TexImageSource | GL1TextureData | null = null;
  private disposedFlag = false;
  private uploadVersion = 0;

  constructor(gl: WebGLRenderingContext, stats: GL1Stats, state: GL1State, options: GL1TextureOptions = {}) {
    this.gl = gl;
    this.stats = stats;
    this.state = state;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.anisotropyExt = gl.getExtension('EXT_texture_filter_anisotropic');
    const handle = gl.createTexture();
    if (!handle) throw new Error('Failed to create WebGL texture');
    this.handleValue = handle;
    stats.texturesCreated++;
    stats.glCalls++;
  }

  get handle(): WebGLTexture {
    return this.handleValue;
  }

  get width(): number {
    return this.widthValue;
  }

  get height(): number {
    return this.heightValue;
  }

  get disposed(): boolean {
    return this.disposedFlag;
  }

  /** Monotonic counter, incremented on every successful upload. */
  get version(): number {
    return this.uploadVersion;
  }

  get textureOptions(): Readonly<GL1TextureOptions> {
    return this.options;
  }

  bind(unit = 0): this {
    this.state.bindTexture(GL_TEXTURE_2D, unit, this.handleValue);
    return this;
  }

  /**
   * Upload pixels. Passing a DOM source (image/bitmap/canvas/video) uses the
   * DOM overload; passing `{width, height, data}` allocates or uploads raw
   * pixels; passing `{width, height}` allocates storage for a render target.
   */
  upload(source: GL1TextureSource, options: GL1TextureOptions = {}): this {
    this.assertLive();
    const merged = { ...this.options, ...options };
    const format = textureFormat(merged.format ?? 'rgba8');
    const dom = isDomSource(source);
    const { width, height } = sourceSize(source);
    if (width <= 0 || height <= 0) throw new Error(`Invalid texture size ${width}x${height}`);
    this.state.setPixelStore({
      flipY: merged.flipY,
      premultiplyAlpha: merged.premultiplyAlpha,
      unpackAlignment: merged.unpackAlignment,
    });
    // Parameters require the texture to be bound; unit 0 is used as a scratch
    // unit and the state cache keeps track of the change.
    this.bind(0);
    const gl = this.gl;
    if (dom) {
      gl.texImage2D(GL_TEXTURE_2D, 0, format.internalFormat, format.format, format.type, source as TexImageSource);
    } else {
      const data = (source as GL1TextureData).data ?? null;
      gl.texImage2D(GL_TEXTURE_2D, 0, format.internalFormat, width, height, 0, format.format, format.type, data);
    }
    this.stats.glCalls++;
    this.stats.textureUploads++;
    this.stats.textureUploadBytes += width * height * format.bytesPerPixel;
    this.widthValue = width;
    this.heightValue = height;
    this.options = merged;
    this.uploadVersion++;
    this.lastSource = source;
    this.dirty = false;
    this.applyParameters();
    this.mipmapsReady = false;
    if (merged.generateMipmaps) this.generateMipmaps();
    return this;
  }

  /** Upload only when the source object changed or `markDirty()` was called. */
  uploadIfChanged(source: GL1TextureSource, options: GL1TextureOptions = {}): this {
    if (!this.dirty && this.lastSource === source) {
      this.stats.textureUploadSkipped++;
      return this;
    }
    return this.upload(source, options);
  }

  /** Allocate storage (no pixel upload), used for render targets. */
  reserve(width: number, height: number, options: GL1TextureOptions = {}): this {
    return this.upload({ width, height, data: null }, options);
  }

  markDirty(): void {
    this.dirty = true;
  }

  setOptions(options: GL1TextureOptions): this {
    this.assertLive();
    this.options = { ...this.options, ...options };
    this.bind(0);
    this.applyParameters();
    if (this.options.generateMipmaps && !this.mipmapsReady) this.generateMipmaps();
    return this;
  }

  /** Replace the option set (used when a pooled texture is recycled). */
  reconfigure(options: GL1TextureOptions): this {
    this.assertLive();
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.markDirty();
    return this;
  }

  generateMipmaps(): void {
    this.assertLive();
    this.bind(0);
    this.gl.generateMipmap(GL_TEXTURE_2D);
    this.stats.glCalls++;
    this.stats.textureMipmapGenerations++;
    this.mipmapsReady = true;
  }

  private applyParameters(): void {
    const gl = this.gl;
    const set = (pname: number, value: number): void => {
      if (this.params.get(pname) === value) {
        this.stats.stateSkipped++;
        return;
      }
      gl.texParameteri(GL_TEXTURE_2D, pname, value);
      this.params.set(pname, value);
      this.stats.glCalls++;
    };
    const options = this.options;
    set(GL_TEXTURE_MIN_FILTER, textureFilter(options.minFilter ?? 'linear'));
    set(GL_TEXTURE_MAG_FILTER, textureFilter(options.magFilter ?? 'linear'));
    set(GL_TEXTURE_WRAP_S, textureWrap(options.wrapS ?? 'clamp-to-edge'));
    set(GL_TEXTURE_WRAP_T, textureWrap(options.wrapT ?? 'clamp-to-edge'));
    if (this.anisotropyExt && options.anisotropy !== undefined) {
      const max = gl.getParameter(this.anisotropyExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number;
      const value = Math.min(options.anisotropy, max);
      if (this.params.get(GL_TEXTURE_MAX_ANISOTROPY_EXT) !== value) {
        gl.texParameterf(GL_TEXTURE_2D, GL_TEXTURE_MAX_ANISOTROPY_EXT, value);
        this.params.set(GL_TEXTURE_MAX_ANISOTROPY_EXT, value);
        this.stats.glCalls++;
      }
    }
  }

  private assertLive(): void {
    if (this.disposedFlag) throw new GL1DisposedError('GL1Texture');
  }

  dispose(): void {
    if (this.disposedFlag) return;
    this.disposedFlag = true;
    this.gl.deleteTexture(this.handleValue);
    this.stats.glCalls++;
    this.widthValue = 0;
    this.heightValue = 0;
  }
}

/**
 * Pool of reusable 2D textures. Releasing a texture keeps its GPU allocation;
 * acquiring it again re-specifies the same object instead of creating a new one.
 */
export class GL1TexturePool {
  private readonly gl: WebGLRenderingContext;
  private readonly stats: GL1Stats;
  private readonly state: GL1State;
  private readonly maxFree: number;
  private readonly free: GL1Texture[] = [];
  private disposedFlag = false;

  constructor(gl: WebGLRenderingContext, stats: GL1Stats, state: GL1State, options: GL1TexturePoolOptions = {}) {
    this.gl = gl;
    this.stats = stats;
    this.state = state;
    this.maxFree = Math.max(0, options.maxFreeTextures ?? 32);
  }

  get disposed(): boolean {
    return this.disposedFlag;
  }

  acquire(options: GL1TextureOptions = {}): GL1Texture {
    if (this.disposedFlag) throw new GL1DisposedError('GL1TexturePool');
    const texture = this.free.pop();
    if (texture) {
      this.stats.texturesReused++;
      texture.reconfigure(options);
      return texture;
    }
    return new GL1Texture(this.gl, this.stats, this.state, options);
  }

  release(texture: GL1Texture): void {
    if (this.disposedFlag || texture.disposed) return;
    if (this.free.length >= this.maxFree) {
      texture.dispose();
      return;
    }
    this.free.push(texture);
  }

  dispose(): void {
    if (this.disposedFlag) return;
    this.disposedFlag = true;
    for (const texture of this.free) texture.dispose();
    this.free.length = 0;
  }
}
