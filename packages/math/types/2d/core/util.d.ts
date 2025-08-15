import { Dictionary, ArrayLike, KeyOfDistributive } from './types';
declare const nativeSlice: (start?: number, end?: number) => any[];
/**
 * Generate unique id
 */
export declare function guid(): number;
export declare function logError(...args: any[]): void;
/**
 * Those data types can be cloned:
 *     Plain object, Array, TypedArray, number, string, null, undefined.
 * Those data types will be assigned using the original data:
 *     BUILTIN_OBJECT
 * Instance of user defined class will be cloned to a plain object, without
 * properties in prototype.
 * Other data types is not supported (not sure what will happen).
 *
 * Caution: do not support clone Date, for performance consideration.
 * (There might be a large number of date in `series.data`).
 * So date should not be modified in and out of echarts.
 */
export declare function clone<T extends any>(source: T): T;
export declare function merge<T extends Dictionary<any>, S extends Dictionary<any>>(target: T, source: S, overwrite?: boolean): T & S;
export declare function merge<T extends any, S extends any>(target: T, source: S, overwrite?: boolean): T | S;
/**
 * @param targetAndSources The first item is target, and the rests are source.
 * @param overwrite
 * @return Merged result
 */
export declare function mergeAll(targetAndSources: any[], overwrite?: boolean): any;
export declare function extend<T extends Dictionary<any>, S extends Dictionary<any>>(target: T, source: S): T & S;
export declare function defaults<T extends Dictionary<any>, S extends Dictionary<any>>(target: T, source: S, overlay?: boolean): T & S;
export declare const createCanvas: () => HTMLCanvasElement;
/**
 * 查询数组中元素的index
 */
export declare function indexOf<T>(array: T[] | readonly T[] | ArrayLike<T>, value: T): number;
/**
 * 构造类继承关系
 *
 * @param clazz 源类
 * @param baseClazz 基类
 */
export declare function inherits(clazz: Function, baseClazz: Function): void;
export declare function mixin(target: any, source: any, override?: boolean): void;
/**
 * Consider typed array.
 * @param data
 */
export declare function isArrayLike(data: any): data is ArrayLike<any>;
/**
 * 数组或对象遍历
 */
export declare function each<I extends Dictionary<any> | any[] | readonly any[] | ArrayLike<any>, Context>(arr: I, cb: (this: Context, value: I extends (infer T)[] | readonly (infer T)[] | ArrayLike<infer T> ? T : I extends Dictionary<any> ? I extends Record<infer K, infer T> ? T : unknown : unknown, index?: I extends any[] | readonly any[] | ArrayLike<any> ? number : keyof I & string, // keyof Dictionary will return number | string
arr?: I) => void, context?: Context): void;
/**
 * Array mapping.
 * @typeparam T Type in Array
 * @typeparam R Type Returned
 * @return Must be an array.
 */
export declare function map<T, R, Context>(arr: readonly T[], cb: (this: Context, val: T, index?: number, arr?: readonly T[]) => R, context?: Context): R[];
export declare function reduce<T, S, Context>(arr: readonly T[], cb: (this: Context, previousValue: S, currentValue: T, currentIndex?: number, arr?: readonly T[]) => S, memo?: S, context?: Context): S;
/**
 * Array filtering.
 * @return Must be an array.
 */
export declare function filter<T, Context>(arr: readonly T[], cb: (this: Context, value: T, index: number, arr: readonly T[]) => boolean, context?: Context): T[];
/**
 * 数组项查找
 */
export declare function find<T, Context>(arr: readonly T[], cb: (this: Context, value: T, index?: number, arr?: readonly T[]) => boolean, context?: Context): T;
/**
 * Get all object keys
 *
 * Will return an empty array if obj is null/undefined
 */
