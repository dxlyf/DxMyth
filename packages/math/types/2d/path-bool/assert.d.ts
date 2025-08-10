export declare class AssertionError extends Error {
    constructor(message: string);
}
export declare function assertCondition(cond: any, msg: string): asserts cond;
export declare function assertDefined<T>(val: T, msg: string): asserts val is NonNullable<T>;
export declare function assertEqual<T>(lhs: T, rhs: T, msg: string): void;
export declare function assertUnreachable(msg: string): never;
