export declare const isSymbol: (value: any) => value is symbol;
export declare const isArray: (arg: any) => arg is any[];
export declare const isObject: (value: any) => value is object;
/**
 * Checks if the given value is primitive.
 *
 * Primitive Types: number , string , boolean , symbol, bigint, undefined, null
 *
 * @param {*} value value to check
 * @returns {boolean} result
 */
export declare const isPrimitive: (value: any) => boolean;
export declare const isFunction: (value: any) => value is Function;
export declare const isString: (value: any) => value is string;
export declare const isInt: (value: any) => value is number;
export declare const isFloat: (value: any) => value is number;
export declare const isNumber: (value: any) => value is number;
export declare const isDate: (value: any) => value is Date;
/**
 * This is really a _best guess_ promise checking. You
 * should probably use Promise.resolve(value) to be 100%
 * sure you're handling it correctly.
 */
export declare const isPromise: (value: any) => value is Promise<any>;
export declare const isEmpty: (value: any) => boolean;
export declare const isEqual: <TType>(x: TType, y: TType) => boolean;
