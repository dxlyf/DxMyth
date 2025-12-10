export declare class Cache<TData = any> {
    cache: Map<string, TData>;
    enabled: boolean;
    constructor();
    /**
     * Adds a resource to the cache.
     *
     * @param {string} key - The key to identify the resource.
     * @param {TData} data - The resource to be cached.
     */
    add(key: string, data: TData): void;
    /**
     * Retrieves a resource from the cache.
     *
     * @param {string} key - The key to identify the resource.
     * @return {TData|undefined} The cached resource if available.
     */
    get(key: string): TData | undefined;
    /**
     * Checks if a resource exists in the cache.
     *
     * @param {string} key - The key to identify the resource.
     * @return {boolean} True if the resource exists in the cache, false otherwise.
     */
    has(key: string): boolean;
    /**
     * Removes a resource from the cache.
     *
     * @param {string} key - The key to identify the resource.
     */
    remove(key: string): void;
    /**
     * Removes all resources from the cache.
     */
    clear(): void;
    /**
     * Returns the number of resources in the cache.
     *
     * @return {number} The number of resources in the cache.
     */
    get size(): number;
}
declare const DefaultCache: Cache<any>;
export default DefaultCache;
