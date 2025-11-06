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
export class Pool<T> {
  private available: T[] = [];
  private inUse: Set<T> = new Set();
  private maxSize: number;
  private create: () => T;
  private reset?: (obj: T) => void;
  private validate?: (obj: T) => boolean;
  private totalCreated: number = 0;

  constructor(options: PoolOptions<T>) {
    this.maxSize = options.maxSize || 100;
    this.create = options.create;
    this.reset = options.reset;
    this.validate = options.validate;

    // 预分配对象
    const preAllocate = options.preAllocate || 0;
    for (let i = 0; i < preAllocate && this.available.length < this.maxSize; i++) {
      const obj = this.create();
      this.available.push(obj);
      this.totalCreated++;
    }
  }

  /**
   * 从池中获取一个对象
   * @returns 可用的对象
   */
  acquire(): T {
    // 尝试从可用池中获取对象
    while (this.available.length > 0) {
      const obj = this.available.pop()!;
      
      // 验证对象是否仍然可用
      if (!this.validate || this.validate(obj)) {
        this.inUse.add(obj);
        return obj;
      }
    }

    // 如果没有可用对象且未达到最大容量，创建新对象
    if (this.totalCreated < this.maxSize) {
      const obj = this.create();
      this.inUse.add(obj);
      this.totalCreated++;
      return obj;
    }

    // 池子已满，抛出错误或返回新对象（根据配置决定）
    throw new Error(`Pool reached maximum size: ${this.maxSize}`);
  }

  /**
   * 释放对象回池中
   * @param obj 要释放的对象
   */
  release(obj: T): void {
    if (!this.inUse.has(obj)) {
      console.warn('Attempted to release an object not in use');
      return;
    }

    // 重置对象状态
    if (this.reset) {
      this.reset(obj);
    }

    // 从使用中移除，添加到可用池
    this.inUse.delete(obj);
    
    // 如果池子未满，回收对象；否则丢弃
    if (this.available.length < this.maxSize) {
      this.available.push(obj);
    }
  }

  /**
   * 批量释放多个对象
   * @param objects 要释放的对象数组
   */
  releaseAll(objects: T[]): void {
    objects.forEach(obj => this.release(obj));
  }

  /**
   * 获取池子统计信息
   */
  getStats(): {
    available: number;
    inUse: number;
    totalCreated: number;
    maxSize: number;
  } {
    return {
      available: this.available.length,
      inUse: this.inUse.size,
      totalCreated: this.totalCreated,
      maxSize: this.maxSize,
    };
  }

  /**
   * 清空池子并释放所有资源
   */
  dispose(): void {
    this.available = [];
    this.inUse.clear();
    this.totalCreated = 0;
  }

  /**
   * 获取当前可用的对象数量
   */
  get availableCount(): number {
    return this.available.length;
  }

  /**
   * 获取当前正在使用的对象数量
   */
  get inUseCount(): number {
    return this.inUse.size;
  }

  /**
   * 检查对象是否正在被使用
   */
  isInUse(obj: T): boolean {
    return this.inUse.has(obj);
  }
}

/**
 * 自动释放的包装器，使用 RAII 模式
 */
class AutoRelease<T> {
  constructor(
    private pool: Pool<T>,
    private obj: T
  ) {}

  get value(): T {
    return this.obj;
  }

  release(): void {
    this.pool.release(this.obj);
  }

  // Symbol.dispose 用于 using 语句（ES2022+）
  [Symbol.dispose](): void {
    this.release();
  }
}

/**
 * 扩展的 Pool 类，支持自动释放
 */
export class AutoPool<T> extends Pool<T> {
  /**
   * 获取对象并返回自动释放包装器
   */
  autoAcquire(): AutoRelease<T> {
    const obj = this.acquire();
    return new AutoRelease(this, obj);
  }
}

// // 使用自动释放（需要 ES2022+ 环境）
// const autoPool = new AutoPool<CanvasObject>({
//   maxSize: 50,
//   create: () => ({ x: 0, y: 0, width: 0, height: 0, color: '#000000' }),
//   reset: (obj) => Object.assign(obj, { x: 0, y: 0, width: 0, height: 0, color: '#000000' })
// });

// // 使用 using 语句自动释放
// {
//   using obj = autoPool.autoAcquire();
//   obj.value.x = 100;
//   obj.value.y = 200;
//   // 超出作用域时自动释放
// }