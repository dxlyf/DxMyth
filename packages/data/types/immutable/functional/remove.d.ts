import { Collection, Record } from '../../type-definitions/immutable';
/**
 * Returns a copy of the collection with the value at key removed.
 *
 * A functional alternative to `collection.remove(key)` which will also work
 * with plain Objects and Arrays as an alternative for
 * `delete collectionCopy[key]`.
 */
export declare function remove<K, C extends Collection<K, unknown>>(collection: C, key: K): C;
export declare function remove<TProps extends object, C extends Record<TProps>, K extends keyof TProps>(collection: C, key: K): C;
export declare function remove<C extends Array<unknown>>(collection: C, key: number): C;
export declare function remove<C, K extends keyof C>(collection: C, key: K): C;
export declare function remove<C extends {
    [key: PropertyKey]: unknown;
}, K extends keyof C>(collection: C, key: K): C;
export declare function remove<K, C extends Collection<K, unknown> | Array<unknown> | {
    [key: PropertyKey]: unknown;
}>(collection: C, key: K): C;
