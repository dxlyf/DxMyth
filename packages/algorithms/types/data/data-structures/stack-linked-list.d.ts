export default class StackLinkedList<T> {
    private items;
    constructor();
    push(element: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    isEmpty(): boolean;
    size(): number;
    clear(): void;
    toString(): string;
}
