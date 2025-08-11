export default class Queue<T> {
    private count;
    private lowestCount;
    private items;
    constructor();
    enqueue(element: T): void;
    dequeue(): any;
    peek(): any;
    isEmpty(): boolean;
    clear(): void;
    size(): number;
    toString(): string;
}
