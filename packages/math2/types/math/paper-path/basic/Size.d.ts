/**
 * 移植自 paper/src/basic/Size.js，只保留几何核心。
 *
 * 构造形式只有 `new Size(width, height)`。不移植参数解析机制、序列化，以及
 * 供 Item 边界使用的 LinkedSize。
 */
export declare class Size {
    width: number;
    height: number;
    constructor(width?: number, height?: number);
    /** 同时设置两个维度。 */
    _set(width: number, height: number): this;
    equals(size: Size): boolean;
    clone(): Size;
    toString(): string;
    /** 尺寸的维度数组，`[width, height]`。 */
    get values(): number[];
    add(value: Size | number): Size;
    subtract(value: Size | number): Size;
    multiply(value: Size | number): Size;
    divide(value: Size | number): Size;
    modulo(value: Size | number): Size;
    /** 两个维度都取负的新尺寸。 */
    negate(): Size;
    /** 两个维度是否都在 1e-12 容差内为 0。 */
    isZero(): boolean;
    /** 是否有一个维度是 NaN。 */
    isNaN(): boolean;
    round(): Size;
    ceil(): Size;
    floor(): Size;
    abs(): Size;
    /** 取两个尺寸中宽高各自最小的新尺寸。 */
    static min(size1: Size, size2: Size): Size;
    /** 取两个尺寸中宽高各自最大的新尺寸。 */
    static max(size1: Size, size2: Size): Size;
    /** 宽高为 0 到 1 之间随机值的尺寸。 */
    static random(): Size;
}
