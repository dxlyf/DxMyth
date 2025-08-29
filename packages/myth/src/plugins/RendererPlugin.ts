import { Plugin } from "src/core/PluginManager";
import {CanvasRenderer} from 'src/renderer/canvas/CanvasRenderer'
import { IApplication } from "src/types/core/Application";
import {ExtensionType} from 'src/extensions'

declare module '../types/core/Application.ts'{
    interface ApplicationOptions{
        renderMode?:'canvas'
    }
}
export default class extends Plugin<IApplication>{
    static name= "RendererPlugin"
    static extension=ExtensionType.ApplicationPlugin
    create(){
        const  ctx=this.ctx;
        if(!ctx.options.renderMode||ctx.options.renderMode==='canvas'){
            ctx.hooks.renderer.tap('canvas',(app)=>{  
                 return new CanvasRenderer(app.options)
            })
        }

    }
} 

