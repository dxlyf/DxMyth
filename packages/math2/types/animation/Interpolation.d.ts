/** 线性插值 */
export declare function lerp(a: number, b: number, t: number): number;
/** 对纯对象进行插值（浅层遍历） */
export declare function lerpObject<T extends Record<string, number>>(a: T, b: T, t: number): T;
/** 对一维数组进行插值 */
export declare function lerpArray(a: number[], b: number[], t: number, out?: number[]): number[];
/** 对二维数组进行插值 */
export declare function lerpArray2D(a: number[][], b: number[][], t: number, out?: number[][]): number[][];
/**
 * 对 rgba 颜色数组进行插值
 * 颜色格式: [r, g, b, a] 各分量 0-255, alpha 0-1
 */
export declare function lerpColor(a: number[], b: number[], t: number, out?: number[]): number[];
/** 判断值是否为数字 */
export declare function isNumberValue(v: unknown): v is number;
/** 判断值是否为数字一维数组 */
export declare function isNumberArray(v: unknown): v is number[];
/** 判断值是否为数字二维数组 */
export declare function isNumberArray2D(v: unknown): v is number[][];
/** 自动检测类型并进行插值 */
export declare function interpolateValue(a: unknown, b: unknown, t: number): unknown;
