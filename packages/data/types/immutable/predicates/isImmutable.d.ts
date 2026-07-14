import { Collection, Record } from '../../type-definitions/immutable';
/**
 * True if `maybeImmutable` is an Immutable Collection or Record.
 *
 * Note: Still returns true even if the collections is within a `withMutations()`.
 *
 * ```js
 * import { isImmutable, Map, List, Stack } from 'immutable';
 * isImmutable([]); // false
 * isImmutable({}); // false
 * isImmutable(Map()); // true
 * isImmutable(List()); // true
 * isImmutable(Stack()); // true
 * isImmutable(Map().asMutable()); // true
 * ```
 */
export declare function isImmutable(maybeImmutable: unknown): maybeImmutable is Collection<unknown, unknown> | Record<object>;
