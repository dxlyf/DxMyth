import { HookInterceptor, IHook } from './types';
declare class HookMap<T extends any[], R> {
    _map: Map<any, IHook<T, R>>;
    name?: string;
    _factory: (key: any) => IHook<T, R>;
    _interceptors: HookInterceptor[];
    constructor(factory: (key: any) => IHook<T, R>, name?: string);
    get(key: any): IHook<T, R> | undefined;
    for(key: any): IHook<T, R>;
    intercept(interceptor: HookInterceptor): void;
}
export default HookMap;
