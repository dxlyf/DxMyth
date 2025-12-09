/** @hidden */
export interface DataDriverListener<D, R> {
    enter: (d: D) => R | null;
    exit: (d: D, ref: R) => void;
    update: (d: D, ref: R) => void;
}
/**
 * @experimental @hidden
 *
 * DataDriver is used it to create, update and destroy physics entities based on game objects.
 */
export declare class DataDriver<D extends object, R> {
    /** @internal */ private _refMap;
    /** @internal */ private _listener;
    /** @internal */ private _key;
    constructor(key: (d: D) => string, listener: DataDriverListener<D, R>);
    /** @internal */ private _map;
    /** @internal */ private _xmap;
    /** @internal */ private _data;
    /** @internal */ private _entered;
    /** @internal */ private _exited;
    update(data: (D | null)[]): void;
    ref(d: D): R;
}
