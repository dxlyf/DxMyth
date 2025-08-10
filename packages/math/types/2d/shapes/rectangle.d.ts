import { Vector2 } from '../math/vec2';
export declare class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number);
    getCenter(): Vector2;
    /**
     * 计算矩形的面积
     * @returns 矩形的面积
     */
    getArea(): number;
    /**
     * 计算矩形的周长
     * @returns 矩形的周长
     */
    getPerimeter(): number;
    distanceTo(x: number, y: number): number;
    /**
     * 判断一个点是否在矩形内
     * @param x 点的 x 坐标
     * @param y 点的 y 坐标
     * @returns 如果点在矩形内返回 true，否则返回 false
     */
    containsPoint(x: number, y: number): boolean;
    containsStroke(x: number, y: number, width: number, alignment?: number): boolean;
}
