/**
 * Checks if `value` is equal to `check` if `check` is a string or in `check` if check is an Array
 *
 * @param value - the value being searched for
 * @param check - the values to check against
 * @returns `boolean`
 */
export declare function equalToOrIn(value: string, check: string | Array<string>): boolean;
export type Interceptor<Args extends any[], ReturnType, ContextType> = {
    /** An optional name for the interceptor */
    name?: string;
    /** Callback for each loop when used by the hook */
    loop?: (...args: Args) => void;
    /** Callback when an error occurs during the hook's call */
    error?: (err: Error) => void;
    /** Callback when a result is found for a hook's invocation */
    result?: (r: ReturnType extends Promise<infer AwaitedValue> ? AwaitedValue : ReturnType) => void;
    /** Callback when a hook's call is complete */
    done?: () => void;
    /** Callback when a hook is tapped */
    tap?: (tap: Tap<Args, ReturnType, ContextType>) => void;
} & ({
    /** If context should be omitted from the 'call'. This is the default */
    context?: false;
    /** Callback when the hook is tapped without context */
    call?: (...args: Args) => void;
} | {
    /** If context should be included in the 'call' */
    context: true;
    /** Callback when the hook is tapped with context */
    call?: (context: ContextType, ...args: Args) => void;
});
export type Tap<Args extends any[], ReturnType, ContextType = unknown> = {
    key: symbol;
    name: string;
    before?: string | Array<string>;
} & ({
    context: false;
    callback: (...args: Args) => ReturnType;
} | {
    context: true;
    callback: (context: ContextType, ...args: Args) => ReturnType;
});
type BasicTap<Args extends any[], ReturnType, ContextType> = (name: string, callback: (...args: Args) => ReturnType, before?: string | Array<string>) => Tap<Args, ReturnType, ContextType>;
type TapWithContext<Args extends any[], ReturnType, ContextType> = ((options: {
    name: string;
    context?: false;
    before?: string | Array<string>;
}, callback: (...args: Args) => ReturnType) => Tap<Args, ReturnType>) | ((options: {
    name: string;
    context: true;
    before?: string | Array<string>;
}, callback: (context: ContextType, ...args: Args) => ReturnType) => Tap<Args, ReturnType>);
interface SyncBaseHookType<Args extends any[], ReturnType, ContextType> {
    tap: BasicTap<Args, ReturnType, ContextType> | TapWithContext<Args, ReturnType, ContextType>;
    call(...args: Args): void;
    untap(key: Tap<Args, ReturnType>): void;
    isUsed(): boolean;
    intercept(int: Interceptor<Args, ReturnType, ContextType>): void;
}
/** A manager for all intercepts inside of a tap */
declare class InterceptionManager<Args extends any[], ReturnType, ContextType = Record<string, any>> {
    protected interceptions: Array<Interceptor<Args, ReturnType, ContextType>>;
    private interceptionKeySet;
    constructor();
    isUsed(): boolean;
    intercept(int: Interceptor<Args, ReturnType, ContextType>): void;
    tap(tap: Tap<Args, ReturnType, ContextType>): void;
    call(ctx: ContextType, ...args: Args): void;
    loop(...args: Args): void;
    error(err: unknown): void;
    result(r: ReturnType extends Promise<infer AwaitedValue> ? AwaitedValue : ReturnType): void;
    done(): void;
}
declare abstract class Hook<Args extends any[], ReturnType, ContextType = Record<string, any>> implements SyncBaseHookType<Args, ReturnType, ContextType> {
    protected taps: Array<Tap<Args, ReturnType, ContextType>>;
    protected interceptions: InterceptionManager<Args, ReturnType, ContextType>;
    constructor();
    tap(options: {
        name: string;
        context?: false;
        before?: string | Array<string>;
    }, callback: (...args: Args) => ReturnType): Tap<Args, ReturnType, ContextType>;
    tap(options: {
        name: string;
        context: true;
        before?: string | Array<string>;
    }, callback: (ctx: ContextType, ...args: Args) => ReturnType): Tap<Args, ReturnType, ContextType>;
    tap(name: string, callback: (...args: Args) => ReturnType): Tap<Args, ReturnType, ContextType>;
    abstract call(...args: Args): ReturnType;
    untap(tap: Tap<Args, ReturnType, ContextType>): void;
    isUsed(): boolean;
    intercept(int: Interceptor<Args, ReturnType, ContextType>): void;
}
export declare class SyncHook<Args extends any[], ContextType = Record<string, any>> extends Hook<Args, void, ContextType> {
    call(...args: Args): void;
}
export declare class SyncBailHook<Args extends any[], ReturnType, ContextType = Record<string, any>> extends Hook<Args, ReturnType | undefined | null, ContextType> {
    call(...args: Args): ReturnType | undefined | null;
}
export declare class SyncWaterfallHook<Args extends any[], ContextType = Record<string, any>> extends Hook<Args, Args[0], ContextType> {
    call(...args: Args): Args[0];
}
export declare class SyncLoopHook<Args extends any[], ContextType = Record<string, any>> extends Hook<Args, void, ContextType> {
    call(...args: Args): void;
}
export declare class AsyncParallelHook<Args extends any[], ContextType = Record<string, any>> extends Hook<Args, Promise<void>, ContextType> {
    call(...args: Args): Promise<void>;
}
export declare class AsyncParallelBailHook<Args extends any[], ReturnType, ContextType = Record<string, any>> extends Hook<Args, Promise<ReturnType>, ContextType> {
    call(...args: Args): Promise<ReturnType>;
}
export declare class AsyncSeriesHook<Args extends any[], ContextType = Record<string, any>> extends Hook<Args, Promise<void>, ContextType> {
    call(...args: Args): Promise<void>;
}
export declare class AsyncSeriesBailHook<Args extends any[], ReturnType, ContextType = Record<string, any>> extends Hook<Args, Promise<ReturnType | undefined | null>, ContextType> {
    call(...args: Args): Promise<ReturnType | undefined | null>;
}
export declare class AsyncSeriesWaterfallHook<Args extends any[], ContextType = Record<string, any>> extends Hook<Args, Promise<Args[0]>, ContextType> {
    call(...args: Args): Promise<Args[0]>;
}
export declare class AsyncSeriesLoopHook<Args extends any[], ContextType = Record<string, any>> extends Hook<Args, Promise<void>, ContextType> {
    call(...args: Args): Promise<void>;
}
export {};
