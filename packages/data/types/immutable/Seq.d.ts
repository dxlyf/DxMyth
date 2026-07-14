import { Collection } from './Collection';
import { isSeq } from './predicates/isSeq';
import { Iterator } from './Iterator';
export function keyedSeqFromValue(value: any): any;
export function indexedSeqFromValue(value: any): ArraySeq | CollectionSeq;
export class Seq extends Collection {
    toSeq(): this;
    toString(): any;
    cacheResult(): this;
    _cache: any;
    size: any;
    __iterate(fn: any, reverse: any): any;
    __iterator(type: any, reverse: any): any;
}
export namespace Seq {
    export { isSeq };
    export { KeyedSeq as Keyed };
    export { SetSeq as Set };
    export { IndexedSeq as Indexed };
}
export class KeyedSeq extends Seq {
    toKeyedSeq(): this;
}
export class IndexedSeq extends Seq {
    static of(...args: any[]): any;
    toIndexedSeq(): this;
}
export class SetSeq extends Seq {
    static of(...args: any[]): any;
    toSetSeq(): this;
}
export class ArraySeq extends IndexedSeq {
    _array: any;
    get(index: any, notSetValue: any): any;
    __iterate(fn: any, reverse: any): number;
    __iterator(type: any, reverse: any): Iterator<any>;
}
declare class CollectionSeq extends IndexedSeq {
    _collection: any;
    __iterateUncached(fn: any, reverse: any): any;
    __iteratorUncached(type: any, reverse: any): any;
}
export {};
