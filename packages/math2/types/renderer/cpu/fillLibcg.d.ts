import { PolyVertex, FillColor } from './fillScanlineSSAA';
/** XCG_FT_Span：一条水平灰度跨度（ftgrays 输出给回调的 span） */
export interface FtSpan {
    x: number;
    len: number;
    y: number;
    coverage: number;
}
/** cg_span_t + cg_span_buffer_t 的 TS 移植（libcg 的 span 缓冲容器） */
export interface CgSpan extends FtSpan {
}
/** cg_span_buffer_t：收集光栅器输出的全部 span + 包围矩形 */
export declare class CgSpanBuffer {
    spans: CgSpan[];
    x: number;
    y: number;
    w: number;
    h: number;
    reset(): void;
    /** cg_span_buffer_add：追加一条 span 并更新包围矩形 */
    add(x: number, y: number, len: number, coverage: number): void;
    /** spans_generation_callback 的等价：批量追加 flush 出来的 span */
    appendBatch(spans: FtSpan[], count: number): void;
    /** cg_span_buffer_contains：点是否被任一 span 覆盖 */
    contains(x: number, y: number): boolean;
}
type FillRule = 'evenodd' | 'nonzero';
/**
 * 消费 span 缓冲：按每个 span 覆盖一段 [x, x+len)，用 CG_DIV255 预乘 alpha
 * 混合到 ImageData（等价 libcg cg_fill_rect_from_spans 的纯色简化版）。
 * @returns 写入的 span 条数
 */
export declare function fillImageFromSpans(spanBuffer: CgSpanBuffer, imageData: ImageData, color: FillColor): number;
/**
 * libcg（ftgrays）风格：cell 精确覆盖面积填充，先生成 span 再绘制。
 *
 * 流程对齐 libcg 的 cg_rasterize：
 *   1. 光栅化把 span 输出到 CgSpanBuffer（对应 spans_generation_callback）
 *   2. fillImageFromSpans 消费 span 缓冲（对应 cg_fill_rect_from_spans）
 *
 * 如需在回调后自行处理 span（裁剪、纹理、渐变等），可改用
 * rasterizeSpans() + fillImageFromSpans() 两阶段调用。
 *
 * @param vertices  多边形顶点（≥3）
 * @param imageData 目标像素缓冲
 * @param color     填充颜色
 * @param fillRule  填充规则，默认 'nonzero'
 */
export declare function fillPolygonLibcg(vertices: PolyVertex[], imageData: ImageData, color: FillColor, fillRule?: FillRule): void;
/**
 * 光栅化：顶点 → cell 累积 → gray_sweep → span 缓冲（cg_span_buffer_t）。
 * @returns 生成的 span 缓冲（spans 数组 + x/y/w/h 包围矩形）
 */
export declare function rasterizeSpans(vertices: PolyVertex[], fillRule?: FillRule): CgSpanBuffer;
export {};
