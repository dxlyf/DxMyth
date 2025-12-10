import { CK, type CanvasKit } from 'src/canvaskit'
import { BoundingRect, Vector2 } from 'src/math'

function cssFontWeightToCK(weight:string) {
    switch (weight) {
        case 'bold':
            return CK.FontWeight.Bold
        default:
            return CK.FontWeight.Normal
    }
}
function cssFontSlantToCK(slant:string) {
    switch (slant) {
        case 'italic':
            return CK.FontSlant.Italic
        case 'oblique':
            return CK.FontSlant.Oblique
        default:
            return CK.FontSlant.Upright
    }
}
function cssFontWidthToCK(width:string) {
    switch (width) {
        case 'normal':
            return CK.FontWidth.Normal
        case 'expanded':
            return CK.FontWidth.Expanded
        default:
            return CK.FontWidth.Normal
    }
}
type FontWeight='normal'|'bold'
type FontSlant='italic'|'oblique'|'upright'
type FontStyle='normal'|'italic'|'oblique'
export type FontDescription={
    family: string
    weight?:string|number, // 字体重量，normal或bold
    style?:string // 字体倾斜样式，italic或oblique
}
export type FontResource = {
    family: string
    weight?:number|FontWeight, // 字体重量，normal或bold
    style?:FontStyle // 字体倾斜样式，italic或oblique
    url: string
}
export type FontManagerOptions = {
    /**
     * 字体-family和URL映射
     */
    fonts?: FontResource[]
    /**
     * 默认字体-family
     */
    defaultFontFamily?: string
    defaultFontSize?: number
    defaultSubpixel?: boolean

}
function parseFontString(fontString:string) {
    const result = {
        style: 'normal',
        variant: 'normal',
        weight: '400',
        stretch: 'normal',
        size: '16px',
        lineHeight: 'normal',
        family: 'sans-serif'
    };
    const fontParts = fontString.split(/\s+/);
    const length = fontParts.length
    const parseFontSizeOrLineHeight = (fontPart: string) => {
        if (fontPart.includes('/')) {
            const sizeLineHeight = fontPart.split('/')
            result.size = sizeLineHeight[0]
            result.lineHeight = sizeLineHeight[1]
        } else {
            result.size =fontPart
        }
    }
    switch (length) {
        case 1:
            result.family = fontParts[0]
            break
        case 2:
            /* font-size font-family */
            /* font-size/line height font-family */
            parseFontSizeOrLineHeight(fontParts[0])
            result.family = fontParts[1]
            break
        case 4:
            /* font-style font-weight font-size font-family */
            /* font-stretch font-variant font-size font-family */
            result.style = fontParts[0]
            result.weight = fontParts[1]
            parseFontSizeOrLineHeight(fontParts[2])
            result.family = fontParts[3]
            break
    }

    return result;
}

