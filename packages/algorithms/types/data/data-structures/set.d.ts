export default class Set<T> {
    private items;
    constructor();
    add(element: T): boolean;
    delete(element: T): boolean;
    has(element: T): boolean;
    values(): T[];
    union(otherSet: Set<T>): Set<T>;
    intersection(otherSet: Set<T>): Set<T>;
    difference(otherSet: Set<T>): Set<T>;
    isSubsetOf(otherSet: Set<T>): boolean;
    isEmpty(): boolean;
    size(): number;
    clear(): void;
    toString(): string;
}
