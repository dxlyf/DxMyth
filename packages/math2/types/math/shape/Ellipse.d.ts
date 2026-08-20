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
     *       对 θ 求导令 f(θ)=0，用牛顿迭代求最近点对应的参数角 θ*，
     *       距离 = |p - q(θ*)|。初值取径向近似点对应的角 atan2(a·dy, b·dx)，
     *       通常 3~6 次迭代即可收敛到双精度精度。
     * 约定：内部为正、外部为负（与 Triangle 等一致）
     */
    signedDistance(x: number, y: number): number;
    getPoints(out?: PointOut[]): PointOut[];
    bounds(out?: BoundingRect): BoundingRect;
}