// 输出: { style: "italic", weight: "bold", size: "1.2em", lineHeight: "2", family: "\"Fira Sans\", sans-serif" }
class FontManager {
    public fontProvider: CanvasKit.TypefaceFontProvider
    public font: CanvasKit.Font
    enableVariant=false // 是否启用字体变体
    options: FontManagerOptions
    constructor(options: FontManagerOptions = {}) {
        this.options = Object.assign({
            defaultFontFamily: 'sans-serif',
            defaultFontSize: 12,
            defaultSubpixel: true
        }, options)
        this.fontProvider = CK.TypefaceFontProvider.Make()
        this.font = new CK.Font()
        
        this.font.setSize(this.options.defaultFontSize)
        this.font.setSubpixel(this.options.defaultSubpixel)
        if (this.options.fonts) {
            this.loadFonts(this.options.fonts).then(() => {
                this.setFontFamily(this.options.defaultFontFamily)
            })
        }
    }
    calc(cb:Function){
         let fontSize=this.getFontSize()
        try{
           return cb()
        }finally{
            if(fontSize!==this.getFontSize()){
                this.setFontSize(fontSize)
            }
        }
    }
    countFamilies() {
        return this.fontProvider.countFamilies()
    }
    getFontFamily() {
        return this.getTypeface()?.getFamilyName()
    }
    getTypeface() {
        return this.font.getTypeface()
    }
    getFontSize() {
        return this.font.getSize()
    }
    setFontSize(size: number) {
        this.font.setSize(size)
    }
    setSubpixel(subpixel: boolean) {
        this.font.setSubpixel(subpixel)
    }
    setTypeface(typeface: CanvasKit.Typeface) {
        this.font.setTypeface(typeface)
    }
    /**
     * 设置字体-family
     * @param family 字体-family
     * @returns 是否设置成功
     */
    setFontFamily(family: string, style?: CanvasKit.FontStyle) {
        const typeface = this.matchFamilyStyle(family, style)
        if (typeface) {
            this.setTypeface(typeface)
            return true
        }
        return false
    }
    parseFontSize(fontSize: string) {
        return parseFloat(fontSize)
    }
    parseFont(font: string) {
        const span = document.createElement('span')
        span.style.font = font
         document.body.appendChild(span)
        const computedStyle = window.getComputedStyle(span)
        const fontStyle = computedStyle.fontStyle
        let fontWeight =computedStyle.fontWeight
        const fontVariant = computedStyle.fontVariant
        const fontSize = parseFloat(computedStyle.fontSize)
        const fontFamily = computedStyle.fontFamily
        document.body.removeChild(span)
        if(fontWeight==='400'){
            fontWeight='normal'
        }
          if(fontWeight==='700'){
            fontWeight='bold'
        }
        return {
            fontStyle,
            fontWeight,
            fontVariant,
            fontSize,
            fontFamily
        }
    }
    getFamilyCacheKey(desc: FontDescription) {
        const weight = desc?.weight || 'normal'
        const style = desc?.style || 'normal'
        ///* font-style font-weight font-size font-family */
        if(!this.enableVariant){
            return `${desc.family}-${style}-${weight}`
        }
        return desc.family
      
    }
    setCanvasFont(font: string) {
        const fontInfo = this.parseFont(font)
        const desc:FontDescription={
            family:fontInfo.fontFamily,
            weight:fontInfo.fontWeight,
            style:fontInfo.fontStyle as FontStyle,
        }
        const familyKey=this.getFamilyCacheKey(desc)
        const textStyle:CanvasKit.FontStyle={
            weight:cssFontWeightToCK(fontInfo.fontWeight),
            slant:cssFontSlantToCK(fontInfo.fontStyle),
        }
        if(this.setFontFamily(familyKey,textStyle)){
            this.setFontSize(fontInfo.fontSize)
            return true
        }
        return false
    }
    /**
    * 注册字体-family
    * @param family 字体-family
    * @param fontBuffer 字体-ArrayBuffer
    * @returns 是否注册成功
    */
    addFontFamily(family: string, fontBuffer: ArrayBuffer) {
        if(!this.enableVariant&&this.hasFontFamily(family)){
            return false
        }
       // let type=CK.Typeface.MakeFreeTypeFaceFromData(fontBuffer)
        this.fontProvider.registerFont(fontBuffer, family)
        return true
    }
    /**
     * 移除字体-family
     * @param family 字体-family
     * @returns 是否移除成功
     */
    removeFontFamily(family: string) {
        const typeface = this.matchFamilyStyle(family)
        if (typeface) {
            typeface.delete()
            return true
        }
        return false
    }
    /**
     * 从URL加载多个字体-family
     * @param fonts 字体-family和URL映射
     * @returns 是否加载成功
     */
    async loadFonts(fonts: FontResource[]) {
        const promises = fonts.map(d => {
            return this.loadFont(d)
        })
        return Promise.all(promises)
    }
    /**
     * 从URL加载字体-family
     * @param family 字体-family
     * @param url 字体-URL
     * @returns 是否加载成功
     */
    async loadFont(d:FontResource) {
        const response = await fetch(d.url)
        const arrayBuffer = await response.arrayBuffer()
        const familyKey=this.getFamilyCacheKey(d)
        return this.addFontFamily(familyKey, arrayBuffer)
    }
    /**
     * 检查字体库是否包含指定字体-family
     * @param family 字体-family
     * @returns 是否包含
     */
    hasFontFamily(family: string) {
        const count = this.fontProvider.countFamilies()
        for (let i = 0; i < count; i++) {
            if (this.fontProvider.getFamilyName(i) === family) {
                return true
            }
        }
        return false
    }

