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
 * 字体资源信息接口
 */
export interface FontResourceInfo extends ResourceInfo {
  fontFamily: string;
  fontWeight?: string | number;
  fontStyle?: string;
  format?: string;
}

/**
 * 字体加载器实现
 */
export class FontLoader implements ResourceLoader<string> {
  // 缓存管理器
  private cache: ResourceCache<string>;
  
  // 默认加载选项
  private defaultOptions: ResourceLoadOptions;
  
  // 已加载的字体族
  private loadedFonts: Set<string> = new Set();
  
  // 状态跟踪
  private resourceStatus: Map<string, ResourceLoadStatus> = new Map();
  
  // 事件监听器
  private progressListeners: Set<(progress: ResourceProgress) => void> = new Set();
  private loadCompleteListeners: Set<(resource: string, info: ResourceInfo) => void> = new Set();
  private loadErrorListeners: Set<(error: Error, src: string) => void> = new Set();
  
  /**
   * 构造函数
   */
  constructor(options: ResourceLoaderOptions = {}) {
    this.cache = options.cache || new ResourceCache();
    this.defaultOptions = options.defaultOptions || {};
  }
  
  /**
   * 加载字体资源
   */
  async load(src: string, options?: ResourceLoadOptions): Promise<string> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    const fontInfo = this.parseFontInfo(src, mergedOptions);
    const cacheKey = this.generateCacheKey(fontInfo);
    
    // 检查缓存
    if (mergedOptions.useCache !== false) {
      const cachedFont = this.cache.get(cacheKey);
      if (cachedFont) {
        // 触发完成事件
        this.notifyLoadComplete(cachedFont, fontInfo);
        return cachedFont;
      }
    }
    
    // 检查是否正在加载
    if (this.resourceStatus.get(cacheKey) === ResourceLoadStatus.LOADING) {
      // 等待现有加载完成
      return this.waitForExistingLoad(cacheKey);
    }
    
    // 设置状态
    this.resourceStatus.set(cacheKey, ResourceLoadStatus.LOADING);
    
