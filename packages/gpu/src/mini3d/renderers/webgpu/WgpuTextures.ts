/**
 * GPU texture + sampler cache for the WebGPU backend.
 *
 * Responsibilities:
 *
 * - `Texture` / `DataTexture` / `CanvasTexture` uploads, version-checked
 *   against `texture.version`.
 * - `flipY`: **WebGPU has no unpack flip flag**, and flipping the V coordinate
 *   in `ObjectUniforms.uvTransform` would silently flip the tangent basis used
 *   by the normal-map perturbation. So `flipY` is implemented by flipping the
 *   pixel rows while they are still on the CPU (an `OffscreenCanvas`/canvas
 *   round-trip for image sources, a row copy for `DataTexture`). Textures whose
 *   `flipY` is `false` 鈥?notably `DataTexture` and `CanvasTexture`, which are
 *   already in the orientation the author wants 鈥?bypass the flip entirely and
 *   use `copyExternalImageToTexture`/`writeTexture` directly.
 * - Mipmap generation: WebGPU has no `generateMipmap`, so a small bundled
 *   compute shader builds the chain. When the device reports no compute
 *   support, mipmapped `minFilter`s silently degrade to `'linear'` (documented
 *   limitation).
 * - Wrap/filter translation, per-configuration sampler caching, and 1x1 white
 *   and (128, 128, 255) normal fallbacks so all eight texture slots are always
 *   bound.
 */

import type { ColorSpace, FilterMode, TextureDataType, TextureFormat, WrapMode } from '../../constants';
import type { DataTexture } from '../../textures/DataTexture';
import { Texture } from '../../textures/Texture';
import { safeWriteTexture } from './WgpuUploads';

/** Formats the WebGPU backend can upload. */
export type WgpuUploadFormat =
  | 'r8unorm'
  | 'rg8unorm'
  | 'rgba8unorm'
  | 'rgba8unorm-srgb'
  | 'r32float'
  | 'rg32float'
  | 'rgba32float'
  | 'rgba16float'
  /** Render target depth attachment. */
  | 'depth32float';

/** Per-texture GPU record. */
export interface WgpuTextureRecord {
  texture: GPUTexture;
  /** Lazily created default view (mip level 0 is created on first upload). */
  view: GPUTextureView | null;
  /** `texture.version` at the last successful upload. */
  version: number;
  width: number;
  height: number;
  format: WgpuUploadFormat;
  /** True when the chain contains real mip data. */
  hasMipmaps: boolean;
  /** Bytes currently charged to `estimateMemoryUsage()`. */
  bytes: number;
}

/** The 8 sampled slots of bind group 1, in binding order. */
export interface WgpuTextureSlots {
  diffuse: Texture | null;
  normal: Texture | null;
  emissive: Texture | null;
  ao: Texture | null;
  /** `true` selects the (128, 128, 255) fallback instead of white. */
  normalFallback: boolean;
}

const MIP_SHADER_WGSL = /* wgsl */ `
// One 2x2 box filter invocation: dispatch a 4x4 workgroup per target texel
// block (see WgpuTextures.generateMipmaps for the dispatch maths).
@group(0) @binding(0) var srcTexture: texture_2d<f32>;
@group(0) @binding(1) var srcSampler: sampler;
@group(0) @binding(2) var dstTexture: texture_storage_2d<rgba8unorm, write>;

@compute @workgroup_size(4, 4, 1)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let srcSize = vec2<u32>(textureDimensions(srcTexture, 0)) * 2u;
  let dstSize = textureDimensions(dstTexture);
  let coord = id.xy;
  if (coord.x >= dstSize.x || coord.y >= dstSize.y) { return; }

  let base = coord * 2u;
  let maxCoord = srcSize - vec2<u32>(1u);
  let c00 = textureLoad(srcTexture, min(base + vec2<u32>(0u, 0u), maxCoord), 0);
  let c10 = textureLoad(srcTexture, min(base + vec2<u32>(1u, 0u), maxCoord), 0);
  let c01 = textureLoad(srcTexture, min(base + vec2<u32>(0u, 1u), maxCoord), 0);
  let c11 = textureLoad(srcTexture, min(base + vec2<u32>(1u, 1u), maxCoord), 0);
  textureStore(dstTexture, coord, (c00 + c10 + c01 + c11) * 0.25);
}
`;

