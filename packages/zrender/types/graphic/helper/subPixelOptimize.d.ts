import { PathStyleProps } from '../Path';
type LineShape = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};
type RectShape = {
    x: number;
    y: number;
    width: number;
    height: number;
    r?: number | number[];
};
/**
 * Sub pixel optimize line for canvas
 *
 * @param outputShape The modification will be performed on `outputShape`.
 *                 `outputShape` and `inputShape` can be the same object.
 *                 `outputShape` object can be used repeatly, because all of
 *                 the `x1`, `x2`, `y1`, `y2` will be assigned in this method.
 */
export declare function subPixelOptimizeLine(outputShape: Partial<LineShape>, inputShape: LineShape, style: Pick<PathStyleProps, 'lineWidth'>): LineShape;
/**
 * Sub pixel optimize rect for canvas
 *
 * @param outputShape The modification will be performed on `outputShape`.
 *                 `outputShape` and `inputShape` can be the same object.
 *                 `outputShape` object can be used repeatly, because all of
 *                 the `x`, `y`, `width`, `height` will be assigned in this method.
 */
export declare function subPixelOptimizeRect(outputShape: Partial<RectShape>, inputShape: RectShape, style: Pick<PathStyleProps, 'lineWidth'>): RectShape;
/**
 * Sub pixel optimize for canvas
 *
 * @param position Coordinate, such as x, y
 * @param lineWidth If `null`/`undefined`/`0`, do not optimize.
 * @param positiveOrNegative Default false (negative).
 * @return Optimized position.
 */
export declare function subPixelOptimize(position: number, lineWidth?: number, positiveOrNegative?: boolean): number;
export {};
