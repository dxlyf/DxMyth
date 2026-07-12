import { Vector2Like as PointLike } from './Vector2';
import { BoundingRect } from './BoundingRect';
import { Matrix2DLike } from './Matrix2D';
export declare enum PathVerb {
    MoveTo = 1,
    LineTo = 2,
    QuadraticTo = 4,
    CubicTo = 8,
    Close = 16
}
export declare const PathSegmentType: {
    Arc: number;
    Rect: number;
    Ellipse: number;
    RoundRect: number;
};
export declare const PathVerbCount: {
    1: number;
    2: number;
    4: number;
    8: number;
    16: number;
};
export declare enum PathCmd {
    M = "M",// 移动到
    L = "L",// 直线
    Q = "Q",// 二次贝塞尔曲线
    C = "C",// 三次贝塞尔曲线
    Z = "Z",// 关闭路径
    A = "A",// 圆弧线
    R = "R",// 矩形
    E = "E",// 椭圆
    RR = "RR"
}
type PathVisitCallbacks = {
    moveTo?: (point: PointLike) => void;
    lineTo?: (start: PointLike, end: PointLike) => void;
    quadraticCurveTo?: (p0: PointLike, p1: PointLike, p2: PointLike) => void;
    cubicCurveTo?: (p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike) => void;
    close?: (lastPoint: PointLike, movePoint: PointLike) => void;
};
export declare enum PathDirection {
    CW = 0,
    CCW = 1,
    Unknown = 2147483647
}
export declare class PathBuilder {
    static fromSvgPath(svgPath: string): PathBuilder;
    static default(): PathBuilder;
    cmds: [number | string, ...any[]][];
    verbs: PathVerb[];
    points: PointLike[];
    lastMoveIndex: number;
    needMoveTo: boolean;
    segmentType: number;
    /** 包围盒缓存（null 表示未计算或路径为空） */
    private _bounds;
    /** 紧凑包围盒缓存（null 表示未计算或路径为空） */
    private _tightBounds;
    /** 包围盒是否需要重新计算 */
    private _boundsDirty;
    private _tightBoundsDirty;
    /**路径发生变变化 */
    drity: boolean;
    constructor(path?: PathBuilder | string);
    get lastVerb(): PathVerb;
    get lastPoint(): PointLike;
    get lastMovePoint(): PointLike;
    get size(): number;
    clone(): PathBuilder;
    copy(path: PathBuilder): void;
    reset(): void;
    markDirty(): void;
    transform(matrix: Matrix2DLike): void;
    addPath(path: PathBuilder, matrix?: Matrix2DLike): void;
    addReversePath(path: PathBuilder): void;
    reversePathTo(other: PathBuilder): void;
    offset(x: number, y: number): void;
    get isEmpty(): boolean;
    ensureMove(): void;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    quadraticCurveTo(cpX: number, cpY: number, x: number, y: number): void;
    bezierCurveTo(cpX1: number, cpY1: number, cpX2: number, cpY2: number, x: number, y: number): void;
    conicTo(cpX: number, cpY: number, x: number, y: number, weight: number): void;
    conicToQuad(cpX: number, cpY: number, x: number, y: number, weight: number): void;
    rect(x: number, y: number, width: number, height: number): void;
    /**
     * 添加圆弧路径
     *
     * 将圆弧分成最多 90° 一段，每段用三次贝塞尔曲线近似。
     * 近似公式：k = 4/3 * tan(θ/4)，控制点沿切线方向偏移 k * radius。
     *
     * @param x - 圆心 X
     * @param y - 圆心 Y
     * @param radius - 半径
     * @param startAngle - 起始角度（弧度）
     * @param endAngle - 结束角度（弧度）
     * @param counterclockwise - 是否逆时针（默认顺时针）
     */
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    /**
     * 添加椭圆路径
     *
     * 参数化：E(t) = center + R(rotation) * (rx·cos(t), ry·sin(t))
     * 每段用三次贝塞尔曲线近似，控制点沿切线方向偏移。
     *
     * @param x - 椭圆中心 X
     * @param y - 椭圆中心 Y
     * @param radiusX - X 轴半径
     * @param radiusY - Y 轴半径
     * @param rotation - 旋转角度（弧度）
     * @param startAngle - 起始角度（弧度）
     * @param endAngle - 结束角度（弧度）
     * @param counterclockwise - 是否逆时针（默认顺时针）
     */
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    /**
     * 添加圆弧连接（arcTo）
     *
     * 从当前点到 (x1, y1) 的线段与 (x1, y1) 到 (x2, y2) 的线段之间，
     * 绘制一个半径为 radius 的圆弧（与两条线段相切）。
     * 如果当前点与 (x1, y1) 不重合，会先画一条 lineTo 到切点。
     *
     * @param x1 - 第一条切线的终点 X
     * @param y1 - 第一条切线的终点 Y
     * @param x2 - 第二条切线的终点 X
     * @param y2 - 第二条切线的终点 Y
     * @param radius - 圆弧半径
     */
    arcToConic(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    /**
     * 添加圆弧连接（arcTo）
     *
     * 从当前点到 (x1, y1) 的线段与 (x1, y1) 到 (x2, y2) 的线段之间，
     * 绘制一个半径为 radius 的圆弧（与两条线段相切）。
     * 如果当前点与 (x1, y1) 不重合，会先画一条 lineTo 到切点。
     *
     * @param x1 - 第一条切线的终点 X
     * @param y1 - 第一条切线的终点 Y
     * @param x2 - 第二条切线的终点 X
     * @param y2 - 第二条切线的终点 Y
     * @param radius - 圆弧半径
     */
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    /**
     * 添加圆角矩形路径
     *
     * 支持统一圆角或多个圆角分别指定。
     *
     * @param x - 矩形左上角 X
     * @param y - 矩形左上角 Y
     * @param w - 矩形宽度
     * @param h - 矩形高度
     * @param radii - 圆角半径（支持多种格式）
     *   - number: 所有角统一半径
     *   - [all]: 四个角统一半径 [r]
     *   - [tl, br]: 左上和右下相同，右上和左下相同
     *   - [tl, tr, br, bl]: 分别指定四个角
     */
    roundRect(x: number, y: number, w: number, h: number, radii?: number | number[]): void;
    /**
     * 添加 SVG 椭圆弧路径（SVG Arc A/a 命令转换）
     *
     * 将 SVG 弧线的端点参数化（起点+终点+半径+旋转+大弧/扫掠标志）
     * 转换为中心参数化（圆心+半径+起始/终止角度），再委托 ellipse() 绘制。
     *
     * 算法遵循 SVG 规范：
     *   https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
     *
     * @param x1 - 起点 X
     * @param y1 - 起点 Y
     * @param x2 - 终点 X
     * @param y2 - 终点 Y
     * @param rx - X 轴半径
     * @param ry - Y 轴半径
     * @param rotation - 椭圆的旋转角度（弧度）
     * @param largeArcFlag - true=大弧, false=小弧
     * @param sweepFlag - true=顺时针, false=逆时针
     */
    ellipseSvgArc(x1: number, y1: number, x2: number, y2: number, rx: number, ry: number, rotation: number, largeArcFlag: boolean, sweepFlag: boolean): void;
    closePath(): void;
    /**
     * 判断点是否在路径填充区域内
     *
     * 先用包围盒快速拒绝，再根据填充规则用绕数法判断：
     * - 'nonzero'（默认）：绕数不为 0 则在内部
     * - 'evenodd'：绕数为奇数则在内部
     *
     * @param px - 测试点 X
     * @param py - 测试点 Y
     * @param fillRule - 填充规则，默认 'nonzero'
     */
    isPointInPath(px: number, py: number, fillRule?: 'nonzero' | 'evenodd'): boolean;
    invertVisit(visitor: PathVisitCallbacks): void;
    visit(cbs: PathVisitCallbacks): void;
    /**
     * 计算路径的包围盒（带缓存）
     * 路径未变化时返回缓存，避免重复遍历。
     * @returns { minX, minY, maxX, maxY } 包围盒，路径为空时返回 null
     */
    computeBounds(): BoundingRect;
    /**
     * 计算路径的紧凑包围盒（带缓存）
     *
     * 路径未变化时返回缓存，避免重复遍历。
     * @returns { minX, minY, maxX, maxY } 包围盒，路径为空时返回 null
     */
    computeTightBounds(): BoundingRect | null;
    toPolygons(autoClose?: boolean, epsilon?: number): PointLike[][];
    getPath2D(): Path2D;
    applyContext(path?: CanvasRenderingContext2D | Path2D): Path2D | CanvasRenderingContext2D;
}
export {};
