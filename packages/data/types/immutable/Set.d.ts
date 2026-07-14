import { SetCollection } from './Collection';
import { isSet } from './predicates/isSet';
export class Set extends SetCollection {
    static of(...args: any[]): any;
    static fromKeys(value: any): any;
    static intersect(sets: any): any;
    static union(sets: any): any;
    toString(): any;
    has(value: any): any;
    add(value: any): any;
    remove(value: any): any;
    clear(): any;
    map(mapper: any, context: any): any;
    union(...iters: any[]): any;
    intersect(...iters: any[]): any;
    subtract(...iters: any[]): any;
    sort(comparator: any): any;
    sortBy(mapper: any, comparator: any): any;
    wasAltered(): any;
    __iterate(fn: any, reverse: any): any;
    __iterator(type: any, reverse: any): any;
    __ensureOwner(ownerID: any): any;
    __ownerID: any;
    _map: any;
}
export namespace Set {
    export { isSet };
}
