import { Collection } from '../type-definitions/immutable';
export declare function reduce<K, V, R, C extends Collection<K, V>>(collection: C, reducer: (reduction: V | R, value: V, key: K, iter: C) => R, reduction: V | R | undefined, context: unknown, useFirst: boolean, reverse: boolean): V | R | undefined;
export declare function keyMapper<K, V>(v: V, k: K): K;
export declare function entryMapper<K, V>(v: V, k: K): [K, V];
export declare function not(predicate: (...args: unknown[]) => boolean): (this: unknown, ...args: unknown[]) => boolean;
export declare function neg(predicate: (...args: unknown[]) => number): (this: unknown, ...args: unknown[]) => number;
export declare function defaultNegComparator(a: number | string, b: number | string): number;
