import { Vector2, Vector2Like } from './vec2';
/**
 * 计算两条无限直线的交点
 * 使用参数方程求解，不考虑线段长度限制
 * @param p1 第一条直线的起点
 * @param p2 第一条直线的终点
 * @param p3 第二条直线的起点
 * @param p4 第二条直线的终点
 * @returns 返回交点坐标，如果两条线平行则返回 null
 */
declare function lineLineIntersection(p1: Vector2Like, p2: Vector2Like, p3: Vector2Like, p4: Vector2Like): Vector2 | null;
/**
 * 计算两条线段的交点（有限线段）
 * 使用克莱姆法则直接求解参数方程，然后验证交点是否在线段范围内
 * @param p1 第一条线段的起点
 * @param p2 第一条线段的终点
 * @param p3 第二条线段的起点
 * @param p4 第二条线段的终点
 * @returns 交点坐标，如果不相交则返回 null
 */
declare function lineSegmentIntersection(p1: Vector2Like, p2: Vector2Like, p3: Vector2Like, p4: Vector2Like): Vector2 | null;
/**
 * 检查点是否在线段上
 * 使用叉积判断共线，点积判断在线段范围内
 * @param point 要检查的点
 * @param segStart 线段起点
 * @param segEnd 线段终点
 * @returns 如果点在线段上返回 true，否则返回 false
 */
declare function isPointOnLineSegment(point: Vector2Like, segStart: Vector2Like, segEnd: Vector2Like): boolean;
/**
 * 检查点是否在圆内
 * 使用距离平方比较避免开方运算，提高性能
 * @param point 要检查的点
 * @param center 圆心坐标
 * @param radius 圆的半径
 * @returns 如果点在圆内或圆上返回 true，否则返回 false
 */
declare function pointInCircle(point: Vector2Like, center: Vector2Like, radius: number): boolean;
/**
 * 检查点是否在矩形内（轴对齐矩形）
 * 使用简单的边界检查，性能最优
 * @param point 要检查的点
 * @param rectMin 矩形最小角坐标（左下角）
 * @param rectMax 矩形最大角坐标（右上角）
 * @returns 如果点在矩形内或边上返回 true，否则返回 false
 */
declare function pointInRect(point: Vector2Like, rectMin: Vector2Like, rectMax: Vector2Like): boolean;
/**
 * 检查点是否在多边形内
 * 使用射线法（Ray Casting Algorithm），从点向右发射射线，计算与多边形边的交点数
 * @param point 要检查的点
 * @param vertices 多边形顶点数组，按顺时针或逆时针顺序排列
 * @returns 如果点在多边形内或边上返回 true，否则返回 false
 */
declare function pointInPolygon(point: Vector2Like, vertices: Vector2Like[]): boolean;
/**
 * 检查两个圆是否相交
 * 使用距离平方比较避免开方运算，提高性能
 * @param center1 第一个圆的圆心
 * @param radius1 第一个圆的半径
 * @param center2 第二个圆的圆心
 * @param radius2 第二个圆的半径
 * @returns 如果两圆相交或相切返回 true，否则返回 false
 */
declare function circleCircle(center1: Vector2Like, radius1: number, center2: Vector2Like, radius2: number): boolean;
/**
 * 检查两个轴对齐矩形是否相交
 * 使用分离轴定理的简化版本，性能最优
 * @param min1 第一个矩形的最小角坐标
 * @param max1 第一个矩形的最大角坐标
 * @param min2 第二个矩形的最小角坐标
 * @param max2 第二个矩形的最大角坐标
 * @returns 如果两矩形相交或相切返回 true，否则返回 false
 */
declare function rectRect(min1: Vector2Like, max1: Vector2Like, min2: Vector2Like, max2: Vector2Like): boolean;
/**
 * 检查圆与矩形是否相交
 * 找到矩形上距离圆心最近的点，然后检查该点是否在圆内
 * @param center 圆心坐标
 * @param radius 圆的半径
 * @param rectMin 矩形最小角坐标
 * @param rectMax 矩形最大角坐标
 * @returns 如果圆与矩形相交或相切返回 true，否则返回 false
 */