/** Total mip levels for a `width` x `height` texture. */
export function mipLevelCount(width: number, height: number): number {
  return Math.floor(Math.log2(Math.max(1, Math.max(width, height)))) + 1;
}

/** `GPUFilterMode` for the library's mag/min filter strings. */
export function filterMode(filter: FilterMode): GPUFilterMode {
  return filter.startsWith('nearest') ? 'nearest' : 'linear';
}

/** True for min filters that require a mip chain. */
export function isMipFilter(filter: FilterMode): boolean {
  return filter.includes('mipmap');
}

/** Whether the *mip* level selection uses linear interpolation. */
export function mipmapFilterMode(filter: FilterMode): GPUMipmapFilterMode {
  return filter === 'linear-mipmap-linear' || filter === 'nearest-mipmap-linear'
    ? 'linear'
    : 'nearest';
}

/** `GPUAddressMode` for the library's wrap strings. */
export function addressMode(wrap: WrapMode): GPUAddressMode {
  switch (wrap) {
    case 'repeat':
      return 'repeat';
    case 'mirror':
      return 'mirror-repeat';
    case 'clamp':
    default:
      return 'clamp-to-edge';
  }
}

/** Picks a `GPUTextureFormat` for a texture description. */
export function uploadFormat(
  format: TextureFormat,
  type: TextureDataType,
  colorSpace: ColorSpace,
): WgpuUploadFormat {
  if (type === 'float32') {
    switch (format) {
      case 'r':
      case 'depth':
        return 'r32float';
      case 'rg':
        return 'rg32float';
      default:
        return 'rgba32float';
    }
  }
  if (type === 'float16') return 'rgba16float';

  switch (format) {
    case 'r':
    case 'depth':
      return 'r8unorm';
    case 'rg':
      return 'rg8unorm';
    case 'rgba':
      return colorSpace === 'srgb' ? 'rgba8unorm-srgb' : 'rgba8unorm';
    case 'rgb':
    case 'rgb-float':
    case 'rgba-float':
    case 'depth-stencil':
    default:
      // `rgb8unorm` does not exist in WebGPU; drop the alpha channel on upload
      // or fall back to a 4-channel format.
      return colorSpace === 'srgb' ? 'rgba8unorm-srgb' : 'rgba8unorm';
  }
}

/** Channel count of a library `TextureFormat`. */
export function formatChannels(format: TextureFormat): number {
  switch (format) {
    case 'r':
    case 'depth':
      return 1;
    case 'rg':
      return 2;
    case 'rgb':
    case 'rgb-float':
      return 3;
    default:
      return 4;
  }
}

/** Bytes per pixel of a texture description. */
export function bytesPerTexel(format: TextureFormat, type: TextureDataType): number {
  const typeBytes = type === 'uint8' ? 1 : type === 'float16' ? 2 : 4;
  return formatChannels(format) * typeBytes;
}

/** WebGPU requires a cube/2D texture dimension of at least 1x1. */
function normalizeDimension(value: number): number {
  return Number.isFinite(value) && value >= 1 ? Math.floor(value) : 1;
}

/** Reads `width`/`height` off an arbitrary image source, when present. */
export function imageDimensions(image: unknown): { width: number; height: number } | null {
  if (!image || typeof image !== 'object') return null;
  const source = image as { width?: unknown; height?: unknown; displayWidth?: unknown; displayHeight?: unknown; videoWidth?: unknown; videoHeight?: unknown };
  const width = firstNumber(source.displayWidth, source.videoWidth, source.width);
  const height = firstNumber(source.displayHeight, source.videoHeight, source.height);
  if (width === null || height === null) return null;
  return { width: normalizeDimension(width), height: normalizeDimension(height) };
}

