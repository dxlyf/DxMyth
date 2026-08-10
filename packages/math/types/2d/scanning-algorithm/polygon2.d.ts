import { Vector2 } from '../math/vec2';
type FillRule = "evenodd" | "nonzero";
export declare const fillPolygon2: (polygons: Vector2[], setPixel: (x: number, y: number, coverage?: number) => void, fillRule?: FillRule) => void;
export declare const fillPolygon: (polygons: Vector2[], setPixel: (x: number, y: number, coverage?: number) => void, fillRule?: FillRule) => void;
export declare const fillPolygonDeepSeek: (polygons: Vector2[], setPixel: (x: number, y: number, coverage?: number) => void, fillRule?: FillRule) => void;
/**
 * @typedef {Object} Vector2
 * @property {number} x
 * @property {number} y
 */
/**
 * @typedef {'nonzero' | 'evenodd'} FillRule
 */
/**
 * 填充多边形，优化抗锯齿效果
 * @param {Vector2[]} polygons - 多边形顶点数组
 * @param {(x: number, y: number, coverage?: number) => void} setPixel - 设置像素的回调函数
 * @param {FillRule} [fillRule='nonzero'] - 填充规则
 */
export declare const fillPolygonGrok: (polygons: Vector2[], setPixel: (x: number, y: number, coverage?: number) => void, fillRule?: FillRule) => void;
export declare class CLAAFill {
    subpixel: number;
    constructor(subpixelScale?: number);
    alignToGrid(points: Vector2[]): Vector2[];
    fill(polygon: Vector2[], setPixel: (x: number, y: number, coverage: number) => void, fillRule?: FillRule): void;
    /**
     * 将一条边 p0→p1 分割成若干段，使得每段端点均落在水平或垂直的网格线上。
     * p0 和 p1 为固定点坐标（单位：subpixel）。
     */
    splitEdge(p0: Vector2, p1: Vector2): {
        x0: number;
        y0: number;
        x1: number;
        y1: number;
    }[];
    /**
     * 根据指定轴（'x' 或 'y'）的网格线分割边段 p0→p1，
     * 返回分割后的段数组，每段格式为 {x0, y0, x1, y1}。
     */
    splitByGrid(p0: Vector2, p1: Vector2, precision: number, axis: string): {
        x0: number;
        y0: number;
        x1: number;
        y1: number;
    }[];
    /**
     * 将一段边对经过的像素单元累加 area 与 cover 值。
     * seg 为 {x0, y0, x1, y1}（固定点坐标）。
     * gridX0, gridY0 用于将固定坐标转换为单元格坐标（像素坐标）。
     */
    accumulateSegment(cells: {
        cover: number;
        area: number;
    }[][], seg: {
        x0: number;
        y0: number;
        x1: number;
        y1: number;
    }, gridX0: number, gridY0: number, precision: number): void;
}
export {};