    try {
      // 加载字体
      await this.loadFontFace(fontInfo, mergedOptions);
      
      // 标记为已加载
      this.loadedFonts.add(fontInfo.fontFamily);
      
      // 缓存字体
      if (mergedOptions.useCache !== false) {
        this.cache.set(cacheKey, fontInfo.fontFamily, fontInfo);
      }
      
      // 更新状态
      this.resourceStatus.set(cacheKey, ResourceLoadStatus.LOADED);
      
      // 触发事件
      this.notifyLoadComplete(fontInfo.fontFamily, fontInfo);
      
      return fontInfo.fontFamily;
    } catch (error) {
      // 更新状态
      this.resourceStatus.set(cacheKey, ResourceLoadStatus.ERROR);
      
      // 触发错误事件
      this.notifyLoadError(error instanceof Error ? error : new Error(String(error)), src);
      
      throw error;
    }
  }
  
  /**
   * 预加载字体资源
   */
  async preload(src: string, options?: ResourceLoadOptions): Promise<boolean> {
    try {
      await this.load(src, options);
      return true;
    } catch (error) {
      console.warn(`预加载字体失败: ${src}`, error);
      return false;
    }
  }
  
  /**
   * 获取已加载的字体资源
   */
  get(id: string): string | null {
    return this.cache.get(id);
  }
  
  /**
   * 释放字体资源
   */
  release(id: string): boolean {
    return this.cache.delete(id);
  }
  
  /**
   * 批量释放字体资源
   */
  releaseMultiple(ids: string[]): boolean[] {
    return ids.map(id => this.release(id));
  }
  
  /**
   * 清理所有未使用的字体资源
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
  onLoadComplete(callback: (resource: string, info: ResourceInfo) => void): () => void {
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
   * 加载字体Face
   */
  private async loadFontFace(fontInfo: FontResourceInfo, options: ResourceLoadOptions): Promise<void> {
    // 创建FontFace对象
    const fontFace = new FontFace(
      fontInfo.fontFamily,
      `url(${fontInfo.src})`,
      {
        weight: fontInfo.fontWeight,
        style: fontInfo.fontStyle
      }
    );
    
    // 设置超时
    let timeoutId: number | undefined;
    const timeoutPromise = options.timeout ? 
      new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(() => {
          reject(new Error(`字体加载超时: ${fontInfo.fontFamily}`));
        }, options.timeout);
      }) : 
      null;
    
    try {
      // 加载字体
      await Promise.race([
        fontFace.load(),
        timeoutPromise
      ] as Promise<any>[]);
      
      // 添加到文档
      document.fonts.add(fontFace);
      
      // 验证字体是否可用
      await document.fonts.load(
        `${fontInfo.fontWeight || 'normal'} ${fontInfo.fontStyle || 'normal'} 1em ${fontInfo.fontFamily}`,
        'A'
      );
      
      // 清除超时
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      // 清除超时
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      throw error;
    }
  }
  
  /**
   * 等待现有加载完成
   */
  private waitForExistingLoad(cacheKey: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // 定期检查状态
      const checkInterval = setInterval(() => {
        const status = this.resourceStatus.get(cacheKey);
        
        if (status === ResourceLoadStatus.LOADED) {
          clearInterval(checkInterval);
          const font = this.cache.get(cacheKey);
          if (font) {
            resolve(font);
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
   * 解析字体信息
   */
  private parseFontInfo(src: string, options: ResourceLoadOptions): FontResourceInfo {
    // 从options中提取字体信息
    const fontFamily = options.type || this.extractFontFamilyFromSrc(src);
    const fontWeight = options.headers?.['fontWeight'] || 'normal';
    const fontStyle = options.headers?.['fontStyle'] || 'normal';
    const format = this.getFontFormat(src);
    
    return {
      id: `${fontFamily}_${fontWeight}_${fontStyle}`,
      src,
      type: 'font',
      fontFamily,
      fontWeight,
      fontStyle,
      format
    };
  }
  
  /**
   * 从URL中提取字体族名
   */
  private extractFontFamilyFromSrc(src: string): string {
    // 从文件名中提取，移除扩展名
    const fileName = src.split('/').pop() || 'unknown';
    return fileName.split('.').slice(0, -1).join('.').replace(/_/g, ' ');
  }
  
  /**
   * 获取字体格式
   */
  private getFontFormat(src: string): string {
    const extension = src.split('.').pop()?.toLowerCase();
    const formats: Record<string, string> = {
      'woff2': 'woff2',
      'woff': 'woff',
      'ttf': 'truetype',
      'otf': 'opentype',
      'svg': 'svg'
    };
    return formats[extension || ''] || 'unknown';
  }
  
  /**
   * 生成缓存键
   */
  private generateCacheKey(fontInfo: FontResourceInfo): string {
    return `${fontInfo.fontFamily}_${fontInfo.fontWeight}_${fontInfo.fontStyle}`;
  }
  
  /**
   * 检查字体是否已加载
   */
  isFontLoaded(fontFamily: string): boolean {
    return this.loadedFonts.has(fontFamily);
  }
  
  /**
   * 检查字体是否可用
   */
  async checkFontAvailable(fontFamily: string): Promise<boolean> {
    try {
      const available = await document.fonts.check(`1em ${fontFamily}`);
      return available;
    } catch {
      return false;
    }
  }
  
  /**
   * 获取所有已加载的字体族
   */
  getLoadedFonts(): string[] {
    return Array.from(this.loadedFonts);
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
  private notifyLoadComplete(resource: string, info: ResourceInfo): void {
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
   * 批量加载字体
   */
  async loadMultiple(fonts: Array<{
    src: string;
    options?: ResourceLoadOptions;
  }>): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();
    
    const promises = fonts.map(async (font) => {
      try {
        await this.load(font.src, font.options);
        results.set(font.src, true);
      } catch (error) {
        console.warn(`加载字体失败: ${font.src}`, error);
        results.set(font.src, false);
      }
    });
    
    await Promise.all(promises);
    return results;
  }
}

// 注册字体加载器
registerLoader('font', FontLoader);