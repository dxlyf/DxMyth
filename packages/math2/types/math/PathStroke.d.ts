import { PathBuilder } from './PathBuilder';
import { Point } from './Point';
/**
 * 路径描边轮廓生成。
 *
 * 将一条任意路径（含 lineTo / quadTo / cubicTo / close）展开成一条闭合的填充轮廓，
 * 等价于把 CanvasRenderingContext2D.stroke() 的几何结果作为可 fill 的路径。
 *
 * 整体流程（参见 Skia PathStroker）：
 *   1. 把贝塞尔段 flatten 为折线，得到若干子路径（subPath）；
 *   2. 逐段计算单位法向量（prevUnitNormal / afterUnitNormal）；
 *   3. 在每个拐点用 joiner（miter / round / bevel）连接前后两段的外侧/内侧偏移点；
 *   4. 在子路径的起止两端用 capper（butt / round / square）封口；
 *   5. 外侧正向走完 → end cap → 内侧反向回走 → start cap → closePath。
 *
 * 关键约定（屏幕坐标系，Y 轴向下）：
 *   - 单位法向量 = 切线顺时针旋转 90° 后再取反，指向线段"左侧"；
 *   - 法向量乘以 radius 即得外侧偏移点，取反得内侧偏移点；
 *   - radius = lineWidth / 2。
 */
export declare enum LineJoin {
    Miter = "miter",
    Round = "round",
    Bevel = "bevel"
}
export declare enum LineCap {
    Butt = "butt",
    Round = "round",
    Square = "square"
}
export type StrokeOptions = {
    lineWidth?: number;
    lineJoin?: LineJoin;
    lineCap?: LineCap;
    miterLimit?: number;
    scale?: number;
};
type CapProc = (pivot: Point, // 上一个点
normal: Point, stop: Point, otherPath: PathBuilder | null, path: PathBuilder) => void;
type JoinProc = (beforeUnitNormal: Point, //l0->l1 线段的，旋转-90度的单位法向量
pivot: Point, // 上一个lineTo点
afterUnitNormal: Point, // l1->l2 线段的，旋转-90度的单位法向量
radius: number, // 线段宽的一半
invMiterLimit: number, // 1/miter_limit   
prevIsLine: boolean, // 上一个绘制命令是否是lineTo
currIsLine: boolean, // 当前绘制命令是否是lineTo
builders: SwappableBuilders) => void;
declare class SwappableBuilders {
    inner: PathBuilder;
    outer: PathBuilder;
    constructor(inner: PathBuilder, outer: PathBuilder);
    swap(): this;
}
export declare class PathStroke {
    static default(): PathStroke;
    radius: number;
    lineJoin: LineJoin;
    lineCap: LineCap;
    miterLimit: number;
    invertMiterLimit: number;
    outer: PathBuilder;
    inner: PathBuilder;
    segmentCount: number;
    resScale: number;
    invResScale: number;
    firstPoint: Point;
    firstUnitNormal: Point;
    firstNormal: Point;
    prevPoint: Point;
    prevUnitNormal: Point;
    prevNormal: Point;
    prevIsLine: boolean;
    firstOuterPoint: Point;
    capper: CapProc;
    joiner: JoinProc;
    stroke(path: PathBuilder, options: StrokeOptions): PathBuilder;
    _stroke(path: PathBuilder): PathBuilder;
    close(isLine: boolean): void;
    moveTo(p: Point): void;
    lineTo(p: Point): void;
    quadTo(p0: Point, p1: Point): void;
    cubicTo(p0: Point, p1: Point, p2: Point): void;
    /**
     * 核心线段处理。
     * @param p            本段终点
     * @param currentIsLine 本段是否为 lineTo（曲线展平段也按 line 处理）
     * @param runJoin      是否在拐点执行 joiner。
     *                     真实段边界（lineTo↔lineTo、lineTo↔曲线起点）为 true；
     *                     曲线展平后的内部线段为 false，仅直接延伸内外侧偏移折线，
     *                     避免 handleInnerJoin 在平滑曲线上密集下探 pivot 产生小三角。
     * @returns 是否实际写入了该段（零长段返回 false）
     */
    private lineToCore;
    finishContour(close: boolean, currIsLine: boolean): void;
    finish(currIsLine: boolean): PathBuilder;
}
export {};
