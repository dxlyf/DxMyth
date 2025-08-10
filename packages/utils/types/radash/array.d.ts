/**
 * Sorts an array of items into groups. The return value is a map where the keys are
 * the group ids the given getGroupId function produced and the value is an array of
 * each item in that group.
 */
export declare const group: <T, Key extends string | number | symbol>(array: readonly T[], getGroupId: (item: T) => Key) => Partial<Record<Key, T[]>>;
/**
 * Creates an array of grouped elements, the first of which contains the
 * first elements of the given arrays, the second of which contains the
 * second elements of the given arrays, and so on.
 *
 * Ex. const zipped = zip(['a', 'b'], [1, 2], [true, false]) // [['a', 1, true], ['b', 2, false]]
 */
export declare function zip<T1, T2, T3, T4, T5>(array1: T1[], array2: T2[], array3: T3[], array4: T4[], array5: T5[]): [T1, T2, T3, T4, T5][];
export declare function zip<T1, T2, T3, T4>(array1: T1[], array2: T2[], array3: T3[], array4: T4[]): [T1, T2, T3, T4][];
export declare function zip<T1, T2, T3>(array1: T1[], array2: T2[], array3: T3[]): [T1, T2, T3][];
export declare function zip<T1, T2>(array1: T1[], array2: T2[]): [T1, T2][];
/**
 * Creates an object mapping the specified keys to their corresponding values
 *
 * Ex. const zipped = zipToObject(['a', 'b'], [1, 2]) // { a: 1, b: 2 }
 * Ex. const zipped = zipToObject(['a', 'b'], (k, i) => k + i) // { a: 'a0', b: 'b1' }
 * Ex. const zipped = zipToObject(['a', 'b'], 1) // { a: 1, b: 1 }
 */
export declare function zipToObject<K extends string | number | symbol, V>(keys: K[], values: V | ((key: K, idx: number) => V) | V[]): Record<K, V>;
/**
 * Go through a list of items, starting with the first item,
 * and comparing with the second. Keep the one you want then
 * compare that to the next item in the list with the same
 *
 * Ex. const greatest = () => boil(numbers, (a, b) => a > b)
 */
export declare const boil: <T>(array: readonly T[], compareFunc: (a: T, b: T) => T) => T | null;
/**
 * Sum all numbers in an array. Optionally provide a function
 * to convert objects in the array to number values.
 */
export declare function sum<T extends number>(array: readonly T[]): number;
export declare function sum<T extends object>(array: readonly T[], fn: (item: T) => number): number;
/**
 * Get the first item in an array or a default value
 */
export declare const first: <T>(array: readonly T[], defaultValue?: T | null | undefined) => T | null | undefined;
/**
 * Get the last item in an array or a default value
 */
export declare const last: <T>(array: readonly T[], defaultValue?: T | null | undefined) => T | null | undefined;
/**
 * Sort an array without modifying it and return
 * the newly sorted value
 */
export declare const sort: <T>(array: readonly T[], getter: (item: T) => number, desc?: boolean) => T[];
/**
 * Sort an array without modifying it and return
 * the newly sorted value. Allows for a string
 * sorting value.
 */
export declare const alphabetical: <T>(array: readonly T[], getter: (item: T) => string, dir?: "asc" | "desc") => T[];
export declare const counting: <T, TId extends string | number | symbol>(list: readonly T[], identity: (item: T) => TId) => Record<TId, number>;
/**
 * Replace an element in an array with a new
 * item without modifying the array and return
 * the new value
 */
export declare const replace: <T>(list: readonly T[], newItem: T, match: (item: T, idx: number) => boolean) => T[];
/**
 * Convert an array to a dictionary by mapping each item
 * into a dictionary key & value
 */
export declare const objectify: <T, Key extends string | number | symbol, Value = T>(array: readonly T[], getKey: (item: T) => Key, getValue?: (item: T) => Value) => Record<Key, Value>;
/**
 * Select performs a filter and a mapper inside of a reduce,
 * only iterating the list one time.
 *
 * @example
 * select([1, 2, 3, 4], x => x*x, x > 2) == [9, 16]
 */
export declare const select: <T, K>(array: readonly T[], mapper: (item: T, index: number) => K, condition: (item: T, index: number) => boolean) => K[];
/**
 * Max gets the greatest value from a list
 *
 * @example
 * max([ 2, 3, 5]) == 5
 * max([{ num: 1 }, { num: 2 }], x => x.num) == { num: 2 }
 */
export declare function max(array: readonly [number, ...number[]]): number;
export declare function max(array: readonly number[]): number | null;
export declare function max<T>(array: readonly T[], getter: (item: T) => number): T | null;
/**
 * Min gets the smallest value from a list
 *
 * @example
 * min([1, 2, 3, 4]) == 1
 * min([{ num: 1 }, { num: 2 }], x => x.num) == { num: 1 }
 */
