export type Point = {
    x: number;
    y: number;
};
export type Line = {
    start: Point;
    end: Point;
};
export type Polygon = Point[];
export type Rectangle = {
    min: Point;
    max: Point;
};
export declare function clipLineByEdge(line: Line, rect: Rectangle): Line | null;
export declare function cohenSutherlandClip(line: Line, rect: Rectangle): Line | null;
export declare function sutherlandHodgmanClip(polygon: Polygon, rect: Rectangle): Polygon;
export declare function buildClipRect(x: number, y: number, w: number, h: number): number[][];
export declare function sutherlandHodgmanClip2(subjectPolygon: number[][], clipPolygon: number[][]): number[][];
export declare function weilerAthertonClip(subjectPolygon: number[][], clipPolygon: number[][]): number[][];
/**
 * Sutherland-Hodgman 多边形裁剪算法
 * @param subjectPolygon 待裁剪的多边形
 * @param clipWindow 裁剪窗口（凸多边形）
 */
export declare function sutherlandHodgmanClip3(subjectPolygon: Polygon, clipWindow: Polygon): Polygon;
export declare const sutherlandHodgman: (subjectPolygon: PointArray[], clipPolygon: PointArray[]) => PointArray[];
type PointArray = number[];
export declare const weilerAthertonClipper: (polygon: number[][], clipPolygon: number[][]) => number[][][];
export {};
