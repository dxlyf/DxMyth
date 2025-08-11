import { ValuePair } from './value-pair';
export declare class ValuePairLazy<K, V> extends ValuePair<K, V> {
    key: K;
    value: V;
    isDeleted: boolean;
    constructor(key: K, value: V, isDeleted?: boolean);
}
