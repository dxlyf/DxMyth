import { Texture } from './Texture';
import type { TextureDataType, TextureFormat } from '../constants';

/**
 * A texture whose pixels come straight from a typed array instead of an
 * image element. `image` stays `null`; the raw buffer lives in `data`.
 *
 * Defaults follow three.js's `DataTexture`: mipmaps are disabled, `flipY` is
 * off, `unpackAlignment` is 1 and the colour space is `'linear'` (raw data is
 * not sRGB-encoded).
 *
 * ```ts
 * const noise = new DataTexture(new Uint8Array([255, 128, 0, 255]), 1, 1);
 * ```
 */
export class DataTexture extends Texture {
  override readonly isDataTexture = true;

  /** Raw pixel data, `width * height * channels` entries of `type`. */
  data: ArrayBufferView;

  /** Bytes per row-aligned pixel; `width` when the buffer is tightly packed. */
  unpackRowLength = 0;

  constructor(
    data: ArrayBufferView,
    width: number,
    height: number,
    format: TextureFormat = 'rgba',
    type: TextureDataType = 'uint8',
  ) {
    super(null, { width, height, format, type, colorSpace: 'linear' });
    if (!ArrayBuffer.isView(data)) {
      throw new TypeError('mini3d.DataTexture: `data` must be a typed array');
    }
    this.data = data;
    this.generateMipmaps = false;
    this.flipY = false;
    this.unpackAlignment = 1;
    this.needsUpdate = true;
  }

  override copy(source: DataTexture): this {
    super.copy(source);
    this.data = source.data;
    this.unpackRowLength = source.unpackRowLength;
    return this;
  }

  override clone(): DataTexture {
    return new DataTexture(
      this.data,
      this.width,
      this.height,
      this.format,
      this.type,
    ).copy(this);
  }
}
