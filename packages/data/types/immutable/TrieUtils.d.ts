import { Collection } from '../type-definitions/immutable';
export declare const DELETE = "delete";
export declare const SHIFT = 5;
export declare const SIZE: number;
export declare const MASK: number;
export declare const NOT_SET: {};
type Ref = {
    value: boolean;
};
export declare function MakeRef(): Ref;
export declare function SetRef(ref: Ref): void;
export declare function OwnerID(): void;
export declare function ensureSize(iter: Collection<unknown, unknown>): number;
export declare function wrapIndex(iter: Collection<unknown, unknown>, index: number): number;
export declare function returnTrue(): true;
export declare function wholeSlice(begin: number, end: number, size: number): boolean;
export declare function resolveBegin(begin: number, size: number): number;
export declare function resolveEnd(end: number, size: number): number;
export {};
