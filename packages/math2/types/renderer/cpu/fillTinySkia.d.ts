import { PolyVertex, FillColor } from './fillScanlineSSAA';
type FillRule = 'evenodd' | 'nonzero';
/**
 * tiny-skia 风格：winding 边扫描 + 4×4 超采样覆盖率填充。
 * @param vertices  多边形顶点（≥3）
 * @param imageData 目标像素缓冲
 * @param color     填充颜色
 * @param fillRule  填充规则，默认 'evenodd'
 */
export declare function fillPolygonTinySkia(vertices: PolyVertex[], imageData: ImageData, color: FillColor, fillRule?: FillRule): void;
export {};
