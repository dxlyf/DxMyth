import { PolyVertex, FillColor } from './fillScanlineSSAA';
/**
 * FreeType 风格：精确 cell 覆盖 + 纯定点（26.6）灰度抗锯齿填充。
 * @param vertices  多边形顶点（≥3）
 * @param imageData 目标像素缓冲
 * @param color     填充颜色
 */
export declare function fillPolygonFreeType(vertices: PolyVertex[], imageData: ImageData, color: FillColor): void;
