import { ValuePair } from './models/value-pair';
export default class HashTable<K, V> {
    protected toStrFn: (key: K) => string;
    protected table: {
        [key: string]: ValuePair<K, V>;
    };
    constructor(toStrFn?: (key: K) => string);
    private loseloseHashCode;
    hashCode(key: K): number;
    put(key: K, value: V): boolean;
    get(key: K): V | undefined;
    remove(key: K): boolean;
    getTable(): {
        [key: string]: ValuePair<K, V>;
    };
    isEmpty(): boolean;
    size(): number;
    clear(): void;
    toString(): string;
}
