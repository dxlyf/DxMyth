import {
  ResourceLoader,
  ResourceLoadOptions,
  ResourceInfo,
  ResourceProgress,
  ResourceLoaderOptions,
  ResourceLoadStatus
} from './ResourceLoader';
import { ResourceCache } from './ResourceCache';
import { registerLoader } from './ResourceLoaderFactory';

/**
 * 图片资源信息接口
 */
export interface ImageResourceInfo extends ResourceInfo {
  width?: number;
  height?: number;
  format?: string;
  mimeType?: string;
}

/**
 * 图片加载器实现
 */
export class ImageLoader implements ResourceLoader<HTMLImageElement> {
  // 缓存管理器
  private cache: ResourceCache<HTMLImageElement>;
  
  // 默认加载选项
  private defaultOptions: ResourceLoadOptions;
  
  // 最大并发加载数量
  private maxConcurrentLoads: number;
  
  // 当前并发加载数量
  private currentConcurrentLoads: number = 0;
  
  // 等待加载的队列
  private loadingQueue: Array<{
    src: string;
    options: ResourceLoadOptions;
    resolve: (image: HTMLImageElement) => void;
    reject: (error: Error) => void;
  }> = [];
  
  // 状态跟踪
  private resourceStatus: Map<string, ResourceLoadStatus> = new Map();
  
  // 事件监听器
  private progressListeners: Set<(progress: ResourceProgress) => void> = new Set();
  private loadCompleteListeners: Set<(resource: HTMLImageElement, info: ResourceInfo) => void> = new Set();
  private loadErrorListeners: Set<(error: Error, src: string) => void> = new Set();
  
  /**
   * 构造函数
   */
  constructor(options: ResourceLoaderOptions = {}) {
    this.cache = options.cache || new ResourceCache();
    this.defaultOptions = options.defaultOptions || {};
    this.maxConcurrentLoads = options.maxConcurrentLoads || 4;
  }
  
  /**
   * 加载图片资源
   */
  async load(src: string, options?: ResourceLoadOptions): Promise<HTMLImageElement> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    const cacheKey = this.generateCacheKey(src, mergedOptions);
    
    // 检查缓存
    if (mergedOptions.useCache !== false) {
      const cachedImage = this.cache.get(cacheKey);
      if (cachedImage) {
        // 触发完成事件
        this.notifyLoadComplete(cachedImage, {
          id: cacheKey,
          src,
          type: 'image'
        });
        return cachedImage;
      }
    }
    
    // 检查是否正在加载
    if (this.resourceStatus.get(cacheKey) === ResourceLoadStatus.LOADING) {
      // 等待现有加载完成
      return this.waitForExistingLoad(cacheKey);
    }
    
