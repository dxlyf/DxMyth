import { isRecord } from './predicates/isRecord';
export class Record {
    constructor(defaultValues: any, name: any);
    toString(): string;
    equals(other: any): any;
    hashCode(): any;
    has(k: any): any;
    get(k: any, notSetValue: any): any;
    set(k: any, v: any): any;
    remove(k: any): any;
    clear(): any;
    wasAltered(): any;
    toSeq(): any;
    toJS(): unknown[] | {
        [key: string]: unknown;
    };
    entries(): any;
    __iterator(type: any, reverse: any): any;
    __iterate(fn: any, reverse: any): any;
    __ensureOwner(ownerID: any): any;
    __ownerID: any;
    _values: any;
}
export namespace Record {
    export { isRecord };
    export { recordName as getDescriptiveName };
}
declare function recordName(record: any): any;
export {};
