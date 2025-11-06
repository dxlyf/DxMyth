import { Canvas } from '../canvas/Canvas';
import { PencilBrush } from './PencilBrush';
import { TSimplePathData } from '../util/path/typedefs';
export declare class PatternBrush extends PencilBrush {
    source?: CanvasImageSource;
    constructor(canvas: Canvas);
    getPatternSrc(): HTMLCanvasElement;
    /**
     * Creates "pattern" instance property
     * @param {CanvasRenderingContext2D} ctx
     */
    getPattern(ctx: CanvasRenderingContext2D): CanvasPattern;
    /**
     * Sets brush styles
     * @param {CanvasRenderingContext2D} ctx
     */
    _setBrushStyles(ctx: CanvasRenderingContext2D): void;
    /**
     * Creates path
     */
    createPath(pathData: TSimplePathData): import('../..').Path<Partial<import('../..').PathProps>, import('../..').SerializedPathProps, import('../EventTypeDefs').ObjectEvents>;
}
