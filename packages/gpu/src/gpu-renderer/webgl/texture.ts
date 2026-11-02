import { GLCapabilityError, GLError, GLResourceError } from './errors.js';
import {
  GLENUM,
  filterToGL,
  wrapToGL,
  type GL,
  type GLFilter,
  type GLTextureFormat,
  type GLWrap,
} from './enums.js';
import type { GLCapabilities } from './caps.js';
import { getFormatInfo, isPowerOfTwo, type GLFormatInfo } from './formats.js';
import type { GLState } from './state.js';
import type { GLStatsTracker } from './stats.js';

export type TextureSource = TexImageSource | ArrayBufferView;

export interface TextureParameters {
  minFilter?: GLFilter;
  magFilter?: GLFilter;
  wrapS?: GLWrap;
  wrapT?: GLWrap;
  anisotropy?: number;
}

export interface TextureDescriptor extends TextureParameters {
  label?: string;
  width: number;
  height: number;
  format?: GLTextureFormat;
  mipmaps?: boolean;
  data?: TextureSource | null;
  /** DOM/bitmap sources default to true (upright); typed arrays default to false. */
  flipY?: boolean;
  premultiplyAlpha?: boolean;
  usage?: { sample?: boolean; render?: boolean };
}

function isView(source: TextureSource): source is ArrayBufferView {
  return ArrayBuffer.isView(source);
}

function sourceSize(source: TexImageSource): { width: number; height: number } {
  if ('displayWidth' in source && typeof source.displayWidth === 'number') {
    return { width: source.displayWidth, height: source.displayHeight };
  }
  if ('width' in source && 'height' in source) {
    return { width: Number(source.width), height: Number(source.height) };
  }
  return { width: 0, height: 0 };
}

export class GLTexture {
  readonly label: string;
  readonly handle: WebGLTexture;
  readonly width: number;
  readonly height: number;
  readonly format: GLTextureFormat;
  readonly info: GLFormatInfo;

  private readonly gl: GL;
  private readonly version: 1 | 2;
  private readonly caps: GLCapabilities;
  private readonly state: GLState;
  private readonly stats: GLStatsTracker;
  private readonly levels: number;
  private readonly immutable: boolean;
  private readonly params = new Map<number, number>();
  private destroyedFlag = false;

  constructor(
    gl: GL,
    version: 1 | 2,
    caps: GLCapabilities,
    state: GLState,
    stats: GLStatsTracker,
    desc: TextureDescriptor,
  ) {
    this.gl = gl;
    this.version = version;
    this.caps = caps;
    this.state = state;
    this.stats = stats;
    this.label = desc.label ?? 'texture';
    this.width = desc.width;
    this.height = desc.height;
    this.format = desc.format ?? 'rgba8';

    if (!Number.isInteger(desc.width) || desc.width <= 0 || !Number.isInteger(desc.height) || desc.height <= 0) {
      throw new GLError('webgl/texture', `invalid size ${desc.width}x${desc.height} for "${this.label}"`);
    }

    this.info = getFormatInfo(gl, version, caps, this.format);
    if (version === 1 && desc.mipmaps && (!isPowerOfTwo(desc.width) || !isPowerOfTwo(desc.height))) {
      throw new GLCapabilityError(
        'mipmaps',
        `WebGL1 requires power-of-two sizes for mipmaps ("${this.label}" is ${desc.width}x${desc.height})`,
      );
    }

    const handle = gl.createTexture();
    if (!handle) throw new GLError('webgl/texture', `unable to create texture "${this.label}"`);
    this.handle = handle;

    this.levels = desc.mipmaps ? Math.floor(Math.log2(Math.max(desc.width, desc.height))) + 1 : 1;
    this.immutable = version === 2 && !desc.data;

    state.bindTexture(0, handle);
    this.setParameters({
      minFilter: desc.minFilter ?? (desc.mipmaps ? 'linear-mipmap-linear' : 'linear'),
      magFilter: desc.magFilter ?? 'linear',
      wrapS: desc.wrapS ?? 'clamp-to-edge',
      wrapT: desc.wrapT ?? 'clamp-to-edge',
      ...(desc.anisotropy !== undefined ? { anisotropy: desc.anisotropy } : {}),
    });

    if (desc.data) {
      this.upload(desc.data, {
        ...(desc.flipY !== undefined ? { flipY: desc.flipY } : {}),
        ...(desc.premultiplyAlpha !== undefined ? { premultiplyAlpha: desc.premultiplyAlpha } : {}),
      });
      if (desc.mipmaps) this.generateMipmaps();
    } else if (version === 2) {
      (gl as WebGL2RenderingContext).texStorage2D(GLENUM.TEXTURE_2D, this.levels, this.info.internalFormat, desc.width, desc.height);
      this.stats.textureUploads += desc.width * desc.height * this.info.bytesPerPixel;
    } else {
      gl.texImage2D(
        GLENUM.TEXTURE_2D,
        0,
        this.info.internalFormat,
        desc.width,
        desc.height,
        0,
        this.info.format,
        this.info.type,
        null,
      );
      this.stats.textureUploads += desc.width * desc.height * this.info.bytesPerPixel;
    }
  }

