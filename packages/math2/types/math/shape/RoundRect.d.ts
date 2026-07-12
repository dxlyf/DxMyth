import { BoundingRect } from '../BoundingRect';
import { Geometry, PointOut } from './Geometry';
export declare class RoundRect extends Geometry {
    x: number;
    y: number;
    width: number;
    height: number;
    /** 圆角半径（统一） */
    radius: number;
    constructor(x?: number, y?: number, width?: number, height?: number, radius?: number);
    get right(): number;
    get bottom(): number;
    /** 面积 = 矩形面积 - 4 个角方块（r²） + 4 个四分之一圆（πr²） */
    area(): number;
    centroid(out?: PointOut): PointOut;
    center(out?: PointOut): PointOut;
    /** 周长 = 2(w+h) - 8r + 2πr */
    perimeter(): number;
    /**
     * 点是否在圆角矩形内（不含边界）
     * 算法：
     *   - 在内矩形（去除四角）内 → true
     *   - 在角区域内 → 看是否在对应圆角圆内
     */
    contains(x: number, y: number): boolean;
    /**
     * 带符号距离
     * 内部为正，外部为负
     * 算法：
     *   1. 将点坐标变换到 "角圆心" 坐标系下
     *   2. 用 max(|dx|-innerW, |dy|-innerH) 找到最近的角区域
     *   3. 若在角区域内：距角圆心的距离差
     *   4. 若在内十字区域：min 到四条直边的距离
     */
    signedDistance(x: number, y: number): number;
    bounds(out?: BoundingRect): BoundingRect;
}
