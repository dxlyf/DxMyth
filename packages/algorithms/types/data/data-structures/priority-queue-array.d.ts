import { Compare, ICompareFunction } from '../util';
export default class PriorityQueue<T> {
    private compareFn;
    private compare;
    private items;
    constructor(compareFn?: ICompareFunction<T>, compare?: Compare);
    enqueue(element: T): void;
    dequeue(): T | undefined;
    peek(): T | undefined;
    isEmpty(): boolean;
    clear(): void;
    size(): number;
    toString(): "" | T[];
}
