import { ValuePair } from './models/value-pair';
export default class Dictionary<K, V> {
    private toStrFn;
    private table;
    constructor(toStrFn?: (key: K) => string);
    set(key: K, value: V): boolean;
    get(key: K): V;
    hasKey(key: K): boolean;
    remove(key: K): boolean;
    values(): V[];
    keys(): K[];
    keyValues(): ValuePair<K, V>[];
    forEach(callbackFn: (key: K, value: V) => any): void;
    isEmpty(): boolean;
    size(): number;
    clear(): void;
    toString(): string;
}
