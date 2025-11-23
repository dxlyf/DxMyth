import { ResourceLoader, ResourceLoaderOptions, ResourceFactory } from './ResourceLoader';
import { ResourceCache } from './ResourceCache';

/**
 * 资源加载器工厂类
 * 负责创建和管理各种资源加载器
 */
export class ResourceLoaderFactory implements ResourceFactory {
  // 存储已注册的加载器类
  private loaderClasses: Map<string, new (options?: ResourceLoaderOptions) => ResourceLoader> = new Map();
  
  // 存储已创建的加载器实例
  private loaderInstances: Map<string, ResourceLoader> = new Map();
  
  // 默认缓存实例
  private defaultCache: ResourceCache;
  
  /**
   * 构造函数
   */
  constructor() {
    this.defaultCache = new ResourceCache();
    
    // 注册默认的加载器类型
    this.registerDefaultLoaders();
  }
  
  /**
   * 注册默认加载器
   */
  private registerDefaultLoaders(): void {
    // 这里先留空，稍后在实现具体加载器后再注册
  }
  
  /**
   * 创建资源加载器
   * @param type 资源类型
   * @param options 加载器选项
   * @returns ResourceLoader 资源加载器实例
   */
  createLoader<T = any>(type: string, options?: ResourceLoaderOptions): ResourceLoader<T> {
    // 检查是否已存在该类型的加载器实例
    const cacheKey = `${type}_${JSON.stringify(options || {})}`;
    if (this.loaderInstances.has(cacheKey)) {
      return this.loaderInstances.get(cacheKey) as ResourceLoader<T>;
    }
    
    // 获取加载器类
    const LoaderClass = this.loaderClasses.get(type);
    if (!LoaderClass) {
      throw new Error(`未找到类型为 "${type}" 的资源加载器`);
    }
    
    // 创建加载器实例
    const loaderOptions: ResourceLoaderOptions = {
      cache: options?.cache || this.defaultCache,
      ...options
    };
    
    const loader = new LoaderClass(loaderOptions);
    
    // 缓存加载器实例
    this.loaderInstances.set(cacheKey, loader);
    
    return loader as ResourceLoader<T>;
  }
  
  /**
   * 注册资源加载器
   * @param type 资源类型
   * @param loaderClass 加载器类
   */
  registerLoader(type: string, loaderClass: new (options?: ResourceLoaderOptions) => ResourceLoader): void {
    if (this.loaderClasses.has(type)) {
      console.warn(`资源加载器类型 "${type}" 已经存在，将被覆盖`);
    }
    
    this.loaderClasses.set(type, loaderClass);
    
    // 清除相关的缓存实例
    this.clearLoaderInstances(type);
  }
  
  /**
   * 获取已注册的加载器类型
   * @returns string[] 加载器类型数组
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.loaderClasses.keys());
  }
  
  /**
   * 清除特定类型的加载器实例缓存
   * @param type 资源类型
   */
  private clearLoaderInstances(type: string): void {
    const keysToDelete: string[] = [];
    
    this.loaderInstances.forEach((_, key) => {
      if (key.startsWith(`${type}_`)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => {
      this.loaderInstances.delete(key);
    });
  }
  
  /**
   * 获取加载器类
   * @param type 资源类型
   * @returns 加载器类或undefined
   */
  getLoaderClass(type: string): (new (options?: ResourceLoaderOptions) => ResourceLoader) | undefined {
    return this.loaderClasses.get(type);
  }
  
  /**
   * 移除加载器注册
   * @param type 资源类型
   * @returns boolean 是否成功移除
   */
  unregisterLoader(type: string): boolean {
    const result = this.loaderClasses.delete(type);
    if (result) {
      this.clearLoaderInstances(type);
    }
    return result;
  }
  
  /**
   * 清理所有加载器实例
   */
  clearAllInstances(): void {
    this.loaderInstances.clear();
  }
  
  /**
   * 获取当前工厂的统计信息
   */
  getStats(): {
    registeredTypes: number;
    activeInstances: number;
  } {
    return {
      registeredTypes: this.loaderClasses.size,
      activeInstances: this.loaderInstances.size
    };
  }
}

// 全局工厂实例
export const resourceLoaderFactory = new ResourceLoaderFactory();

/**
 * 导出工厂方法
 */
export function createLoader<T = any>(type: string, options?: ResourceLoaderOptions): ResourceLoader<T> {
  return resourceLoaderFactory.createLoader<T>(type, options);
}

export function registerLoader(type: string, loaderClass: new (options?: ResourceLoaderOptions) => ResourceLoader): void {
  resourceLoaderFactory.registerLoader(type, loaderClass);
}

export function getRegisteredLoaderTypes(): string[] {
  return resourceLoaderFactory.getRegisteredTypes();
}