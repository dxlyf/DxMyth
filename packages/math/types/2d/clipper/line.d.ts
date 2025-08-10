/***
 * 这是六种不同的直线裁剪方法的 TypeScript 实现，包括：

逐边裁剪法 (Liang-Barsky)
矢量裁剪法 (Nicholl-Lee-Nicholl, 近似实现)
Cohen-Sutherland 编码裁剪法
中点分割算法
直线方程法 (近似为 Liang-Barsky)
Cyrus-Beck 参数化裁剪 (近似实现)

算法	时间复杂度	适用场景	优点
Cohen-Sutherland	O(n)	矩形窗口	快速拒绝不可见线段
中点分割	O(log n)	硬件实现/高精度需求	无浮点运算
Sutherland-Hodgman	O(kn)	任意凸多边形窗口	通用性强
Cyrus-Beck	O(n)	任意凸多边形	参数化计算高效

 */
type Point = {
    x: number;
    y: number;
};
type Rect = {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
};
/** ① 逐边裁剪法 (Liang-Barsky) */
export declare function liangBarsky(p1: Point, p2: Point, rect: Rect): Point[] | null;
/** ② 矢量裁剪法 (Nicholl-Lee-Nicholl) */
export declare function nichollLeeNicholl(p1: Point, p2: Point, rect: Rect): Point[] | null;
export declare function cohenSutherland(p1: Point, p2: Point, rect: Rect): Point[] | null;
/** ④ 中点分割算法 */
export declare function midpointSubdivision(p1: Point, p2: Point, rect: Rect): Point[] | null;
/** ⑤ 直线方程法 */
export declare function equationBasedClipping(p1: Point, p2: Point, rect: Rect): Point[] | null;
/** ⑥ Cyrus-Beck 参数化裁剪算法 */
export declare function cyrusBeck(p1: Point, p2: Point, rect: Rect): Point[] | null;
export declare const CohenSutherlandClip: (line: [Point, Point], bounds: {
    left: number;
    right: number;
    top: number;
    bottom: number;
}) => [Point, Point] | null;
export declare const SutherlandHodgmanClip: (line: [Point, Point], edges: {
    normal: [number, number];
    point: Point;
}[]) => Point[];
export declare const MidpointClip: (line: [Point, Point], bounds: {
    left: number;
    right: number;
    top: number;
    bottom: number;
}, epsilon?: number) => [Point, Point] | null;
export {};
