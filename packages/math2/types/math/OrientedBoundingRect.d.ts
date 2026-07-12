import { Vector2, Vector2Like } from './Vector2';
import { Matrix2DLike } from './Matrix2D';
import { BoundingRect } from './BoundingRect';
import { CachePool } from './CachePool';
export declare class OrientedBoundingRect {
    static pool: CachePool<OrientedBoundingRect, []>;
    /** 4 个角点（逆时针顺序：topLeft→topRight→bottomRight→bottomLeft） */
    topLeft: Vector2;
    topRight: Vector2;
    bottomRight: Vector2;
    bottomLeft: Vector2;
    constructor(tx?: number, ty?: number, trx?: number, try_?: number, brx?: number, bry?: number, blx?: number, bly?: number);
    /** 中心点（对角线 topLeft-bottomRight 中点） */
    get center(): Vector2Like;
    /** 旋转角（弧度），topLeft→topRight 方向 */
    get rotation(): number;
    /** 宽度 */
    get width(): number;
    /** 高度 */
    get height(): number;
    /** 半宽 */
    get halfWidth(): number;
    /** 半高 */
    get halfHeight(): number;
    /** 面积 */
    get area(): number;
    /** 局部 X 轴（topLeft→topRight 方向单位向量） */
    getAxisX(): Vector2Like;
    /** 局部 Y 轴（topLeft→bottomLeft 方向单位向量） */
    getAxisY(): Vector2Like;
    static default(): OrientedBoundingRect;
    /** 从 4 个角点创建（逆时针：topLeft→topRight→bottomRight→bottomLeft） */
    static fromCorners(topLeft: Vector2Like, topRight: Vector2Like, bottomRight: Vector2Like, bottomLeft: Vector2Like): OrientedBoundingRect;
    /** 从 AABB 创建（旋转角为 0） */
    static fromBoundingRect(rect: BoundingRect): OrientedBoundingRect;
    /** 从中心、半尺寸、旋转角创建 */
    static fromCenterRotation(cx: number, cy: number, hw: number, hh: number, rotation: number): OrientedBoundingRect;
    /** 从点集计算最小面积 OBB（PCA 方法） */
    static fromPoints(points: Vector2Like[]): OrientedBoundingRect;
    /** 获取 4 个角点（逆时针），存入 out */
    getCorners(out: Vector2[]): Vector2[];
    /** 获取轴对齐包围盒 */
    getBoundingRect(): BoundingRect;
    /**
     * 判断点是否在 OBB 内部（含边界）
     * 使用叉积符号法：点与每条边形成的三角形方向一致则在内部
     */
    contains(x: number, y: number): boolean;
    /**
     * 判断是否与另一个 OBB 相交（分离轴定理 SAT）
     * 2D 中检查 4 个分离轴：两个 OBB 的边法线方向
     */
    intersects(other: OrientedBoundingRect): boolean;
    /** 判断是否与 AABB 相交 */
    intersectsRect(rect: BoundingRect): boolean;
    copy(other: OrientedBoundingRect): this;
    /** 用中心+半尺寸+旋转角设置 OBB */
    setFromCenterRotation(cx: number, cy: number, hw: number, hh: number, rotation: number): this;
    /**
     * 应用 2D 仿射矩阵变换 OBB。
     * 变换 4 个角点后用 PCA 重新计算紧致包围盒。
     */
    applyMatrix2D(m: Matrix2DLike): this;
    /** 平移 OBB */
    translate(tx: number, ty: number): this;
    /**
     * 将 OBB 扩展以包含指定点（放宽版，不再是最紧密包围）。
     */
    expandPoint(x: number, y: number): this;
    /** 设置角点 */
    setCorners(topLeft: Vector2Like, topRight: Vector2Like, bottomRight: Vector2Like, bottomLeft: Vector2Like): this;
    clone(): OrientedBoundingRect;
    toString(): string;
}