function firstNumber(...values: unknown[]): number | null {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value;
  }
  return null;
}

/**
 * Owns every `GPUTexture`, `GPUSampler` and texture bind group the renderer
 * has created.
 */
export class WgpuTextures {
  private readonly device: GPUDevice;
  private readonly records = new Map<Texture, WgpuTextureRecord>();
  private readonly samplers = new Map<string, GPUSampler>();
  private readonly groupLayout: GPUBindGroupLayout;
  private readonly computePipeline: GPUComputePipeline | null;
  private readonly fallbackWhite: WgpuTextureRecord;
  private readonly fallbackNormal: WgpuTextureRecord;

  /** Total GPU bytes held by uploaded textures. */
  private bytesUsed = 0;
  private warnedAboutFlip = false;
  private warnedAboutMipmaps = false;

  constructor(device: GPUDevice, groupLayout: GPUBindGroupLayout) {
    this.device = device;
    this.groupLayout = groupLayout;
    this.computePipeline = this.createMipmapPipeline();
    this.fallbackWhite = this.createSolidTexture(255, 255, 255, 255, 'white');
    this.fallbackNormal = this.createSolidTexture(128, 128, 255, 255, 'normal');
  }

  // ------------------------------------------------------------- fallbacks --

  private createSolidTexture(r: number, g: number, b: number, a: number, label: string): WgpuTextureRecord {
    const texture = this.device.createTexture({
      label: `mini3d.fallback.${label}`,
      size: { width: 1, height: 1, depthOrArrayLayers: 1 },
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    safeWriteTexture(
      this.device.queue,
      { texture },
      `mini3d.fallback.${label}`,
      new Uint8Array([r, g, b, a]),
      { bytesPerRow: 4, rowsPerImage: 1 },
      { width: 1, height: 1, depthOrArrayLayers: 1 },
    );
    return {
      texture,
      view: texture.createView(),
      version: 0,
      width: 1,
      height: 1,
      format: 'rgba8unorm',
      hasMipmaps: false,
      bytes: 4,
    };
  }
  /** Uploads a texture eagerly so the first draw does not stall. */
  upload(texture: Texture): WgpuTextureRecord {
    const existing = this.records.get(texture);
    if (existing && existing.version === texture.version) return existing;

    // Render target attachments are written by the GPU, so they never take the
    // CPU upload path below.
    if ((texture as { isRenderTargetTexture?: boolean }).isRenderTargetTexture === true) {
      return this.uploadRenderTarget(existing, texture);
    }

    const isData = (texture as unknown as { isDataTexture?: boolean }).isDataTexture === true;
    const dimensions = imageDimensions(texture.image);
    // Prefer the declared size (`Texture.width/height`, kept in sync by
    // `CanvasTexture`) and only fall back to probing the image source.
    const width = normalizeDimension(texture.width >= 1 ? texture.width : dimensions?.width ?? 1);
    const height = normalizeDimension(texture.height >= 1 ? texture.height : dimensions?.height ?? 1);
    const format = uploadFormat(texture.format, texture.type, texture.colorSpace);
    const wantsMipmaps = texture.generateMipmaps || texture.mipmaps.length > 0 || isMipFilter(texture.minFilter);
    const canMipmap = this.computePipeline !== null && texture.type === 'uint8' && isFilterable(format);

    let record = existing;
    const needsRecreate =
      !record ||
      record.width !== width ||
      record.height !== height ||
      record.format !== format;

    if (needsRecreate) {
      if (record) {
        this.bytesUsed = Math.max(0, this.bytesUsed - record.bytes);
        record.texture.destroy();
      }
      const levels = wantsMipmaps && canMipmap ? mipLevelCount(width, height) : 1;
      record = {
        texture: this.device.createTexture({
          label: `mini3d.texture.${texture.name || texture.id}`,
          size: { width, height, depthOrArrayLayers: 1 },
          format,
          mipLevelCount: levels,
          usage:
            GPUTextureUsage.TEXTURE_BINDING |
            GPUTextureUsage.COPY_DST |
            GPUTextureUsage.COPY_SRC |
            GPUTextureUsage.RENDER_ATTACHMENT,
        }),
        view: null,
        version: -1,
        width,
        height,
        format,
        hasMipmaps: false,
        bytes: 0,
      };
      this.records.set(texture, record);
    }

    const target = record as WgpuTextureRecord;
    if (target.version === texture.version && !needsRecreate) return target;

    if (isData) {
      this.uploadDataTexture(target, texture as DataTexture);
    } else {
      this.uploadImageTexture(target, texture);
    }

    if (wantsMipmaps && canMipmap && target.texture.mipLevelCount > 1) {
      this.generateMipmaps(target);
      target.hasMipmaps = true;
    } else if (wantsMipmaps && !canMipmap && !this.warnedAboutMipmaps) {
      this.warnedAboutMipmaps = true;
      console.warn(
        'mini3d.WebGPURenderer: mipmap filters requested but the device cannot build a mip chain ' +
          '(no compute stage or a non-filterable format); falling back to linear filtering.',
      );
    }

    target.version = texture.version;
    target.bytes =
      target.width * target.height * bytesPerTexel(texture.format, texture.type) *
      (target.hasMipmaps ? 4 / 3 : 1);
    this.bytesUsed += target.bytes;
    return target;
  }

  /**
   * Creates (or resizes) the GPU texture backing a render target attachment.
   *
   * These are pure storage: `RENDER_ATTACHMENT` so a pass can draw into them,
   * `TEXTURE_BINDING` so the result can be sampled, and `COPY_SRC`/`COPY_DST` for
   * readback and `copyTextureToTexture`. No mip chain is built, because a mip
   * filter on a render target would need a separate generate step and the default
   * filters are non-mipmap.
   */
  private uploadRenderTarget(
    existing: WgpuTextureRecord | undefined,
    texture: Texture,
  ): WgpuTextureRecord {
    const isDepth = (texture as { isDepthTexture?: boolean }).isDepthTexture === true;
    const width = normalizeDimension(texture.width);
    const height = normalizeDimension(texture.height);
    const format: WgpuUploadFormat = isDepth
      ? 'depth32float'
      : texture.colorSpace === 'srgb'
        ? 'rgba8unorm-srgb'
        : 'rgba8unorm';

    if (existing && existing.width === width && existing.height === height && existing.format === format) {
      existing.version = texture.version;
      return existing;
    }

    if (existing) {
      this.bytesUsed = Math.max(0, this.bytesUsed - existing.bytes);
      existing.texture.destroy();
      this.records.delete(texture);
    }

    const created = this.device.createTexture({
      label: `mini3d.rendertarget.${texture.name || texture.id}`,
      size: { width, height, depthOrArrayLayers: 1 },
      format,
      usage:
        GPUTextureUsage.RENDER_ATTACHMENT |
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_SRC |
        GPUTextureUsage.COPY_DST,
    });

    const record: WgpuTextureRecord = {
      texture: created,
      // A render target is only ever read as a whole, so the view (and therefore
      // the bind group that wraps it) stays valid across frames.
      view: created.createView(),
      version: texture.version,
      width,
      height,
      format,
      hasMipmaps: false,
      bytes: width * height * (isDepth ? 4 : 4),
    };
    this.records.set(texture, record);
    this.bytesUsed += record.bytes;
    return record;
  }

  /** The view a render pass should attach, creating the record on demand. */
  renderTargetView(texture: Texture): GPUTextureView {
    const record = this.upload(texture);
    if (!record.view) record.view = record.texture.createView();
    return record.view;
  }

  /** `true` when `texture` is a depth attachment rather than a colour one. */
  static isDepthAttachment(texture: Texture): boolean {
    return (texture as { isDepthTexture?: boolean }).isDepthTexture === true;
  }

  /** `writeTexture` path for `DataTexture` pixels (with optional row flip). */
  private uploadDataTexture(target: WgpuTextureRecord, texture: DataTexture): void {
    const data = texture.data;
    const bytesPerRow = texture.width * bytesPerTexel(texture.format, texture.type);
    const bytes = new Uint8Array(data.buffer as ArrayBuffer, data.byteOffset, data.byteLength);

    const source: Uint8Array = texture.flipY
      ? flipRows(bytes, texture.width, texture.height, bytesPerRow)
      : bytes;

    safeWriteTexture(
      this.device.queue,
      { texture: target.texture, mipLevel: 0 },
      'mini3d.dataTexture',
      source,
      { bytesPerRow, rowsPerImage: texture.height },
      { width: texture.width, height: texture.height, depthOrArrayLayers: 1 },
    );
  }

  /** `copyExternalImageToTexture` path for image/canvas/video-backed textures. */
  private uploadImageTexture(target: WgpuTextureRecord, texture: Texture): void {
    const image = texture.image as (TexImageSource & { width?: number; height?: number }) | null;

    if (!image) {
      // No CPU pixels at all: write a transparent 1x1 so sampling is defined.
      safeWriteTexture(
        this.device.queue,
        { texture: target.texture, mipLevel: 0 },
        `mini3d.emptyTexture`,
        new Uint8Array([0, 0, 0, 0]),
        { bytesPerRow: 4, rowsPerImage: 1 },
        { width: 1, height: 1, depthOrArrayLayers: 1 },
      );
      return;
    }

    const source = texture.flipY ? this.flipImage(image, texture) : image;
    try {
      this.device.queue.copyExternalImageToTexture(
        { source: source as GPUCopyExternalImageSource },
        { texture: target.texture, mipLevel: 0 },
        { width: target.width, height: target.height, depthOrArrayLayers: 1 },
      );
    } catch (error) {
      if (!this.warnedAboutFlip) {
        this.warnedAboutFlip = true;
        console.warn(
          'mini3d.WebGPURenderer: copyExternalImageToTexture() failed for a texture; ' +
            'the texture will be sampled as an unbound fallback.',
          error,
        );
      }
    }
  }

  /**
   * Flips an image vertically by drawing it into a scratch canvas with a
   * negative Y scale. Returns the original image when no canvas is available
   * (a documented degradation: the texture then samples V-down).
   */
  private flipImage(image: TexImageSource, texture: Texture): TexImageSource {
    const canvas = createScratchCanvas(texture.width, texture.height);
    if (!canvas) {
      if (!this.warnedAboutFlip) {
        this.warnedAboutFlip = true;
        console.warn(
          'mini3d.WebGPURenderer: texture.flipY requires a canvas for an image source; ' +
            'no canvas is available in this environment, so the texture is uploaded unflipped.',
        );
      }
      return image;
    }
    const context = canvas.getContext('2d') as
      | CanvasRenderingContext2D
      | OffscreenCanvasRenderingContext2D
      | null;
    if (!context) return image;

    context.save();
    context.translate(0, texture.height);
    context.scale(1, -1);
    context.drawImage(image as CanvasImageSource, 0, 0, texture.width, texture.height);
    context.restore();
    return canvas as unknown as TexImageSource;
  }

  // --------------------------------------------------------------- mipmaps --

  private createMipmapPipeline(): GPUComputePipeline | null {
    const device = this.device as GPUDevice & { createComputePipeline?: unknown };
    if (typeof device.createComputePipeline !== 'function') return null;
    try {
      const module = this.device.createShaderModule({
        label: 'mini3d.mipmap',
        code: MIP_SHADER_WGSL,
      });
      return this.device.createComputePipeline({
        label: 'mini3d.mipmap',
        layout: 'auto',
        compute: { module, entryPoint: 'main' },
      });
    } catch (error) {
      console.warn('mini3d.WebGPURenderer: mipmap compute pipeline unavailable', error);
      return null;
    }
  }

  /**
   * Box-filters every mip level. One source鈫抎estination pair per level, with a
   * single compute pass for the whole chain.
   */
  private generateMipmaps(record: WgpuTextureRecord): void {
    const pipeline = this.computePipeline;
    if (!pipeline) return;
    const sampler = this.sampler({
      wrapS: 'clamp',
      wrapT: 'clamp',
      magFilter: 'linear',
      minFilter: 'linear',
    });

    const encoder = this.device.createCommandEncoder({ label: 'mini3d.mipmap' });
    const levels = record.texture.mipLevelCount;
    for (let level = 1; level < levels; level++) {
      const srcView = record.texture.createView({
        baseMipLevel: level - 1,
        mipLevelCount: 1,
      });
      const dstView = record.texture.createView({ baseMipLevel: level, mipLevelCount: 1 });
      const bindGroup = this.device.createBindGroup({
        label: `mini3d.mipmap.${level}`,
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: srcView },
          { binding: 1, resource: sampler },
          { binding: 2, resource: dstView },
        ],
      });

      const width = Math.max(1, record.width >> level);
      const height = Math.max(1, record.height >> level);
      const pass = encoder.beginComputePass({ label: `mini3d.mipmap.${level}` });
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      // Each invocation writes a 2x2 block, so one 4x4 workgroup covers 8x8.
      pass.dispatchWorkgroups(Math.ceil(width / 8), Math.ceil(height / 8), 1);
      pass.end();
    }
    this.device.queue.submit([encoder.finish()]);
  }