declare function circleRect(center: Vector2Like, radius: number, rectMin: Vector2Like, rectMax: Vector2Like): boolean;
/**
 * 检查线段与圆是否相交
 * 使用二次方程求解线段与圆的交点，避免开方运算提高性能
 * @param p1 线段起点
 * @param p2 线段终点
 * @param center 圆心坐标
 * @param radius 圆的半径
 * @returns 如果线段与圆相交或相切返回 true，否则返回 false
 */
declare function lineCircle(p1: Vector2Like, p2: Vector2Like, center: Vector2Like, radius: number): boolean;
/**
 * 检查线段与矩形是否相交
 * 首先检查线段端点是否在矩形内，然后检查线段是否与矩形四条边相交
 * @param p1 线段起点
 * @param p2 线段终点
 * @param rectMin 矩形最小角坐标
 * @param rectMax 矩形最大角坐标
 * @returns 如果线段与矩形相交或相切返回 true，否则返回 false
 */
declare function lineRect(p1: Vector2Like, p2: Vector2Like, rectMin: Vector2Like, rectMax: Vector2Like): boolean;
/**
 * 检查两个多边形是否相交
 * 使用分离轴定理（SAT）的简化版本：检查顶点包含和边相交
 * @param vertices1 第一个多边形的顶点数组
 * @param vertices2 第二个多边形的顶点数组
 * @returns 如果两多边形相交返回 true，否则返回 false
 */
declare function polygonPolygon(vertices1: Vector2Like[], vertices2: Vector2Like[]): boolean;
/**
 * 检查圆与多边形是否相交
 * 结合多种检测方法：顶点在圆内、圆心在多边形内、边与圆相交
 * @param center 圆心坐标
 * @param radius 圆的半径
 * @param vertices 多边形顶点数组
 * @returns 如果圆与多边形相交返回 true，否则返回 false
 */
declare function circlePolygon(center: Vector2Like, radius: number, vertices: Vector2Like[]): boolean;
/**
 * 射线检测，计算射线与障碍物的交点
 * 支持圆形和矩形障碍物，返回所有交点按距离排序
 * @param origin 射线起点
 * @param direction 射线方向（不需要归一化）
 * @param maxDistance 射线最大检测距离
 * @param obstacles 障碍物数组，支持圆形和矩形
 * @returns 命中点数组，包含交点坐标、距离和法向量
 */
declare function raycast(origin: Vector2Like, direction: Vector2Like, maxDistance: number, obstacles: Array<{
    type: 'circle' | 'rect' | 'polygon';
    data: any;
}>): Array<{
    point: Vector2;
    distance: number;
    normal: Vector2;
}>;
/**
 * 计算点到线段的最短距离
 * 使用投影法，先计算点在线段上的投影，然后计算距离
 * @param point 要计算距离的点
 * @param segStart 线段起点
 * @param segEnd 线段终点
 * @returns 点到线段的最短距离
 */
declare function distanceToLineSegment(point: Vector2Like, segStart: Vector2Like, segEnd: Vector2Like): number;
/**
 * 找到线段上距离指定点最近的点
 * 使用投影法，返回线段上的最近点坐标
 * @param point 指定的点
 * @param segStart 线段起点
 * @param segEnd 线段终点
 * @returns 线段上距离指定点最近的点
 */
declare function closestPointOnLineSegment(point: Vector2Like, segStart: Vector2Like, segEnd: Vector2Like): Vector2;
/**
 * 计算线段与圆的交点
 * 使用二次方程求解，返回所有交点
 * @param p1 线段起点
 * @param p2 线段终点
 * @param center 圆心坐标
 * @param radius 圆的半径
 * @returns 交点数组，如果不相交则返回空数组
 */
declare function lineCircleIntersections(p1: Vector2Like, p2: Vector2Like, center: Vector2Like, radius: number): Vector2[];
/**
 * 计算线段与矩形的交点
 * 检查线段与矩形四条边的交点
 * @param p1 线段起点
 * @param p2 线段终点
 * @param rectMin 矩形最小角坐标
 * @param rectMax 矩形最大角坐标
 * @returns 交点数组，如果不相交则返回空数组
 */
declare function lineRectIntersections(p1: Vector2Like, p2: Vector2Like, rectMin: Vector2Like, rectMax: Vector2Like): Vector2[];
/**
 * 计算两个圆的交点
 * 使用几何方法求解两圆交点
 * @param center1 第一个圆的圆心
 * @param radius1 第一个圆的半径
 * @param center2 第二个圆的圆心
 * @param radius2 第二个圆的半径
 * @returns 交点数组，如果不相交则返回空数组
 */
