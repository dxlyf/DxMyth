export declare const toFunctionString: any;
export declare const hasOwnProperty: any;
export declare const toObjectType: any;
export declare const ObjectNativeFunctionString: any;
export declare const keys: {
    (o: object): string[];
    (o: {}): string[];
};
export declare const isArray: (arg: any) => arg is any[];
export declare const fromArray: {
    <T>(arrayLike: ArrayLike<T>): T[];
    <T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
    <T>(iterable: Iterable<T> | ArrayLike<T>): T[];
    <T, U>(iterable: Iterable<T> | ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
};
export declare const entries: {
    <T>(o: {
        [s: string]: T;
    } | ArrayLike<T>): [string, T][];
    (o: {}): [string, any][];
};
export declare const assign: {
    <T extends {}, U>(target: T, source: U): T & U;
    <T extends {}, U, V>(target: T, source1: U, source2: V): T & U & V;
    <T extends {}, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
    (target: object, ...sources: any[]): any;
};
export declare const getType: (value: any) => any;
export declare const isObjectLike: (value: any) => boolean;
export declare const isObject: (value: any) => boolean;
export declare const isPlainObject: (value: any) => boolean;
export declare const isBoolean: (value: any) => value is boolean;
export declare const isString: (value: any) => value is string;
export declare const isNumber: (value: any) => value is number | bigint;
export declare const isSymbol: (value: any) => value is symbol;
export declare const isBigint: (value: any) => value is bigint;
export declare const isFunction: (value: any) => boolean;
export declare const isGeneratorFunction: (value: any) => boolean;
export declare const isAsyncFunction: (value: any) => boolean;
export declare const isNull: (value: any) => boolean;
export declare const isUndefined: (value: any) => value is undefined;
export declare const isNullOrUndefined: (value: any) => boolean;
export declare const isPromise: (value: any) => boolean;
export declare const isPromiseLike: (value: any) => boolean;
export declare const isRegExp: (value: any) => boolean;
export declare const isPrimitive: (value: any) => boolean;
export declare const isArrayLike: (value: any) => boolean;
export declare const has: (target: any, key: any) => boolean;
export declare const defaults: (target: any, ...sources: any[]) => any;
export declare const merge: (target: any, ...sources: any[]) => any;
