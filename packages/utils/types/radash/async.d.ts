/**
 * An async reduce function. Works like the
 * built-in Array.reduce function but handles
 * an async reducer function
 */
export declare const reduce: <T, K>(array: readonly T[], asyncReducer: (acc: K, item: T, index: number) => Promise<K>, initValue?: K) => Promise<K>;
/**
 * An async map function. Works like the
 * built-in Array.map function but handles
 * an async mapper function
 */
export declare const map: <T, K>(array: readonly T[], asyncMapFunc: (item: T, index: number) => Promise<K>) => Promise<K[]>;
/**
 * Useful when for script like things where cleanup
 * should be done on fail or sucess no matter.
 *
 * You can call defer many times to register many
 * defered functions that will all be called when
 * the function exits in any state.
 */
export declare const defer: <TResponse>(func: (register: (fn: (error?: any) => any, options?: {
    rethrow?: boolean;
}) => void) => Promise<TResponse>) => Promise<TResponse>;
/**
 * Support for the built-in AggregateError
 * is still new. Node < 15 doesn't have it
 * so patching here.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError#browser_compatibility
 */
export declare class AggregateError extends Error {
    errors: Error[];
    constructor(errors?: Error[]);
}
/**
 * Executes many async functions in parallel. Returns the
 * results from all functions as an array. After all functions
 * have resolved, if any errors were thrown, they are rethrown
 * in an instance of AggregateError
 */
export declare const parallel: <T, K>(limit: number, array: readonly T[], func: (item: T) => Promise<K>) => Promise<K[]>;
type PromiseValues<T extends Promise<any>[]> = {
    [K in keyof T]: T[K] extends Promise<infer U> ? U : never;
};
/**
 * Functionally similar to Promise.all or Promise.allSettled. If any
 * errors are thrown, all errors are gathered and thrown in an
 * AggregateError.
 *
 * @example
 * const [user] = await all([
 *   api.users.create(...),
 *   s3.buckets.create(...),
 *   slack.customerSuccessChannel.sendMessage(...)
 * ])
 */
export declare function all<T extends [Promise<any>, ...Promise<any>[]]>(promises: T): Promise<PromiseValues<T>>;
export declare function all<T extends Promise<any>[]>(promises: T): Promise<PromiseValues<T>>;
/**
 * Functionally similar to Promise.all or Promise.allSettled. If any
 * errors are thrown, all errors are gathered and thrown in an
 * AggregateError.
 *
 * @example
 * const { user } = await all({
 *   user: api.users.create(...),
 *   bucket: s3.buckets.create(...),
 *   message: slack.customerSuccessChannel.sendMessage(...)
 * })
 */
export declare function all<T extends Record<string, Promise<any>>>(promises: T): Promise<{
    [K in keyof T]: Awaited<T[K]>;
}>;
/**
 * Retries the given function the specified number
 * of times.
 */
export declare const retry: <TResponse>(options: {
    times?: number;
    delay?: number | null;
    backoff?: (count: number) => number;
}, func: (exit: (err: any) => void) => Promise<TResponse>) => Promise<TResponse>;
/**
 * Async wait
 */
export declare const sleep: (milliseconds: number) => Promise<unknown>;
/**
 * A helper to try an async function without forking
 * the control flow. Returns an error first callback _like_
 * array response as [Error, result]
 */
export declare const tryit: <Args extends any[], Return>(func: (...args: Args) => Return) => (...args: Args) => Return extends Promise<any> ? Promise<[Error, undefined] | [undefined, Awaited<Return>]> : [Error, undefined] | [undefined, Return];
/**
 * A helper to try an async function that returns undefined
 * if it fails.
 *
 * e.g. const result = await guard(fetchUsers)() ?? [];
 */
export declare const guard: <TFunction extends () => any>(func: TFunction, shouldGuard?: (err: any) => boolean) => ReturnType<TFunction> extends Promise<any> ? Promise<Awaited<ReturnType<TFunction>> | undefined> : ReturnType<TFunction> | undefined;
export {};
