/** An arena that uses generational index as key. */
export declare class GenerationalArena<T, I extends number = number> implements Map<I, T>, Iterable<[I, T]> {
    private ids;
    private readonly data;
    get size(): number;
    add(value: T): I;
    clear(): void;
    delete(id: I): boolean;
    get(id: I): T | undefined;
    has(id: I): boolean;
    set(id: I, value: T): this;
    forEach(callback: (value: T, key: I, self: GenerationalArena<T, I>) => void, thisArg?: unknown): void;
    entries(): IterableIterator<[I, T]>;
    keys(): IterableIterator<I>;
    values(): IterableIterator<T>;
    [Symbol.iterator](): IterableIterator<[I, T]>;
    get [Symbol.toStringTag](): string;
}
//# sourceMappingURL=arena.d.ts.map