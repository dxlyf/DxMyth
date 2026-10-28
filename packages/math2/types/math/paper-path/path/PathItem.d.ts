import { Point } from '../basic/Point';
import { Matrix } from '../basic/Matrix';
import { Rectangle } from '../basic/Rectangle';
import { Curve } from './Curve';
import { CurveLocation } from './CurveLocation';
import { Segment } from './Segment';
import { Path } from './Path';
import { CompoundPath } from './CompoundPath';
import { getWinding, BooleanOptions, Winding } from './booleanOps';
import { OffsetOptions, OutlineOptions } from './offsetOps';
export { getWinding };
export type { BooleanOptions, Winding, OffsetOptions, OutlineOptions };
export declare class PathItem {
    _segments: Segment[];
    _closed: boolean;
    _curves: Curve[] | null;
    _version: number;
    /**
     * 结果对象的创建函数，由 `Path` / `CompoundPath` 在模块加载时注册。
     *
     * 布尔运算与偏移算法需要创建 `Path` / `CompoundPath`，而这两个类又继承
     * `PathItem`，直接 import 会形成"初始化阶段就要用完对方"的循环。注册把
     * 依赖反转：算法只调用这里，类的模块自己把自己注册进来。
     */
    static _createPath: ((segments?: Segment[], closed?: boolean) => Path) | null;
    static _createCompoundPath: ((children: Path[]) => CompoundPath) | null;
    /** `Path` 构造函数，供需要静态构造器（如 Circle/Rectangle）的地方使用。 */
    static _pathClass: typeof Path | null;
    /** 路径的 segment 数组。 */
    get segments(): Segment[];
    set segments(segments: Segment[]);
    /** 路径是否闭合。 */
    get closed(): boolean;
    set closed(closed: boolean);
    /** 路径的曲线数组。由子类实现。 */
    get curves(): Curve[];
    /** 路径的第一个 segment。 */
    get firstSegment(): Segment | null;
    /** 路径的最后一个 segment。 */
    get lastSegment(): Segment | null;
    /** 路径的第一条曲线。 */
    get firstCurve(): Curve | null;
    /** 路径的最后一条曲线。 */
    get lastCurve(): Curve | null;
    /**
     * 路径整体是否按顺时针方向。看的是路径面积:自交路径或方向互相抵消的
     * 子路径可能得到相互抵消的面积。
     */
    get clockwise(): boolean;
    set clockwise(clockwise: boolean);
    /** 路径几何的 SVG path data 字符串。由子类实现。 */
    get pathData(): string;
    set pathData(data: string);
    /** 路径变化时调用:更新版本号并让缓存的曲线和边界失效。 */
    _changed(): void;
    _asPathItem(): this;
    /** 只含填充或只含描边时可以直接参与合成。这里没有样式，固定返回 true。 */
    _canComposite(): boolean;
    /** 面积，由子类实现（Path 用各曲线面积之和）。 */
    getArea(): number;
    /** 由子类实现:返回路径的边界矩形。 */
    _getBounds(matrix?: Matrix | null): Rectangle;
    /** 由子类实现:返回路径的 SVG path data。 */
    getPathData(): string;
    /** 由子类实现:按 SVG path data 重建路径。 */
    setPathData(data: string): void;
    /** 由子类实现:反向路径。 */
    reverse(): void;
    /** 路径整体是否顺时针（面积 >= 0）。 */
    isClockwise(): boolean;
    /** 设置路径方向为顺时针或逆时针，必要时反转路径。 */
    setClockwise(clockwise: boolean): void;
    /**
     * 点是否在路径内部。没有 Style，固定使用非零绕数规则。
     */
    contains(point: Point): boolean;
    /** 计算点相对于该路径的绕数贡献。 */
    _getWinding(point: Point, dir?: boolean, dontFlip?: boolean): Winding;
    /**
     * 两条路径的所有交点，返回 CurveLocation 数组。
     * 传入空值时会求自交点。
     *
     * 原文用两条路径的边界盒做快速筛选；这里用 `_getBounds()` 做同样的粗略
     * 判断。
     */
    getIntersections(path?: PathItem | null, include?: ((location: CurveLocation) => boolean) | null): CurveLocation[];
    /** 两条路径的所有交叉点（真正穿过对方，而不是只接触）。 */
    getCrossings(path: PathItem): CurveLocation[];
    /** 路径上离该点最近的位置。 */
    getNearestLocation(point: Point): CurveLocation | null;
    /** 路径上离该点最近的点。 */
    getNearestPoint(point: Point): Point | null;
    /** 把矩阵直接作用到所有 segment 上（不保留矩阵）。 */
    transform(matrix: Matrix): void;
    translate(dx: number, dy: number): void;
    rotate(angle: number, center?: Point): void;
    /**
     * 缩放路径。未指定中心点时以路径边界盒的中心为基准（与 Item#scale 的
     * 文档行为一致）。
     */
    scale(sx: number, sy?: number, center?: Point): void;
    /**
     * 用两个路径项插值的结果作为自己的几何。两个操作数的 segment 数量必须
     * 相同。
     */
    interpolate(from: PathItem, to: PathItem, factor: number): void;
    /**
     * 比较两个路径的几何是否描述同一形状。这里只比较单个路径（还没有
     * CompoundPath），逐个 segment 平移比较，允许起点不同但方向相同。
     */
    compare(path: PathItem | null): boolean;
    /** 与指定路径求并集，返回新的路径项。 */
    unite(path?: PathItem | PathItem[], options?: BooleanOptions): PathItem;
    /** 与指定路径求交集，返回新的路径项。 */
    intersect(path?: PathItem | PathItem[], options?: BooleanOptions): PathItem;
    /** 从自身减去指定路径，返回新的路径项。 */
    subtract(path?: PathItem | PathItem[], options?: BooleanOptions): PathItem;
    /** 与指定路径求异或，返回新的路径项。 */
    exclude(path?: PathItem | PathItem[], options?: BooleanOptions): PathItem;
    /**
     * 用指定路径切开自身，结果相当于 subtract 与 intersect 合并后的复合路径。
     */
    divide(path: PathItem, options?: BooleanOptions): PathItem;
    /** 消解自交:在每个自交点处切开并重新追踪填充区域。 */
    resolveCrossings(): PathItem;
    /** 重新调整子路径的方向。 */
    reorient(nonZero?: boolean, clockwise?: boolean): PathItem;
    /** 返回一个保证位于路径内部的点。 */
    getInteriorPoint(): Point;
    /** 按给定距离偏移路径项，返回新的路径项。 */
    offset(distance: number, options?: OffsetOptions): PathItem;
    /**
     * 返回描边所覆盖的区域。没有 Style，宽度必须通过 `options.width` 传入
     * （默认 0）。
     */
    outline(options?: OutlineOptions): PathItem;
}
