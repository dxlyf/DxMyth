import { HookCodeFactoryOptions, ContentWithInterceptorsOptions, IHook, CallTapsSeriesOptions } from './types';
declare class HookCodeFactory {
    config?: any;
    options?: HookCodeFactoryOptions;
    _args?: any;
    constructor(config?: any);
    create(options: HookCodeFactoryOptions): Function;
    setup(instance: IHook<any>, options: HookCodeFactoryOptions): void;
    /**
     * @param {{ type: "sync" | "promise" | "async", taps: Array<Tap>, interceptors: Array<Interceptor> }} options
     */
    init(options: HookCodeFactoryOptions): void;
    deinit(): void;
    content(opts: ContentWithInterceptorsOptions): string;
    contentWithInterceptors(options: ContentWithInterceptorsOptions): string;
    header(): string;
    needContext(): boolean;
    callTap(tapIndex: number, opts: CallTapsSeriesOptions): string;
    callTapsSeries(opts: CallTapsSeriesOptions): string;
    callTapsLooping({ onError, onDone, rethrowIfPossible }: any): any;
    callTapsParallel({ onError, onResult, onDone, rethrowIfPossible, onTap }: any): string;
    args({ before, after }?: {
        before?: string;
        after?: string;
    }): any;
    getTapFn(idx: number): string;
    getTap(idx: number): string;
    getInterceptor(idx: number): string;
}
export default HookCodeFactory;
