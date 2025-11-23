import { ResourceCache as IResourceCache, ResourceInfo } from './ResourceLoader';

// 缓存项接口
interface CacheItem<T> {
  value: T;
  info: ResourceInfo;
  timestamp: number;
  lastUsed: number;
  next?: CacheItem<T>;
  prev?: CacheItem<T>;
}

/**
 * 资源缓存管理器实现
 * 基于LRU (Least Recently Used) 策略和引用计数管理缓存
 */
export class ResourceCache<T = any> implements IResourceCache<T> {
  private cache: Map<string, CacheItem<T>> = new Map();
  private head: CacheItem<T> | null = null;
  private tail: CacheItem<T> | null = null;
  
  // 配置选项
  private maxSize: number;
  private maxAge: number;
  private sizeEstimator: (value: T) => number;
  
  /**
   * 构造函数
   * @param options 缓存选项
   */
  constructor(options: {
    maxSize?: number;        // 最大缓存项数量
    maxAge?: number;         // 最大缓存时间（毫秒）
    sizeEstimator?: (value: T) => number; // 大小估算函数
  } = {}) {
    this.maxSize = options.maxSize || 1000;
    this.maxAge = options.maxAge || 3600000; // 默认1小时
    this.sizeEstimator = options.sizeEstimator || this.defaultSizeEstimator;
  }
  
  /**
   * 默认大小估算函数
   */
  private defaultSizeEstimator(value: T): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'string') return value.length * 2;
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value).length * 2;
      } catch {
        return 100; // 无法估算时返回默认值
      }
    }
    return 8; // 基本类型默认8字节
  }
  
  /**
   * 获取缓存资源
   */
  get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // 检查是否过期
    if (Date.now() - item.timestamp > this.maxAge) {
      this.delete(key);
      return null;
    }
    
    // 更新最后使用时间并移动到链表头部（最近使用）
    item.lastUsed = Date.now();
    this.moveToFront(item);
    
    // 更新资源信息
    if (item.info) {
      item.info.lastUsedAt = item.lastUsed;
      item.info.refCount = (item.info.refCount || 0) + 1;
    }
    
    return item.value;
  }
  
  /**
   * 设置缓存资源
   */
  set(key: string, value: T, info?: ResourceInfo): boolean {
    // 如果已存在，先删除
    if (this.cache.has(key)) {
      this.delete(key);
    }
    
    // 创建缓存项
    const item: CacheItem<T> = {
      value,
      info: {
        id: info?.id || key,
        src: info?.src || key,
        type: info?.type || 'unknown',
        size: info?.size || this.sizeEstimator(value),
        loadedAt: Date.now(),
        lastUsedAt: Date.now(),
        refCount: 1,
        ...info
      },
      timestamp: Date.now(),
      lastUsed: Date.now()
    };
    
    // 添加到缓存
    this.cache.set(key, item);
    
    // 添加到链表头部
    this.addToFront(item);
    
    // 检查是否超出容量
    this.evictIfNeeded();
    
    return true;
  }
  
  /**
   * 删除缓存资源
   */
  delete(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    // 从链表中移除
    this.removeFromList(item);
    
    // 从缓存中删除
    return this.cache.delete(key);
  }
  
  /**
   * 检查缓存是否存在
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    // 检查是否过期
    if (Date.now() - item.timestamp > this.maxAge) {
      this.delete(key);
      return false;
    }
    
    return true;
  }
  
  /**
   * 清理缓存
   */
  clear(maxAge?: number): number {
    const age = maxAge !== undefined ? maxAge : this.maxAge;
    const now = Date.now();
    let removedCount = 0;
    
    // 收集要删除的键
    const keysToDelete: string[] = [];
    this.cache.forEach((item, key) => {
      if (now - item.timestamp > age) {
        keysToDelete.push(key);
      }
    });
    
    // 删除过期项
    keysToDelete.forEach(key => {
      this.delete(key);
      removedCount++;
    });
    
    return removedCount;
  }
  
  /**
   * 获取缓存统计信息
   */
  getStats(): {
    size: number;
    keys: string[];
    totalSize: number;
  } {
    let totalSize = 0;
    const keys: string[] = [];
    
    this.cache.forEach((item, key) => {
      keys.push(key);
      totalSize += item.info?.size || 0;
    });
    
    return {
      size: this.cache.size,
      keys,
      totalSize
    };
  }
  
  /**
   * 将项添加到链表头部
   */
  private addToFront(item: CacheItem<T>): void {
    item.next = this.head;
    item.prev = null;
    
    if (this.head) {
      this.head.prev = item;
    }
    
    this.head = item;
    
    if (!this.tail) {
      this.tail = item;
    }
  }
  
  /**
   * 将项移动到链表头部
   */
  private moveToFront(item: CacheItem<T>): void {
    if (item === this.head) return;
    
    // 从当前位置移除
    this.removeFromList(item);
    
    // 添加到头部
    this.addToFront(item);
  }
  
  /**
   * 从链表中移除项
   */
  private removeFromList(item: CacheItem<T>): void {
    if (item.prev) {
      item.prev.next = item.next;
    } else {
      this.head = item.next;
    }
    
    if (item.next) {
      item.next.prev = item.prev;
    } else {
      this.tail = item.prev;
    }
  }
  
  /**
   * 当缓存超出容量时执行淘汰
   */
  private evictIfNeeded(): void {
    while (this.cache.size > this.maxSize && this.tail) {
      // 删除尾部项（最久未使用）
      this.delete(this.tail.info.id);
    }
  }
  
  /**
   * 手动增加引用计数
   */
  incrementRefCount(key: string): boolean {
    const item = this.cache.get(key);
    if (!item || !item.info) return false;
    
    item.info.refCount = (item.info.refCount || 0) + 1;
    return true;
  }
  
  /**
   * 手动减少引用计数
   */
  decrementRefCount(key: string): boolean {
    const item = this.cache.get(key);
    if (!item || !item.info) return false;
    
    item.info.refCount = Math.max(0, (item.info.refCount || 1) - 1);
    
    // 如果引用计数为0，可以考虑自动释放
    if (item.info.refCount === 0) {
      // 可以在这里添加延迟删除逻辑
    }
    
    return true;
  }
}

/**
 * 创建缓存实例的工厂函数
 */
export function createCache<T = any>(options?: {
  maxSize?: number;
  maxAge?: number;
  sizeEstimator?: (value: T) => number;
}): ResourceCache<T> {
  return new ResourceCache(options);
}

// 默认缓存实例
export const defaultCache = createCache();