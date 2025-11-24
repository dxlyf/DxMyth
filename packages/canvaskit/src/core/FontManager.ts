/**
 * FontManager - 字体资源管理类
 * 
 * 负责管理CanvasKit中的字体资源，提供字体加载、缓存、查找和管理功能。
 * 支持自定义字体加载、字体家族管理、字体回退机制等。
 */

import {CanvasKit, CK } from 'src/canvaskit';
import { BoundingRect } from 'src/math';
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
export type TextMetrics={
  width:number;
  height:number;

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
  if(isNaN(fontWeightNum)){
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
    fontStyle:fontStyle||FontStyle.NORMAL,
    fontVariant:fontVariant||FontVariant.NORMAL,
    fontWeight:fontWeightNum,
    fontSize:size,
    fontUnit,
    fontFamily:fontFamily.trim(),
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
  /**
   * TextMetrics.width 只读
    double 类型，使用 CSS 像素计算的内联字符串的宽度。基于当前上下文字体考虑。

    TextMetrics.actualBoundingBoxLeft 只读
    double 类型，平行于基线，从CanvasRenderingContext2D.textAlign 属性确定的对齐点到文本矩形边界左侧的距离，使用 CSS 像素计算；正值表示文本矩形边界左侧在该对齐点的左侧。

    TextMetrics.actualBoundingBoxRight 只读
    double 类型，平行于基线，从CanvasRenderingContext2D.textAlign 属性确定的对齐点到文本矩形边界右侧的距离，使用 CSS 像素计算。

    TextMetrics.fontBoundingBoxAscent 只读
    double 类型，从CanvasRenderingContext2D.textBaseline 属性标明的水平线到渲染文本的所有字体的矩形最高边界顶部的距离，使用 CSS 像素计算。

    TextMetrics.fontBoundingBoxDescent 只读
    double 类型，从CanvasRenderingContext2D.textBaseline 属性标明的水平线到渲染文本的所有字体的矩形边界最底部的距离，使用 CSS 像素计算。

    TextMetrics.actualBoundingBoxAscent 只读
    double 类型，从CanvasRenderingContext2D.textBaseline 属性标明的水平线到渲染文本的矩形边界顶部的距离，使用 CSS 像素计算。

    TextMetrics.actualBoundingBoxDescent 只读
    double 类型，从CanvasRenderingContext2D.textBaseline 属性标明的水平线到渲染文本的矩形边界底部的距离，使用 CSS 像素计算。

    TextMetrics.emHeightAscent 只读
    double 类型，从CanvasRenderingContext2D.textBaseline 属性标明的水平线到线框中 em 方块顶部的距离，使用 CSS 像素计算。

    TextMetrics.emHeightDescent 只读
    double 类型，从CanvasRenderingContext2D.textBaseline 属性标明的水平线到线框中 em 方块底部的距离，使用 CSS 像素计算。

    TextMetrics.hangingBaseline 只读
    double 类型，从CanvasRenderingContext2D.textBaseline 属性标明的水平线到线框的 hanging 基线的距离，使用 CSS 像素计算。

    TextMetrics.alphabeticBaseline 只读
    double 类型，从CanvasRenderingContext2D.textBaseline 属性标明的水平线到线框的 alphabetic 基线的距离，使用 CSS 像素计算。

    TextMetrics.ideographicBaseline 只读
    double 类型，从 CanvasRenderingContext2D.textBaseline 属性标明的水平线到线框的 ideographic 基线的距离，使用 CSS 像素计算。
      * @param text 
   * @returns 
   */
  measureText(text:string,paint?:CanvasKit.Paint):TextMetrics{
    const metrics = this.font.getMetrics()
    const glyhpIDs=this.font.getGlyphIDs(text)
    const widths=this.font.getGlyphWidths(glyhpIDs,paint)
    
    let width=0
    widths.forEach((item)=>{
      width+=item
    })
    return {
      width,
      height:metrics.ascent+metrics.descent,
      actualBoundingBoxAscent:metrics.ascent,
      actualBoundingBoxDescent:metrics.descent,
    } as TextMetrics
  }
  getTextBounds(text:string,paint?:CanvasKit.Paint):TextMetrics{
    const glyhpIDs=this.font.getGlyphIDs(text)
    //left, top, right, bottom
    const bounds=this.font.getGlyphBounds(glyhpIDs,paint)
    const bound=BoundingRect.fromLTRB(bounds[0],bounds[1],bounds[2],bounds[3])

    return bound
  }
  dispose(){
    this.fontFamilies.forEach(item=>{
      item.forEach((cacheItem)=>{
        cacheItem.typeface.delete()
      })
    })
    this.fontFamilies.clear()
    this.font.delete()
  }
}

export default FontManager;