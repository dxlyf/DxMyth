/**
 * FontManager - 字体资源管理类
 * 
 * 负责管理CanvasKit中的字体资源，提供字体加载、缓存、查找和管理功能。
 * 支持自定义字体加载、字体家族管理、字体回退机制等。
 */

import {CK, type CanvasKit } from 'src/canvaskit';
// 字体样式类型
export enum FontStyle {
  NORMAL = 'normal',
  ITALIC = 'italic',
  OBLIQUE = 'oblique'
}

// 字体粗细类型
export enum FontWeight {
  THIN = 100,
  EXTRA_LIGHT = 200,
  LIGHT = 300,
  NORMAL = 400,
  MEDIUM = 500,
  SEMI_BOLD = 600,
  BOLD = 700,
  EXTRA_BOLD = 800,
  BLACK = 900
}
export enum FontVariant {
  NORMAL = 'normal',
  SMALL_CAPS = 'small-caps',
}
// 字体描述接口
export interface FontDescription {
  family: string;
  style: FontStyle;
  weight: FontWeight;
  variant: FontVariant;
}

// 字体资源接口
export interface FontResource {
  name: string;
  data: ArrayBuffer;
  family: string;
  style: FontStyle;
  weight: FontWeight;
}

// 字体缓存项
export interface FontCacheItem {
  font: any; // CanvasKit.Font类型
  referenceCount: number;
  lastUsed: number;
}

/**
 * 字体管理器类
 * 负责字体资源的加载、缓存、查找和管理
 */
export class FontManager {
  private fontFamilies: Map<string, Map<string, FontCacheItem>> = new Map();
  private fontDataMap: Map<string, FontResource> = new Map();
  private defaultFontFamily: string = 'sans-serif';
  private maxCacheSize: number = 100; // 最大缓存字体数量
  private cacheCleanupThreshold: number = 0.8; // 缓存清理阈值
  private fontLoader: Promise<void> | null = null;

  /**
   * 构造函数
   * @param canvasKit CanvasKit实例
   * @param options 配置选项
   */
  constructor( options?: {
    defaultFontFamily?: string;
    maxCacheSize?: number;
  }) {
    
    if (options) {
      if (options.defaultFontFamily) {
        this.defaultFontFamily = options.defaultFontFamily;
      }
      if (options.maxCacheSize) {
        this.maxCacheSize = options.maxCacheSize;
      }
    }

    this.initializeSystemFonts();
  }

  /**
   * 初始化系统默认字体
   */
  private initializeSystemFonts(): void {
    // 注册一些常见的系统字体映射
    const systemFonts = [
      'sans-serif',
      'serif',
      'monospace',
      'cursive',
      'fantasy'
    ];

    for (const family of systemFonts) {
      if (!this.fontFamilies.has(family)) {
        this.fontFamilies.set(family, new Map());
      }
    }
  }

  /**
   * 加载字体数据
   * @param name 字体名称
   * @param data 字体二进制数据
   * @param description 字体描述
   */
  async loadFont(name: string, data: ArrayBuffer, description: Partial<FontDescription> = {}): Promise<void> {
    try {
      // 验证字体数据
      if (!data || data.byteLength === 0) {
        throw new Error('Font data cannot be empty');
      }

      // 检查字体是否已加载
      if (this.fontDataMap.has(name)) {
        console.warn(`Font '${name}' is already loaded`);
        return;
      }

      // 解析字体描述
      const fontDescription: FontDescription = {
        family: description.family || name,
        style: description.style || FontStyle.NORMAL,
        weight: description.weight || FontWeight.NORMAL,
        variant: description.variant || FontVariant.NORMAL,
      };



      // 存储字体资源
      const fontResource: FontResource = {
        name,
        data,
        ...fontDescription
      };

      this.fontDataMap.set(name, fontResource);

      // 初始化字体家族映射
      if (!this.fontFamilies.has(fontDescription.family)) {
        this.fontFamilies.set(fontDescription.family, new Map());
      }

      console.log(`Font '${name}' (${fontDescription.family}) loaded successfully`);
    } catch (error) {
      console.error(`Failed to load font '${name}':`, error);
      throw error;
    }
  }

  /**
   * 从URL加载字体
   * @param name 字体名称
   * @param url 字体文件URL
   * @param description 字体描述
   */
  async loadFontFromUrl(name: string, url: string, description?: Partial<FontDescription>): Promise<void> {
    try {
      if (this.fontLoader) {
        await this.fontLoader;
      }

      this.fontLoader = this._loadFontFromUrl(name, url, description);
      return await this.fontLoader;
    } finally {
      this.fontLoader = null;
    }
  }

