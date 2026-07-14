import { Collection, Record } from '../../type-definitions/immutable';
/**
 * Returns the value within the provided collection associated with the
 * provided key, or notSetValue if the key is not defined in the collection.
 *
 * A functional alternative to `collection.get(key)` which will also work on
 * plain Objects and Arrays as an alternative for `collection[key]`.
 */
export declare function get<K, V>(collection: Collection<K, V>, key: K): V | undefined;
export declare function get<K, V, NSV>(collection: Collection<K, V>, key: K, notSetValue: NSV): V | NSV;
export declare function get<TProps extends object, K extends keyof TProps>(record: Record<TProps>, key: K, notSetValue: unknown): TProps[K];
export declare function get<V>(collection: Array<V>, key: number): V | undefined;
export declare function get<V, NSV>(collection: Array<V>, key: number, notSetValue: NSV): V | NSV;
export declare function get<C extends object, K extends keyof C>(object: C, key: K, notSetValue: unknown): C[K];
export declare function get<V>(collection: {
    [key: string]: V;
}, key: string): V | undefined;
export declare function get<V, NSV>(collection: {
    [key: string]: V;
}, key: string, notSetValue: NSV): V | NSV;
export declare function get<K, V, NSV>(collection: Collection<K, V> | Array<V> | {
    [key: string]: V;
}, key: K, notSetValue?: NSV): V | NSV;
