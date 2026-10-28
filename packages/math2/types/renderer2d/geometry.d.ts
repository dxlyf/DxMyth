import { IPath2DReadable } from '../math/Path2D';
import { FillRule, LineCap, LineJoin } from './Paint';
/** 扁平坐标轮廓：points 为 [x0, y0, x1, y1, ...]，closed 表示被 closePath 闭合 */
export interface PathContour {
    points: number[];
    closed: boolean;
}
/** CPU 侧三角化结果，positions 为 [x0, y0, x1, y1, ...] */
export interface Mesh2D {
    positions: Float32Array;
    indices: Uint32Array;
}
export declare const EMPTY_MESH: Mesh2D;
export declare function isEmptyMesh(mesh: Mesh2D): boolean;
/** 曲线离散参数 */
export interface FlattenOptions {
    /** 离散误差（用户坐标单位），默认 0.25 */
    tolerance?: number;
}
/** 描边展开参数 */
export interface StrokeOptions {
    lineWidth: number;
    lineCap?: LineCap;
    lineJoin?: LineJoin;
    miterLimit?: number;
    lineDash?: readonly number[];
    lineDashOffset?: number;
}
/**
 * 把路径命令流离散成折线轮廓。
 *
 * 命令流先转交给 `PathBuilder`，由它统一处理圆弧 / 圆角矩形等语义，
 * 再用 `getSubPaths` 按 `tolerance` 把曲线展平成折线，
 * 结果可直接交给三角化器使用。
 */
export declare function flattenPath(path: IPath2DReadable, options?: FlattenOptions): PathContour[];
/**
 * 用 tess2 三角化填充区域。
 *
 * `fillRule` 直接映射到 tess2 的 ODD / NONZERO 环绕规则，
 * 开放轮廓会被隐式闭合（与 canvas fill 一致）。
 */
export declare function tessellateFill(contours: readonly PathContour[], fillRule?: FillRule): Mesh2D;
/**
 * 把折线轮廓展开成描边三角形。
 *
 * 虚线切分交给 `PathDash.dashContours`，描边轮廓交给 `GenerateOutline.generateOutline`
 *（线段矩形 + 拐点补角 + 端点补帽），这里只做单位换算与三角化。
 */
export declare function tessellateStroke(contours: readonly PathContour[], options: StrokeOptions): Mesh2D;
/** 展开后的描边多边形（每项为闭合环的扁平坐标） */
export declare function buildStrokePolygons(contours: readonly PathContour[], options: StrokeOptions): number[][];