  // -------------------------------------------------------------- samplers --

  /** Returns a cached sampler for the given configuration. */
  sampler(config: {
    wrapS: WrapMode;
    wrapT: WrapMode;
    magFilter: FilterMode;
    minFilter: FilterMode;
  }): GPUSampler {
    const key = `${config.wrapS}|${config.wrapT}|${config.magFilter}|${config.minFilter}`;
    const cached = this.samplers.get(key);
    if (cached) return cached;

    const sampler = this.device.createSampler({
      label: `mini3d.sampler.${key}`,
      addressModeU: addressMode(config.wrapS),
      addressModeV: addressMode(config.wrapT),
      magFilter: filterMode(config.magFilter),
      minFilter: filterMode(config.minFilter),
      mipmapFilter: mipmapFilterMode(config.minFilter),
    });
    this.samplers.set(key, sampler);
    return sampler;
  }

  /**
   * The sampler a *record* should use. Mipmapped min filters degrade to
   * `'linear'` when the chain could not be built.
   */
  samplerFor(record: WgpuTextureRecord, texture: Texture): GPUSampler {
    const minFilter =
      isMipFilter(texture.minFilter) && !record.hasMipmaps ? 'linear' : texture.minFilter;
    return this.sampler({
      wrapS: texture.wrapS,
      wrapT: texture.wrapT,
      magFilter: texture.magFilter,
      minFilter,
    });
  }

