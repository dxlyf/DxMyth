import { ImagePatternObject } from '../graphic/Pattern';
import { default as CanvasPainter } from './Painter';
import { GradientObject } from '../graphic/Gradient';
import { default as Eventful } from '../core/Eventful';
import { ElementEventCallback } from '../Element';
import { default as Displayable } from '../graphic/Displayable';
import { default as BoundingRect } from '../core/BoundingRect';
export interface LayerConfig {
    clearColor?: string | GradientObject | ImagePatternObject;
    motionBlur?: boolean;
    lastFrameAlpha?: number;
}
export default class Layer extends Eventful {
    id: string;
    dom: HTMLCanvasElement;
    domBack: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    ctxBack: CanvasRenderingContext2D;
    painter: CanvasPainter;
    /**
     * 每次清空画布的颜色
     */
    clearColor: string | GradientObject | ImagePatternObject;
    /**
     * 是否开启动态模糊
     */
    motionBlur: boolean;
    /**
     * 在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显
     */
    lastFrameAlpha: number;
    /**
     * Layer dpr
     */
    dpr: number;
    /**
     * Virtual layer will not be inserted into dom.
     */
    virtual: boolean;
    config: {};
    incremental: boolean;
    zlevel: number;
    maxRepaintRectCount: number;
    private _paintRects;
    __dirty: boolean;
    __firstTimePaint: boolean;
    __used: boolean;
    __drawIndex: number;
    __startIndex: number;
    __endIndex: number;
    __prevStartIndex: number;
    __prevEndIndex: number;
    __builtin__: boolean;
    constructor(id: string | HTMLCanvasElement, painter: CanvasPainter, dpr?: number);
    getElementCount(): number;
    afterBrush(): void;
    initContext(): void;
    setUnpainted(): void;
    createBackBuffer(): void;
    /**
     * Create repaint list when using dirty rect rendering.
     *
     * @param displayList current rendering list
     * @param prevList last frame rendering list
     * @return repaint rects. null for the first frame, [] for no element dirty
     */
    createRepaintRects(displayList: Displayable[], prevList: Displayable[], viewWidth: number, viewHeight: number): BoundingRect[];
    /**
     * Get paint rects for debug usage.
     */
    debugGetPaintRects(): BoundingRect[];
    resize(width: number, height: number): void;
    /**
     * 清空该层画布
     */
    clear(clearAll?: boolean, clearColor?: string | GradientObject | ImagePatternObject, repaintRects?: BoundingRect[]): void;
    refresh: (clearColor?: string | GradientObject | ImagePatternObject) => void;
    renderToCanvas: (ctx: CanvasRenderingContext2D) => void;
    onclick: ElementEventCallback<unknown, this>;
    ondblclick: ElementEventCallback<unknown, this>;
    onmouseover: ElementEventCallback<unknown, this>;
    onmouseout: ElementEventCallback<unknown, this>;
    onmousemove: ElementEventCallback<unknown, this>;
    onmousewheel: ElementEventCallback<unknown, this>;
    onmousedown: ElementEventCallback<unknown, this>;
    onmouseup: ElementEventCallback<unknown, this>;
    oncontextmenu: ElementEventCallback<unknown, this>;
    ondrag: ElementEventCallback<unknown, this>;
    ondragstart: ElementEventCallback<unknown, this>;
    ondragend: ElementEventCallback<unknown, this>;
    ondragenter: ElementEventCallback<unknown, this>;
    ondragleave: ElementEventCallback<unknown, this>;
    ondragover: ElementEventCallback<unknown, this>;
    ondrop: ElementEventCallback<unknown, this>;
}
