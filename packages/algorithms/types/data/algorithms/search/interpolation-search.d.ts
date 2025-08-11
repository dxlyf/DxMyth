import { defaultCompare, defaultEquals, defaultDiff } from '../../util';
export declare function interpolationSearch<T>(array: T[], value: T, compareFn?: typeof defaultCompare, equalsFn?: typeof defaultEquals, diffFn?: typeof defaultDiff): number;