  get destroyed(): boolean {
    return this.destroyedFlag;
  }

  ensureAlive(): void {
    if (this.destroyedFlag) throw new GLResourceError(this.label, 'destroyed');
  }

  generateMipmaps(): void {
    this.ensureAlive();
    if (this.version === 1 && (!isPowerOfTwo(this.width) || !isPowerOfTwo(this.height))) {
      throw new GLCapabilityError(
        'mipmaps',
        `WebGL1 requires power-of-two sizes to generate mipmaps ("${this.label}")`,
      );
    }
    this.state.bindTexture(0, this.handle);
    this.gl.generateMipmap(GLENUM.TEXTURE_2D);
  }

  upload(
    source: TextureSource,
    options: { level?: number; flipY?: boolean; premultiplyAlpha?: boolean } = {},
  ): void {
    this.ensureAlive();
    const level = options.level ?? 0;
    if (level < 0 || level >= this.levels) {
      throw new GLError('webgl/texture', `mip level ${level} is outside [0, ${this.levels}) for "${this.label}"`);
    }
    this.state.bindTexture(0, this.handle);
    const flipY = options.flipY ?? !isView(source);
    this.state.setUnpack(flipY, options.premultiplyAlpha ?? false, 1);

    if (isView(source)) {
      if (this.immutable) {
        this.gl.texSubImage2D(
          GLENUM.TEXTURE_2D,
          level,
          0,
          0,
          this.width,
          this.height,
          this.info.format,
          this.info.type,
          source,
        );
      } else {
        this.gl.texImage2D(
          GLENUM.TEXTURE_2D,
          level,
          this.info.internalFormat,
          this.width,
          this.height,
          0,
          this.info.format,
          this.info.type,
          source,
        );
      }
    } else {
      const size = sourceSize(source);
      if (size.width > 0 && (size.width !== this.width || size.height !== this.height)) {
        throw new GLError(
          'webgl/texture',
          `source is ${size.width}x${size.height} but "${this.label}" is ${this.width}x${this.height}`,
        );
      }
      if (this.immutable) {
        this.gl.texSubImage2D(
          GLENUM.TEXTURE_2D,
          level,
          0,
          0,
          this.info.format,
          this.info.type,
          source,
        );
      } else {
        this.gl.texImage2D(
          GLENUM.TEXTURE_2D,
          level,
          this.info.internalFormat,
          this.info.format,
          this.info.type,
          source,
        );
      }
    }
    this.stats.textureUploads += this.width * this.height * this.info.bytesPerPixel;
  }

  setParameters(params: TextureParameters): void {
    this.ensureAlive();
    this.state.bindTexture(0, this.handle);
    this.apply(GLENUM.TEXTURE_MIN_FILTER, params.minFilter ? filterToGL(params.minFilter) : undefined);
    this.apply(GLENUM.TEXTURE_MAG_FILTER, params.magFilter ? filterToGL(params.magFilter) : undefined);
    this.apply(GLENUM.TEXTURE_WRAP_S, params.wrapS ? wrapToGL(params.wrapS) : undefined);
    this.apply(GLENUM.TEXTURE_WRAP_T, params.wrapT ? wrapToGL(params.wrapT) : undefined);

    if (params.anisotropy !== undefined) {
      const ext = this.caps.extension<{ MAX_TEXTURE_MAX_ANISOTROPY_EXT: number }>(
        'EXT_texture_filter_anisotropic',
      );
      if (!ext) {
        throw new GLCapabilityError('anisotropy', 'anisotropic filtering needs EXT_texture_filter_anisotropic');
      }
      const max = Number(this.gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT) ?? 1);
      this.apply(GLENUM.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(params.anisotropy, max));
    }
  }

  private apply(parameter: number, value: number | undefined): void {
    if (value === undefined) return;
    if (this.params.get(parameter) === value) return;
    this.gl.texParameteri(GLENUM.TEXTURE_2D, parameter, value);
    this.params.set(parameter, value);
  }

  destroy(): void {
    if (this.destroyedFlag) return;
    this.state.forgetTexture(this.handle);
    this.gl.deleteTexture(this.handle);
    this.destroyedFlag = true;
  }
}
