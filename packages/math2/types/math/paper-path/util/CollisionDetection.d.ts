/**
 * 移植自 paper/src/util/CollisionDetection.js。
 *
 * 轴对齐包围盒的碰撞检测，使用 sweep and prune 算法。这里的实现是几何运算
 * 的基础设施（布尔运算、求交的粗筛）。
 */
/** 只需要这四个边的包围盒形状。 */
export interface BoundsLike {
    left: number;
    top: number;
    right: number;
    bottom: number;
}
/**
 * 找出两组条目的轴对齐包围盒之间的碰撞。
 *
 * 对 items1 与 items2 中每个条目取其 `bounds`，再调用
 * {@link findBoundsCollisions}。
 *
 * @returns 与 items1 同长度的数组，每一项是 items2 中与它碰撞的下标数组
 */
export declare function findItemBoundsCollisions(items1: {
    bounds: BoundsLike;
}[], items2?: {
    bounds: BoundsLike;
}[] | null, tolerance?: number): (number[] | null)[];
/**
 * 找出两组曲线包围盒之间的碰撞。
 *
 * 为了性能这里用的是曲线的粗略包围盒（由控制点算出），它保证包住整条曲线，
 * 但通常比真实包围盒大。
 *
 * @param curves1 曲线 values 数组的数组
 * @returns 与 curves1 同长度的数组，每一项是 curves2 中碰撞的下标数组
 */
export declare function findCurveBoundsCollisions(curves1: number[][], curves2?: number[][] | null, tolerance?: number): (number[] | null)[];
/**
 * 找出两组包围矩形之间的碰撞。
 *
 * 实现为 sweep and prune 算法:沿 x 或 y 轴（主轴）扫描，并立即在副轴上检查
 * 潜在的配对。
 *
 * bounds 数组中的每一项必须是长度为 4 的数组，依次为 x0、y0、x1、y1。
 *
 * 返回数组与 boundsA 等长，每一项包含 boundsB 中所有重叠包围盒的下标，按
 * 升序排列。若未提供 boundsB（或传入 null），则检测 boundsA 内部的碰撞，
 * 此时每项不会包含它自身的下标。
 *
 * @param boundsA 要检测碰撞的包围盒数组
 * @param boundsB 用来与第一个数组比较的包围盒数组
 * @param tolerance 若提供，检测时会在每个包围盒四边加上该容差
 * @param sweepVertical 为 true 时沿 y 轴扫描
 */
export declare function findBoundsCollisions(boundsA: number[][], boundsB?: number[][] | null, tolerance?: number, sweepVertical?: boolean): (number[] | null)[];
