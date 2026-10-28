/**
 * 移植自 paper/src/util/Formatter.js。
 *
 * 用于序列化和 toString() 的数值格式化：按给定精度渲染数字与点/尺寸类值。
 */
/** {@link Formatter#point} 接受的形状。 */
export interface PointLike {
    x: number;
    y: number;
}
/** {@link Formatter#size} 接受的形状。 */
export interface SizeLike {
    width: number;
    height: number;
}
export declare class Formatter {
    /** 未指定精度时使用的格式化器。 */
    static instance: Formatter;
    /** 小数位数。 */
    precision: number;
    /** 缓存 `10 ^ precision`，供 {@link #number} 使用。 */
    multiplier: number;
    constructor(precision?: number);
    /**
     * 按本格式化器的精度渲染数字。
     * 不使用 Number#toFixed()，因为它会补零；这里直接四舍五入。
     * 精度 >= 16 时原样返回，因为那已接近数字精度的极限（具体会浮动）。
     */
    number(val: number): number;
    pair(val1: number, val2: number, separator?: string): string;
    point(val: PointLike, separator?: string): string;
    size(val: SizeLike, separator?: string): string;
    rectangle(val: PointLike & SizeLike, separator?: string): string;
}
