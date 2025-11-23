// 资源加载器使用示例

import {
  ResourceLoaderFactory,
  resourceLoaderFactory,
  createLoader,
  registerLoader
} from './ResourceLoaderFactory';
import { ResourceCache, createCache } from './ResourceCache';
import { ImageLoader } from './ImageLoader';
import { FontLoader } from './FontLoader';
import { ResourceLoadOptions } from './ResourceLoader';

/**
 * 示例1: 基础图片加载
 */
async function exampleBasicImageLoading() {
  console.log('=== 示例1: 基础图片加载 ===');
  
  try {
    // 使用工厂创建图片加载器
    const imageLoader = createLoader<HTMLImageElement>('image');
    
    // 加载图片
    const image = await imageLoader.load('https://example.com/image.jpg');
    console.log('图片加载成功:', image.width, 'x', image.height);
    
    // 使用图片
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      console.log('图片已绘制到画布');
    }
  } catch (error) {
    console.error('图片加载失败:', error);
  }
}

/**
 * 示例2: 带选项的图片加载
 */
async function exampleImageLoadingWithOptions() {
  console.log('=== 示例2: 带选项的图片加载 ===');
  
  const imageLoader = createLoader<HTMLImageElement>('image');
  
  const loadOptions: ResourceLoadOptions = {
    useCache: true,        // 使用缓存
    priority: 1,           // 设置优先级
    timeout: 5000,         // 5秒超时
    headers: {             // 自定义请求头
      crossOrigin: 'anonymous'
    }
  };
  
  try {
    // 加载图片
    const image = await imageLoader.load(
      'https://example.com/another-image.webp',
      loadOptions
    );
    console.log('带选项的图片加载成功');
  } catch (error) {
    console.error('带选项的图片加载失败:', error);
  }
}

/**
 * 示例3: 预加载图片资源
 */
async function exampleImagePreloading() {
  console.log('=== 示例3: 预加载图片资源 ===');
  
  const imageLoader = createLoader<HTMLImageElement>('image');
  
  // 预加载多张图片
  const imagesToPreload = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.png',
    'https://example.com/image3.webp'
  ];
  
  const preloadPromises = imagesToPreload.map(src => 
    imageLoader.preload(src)
  );
  
  const results = await Promise.all(preloadPromises);
  console.log('预加载结果:', results);
  
  // 后续使用时会直接从缓存获取
  const cachedImage = await imageLoader.load('https://example.com/image1.jpg');
  console.log('从缓存获取图片:', cachedImage.width, 'x', cachedImage.height);
}

/**
 * 示例4: 监听加载进度和事件
 */
async function exampleEventListening() {
  console.log('=== 示例4: 监听加载进度和事件 ===');
  
  const imageLoader = createLoader<HTMLImageElement>('image');
  
  // 监听进度
  const unsubscribeProgress = imageLoader.onProgress(progress => {
    console.log(`加载进度: ${progress.percent.toFixed(2)}%`);
  });
  
  // 监听完成
  const unsubscribeComplete = imageLoader.onLoadComplete((image, info) => {
    console.log('加载完成:', info.src, image.width, 'x', image.height);
  });
  
  // 监听错误
  const unsubscribeError = imageLoader.onLoadError((error, src) => {
    console.error(`加载错误 [${src}]:`, error.message);
  });
  
  try {
    await imageLoader.load('https://example.com/event-image.jpg');
  } catch (error) {
    console.error('加载失败:', error);
  } finally {
    // 清理监听器
    unsubscribeProgress();
    unsubscribeComplete();
    unsubscribeError();
  }
}

/**
 * 示例5: 自定义缓存配置
 */
