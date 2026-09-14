/** A generator of generational index IDs. */
export declare class IdGenerator<T extends number = number> implements ReadonlySet<T>, Iterable<T> {
    private readonly generations;
    private readonly freeList;
    get size(): number;
    clear(): void;
    create(): T;
    delete(id: T): boolean;
    has(id: T): boolean;
    forEach(callback: (value: T, value2: T, self: IdGenerator<T>) => void, thisArg?: unknown): void;
    entries(): IterableIterator<[T, T]>;
    keys(): IterableIterator<T>;
    values(): IterableIterator<T>;
    [Symbol.iterator](): IterableIterator<T>;
    get [Symbol.toStringTag](): string;
}
//# sourceMappingURL=generator.d.ts.map