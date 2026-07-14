import { Map } from './Map';
import { isOrderedMap } from './predicates/isOrderedMap';
export function emptyOrderedMap(): any;
export class OrderedMap extends Map {
    static of(...args: any[]): any;
    __iterate(fn: any, reverse: any): any;
    __iterator(type: any, reverse: any): any;
    _map: any;
    _list: any;
}
export namespace OrderedMap {
    export { isOrderedMap };
}
