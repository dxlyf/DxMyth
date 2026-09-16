import { Vector2Like } from '../Vector2';
import { Shape } from './Shape';
export declare class ShapeUtils {
    static addShapes(shapes: Shape[], curveSegments?: number): {
        vertices: number[];
        normals: number[];
        uvs: number[];
        indices: number[];
    };
    /**
     * 计算 2D 轮廓多边形面积（鞋带公式）。
     * @param contour 2D 点数组
     */
    static area(contour: Vector2Like[]): number;
    /**
     * 判断轮廓是否为顺时针绕向。
     * @param pts 定义多边形的 2D 点数组
     */
    static isClockWise(pts: Vector2Like[]): boolean;
    /**
     * 三角化形状定义（外轮廓 + 孔洞）。
     * @param contour 外轮廓点数组
     * @param holes 孔洞点数组的数组
     * @return 每个面为三个顶点的索引数组
     */
    static triangulateShape(contour: Vector2Like[], holes: Vector2Like[][]): number[][];
}
