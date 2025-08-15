import { default as Hook } from './Hook';
import { HookAsyncCallback } from './types';
declare class SyncBailHook<T extends any[], Result> extends Hook<T, Result | undefined> {
    constructor(name?: string);
    call(..._args: T): Result | undefined;
    callAsync(..._args: [...T, HookAsyncCallback<Result | undefined>]): void;
    promise(..._args: T): Promise<Result | undefined>;
    tapAsync(): void;
    tapPromise(): void;
}
export default SyncBailHook;
