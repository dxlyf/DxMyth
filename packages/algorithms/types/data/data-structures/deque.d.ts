export default class Deque<T> {
    private count;
    private lowestCount;
    private items;
    constructor();
    addFront(element: T): void;
    addBack(element: T): void;
    removeFront(): any;
    removeBack(): any;
    peekFront(): any;
    peekBack(): any;
    isEmpty(): boolean;
    clear(): void;
    size(): number;
    toString(): string;
}
