import { Collection } from '../../type-definitions/immutable';
export declare const IS_INDEXED_SYMBOL = "@@__IMMUTABLE_INDEXED__@@";
/**
 * True if `maybeIndexed` is a Collection.Indexed, or any of its subclasses.
 *
 * ```js
 * import { isIndexed, Map, List, Stack, Set } from 'immutable';
 *
 * isIndexed([]); // false
 * isIndexed({}); // false
 * isIndexed(Map()); // false
 * isIndexed(List()); // true
 * isIndexed(Stack()); // true
 * isIndexed(Set()); // false
 * ```
 */
export declare function isIndexed(maybeIndexed: unknown): maybeIndexed is Collection.Indexed<unknown>;