  /**
   * 内部实现从URL加载字体
   */
  private async _loadFontFromUrl(name: string, url: string, description?: Partial<FontDescription>): Promise<void> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch font from ${url}: ${response.status}`);
    }

    const data = await response.arrayBuffer();
    return this.loadFont(name, data, description);
  }

  /**
   * 获取字体实例
   * @param family 字体家族
   * @param size 字体大小
   * @param options 字体选项
   */
  getFont(family: string | string[], size: number, options?: {
    style?: FontStyle;
    weight?: FontWeight;
    variant?: FontVariant;
  }): any {
    // 标准化字体选项
    const style = options?.style || FontStyle.NORMAL;
    const weight = options?.weight || FontWeight.NORMAL;
    const variant = options?.variant || FontVariant.NORMAL;
    
    const fontKey = `${style}-${weight}-${variant}`;  

    // 处理字体家族回退机制
    const families = Array.isArray(family) ? family : [family, this.defaultFontFamily];
    
    for (const fontFamily of families) {
      const familyMap = this.fontFamilies.get(fontFamily);
      if (familyMap && familyMap.has(fontKey)) {
        const cachedFont = familyMap.get(fontKey)!;
        cachedFont.referenceCount++;
        cachedFont.lastUsed = Date.now();
        return cachedFont.font;
      }
    }

    // 如果缓存中没有，创建新字体
    return this.createAndCacheFont(families, size, style, weight);
  }

  /**
   * 创建并缓存字体实例
   */
  private createAndCacheFont(families: string[], size: number, style: FontStyle, weight: FontWeight, variant: FontVariant): any {
    try {
      // 尝试创建字体
      const font = new CK.Font(CK.Typeface.GetDefault(), size);

      if (!font) {
        throw new Error(`Failed to create font: ${families.join(',')} ${size}px`);
      }

      // 缓存字体
      const fontFamily = families[0];
      const fontKey = `${style}-${weight}-${variant}`;
      
      if (!this.fontFamilies.has(fontFamily)) {
        this.fontFamilies.set(fontFamily, new Map());
      }

      const familyMap = this.fontFamilies.get(fontFamily)!;
      familyMap.set(fontKey, {
        font,
        referenceCount: 1,
        lastUsed: Date.now()
      });

      // 检查是否需要清理缓存
      this.checkAndCleanCache();

      return font;
    } catch (error) {
      console.error('Failed to create font:', error);
      throw error;
    }
  }

  /**
   * 检查并清理缓存
   */
  private checkAndCleanCache(): void {
    let totalCached = 0;
    const allFonts: Array<{family: string; key: string; item: FontCacheItem}> = [];

    // 收集所有缓存的字体信息
    this.fontFamilies.forEach((familyMap, family) => {
      familyMap.forEach((item, key) => {
        totalCached++;
        allFonts.push({ family, key, item });
      });
    });

    // 如果缓存超过阈值，清理最近最少使用的字体
    if (totalCached > this.maxCacheSize * this.cacheCleanupThreshold) {
      // 按最后使用时间排序
      allFonts.sort((a, b) => a.item.lastUsed - b.item.lastUsed);

      // 计算需要清理的数量
      const fontsToRemove = Math.floor(totalCached - this.maxCacheSize * 0.5);

      // 清理字体
      for (let i = 0; i < fontsToRemove && i < allFonts.length; i++) {
        const { family, key, item } = allFonts[i];
        if (item.referenceCount <= 0) {
          // 释放字体资源
          if (item.font && item.font.delete) {
            item.font.delete();
          }
          
          // 从缓存中移除
          const familyMap = this.fontFamilies.get(family);
          if (familyMap) {
            familyMap.delete(key);
          }
        }
      }
    }
  }

  /**
   * 释放字体资源
   * @param font 要释放的字体实例
   */
  releaseFont(font: any): void {
    // 在所有字体家族中查找该字体
    for (const [family, familyMap] of this.fontFamilies) {
      for (const [key, item] of familyMap) {
        if (item.font === font) {
          item.referenceCount--;
          // 当引用计数为0时，在下一次缓存清理时会被释放
          return;
        }
      }
    }
  }

  /**
   * 获取已加载的字体列表
   */
  getLoadedFonts(): FontResource[] {
    return Array.from(this.fontDataMap.values());
  }

  /**
   * 检查字体是否已加载
   * @param name 字体名称
   */
  isFontLoaded(name: string): boolean {
    return this.fontDataMap.has(name);
  }

  /**
   * 移除字体
   * @param name 字体名称
   */
  removeFont(name: string): boolean {
    const fontResource = this.fontDataMap.get(name);
    if (!fontResource) {
      return false;
    }

    // 从字体家族中移除相关缓存
    const familyMap = this.fontFamilies.get(fontResource.family);
    if (familyMap) {
      const fontKey = `${fontResource.style}-${fontResource.weight}`;
      const cachedFont = familyMap.get(fontKey);
      
      if (cachedFont) {
        // 释放字体资源
        if (cachedFont.font && cachedFont.font.delete) {
          cachedFont.font.delete();
        }
        familyMap.delete(fontKey);
      }
    }

    // 从字体数据映射中移除
    this.fontDataMap.delete(name);
    return true;
  }

  /**
   * 清空所有字体缓存
   */
  clearCache(): void {
    // 释放所有字体资源
    this.fontFamilies.forEach(familyMap => {
      familyMap.forEach(item => {
        if (item.font && item.font.delete) {
          item.font.delete();
        }
      });
      familyMap.clear();
    });

    // 重新初始化系统字体
    this.initializeSystemFonts();
  }

  /**
   * 销毁字体管理器
   */
  destroy(): void {
    this.clearCache();
    this.fontDataMap.clear();
  }

  /**
   * 测量文本尺寸
   * @param text 要测量的文本
   * @param font 字体实例
   */
  measureText(text: string, font: CanvasKit.Font): {
    width: number;
    height: number;
    metrics: any;
  } {
    const paragraphStyle = new CK.ParagraphStyle({
      textStyle: {
        fontFamilies: [font.getFamilyName()],
        fontSize: font.getSize(),
      },
    });

    const builder = CK.ParagraphBuilder.Make(paragraphStyle, CK.FontManager);
    builder.pushStyle({
      fontFamily: font.getFamilyName(),
      fontSize: font.getSize(),
    });
    builder.addText(text);
    
    const paragraph = builder.build();
    paragraph.layout(Number.MAX_SAFE_INTEGER);
    
    const width = paragraph.getMaxWidth();
    const height = paragraph.getHeight();
    
    // 释放资源
    builder.delete();
    paragraph.delete();

    return {
      width,
      height,
      metrics: {
        ascent: font.getAscent(),
        descent: font.getDescent(),
        leading: font.getLeading(),
      }
    };
  }
}

export default FontManager;