  /** The white 1x1 fallback record. */
  get whiteFallback(): WgpuTextureRecord {
    return this.fallbackWhite;
  }

  /** The (128, 128, 255) normal-map fallback record. */
  get normalFallback(): WgpuTextureRecord {
    return this.fallbackNormal;
  }

  /**
   * Builds (and caches) the bind group for one material's texture set.
   *
   * All eight bindings are always populated: missing maps fall back to the
   * white 1x1 (or the normal fallback in the normal slot).
   */
  bindGroup(slots: WgpuTextureSlots, key: string): GPUBindGroup {
    const diffuse = this.resolve(slots.diffuse, false);
    const normal = this.resolve(slots.normal, slots.normalFallback || slots.normal === null);
    const emissive = this.resolve(slots.emissive, false);
    const ao = this.resolve(slots.ao, false);

    const entries: GPUBindGroupEntry[] = [
      { binding: 0, resource: viewOf(diffuse.record) },
      { binding: 1, resource: diffuse.sampler },
      { binding: 2, resource: viewOf(normal.record) },
      { binding: 3, resource: normal.sampler },
      { binding: 4, resource: viewOf(emissive.record) },
      { binding: 5, resource: emissive.sampler },
      { binding: 6, resource: viewOf(ao.record) },
      { binding: 7, resource: ao.sampler },
    ];

    return this.device.createBindGroup({
      label: `mini3d.textures.${key}`,
      layout: this.groupLayout,
      entries,
    });
  }

