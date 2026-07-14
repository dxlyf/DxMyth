declare global {
    var Iterator: undefined | {
        from<T, TReturn>(iterable: Iterator<T, TReturn>): IterableIterator<T>;
    };
}
export declare function enableMapSet(): void;
