import { Point } from '../basic/Point';
import { Matrix } from '../basic/Matrix';
import { Path } from './Path';
/** 展平表里的一段。 */
interface FlattenedPart {
    /** 从路径起点到该段末端的累计长度。 */
    offset: number;
    /** 该段的曲线 values。 */
    curve: number[];
    /** 段所属曲线的下标。 */
    index: number;
    /** 段末端的 curve-time。 */
    time: number;
    /** 该段是否是一条直线。 */
    isStraight: boolean;
}
export declare class PathFlattener {
    /** 每一条曲线的 values。 */
    curves: number[][];
    /** 细分后的段表。 */
    parts: FlattenedPart[];
    /** 路径总长度。 */
    length: number;
    /** 上次查询所在的段下标，用于迭代式使用的优化。 */
    index: number;
    /**
     * @param path 要展平的路径
     * @param flatness 直线允许偏离曲线的最大误差，默认 0.25
     * @param maxRecursion 细分的最多递归次数，默认 32
     * @param ignoreStraight 为真时不细分直线段（只关心展平结果时用）
     * @param matrix 可选变换矩阵，不修改原路径
     */
    constructor(path: Path, flatness?: number, maxRecursion?: number, ignoreStraight?: boolean, matrix?: Matrix);
    /** 找到偏移量所在的分段，并插值出曲线参数。 */
    _get(offset: number): {
        index: number;
        time: number;
    };
    /** 偏移处的点。 */
    getPointAt(offset: number): Point | null;
    /** 偏移处的切线。 */
    getTangentAt(offset: number): Point | null;
    /** 偏移处的法线。 */
    getNormalAt(offset: number): Point | null;
    /** 偏移处按曲线速度加权的切线。 */
    getWeightedTangentAt(offset: number): Point | null;
    /** 偏移处按曲线速度加权的法线。 */
    getWeightedNormalAt(offset: number): Point | null;
    /** 偏移处的曲率。 */
    getCurvatureAt(offset: number): number;
}
export {};
