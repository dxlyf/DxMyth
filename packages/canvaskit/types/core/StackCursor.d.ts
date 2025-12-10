export type StackCursor<T> = {
    current: T;
};
export declare const createCursor: <T>(defaultValue: T) => StackCursor<T>;
export declare const push: <T>(cursor: StackCursor<T>, value: T) => void;
export declare const pop: <T>(cursor: StackCursor<T>) => void;