declare function circleCircleIntersections(center1: Vector2Like, radius1: number, center2: Vector2Like, radius2: number): Vector2[];
/**
 * 计算两个轴对齐矩形的交点
 * 返回两个矩形重叠区域的角点
 * @param min1 第一个矩形的最小角坐标
 * @param max1 第一个矩形的最大角坐标
 * @param min2 第二个矩形的最小角坐标
 * @param max2 第二个矩形的最大角坐标
 * @returns 交点数组（重叠区域的角点），如果不相交则返回空数组
 */
declare function rectRectIntersections(min1: Vector2Like, max1: Vector2Like, min2: Vector2Like, max2: Vector2Like): Vector2[];
/**
 * 计算圆与矩形的交点
 * 结合多种方法：圆与矩形边的交点
 * @param center 圆心坐标
 * @param radius 圆的半径
 * @param rectMin 矩形最小角坐标
 * @param rectMax 矩形最大角坐标
 * @returns 交点数组，如果不相交则返回空数组
 */
declare function circleRectIntersections(center: Vector2Like, radius: number, rectMin: Vector2Like, rectMax: Vector2Like): Vector2[];
/**
 * 计算两个多边形的交点
 * 检查所有边的交点
 * @param vertices1 第一个多边形的顶点数组
 * @param vertices2 第二个多边形的顶点数组
 * @returns 交点数组，如果不相交则返回空数组
 */
declare function polygonPolygonIntersections(vertices1: Vector2Like[], vertices2: Vector2Like[]): Vector2[];
/**
 * 计算圆与多边形的交点
 * 检查圆与多边形每条边的交点
 * @param center 圆心坐标
 * @param radius 圆的半径
 * @param vertices 多边形顶点数组
 * @returns 交点数组，如果不相交则返回空数组
 */
declare function circlePolygonIntersections(center: Vector2Like, radius: number, vertices: Vector2Like[]): Vector2[];
/**
 * 线段与两次贝塞尔曲线求交点
 * 直线隐式方程：Ax+By+C=0
 * 二次贝塞尔曲线参数方程：B(t)=(x(t),y(t))=(1-t)²p0+2(1-t)p1+t²p2，t∈[0,1]
 * 多项式展开形式：(p0-2p1+p2)t^2+2(p1-p0)t+p0
 * A=p0-2p1+p2
 * B=2(p1-p0)
 * C=p0
 * B(t)=At^2+Bt+C,x(t)=Axt^2+Bxt+Cx,y(t)=Ayt^2+Byt+Cy
 *
 * 代入直线隐式方程：Ax(t)+By(t)+C=0
 * 得到一个关于求解t 的一元二次方程：At^2+Bt+C=0
 */
declare function lineQuadraticBezierIntersections(start: Vector2Like, end: Vector2Like, cp: Vector2Like[]): Vector2Like[];
export { lineLineIntersection, // 直线-直线相交检测
lineSegmentIntersection, // 线段-线段相交检测
isPointOnLineSegment, // 点是否在线段上检测
pointInCircle, // 点-圆相交检测
pointInRect, // 点-矩形相交检测
pointInPolygon, // 点-多边形相交检测
circleCircle, // 圆-圆相交检测
rectRect, // 矩形-矩形相交检测
circleRect, // 圆-矩形相交检测
lineCircle, // 线段-圆相交检测
lineRect, // 线段-矩形相交检测
polygonPolygon, // 多边形-多边形相交检测
circlePolygon, // 圆-多边形相交检测
raycast, // 射线检测
distanceToLineSegment, // 点到线段距离计算
closestPointOnLineSegment, // 线段上最近点计算
lineCircleIntersections, // 线段-圆交点计算
lineRectIntersections, // 线段-矩形交点计算
circleCircleIntersections, // 圆-圆交点计算
rectRectIntersections, // 矩形-矩形交点计算
circleRectIntersections, // 圆-矩形交点计算
polygonPolygonIntersections, // 多边形-多边形交点计算
circlePolygonIntersections, // 圆-多边形交点计算
lineQuadraticBezierIntersections };