async function exampleCustomCache() {
  console.log('=== 示例5: 自定义缓存配置 ===');
  
  // 创建自定义缓存
  const customCache = createCache<HTMLImageElement>({
    maxSize: 50,           // 最多缓存50个图片
    maxAge: 300000,        // 缓存5分钟
    sizeEstimator: (image) => {
      // 估算图片大小
      return image.width * image.height * 4; // 假设每个像素4字节
    }
  });
  
  // 使用自定义缓存创建加载器
  const imageLoader = createLoader<HTMLImageElement>('image', {
    cache: customCache
  });
  
  // 加载图片到自定义缓存
  const image = await imageLoader.load('https://example.com/cached-image.jpg');
  
  // 获取缓存统计信息
  const stats = customCache.getStats();
  console.log('缓存统计:', stats);
  
  // 清理过期缓存
  const clearedCount = customCache.clear(60000); // 清理1分钟前的缓存
  console.log('清理的缓存数量:', clearedCount);
}

/**
 * 示例6: 字体加载
 */
async function exampleFontLoading() {
  console.log('=== 示例6: 字体加载 ===');
  
  const fontLoader = createLoader<string>('font');
  
  const fontOptions: ResourceLoadOptions = {
    type: 'CustomFont',    // 字体族名
    headers: {
      fontWeight: 'normal',
      fontStyle: 'normal'
    },
    timeout: 10000
  };
  
  try {
    // 加载字体
    const fontFamily = await fontLoader.load(
      'https://example.com/fonts/custom-font.woff2',
      fontOptions
    );
    
    console.log('字体加载成功:', fontFamily);
    
    // 应用字体
    document.body.style.fontFamily = fontFamily;
    
    // 检查字体是否已加载
    const isLoaded = (fontLoader as FontLoader).isFontLoaded(fontFamily);
    console.log('字体已加载:', isLoaded);
  } catch (error) {
    console.error('字体加载失败:', error);
  }
}

/**
 * 示例7: 批量字体加载
 */
async function exampleBatchFontLoading() {
  console.log('=== 示例7: 批量字体加载 ===');
  
  const fontLoader = createLoader<string>('font') as FontLoader;
  
  const fontsToLoad = [
    {
      src: 'https://example.com/fonts/font1.woff2',
      options: { type: 'FontOne', headers: { fontWeight: 'normal' } }
    },
    {
      src: 'https://example.com/fonts/font2.woff2',
      options: { type: 'FontTwo', headers: { fontWeight: 'bold' } }
    },
    {
      src: 'https://example.com/fonts/font3.woff2',
      options: { type: 'FontThree', headers: { fontStyle: 'italic' } }
    }
  ];
  
  // 批量加载
  const results = await fontLoader.loadMultiple(fontsToLoad);
  
  // 显示结果
  results.forEach((success, src) => {
    console.log(`${src}: ${success ? '成功' : '失败'}`);
  });
  
  // 获取已加载的字体列表
  const loadedFonts = fontLoader.getLoadedFonts();
  console.log('已加载的字体:', loadedFonts);
}

/**
 * 示例8: 资源释放和清理
 */
async function exampleResourceRelease() {
  console.log('=== 示例8: 资源释放和清理 ===');
  
  const imageLoader = createLoader<HTMLImageElement>('image');
  
  // 加载多个图片
  const image1 = await imageLoader.load('https://example.com/release1.jpg');
  const image2 = await imageLoader.load('https://example.com/release2.jpg');
  
  // 释放单个资源
  const releaseResult = imageLoader.release('https://example.com/release1.jpg_default');
  console.log('释放单个资源:', releaseResult);
  
  // 批量释放
  const releaseResults = imageLoader.releaseMultiple([
    'https://example.com/release2.jpg_default'
  ]);
  console.log('批量释放结果:', releaseResults);
  
  // 清理所有未使用的资源
  const cleanedCount = imageLoader.cleanup();
  console.log('清理的资源数量:', cleanedCount);
}

/**
 * 示例9: 自定义资源加载器
 */
