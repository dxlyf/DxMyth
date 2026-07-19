export type Point = {
    x: number;
    y: number;
};
export type Circle = {
    radius: number;
    center?: Point;
};
export type Rectangle = {
    width: number;
    height: number;
    position?: Point;
};
export type Triangle = {
    sideA: number;
    sideB: number;
    sideC: number;
    vertices?: [Point, Point, Point];
};
export type Square = {
    side: number;
    position?: Point;
};
export type Ellipse = {
    radiusX: number;
    radiusY: number;
    center?: Point;
};
export type Polygon = {
    vertices: Point[];
};
export type Sector = {
    radius: number;
    angle: number;
    center?: Point;
};
export type Ring = {
    outerRadius: number;
    innerRadius: number;
    center?: Point;
};
export type Trapezoid = {
    base1: number;
    base2: number;
    height: number;
    position?: Point;
};
/**
 * 计算两点之间的距离
 */
export declare const distance: (point1: Point, point2: Point) => number;
/**
 * 角度转弧度
 */
export declare const degreesToRadians: (degrees: number) => number;
/**
 * 弧度转角度
 */
export declare const radiansToDegrees: (radians: number) => number;
/**
 * 计算圆的面积
 */
export declare const circleArea: (circle: Circle) => number;
/**
 * 计算圆的周长
 */
export declare const circleCircumference: (circle: Circle) => number;
/**
 * 计算圆的直径
 */
export declare const circleDiameter: (circle: Circle) => number;
/**
 * 计算矩形的面积
 */
export declare const rectangleArea: (rectangle: Rectangle) => number;
/**
 * 计算矩形的周长
 */
export declare const rectanglePerimeter: (rectangle: Rectangle) => number;
/**
 * 计算矩形的对角线长度
 */
export declare const rectangleDiagonal: (rectangle: Rectangle) => number;
/**
 * 使用海伦公式计算三角形面积
 */
export declare const triangleArea: (triangle: Triangle) => number;
/**
 * 计算三角形周长
 */
export declare const trianglePerimeter: (triangle: Triangle) => number;
/**
 * 通过底和高计算三角形面积
 */
export declare const triangleAreaByBaseHeight: (base: number, height: number) => number;
/**
 * 计算正方形的面积
 */
export declare const squareArea: (square: Square) => number;
/**
 * 计算正方形的周长
 */
export declare const squarePerimeter: (square: Square) => number;
/**
 * 计算正方形的对角线长度
 */
export declare const squareDiagonal: (square: Square) => number;
/**
 * 计算椭圆面积
 */
export declare const ellipseArea: (ellipse: Ellipse) => number;
/**
 * 计算椭圆周长（近似公式）
 */
export declare const ellipseCircumference: (ellipse: Ellipse) => number;
/**
 * 计算任意多边形面积（使用鞋带公式）
 */
export declare const polygonArea: (polygon: Polygon) => number;
/**
 * 计算多边形周长
 */
export declare const polygonPerimeter: (polygon: Polygon) => number;
/**
 * 判断点是否在多边形内（使用射线法）
 */
export declare const pointInPolygon: (point: Point, polygon: Polygon) => boolean;
/**
 * 计算扇形面积
 */
export declare const sectorArea: (sector: Sector) => number;
/**
 * 计算扇形弧长
 */
export declare const sectorArcLength: (sector: Sector) => number;
/**
 * 计算圆环面积
 */
export declare const ringArea: (ring: Ring) => number;
/**
 * 计算梯形面积
 */
export declare const trapezoidArea: (trapezoid: Trapezoid) => number;
/**
 * 计算平行四边形面积
 */
export declare const parallelogramArea: (base: number, height: number) => number;
/**
 * 计算菱形面积（通过对角线）
 */
export declare const rhombusAreaByDiagonals: (diagonal1: number, diagonal2: number) => number;
/**
 * 计算菱形面积（通过边长和高）
 */
export declare const rhombusAreaBySideHeight: (side: number, height: number) => number;
/**
 * 判断点是否在圆内
 */
export declare const pointInCircle: (point: Point, circle: Circle) => boolean;
/**
 * 判断点是否在矩形内
 */
export declare const pointInRectangle: (point: Point, rectangle: Rectangle) => boolean;
/**
 * 判断两个圆是否相交
 */
export declare const circlesIntersect: (circle1: Circle, circle2: Circle) => boolean;
/**
 * 判断两个矩形是否相交
 */
export declare const rectanglesIntersect: (rect1: Rectangle, rect2: Rectangle) => boolean;
declare const _default: {
    distance: (point1: Point, point2: Point) => number;
    degreesToRadians: (degrees: number) => number;
    radiansToDegrees: (radians: number) => number;
    circleArea: (circle: Circle) => number;
    circleCircumference: (circle: Circle) => number;
    circleDiameter: (circle: Circle) => number;
    rectangleArea: (rectangle: Rectangle) => number;
    rectanglePerimeter: (rectangle: Rectangle) => number;
    rectangleDiagonal: (rectangle: Rectangle) => number;
    triangleArea: (triangle: Triangle) => number;
    trianglePerimeter: (triangle: Triangle) => number;
    triangleAreaByBaseHeight: (base: number, height: number) => number;
    squareArea: (square: Square) => number;
    squarePerimeter: (square: Square) => number;
    squareDiagonal: (square: Square) => number;
    ellipseArea: (ellipse: Ellipse) => number;
    ellipseCircumference: (ellipse: Ellipse) => number;
    polygonArea: (polygon: Polygon) => number;
    polygonPerimeter: (polygon: Polygon) => number;
    pointInPolygon: (point: Point, polygon: Polygon) => boolean;
    sectorArea: (sector: Sector) => number;
    sectorArcLength: (sector: Sector) => number;
    ringArea: (ring: Ring) => number;
    trapezoidArea: (trapezoid: Trapezoid) => number;
    parallelogramArea: (base: number, height: number) => number;
    rhombusAreaByDiagonals: (diagonal1: number, diagonal2: number) => number;
    rhombusAreaBySideHeight: (side: number, height: number) => number;
    pointInCircle: (point: Point, circle: Circle) => boolean;
    pointInRectangle: (point: Point, rectangle: Rectangle) => boolean;
    circlesIntersect: (circle1: Circle, circle2: Circle) => boolean;
    rectanglesIntersect: (rect1: Rectangle, rect2: Rectangle) => boolean;
};
export default _default;
