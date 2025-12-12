import { GetArgs } from '../../../../../../../src/types/Util';
export type PoolServiceOptions<T> = {
    maxSize?: number; /** 最大缓存数量 */
    initialSize?: number; /** 初始缓存数量 */
    create: (...args: any[]) => T; /** 创建缓存项 */
    init: (...args: any[]) => void; /** 初始化缓存项 */
    reset?: (item: T) => void; /** 重置缓存项 */
    dispose?: (item: T) => void; /** 释放缓存项 */
};
export interface IPoolService<T, P = any> {
    _poolService: PoolService<T, P>;
    releasePool(): void;
    destroyPool(): void;
}
export type IPoolServiceStatic<T, P = any> = {
    getPool: (...args: GetArgs<P>) => T;
    releasePool: (item: T) => void;
};
export declare const poolServiceSymbol = "_poolService";
export declare const getPoolService: <T, P = any>(target: any) => PoolService<T, P>;
/**
 * 为类添加缓存池服务
 * @param target 类构造函数
 * @param options 缓存池服务选项
 */
declare function mixinPoolService<T>(target: {
    new (...args: any[]): T;
}, options: PoolServiceOptions<T>): void;
/**
 * 缓存池服务
 */
export declare class PoolService<T, P = any> {
    static mixin: typeof mixinPoolService;
    private options;
    private pools;
    private createdCount;
    private usedPool;
    constructor(options: PoolServiceOptions<T>);
    init(): void;
    prepopulate(total: number): void;
    acquire(...args: GetArgs<P>): T;
    release(item: T): void;
    disposeItem(item: T): void;
    [Symbol.dispose](): void;
    dispose(): void;
    destroy(): void;
}
export {};
