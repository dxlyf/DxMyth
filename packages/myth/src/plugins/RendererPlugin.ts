import { Plugin } from "src/core/PluginManager";
import {Application} from 'src/core/Application'
import {CanvasRenderer} from 'src/renderer/canvas/CanvasRenderer'
declare module '../types/core/Application.ts'{
    interface ApplicationOptions{
        renderMode:'canvas'
    }
}
export default class extends Plugin<Application>{
    name= "RendererPlugin"
    create(){
        const  ctx=this.ctx;
        if(ctx.options.renderMode==='canvas'){
            ctx.hooks.renderer.tap('canvas',(app)=>{  
                 return new CanvasRenderer(app.options)
            })
        }

    }
} 

