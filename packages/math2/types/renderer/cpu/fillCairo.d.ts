import { PolyVertex, FillColor } from './fillScanlineSSAA';
/**
 * Cairo 风格：扫描线跨度 + 解析像素覆盖率填充。
 * @param vertices  多边形顶点（≥3）
 * @param imageData 目标像素缓冲
 * @param color     填充颜色
 */
export declare function fillPolygonCairo(vertices: PolyVertex[], imageData: ImageData, color: FillColor): void;
