import { Plugin } from "src/core/PluginManager";
import {CanvasRenderer} from 'src/renderer/canvas/CanvasRenderer'
import { IApplication } from "src/types/core/Application";
declare module '../types/core/Application.ts'{
    interface ApplicationOptions{
        renderMode?:'canvas'
    }
}
export default class extends Plugin<IApplication>{
    static name= "RendererPlugin"
    create(){
        const  ctx=this.ctx;
        if(!ctx.options.renderMode||ctx.options.renderMode==='canvas'){
            ctx.hooks.renderer.tap('canvas',(app)=>{  
                 return new CanvasRenderer(app.options)
            })
        }

    }
} 

