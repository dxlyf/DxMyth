import { OrderedCollection } from '../../type-definitions/immutable';
export declare const IS_ORDERED_SYMBOL = "@@__IMMUTABLE_ORDERED__@@";
/**
 * True if `maybeOrdered` is a Collection where iteration order is well
 * defined. True for Collection.Indexed as well as OrderedMap and OrderedSet.
 *
 * ```js
 * import { isOrdered, Map, OrderedMap, List, Set } from 'immutable';
 *
 * isOrdered([]); // false
 * isOrdered({}); // false
 * isOrdered(Map()); // false
 * isOrdered(OrderedMap()); // true
 * isOrdered(List()); // true
 * isOrdered(Set()); // false
 * ```
 */
export declare function isOrdered<I>(maybeOrdered: Iterable<I>): maybeOrdered is OrderedCollection<I>;
