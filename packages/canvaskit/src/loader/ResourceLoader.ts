// 资源加载状态枚举
export enum ResourceLoadStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error'
}

// 资源加载选项接口
export interface ResourceLoadOptions {
  /** 是否使用缓存 */
  useCache?: boolean;
  /** 资源类型 */
  type?: string;
  /** 优先级 */
  priority?: number;
  /** 加载超时时间（毫秒） */
  timeout?: number;
  /** 自定义请求头 */
  headers?: Record<string, string>;
}

// 资源信息接口
export interface ResourceInfo {
  /** 资源唯一标识符 */
  id: string;
  /** 资源URL或路径 */
  src: string;
  /** 资源类型 */
  type: string;
  /** 资源大小（字节） */
  size?: number;
  /** 加载时间戳 */
  loadedAt?: number;
  /** 最后使用时间戳 */
  lastUsedAt?: number;
  /** 引用计数 */
  refCount?: number;
}

// 资源加载进度接口
export interface ResourceProgress {
  /** 当前加载字节数 */
  loaded: number;
  /** 总字节数 */
  total: number;
  /** 加载百分比 */
  percent: number;
}

// 资源加载器接口
export interface ResourceLoader<T = any> {
  /**
   * 加载资源
   * @param src 资源URL或路径
   * @param options 加载选项
   * @returns Promise<T> 加载的资源
   */
  load(src: string, options?: ResourceLoadOptions): Promise<T>;
  
  /**
   * 预加载资源
   * @param src 资源URL或路径
   * @param options 加载选项
   * @returns Promise<boolean> 预加载是否成功
   */
  preload(src: string, options?: ResourceLoadOptions): Promise<boolean>;
  
  /**
   * 获取已加载的资源
   * @param id 资源标识符
   * @returns T | null 资源对象或null
   */
  get(id: string): T | null;
  
  /**
   * 释放资源
   * @param id 资源标识符
   * @returns boolean 是否成功释放
   */
  release(id: string): boolean;
  
  /**
   * 批量释放资源
   * @param ids 资源标识符数组
   * @returns boolean[] 每个资源释放的结果
   */
  releaseMultiple(ids: string[]): boolean[];
  
  /**
   * 清理所有未使用的资源
   * @returns number 清理的资源数量
   */
  cleanup(): number;
  
  /**
   * 监听加载进度
   * @param callback 进度回调函数
   * @returns () => void 取消监听函数
   */
  onProgress(callback: (progress: ResourceProgress) => void): () => void;
  
  /**
   * 监听加载完成
   * @param callback 完成回调函数
   * @returns () => void 取消监听函数
   */
  onLoadComplete(callback: (resource: T, info: ResourceInfo) => void): () => void;
  
  /**
   * 监听加载错误
   * @param callback 错误回调函数
   * @returns () => void 取消监听函数
   */
  onLoadError(callback: (error: Error, src: string) => void): () => void;
}

// 资源加载器构造函数参数接口
export interface ResourceLoaderOptions {
  /** 资源缓存管理器 */
  cache?: ResourceCache;
  /** 默认加载选项 */
  defaultOptions?: ResourceLoadOptions;
  /** 最大并发加载数量 */
  maxConcurrentLoads?: number;
  /** 资源类型 */
  resourceType?: string;
}

// 资源缓存接口
export interface ResourceCache<T = any> {
  /**
   * 获取缓存资源
   * @param key 缓存键
   * @returns T | null 缓存的资源或null
   */
  get(key: string): T | null;
  
  /**
   * 设置缓存资源
   * @param key 缓存键
   * @param value 缓存值
   * @param info 资源信息
   * @returns boolean 是否成功缓存
   */
  set(key: string, value: T, info?: ResourceInfo): boolean;
  
  /**
   * 删除缓存资源
   * @param key 缓存键
   * @returns boolean 是否成功删除
   */
  delete(key: string): boolean;
  
  /**
   * 检查缓存是否存在
   * @param key 缓存键
   * @returns boolean 是否存在
   */
  has(key: string): boolean;
  
  /**
   * 清理缓存
   * @param maxAge 最大缓存时间（毫秒）
   * @returns number 清理的缓存数量
   */
  clear(maxAge?: number): number;
  
  /**
   * 获取缓存统计信息
   */
  getStats(): {
    size: number;
    keys: string[];
    totalSize: number;
  };
}

// 资源工厂接口
export interface ResourceFactory {
  /**
   * 创建资源加载器
   * @param type 资源类型
   * @param options 加载器选项
   * @returns ResourceLoader 资源加载器实例
   */
  createLoader<T>(type: string, options?: ResourceLoaderOptions): ResourceLoader<T>;
  
  /**
   * 注册资源加载器
   * @param type 资源类型
   * @param loaderClass 加载器类
   */
  registerLoader(type: string, loaderClass: new (options?: ResourceLoaderOptions) => ResourceLoader): void;
  
  /**
   * 获取已注册的加载器类型
   * @returns string[] 加载器类型数组
   */
  getRegisteredTypes(): string[];
}