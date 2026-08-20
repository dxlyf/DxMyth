/**
 * Catmull-Rom 样条上的点
 * @param t 插值因子
 * @param p0 控制点 0
 * @param p1 控制点 1
 * @param p2 控制点 2
 * @param p3 控制点 3
 */
export declare function CatmullRom(t: number, p0: number, p1: number, p2: number, p3: number): number;
/**
 * 二次贝塞尔曲线上的点
 * @param t 插值因子
 * @param p0 起点
 * @param p1 控制点
 * @param p2 终点
 */
export declare function QuadraticBezier(t: number, p0: number, p1: number, p2: number): number;
/**
 * 三次贝塞尔曲线上的点
 * @param t 插值因子
 * @param p0 起点
 * @param p1 控制点 1
 * @param p2 控制点 2
 * @param p3 终点
 */
export declare function CubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number;
