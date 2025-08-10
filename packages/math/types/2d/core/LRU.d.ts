export declare class Entry<T> {
    value: T;
    key: string | number;
    next: Entry<T> | null;
    prev: Entry<T> | null;
    constructor(val: T);
}
/**
 * Simple double linked list. Compared with array, it has O(1) remove operation.
 * @constructor
 */
export declare class LinkedList<T> {
    head: Entry<T> | null;
    tail: Entry<T> | null;
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
    put(key: string | number, value: T): T | null;
    get(key: string | number): T | undefined;
    /**
     * Clear the cache
     */
    clear(): void;
    len(): number;
}