  private resolve(
    texture: Texture | null,
    useNormalFallback: boolean,
  ): { record: WgpuTextureRecord; sampler: GPUSampler } {
    if (!texture) {
      return {
        record: useNormalFallback ? this.fallbackNormal : this.fallbackWhite,
        sampler: this.sampler({
          wrapS: 'clamp',
          wrapT: 'clamp',
          magFilter: 'linear',
          minFilter: 'linear',
        }),
      };
    }
    const record = this.upload(texture);
    return { record, sampler: this.samplerFor(record, texture) };
  }

  /** Drops the GPU texture for `texture`, if any. */
  release(texture: Texture): void {
    const record = this.records.get(texture);
    if (!record) return;
    record.texture.destroy();
    this.bytesUsed = Math.max(0, this.bytesUsed - record.bytes);
    this.records.delete(texture);
  }

  get count(): number {
    return this.records.size + 2;
  }

  get bytes(): number {
    return this.bytesUsed;
  }

  dispose(): void {
    for (const texture of Array.from(this.records.keys())) this.release(texture);
    this.records.clear();
    this.samplers.clear();
    this.fallbackWhite.texture.destroy();
    this.fallbackNormal.texture.destroy();
    this.bytesUsed = 0;
  }
}

// ------------------------------------------------------------------ helpers --

