/** @internal */
export interface PoolOptions<T> {
    max?: number;
    create?: () => T;
    /** Called when an object is being re-allocated. */
    allocate?: (item: T) => void;
    /** Called when an object is returned to pool. */
    release?: (item: T) => void;
    /** Called when an object is returned to the pool but will be disposed from pool. */
    dispose?: (item: T) => T;
}
/** @internal */
export declare class Pool<T> {
    _list: T[];
    _max: number;
    _createFn: () => T;
    _hasCreateFn: boolean;
    _createCount: number;
    _allocateFn: (item: T) => void;
    _hasAllocateFn: boolean;
    _allocateCount: number;
    _releaseFn: (item: T) => void;
    _hasReleaseFn: boolean;
    _releaseCount: number;
    _disposeFn: (item: T) => T;
    _hasDisposeFn: boolean;
    _disposeCount: number;
    constructor(opts: PoolOptions<T>);
    max(n?: number): number | Pool<T>;
    size(): number;
    allocate(): T;
    release(item: T): void;
    toString(): string;
}
