import { Collection } from '../../type-definitions/immutable';
export declare const IS_KEYED_SYMBOL = "@@__IMMUTABLE_KEYED__@@";
/**
 * True if `maybeKeyed` is a Collection.Keyed, or any of its subclasses.
 *
 * ```js
 * import { isKeyed, Map, List, Stack } from 'immutable';
 *
 * isKeyed([]); // false
 * isKeyed({}); // false
 * isKeyed(Map()); // true
 * isKeyed(List()); // false
 * isKeyed(Stack()); // false
 * ```
 */
export declare function isKeyed(maybeKeyed: unknown): maybeKeyed is Collection.Keyed<unknown, unknown>;
