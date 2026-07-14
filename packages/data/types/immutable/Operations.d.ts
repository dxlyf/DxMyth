import { KeyedSeq, IndexedSeq, SetSeq, Seq } from './Seq';
import { Iterator } from './Iterator';
export function flipFactory(collection: any): any;
export function mapFactory(collection: any, mapper: any, context: any): any;
export function reverseFactory(collection: any, useKeys: any): any;
export function filterFactory(collection: any, predicate: any, context: any, useKeys: any): any;
export function countByFactory(collection: any, grouper: any, context: any): any;
export function groupByFactory(collection: any, grouper: any, context: any): any;
export function partitionFactory(collection: any, predicate: any, context: any): any[];
export function sliceFactory(collection: any, begin: any, end: any, useKeys: any): any;
export function takeWhileFactory(collection: any, predicate: any, context: any): any;
export function skipWhileFactory(collection: any, predicate: any, context: any, useKeys: any): any;
export function concatFactory(collection: any, values: any): any;
export function flattenFactory(collection: any, depth: any, useKeys: any): any;
export function flatMapFactory(collection: any, mapper: any, context: any): any;
export function interposeFactory(collection: any, separator: any): any;
export function sortFactory(collection: any, comparator: any, mapper: any): any;
export function maxFactory(collection: any, comparator: any, mapper: any): any;
export function zipWithFactory(keyIter: any, zipper: any, iters: any, zipAll: any): any;
export function reify(iter: any, seq: any): any;
export class ToKeyedSequence extends KeyedSeq {
    constructor(indexed: any, useKeys: any);
    _iter: any;
    _useKeys: any;
    get(key: any, notSetValue: any): any;
    has(key: any): any;
    valueSeq(): any;
    reverse(): any;
    map(mapper: any, context: any): any;
    cacheResult: typeof cacheResultThrough;
}
export class ToIndexedSequence extends IndexedSeq {
    _iter: any;
    includes(value: any): any;
    __iterator(type: any, reverse: any): Iterator<any>;
    cacheResult: typeof cacheResultThrough;
}
export class ToSetSequence extends SetSeq {
    _iter: any;
    has(key: any): any;
    __iterator(type: any, reverse: any): Iterator<any>;
    cacheResult: typeof cacheResultThrough;
}
export class FromEntriesSequence extends KeyedSeq {
    _iter: any;
    entrySeq(): any;
    __iterator(type: any, reverse: any): Iterator<any>;
    cacheResult: typeof cacheResultThrough;
}
declare function cacheResultThrough(): Seq | this;
declare class cacheResultThrough {
    size: any;
}
export {};
