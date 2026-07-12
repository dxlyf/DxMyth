import { PointLike } from './Point';
/** 德卡斯特里奥算法计算 N 阶贝塞尔曲线上参数 t 处的点 */
export declare const deCasteljau: (points: PointLike[], t: number) => PointLike;
/** 计算 N 阶贝塞尔曲线在 t 处的一阶导数（切向量） */
export declare const derivative: (points: PointLike[], t: number) => PointLike;
/** 计算 N 阶贝塞尔曲线一阶导数的控制点（共 n-1 个点） */
export declare const derivativeControlPoints: (points: PointLike[]) => PointLike[];
/** 贝塞尔曲线伯恩斯坦基函数: B(i, n, t) = C(n, i) * t^i * (1-t)^(n-i) */
export declare const bernstein: (i: number, n: number, t: number) => number;
/** 基于伯恩斯坦基函数计算 N 阶贝塞尔曲线上参数 t 处的点: sum(P[i] * B(i, n, t), i=0..n) */
export declare const evaluate: (points: PointLike[], t: number) => PointLike;
/** 基于伯恩斯坦基函数对数值序列求值: Σ values[i] * B(i, n, t) */
export declare const evaluateValues: (values: number[], t: number) => number;
/** 基于伯恩斯坦基函数计算 N 阶贝塞尔曲线在 t 处的一阶导数: n * Σ_{i=0}^{n-1} (P_{i+1} - P_i) * B_{i, n-1}(t) */
export declare const derivative1: (points: PointLike[], t: number) => PointLike;
/** 基于伯恩斯坦基函数计算 N 阶贝塞尔曲线在 t 处的 k 阶导数
 *  d^k/dt^k B(t) = n!/(n-k)! * Σ_{i=0}^{n-k} Δ^k P_i * B_{i, n-k}(t)
 */
export declare const derivativeN: (points: PointLike[], k: number, t: number) => PointLike;
/** 二阶贝塞尔曲线 evaluate */
export declare const quadraticEvaluate: (p0: PointLike, p1: PointLike, p2: PointLike, t: number) => PointLike;
/** 三阶贝塞尔曲线 evaluate */
export declare const cubicEvaluate: (p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike, t: number) => PointLike;
/** 二阶贝塞尔提升为三阶 */
export declare const quadraticToCubic: (p0: PointLike, p1: PointLike, p2: PointLike) => [PointLike, PointLike, PointLike, PointLike];
/** 贝塞尔曲线的弧长（数值积分 - Simpson 法则） */
export declare const arcLength: (points: PointLike[], segments?: number) => number;
/** 贝塞尔曲线上 t 处的法向量（旋转 90° 的归一化切向量） */
export declare const normal: (points: PointLike[], t: number) => PointLike;
/** 贝塞尔曲线在 t 处的曲率 */
export declare const curvature: (points: PointLike[], t: number) => number;
/**
 * 查找 N 阶贝塞尔曲线的极值 t 值（一阶导数为零处）
 * 对 N<=3 使用解析求解，更高阶使用数值方法
 * @returns 在 (0,1) 区间内的极值 t 值数组（已排序去重）
 */
export declare const extrema: (points: PointLike[]) => number[];
/**
 * 查找贝塞尔曲线上最大曲率处的 t 值
 * @param samples - 初始采样点数（默认 20）
 * @returns 最大曲率对应的 t 值
 */
export declare const maxCurvature: (points: PointLike[], samples?: number) => number;
/**
 * 计算点到 N 阶贝塞尔曲线的最小距离及对应 t 值
 * 采样 + Newton 迭代精炼
 * @param samples - 采样点数（默认 16）
 * @param iterations - Newton 迭代次数（默认 8）
 * @returns { t, distance } 最近点的 t 值和距离
 */
export declare const project: (points: PointLike[], px: number, py: number, samples?: number, iterations?: number) => {
    t: number;
    distance: number;
};