/**
 * The default view of a record, created on first use. Views are kept for the
 * lifetime of the texture so repeated binds do not allocate.
 */
export function viewOf(record: WgpuTextureRecord): GPUTextureView {
  if (!record.view) record.view = record.texture.createView();
  return record.view;
}

/** `true` for formats a sampler may filter and a compute pass may read. */
function isFilterable(format: WgpuUploadFormat): boolean {
  return (
    format === 'r8unorm' ||
    format === 'rg8unorm' ||
    format === 'rgba8unorm' ||
    format === 'rgba8unorm-srgb'
  );
}

/**
 * Flips a tightly packed pixel buffer vertically, in place-equivalent fashion.
 * `bytesPerRow` is `width * bytesPerTexel` for mini3d's own textures.
 */
export function flipRows(
  bytes: Uint8Array,
  width: number,
  height: number,
  bytesPerRow: number,
): Uint8Array {
  const flipped = new Uint8Array(bytes.length);
  for (let y = 0; y < height; y++) {
    const sourceStart = y * bytesPerRow;
    const targetStart = (height - 1 - y) * bytesPerRow;
    flipped.set(bytes.subarray(sourceStart, sourceStart + bytesPerRow), targetStart);
  }
  void width;
  return flipped;
}

/** Creates an `OffscreenCanvas` or `<canvas>` of the requested size. */
export function createScratchCanvas(width: number, height: number): OffscreenCanvas | HTMLCanvasElement | null {
  const w = normalizeDimension(width);
  const h = normalizeDimension(height);
  const Offscreen = (globalThis as { OffscreenCanvas?: typeof OffscreenCanvas }).OffscreenCanvas;
  if (typeof Offscreen === 'function') {
    try {
      return new Offscreen(w, h);
    } catch {
      /* fall through to the DOM canvas */
    }
  }
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') return null;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return canvas;
}
