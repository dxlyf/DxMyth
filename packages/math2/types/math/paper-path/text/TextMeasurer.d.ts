/**
 * 文本测量后端。
 *
 * 移植自 paper/src/view/View.js 的 `getTextWidth()` / `getFontMetrics()`
 * （第 529、555 行），但把 canvas 依赖收进可注入的接口里：
 * 模块加载时不碰 DOM，Node 下 import 本文件不会报错。
 */
/** 字体的 ascent / descent。 */
export interface FontMetrics {
    ascent: number;
    descent: number;
}
/** 字体测量后端。 */
export interface TextMeasurer {
    /** 多行文本的最大宽度。 */
    getTextWidth(font: string, lines: string[], letterSpacing?: number | string, direction?: string): number;
    /** 字体的 ascent / descent，取不到时返回 null。 */
    getFontMetrics(font: string): FontMetrics | null;
}
/** 设置自定义测量器；传 null 表示恢复为惰性创建浏览器测量器。 */
export declare function setTextMeasurer(value: TextMeasurer | null): void;
/**
 * 取当前测量器：
 * 1. 已通过 {@link setTextMeasurer} 设置则直接返回；
 * 2. 否则在有 DOM 的环境里惰性创建 canvas 测量器；
 * 3. 都没有时抛出清晰的错误。
 */
export declare function getTextMeasurer(): TextMeasurer;
/**
 * 浏览器实现：用离屏 canvas 的 measureText 测量。
 *
 * 只有调用本函数时才会访问 DOM，因此模块本身可以在 Node 里安全加载。
 */
export declare function createCanvasTextMeasurer(): TextMeasurer;