    return new Promise((resolve, reject) => {
      // 添加到队列
      this.loadingQueue.push({
        src,
        options: mergedOptions,
        resolve,
        reject
      });
      
      // 尝试处理队列
      this.processQueue();
    });
  }
  
  /**
   * 预加载图片资源
   */
  async preload(src: string, options?: ResourceLoadOptions): Promise<boolean> {
    try {
      await this.load(src, options);
      return true;
    } catch (error) {
      console.warn(`预加载图片失败: ${src}`, error);
      return false;
    }
  }
  
  /**
   * 获取已加载的图片资源
   */
  get(id: string): HTMLImageElement | null {
    return this.cache.get(id);
  }
  
  /**
   * 释放图片资源
   */
  release(id: string): boolean {
    return this.cache.delete(id);
  }
  
  /**
   * 批量释放图片资源
   */
  releaseMultiple(ids: string[]): boolean[] {
    return ids.map(id => this.release(id));
  }
  
  /**
   * 清理所有未使用的图片资源
   */
  cleanup(): number {
    return this.cache.clear();
  }
  
  /**
   * 监听加载进度
   */
  onProgress(callback: (progress: ResourceProgress) => void): () => void {
    this.progressListeners.add(callback);
    return () => this.progressListeners.delete(callback);
  }
  
  /**
   * 监听加载完成
   */
  onLoadComplete(callback: (resource: HTMLImageElement, info: ResourceInfo) => void): () => void {
    this.loadCompleteListeners.add(callback);
    return () => this.loadCompleteListeners.delete(callback);
  }
  
  /**
   * 监听加载错误
   */
  onLoadError(callback: (error: Error, src: string) => void): () => void {
    this.loadErrorListeners.add(callback);
    return () => this.loadErrorListeners.delete(callback);
  }
  
  /**
   * 处理加载队列
   */
  private processQueue(): void {
    while (this.currentConcurrentLoads < this.maxConcurrentLoads && this.loadingQueue.length > 0) {
      const item = this.loadingQueue.shift();
      if (item) {
        this.currentConcurrentLoads++;
        this.loadImage(item.src, item.options, item.resolve, item.reject);
      }
    }
  }
  
  /**
   * 加载图片
   */
  private async loadImage(
    src: string,
    options: ResourceLoadOptions,
    resolve: (image: HTMLImageElement) => void,
    reject: (error: Error) => void
  ): Promise<void> {
    const cacheKey = this.generateCacheKey(src, options);
    
    // 设置状态
    this.resourceStatus.set(cacheKey, ResourceLoadStatus.LOADING);
    
    try {
      // 创建图片元素
      const image = new Image();
      
      // 设置跨域
      if (options.headers?.['crossOrigin'] || options.headers?.['crossorigin']) {
        image.crossOrigin = options.headers['crossOrigin'] || options.headers['crossorigin'];
      }
      
      // 设置超时
      let timeoutId: number | undefined;
      if (options.timeout) {
        timeoutId = window.setTimeout(() => {
          reject(new Error(`图片加载超时: ${src}`));
        }, options.timeout);
      }
      
      // 加载图片
      const loadPromise = new Promise<void>((resolveImg, rejectImg) => {
        image.onload = () => resolveImg();
        image.onerror = () => rejectImg(new Error(`图片加载失败: ${src}`));
        image.src = src;
      });
      
      await loadPromise;
      
      // 清除超时
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // 创建资源信息
      const info: ImageResourceInfo = {
        id: cacheKey,
        src,
        type: 'image',
        width: image.width,
        height: image.height,
        format: this.getImageFormat(src),
        mimeType: this.getImageMimeType(src),
        size: 0 // 可以通过额外的请求获取实际大小
      };
      
      // 缓存图片
      if (options.useCache !== false) {
        this.cache.set(cacheKey, image, info);
      }
      
      // 更新状态
      this.resourceStatus.set(cacheKey, ResourceLoadStatus.LOADED);
      
      // 触发事件
      this.notifyLoadComplete(image, info);
      
      resolve(image);
    } catch (error) {
      // 更新状态
      this.resourceStatus.set(cacheKey, ResourceLoadStatus.ERROR);
      
      // 触发错误事件
      this.notifyLoadError(error instanceof Error ? error : new Error(String(error)), src);
      
      reject(error);
    } finally {
      // 减少并发计数
      this.currentConcurrentLoads--;
      
      // 继续处理队列
      this.processQueue();
    }
  }
  
  /**
   * 等待现有加载完成
   */
  private waitForExistingLoad(cacheKey: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      // 定期检查状态
      const checkInterval = setInterval(() => {
        const status = this.resourceStatus.get(cacheKey);
        
        if (status === ResourceLoadStatus.LOADED) {
          clearInterval(checkInterval);
          const image = this.cache.get(cacheKey);
          if (image) {
            resolve(image);
          } else {
            reject(new Error('资源已加载但缓存中不存在'));
          }
        } else if (status === ResourceLoadStatus.ERROR) {
          clearInterval(checkInterval);
          reject(new Error('资源加载失败'));
        }
      }, 50);
    });
  }
  
  /**
   * 生成缓存键
   */
  private generateCacheKey(src: string, options: ResourceLoadOptions): string {
    // 简单实现，可以根据需要扩展
    return `${src}_${options.type || 'default'}`;
  }
  
  /**
   * 获取图片格式
   */
  private getImageFormat(src: string): string {
    const extension = src.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  }
  
  /**
   * 获取图片MIME类型
   */
  private getImageMimeType(src: string): string {
    const format = this.getImageFormat(src);
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'bmp': 'image/bmp'
    };
    return mimeTypes[format] || 'image/unknown';
  }
  
  /**
   * 通知进度
   */
  private notifyProgress(progress: ResourceProgress): void {
    this.progressListeners.forEach(callback => {
      try {
        callback(progress);
      } catch (error) {
        console.error('进度回调错误:', error);
      }
    });
  }
  
  /**
   * 通知加载完成
   */
  private notifyLoadComplete(resource: HTMLImageElement, info: ResourceInfo): void {
    this.loadCompleteListeners.forEach(callback => {
      try {
        callback(resource, info);
      } catch (error) {
        console.error('加载完成回调错误:', error);
      }
    });
  }
  
  /**
   * 通知加载错误
   */
  private notifyLoadError(error: Error, src: string): void {
    this.loadErrorListeners.forEach(callback => {
      try {
        callback(error, src);
      } catch (error) {
        console.error('错误回调错误:', error);
      }
    });
  }
  
  /**
   * 获取加载器统计信息
   */
  getStats(): {
    queueSize: number;
    concurrentLoads: number;
    cacheStats: ReturnType<ResourceCache['getStats']>;
  } {
    return {
      queueSize: this.loadingQueue.length,
      concurrentLoads: this.currentConcurrentLoads,
      cacheStats: this.cache.getStats()
    };
  }
}

// 注册图片加载器
registerLoader('image', ImageLoader);