import { default as Hook } from './Hook';
import { HookAsyncCallback } from './types';
declare class AsyncSeriesHook<T extends any[]> extends Hook<T, void> {
    constructor(name?: string);
    call(..._args: T): void;
    callAsync(..._args: [...T, HookAsyncCallback<void>]): void;
    promise(..._args: T): Promise<void>;
}
export default AsyncSeriesHook;
