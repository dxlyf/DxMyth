export declare const PI: number;
export declare const PI2: number;
export declare const PI_2: number;
export declare const BEZIER_CIRCLE_GOLDEN_RATIO: number;
export declare function calcArcGoldenRatio(delta: number): number;
export declare function calcArcSteps(sweepAngle: number): number;
export declare function allAreFinite(args: number[]): boolean;
export declare function equalsEpsilon(a: number, b: number, epsilon?: number): boolean;
export declare function radiansToDegrees(radians: number): number;
export declare function degreesToRadians(degrees: number): number;
export declare function sqrt(n: number): number;
export declare function pow(base: number, exponent: number): number;
export declare function abs(n: number): number;
export declare function min(n1: number, n2: number): number;
export declare function max(n1: number, n2: number): number;
export declare function random(min: number, max: number): number;
export declare function derivative(fn: (x: number) => number, x: number, dx?: number): number;
export declare function factorial(n: number): number;
export declare function nCr(n: number, r: number): number;
export declare function nPr(n: number, r: number): number;
/**
 *
 * @param value 映射值
 * @param inMin 定义域domain 输入
 * @param inMax
 * @param outMin 值域range 输出
 * @param outMax
 * @returns
 */
export declare function map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number;
export declare function clamp(value: number, min: number, max: number): number;
export declare function lerp(start: number, end: number, t: number): number;
export declare function inverseLerp(start: number, end: number, value: number): number;
export declare function smoothstep(start: number, end: number, amount: number): number;
export declare function easeInOut(start: number, end: number, amount: number): number;
export declare function easeIn(start: number, end: number, amount: number): number;
export declare function easeOut(start: number, end: number, amount: number): number;
type Constructor<T = {}> = new (...args: any[]) => T;
export declare function createMixin<M>(mixin: M): <T extends Constructor>(Base: T) => T & Constructor<M>;
export {};
