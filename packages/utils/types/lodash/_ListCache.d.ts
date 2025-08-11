import { default as listCacheClear } from './_listCacheClear.js';
import { default as listCacheDelete } from './_listCacheDelete.js';
import { default as listCacheGet } from './_listCacheGet.js';
import { default as listCacheHas } from './_listCacheHas.js';
import { default as listCacheSet } from './_listCacheSet.js';
export default ListCache;
/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
declare function ListCache(entries?: any[]): void;
declare class ListCache {
    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    private constructor();
    clear: typeof listCacheClear;
    delete: typeof listCacheDelete;
    get: typeof listCacheGet;
    has: typeof listCacheHas;
    set: typeof listCacheSet;
}
