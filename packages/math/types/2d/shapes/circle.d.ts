import { BoundingRect } from '../math/bounding_rect';
import { Vector2 } from '../math/vec2';
export declare class Circle {
    cx: number;
    cy: number;
    radius: number;
    constructor(cx: number, cy: number, radius: number);
    clone(): Circle;
    copy(circle: Circle): this;
    setRadius(radius: number): this;
    setCenter(x: number, y: number): this;
    /**
     * 计算圆的面积
     *
     * @returns 返回圆的面积
     */
    getArea(): number;
    /**
     * 计算圆的周长
     *
     * @returns 返回圆的周长
     */
    getCircumference(): number;
    /**
     *  a = (r₁² - r₂² + d²) / (2d)
     * 圆c0和圆c1的交点，线段p0-p1是两个圆的公共弦。
     * P是两个圆的交点,并且在公共弦上
     * Q是c0c1两个圆心的连线,与交点连成的公共弦线，垂直于公共弦。
     * 设直线三角形:c0QP,c1QP
     * d=|c1-c0|
     * 邻边与对边长度:a=|P-Q| b=|Q-c0|
     * r0^2=a^2+b^2
     * r1^2=(d-b)^2+a^2
     * r0^2-r1^2=a^2+b^2-((d-b)^2+a^2)
     * r0^2-r1^2=a^2+b^2-d^2+2db-b^2-a^2
       r0^2-r1^2=-d^2+2db
       r0^2-r1^2+d^2=2db
       (r0^2-r1^2+d^2)/2d=b
     * @param circle
     * @returns
     */
    intersectionFromCircle(circle: Circle): Vector2[];
    distanceTo(x: number, y: number): number;
    contains(x: number, y: number): boolean;
    containsStroke(x: number, y: number, width: number, alignment?: number): boolean;
    containsBoundingRect(x: number, y: number): boolean;
    getBoundingBox(boundingBox: BoundingRect): BoundingRect;
}
