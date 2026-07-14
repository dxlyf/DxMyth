export declare const ITERATE_KEYS = 0;
export declare const ITERATE_VALUES = 1;
export declare const ITERATE_ENTRIES = 2;
type IteratorType = typeof ITERATE_KEYS | typeof ITERATE_VALUES | typeof ITERATE_ENTRIES;
export declare const ITERATOR_SYMBOL: string | symbol;
export declare class Iterator<V> implements globalThis.Iterator<V> {
    constructor(next: () => IteratorResult<V>);
    toString(): string;
}
export declare function iteratorValue<K, V>(type: IteratorType, k: K, v?: undefined, iteratorResult?: IteratorResult<K>): IteratorResult<V> | undefined;
export declare function iteratorValue<K, V>(type: IteratorType, k: K, v: V, iteratorResult?: IteratorResult<V>): IteratorResult<V> | undefined;
export declare function iteratorValue<K, V>(type: typeof ITERATE_ENTRIES, k: K, v?: V, iteratorResult?: IteratorResult<[K, V]>): IteratorResult<[K, V]> | undefined;
export declare function iteratorDone(): IteratorReturnResult<undefined>;
export declare function hasIterator(maybeIterable: unknown): maybeIterable is Iterable<unknown>;
export declare function isIterator(maybeIterator: unknown): maybeIterator is Iterator<unknown>;
export declare function getIterator(iterable: unknown): Iterator<unknown> | undefined;
export declare function isEntriesIterable(maybeIterable: unknown): maybeIterable is Iterable<[unknown, unknown]>;
export declare function isKeysIterable(maybeIterable: unknown): maybeIterable is Iterable<unknown>;
export {};
