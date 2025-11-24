/**
 * FontManager - 字体资源管理类
 * 
 * 负责管理CanvasKit中的字体资源，提供字体加载、缓存、查找和管理功能。
 * 支持自定义字体加载、字体家族管理、字体回退机制等。
 */

import {CanvasKit, CK } from 'src/canvaskit';
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
  NORMAL = 'normal',// 正常字体
  SMALL_CAPS = 'small-caps',// 小型大写字母字体
}
// 字体描述接口
export interface CacheFontDescription {
  family: string;
  style?: FontStyle; // 字体样式
  weight?: number; // 字体粗细
  variant?: FontVariant;// 字体变体
}
export interface FontDescription extends CacheFontDescription{
  size: number; // 字体大小
}
export interface FontResource extends CacheFontDescription{
  url:string;
}


// 字体缓存项
export interface FontCacheItem  extends CacheFontDescription{
  data:ArrayBuffer
  typeface: CanvasKit.Typeface;
}
type FontManagerOptions={
    defaultFontFamily?: string; // 默认字体
    defaultFontSize?: number; // 默认字体大小
    maxCacheSize?: number;
}
/**
 * font = 
  [ [ <'font-style'> || <font-variant-css2> || <'font-weight'> || <font-width-css3> ]? <'font-size'> [ / <'line-height'> ]? <'font-family'># ]  |
  <system-family-name>  
 */
const fontStringRegex = new RegExp(
  '(italic|oblique|normal|)\\s*' +              // style
  '(small-caps|normal|)\\s*' +                  // variant
  '(bold|bolder|lighter|[1-9]00|normal|)\\s*' + // weight
  '([\\d\\.]+)' +                               // size
  '(px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q)' +      // unit
  // line-height is ignored here, as per the spec
  '(.+)'                                        // family
  );
function parseFont(font:string){
  const match = fontStringRegex.exec(font);
  if (!match) {
    return null;
  }
  const [_,fontStyle,fontVariant,fontWeight,fontSize,fontUnit,fontFamily]=match
  let size=parseFloat(fontSize as string)
  var sizePx = 16;
  let defaultHeight=16
  var unit = font[5];
  switch (unit) {
    case 'em':
    case 'rem':
      sizePx = size * defaultHeight;
      break;
    case 'pt':
      sizePx = size * 4/3;
      break;
    case 'px':
      sizePx = size;
      break;
    case 'pc':
      sizePx = size * defaultHeight;
      break;
    case 'in':
      sizePx = size * 96;
      break;
    case 'cm':
      sizePx = size * 96.0 / 2.54;
      break;
    case 'mm':
      sizePx = size * (96.0 / 25.4);
      break;
    case 'q': // quarter millimeters
      sizePx = size * (96.0 / 25.4 / 4);
      break;
    case '%':
      sizePx = size * (defaultHeight / 75);
      break;
  }
  let fontWeightNum=parseInt(fontWeight)
  if(!isNaN(fontWeightNum)){
     switch(fontWeight){
      case 'bold':
        fontWeightNum=FontWeight.BOLD
        break;
      case 'bolder':
        fontWeightNum=FontWeight.EXTRA_BOLD
        break;
      case 'lighter':
        fontWeightNum=FontWeight.LIGHT
        break;
      default:
        fontWeightNum=FontWeight.NORMAL
        break;
     }
  }
  return {
    fontStyle,
    fontVariant,
    fontWeight:fontWeightNum,
    fontSize:size,
    fontUnit,
    fontFamily,
  } as ParsedFont
}
interface ParsedFont {
  fontStyle: string;
  fontVariant: string;
  fontWeight: number;
  fontSize: number;
  fontUnit: string;
  fontFamily: string;
}

/**
 * 字体管理器类
 * 负责字体资源的加载、缓存、查找和管理
 */
