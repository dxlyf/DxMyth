import { PointLike } from './Point';
import { BoundingRect } from './BoundingRect';
export declare class Conic {
    /** 控制点 [P0, P1, P2] */
    points: PointLike[];
    /** 权重 w，P0 和 P2 恒为 1 */
    weight: number;
    /** 创建 conic */
    constructor(points: PointLike[], weight: number);
    get p0(): PointLike;
    get p1(): PointLike;
    get p2(): PointLike;
    get w(): number;
    setWeight(w: number): void;
    /** 计算曲线上参数 t ∈ [0,1] 处的点 */
    evaluate(t: number): PointLike;
    /** 计算曲线上 t 处的切向量（长度任意，仅方向有意义） */
    evaluateTangentAt(t: number): PointLike;
    /** 同时求值和求切线 */
    evaluateWithTangent(t: number): {
        point: PointLike;
        tangent: PointLike;
    };
    /**
     * 在参数 t 处分割，返回两段 conic
     * 基于有理 de Casteljau（在 3D 中做普通 de Casteljau 再投影）
     */
    chopAt(t: number): [Conic, Conic] | null;
    /** 在 t=0.5 处分割 */
    chop(): [Conic, Conic];
    /** 计算用二次贝塞尔近似此 conic 的误差向量 */
    computeAsQuadError(): PointLike;
    /** 判断用二次贝塞尔近似是否在容差内 */
    asQuadTol(tol: number): boolean;
    /** 计算近似所需二次曲线的 2 的幂次数 */
    computeQuadPOW2(tol: number): number;
    /**
     * 将 conic 近似为 2^pow2 段二次贝塞尔曲线
     * 返回点数组，相邻三段为一段二次贝塞尔 [p0,p1,p2, p0,p1,p2, ...]
     * 相邻段共享端点，总点数 = 2 * 2^pow2 + 1
     */
    chopIntoQuadsPOW2(pow2: number): PointLike[];
    /** 递归细分，返回中间点（不含首尾） */
    private _subdivide;
    private _between;
    /**
     * 将 conic 转为二次贝塞尔曲线数组
     * @param tol - 近似容差，默认 0.25
     * @returns QuadraticBezier 控制点数组 [[p0,p1,p2], [p0,p1,p2], ...]
     */
    toQuadraticBeziers(tol?: number): PointLike[][];
    /** 查找 X 极值的参数 t */
    findXExtrema(): number | null;
    /** 查找 Y 极值的参数 t */
    findYExtrema(): number | null;
    private _findExtrema;
    /** 在 X 极值处分割 */
    chopAtXExtrema(): [Conic, Conic] | null;
    /** 在 Y 极值处分割 */
    chopAtYExtrema(): [Conic, Conic] | null;
    /** 计算紧凑包围盒 */
    computeTightBounds(): BoundingRect;
    /** 计算快速包围盒（仅用控制点） */
    computeFastBounds(): BoundingRect;
    /** 获取包围盒（紧凑版） */
    getBounds(): BoundingRect;
    /** 找到中间切线的参数 t */
    findMidTangent(): number;
}
