export default class StackArray<T> {
    private items;
    constructor();
    push(element: T): void;
    pop(): T | undefined;
    peek(): T;
    isEmpty(): boolean;
    size(): number;
    clear(): void;
    toArray(): T[];
    toString(): string;
}
