/** 多边形顶点（网格浮点坐标，如 {x:2.3, y:5.6}） */
export interface PolyVertex {
    x: number;
    y: number;
}
/** 填充颜色（0-255） */
export interface FillColor {
    r: number;
    g: number;
    b: number;
}
/**
 * 扫描线 + 超采样抗锯齿填充。
 * @param vertices   多边形顶点（≥3 个，首尾自动闭合）
 * @param imageData  目标像素缓冲（每个格子 = 1 个像素）
 * @param color      填充颜色
 * @param subSamples 每像素 y 方向子采样数（越大越平滑、越慢）
 */
export declare function fillPolygonSSAA(vertices: PolyVertex[], imageData: ImageData, color: FillColor, subSamples?: number): void;
