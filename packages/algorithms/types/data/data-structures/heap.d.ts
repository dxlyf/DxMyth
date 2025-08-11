import { ICompareFunction } from '../util';
export declare class MinHeap<T> {
    protected compareFn: ICompareFunction<T>;
    protected heap: T[];
    constructor(compareFn?: ICompareFunction<T>);
    private getLeftIndex;
    private getRightIndex;
    private getParentIndex;
    size(): number;
    isEmpty(): boolean;
    clear(): void;
    findMinimum(): T | undefined;
    insert(value: T): boolean;
    private siftDown;
    private siftUp;
    extract(): T | undefined;
    heapify(array: T[]): T[];
    getAsArray(): T[];
}
export declare class MaxHeap<T> extends MinHeap<T> {
    protected compareFn: ICompareFunction<T>;
    constructor(compareFn?: ICompareFunction<T>);
}
