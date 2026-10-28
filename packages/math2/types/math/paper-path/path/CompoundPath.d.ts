import { Point } from '../basic/Point';
import { Matrix } from '../basic/Matrix';
import { Rectangle } from '../basic/Rectangle';
import { PathItem } from './PathItem';
import { Path } from './Path';
import { PathDataTarget } from './pathData';
import { Curve } from './Curve';
import { Segment } from './Segment';
import { Size } from '../basic/Size';
export declare class CompoundPath extends PathItem implements PathDataTarget {
    /** 子路径。 */
    _children: Path[];
    constructor(children?: Path[]);
    get children(): Path[];
    set children(children: Path[]);
    /** 追加一个子路径，可指定插入位置。 */
    addChild(path: Path, index?: number): Path;
    /** 追加多个子路径。 */
    addChildren(paths: Path[]): void;
    /** 移除全部子路径并返回它们。 */
    removeChildren(): Path[];
    /** 所有子路径的 segment 平铺后的数组。 */
    get segments(): Segment[];
    /** 简化处理:用一个子路径承载全部 segment。 */
    set segments(segments: Segment[]);
    /** 所有子路径是否都闭合。没有子路径时返回 true（与原文一致）。 */
    get closed(): boolean;
    set closed(closed: boolean);
    /** 所有子路径的曲线。 */
    get curves(): Curve[];
    /** 第一个子路径的第一个 segment。 */
    get firstSegment(): Segment | null;
    /** 最后一个子路径的最后一个 segment。 */
    get lastSegment(): Segment | null;
    /** 第一个子路径的第一条曲线。 */
    get firstCurve(): Curve | null;
    /** 最后一个子路径的最后一条曲线。 */
    get lastCurve(): Curve | null;
    /** 所有子路径长度之和。 */
    get length(): number;
    /** 各子路径面积之和（方向相反时会相互抵消）。 */
    getArea(): number;
    get area(): number;
    /** 所有子路径边界盒的并集。 */
    get bounds(): Rectangle;
    _getBounds(matrix?: Matrix | null): Rectangle;
    /** 各子路径 path data 的拼接。 */
    getPathData(precision?: number): string;
    /** 按 SVG path data 重建:每遇到一个 `M`/`m` 就新建一个子路径。 */
    setPathData(data: string): void;
    /** 清空所有子路径。 */
    clear(): void;
    /** 取当前（最后一个）子路径，必要时新建。 */
    _getCurrentPath(check?: boolean): Path;
    /** 开始一个新的子路径，若当前子路径还是空的则复用它。 */
    moveTo(point: Point): void;
    lineTo(point: Point): void;
    cubicCurveTo(handle1: Point, handle2: Point, to: Point): void;
    quadraticCurveTo(handle: Point, to: Point): void;
    /**
     * 圆弧，转发给当前子路径。三种重载与 `Path#arcTo` 一致。
     */
    arcTo(to: Point, clockwise?: boolean): void;
    arcTo(through: Point, to: Point): void;
    arcTo(to: Point, radius: Size, rotation: number, clockwise: boolean, large: boolean): void;
    closePath(tolerance?: number): void;
    /** 反转每个子路径的方向。 */
    reverse(): void;
    /** 把矩阵直接作用到所有子路径上。 */
    transform(matrix: Matrix): void;
    /** 展平所有子路径。 */
    flatten(tolerance?: number): void;
    /** 简化所有子路径，任一子路径被简化即返回 true。 */
    simplify(tolerance?: number): boolean;
    /** 平滑所有子路径。 */
    smooth(options?: {
        type?: string;
        factor?: number;
    }): void;
    /** 是否没有任何子路径含有 segment。 */
    isEmpty(): boolean;
    /** 子路径数量与顺序都一致，且对应子路径几何相同。 */
    compare(path: PathItem | null): boolean;
    clone(): CompoundPath;
    toString(): string;
}
