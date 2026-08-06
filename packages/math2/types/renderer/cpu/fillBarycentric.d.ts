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
 * 用重心坐标填充三角形：内部全覆盖，边缘按重心坐标权重生成抗锯齿 alpha。
 * 顶点从 vertices 取前 3 个（多余顶点忽略，本填充仅针对三角形）。
 *
 * 抗锯齿实现：
 *   重心坐标权重 u/v/w 分别等于 P 到 BC/CA/AB 的距离 ÷ 该边上的高，
 *   所以「权重 × 高」就是 P 到对应边的带符号距离（像素单位，负值在外）。
 *   取三个距离的最小值 dMin（离最近边），
 *   alpha = clamp(0.5 + dMin / aaWidth)，aaWidth = 1 像素。
 *
 * @param vertices  三角形顶点（取前 3 个）
 * @param imageData 目标像素缓冲
 * @param color     填充颜色
 */
export declare function fillTriangleBarycentric(vertices: PolyVertex[], imageData: ImageData, color: FillColor): void;
