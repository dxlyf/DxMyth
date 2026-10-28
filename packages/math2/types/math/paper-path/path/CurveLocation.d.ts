import { Point } from '../basic/Point';
import { Curve } from './Curve';
import { Path } from './Path';
import { Segment } from './Segment';
export declare class CurveLocation {
    _curve: Curve;
    _path: Path | null;
    _version: number;
    /** 距离该位置最近的线段，按需计算。 */
    _segment: Segment | null;
    _segment1: Segment;
    _segment2: Segment | null;
    _time: number | null;
    _point: Point;
    _offset?: number | null;
    _curveOffset?: number | null;
    _distance?: number;
    _overlap?: boolean;
    /** 与之关联的交点位置。 */
    _intersection: CurveLocation | null;
    constructor(curve: Curve, time: number, point?: Point, overlap?: boolean, distance?: number);
    _setPath(path: Path | null): void;
    _setCurve(curve: Curve): void;
    _setSegment(segment: Segment): void;
    /** 曲线上距离该位置最近的线段。 */
    get segment(): Segment | null;
    /** 该位置所属的曲线。 */
    get curve(): Curve | null;
    /** 该位置所在的路径。 */
    get path(): Path | null;
    /** 曲线在路径曲线数组中的下标。 */
    get index(): number | null;
    /**
     * curve-time 参数，供各种贝塞尔曲线计算使用。取值 0（曲线起点）到 1
     * （曲线终点）。
     */
    get time(): number | null;
    /** 由 curve 与 time 确定的点。 */
    get point(): Point;
    /**
     * 从路径起点到该位置的长度。若曲线不属于路径，则返回曲线内的长度。
     */
    get offset(): number;
    /** 从曲线起点到该位置的长度。 */
    get curveOffset(): number;
    /**
     * 相交曲线上的对应位置；若该位置是 `PathItem#getIntersections()` 或
     * `Curve#getIntersections()` 的结果，则该值不为空。
     */
    get intersection(): CurveLocation | null;
    /** 查询点到该位置的距离。 */
    get distance(): number | undefined;
    /** 该位置处曲线的切向量。 */
    get tangent(): Point | null;
    /** 该位置处曲线的法向量。 */
    get normal(): Point | null;
    /** 该位置处曲线的曲率。 */
    get curvature(): number | null;
    divide(): Curve | null;
    split(): Path | null;
    /**
     * 判断两个 CurveLocation 是否描述路径上的同一位置，采用与处理
     * curve-time 参数一致的容差。
     */
    equals(location: CurveLocation, _ignoreOther?: boolean): boolean;
    toString(): string;
    /**
     * 若该位置是与其他曲线的交点，判断它只是接触另一条曲线，而不是穿过。
     */
    isTouching(): boolean;
    /**
     * 若该位置是与其他曲线的交点，判断它是穿过另一条曲线，而不只是接触。
     */
    isCrossing(): boolean;
    /** 该位置是否属于两条路径的重叠部分。 */
    hasOverlap(): boolean;
    /**
     * 把一个位置插入已排序的列表；若已有描述同一处的位置，则与之合并。
     *
     * @return 插入的位置，或合并到的已有位置
     */
    static insert(locations: CurveLocation[], location: CurveLocation, merge?: boolean): CurveLocation;
    /**
     * 把传入的位置列表与其关联的交点位置一起展开，并按顺序排好。
     */
    static expand(locations: CurveLocation[]): CurveLocation[];
}
