type Options<T, Args extends any[]> = {
    maxSize: number;
    create(...args: Args): T;
    init(obj: T, ...args: Args): void;
};
export declare class Pool<T, Args extends any[]> {
    pools: T[];
    options: Options<T, Args>;
    currentIndex: number;
    constructor(options: Options<T, Args>);
    pool(...args: Args): T | undefined;
    release(): this;
    releaseAll(): this;
    reset(): this;
}
export {};
