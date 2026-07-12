export type Dictionary<T> = {
    [key: string]: T;
};
export declare class Entry<T> {
    value: T;
    key: string | number;
    next: Entry<T>;
    prev: Entry<T>;
    constructor(val: T);
}
/**
 * Simple double linked list. Compared with array, it has O(1) remove operation.
 * @constructor
 */
export declare class LinkedList<T> {
    head: Entry<T>;
    tail: Entry<T>;
    private _len;
    /**
     * Insert a new value at the tail
     */
    insert(val: T): Entry<T>;
    /**
     * Insert an entry at the tail
     */
    insertEntry(entry: Entry<T>): void;
    /**
     * Remove entry.
     */
    remove(entry: Entry<T>): void;
    /**
     * Get length
     */
    len(): number;
    /**
     * Clear list
     */
    clear(): void;
}
/**
 * LRU Cache
 */
export default class LRU<T> {
    private _list;
    private _maxSize;
    private _lastRemovedEntry;
    private _map;
    constructor(maxSize: number);
    /**
     * @return Removed value
     */
    put(key: string | number, value: T): T;
    get(key: string | number): T;
    /**
     * Clear the cache
     */
    clear(): void;
    len(): number;
}
