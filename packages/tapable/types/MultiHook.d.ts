import { default as Hook } from './Hook';
import { HookInterceptor, Tap } from './types';
export declare class MultiHook {
    hooks: Hook<any>[];
    name?: string;
    constructor(hooks: Hook<any>[], name?: string);
    tap(options: Tap, fn: Parameters<Hook<any>['tap']>[1]): void;
    tapAsync(options: Tap, fn: Parameters<Hook<any>['tapAsync']>[1]): void;
    tapPromise(options: Tap, fn: Parameters<Hook<any>['tapPromise']>[1]): void;
    isUsed(): boolean;
    intercept(interceptor: HookInterceptor): void;
    withOptions(options: Partial<Tap> | string): MultiHook;
}
export default MultiHook;
