import {CK,type CanvasKit} from 'src/canvaskit'
import { BoundingRect } from 'src/math'

export type FontFamilyResource={
    family:string
    url:string
}
export type FontManagerOptions={
    /**
     * 字体-family和URL映射
     */
    fonts?:FontFamilyResource[]
    /**
     * 默认字体-family
     */
    defaultFontFamily?:string
    defaultFontSize?:number
    defaultSubpixel?:boolean

}
 class FontManager{
    public fontProvider:CanvasKit.TypefaceFontProvider
    public font:CanvasKit.Font
    options:FontManagerOptions
    constructor(options:FontManagerOptions={}){
        this.options=Object.assign({
            defaultFontFamily:'sans-serif',
            defaultFontSize:12,
            defaultSubpixel:true
        },options)
        this.fontProvider=CK.TypefaceFontProvider.Make()
        this.font=new CK.Font()
        this.font.setSize(this.options.defaultFontSize)
        this.font.setSubpixel(this.options.defaultSubpixel)
        if(this.options.fonts){
            this.loadFonts(this.options.fonts).then(()=>{
                this.setFontFamily(this.options.defaultFontFamily)
            })
        }
    }
    countFamilies(){
        return this.fontProvider.countFamilies()
    }
    getFontFamily(){
        return  this.getTypeface()?.getFamilyName()
    }
    getTypeface(){
        return this.font.getTypeface()
    }
    getFontSize(){
        return this.font.getSize()
    }
    setFontSize(size:number){
        this.font.setSize(size)
    }
    setSubpixel(subpixel:boolean){
        this.font.setSubpixel(subpixel)
    }
    setTypeface(typeface:CanvasKit.Typeface){
        this.font.setTypeface(typeface)
    }
    /**
     * 设置字体-family
     * @param family 字体-family
     * @returns 是否设置成功
     */
    setFontFamily(family:string){
        const typeface=this.matchFamilyStyle(family)
        if(typeface){
            this.setTypeface(typeface)
            return true
        }
        return family
    }
     /**
     * 注册字体-family
     * @param family 字体-family
     * @param fontBuffer 字体-ArrayBuffer
     * @returns 是否注册成功
     */
    addFontFamily(family:string,fontBuffer:ArrayBuffer){
        if(this.hasFontFamily(family)){
            return false
        }
        this.fontProvider.registerFont(fontBuffer,family)
        return true
    }
    /**
     * 移除字体-family
     * @param family 字体-family
     * @returns 是否移除成功
     */
    removeFontFamily(family:string){
        const typeface=this.matchFamilyStyle(family)
        if(typeface){
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
    async loadFonts(fonts:FontFamilyResource[]){
        const promises=fonts.map(d=>{
            return this.loadFromUrl(d.family,d.url)
        })
        return Promise.all(promises)
    }
    /**
     * 从URL加载字体-family
     * @param family 字体-family
     * @param url 字体-URL
     * @returns 是否加载成功
     */
    async loadFromUrl(family:string,url:string){
        const response=await fetch(url)
        const arrayBuffer=await response.arrayBuffer()
        return this.addFontFamily(family,arrayBuffer)
    }
    /**
     * 检查字体库是否包含指定字体-family
     * @param family 字体-family
     * @returns 是否包含
     */
    hasFontFamily(family:string){
        const count=this.fontProvider.countFamilies()
        for(let i=0;i<count;i++){
            if(this.fontProvider.getFamilyName(i)===family){
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
    matchFamilyStyle(family:string,style?:CanvasKit.FontStyle):CanvasKit.Typeface{
        const defaultStyle:CanvasKit.FontStyle={
            weight:CK.FontWeight.Normal,
            slant:CK.FontSlant.Italic,
            width:CK.FontWidth.Normal,
            ...(style??{})
        }
        return this.fontProvider.matchFamilyStyle(family,defaultStyle)
    }
    getTextWidth(text:string,paint?:CanvasKit.Paint){
        const ids=this.font.getGlyphIDs(text)
        const widths=this.font.getGlyphWidths(ids,paint) 
        return widths.reduce((acc,cur)=>acc+cur,0)
    }
    getTextBounds(text:string,paint?:CanvasKit.Paint){
        const ids=this.font.getGlyphIDs(text)
        const bounds=this.font.getGlyphBounds(ids,paint)  
        return BoundingRect.fromLTRB(bounds[0],bounds[1],bounds[2],bounds[3])
    }
    /**
     * 测量文本宽度
     * @param text 文本内容
     * @returns 文本宽度
     */
    measureText(text:string,paint?:CanvasKit.Paint){
        return {
            width:this.getTextWidth(text,paint)
        }
    }
    /**
     * 测量段落宽度
     * @param text 段落内容
     * @param paragraphStyle 段落样式
     * @returns 段落宽度
     */
    createParagraph(text:string,paragraphStyle:CanvasKit.ParagraphStyle){
        const paragraphBuilder = CK.ParagraphBuilder.MakeFromFontProvider(paragraphStyle, this.fontProvider);
        paragraphBuilder.addText(text)
        const paragraph = paragraphBuilder.build();
        paragraphBuilder.delete()
        return paragraph
    }
    dispose(){
        this.fontProvider.delete()
        this.font.delete()
    }
}
export default FontManager