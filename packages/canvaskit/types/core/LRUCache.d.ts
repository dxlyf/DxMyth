interface LRUCacheOptions {
    maxSize?: number;
    maxAge?: number;
}
type CacheItem<T> = {
    value: T;
    expirationTime: number;
};
export declare class LRUCache<T = any> {
    private cache;
    private maxAge;
    private maxSize;
    constructor(options?: LRUCacheOptions);
    get(key: string): T;
    getOrSet(key: string, value: T, opts?: {
        maxAge?: number;
    }): T;
    set(key: string, value: T, opts?: {
        maxAge?: number;
    }): void;
    has(key: string): boolean;
    remove(key: string): void;
    clear(): void;
    hasNotExpired(key: string): boolean;
    isExpired(item: CacheItem<T>): boolean;
    isNotExpired(item: CacheItem<T>): boolean;
}
export {};