export declare function min(array: readonly [number, ...number[]]): number;
export declare function min(array: readonly number[]): number | null;
export declare function min<T>(array: readonly T[], getter: (item: T) => number): T | null;
/**
 * Splits a single list into many lists of the desired size. If
 * given a list of 10 items and a size of 2, it will return 5
 * lists with 2 items each
 */
export declare const cluster: <T>(list: readonly T[], size?: number) => T[][];
/**
 * Given a list of items returns a new list with only
 * unique items. Accepts an optional identity function
 * to convert each item in the list to a comparable identity
 * value
 */
export declare const unique: <T, K extends string | number | symbol>(array: readonly T[], toKey?: (item: T) => K) => T[];
/**
 * Creates a generator that will produce an iteration through
 * the range of number as requested.
 *
 * @example
 * range(3)                  // yields 0, 1, 2, 3
 * range(0, 3)               // yields 0, 1, 2, 3
 * range(0, 3, 'y')          // yields y, y, y, y
 * range(0, 3, () => 'y')    // yields y, y, y, y
 * range(0, 3, i => i)       // yields 0, 1, 2, 3
 * range(0, 3, i => `y${i}`) // yields y0, y1, y2, y3
 * range(0, 3, obj)          // yields obj, obj, obj, obj
 * range(0, 6, i => i, 2)    // yields 0, 2, 4, 6
 */
export declare function range<T = number>(startOrLength: number, end?: number, valueOrMapper?: T | ((i: number) => T), step?: number): Generator<T>;
/**
 * Creates a list of given start, end, value, and
 * step parameters.
 *
 * @example
 * list(3)                  // 0, 1, 2, 3
 * list(0, 3)               // 0, 1, 2, 3
 * list(0, 3, 'y')          // y, y, y, y
 * list(0, 3, () => 'y')    // y, y, y, y
 * list(0, 3, i => i)       // 0, 1, 2, 3
 * list(0, 3, i => `y${i}`) // y0, y1, y2, y3
 * list(0, 3, obj)          // obj, obj, obj, obj
 * list(0, 6, i => i, 2)    // 0, 2, 4, 6
 */
export declare const list: <T = number>(startOrLength: number, end?: number, valueOrMapper?: T | ((i: number) => T), step?: number) => T[];
/**
 * Given an array of arrays, returns a single
 * dimentional array with all items in it.
 */
export declare const flat: <T>(lists: readonly T[][]) => T[];
/**
 * Given two arrays, returns true if any
 * elements intersect
 */
export declare const intersects: <T, K extends string | number | symbol>(listA: readonly T[], listB: readonly T[], identity?: (t: T) => K) => boolean;
/**
 * Split an array into two array based on
 * a true/false condition function
 */
export declare const fork: <T>(list: readonly T[], condition: (item: T) => boolean) => [T[], T[]];
/**
 * Given two lists of the same type, iterate the first list
 * and replace items matched by the matcher func in the
 * first place.
 */
export declare const merge: <T>(root: readonly T[], others: readonly T[], matcher: (item: T) => any) => readonly T[];
/**
 * Replace an item in an array by a match function condition. If
 * no items match the function condition, appends the new item to
 * the end of the list.
 */
export declare const replaceOrAppend: <T>(list: readonly T[], newItem: T, match: (a: T, idx: number) => boolean) => T[];
/**
 * If the item matching the condition already exists
 * in the list it will be removed. If it does not it
 * will be added.
 */
export declare const toggle: <T>(list: readonly T[], item: T, 
/**
 * Converts an item of type T item into a value that
 * can be checked for equality
 */
toKey?: null | ((item: T, idx: number) => number | string | symbol), options?: {
    strategy?: "prepend" | "append";
}) => T[];
type Falsy = null | undefined | false | '' | 0 | 0n;
/**
 * Given a list returns a new list with
 * only truthy values
 */
export declare const sift: <T>(list: readonly (T | Falsy)[]) => T[];
/**
 * Like a reduce but does not require an array.
 * Only need a number and will iterate the function
 * as many times as specified.
 *
 * NOTE: This is NOT zero indexed. If you pass count=5
 * you will get 1, 2, 3, 4, 5 iteration in the callback
 * function
 */
export declare const iterate: <T>(count: number, func: (currentValue: T, iteration: number) => T, initValue: T) => T;
/**
 * Returns all items from the first list that
 * do not exist in the second list.
 */
export declare const diff: <T>(root: readonly T[], other: readonly T[], identity?: (item: T) => string | number | symbol) => T[];
/**
 * Shift array items by n steps
 * If n > 0 items will shift n steps to the right
 * If n < 0 items will shift n steps to the left
 */
export declare function shift<T>(arr: Array<T>, n: number): T[];
export {};
