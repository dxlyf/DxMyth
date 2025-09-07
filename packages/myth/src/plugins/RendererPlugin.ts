import { Plugin } from "src/core/PluginManager";
import {CanvasRenderer} from 'src/renderer/canvas/CanvasRenderer'
import { IApplication } from "src/types/core/Application";
import { IBaseRenderer } from "src/types/core/BaseRenderer";
import {extensions,ExtensionType} from 'src/extensions'

const rendererMap:Record<string,{
    new(options:any):IBaseRenderer
}>={}
extensions.handleByMap(ExtensionType.Renderer,rendererMap)
declare module '../types/core/Application.ts'{
    interface ApplicationOptions{
        renderMode?:'canvas'|'webgl'
    }
}
export default class extends Plugin<IApplication>{
    static name= "RendererPlugin"
    static extension=ExtensionType.ApplicationPlugin
    create(){
        const  ctx=this.ctx;
        const mode=ctx.options.renderMode||'canvas';
        ctx.hooks.renderer.tap('renderer',(app)=>{  
            const Renderer=rendererMap[mode]
            return new Renderer(app.options)
       })

    }
} 

