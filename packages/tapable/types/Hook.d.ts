import { HookInterceptorFnNames, IHook, HookInterceptor, Tap, HookCallType, HookAsyncCallback } from './types';
type CallActionType = 'Normal' | 'Bail' | 'Waterfall' | 'Loop';
declare abstract class Hook<T extends any[], Result = unknown> implements IHook<T, Result> {
    interceptors: HookInterceptor[];
    taps: Tap[];
    name?: string;
    constructor(name?: string);
    protected _tap(type: HookCallType, options: Partial<Tap> | string, fn?: Tap['fn']): void;
    tap<K extends Tap>(options: string | Partial<K>, fn?: (...args: K['context'] extends true ? [context: any, ...T] : [...T]) => Result): void;
    tapAsync<K extends Tap>(options: string | Partial<K>, fn?: (...args: K['context'] extends true ? [context: any, ...T, HookAsyncCallback<Result>] : [...T, HookAsyncCallback<Result>]) => void): void;
    tapPromise<K extends Tap>(options: string | Partial<K>, fn?: (...args: K['context'] extends true ? [context: any, ...T] : [...T]) => Promise<Result>): void;
    abstract call(...args: T): Result;
    abstract promise(...args: T): Promise<Result>;
    abstract callAsync(...args: [...T, HookAsyncCallback<Result>]): void;
    protected _runRegisterInterceptors(options: Tap): Tap;
    withOptions(options: Partial<Tap> | string): {
        name: string | undefined;
        tap: (opt: Tap, fn: Parameters<IHook<T, Result>["tap"]>[1]) => void;
        tapAsync: (opt: Tap, fn: Parameters<IHook<T, Result>["tapAsync"]>[1]) => void;
        tapPromise: (opt: Tap, fn: Parameters<IHook<T, Result>["tapPromise"]>[1]) => void;
        intercept: (interceptor: HookInterceptor) => void;
        isUsed: () => boolean;
        withOptions: (opt: Partial<Tap> | string) => /*elided*/ any;
    };
    isUsed(): boolean;
    intercept(interceptor: HookInterceptor): void;
    callIntercept(type: HookInterceptorFnNames, args?: any[], context?: any): void;
    protected needContext(): boolean;
    protected _insert(item: Tap): void;
    callTapsSeries(type: CallActionType, args: T, callback: HookAsyncCallback<Result>): void;
    callTapsLooping(args: T, callback: HookAsyncCallback<Result>): void;
    callTapsParallel(type: CallActionType, maxParallel: number, args: T, callback: HookAsyncCallback<Result>): void;
}
export default Hook;
