import { CK,type CanvasKit, } from 'src/canvaskit';

/**
 * 字体描述符，用于唯一标识字体
 */
interface FontDescriptor {
  family: string;
  weight?: number; // 100-900
  style?: 'normal' | 'italic';
}

/**
 * 字体缓存项
 */
interface FontCacheItem {
  typeface: CanvasKit.Typeface;
  fontMgr: CanvasKit.FontMgr;
  refCount: number;
  size: number; // 字体数据大小估算(字节)
}

/**
 * 高性能字体管理类
 * 支持内置字体、外部字体注册，具有内存管理功能
 */
class FontManager {
  private readonly fontCache: Map<string, FontCacheItem>;
  private readonly defaultFontMgr: CanvasKit.FontMgr;
  private readonly maxCacheSize: number;
  private currentCacheSize: number;
  
  constructor(maxCacheSizeMB: number = 50) {
    this.fontCache = new Map();
    this.defaultFontMgr =CK.FontMgr.FromData();
    this.maxCacheSize = maxCacheSizeMB * 1024 * 1024; // 转换为字节
    this.currentCacheSize = 0;
  }

  /**
   * 生成字体缓存键
   */
  private getCacheKey(descriptor: FontDescriptor, size?: number): string {
    return `${descriptor.family}_${descriptor.weight || 400}_${descriptor.style || 'normal'}_${size || 'default'}`;
  }

  /**
   * 估算字体数据大小
   */
  private estimateTypefaceSize(typeface: CanvasKit.Typeface): number {
    // 粗略估算：字符数 × 平均字节数
    // 实际项目中可以根据更精确的指标调整
    const count = 256;
    return count * 1024; // 假设每个字符数据约1KB
  }

  /**
   * 注册外部字体文件
   */
  async registerExternalFont(
    family: string,
    fontData: ArrayBuffer,
    descriptors: { weight?: number; style?: string } = {}
  ): Promise<boolean> {
    const key = this.getCacheKey({
      family,
      weight: descriptors.weight,
      style: descriptors.style as 'normal' | 'italic' | undefined
    });

    // 已存在则增加引用计数
    if (this.fontCache.has(key)) {
      const item = this.fontCache.get(key)!;
      item.refCount++;
      return true;
    }

    try {
     

      // 创建类型face
      const typeface = CK.Typeface.MakeFreeTypeFaceFromData(fontData) 
                    || CK.Typeface.MakeTypefaceFromData(fontData);

      if (!typeface) {
        console.error(`Failed to create typeface for ${family}`);
        return false;
      }

      // 创建字体管理器（包含单个字体）

      const fontMgr =  CK.FontMgr.FromData(fontData) 
                   || this.defaultFontMgr;

      const size = this.estimateTypefaceSize(typeface);
      
      // 检查缓存空间，必要时清理
      if (this.currentCacheSize + size > this.maxCacheSize) {
        this.collectGarbage();
      }

      // 如果仍然空间不足
      if (this.currentCacheSize + size > this.maxCacheSize) {
        typeface.delete();
        console.warn(`Font cache full, cannot register font: ${family}`);
        return false;
      }

      this.fontCache.set(key, {
        typeface,
        fontMgr,
        refCount: 1,
        size
      });

      this.currentCacheSize += size;
      console.log(`Registered font: ${family}, cache size: ${Math.round(this.currentCacheSize / 1024 / 1024)}MB`);
      
      return true;
    } catch (error) {
      console.error(`Error registering font ${family}:`, error);
      return false;
    }
  }

  /**
   * 获取字体
   */
  getFont(descriptor: FontDescriptor, size: number = 14) {
    const key = this.getCacheKey(descriptor, size);
    const item = this.fontCache.get(key);

    if (item) {
      // 返回缓存的字体
      return new CK.Font(item.typeface, size);
    }

    // 回退到系统字体
    const defaultTypeface = CK.Typeface.GetDefault() 
                         || this.defaultFontMgr.matchFamilyStyle(descriptor.family, {
                            weight: CK.FontWeight.Normal,
                            width: CK.FontWidth.Normal,
                            slant: descriptor.style === 'italic' 
                                ? CK.FontSlant.Italic 
                                : CK.FontSlant.Upright
                          });

    if (!defaultTypeface) {
      console.warn(`Font not found: ${descriptor.family}, using default`);
      return new CK.Font(null, size);
    }

    return new CK.Font(defaultTypeface, size);
  }

  /**
   * 预加载多个字体
   */
  async preloadFonts(fontSpecs: Array<{
    family: string;
    url: string;
    weight?: number;
    style?: string;
  }>): Promise<number> {
    const results = await Promise.all(
      fontSpecs.map(async spec => {
        try {
          const response = await fetch(spec.url);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const fontData = await response.arrayBuffer();
          return this.registerExternalFont(spec.family, fontData, {
            weight: spec.weight,
            style: spec.style
          });
        } catch (error) {
          console.error(`Failed to preload font ${spec.family}:`, error);
          return false;
        }
      })
    );

    return results.filter(Boolean).length;
  }

  /**
   * 垃圾回收 - 清理未被引用的字体
   */
  private collectGarbage(): void {
    let freedSize = 0;
    
    for (const [key, item] of this.fontCache.entries()) {
      if (item.refCount <= 0) {
        item.typeface.delete?.();
        item.fontMgr.delete?.();
        this.fontCache.delete(key);
        freedSize += item.size;
        this.currentCacheSize -= item.size;
      }
    }

    if (freedSize > 0) {
      console.log(`GC freed ${Math.round(freedSize / 1024)}KB memory`);
    }
  }

  /**
   * 手动释放字体引用
   */
  releaseFont(descriptor: FontDescriptor, size?: number): void {
    const key = this.getCacheKey(descriptor, size);
    const item = this.fontCache.get(key);
    
    if (item) {
      item.refCount--;
      if (item.refCount <= 0) {
        // 立即清理或等待下次GC
        this.collectGarbage();
      }
    }
  }

  /**
   * 获取缓存状态
   */
  getCacheStats() {
    return {
      totalFonts: this.fontCache.size,
      cacheSizeMB: Math.round(this.currentCacheSize / 1024 / 1024 * 100) / 100,
      maxCacheSizeMB: Math.round(this.maxCacheSize / 1024 / 1024)
    };
  }

  /**
   * 清空所有缓存
   */
  dispose(): void {
    console.log('Disposing FontManager...');
    
    let disposedCount = 0;
    for (const [key, item] of this.fontCache.entries()) {
      item.typeface.delete?.();
      item.fontMgr.delete?.();
      this.fontCache.delete(key);
      disposedCount++;
    }
    
    this.currentCacheSize = 0;
    this.defaultFontMgr.delete?.();
    
    console.log(`Disposed ${disposedCount} fonts`);
  }
}

export default FontManager;