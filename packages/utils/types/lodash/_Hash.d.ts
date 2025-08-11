import { default as hashClear } from './_hashClear.js';
import { default as hashDelete } from './_hashDelete.js';
import { default as hashGet } from './_hashGet.js';
import { default as hashHas } from './_hashHas.js';
import { default as hashSet } from './_hashSet.js';
export default Hash;
/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
declare function Hash(entries?: any[]): void;
declare class Hash {
    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    private constructor();
    clear: typeof hashClear;
    delete: typeof hashDelete;
    get: typeof hashGet;
    has: typeof hashHas;
    set: typeof hashSet;
}