function exampleCustomLoader() {
  console.log('=== 示例9: 自定义资源加载器 ===');
  
  // 定义JSON加载器
  class JsonLoader implements ResourceLoader<object> {
    private cache: ResourceCache<object>;
    
    constructor(options: any = {}) {
      this.cache = options.cache || createCache<object>();
    }
    
    async load(src: string, options?: ResourceLoadOptions): Promise<object> {
      const cacheKey = src;
      
      // 检查缓存
      if (options?.useCache !== false) {
        const cached = this.cache.get(cacheKey);
        if (cached) return cached;
      }
      
      // 加载JSON
      const response = await fetch(src, {
        headers: options?.headers || { 'Content-Type': 'application/json' },
        timeout: options?.timeout
      });
      
      if (!response.ok) {
        throw new Error(`加载JSON失败: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 缓存结果
      if (options?.useCache !== false) {
        this.cache.set(cacheKey, data, { id: src, src, type: 'json' });
      }
      
      return data;
    }
    
    // 实现其他必要方法
    async preload(src: string, options?: ResourceLoadOptions): Promise<boolean> {
      try {
        await this.load(src, options);
        return true;
      } catch {
        return false;
      }
    }
    
    get(id: string): object | null {
      return this.cache.get(id);
    }
    
    release(id: string): boolean {
      return this.cache.delete(id);
    }
    
    releaseMultiple(ids: string[]): boolean[] {
      return ids.map(id => this.release(id));
    }
    
    cleanup(): number {
      return this.cache.clear();
    }
    
    onProgress(callback: any): () => void {
      return () => {};
    }
    
    onLoadComplete(callback: any): () => void {
      return () => {};
    }
    
    onLoadError(callback: any): () => void {
      return () => {};
    }
  }
  
  // 注册自定义加载器
  registerLoader('json', JsonLoader);
  
  console.log('自定义JSON加载器已注册');
  
  // 使用自定义加载器
  async function useJsonLoader() {
    const jsonLoader = createLoader<object>('json');
    try {
      const data = await jsonLoader.load('https://example.com/data.json');
      console.log('JSON加载成功:', data);
    } catch (error) {
      console.error('JSON加载失败:', error);
    }
  }
  
  useJsonLoader();
}

/**
 * 示例10: 工厂类管理
 */
function exampleFactoryManagement() {
  console.log('=== 示例10: 工厂类管理 ===');
  
  // 获取已注册的加载器类型
  const registeredTypes = resourceLoaderFactory.getRegisteredTypes();
  console.log('已注册的加载器类型:', registeredTypes);
  
  // 获取工厂统计信息
  const stats = resourceLoaderFactory.getStats();
  console.log('工厂统计信息:', stats);
  
  // 清除所有加载器实例
  // resourceLoaderFactory.clearAllInstances();
  // console.log('所有加载器实例已清除');
}

/**
 * 运行所有示例
 */
async function runAllExamples() {
  console.log('开始运行资源加载器示例...');
  
  try {
    // 注意: 实际运行时应该根据需要选择运行哪些示例
    // await exampleBasicImageLoading();
    // await exampleImageLoadingWithOptions();
    // await exampleImagePreloading();
    // await exampleEventListening();
    // await exampleCustomCache();
    // await exampleFontLoading();
    // await exampleBatchFontLoading();
    // await exampleResourceRelease();
    // exampleCustomLoader();
    // exampleFactoryManagement();
    
    console.log('示例运行完成！');
  } catch (error) {
    console.error('运行示例时出错:', error);
  }
}

// 导出示例函数供外部使用
export {
  exampleBasicImageLoading,
  exampleImageLoadingWithOptions,
  exampleImagePreloading,
  exampleEventListening,
  exampleCustomCache,
  exampleFontLoading,
  exampleBatchFontLoading,
  exampleResourceRelease,
  exampleCustomLoader,
  exampleFactoryManagement,
  runAllExamples
};

// 使用说明:
// 1. 导入所需的示例函数
// 2. 根据需要调用特定示例
// 3. 注意: 实际项目中应配置正确的资源URL
// 4. 在生产环境中，建议添加适当的错误处理和性能优化