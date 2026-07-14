import { Objectish, Draft, AnyObject, AnyMap, AnySet, ImmerState, ArchType, StrictMode } from '../internal';
export declare const getPrototypeOf: (o: any) => any;
export declare const CONSTRUCTOR = "constructor";
export declare const PROTOTYPE = "prototype";
export declare const CONFIGURABLE = "configurable";
export declare const ENUMERABLE = "enumerable";
export declare const WRITABLE = "writable";
export declare const VALUE = "value";
/** Returns true if the given value is an Immer draft */
export declare let isDraft: (value: any) => boolean;
/** Returns true if the given value can be drafted by Immer */
export declare function isDraftable(value: any): boolean;
export declare function isPlainObject(value: any): boolean;
/** Get the underlying object that is represented by the given draft */
export declare function original<T>(value: Draft<T>): T;
/**
 * Each iterates a map, set or array.
 * Or, if any other kind of object, all of its own properties.
 *
 * @param obj The object to iterate over
 * @param iter The iterator function
 * @param strict When true (default), includes symbols and non-enumerable properties.
 *               When false, uses looseiteration over only enumerable string properties.
 */
export declare function each<T extends Objectish>(obj: T, iter: (key: string | number, value: any, source: T) => void, strict?: boolean): void;
export declare function getArchtype(thing: any): ArchType;
export declare let has: (thing: any, prop: PropertyKey, type?: ArchType) => boolean;
export declare let get: (thing: AnyMap | AnyObject, prop: PropertyKey, type?: ArchType) => any;
export declare let set: (thing: any, propOrOldValue: PropertyKey, value: any, type?: ArchType) => void;
export declare function is(x: any, y: any): boolean;
export declare let isArray: (arg: any) => arg is any[];
export declare let isMap: (target: any) => target is AnyMap;
export declare let isSet: (target: any) => target is AnySet;
export declare let isObjectish: (target: any) => boolean;
export declare let isFunction: (target: any) => target is Function;
export declare let isBoolean: (target: any) => target is boolean;
export declare function isArrayIndex(value: string | number): value is number | string;
export declare let getProxyDraft: <T extends any>(value: T) => ImmerState | null;
export declare let latest: (state: ImmerState) => any;
export declare let getValue: <T extends object>(value: T) => T;
export declare let getFinalValue: (state: ImmerState) => any;
export declare function shallowCopy(base: any, strict: StrictMode): any;
/**
 * Freezes draftable objects. Returns the original object.
 * By default freezes shallowly, but if the second argument is `true` it will freeze recursively.
 *
 * @param obj
 * @param deep
 */
export declare function freeze<T>(obj: T, deep?: boolean): T;
export declare function isFrozen(obj: any): boolean;
