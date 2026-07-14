import { IndexedCollection } from './Collection';
import { Iterator } from './Iterator';
import { isList } from './predicates/isList';
export function emptyList(): any;
export class List extends IndexedCollection {
    static of(...args: any[]): any;
    toString(): any;
    get(index: any, notSetValue: any): any;
    set(index: any, value: any): any;
    remove(index: any): any;
    insert(index: any, value: any): any;
    clear(): any;
    size: number;
    _origin: number;
    _capacity: number;
    _level: number;
    _root: any;
    _tail: any;
    __hash: any;
    __altered: boolean;
    push(...args: any[]): any;
    pop(): any;
    unshift(...args: any[]): any;
    shift(): any;
    shuffle(random?: () => number): any;
    concat(...args: any[]): any;
    setSize(size: any): any;
    map(mapper: any, context: any): any;
    slice(begin: any, end: any): any;
    __iterator(type: any, reverse: any): Iterator<any>;
    __iterate(fn: any, reverse: any): number;
    __ensureOwner(ownerID: any): any;
    __ownerID: any;
}
export namespace List {
    export { isList };
}
