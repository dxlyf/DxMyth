export interface Point {
    x: number;
    y: number;
}
export interface Vector {
    x: number;
    y: number;
}
export declare enum SplineType {
    LINEAR = "linear",
    CUBIC = "cubic",
    BSPLINE = "b-spline",
    NATURAL_CUBIC = "natural-cubic"
}
/**
 * 线性样条插值 - 简单地连接相邻点
 * @param points 控制点数组
 * @param t 参数值 [0, 1]
 * @returns 插值点
 */
export declare function linearSpline(points: Point[], t: number): Point;
/**
 * 计算三次样条的系数
 * @param points 控制点数组
 * @param type 样条类型
 * @returns 系数数组 [a, b, c, d] 其中 y = a + b(x-x_i) + c(x-x_i)^2 + d(x-x_i)^3
 */
export declare function calculateCubicSplineCoefficients(points: Point[], type?: SplineType): number[][];
/**
 * 三次样条插值
 * @param points 控制点数组
 * @param t 参数值 [0, 1]
 * @param type 样条类型
 * @returns 插值点
 */
export declare function cubicSpline(points: Point[], t: number, type?: SplineType): Point;
/**
 * B样条插值
 * @param points 控制点数组
 * @param t 参数值 [0, 1]
 * @param degree 次数（阶数-1），默认为3（四次B样条）
 * @returns 插值点
 */
export declare function bSpline(points: Point[], t: number, degree?: number): Point;
/**
 * 通用样曲线插值函数
 * @param points 控制点数组
 * @param t 参数值 [0, 1]
 * @param type 样曲线类型
 * @param options 其他选项
 * @returns 插值点
 */
export declare function splineInterpolate(points: Point[], t: number, type?: SplineType, options?: {
    degree?: number;
}): Point;
/**
 * 生成样曲线点数组
 * @param points 控制点数组
 * @param segments 分段数
 * @param type 样曲线类型
 * @param options 其他选项
 * @returns 生成的点数组
 */
export declare function generateSplineCurve(points: Point[], segments?: number, type?: SplineType, options?: {
    degree?: number;
}): Point[];
/**
 * 计算线性样条的导数
 * @param points 控制点数组
 * @param t 参数值 [0, 1]
 * @returns 导数值（向量）
 */
export declare function linearSplineDerivative(points: Point[], t: number): Vector;
/**
 * 计算三次样条的一阶导数
 * @param points 控制点数组
 * @param t 参数值 [0, 1]
 * @param type 样条类型
 * @returns 导数值（向量）
 */
export declare function cubicSplineDerivative(points: Point[], t: number, type?: SplineType): Vector;
/**
 * 计算B样条的一阶导数
 * @param points 控制点数组
 * @param t 参数值 [0, 1]
 * @param degree 次数
 * @returns 导数值（向量）
 */
export declare function bSplineDerivative(points: Point[], t: number, degree?: number): Vector;
/**
 * 通用样曲线导数计算函数
 * @param points 控制点数组
 * @param t 参数值 [0, 1]
 * @param type 样曲线类型
 * @param options 其他选项
 * @returns 导数值（向量）
 */
export declare function splineDerivative(points: Point[], t: number, type?: SplineType, options?: {
    degree?: number;
}): Vector;
/**
 * 使用数值积分计算样曲线段长度
 * @param points 控制点数组
 * @param t0 起始参数
 * @param t1 结束参数
 * @param type 样曲线类型
 * @param options 其他选项
 * @param samples 采样次数，默认为1000
 * @returns 曲线长度
 */
export declare function splineLength(points: Point[], t0?: number, t1?: number, type?: SplineType, options?: {
    degree?: number;
}, samples?: number): number;
/**
 * 细分样曲线
 * @param points 控制点数组
 * @param segments 细分段数
 * @param type 样曲线类型
 * @param options 其他选项
 * @returns 细分后的点数组
 */
export declare function subdivideSpline(points: Point[], segments?: number, type?: SplineType, options?: {
    degree?: number;
}): Point[];
/**
 * 计算样曲线的曲率
 * @param points 控制点数组
 * @param t 参数值 [0, 1]
 * @param type 样曲线类型
 * @param options 其他选项
 * @returns 曲率值
 */
export declare function splineCurvature(points: Point[], t: number, type?: SplineType, options?: {
    degree?: number;
}): number;
/**
 * 查找样曲线上距离给定点最近的点
 * @param points 控制点数组
 * @param targetPoint 目标点
 * @param type 样曲线类型
 * @param options 其他选项
 * @param iterations 迭代次数，默认为100
 * @returns 最近点和对应的参数t
 */
export declare function findClosestPointOnSpline(points: Point[], targetPoint: Point, type?: SplineType, options?: {
    degree?: number;
}, iterations?: number): {
    point: Point;
    t: number;
};
/**
 * 将样曲线转换为贝塞尔曲线
 * @param points 控制点数组
 * @param type 样曲线类型
 * @param options 其他选项
 * @returns 贝塞尔曲线段数组，每个段包含控制点
 */
export declare function splineToBezierCurves(points: Point[], type?: SplineType, options?: {
    degree?: number;
}): Point[][];