export declare function keys<T extends object>(obj: T): (KeyOfDistributive<T> & string)[];
export type Bind1<F, Ctx> = F extends (this: Ctx, ...args: infer A) => infer R ? (...args: A) => R : unknown;
export type Bind2<F, Ctx, T1> = F extends (this: Ctx, a: T1, ...args: infer A) => infer R ? (...args: A) => R : unknown;
export type Bind3<F, Ctx, T1, T2> = F extends (this: Ctx, a: T1, b: T2, ...args: infer A) => infer R ? (...args: A) => R : unknown;
export type Bind4<F, Ctx, T1, T2, T3> = F extends (this: Ctx, a: T1, b: T2, c: T3, ...args: infer A) => infer R ? (...args: A) => R : unknown;
export type Bind5<F, Ctx, T1, T2, T3, T4> = F extends (this: Ctx, a: T1, b: T2, c: T3, d: T4, ...args: infer A) => infer R ? (...args: A) => R : unknown;
type BindFunc<Ctx> = (this: Ctx, ...arg: any[]) => any;
interface FunctionBind {
    <F extends BindFunc<Ctx>, Ctx>(func: F, ctx: Ctx): Bind1<F, Ctx>;
    <F extends BindFunc<Ctx>, Ctx, T1 extends Parameters<F>[0]>(func: F, ctx: Ctx, a: T1): Bind2<F, Ctx, T1>;
    <F extends BindFunc<Ctx>, Ctx, T1 extends Parameters<F>[0], T2 extends Parameters<F>[1]>(func: F, ctx: Ctx, a: T1, b: T2): Bind3<F, Ctx, T1, T2>;
    <F extends BindFunc<Ctx>, Ctx, T1 extends Parameters<F>[0], T2 extends Parameters<F>[1], T3 extends Parameters<F>[2]>(func: F, ctx: Ctx, a: T1, b: T2, c: T3): Bind4<F, Ctx, T1, T2, T3>;
    <F extends BindFunc<Ctx>, Ctx, T1 extends Parameters<F>[0], T2 extends Parameters<F>[1], T3 extends Parameters<F>[2], T4 extends Parameters<F>[3]>(func: F, ctx: Ctx, a: T1, b: T2, c: T3, d: T4): Bind5<F, Ctx, T1, T2, T3, T4>;
}
export declare const bind: FunctionBind;
export type Curry1<F, T1> = F extends (a: T1, ...args: infer A) => infer R ? (...args: A) => R : unknown;
export type Curry2<F, T1, T2> = F extends (a: T1, b: T2, ...args: infer A) => infer R ? (...args: A) => R : unknown;
export type Curry3<F, T1, T2, T3> = F extends (a: T1, b: T2, c: T3, ...args: infer A) => infer R ? (...args: A) => R : unknown;
export type Curry4<F, T1, T2, T3, T4> = F extends (a: T1, b: T2, c: T3, d: T4, ...args: infer A) => infer R ? (...args: A) => R : unknown;
type CurryFunc = (...arg: any[]) => any;
declare function curry<F extends CurryFunc, T1 extends Parameters<F>[0]>(func: F, a: T1): Curry1<F, T1>;
declare function curry<F extends CurryFunc, T1 extends Parameters<F>[0], T2 extends Parameters<F>[1]>(func: F, a: T1, b: T2): Curry2<F, T1, T2>;
declare function curry<F extends CurryFunc, T1 extends Parameters<F>[0], T2 extends Parameters<F>[1], T3 extends Parameters<F>[2]>(func: F, a: T1, b: T2, c: T3): Curry3<F, T1, T2, T3>;
declare function curry<F extends CurryFunc, T1 extends Parameters<F>[0], T2 extends Parameters<F>[1], T3 extends Parameters<F>[2], T4 extends Parameters<F>[3]>(func: F, a: T1, b: T2, c: T3, d: T4): Curry4<F, T1, T2, T3, T4>;
export { curry };
export declare function isArray(value: any): value is any[];
export declare function isFunction(value: any): value is Function;
export declare function isString(value: any): value is string;
export declare function isStringSafe(value: any): value is string;
export declare function isNumber(value: any): value is number;
export declare function isObject<T = unknown>(value: T): value is (object & T);
export declare function isBuiltInObject(value: any): boolean;
export declare function isTypedArray(value: any): boolean;
export declare function isDom(value: any): value is HTMLElement;
export declare function isRegExp(value: unknown): value is RegExp;
/**
 * Whether is exactly NaN. Notice isNaN('a') returns true.
 */
export declare function eqNaN(value: any): boolean;
/**
 * If value1 is not null, then return value1, otherwise judget rest of values.
 * Low performance.
 * @return Final value
 */
export declare function retrieve<T>(...args: T[]): T;
export declare function retrieve2<T, R>(value0: T, value1: R): T | R;
export declare function retrieve3<T, R, W>(value0: T, value1: R, value2: W): T | R | W;
type SliceParams = Parameters<typeof nativeSlice>;
export declare function slice<T>(arr: ArrayLike<T>, ...args: SliceParams): T[];
/**
 * Normalize css liked array configuration
 * e.g.
 *  3 => [3, 3, 3, 3]
 *  [4, 2] => [4, 2, 4, 2]
 *  [4, 3, 2] => [4, 3, 2, 3]
 */
export declare function normalizeCssArray(val: number | number[]): number[];
export declare function assert(condition: any, message?: string): void;
/**
 * @param str string to be trimmed
 * @return trimmed string
 */
export declare function trim(str: string): string;
/**
 * Set an object as primitive to be ignored traversing children in clone or merge
 */
export declare function setAsPrimitive(obj: any): void;
export declare function isPrimitive(obj: any): boolean;
interface MapInterface<T, KEY extends string | number = string | number> {
    delete(key: KEY): boolean;
    has(key: KEY): boolean;
    get(key: KEY): T | undefined;
    set(key: KEY, value: T): this;
    keys(): KEY[];
    forEach(callback: (value: T, key: KEY) => void): void;
}
/**
 * @constructor
 * @param {Object} obj
 */
export declare class HashMap<T, KEY extends string | number = string | number> {
    data: MapInterface<T, KEY>;
    constructor(obj?: HashMap<T, KEY> | {
        [key in KEY]?: T;
    } | KEY[]);
    hasKey(key: KEY): boolean;
    get(key: KEY): T;
    set(key: KEY, value: T): T;
    each<Context>(cb: (this: Context, value?: T, key?: KEY) => void, context?: Context): void;
    keys(): KEY[];
    removeKey(key: KEY): void;
}
export declare function createHashMap<T, KEY extends string | number = string | number>(obj?: HashMap<T, KEY> | {
    [key in KEY]?: T;
} | KEY[]): HashMap<T, KEY>;
export declare function concatArray<T, R>(a: ArrayLike<T>, b: ArrayLike<R>): ArrayLike<T | R>;
export declare function createObject<T>(proto?: object, properties?: T): T;
export declare function disableUserSelect(dom: HTMLElement): void;
export declare function hasOwn(own: object, prop: string): boolean;
export declare function noop(): void;
export declare const RADIAN_TO_DEGREE: number;
export declare const EPSILON: number;
