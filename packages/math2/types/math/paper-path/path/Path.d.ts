import { Point } from '../basic/Point';
import { Matrix } from '../basic/Matrix';
import { Rectangle } from '../basic/Rectangle';
import { Size } from '../basic/Size';
import { Curve } from './Curve';
import { CurveLocation } from './CurveLocation';
import { PathItem } from './PathItem';
import { Segment } from './Segment';
import { StrokeProfileStop, StrokeProfileStopProps } from './StrokeProfileStop';
/** stroke profile 的一个条目:偏移，加上可选的笔触值。 */
export interface StrokeProfileEntry {
    offset: number;
    width?: number | null;
    aspect?: number | null;
    angle?: number | null;
    smooth?: boolean;
}
/** 从路径上取下的 stroke profile 片段，见 `_takeStrokeProfile()`。 */
export interface StrokeProfilePart {
    entries: StrokeProfileEntry[];
    length: number;
    closed: boolean;
}
export declare class Path extends PathItem {
    _length?: number | null;
    _area?: number | null;
    /** 描边轮廓的停靠点，按偏移排序，见 {@link #strokeProfile}。 */
    _strokeProfile: StrokeProfileStop[] | null;
    constructor(segments?: Segment[], closed?: boolean);
    /** 由 segments 构建（或复用）曲线数组。 */
    get curves(): Curve[];
    /** 曲线的数量:闭合路径等于 segment 数量，开放路径少一条。 */
    _countCurves(): number;
    /** 路径的 segment 数组。 */
    get segments(): Segment[];
    /** 用一组 segment 替换当前内容。 */
    set segments(segments: Segment[]);
    setSegments(segments: Segment[]): void;
    /** 路径是否闭合。 */
    set closed(closed: boolean);
    get closed(): boolean;
    /**
     * 把一组 segment 插入到指定位置（省略位置则追加）。若 segment 已属于别的
     * 路径，会先克隆。
     */
    _add(segs: Segment[], index?: number): void;
    /** 追加一个或多个 segment。 */
    add(...segs: Segment[]): void;
    addSegment(segment: Segment): void;
    addSegments(segments: Segment[]): void;
    /** 在指定位置插入一个或多个 segment。 */
    insert(index: number, ...segs: Segment[]): void;
    insertSegment(index: number, segment: Segment): void;
    insertSegments(index: number, segments: Segment[]): void;
    /** 移除指定索引的 segment。 */
    removeSegment(index: number): boolean;
    /**
     * 移除 [start, end) 范围内的 segment，返回移除掉的数组。
     *
     * `includeCurves` 在原文中用于保留已建立曲线引用，供 `CurveLocation` 追踪
     * 被移动的曲线；本移植的曲线缓存是惰性重建的，因此该参数仅为签名兼容。
     */
    removeSegments(start?: number, end?: number, includeCurves?: boolean): Segment[];
    /** 清空所有 segment。 */
    clear(): void;
    /** 路径是否没有 segment。 */
    isEmpty(): boolean;
    /** 是否有任何控制柄。 */
    hasHandles(): boolean;
    /** 清除所有控制柄。 */
    clearHandles(): void;
    /** 路径总长度。 */
    get length(): number;
    /** 路径覆盖的面积，自交部分的子面积会互相抵消。 */
    getArea(): number;
    get area(): number;
    /** 路径变化时让长度/面积缓存失效。 */
    _changed(): void;
    /** 路径的边界矩形。 */
    get bounds(): Rectangle;
    _getBounds(matrix?: Matrix | null): Rectangle;
    /** 计算一组 segment 的包围矩形（不含描边）。 */
    static getBounds(segments: Segment[], closed: boolean, path?: Path | null, matrix?: Matrix | null): Rectangle;
    /** 把路径几何导出为 SVG path data 字符串。 */
    getPathData(precision?: number): string;
    get pathData(): string;
    set pathData(data: string);
    /**
     * 按 SVG path data 重建路径。支持 m/l/h/v/c/s/q/t/z 与 a（椭圆弧）命令。
     */
    setPathData(data: string): void;
    /** 在末尾添加一个锚点。 */
    moveTo(point: Point): void;
    /** 从上一个锚点画直线到该点。 */
    lineTo(point: Point): void;
    /** 三次贝塞尔曲线到该点。 */
    cubicCurveTo(handle1: Point, handle2: Point, to: Point): void;
    /** 二次贝塞尔曲线到该点（换算成三次）。 */
    quadraticCurveTo(handle: Point, to: Point): void;
    /**
     * 闭合路径。若首尾锚点在 `tolerance` 内重合，则把它们合并成一个。
     */
    closePath(tolerance?: number): void;
    /** 路径上离该点最近的位置。 */
    getNearestLocation(point: Point): CurveLocation | null;
    /** 路径上离该点最近的点。 */
    getNearestPoint(point: Point): Point | null;
    /**
     * 路径上指定偏移处的位置。偏移按弧长累加，超出范围时:
     * 闭合路径按总长度环绕，开放路径返回 null。
     */
    getLocationAt(offset: number): CurveLocation | null;
    /** 若该点正好落在路径上，返回对应的位置，否则返回 null。 */
    getLocationOf(point: Point): CurveLocation | null;
    /** 路径上该点对应的偏移，不存在时返回 null。 */
    getOffsetOf(point: Point): number | null;
    /** 路径上指定偏移处的点。 */
    getPointAt(offset: number): Point | null;
    /** 路径上指定偏移处的切向量。 */
    getTangentAt(offset: number): Point | null;
    /** 路径上指定偏移处的法向量。 */
    getNormalAt(offset: number): Point | null;
    /** 路径上指定偏移处的曲率。 */
    getCurvatureAt(offset: number): number | null;
    /** 原地反转路径方向。 */
    reverse(): void;
    /** 返回反转后的路径副本。 */
    reversed(): Path;
    clone(): Path;
    /**
     * 平滑路径。目前支持 `'catmull-rom'` 与 `'geometric'`，其余方式尚未移植。
     */
    smooth(options?: {
        type?: string;
        factor?: number;
    }): void;
    /**
     * 在指定位置分割路径，返回新生成的那一半。
     * 与原文一致:位置可以是 CurveLocation，也可以是偏移。
     */
    divideAt(location: CurveLocation | number): Path | null;
    /**
     * 在指定位置拆分路径。位置可以是偏移量，也可以是 `CurveLocation`。
     *
     * 开放路径拆成两条，返回后半条；闭合路径先打开成一条，返回自身。
     */
    splitAt(location: number | CurveLocation): Path | null;
    /** 兼容旧签名：按 `CurveLocation` 拆分，等价于 `splitAt(location)`。 */
    split(location: CurveLocation): Path | null;
    /**
     * 把另一条路径接到本路径上，返回本路径。
     *
     * 传入 `null` / `this` 时，只有首尾相接才会把路径闭合。相接处的控制柄会
     * 合并；描边轮廓按段搬移（`_takeStrokeProfile` / `_setStrokeProfileParts`）。
     */
    join(path?: Path | null, tolerance?: number): this;
    /**
     * 删除长度为 0 的直线曲线；`simplify` 为真时还会删除近似零长的曲线，以及
     * 夹在两条共线直线之间的多余曲线。
     */
    reduce(options?: {
        simplify?: boolean;
    }): this;
    /**
     * 把曲线按 `flatness`（默认 0.25）细分，用直线段替换原有几何。
     * 只对 Path 有效；CompoundPath 会转发给每个子路径。
     */
    flatten(flatness?: number): void;
    /**
     * 用 PathFitter 以 `tolerance`（默认 2.5）的误差重新拟合路径。
     * 返回是否产生了新的 segment。
     */
    simplify(tolerance?: number): boolean;
    /** 由两个点创建一条直线路径。 */
    static Line(from: Point, to: Point): Path;
    /** 创建圆。 */
    static Circle(center: Point, radius: number): Path;
    /** 创建矩形，可指定圆角的尺寸。 */
    static Rectangle(rectangle: Rectangle, radius?: Size): Path;
    /** `Path.Rectangle` 的旧别名。 */
    static RoundRectangle(rectangle: Rectangle, radius?: Size): Path;
    /** 创建内切于给定矩形的椭圆。 */
    static Ellipse(rectangle: Rectangle): Path;
    /** `Path.Ellipse` 的旧别名。 */
    static Oval(rectangle: Rectangle): Path;
    /** 创建经过三个点的圆弧。 */
    static Arc(from: Point, through: Point, to: Point): Path;
    /**
     * 创建正多边形。与 Illustrator 一致:底边水平，segment 从顶点开始逆时针
     * 排列；边数为偶数时从顶边的右端开始。
     */
    static RegularPolygon(center: Point, sides: number, radius: number): Path;
    /**
     * 创建星形。`radius1` 与 `radius2` 中较大的作为外半径，较小的作为内半径。
     */
    static Star(center: Point, points: number, radius1: number, radius2: number): Path;
    /** 把单位椭圆模板按半径缩放、平移到 center，生成闭合路径。 */
    static _createEllipse(center: Point, radius: Size): Path;
    /** 从当前点画一条经过 through、终点为 to 的圆弧。 */
    _arcThrough(through: Point, to: Point): void;
    /** 以 center 为圆心、当前点到圆心的向量为起点，添加 extent 度的圆弧。 */
    _addArc(center: Point, vector: Point, extent: number, to: Point, matrix?: Matrix | null): void;
    /**
     * 路径的描边轮廓:沿路径排列的停靠点，用来设置绘制描边的笔触（一个带
     * 宽度、纵横比和角度的椭圆），见 {@link StrokeProfileStop}。停靠点按偏移
     * 排序。在没有停靠点设置某项时，笔触沿全程保持描边宽度。
     *
     * 它是路径自身的属性而不是样式的一部分，因为它绑定在 segment 上。可以直接
     * 赋停靠点，也可以赋普通对象 `{ offset, width, aspect, angle, smooth }`。
     */
    get strokeProfile(): StrokeProfileStop[] | null;
    set strokeProfile(stops: (StrokeProfileStop | StrokeProfileStopProps)[] | null);
    /**
     * 返回路径在给定偏移处的笔触，作为一个不在路径上的停靠点，各项都已填好:
     * 宽度是描边宽度的倍数，没有停靠点设置时分别为 `1`、`1`、`0`。
     */
    getStrokeProfileAt(offset: number): StrokeProfileStop;
    /**
     * 返回路径全程的笔触，作为条目:在路径两端、各停靠点以及值变化处取点。
     * 阶梯在同一偏移处有两个条目。
     */
    _getStrokeProfilePens(): StrokeProfileEntry[];
    /**
     * 返回一个函数，给出任意偏移处笔触各项的值及其一阶、二阶导数，形式为
     * `{ width: [value, d1, d2], aspect, angle }`。
     */
    _getStrokeProfileValues(): (offset: number, after?: boolean) => {
        [key: string]: [number, number, number];
    };
    /**
     * 返回偏移对应的索引:它之前那个 segment 的索引，加上到下一条曲线的弧长
     * 比例。闭合路径的偏移会环绕，开放路径则夹在两端之间。
     */
    _getIndexAt(offset: number): number;
    /** 把索引换算回弧长偏移。 */
    _getOffsetAtIndex(index: number): number;
    /** 按索引给停靠点排序。 */
    _sortStrokeProfile(): void;
    /** 只保留回调返回 true 的停靠点。 */
    _filterStrokeProfile(callback: (stop: StrokeProfileStop) => boolean): void;
    /**
     * 在索引处插入 segment 之后，迁移停靠点，使落在被拆分曲线上的停靠点保持
     * 相同的长度比例。
     */
    _insertStrokeProfile(index: number, amount: number): void;
    /**
     * 在移除 [start, end) 的 segment 之前迁移停靠点:落在被移除区间内、但仍
     * 位于保留段之间的停靠点，按合并后曲线的长度比例重新定位；开放路径新端点
     * 之外的停靠点被丢弃。
     */
    _removeStrokeProfile(start: number, end: number): void;
    /** segment 反转之后迁移停靠点。 */
    _reverseStrokeProfile(): void;
    /**
     * 把 stroke profile 从路径上取下，转成按偏移排列的条目，供按偏移移动它的
     * 方法使用，见 `_setStrokeProfileParts()`。
     */
    _takeStrokeProfile(): StrokeProfilePart;
    /**
     * 用取下的片段设置 stroke profile:它们沿路径首尾相接，第一个在起点、最后
     * 一个在终点；相接处各自保留该处的值作为停靠点。
     */
    _setStrokeProfileParts(parts: StrokeProfilePart[]): void;
    /**
     * 用取下的片段在两个偏移之间设置 stroke profile，见
     * `_takeStrokeProfile()`。
     */
    _setStrokeProfilePart(part: StrokeProfilePart, from: number, to: number): void;
    /**
     * 从当前点画圆弧到 `to`。
     *
     * 三种形式:
     * - `arcTo(to, clockwise?)`：终点与方向；
     * - `arcTo(through, to)`：经过 `through` 的圆弧；
     * - `arcTo(to, radius, rotation, clockwise, large)`：SVG 风格椭圆弧。
     */
    arcTo(to: Point, clockwise?: boolean): void;
    arcTo(through: Point, to: Point): void;
    arcTo(to: Point, radius: Size, rotation: number, clockwise: boolean, large: boolean): void;
    /**
     * SVG 风格椭圆弧，算法见:
     * https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
     */
    _arcSvg(to: Point, radius: Size, rotation: number, clockwise: boolean, large: boolean): void;
    /** 以 `center` 为圆心、当前点为起点，画 `angle` 度的圆弧。 */
    arcAround(center: Point, angle: number): void;
    /**
     * 沿当前路径的切线方向画圆弧到 `to`：圆心落在过当前点的法线上，圆弧在
     * 当前点处与路径相切。
     */
    arcTowards(to: Point): void;
}
