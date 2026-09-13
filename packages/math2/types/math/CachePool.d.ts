type CachePoolPoolOptions<T, P extends any[]> = {
    maxSize?: number;
    initSize?: number;
    add?: () => T;
    create?: (...args: P) => T;
    init?: (item: T, ...args: P) => void;
    release?: (item: T) => void;
};
export declare class CachePool<T, P extends any[] = any[]> {
    static create<T, P extends any[] = any[]>(options: CachePoolPoolOptions<T, P>): CachePool<T, P>;
    pools: T[];
    /** 待释放区：已获取但尚未释放的对象 */
    actives: T[];
    options: Partial<CachePoolPoolOptions<T, P>>;
    constructor(options: CachePoolPoolOptions<T, P>);
    private initPoolSize;
    get(...args: P): T;
    release(item: T): void;
    /** 一次性释放待释放区中的所有对象 */
    releaseAll(): void;
    private recycle;
}
export {};
