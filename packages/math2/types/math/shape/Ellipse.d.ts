import { BoundingRect } from '../BoundingRect';
import { Geometry, PointOut } from './Geometry';
export declare class Ellipse extends Geometry {
    cx: number;
    cy: number;
    radiusX: number;
    radiusY: number;
    constructor(cx?: number, cy?: number, radiusX?: number, radiusY?: number);
    area(): number;
    /**
     * 周长（Ramanujan 近似，精度极高）
     * π [3(a+b) - sqrt((3a+b)(a+3b))]
     */
    perimeter(): number;
    centroid(out?: PointOut): PointOut;
    center(out?: PointOut): PointOut;
    /** 严格内部（不含边界） */
    contains(x: number, y: number): boolean;
    containsInclusive(x: number, y: number): boolean;
    /**
     * 精确带符号距离（数值法）
     * 思路：椭圆点 q(θ) = (cx + a·cosθ, cy + b·sinθ)，最小化 |p - q(θ)|²。
     *       对 θ 求导令 f(θ)=0，用牛顿迭代求最近点对应的参数角 θ*，距离 = |p - q(θ*)|。
     *       先将点反射到第一象限再迭代（带符号坐标下轴点初值会向错误方向发散），
     *       外部点初值取径向近似角 atan2(a·py, b·px)，内部点按 iq 方案取轴点初值 0 或 π/2，
     *       通常 3~6 次迭代即可收敛到双精度精度。
     * 约定：内部为正、外部为负（与 Triangle 等一致）
     */
    signedDistance(x: number, y: number): number;
    /**
     * 带符号距离（解析法：解一元四次方程）
     * 参考：https://iquilezles.org/articles/ellipsedist/
     * 思路：最近点 q(θ) = (cx + a·cosθ, cy + b·sinθ)，令 |p - q(θ)|² 对 θ 导数为 0，
     *       代换 λ = cosθ 化为一元四次方程，利用系数对称性直接解析求解，无需迭代。
     * 注意：近圆（a ≈ b）或极扁时该法数值不稳定（iq 原文亦注明），请优先用于常规椭圆；
     *       a === b 时为圆，直接套圆公式；点在坐标轴上时预解式退化，改走一维解析解。
     * 约定：内部为正、外部为负（与 signedDistance 一致）
     */
    signedDistanceQuartic(x: number, y: number): number;
    getPoints(out?: PointOut[]): PointOut[];
    bounds(out?: BoundingRect): BoundingRect;
    /**
     * 点在坐标轴上的带符号距离（一维解析解）
     * 距离平方 |p - q(θ)|² 的驻点只有两种：sinθ=0（θ=0/π，即轴端点）
     * 或 cosθ = A·d/(A²-B²)（轴外点），取各驻点距离最小值。
     * 约定：内部为正、外部为负。要求 a ≠ b（圆走圆公式，此处避免除零）。
     */
    private _signedDistanceOnAxis;
}
