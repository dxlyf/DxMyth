import { PolyVertex, FillColor } from './fillScanlineSSAA';
/**
 * Skia 风格：解析边缘覆盖率填充。
 * @param vertices  多边形顶点（≥3）
 * @param imageData 目标像素缓冲
 * @param color     填充颜色
 */
export declare function fillPolygonSkia(vertices: PolyVertex[], imageData: ImageData, color: FillColor): void;
