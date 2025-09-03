
import {Plugin} from 'src/core/PluginManager'
import { IApplication } from 'src/types/core/Application';
import { getMargins } from 'src/utils/dom';
import {ExtensionType,extensions} from 'src/extensions'
import { FontMap,FontExtension,Fonts} from 'src/font';
import * as opentype from '@dxyl/utils/opentype'
extensions.add(...Fonts)
declare module '../types/core/Application.ts' {
    interface IApplication{
        fonts:FontMap
    }
}
declare module '../core/Application.ts' {
    interface Application{
        fonts:FontMap
    }
}
class FontPlugin extends Plugin<IApplication> {
    static name: string='FontPlugin'
    static extension=ExtensionType.ApplicationPlugin
    resizeId=0
    width: number=0
    height: number=0
    resizeType:'window'|'element'|'none'='none'
    create(): void {
        this.ctx.hooks.fonts.tapPromise('FontPlugin', async () => {
            const fontMap:Record<string,FontExtension>={}
            extensions.handleByMap(ExtensionType.Font,fontMap)
            const fonts:any={}
            for(let [name,font] of Object.entries(fontMap)){
                const buffer=await fetch(font.fontUrl).then(res=>res.arrayBuffer())
                fonts[name]=opentype.parse(buffer)
            }
            return fonts as FontMap
        })
    }
    init(): void {
      
    }
    destroy() {
        this.ctx.fonts=null
    }
}
export default FontPlugin 

