import { default as MapCache } from './_MapCache.js';
import { default as setCacheAdd } from './_setCacheAdd.js';
import { default as setCacheHas } from './_setCacheHas.js';
export default SetCache;
/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
declare function SetCache(values?: any[]): void;
declare class SetCache {
    /**
     *
     * Creates an array cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    private constructor();
    __data__: MapCache;
    add: typeof setCacheAdd;
    push: typeof setCacheAdd;
    has: typeof setCacheHas;
}
