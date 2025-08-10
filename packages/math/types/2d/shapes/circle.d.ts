import { BoundingRect } from '../math/bounding_rect';
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
    distanceTo(x: number, y: number): number;
    contains(x: number, y: number): boolean;
    containsStroke(x: number, y: number, width: number, alignment?: number): boolean;
    containsBoundingRect(x: number, y: number): boolean;
    getBoundingBox(boundingBox: BoundingRect): BoundingRect;
}
