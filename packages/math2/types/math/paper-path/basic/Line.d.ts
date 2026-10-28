import { Point } from './Point';
export declare class Line {
    /** 起点的 x 坐标。 */
    private _px;
    /** 起点的 y 坐标。 */
    private _py;
    /** 方向向量的 x 分量。 */
    private _vx;
    /** 方向向量的 y 分量。 */
    private _vy;
    /**
     * `asVector` 为 true 时，`point2` 被当作方向向量而不是第二个点。
     */
    constructor(point1: Point, point2: Point, asVector?: boolean);
    /** 直线的起点。 */
    get point(): Point;
    /** 直线的方向向量。 */
    get vector(): Point;
    /** 直线的长度。 */
    get length(): number;
    /**
     * 与另一条直线的交点。
     *
     * @return 交点；两线平行时返回 `null`
     */
    intersect(line: Line, isInfinite?: boolean): Point | null;
    /**
     * 点位于直线的哪一侧：`-1`、`0` 或 `1`。
     */
    getSide(point: Point, isInfinite?: boolean): number;
    /** 点到直线的距离。 */
    getDistance(point: Point): number;
    /** 点到直线的有向距离。 */
    getSignedDistance(point: Point): number;
    /** 两条直线的方向是否共线。 */
    isCollinear(line: Line): boolean;
    /** 两条直线的方向是否垂直。 */
    isOrthogonal(line: Line): boolean;
    /**
     * 两条直线的交点。
     *
     * @param asVector 为 true 时 `v1x/v1y`、`v2x/v2y` 已是方向向量
     * @param isInfinite 为 true 时把两条直线视为无限长
     * @return 交点，两线平行时返回 `null`
     */
    static intersect(p1x: number, p1y: number, v1x: number, v1y: number, p2x: number, p2y: number, v2x: number, v2y: number, asVector?: boolean, isInfinite?: boolean): Point | null;
    /**
     * 点位于直线的哪一侧，返回 `-1`、`0` 或 `1`。
     */
    static getSide(px: number, py: number, vx: number, vy: number, x: number, y: number, asVector?: boolean, isInfinite?: boolean): number;
    /**
     * 点到直线的有向距离。
     */
    static getSignedDistance(px: number, py: number, vx: number, vy: number, x: number, y: number, asVector?: boolean): number;
    /**
     * 点到直线的距离。
     */
    static getDistance(px: number, py: number, vx: number, vy: number, x: number, y: number, asVector?: boolean): number;
}
