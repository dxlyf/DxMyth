import { IndexedSeq } from './Seq';
import { Iterator } from './Iterator';
/**
 * Returns a lazy seq of nums from start (inclusive) to end
 * (exclusive), by step, where start defaults to 0, step to 1, and end to
 * infinity. When start is equal to end, returns empty list.
 */
export class Range extends IndexedSeq {
    constructor(start: any, end: any, step?: number);
    _start: any;
    _end: any;
    _step: number;
    toString(): string;
    get(index: any, notSetValue: any): any;
    includes(searchValue: any): boolean;
    slice(begin: any, end: any): Range;
    indexOf(searchValue: any): number;
    lastIndexOf(searchValue: any): number;
    __iterate(fn: any, reverse: any): number;
    __iterator(type: any, reverse: any): Iterator<any>;
    equals(other: any): boolean;
}
