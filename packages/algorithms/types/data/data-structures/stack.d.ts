export default class Stack<T> {
    private count;
    private items;
    constructor();
    push(element: T): void;
    pop(): any;
    peek(): any;
    isEmpty(): boolean;
    size(): number;
    clear(): void;
    toString(): string;
}
