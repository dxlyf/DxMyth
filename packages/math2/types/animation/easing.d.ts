/** 缓动函数类型：输入 t∈[0,1]，输出插值后的进度 */
export type EasingFunction = (t: number) => number;
/** 内置缓动名称联合类型 */
export type EasingName = keyof typeof Easing;
/**
 * 内置缓动函数集合
 * 每个函数接收归一化进度 k∈[0,1]，返回缓动后的进度值
 */
export declare const Easing: {
    linear: (k: number) => number;
    quadraticIn: (k: number) => number;
    quadraticOut: (k: number) => number;
    quadraticInOut: (k: number) => number;
    cubicIn: (k: number) => number;
    cubicOut: (k: number) => number;
    cubicInOut: (k: number) => number;
    quarticIn: (k: number) => number;
    quarticOut: (k: number) => number;
    quarticInOut: (k: number) => number;
    quinticIn: (k: number) => number;
    quinticOut: (k: number) => number;
    quinticInOut: (k: number) => number;
    sinusoidalIn: (k: number) => number;
    sinusoidalOut: (k: number) => number;
    sinusoidalInOut: (k: number) => number;
    exponentialIn: (k: number) => number;
    exponentialOut: (k: number) => number;
    exponentialInOut: (k: number) => number;
    circularIn: (k: number) => number;
    circularOut: (k: number) => number;
    circularInOut: (k: number) => number;
    elasticIn: (k: number) => number;
    elasticOut: (k: number) => number;
    elasticInOut: (k: number) => number;
    backIn: (k: number) => number;
    backOut: (k: number) => number;
    backInOut: (k: number) => number;
    bounceIn: (k: number) => number;
    bounceOut: (k: number) => number;
    bounceInOut: (k: number) => number;
};
/**
 * cubic-bezier 自定义缓动函数生成器
 * 使用 Newton 迭代法采样 cubic bezier 曲线
 *
 * @param x1 - 控制点1 x ∈ [0,1]
 * @param y1 - 控制点1 y
 * @param x2 - 控制点2 x ∈ [0,1]
 * @param y2 - 控制点2 y
 * @returns 标准缓动函数 (t: number) => number
 */
export declare function createCubicBezierEasing(x1: number, y1: number, x2: number, y2: number): EasingFunction;
/**
 * 解析缓动参数：支持内置名称字符串 / 自定义函数 / cubic-bezier 元组
 *
 * @example
 *   resolveEasing('cubicOut')     // => Easing.cubicOut
 *   resolveEasing((t) => t * t)   // => (t) => t * t
 *   resolveEasing([0.42, 0, 1, 1])// => cubicBezier easing
 */
export declare function resolveEasing(easing: EasingFunction | EasingName | [number, number, number, number]): EasingFunction;
