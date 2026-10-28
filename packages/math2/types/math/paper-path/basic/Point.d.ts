import { Matrix } from './Matrix';
export declare class Point {
    _x: number;
    _y: number;
    /** 向量长度被设为 0 时保留的角度。 */
    _angle?: number;
    constructor(x?: number, y?: number);
    get x(): number;
    set x(x: number);
    get y(): number;
    set y(y: number);
    /** 一次性设置两个坐标。 */
    _set(x: number, y: number): this;
    equals(point: Point): boolean;
    clone(): Point;
    toString(): string;
    /** 点的坐标数组，`[x, y]`。 */
    get values(): number[];
    /** 该点所表示向量的长度。 */
    get length(): number;
    set length(length: number);
    /** 向量角度，单位为度，从 x 轴量起。 */
    get angle(): number;
    set angle(angle: number);
    /** 向量角度，单位为弧度，从 x 轴量起。 */
    get angleInRadians(): number;
    set angleInRadians(angle: number);
    /**
     * {@link #angle} 所在的象限:0-90 度为 1，90-180 度为 2，
     * 180-270 度为 3，270-360 度为 4。
     */
    get quadrant(): number;
    /** 两个向量之间的较小夹角，单位为度。 */
    getAngle(point: Point): number;
    /** 两个向量之间的较小夹角，单位为弧度。 */
    getAngleInRadians(point: Point): number;
    /** 两个向量之间的有向夹角，单位为度。 */
    getDirectedAngle(point: Point): number;
    /** 到另一个点的距离；`squared` 为真时返回距离的平方。 */
    getDistance(point: Point, squared?: boolean): number;
    /** 长度归一化为 `length`、角度不变的新点。 */
    normalize(length?: number): Point;
    /** 绕可选的中心点旋转指定角度后的新点。 */
    rotate(angle: number, center?: Point): Point;
    /** 用矩阵变换该点后返回新点。 */
    transform(matrix: Matrix): Point;
    add(value: Point | number): Point;
    subtract(value: Point | number): Point;
    multiply(value: Point | number): Point;
    divide(value: Point | number): Point;
    modulo(value: Point | number): Point;
    /** 两个坐标都取负的新点。 */
    negate(): Point;
    /** 该点与另一个点的距离是否在 `tolerance` 之内。 */
    isClose(point: Point, tolerance: number): boolean;
    /** 该向量与另一个向量是否共线（平行）。 */
    isCollinear(point: Point): boolean;
    /** 该向量与另一个向量是否正交（垂直）。 */
    isOrthogonal(point: Point): boolean;
    /** 两个坐标是否在 1e-12 容差内都为 0。 */
    isZero(): boolean;
    /** 是否至少有一个坐标不是数字。 */
    isNaN(): boolean;
    /** 向量是否落在指定象限内。 */
    isInQuadrant(q: number): boolean;
    /** 该点与另一个点的点积。 */
    dot(point: Point): number;
    /** 该点与另一个点的叉积。 */
    cross(point: Point): number;
    /** 该点在另一个点上的投影。 */
    project(point: Point): Point;
    /** 坐标被限制在给定范围内的新点。 */
    clamp(min: Point, max: Point): Point;
    /** 坐标四舍五入后的新点。 */
    round(): Point;
    /** 坐标向上取整后的新点。 */
    ceil(): Point;
    /** 坐标向下取整后的新点。 */
    floor(): Point;
    /** 坐标取绝对值后的新点。 */
    abs(): Point;
    /** 取两个点中 x、y 各自最小的新点。 */
    static min(point1: Point, point2: Point): Point;
    /** 取两个点中 x、y 各自最大的新点。 */
    static max(point1: Point, point2: Point): Point;
    /** x、y 为 0 到 1 之间随机值的点。 */
    static random(): Point;
    static isCollinear(x1: number, y1: number, x2: number, y2: number): boolean;
    static isOrthogonal(x1: number, y1: number, x2: number, y2: number): boolean;
}
