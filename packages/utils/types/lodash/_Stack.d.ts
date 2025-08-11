import { default as ListCache } from './_ListCache.js';
import { default as stackClear } from './_stackClear.js';
import { default as stackDelete } from './_stackDelete.js';
import { default as stackGet } from './_stackGet.js';
import { default as stackHas } from './_stackHas.js';
import { default as stackSet } from './_stackSet.js';
export default Stack;
/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
declare function Stack(entries?: any[]): void;
declare class Stack {
    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    private constructor();
    __data__: ListCache;
    size: any;
    clear: typeof stackClear;
    delete: typeof stackDelete;
    get: typeof stackGet;
    has: typeof stackHas;
    set: typeof stackSet;
}
