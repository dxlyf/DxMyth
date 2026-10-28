import { Point } from '../basic/Point';
import { SegmentPoint } from './SegmentPoint';
import { CurveLocation } from './CurveLocation';
import { Curve } from './Curve';
import { Matrix } from '../basic/Matrix';
import { Path } from './Path';
export declare class Segment {
    _point: SegmentPoint;
    _handleIn: SegmentPoint;
    _handleOut: SegmentPoint;
    _path?: Path | null;
    _index?: number;
    _curves?: Curve[];
    constructor(point?: Point, handleIn?: Point, handleOut?: Point);
    _changed(point?: SegmentPoint): void;
    /** segment 的锚点。 */
    get point(): SegmentPoint;
    set point(point: Point);
    /** 描述入切线的控制柄，相对于锚点。 */
    get handleIn(): SegmentPoint;
    set handleIn(handleIn: Point);
    /** 描述出切线的控制柄，相对于锚点。 */
    get handleOut(): SegmentPoint;
    set handleOut(handleOut: Point);
    /** segment 是否设置了任何控制柄。 */
    hasHandles(): boolean;
    /**
     * segment 处的两条曲线是否平滑连接，即两个控制柄共线且不构成尖角。
     */
    isSmooth(): boolean;
    /** 把控制柄坐标清零，使 segment 变成尖角。 */
    clearHandles(): void;
    /** segment 在路径 segments 数组中的索引。 */
    get index(): number | null;
    /** segment 所属的路径。 */
    get path(): Path | null;
    /**
     * segment 所属的曲线。对于开放路径的最后一个 segment，返回它前面那条曲线。
     */
    get curve(): Curve | null;
    /** 描述该 segment 在路径上位置的 CurveLocation。 */
    get location(): CurveLocation | null;
    /** 路径 segments 数组中的下一个 segment。 */
    get next(): Segment | null;
    /** 路径 segments 数组中的上一个 segment。 */
    get previous(): Segment | null;
    /**
     * 通过调整控制柄的方向和长度，平滑穿过该 segment 的贝塞尔曲线，但不移动
     * segment 本身。
     *
     * `type` 为 `'catmull-rom'`（默认）或 `'geometric'`；`factor` 是该方法的
     * 参数:节点参数化（默认 `0.5`）或张力（默认 `0.4`）。
     */
    smooth(options?: {
        type?: string;
        factor?: number;
    }, _first?: boolean, _last?: boolean): void;
    /** 该 segment 是否是路径 segments 数组中的第一个。 */
    isFirst(): boolean;
    /** 该 segment 是否是路径 segments 数组中的最后一个。 */
    isLast(): boolean;
    /** 原地交换该 segment 的 `handleIn` 与 `handleOut`。 */
    reverse(): void;
    /** 返回反转后的 segment 副本。 */
    reversed(): Segment;
    /** 把它从所属路径中移除。 */
    remove(): boolean;
    clone(): Segment;
    equals(segment: Segment | null): boolean;
    toString(): string;
    /**
     * 在两个指定 segment 之间插值，并据此设置该 segment 的锚点和控制柄。
     */
    interpolate(from: Segment, to: Segment, factor: number): void;
    /** 用指定矩阵变换该 segment。 */
    transform(matrix: Matrix): void;
    /**
     * 变换 segment 的锚点和控制柄。`change` 为真时只变换已设置的控制柄，并把
     * 结果写回，以节省计算；为假时总是填满 coords 数组。
     */
    _transformCoordinates(matrix: Matrix | null, coords: number[], change?: boolean): number[];
}