    /**
     * 匹配字体-family和样式
     * @param family 字体-family
     * @param style 字体样式
     * @returns 字体-Typeface
     */
    matchFamilyStyle(family: string, style?: CanvasKit.FontStyle): CanvasKit.Typeface {
        const defaultStyle: CanvasKit.FontStyle = {
            weight: CK.FontWeight.Normal,
            slant: CK.FontSlant.Upright,
            width: CK.FontWidth.Normal,
            ...(style ?? {})
        }
        return this.fontProvider.matchFamilyStyle(family, defaultStyle)
    }
    getTextWidth(text: string,fontSize:number, paint?: CanvasKit.Paint) {
            const oldFontSize=this.getFontSize()
            const needUpdateFontSize=fontSize!==oldFontSize
        try{
            if(needUpdateFontSize){
                this.setFontSize(fontSize)
            }
            const ids = this.font.getGlyphIDs(text)
            const widths = this.font.getGlyphWidths(ids, paint)
            return widths.reduce((acc, cur) => acc + cur, 0)
        }catch(e){
            
        }finally{
            needUpdateFontSize&&this.setFontSize(oldFontSize)
        }
    }
    getTextBounds(text: string,fontSize:number, paint?: CanvasKit.Paint) {
            const oldFontSize=this.getFontSize()
            const needUpdateFontSize=fontSize!==oldFontSize
        try{
            if(needUpdateFontSize){
                this.setFontSize(fontSize)
            }
            const ids = this.font.getGlyphIDs(text)
            const bounds = this.font.getGlyphBounds(ids, paint)
            const rect=BoundingRect.default()
            let left=0
            let top=0
            let right=0
            let bottom=0
            let minLeft=Infinity
            let minTop=Infinity
            let width=0
            let maxBottom=-Infinity
            for(let i=0;i<bounds.length;i+=4){
                 left=bounds[i]
                 top=bounds[i+1]
                 right=bounds[i+2]
                 bottom=bounds[i+3]
                 minLeft=Math.min(minLeft,left)
                 minTop=Math.min(minTop,top)
                 maxBottom=Math.max(maxBottom,bottom)
                 width+=right-left
                 
            }
            rect.fromXYWH(minLeft,minTop,width,maxBottom-minTop)
                          //  rect.fromLTRB(left,top,right,bottom)
            return  rect
        }catch(e){
            
        }finally{
            needUpdateFontSize&&this.setFontSize(oldFontSize)
        }
    }

    /**
     * 测量文本宽度
     * @param text 文本内容
     * @returns 文本宽度
     */
    measureText(text: string, paint?: CanvasKit.Paint) {
        return {
            width: this.getTextWidth(text,this.getFontSize(), paint)
        }
    }
    /**
     * 测量段落宽度
     * @param text 段落内容
     * @param paragraphStyle 段落样式
     * @returns 段落宽度
     */
    createParagraph(text: string, paragraphStyle: CanvasKit.ParagraphStyle) {
        const paragraphBuilder = CK.ParagraphBuilder.MakeFromFontProvider(paragraphStyle, this.fontProvider);
        paragraphBuilder.addText(text)
        const paragraph = paragraphBuilder.build();
        paragraphBuilder.delete()
        return paragraph
    }
    dispose() {
        this.fontProvider.delete()
        this.font.delete()
    }
}
export default FontManager