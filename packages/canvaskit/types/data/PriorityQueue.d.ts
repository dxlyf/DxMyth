type Comparator<T> = (a: T, b: T) => number;
export declare class PriorityQueue<T> {
    private heap;
    private compare;
    constructor(compare?: Comparator<T>);
    size(): number;
    isEmpty(): boolean;
    peek(): T | undefined;
    push(value: T): void;
    pop(): T | undefined;
    private heapifyUp;
    private heapifyDown;
    private swap;
    clear(): void;
    toSortedArray(): T[];
    forEachSorted(fn: (item: T, index: number) => void): void;
}
export {};
