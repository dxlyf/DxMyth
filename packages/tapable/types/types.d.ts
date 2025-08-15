export type HookAsyncCallback<Result = unknown> = (err?: any, result?: Result) => void;
export interface IHook<T extends any[], Result = unknown> {
    tap<K extends Tap>(name: string | Partial<K>, fn?: (...args: K['context'] extends true ? [context: any, ...T] : [...T]) => Result): void;
    tapAsync<K extends Tap>(name: string | Partial<K>, fn?: (...args: K['context'] extends true ? [context: any, ...T, HookAsyncCallback<Result>] : [...T, HookAsyncCallback<Result>]) => void): void;
    tapPromise<K extends Tap>(name: string | Partial<K>, fn?: (...args: K['context'] extends true ? [context: any, ...T] : [...T]) => Promise<Result>): void;
    intercept: (interceptor: HookInterceptor) => void;
    isUsed(): boolean;
    call(...args: T): Result;
    promise(...args: T): Promise<Result>;
    callAsync: (...args: [...T, HookAsyncCallback]) => void;
}
export interface HookInterceptor {
    call?(context?: any, ...args: any[]): void;
    loop?(context?: any, ...args: any[]): void;
    tap?(tap: Tap): void;
    tap?(context: any, tap: Tap): void;
    tap?(context: any | Tap, tap?: Tap): void;
    error?(error?: any): void;
    result?(result?: any): void;
    done?(): void;
    register?(tap: Tap): Tap;
    factory?: (key: any, hook: IHook<any>) => IHook<any>;
    context?: boolean;
}
type FunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
export type HookInterceptorFnNames = FunctionPropertyNames<Required<HookInterceptor>>;
export interface HookMap {
    for: (key: any) => IHook<any>;
    intercept: (interceptor: HookMapInterceptor) => void;
}
export interface HookMapInterceptor {
    factory: (key: any, hook: IHook<any>) => IHook<any>;
}
export interface Tap {
    name: string;
    type: string;
    fn: Function;
    stage: number;
    context?: boolean;
    before?: string | string[];
}
export interface ContextTap extends Tap {
    context: true;
}
export type HookCallType = 'sync' | 'promise' | 'async';
export type HookCodeFactoryOptions = {
    taps: Tap[];
    interceptors: HookInterceptor[];
    args: any[];
    type: HookCallType;
};
export type ContentWithInterceptorsOptions = {
    onError?: (err: any) => string;
    onResult?: (result: any) => string;
    onDone?: (() => string);
    rethrowIfPossible?: boolean;
    resultReturns?: boolean;
    doneReturns?: boolean;
};
export type callTapOptions = ContentWithInterceptorsOptions;
export type CallTapsSeriesOptions = {
    onError?: ((index: number, err: any, done: () => any, doneBreak: () => any) => string);
    onResult?: ((index: number, result: any, done: () => any, doneBreak: () => any) => string);
    onDone?: (() => string);
    rethrowIfPossible?: boolean;
    resultReturns?: boolean;
    doneReturns?: boolean;
};
export {};
