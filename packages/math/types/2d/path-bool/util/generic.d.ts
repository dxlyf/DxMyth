export declare function isNumber(val: unknown): val is number;
export declare function isString(val: unknown): val is string;
export declare function isBoolean(val: unknown): val is boolean;
export declare const hasOwn: (o: object, v: PropertyKey) => boolean;
export declare function memoizeWeak<Obj extends Object, Args, Ret>(fn: (obj: Obj, ...args: Args[]) => Ret): (obj: Obj, ...args: Args[]) => Ret;
export declare function countIf<T>(arr: T[], pred: (value: T) => boolean): number;
