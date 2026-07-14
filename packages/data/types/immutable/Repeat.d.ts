import { IndexedSeq } from './Seq';
import { Iterator } from './Iterator';
/**
 * Returns a lazy Seq of `value` repeated `times` times. When `times` is
 * undefined, returns an infinite sequence of `value`.
 */
export class Repeat extends IndexedSeq {
    constructor(value: any, times: any);
    _value: any;
    toString(): string;
    get(index: any, notSetValue: any): any;
    includes(searchValue: any): boolean;
    slice(begin: any, end: any): Repeat;
    reverse(): this;
    indexOf(searchValue: any): 0 | -1;
    lastIndexOf(searchValue: any): number;
    __iterate(fn: any, reverse: any): number;
    __iterator(type: any, reverse: any): Iterator<any>;
    equals(other: any): boolean;
}
