import { Vector2Like } from '../../Vector2';
export type TProjectStrokeOnPointsOptions = {
    strokeWidth: number;
    strokeLineCap: CanvasLineCap;
    strokeLineJoin: CanvasLineJoin;
    /**
     * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-miterlimit
     */
    strokeMiterLimit: number;
    strokeUniform: boolean;
    scaleX: number;
    scaleY: number;
    skewX: number;
    skewY: number;
};
export type TProjection = {
    projectedPoint: Vector2Like;
    originPoint: Vector2Like;
    angle?: number;
    bisector?: Vector2Like;
};
