import { PathItem } from './PathItem';
/** `offset()` 的选项。 */
export interface OffsetOptions {
    /** 路径转向外侧时拐角的形状。 */
    join?: 'miter' | 'round' | 'bevel';
    /** 斜接拐角的长度上限。 */
    miterLimit?: number;
}
/** `outline()` 的选项。 */
export interface OutlineOptions extends OffsetOptions {
    /** 描边宽度。没有 Style，默认 0，调用方必须显式传入。 */
    width?: number;
    /** 描边端点的形状。 */
    cap?: 'round' | 'square' | 'butt';
}
/**
 * 按距离偏移路径项。闭合路径与复合路径在正距离时外扩、负距离时收缩；开放
 * 路径在正距离时沿法线偏移，负距离时反向。
 */
export declare function offsetItem(item: PathItem, distance: number, options?: OffsetOptions): PathItem;
/**
 * 返回路径项描边覆盖的区域。宽度只能来自 `options.width`（没有 Style），
 * 默认 0，调用方必须显式传入。
 */
export declare function outlineItem(item: PathItem, options?: OutlineOptions): PathItem;
