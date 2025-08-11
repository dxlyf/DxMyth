import { ValuePairLazy } from './models/value-pair-lazy';
export default class HashTableLinearProbingLazy<K, V> {
    protected toStrFn: (key: K) => string;
    protected table: {
        [key: string]: ValuePairLazy<K, V>;
    };
    constructor(toStrFn?: (key: K) => string);
    private loseloseHashCode;
    hashCode(key: K): number;
    put(key: K, value: V): boolean;
    get(key: K): V | undefined;
    remove(key: K): boolean;
    isEmpty(): boolean;
    size(): number;
    clear(): void;
    getTable(): {
        [key: string]: ValuePairLazy<K, V>;
    };
    toString(): string;
}