export class FontManager {
  private fontFamilies: Map<string, Map<string, FontCacheItem>> = new Map();
  public font:CanvasKit.Font
  private defaultFontSize: number = 16;
  private defaultFontFamily: string = 'sans-serif';
  private maxCacheSize: number = 100; // 最大缓存字体数量
  private fontLoader: Promise<void> | null = null;
  private totalCacheSize: bigint = BigInt(0); // 总缓存字体大小
  /**
   * 构造函数
   * @param canvasKit CanvasKit实例
   * @param options 配置选项
   */
  constructor( options?: FontManagerOptions) {
    this.defaultFontFamily = options?.defaultFontFamily || 'sans-serif';
    this.defaultFontSize = options?.defaultFontSize || 16;
    this.maxCacheSize = options?.maxCacheSize || 100;
    this.font=new CK.Font()
  }
  parseFont(font:string):FontDescription{
    const fontInfo= parseFont(font)
    return {
      family:fontInfo.fontFamily??this.defaultFontFamily,
      style:(fontInfo.fontStyle??FontStyle.NORMAL) as FontStyle,
      weight:fontInfo.fontWeight??FontWeight.NORMAL,
      variant:(fontInfo.fontVariant??FontVariant.NORMAL) as FontVariant,
      size:fontInfo.fontSize??this.defaultFontSize,
    }
  }
  setFontFamily(fontDescription:FontDescription){
    const typeface=this.getFontFamily(fontDescription)
    if(typeface){
      this.font.setTypeface(typeface)
      this.font.setSize(fontDescription.size)
      return true
    }
    return false
  }
  getKey(fontDescription: CacheFontDescription){
    const {style=FontStyle.NORMAL,weight=FontWeight.NORMAL,variant=FontVariant.NORMAL}=fontDescription
    return `$${style}-${weight}-${variant}`;
  }
  removeFontFamily(family: string){
    this.fontFamilies.delete(family);
  }
  async loadFonts(fontResources: FontResource[]){
     return await Promise.all(fontResources.map(font=>this.loadFont(font)))
  }
  async loadFont(fontDescription: FontResource){
    const arrayBuffer= await fetch(fontDescription.url).then(res=>res.arrayBuffer())
    return this.addFontFamily(arrayBuffer,fontDescription)
  }
  addFontFamily(data:ArrayBuffer,fontDescription: CacheFontDescription){
     const {family,style=FontStyle.NORMAL,weight=FontWeight.NORMAL,variant=FontVariant.NORMAL}=fontDescription;
     let familyMap = this.fontFamilies.get(family);
     if (!familyMap) {
      familyMap = new Map<string, FontCacheItem>();
      this.fontFamilies.set(family, familyMap);
     }
     const key = this.getKey(fontDescription);
     if (familyMap.has(key)) {
      return false;
     }
     const cacheItem={
      family,
      style,
      weight,
      variant,
      data,
      typeface: CK.Typeface.MakeFreeTypeFaceFromData(data) 
    }
     familyMap.set(key,cacheItem );
     return true
  }
    switchDefaultFont(){
     this.switchFont(`${this.defaultFontSize}px ${this.defaultFontFamily}`)
  }
  switchFont(font:string){
    const fontDescription=this.parseFont(font)
    const typeface= this.matchFontFmaily(fontDescription)
    if(typeface){
      this.font.setTypeface(typeface)
      this.font.setSize(fontDescription.size)
      return true
    }
    return false
  }
  matchFontFmaily(fontDescription:FontDescription){
      const {family,style=FontStyle.NORMAL,weight=FontWeight.NORMAL,variant=FontVariant.NORMAL}=fontDescription
      const familyMap = this.fontFamilies.get(family);
      if (!familyMap||familyMap.size<=0) {
        return null;
      }
      const familys=Array.from(familyMap)
      let curWeight=1000000
      let curItem:FontCacheItem
      for(let [key,item] of familys){
        if(weight===item.weight){
          return item.typeface
        }
        if(Math.abs(curWeight-weight)>Math.abs(item.weight-weight)){
          curWeight=item.weight
          curItem=item
        }
      }
      return curItem?.typeface;
  }
  getFontFamily(fontDescription: CacheFontDescription){
    const familyMap = this.fontFamilies.get(fontDescription.family);
    if (!familyMap) {
      return null;
    }
    const key = this.getKey(fontDescription);
    const cacheItem = familyMap.get(key);
    if (cacheItem) {
      return cacheItem.typeface;
    }
    return null;
  }

}

export default FontManager;