import { IndexedCollection } from './Collection';
import { Iterator } from './Iterator';
import { isStack } from './predicates/isStack';
export class Stack extends IndexedCollection {
    static of(...args: any[]): any;
    toString(): any;
    get(index: any, notSetValue: any): any;
    peek(): any;
    push(...args: any[]): any;
    size: any;
    _head: any;
    __hash: any;
    __altered: boolean;
    pushAll(iter: any): any;
    pop(): any;
    clear(): any;
    slice(begin: any, end: any): any;
    __ensureOwner(ownerID: any): any;
    __ownerID: any;
    __iterate(fn: any, reverse: any): number;
    __iterator(type: any, reverse: any): Iterator<any>;
}
export namespace Stack {
    export { isStack };
}
