export declare class Triangle {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x3: number;
    y3: number;
    constructor(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number);
    /**
     * 计算三角形的面积（使用向量叉积法）
     * @returns 三角形的面积
     */
    getArea(): number;
    /**
     * 判断一个点是否在三角形内（使用面积法）
     * @param px 点的 x 坐标
     * @param py 点的 y 坐标
     * @returns 如果点在三角形内返回 true，否则返回 false
     */
    containsPoint(px: number, py: number): boolean;
    /**
     * 计算给定点相对于当前三角形的重心坐标
     * @param px 点的 x 坐标
     * @param py 点的 y 坐标
     * @returns 包含重心坐标 (u, v, w) 的对象，如果点不在三角形内，返回 null
     */
    getBarycentricCoordinates(px: number, py: number): {
        u: number;
        v: number;
        w: number;
    } | null;
}
