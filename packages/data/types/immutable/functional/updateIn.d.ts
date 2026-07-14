import { Collection, KeyPath, Record, RetrievePath } from '../../type-definitions/immutable';
/**
 * Returns a copy of the collection with the value at key path set to the
 * result of providing the existing value to the updating function.
 *
 * A functional alternative to `collection.updateIn(keypath)` which will also
 * work with plain Objects and Arrays.
 */
export type PossibleCollection<K, V, TProps extends object> = Collection<K, V> | Record<TProps> | Array<V>;
type UpdaterFunction<K, C> = (value: RetrievePath<C, Array<K>> | undefined) => unknown | undefined;
type UpdaterFunctionWithNSV<K, C, NSV> = (value: RetrievePath<C, Array<K>> | NSV) => unknown;
export declare function updateIn<K, V, C extends Collection<K, V>>(collection: C, keyPath: KeyPath<K>, updater: UpdaterFunction<K, C>): C;
export declare function updateIn<K, V, C extends Collection<K, V>, NSV>(collection: C, keyPath: KeyPath<K>, notSetValue: NSV, updater: UpdaterFunctionWithNSV<K, C, NSV>): C;
export declare function updateIn<TProps extends object, C extends Record<TProps>, K extends keyof TProps>(record: C, keyPath: KeyPath<K>, updater: UpdaterFunction<K, C>): C;
export declare function updateIn<TProps extends object, C extends Record<TProps>, K extends keyof TProps, NSV>(record: C, keyPath: KeyPath<K>, notSetValue: NSV, updater: UpdaterFunctionWithNSV<K, C, NSV>): C;
export declare function updateIn<K, V, C extends Array<V>>(collection: C, keyPath: KeyPath<string | number>, updater: UpdaterFunction<K, C>): Array<V>;
export declare function updateIn<K, V, C extends Array<V>, NSV>(collection: C, keyPath: KeyPath<K>, notSetValue: NSV, updater: UpdaterFunctionWithNSV<K, C, NSV>): Array<V>;
export declare function updateIn<K, C>(object: C, keyPath: KeyPath<K>, updater: UpdaterFunction<K, C>): C;
export declare function updateIn<K, C, NSV>(object: C, keyPath: KeyPath<K>, notSetValue: NSV, updater: UpdaterFunctionWithNSV<K, C, NSV>): C;
export declare function updateIn<K, V, C extends {
    [key: PropertyKey]: V;
}>(collection: C, keyPath: KeyPath<K>, updater: UpdaterFunction<K, C>): {
    [key: PropertyKey]: V;
};
export declare function updateIn<K, V, C extends {
    [key: PropertyKey]: V;
}, NSV>(collection: C, keyPath: KeyPath<K>, notSetValue: NSV, updater: UpdaterFunction<K, C>): {
    [key: PropertyKey]: V;
};
export {};
