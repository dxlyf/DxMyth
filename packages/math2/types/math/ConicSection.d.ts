import { PointLike } from './Point';
import { BoundingRect } from './BoundingRect';
/** 圆锥曲线类型 */
export declare enum ConicType {
    Ellipse = 0,// 椭圆 (e < 1)
    Parabola = 1,// 抛物线 (e = 1)
    Hyperbola = 2
}
/**
 * 根据离心率判断圆锥曲线类型
 */
export declare function getConicType(e: number): ConicType;
/**
 * 计算椭圆上参数 t∈[0, 2π) 处的点
 * @param t - 角度参数
 * @param a - 半长轴
 * @param b - 半短轴
 */
export declare function getEllipseEvaluate(t: number, a: number, b: number): PointLike;
/**
 * 计算椭圆在 t 处的一阶导数（切向量）
 */
export declare function getEllipseDerivative(t: number, a: number, b: number): PointLike;
/**
 * 计算椭圆的周长（Ramanujan 近似公式，精度极高）
 */
export declare function getEllipsePerimeter(a: number, b: number): number;
/**
 * 计算椭圆的面积
 */
export declare function getEllipseArea(a: number, b: number): number;
/**
 * 计算椭圆的边界框
 */
export declare function getEllipseBounds(a: number, b: number): BoundingRect;
/**
 * 判断点是否在椭圆内部
 */
export declare function isPointInEllipse(px: number, py: number, a: number, b: number): boolean;
/**
 * 计算点到椭圆的最小距离
 * 使用迭代法求解
 */
export declare function getDistanceToEllipse(px: number, py: number, a: number, b: number, iterations?: number): number;
/**
 * 计算抛物线上参数 t 处的点
 * 参数化: x = p·t², y = 2p·t
 * @param t - 参数（t=0 为顶点）
 * @param p - 焦点到顶点的距离
 */
export declare function getParabolaEvaluate(t: number, p: number): PointLike;
/**
 * 计算抛物线在 t 处的一阶导数
 */
export declare function getParabolaDerivative(t: number, p: number): PointLike;
/**
 * 计算抛物线在 t1 到 t2 之间的弧长
 */
export declare function getParabolaArcLength(t1: number, t2: number, p: number): number;
/**
 * 计算点到抛物线的最小距离
 * 采样 + Newton 精炼
 */
export declare function getDistanceToParabola(px: number, py: number, p: number, samples?: number, iterations?: number): number;
/**
 * 计算双曲线上参数 t 处的点
 * 参数化: x = a·cosh(t), y = b·sinh(t)（右支）
 * @param t - 参数（t=0 为顶点）
 * @param a - 半实轴
 * @param b - 半虚轴
 * @param branch - 1=右支, -1=左支
 */
export declare function getHyperbolaEvaluate(t: number, a: number, b: number, branch?: number): PointLike;
/**
 * 计算双曲线在 t 处的一阶导数
 */
export declare function getHyperbolaDerivative(t: number, a: number, b: number, branch?: number): PointLike;
/**
 * 计算双曲线的渐近线斜率
 */
export declare function getHyperbolaAsymptoteSlope(a: number, b: number): number;
/**
 * 计算双曲线的离心率
 */
export declare function getHyperbolaEccentricity(a: number, b: number): number;
/**
 * 计算双曲线的焦点位置
 */
export declare function getHyperbolaFoci(a: number, b: number): [PointLike, PointLike];
/**
 * 判断点是否在双曲线内部（右支与渐近线围成的区域）
 */
export declare function isPointInHyperbola(px: number, py: number, a: number, b: number): boolean;
export declare class ConicSection {
    /** 离心率 */
    eccentricity: number;
    /** 焦点距离（半长轴或半实轴） */
    a: number;
    /** 半短轴或半虚轴 */
    b: number;
    /** 曲线类型 */
    type: ConicType;
    constructor(eccentricity: number, a: number, b: number);
    /** 创建椭圆 */
    static ellipse(a: number, b: number): ConicSection;
    /** 创建抛物线 */
    static parabola(p: number): ConicSection;
    /** 创建双曲线 */
    static hyperbola(a: number, b: number): ConicSection;
    /** 计算曲线上参数 t 处的点 */
    evaluate(t: number): PointLike;
    /** 计算曲线在 t 处的一阶导数 */
    derivative(t: number): PointLike;
    /** 计算曲线在 t 处的法向量 */
    normal(t: number): PointLike;
    /** 获取边界框 */
    getBounds(): BoundingRect;
    /** 计算点到曲线的最小距离 */
    distanceTo(px: number, py: number): number;
    /**
     * 将曲线扁平化为线段序列
     * @param epsilon - 近似误差容限（默认 0.5）
     * @param range   - 参数范围 [tMin, tMax]（默认根据曲线类型自动）
     */
    flatten(epsilon?: number, range?: [number, number]): PointLike[];
    private _defaultRange;
}
