import { PointLike } from './Point';
declare function windingCubicBezier(px: number, py: number, p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike): number;
declare function windingQuadraticBezier(px: number, py: number, p0: PointLike, p1: PointLike, p2: PointLike): number;
declare function windingLine(x: number, y: number, x0: number, y0: number, x1: number, y1: number): number;
/**
 * 判断 conic（有理二次贝塞尔）对射线 (px,py)→(+x) 的绕数贡献
 * C(t) = N(t)/D(t)，由 y(t)=py 解二次方程得交点参数 t
 * @param px 射线起点 x
 * @param py 射线起点 y
 * @param p0 起点控制点
 * @param p1 中间控制点
 * @param p2 终点控制点
 * @param w  权重（P0/P2 权重恒为 1）
 */
declare function windingConic(px: number, py: number, p0: PointLike, p1: PointLike, p2: PointLike, w: number): number;
/**
 * 判断点是否在线段上（含端点），误差容差 epsilon
 * 垂足条件：P 在线段上的投影点与 P 的距离 ≤ epsilon
 */
declare function tangentLine(px: number, py: number, x0: number, y0: number, x1: number, y1: number, epsilon?: number): boolean;
/**
 * 判断点是否在二次贝塞尔曲线上，误差容差 epsilon
 * 切线条件：最近点满足 (P - Q(t))·Q'(t) = 0，
 * 对二次曲线该式为 t 的三次方程，用 Cardano 解析求解
 */
declare function tangentQuad(px: number, py: number, p0: PointLike, p1: PointLike, p2: PointLike, epsilon?: number): boolean;
/**
 * 判断点是否在三次贝塞尔曲线上，误差容差 epsilon
 * 切线条件：(P - Q(t))·Q'(t) = 0 是 t 的五次方程（无解析解），
 * 用均匀采样取最近初值，再牛顿迭代精化
 */
declare function tangentCubic(px: number, py: number, p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike, epsilon?: number): boolean;
/**
 * 判断点是否在 conic（有理二次贝塞尔）曲线上，误差容差 epsilon
 * C(t) = N(t)/D(t)，切线条件 (P - C(t))·C'(t) = 0 展开为 t 的五次方程（无解析解），
 * 用均匀采样取最近初值，再牛顿迭代精化。
 * 注意乘以正因子 D⁴ 消去分母：g = (P·D - N)·(N'D - ND')，其零点与 g 在 [0,1] 上一致（D>0）
 */
declare function tangentConic(px: number, py: number, p0: PointLike, p1: PointLike, p2: PointLike, w: number, epsilon?: number): boolean;
export { windingLine, windingQuadraticBezier, windingCubicBezier, windingConic, tangentLine, tangentQuad, tangentCubic, tangentConic, };
