import { GL_TEXTURE_2D } from './constants.js';
import { GL2DisposedError, GL2Error } from './errors.js';
import type { GL2State } from './GL2State.js';
import type { GL2Sampler, GL2SamplerCache } from './GL2Sampler.js';
import { mipLevelCount, textureFormat } from './mappings.js';
import type {
  GL2Stats,
  GL2TextureData,
  GL2TextureFormat,
  GL2TextureOptions,
  GL2TexturePoolOptions,
  GL2TextureRef,
  GL2TextureSource,
} from './types.js';

const DEFAULT_OPTIONS = {
  format: 'rgba8' as GL2TextureFormat,
  minFilter: 'linear' as const,
  magFilter: 'linear' as const,
  wrapS: 'clamp-to-edge' as const,
  wrapT: 'clamp-to-edge' as const,
  immutable: true,
  generateMipmaps: false,
  flipY: false,
  premultiplyAlpha: false,
  unpackAlignment: 4 as const,
};

function isDomSource(source: GL2TextureSource): source is TexImageSource {
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

function sourceSize(source: TexImageSource | GL2TextureData): { width: number; height: number } {
  const value = source as unknown as Record<string, number>;
  return {
    width: value.videoWidth ?? value.width ?? value.naturalWidth ?? 0,
    height: value.videoHeight ?? value.height ?? value.naturalHeight ?? 0,
  };
}

function samplerSignature(options: GL2TextureOptions): string {
  return `${options.minFilter ?? 'linear'}|${options.magFilter ?? 'linear'}|${options.wrapS ?? 'clamp-to-edge'}|${options.wrapT ?? 'clamp-to-edge'}|${options.compareFunc ?? 'always'}|${options.anisotropy ?? 0}`;
}

/**
 * A WebGL2 2D texture with:
 *  - immutable storage (`texStorage2D`) by default, which removes per-draw
 *    texture completeness validation,
 *  - `texSubImage2D` re-uploads when size/format are unchanged,
 *  - a cached sampler object for all filtering/wrapping state,
 *  - upload deduplication by source identity.
 */
export class GL2Texture implements GL2TextureRef {
  private readonly gl: WebGL2RenderingContext;
  private readonly stats: GL2Stats;
  private readonly state: GL2State;
  private readonly samplers: GL2SamplerCache;
  private handleValue: WebGLTexture;
  private options: GL2TextureOptions;
  private widthValue = 0;
  private heightValue = 0;
  private formatKey: GL2TextureFormat = 'rgba8';
  private storageMode: 'none' | 'mutable' | 'immutable' = 'none';
  private hasStorage = false;
  private mipLevels = 1;
  private mipmapsReady = false;
  private dirty = true;
  private lastSource: TexImageSource | GL2TextureData | null = null;
  private uploadVersion = 0;
  private disposedFlag = false;
  private samplerRef: GL2Sampler | null = null;
  private samplerSignatureValue = '';

  constructor(gl: WebGL2RenderingContext, stats: GL2Stats, state: GL2State, samplers: GL2SamplerCache, options: GL2TextureOptions = {}) {
    this.gl = gl;
    this.stats = stats;
    this.state = state;
    this.samplers = samplers;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    const handle = gl.createTexture();
    if (!handle) throw new Error('Failed to create WebGL2 texture');
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

  get version(): number {
    return this.uploadVersion;
  }

  get textureOptions(): Readonly<GL2TextureOptions> {
    return this.options;
  }

  get mipLevelsCount(): number {
    return this.mipLevels;
  }

  /** The sampler object representing this texture's filtering state. */
  get sampler(): GL2Sampler {
    const signature = samplerSignature(this.options);
    if (!this.samplerRef || this.samplerSignatureValue !== signature) {
      this.samplerRef = this.samplers.get(this.options);
      this.samplerSignatureValue = signature;
    }
    return this.samplerRef;
  }

  get samplerHandle(): WebGLSampler {
    return this.sampler.handle;
  }

  bind(unit = 0): this {
    this.state.bindTexture(unit, this.handleValue);
    return this;
  }

  upload(source: GL2TextureSource, options: GL2TextureOptions = {}): this {
    this.assertLive();
    const merged: GL2TextureOptions = { ...this.options, ...options };
    const formatKey = merged.format ?? 'rgba8';
    const format = textureFormat(formatKey);
    const dom = isDomSource(source);
    const { width, height } = sourceSize(source);
    if (width <= 0 || height <= 0) throw new GL2Error(`Invalid texture size ${width}x${height}`);
    const data = dom ? null : ((source as GL2TextureData).data ?? null);
    const hasPixels = dom || data !== null;
    const immutable = merged.immutable !== false;

    this.state.setPixelStore({
      flipY: merged.flipY,
      premultiplyAlpha: merged.premultiplyAlpha,
      unpackAlignment: merged.unpackAlignment,
      unpackRowLength: merged.unpackRowLength,
    });
    this.bind(0);
    const gl = this.gl;

    const sizeChanged = this.widthValue !== width || this.heightValue !== height;
    const formatChanged = this.formatKey !== formatKey;
    const modeChanged = this.storageMode !== 'none' && this.storageMode !== (immutable ? 'immutable' : 'mutable');
    const needsStorage = !this.hasStorage || sizeChanged || formatChanged || modeChanged;
    if (needsStorage) {
      if (this.hasStorage && (this.storageMode === 'immutable' || immutable)) {
        // Immutable storage cannot be re-specified; swap the GPU object but keep
        // the wrapper (and therefore the caller's reference) alive.
        this.recreateHandle();
      }
      this.hasStorage = false;
      this.mipmapsReady = false;
      if (immutable) {
        const levels = Math.max(1, Math.min(
          merged.mipLevels ?? (merged.generateMipmaps ? mipLevelCount(width, height) : 1),
          mipLevelCount(width, height),
        ));
        gl.texStorage2D(GL_TEXTURE_2D, levels, format.internalFormat, width, height);
        this.stats.glCalls++;
        this.hasStorage = true;
        this.mipLevels = levels;
      }
      this.storageMode = immutable ? 'immutable' : 'mutable';
      this.formatKey = formatKey;
      this.widthValue = width;
      this.heightValue = height;
    }

    if (hasPixels) {
      if (this.storageMode === 'immutable' || this.hasStorage) {
        this.writeSubImage(dom, source, data, width, height, format);
      } else {
        this.writeImage(dom, source, data, width, height, format);
        this.hasStorage = true;
      }
      this.stats.textureUploads++;
      this.stats.textureUploadBytes += width * height * format.bytesPerPixel;
    } else if (!this.hasStorage) {
      // Allocate mutable storage without pixel data (render targets).
      gl.texImage2D(GL_TEXTURE_2D, 0, format.internalFormat, width, height, 0, format.format, format.type, null);
      this.stats.glCalls++;
      this.stats.textureUploads++;
      this.hasStorage = true;
    }

    this.options = merged;
    this.samplerRef = null;
    this.lastSource = source;
    this.dirty = false;
    this.uploadVersion++;
    if (merged.generateMipmaps) this.generateMipmaps();
    return this;
  }

  uploadIfChanged(source: GL2TextureSource, options: GL2TextureOptions = {}): this {
    if (!this.dirty && this.lastSource === source) {
      this.stats.textureUploadSkipped++;
      return this;
    }
    return this.upload(source, options);
  }

  reserve(width: number, height: number, options: GL2TextureOptions = {}): this {
    return this.upload({ width, height, data: null }, options);
  }

  setOptions(options: GL2TextureOptions): this {
    this.assertLive();
    this.options = { ...this.options, ...options };
    this.samplerRef = null;
    if (this.options.generateMipmaps && this.hasStorage && !this.mipmapsReady) this.generateMipmaps();
    return this;
  }

  /** Replace options instead of merging (used when a pooled texture is reused). */
  reconfigure(options: GL2TextureOptions): this {
    this.assertLive();
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.samplerRef = null;
    this.markDirty();
    return this;
  }

  markDirty(): void {
    this.dirty = true;
  }

  generateMipmaps(): void {
    this.assertLive();
    if (!this.hasStorage) return;
    this.bind(0);
    this.gl.generateMipmap(GL_TEXTURE_2D);
    this.stats.glCalls++;
    this.stats.mipmapGenerations++;
    this.mipmapsReady = true;
  }

  private writeImage(
    dom: boolean,
    source: GL2TextureSource,
    data: ArrayBufferView | null,
    width: number,
    height: number,
    format: ReturnType<typeof textureFormat>,
  ): void {
    const gl = this.gl;
    if (dom) {
      gl.texImage2D(GL_TEXTURE_2D, 0, format.internalFormat, format.format, format.type, source as TexImageSource);
    } else {
      gl.texImage2D(GL_TEXTURE_2D, 0, format.internalFormat, width, height, 0, format.format, format.type, data);
    }
    this.stats.glCalls++;
  }

  private writeSubImage(
    dom: boolean,
    source: GL2TextureSource,
    data: ArrayBufferView | null,
    width: number,
    height: number,
    format: ReturnType<typeof textureFormat>,
  ): void {
    const gl = this.gl;
    if (dom) {
      gl.texSubImage2D(GL_TEXTURE_2D, 0, 0, 0, format.format, format.type, source as TexImageSource);
    } else {
      gl.texSubImage2D(GL_TEXTURE_2D, 0, 0, 0, width, height, format.format, format.type, data);
    }
    this.stats.glCalls++;
  }

  private recreateHandle(): void {
    const gl = this.gl;
    gl.deleteTexture(this.handleValue);
    const handle = gl.createTexture();
    if (!handle) throw new GL2Error('Failed to recreate WebGL2 texture');
    this.handleValue = handle;
    this.storageMode = 'none';
    this.hasStorage = false;
    this.stats.texturesCreated++;
    this.stats.glCalls += 2;
  }

  private assertLive(): void {
    if (this.disposedFlag) throw new GL2DisposedError('GL2Texture');
  }

  dispose(): void {
    if (this.disposedFlag) return;
    this.disposedFlag = true;
    this.gl.deleteTexture(this.handleValue);
    this.stats.glCalls++;
    this.hasStorage = false;
    this.widthValue = 0;
    this.heightValue = 0;
  }
}

/** Recycles texture objects between frames; no new GPU texture on reuse. */
export class GL2TexturePool {
  private readonly gl: WebGL2RenderingContext;
  private readonly stats: GL2Stats;
  private readonly state: GL2State;
  private readonly samplers: GL2SamplerCache;
  private readonly maxFree: number;
  private readonly free: GL2Texture[] = [];
  private disposedFlag = false;

  constructor(
    gl: WebGL2RenderingContext,
    stats: GL2Stats,
    state: GL2State,
    samplers: GL2SamplerCache,
    options: GL2TexturePoolOptions = {},
  ) {
    this.gl = gl;
    this.stats = stats;
    this.state = state;
    this.samplers = samplers;
    this.maxFree = Math.max(0, options.maxFreeTextures ?? 32);
  }

  acquire(options: GL2TextureOptions = {}): GL2Texture {
    if (this.disposedFlag) throw new GL2DisposedError('GL2TexturePool');
    const texture = this.free.pop();
    if (texture) {
      this.stats.texturesReused++;
      texture.reconfigure(options);
      return texture;
    }
    return new GL2Texture(this.gl, this.stats, this.state, this.samplers, options);
  }

  release(texture: GL2Texture): void {
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
