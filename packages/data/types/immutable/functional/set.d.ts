import { Collection, Record } from '../../type-definitions/immutable';
/**
 * Returns a copy of the collection with the value at key set to the provided
 * value.
 *
 * A functional alternative to `collection.set(key, value)` which will also
 * work with plain Objects and Arrays as an alternative for
 * `collectionCopy[key] = value`.
 */
export declare function set<K, V, C extends Collection<K, V>>(collection: C, key: K, value: V): C;
export declare function set<TProps extends object, C extends Record<TProps>, K extends keyof TProps>(record: C, key: K, value: TProps[K]): C;
export declare function set<V, C extends Array<V>>(collection: C, key: number, value: V): C;
export declare function set<C, K extends keyof C>(object: C, key: K, value: C[K]): C;
export declare function set<V, C extends {
    [key: string]: V;
}>(collection: C, key: string, value: V): C;
