import { default as BoundingRect } from './BoundingRect';
interface ExtendedCanvasRenderingContext2D extends CanvasRenderingContext2D {
    dpr?: number;
}
/**
 * Normalize start and end angles.
 * startAngle will be normalized to 0 ~ PI*2
 * sweepAngle(endAngle - startAngle) will be normalized to 0 ~ PI*2 if clockwise.
 * -PI*2 ~ 0 if anticlockwise.
 */
export declare function normalizeArcAngles(angles: number[], anticlockwise: boolean): void;
export default class PathProxy {
    dpr: number;
    data: number[] | Float32Array;
    /**
     * Version is for tracking if the path has been changed.
     */
    private _version;
    /**
     * If save path data.
     */
    private _saveData;
    /**
     * If the line segment is too small to draw. It will be added to the pending pt.
     * It will be added if the subpath needs to be finished before stroke, fill, or starting a new subpath.
     */
    private _pendingPtX;
    private _pendingPtY;
    private _pendingPtDist;
    private _ctx;
    private _xi;
    private _yi;
    private _x0;
    private _y0;
    private _len;
    private _pathSegLen;
    private _pathLen;
    private _ux;
    private _uy;
    static CMD: {
        M: number;
        L: number;
        C: number;
        Q: number;
        A: number;
        Z: number;
        R: number;
    };
    constructor(notSaveData?: boolean);
    increaseVersion(): void;
    /**
     * Version can be used outside for compare if the path is changed.
     * For example to determine if need to update svg d str in svg renderer.
     */
    getVersion(): number;
    /**
     * @readOnly
     */
    setScale(sx: number, sy: number, segmentIgnoreThreshold?: number): void;
    setDPR(dpr: number): void;
    setContext(ctx: ExtendedCanvasRenderingContext2D): void;
    getContext(): ExtendedCanvasRenderingContext2D;
    beginPath(): this;
    /**
     * Reset path data.
     */
    reset(): void;
    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    bezierCurveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): this;
    quadraticCurveTo(x1: number, y1: number, x2: number, y2: number): this;
    arc(cx: number, cy: number, r: number, startAngle: number, endAngle: number, anticlockwise?: boolean): this;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): this;
    rect(x: number, y: number, w: number, h: number): this;
    closePath(): this;
    fill(ctx: CanvasRenderingContext2D): void;
    stroke(ctx: CanvasRenderingContext2D): void;
    len(): number;
    setData(data: Float32Array | number[]): void;
    appendPath(path: PathProxy | PathProxy[]): void;
    /**
     * 填充 Path 数据。
     * 尽量复用而不申明新的数组。大部分图形重绘的指令数据长度都是不变的。
     */
    addData(cmd: number, a?: number, b?: number, c?: number, d?: number, e?: number, f?: number, g?: number, h?: number): void;
    private _drawPendingPt;
    private _expandData;
    /**
     * Convert dynamic array to static Float32Array
     *
     * It will still use a normal array if command buffer length is less than 10
     * Because Float32Array itself may take more memory than a normal array.
     *
     * 10 length will make sure at least one M command and one A(arc) command.
     */
    toStatic(): void;
    getBoundingRect(): BoundingRect;
    private _calculateLength;
    /**
     * Rebuild path from current data
     * Rebuild path will not consider javascript implemented line dash.
     * @param {CanvasRenderingContext2D} ctx
     */
    rebuildPath(ctx: PathRebuilder, percent: number): void;
    clone(): PathProxy;
    canSave(): boolean;
    private static initDefaultProps;
}
export interface PathRebuilder {
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    bezierCurveTo(x: number, y: number, x2: number, y2: number, x3: number, y3: number): void;
    quadraticCurveTo(x: number, y: number, x2: number, y2: number): void;
    arc(cx: number, cy: number, r: number, startAngle: number, endAngle: number, anticlockwise: boolean): void;
    ellipse(cx: number, cy: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise: boolean): void;
    rect(x: number, y: number, width: number, height: number): void;
    closePath(): void;
}
export {};
