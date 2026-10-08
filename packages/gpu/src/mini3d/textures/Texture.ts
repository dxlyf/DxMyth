import { EventDispatcher } from '../core/EventDispatcher';
import { Matrix3 } from '../math/Matrix3';
import { Vector2 } from '../math/Vector2';
import type {
  ColorSpace,
  FilterMode,
  TextureDataType,
  TextureFormat,
  UnpackAlignment,
  WrapMode,
} from '../constants';

/**
 * Anything the browser APIs accept as a pixel source (`ImageBitmap`,
 * `ImageData`, `HTMLImageElement`, `HTMLCanvasElement`, `HTMLVideoElement`,
 * `OffscreenCanvas`, `VideoFrame`). `null` is allowed so `DataTexture` and
 * not-yet-loaded textures can exist.
 */
export type TextureImage = TexImageSource | null;

export interface TextureEventMap {
  dispose: { target: Texture };
  needsUpdate: { target: Texture };
}

export interface TextureMipmap {
  data: ArrayBufferView;
  width: number;
  height: number;
}

/**
 * A GPU-samplable image plus the sampler state and the UV transform used by
 * every built-in shader (`uvTransform` uniform, fed from `matrix`).
 *
 * Field names and defaults mirror three.js. The defaults are
 * `wrapS/wrapT = 'clamp'`, `magFilter = 'linear'`,
 * `minFilter = 'linear-mipmap-linear'`, `generateMipmaps = true`,
 * `flipY = true`, `unpackAlignment = 4`.
 */
export class Texture extends EventDispatcher<TextureEventMap> {
  readonly isTexture = true;
  /** Set on `DataTexture`; lets backends branch without `instanceof`. */
  readonly isDataTexture: boolean = false;
  /** Set on `CanvasTexture`; lets backends branch without `instanceof`. */
  readonly isCanvasTexture: boolean = false;

  /** Auto-incrementing process-unique id. */
  readonly id: number;
  /** Random string; stable across a session. */
  uuid: string;
  name = '';

  /** Source pixels; `null` for `DataTexture` and unloaded textures. */
  image: TextureImage = null;

  /** Native mip levels supplied by the caller (empty = generate them). */
  mipmaps: TextureMipmap[] = [];

  width: number;
  height: number;

  wrapS: WrapMode = Texture.DEFAULT_WRAP;
  wrapT: WrapMode = Texture.DEFAULT_WRAP;
  magFilter: FilterMode = Texture.DEFAULT_MAG_FILTER;
  minFilter: FilterMode = Texture.DEFAULT_MIN_FILTER;

  format: TextureFormat = 'rgba';
  type: TextureDataType = 'uint8';

  generateMipmaps = true;
  flipY = true;
  anisotropy: number = Texture.DEFAULT_ANISOTROPY;
  colorSpace: ColorSpace = Texture.DEFAULT_COLOR_SPACE;
  premultiplyAlpha = false;
  unpackAlignment: UnpackAlignment = 4;

  /** Bumped by the `needsUpdate` setter; backends re-upload when it changes. */
  version = 0;

  /** UV transform derived from `offset`/`repeat`/`center`/`rotation`. */
  readonly matrix: Matrix3 = new Matrix3();
  offset: Vector2 = new Vector2(0, 0);
  repeat: Vector2 = new Vector2(1, 1);
  center: Vector2 = new Vector2(0, 0);
  rotation = 0;

  userData: Record<string, unknown> = {};

  private static nextId = 1;

  static readonly DEFAULT_IMAGE: TextureImage = null;
  static readonly DEFAULT_WRAP: WrapMode = 'clamp';
  static readonly DEFAULT_MAG_FILTER: FilterMode = 'linear';
  static readonly DEFAULT_MIN_FILTER: FilterMode = 'linear-mipmap-linear';
  static readonly DEFAULT_ANISOTROPY = 1;
  static readonly DEFAULT_COLOR_SPACE: ColorSpace = 'srgb';

  constructor(
    image: TextureImage = Texture.DEFAULT_IMAGE,
    options: {
      width?: number;
      height?: number;
      format?: TextureFormat;
      type?: TextureDataType;
      colorSpace?: ColorSpace;
    } = {},
  ) {
    super();
    this.id = Texture.nextId++;
    this.uuid = generateUuid();
    this.image = image;
    this.width = options.width ?? 1;
    this.height = options.height ?? 1;
    if (options.format !== undefined) this.format = options.format;
    if (options.type !== undefined) this.type = options.type;
    if (options.colorSpace !== undefined) this.colorSpace = options.colorSpace;
    this.updateMatrix();
  }

  /**
   * Setting `true` bumps `version` and dispatches `needsUpdate` so backends
   * can re-upload lazily.
   */
  set needsUpdate(value: boolean) {
    if (!value) return;
    this.version++;
    this.dispatchEvent('needsUpdate', { target: this });
  }

  /** True when `minFilter` needs a mip chain. */
  get useMipmaps(): boolean {
    return this.minFilter.includes('mipmap');
  }

  /** Recomputed from `offset`, `repeat`, `center` and `rotation`. */
  updateMatrix(): this {
    this.matrix.setUvTransform(
      this.offset.x,
      this.offset.y,
      this.repeat.x,
      this.repeat.y,
      this.rotation,
      this.center.x,
      this.center.y,
    );
    return this;
  }

  /** Copies every field of `source` onto `this` (does not touch the GPU). */
  copy(source: Texture): this {
    this.name = source.name;
    this.image = source.image;
    this.mipmaps = source.mipmaps.map((m) => ({ ...m }));
    this.width = source.width;
    this.height = source.height;
    this.wrapS = source.wrapS;
    this.wrapT = source.wrapT;
    this.magFilter = source.magFilter;
    this.minFilter = source.minFilter;
    this.format = source.format;
    this.type = source.type;
    this.generateMipmaps = source.generateMipmaps;
    this.flipY = source.flipY;
    this.anisotropy = source.anisotropy;
    this.colorSpace = source.colorSpace;
    this.premultiplyAlpha = source.premultiplyAlpha;
    this.unpackAlignment = source.unpackAlignment;
    this.offset.copy(source.offset);
    this.repeat.copy(source.repeat);
    this.center.copy(source.center);
    this.rotation = source.rotation;
    this.userData = { ...source.userData };
    this.updateMatrix();
    this.version = 0;
    return this;
  }

  clone(): Texture {
    return new Texture().copy(this);
  }

  dispose(): void {
    this.dispatchEvent('dispose', { target: this });
  }

  toJSON(): Record<string, unknown> {
    return {
      metadata: { generator: 'mini3d.Texture', version: 1 },
      name: this.name,
      width: this.width,
      height: this.height,
      wrapS: this.wrapS,
      wrapT: this.wrapT,
      magFilter: this.magFilter,
      minFilter: this.minFilter,
      format: this.format,
      type: this.type,
      colorSpace: this.colorSpace,
      generateMipmaps: this.generateMipmaps,
      flipY: this.flipY,
    };
  }
}

let uuidCounter = 0;

function generateUuid(): string {
  uuidCounter++;
  const a = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0');
  return `texture-${uuidCounter.toString(16)}-${a}`;
}
