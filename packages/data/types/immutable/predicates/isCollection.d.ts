import { Collection } from '../../type-definitions/immutable';
export declare const IS_COLLECTION_SYMBOL = "@@__IMMUTABLE_ITERABLE__@@";
/**
 * True if `maybeCollection` is a Collection, or any of its subclasses.
 *
 * ```js
 * import { isCollection, Map, List, Stack } from 'immutable';
 *
 * isCollection([]); // false
 * isCollection({}); // false
 * isCollection(Map()); // true
 * isCollection(List()); // true
 * isCollection(Stack()); // true
 * ```
 */
export declare function isCollection(maybeCollection: unknown): maybeCollection is Collection<unknown, unknown>;
