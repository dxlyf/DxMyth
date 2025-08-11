import { default as mapCacheClear } from './_mapCacheClear.js';
import { default as mapCacheDelete } from './_mapCacheDelete.js';
import { default as mapCacheGet } from './_mapCacheGet.js';
import { default as mapCacheHas } from './_mapCacheHas.js';
import { default as mapCacheSet } from './_mapCacheSet.js';
export default MapCache;
/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
declare function MapCache(entries?: any[]): void;
declare class MapCache {
    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    private constructor();
    clear: typeof mapCacheClear;
    delete: typeof mapCacheDelete;
    get: typeof mapCacheGet;
    has: typeof mapCacheHas;
    set: typeof mapCacheSet;
}
