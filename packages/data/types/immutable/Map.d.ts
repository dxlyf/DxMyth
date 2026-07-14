import { KeyedCollection } from './Collection';
import { isMap } from './predicates/isMap';
import { Iterator } from './Iterator';
export function emptyMap(): any;
export class Map extends KeyedCollection {
    toString(): any;
    get(k: any, notSetValue: any): any;
    set(k: any, v: any): any;
    remove(k: any): any;
    deleteAll(keys: any): any;
    clear(): any;
    size: number;
    _root: any;
    __hash: any;
    __altered: boolean;
    sort(comparator: any): any;
    sortBy(mapper: any, comparator: any): any;
    map(mapper: any, context: any): any;
    __iterator(type: any, reverse: any): MapIterator;
    __iterate(fn: any, reverse: any): number;
    __ensureOwner(ownerID: any): any;
    __ownerID: any;
}
export namespace Map {
    export { isMap };
}
declare class MapIterator extends Iterator<any> {
    constructor(map: any, type: any, reverse: any);
    _type: any;
    _reverse: any;
    _stack: {
        node: any;
        index: number;
        __prev: any;
    };
    next(): IteratorResult<any, any>;
}
export {};
