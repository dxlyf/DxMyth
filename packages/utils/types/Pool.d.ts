/**
 * 对象池配置选项
 */
interface PoolOptions<T> {
    /** 池子最大容量 */
    maxSize?: number;
    /** 对象创建函数 */
    create: () => T;
    /** 对象重置清理函数 */
    reset?: (obj: T) => void;
    /** 对象验证函数（返回对象是否可用） */
    validate?: (obj: T) => boolean;
    /** 池子初始化时预创建的对象数量 */
    preAllocate?: number;
}
/**
 * 通用对象池类
 * 用于管理对象的重用，减少垃圾回收压力
 */
export declare class Pool<T> {
    private available;
    private inUse;
    private maxSize;
    private create;
    private reset?;
    private validate?;
    private totalCreated;
    constructor(options: PoolOptions<T>);
    /**
     * 从池中获取一个对象
     * @returns 可用的对象
     */
    acquire(): T;
    /**
     * 释放对象回池中
     * @param obj 要释放的对象
     */
    release(obj: T): void;
    /**
     * 批量释放多个对象
     * @param objects 要释放的对象数组
     */
    releaseAll(objects: T[]): void;
    /**
     * 获取池子统计信息
     */
    getStats(): {
        available: number;
        inUse: number;
        totalCreated: number;
        maxSize: number;
    };
    /**
     * 清空池子并释放所有资源
     */
    dispose(): void;
    /**
     * 获取当前可用的对象数量
     */
    get availableCount(): number;
    /**
     * 获取当前正在使用的对象数量
     */
    get inUseCount(): number;
    /**
     * 检查对象是否正在被使用
     */
    isInUse(obj: T): boolean;
}
/**
 * 自动释放的包装器，使用 RAII 模式
 */
declare class AutoRelease<T> {
    private pool;
    private obj;
    constructor(pool: Pool<T>, obj: T);
    get value(): T;
    release(): void;
    [Symbol.dispose](): void;
}
/**
 * 扩展的 Pool 类，支持自动释放
 */
export declare class AutoPool<T> extends Pool<T> {
    /**
     * 获取对象并返回自动释放包装器
     */
    autoAcquire(): AutoRelease<T>;
}
export {};
