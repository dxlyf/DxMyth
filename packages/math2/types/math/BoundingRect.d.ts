import { Vector2, Vector2Like } from './Vector2';
import { Matrix2DLike } from './Matrix2D';
import { CachePool } from './CachePool';
export declare class BoundingRect {
    static pool: CachePool<BoundingRect, []>;
    static default(): BoundingRect;
    static zero(): BoundingRect;
    /** 从点列表计算包围盒 */
    static fromPoints(points: Vector2Like[]): BoundingRect;
    /** 从 (x, y, width, height) 创建 */
    static fromXYWH(x: number, y: number, w: number, h: number): BoundingRect;
    /** 从 (left, top, right, bottom) 创建 */
    static fromLTRB(left: number, top: number, right: number, bottom: number): BoundingRect;
    /** 左下角（最小坐标） */
    min: Vector2;
    /** 右上角（最大坐标） */
    max: Vector2;
    constructor(minX?: number, minY?: number, maxX?: number, maxY?: number);
    get centerX(): number;
    get centerY(): number;
    get minX(): number;
    get minY(): number;
    get maxX(): number;
    get maxY(): number;
    /** 中心点 */
    get center(): Vector2Like;
    get left(): number;
    get top(): number;
    get right(): number;
    get bottom(): number;
    get x(): number;
    get y(): number;
    get width(): number;
    get height(): number;
    /** 面积 */
    area(): number;
    /** 是否为空（无有效范围） */
    isEmpty(): boolean;
    isZero(): boolean;
    /** 点是否在包围盒内（含边界） */
    contains(x: number, y: number): boolean;
    containsPoint(p: Vector2Like): boolean;
    intersectionBox(box: BoundingRect): boolean;
    /** 是否与另一个包围盒相交 */
    intersects(other: BoundingRect): boolean;
    /** 重置为空 */
    setEmpty(): this;
    makeEmpty(): this;
    makeZero(): this;
    isInfinity(): boolean;
    copy(other: BoundingRect): this;
    /** 扩展包围盒以包含指定点 */
    add(x: number, y: number): this;
    fromCircle(cx: number, cy: number, radius: number): this;
    fromLine(x0: number, y0: number, x1: number, y1: number, strokeWidth: number): this;
    fromXYWH(x: number, y: number, w: number, h: number): void;
    fromLTRB(left: number, top: number, right: number, bottom: number): void;
    fromPoints(points: Vector2Like[]): this;
    expandPoints(points: Vector2Like[]): this;
    /** 同 add，扩展包围盒以包含指定点 */
    expandPoint(point: Vector2Like): this;
    translate(tx: number, ty: number): void;
    inset(dx: number, dy: number): void;
    outset(dx: number, dy: number): void;
    /**
     * 联合：将自身扩展为包含 other 的最小包围盒（就地修改）。
     * 等同于 addRect，语义更清晰。
     */
    union(other: BoundingRect): this;
    /**
     * 相交：将自身裁剪为与 other 的重叠区域（就地修改）。
     * 若无重叠则变为空包围盒。
     */
    intersect(other: BoundingRect): this;
    /**
     * 对包围盒的 min/max 两点分别应用矩阵变换，重新计算轴对齐包围盒。
     * 注意：旋转/倾斜等非轴对齐变换会使包围盒膨胀。
     */
    applyMatrix2D(m: Matrix2DLike): this;
    clone(): BoundingRect;
    equals(box: BoundingRect): boolean;
    isValid(): boolean;
    toString(): string;
}
