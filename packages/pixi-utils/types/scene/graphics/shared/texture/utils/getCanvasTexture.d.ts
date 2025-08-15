import { CanvasSource, CanvasSourceOptions } from '../sources/CanvasSource';
import { Texture } from '../Texture';
import { ICanvas } from '../../../../../environment/canvas/ICanvas';
/**
 * @param canvas
 * @param options
 * @internal
 */
export declare function getCanvasTexture(canvas: ICanvas, options?: CanvasSourceOptions): Texture<CanvasSource>;
/**
 * @param canvas
 * @internal
 */
export declare function hasCachedCanvasTexture(canvas: ICanvas): boolean;
