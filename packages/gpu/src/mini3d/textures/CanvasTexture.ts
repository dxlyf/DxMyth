import { Texture } from './Texture';
import type { TextureDataType, TextureFormat } from '../constants';

/**
 * A texture backed by a `<canvas>` (or any `HTMLCanvasElement`). `width` and
 * `height` are taken from the canvas and the texture is flagged dirty so the
 * next render uploads it.
 *
 * ```ts
 * const canvas = document.createElement('canvas');
 * const texture = new CanvasTexture(canvas);
 * // after drawing into the canvas again:
 * texture.needsUpdate = true;
 * ```
 */
export class CanvasTexture extends Texture {
  override readonly isCanvasTexture = true;

  constructor(
    canvas: HTMLCanvasElement,
    format: TextureFormat = 'rgba',
    type: TextureDataType = 'uint8',
  ) {
    super(canvas, {
      width: canvas.width,
      height: canvas.height,
      format,
      type,
      colorSpace: 'srgb',
    });
    this.needsUpdate = true;
  }

  override clone(): CanvasTexture {
    const image = this.image as { width?: number; height?: number } | null;
    if (image === null || typeof image.width !== 'number' || typeof image.height !== 'number') {
      throw new Error(
        'mini3d.CanvasTexture: cannot clone a CanvasTexture whose image is not a canvas',
      );
    }
    return new CanvasTexture(image as unknown as HTMLCanvasElement, this.format, this.type).copy(this);
  }
}
