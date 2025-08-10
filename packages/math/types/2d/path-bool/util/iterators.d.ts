export declare function map<T1, T2>(iter: Iterable<T1>, fn: (val: T1, index: number) => T2): Iterable<T2>;
export declare function flatMap<T1, T2>(iter: Iterable<T1>, fn: (val: T1, index: number) => Iterable<T2>): Iterable<T2>;
export declare function filter<T>(iter: Iterable<T>, fn: (val: T) => boolean): Iterable<T>;
