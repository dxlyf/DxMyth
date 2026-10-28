import { PointLike } from './Point';
/** 德卡斯特里奥算法计算 N 阶贝塞尔曲线上参数 t 处的点 */
declare const deCasteljau: (points: PointLike[], t: number) => PointLike;
/** 计算 N 阶贝塞尔曲线在 t 处的一阶导数（切向量） */
declare const derivative: (points: PointLike[], t: number) => PointLike;
/** 计算 N 阶贝塞尔曲线一阶导数的控制点（共 n-1 个点） */
declare const derivativeControlPoints: (points: PointLike[]) => PointLike[];
/** 基于伯恩斯坦基函数计算 N 阶贝塞尔曲线上参数 t 处的点: sum(P[i] * B(i, n, t), i=0..n) */
declare const evaluate: (points: PointLike[], t: number) => PointLike;
/** 基于伯恩斯坦基函数对数值序列求值: Σ values[i] * B(i, n, t) */
declare const evaluateValues: (values: number[], t: number) => number;
/** 基于伯恩斯坦基函数计算 N 阶贝塞尔曲线在 t 处的一阶导数: n * Σ_{i=0}^{n-1} (P_{i+1} - P_i) * B_{i, n-1}(t) */
declare const derivative1: (points: PointLike[], t: number) => PointLike;
/** 基于伯恩斯坦基函数计算 N 阶贝塞尔曲线在 t 处的 k 阶导数
 *  d^k/dt^k B(t) = n!/(n-k)! * Σ_{i=0}^{n-k} Δ^k P_i * B_{i, n-k}(t)
 */
declare const derivativeN: (points: PointLike[], k: number, t: number) => PointLike;
/** 二阶贝塞尔曲线 evaluate */
declare const quadraticEvaluate: (p0: PointLike, p1: PointLike, p2: PointLike, t: number) => PointLike;
/** 三阶贝塞尔曲线 evaluate */
declare const cubicEvaluate: (p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike, t: number) => PointLike;
/** 二阶贝塞尔提升为三阶 */
declare const quadraticToCubic: (p0: PointLike, p1: PointLike, p2: PointLike) => [PointLike, PointLike, PointLike, PointLike];
/**
 * 将任意阶贝塞尔曲线升阶（degree elevation）
 * 升阶后曲线几何形状与原曲线完全一致，仅阶数提高
 * @param points - 原曲线控制点（阶数 = points.length - 1）
 * @param times - 升阶次数（每次阶数 +1），默认 1
 * @returns 升阶后的控制点（个数 = points.length + times）
 */
declare const elevateDegree: (points: PointLike[], times?: number) => PointLike[];
/**
 * 将任意阶贝塞尔曲线一次提升 N 阶（闭式公式）
 *
 * 升阶次数为 k、原阶数为 n、目标阶数为 m = n + k 时：
 *   Q_i = Σ_{j} [ C(n, j)·C(k, i-j) / C(m, i) ] · P_j
 * 其中 j ∈ [max(0, i-k), min(n, i)]
 *
 * 与逐次调用 elevateDegree 相比，一次计算不累积浮点误差，复杂度也更低。
 *
 * @param points - 原曲线控制点（阶数 = points.length - 1）
 * @param times - 提升的阶数 N（默认 1）
 * @returns 升阶后的控制点（个数 = points.length + times）
 */
declare const elevateDegreeN: (points: PointLike[], times?: number) => PointLike[];
/** 贝塞尔曲线的弧长（数值积分 - Simpson 法则） */
declare const arcLength: (points: PointLike[], segments?: number) => number;
/** 贝塞尔曲线上 t 处的法向量（旋转 90° 的归一化切向量） */
declare const normal: (points: PointLike[], t: number) => PointLike;
/** 贝塞尔曲线在 t 处的曲率 */
declare const curvature: (points: PointLike[], t: number) => number;
/**
 * 查找 N 阶贝塞尔曲线的极值 t 值（一阶导数为零处）
 * 对 N<=3 使用解析求解，更高阶使用数值方法
 * @returns 在 (0,1) 区间内的极值 t 值数组（已排序去重）
 */
declare const extrema: (points: PointLike[]) => number[];
/**
 * 查找贝塞尔曲线上最大曲率处的 t 值
 * @param samples - 初始采样点数（默认 20）
 * @returns 最大曲率对应的 t 值
 */
declare const maxCurvature: (points: PointLike[], samples?: number) => number;
/**
 * 计算点到 N 阶贝塞尔曲线的最小距离及对应 t 值
 * 采样 + Newton 迭代精炼
 * @param samples - 采样点数（默认 16）
 * @param iterations - Newton 迭代次数（默认 8）
 * @returns { t, distance } 最近点的 t 值和距离
 */
declare const project: (points: PointLike[], px: number, py: number, samples?: number, iterations?: number) => {
    t: number;
    distance: number;
};
declare function conicToQuadratic(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, w: number): number[][][];
/** 计算控制点包围盒（控制点凸包包含整条曲线） */
declare const controlPointsBounds: (points: PointLike[]) => {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
};
/**
 * 在参数 t 处用 de Casteljau 算法分割控制点，返回左右两段控制点
 */
declare const splitControlPoints: (points: PointLike[], t?: number) => [PointLike[], PointLike[]];
/**
 * 计算两条任意阶贝塞尔曲线的交点
 *
 * 采用「递归包围盒细分 + 二维 Newton 精炼」：
 *   1. 用控制点包围盒做粗筛，盒子不相交直接丢弃
 *   2. 每次细分包围盒较大的那条曲线，直到两条曲线的盒子都小于 epsilon
 *   3. 用区间中点作为初值，Newton 迭代精炼提高精度
 *
 * @param pointsA - 曲线 A 的控制点
 * @param pointsB - 曲线 B 的控制点
 * @param epsilon - 交点精度（包围盒尺寸阈值），默认 1e-4
 * @returns 交点数组（已去重）
 */
declare const curveCurveIntersections: (pointsA: PointLike[], pointsB: PointLike[], epsilon?: number) => PointLike[];
/**
 * 查找贝塞尔曲线上曲率最大的位置（采样 + 黄金分割搜索）
 * @param samples - 初始采样段数（默认 32）
 * @returns 最大曲率处的 t 值及曲率
 */
declare const maxCurvaturePoint: (points: PointLike[], samples?: number) => {
    t: number;
    curvature: number;
};
export { deCasteljau, derivative, derivativeControlPoints, evaluate, evaluateValues, derivative1, derivativeN, quadraticEvaluate, cubicEvaluate, quadraticToCubic, elevateDegree, elevateDegreeN, arcLength, normal, curvature, extrema, maxCurvature, project, conicToQuadratic, controlPointsBounds, splitControlPoints, curveCurveIntersections, maxCurvaturePoint, };
