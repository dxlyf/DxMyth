import { Plugin } from "src/core/PluginManager";
import { IApplication } from "src/types/core/Application";
import {extensions,ExtensionType} from 'src/extensions'
import {EventHandle} from 'src/input/EventHandle'

type InteractiveType={
    new(app:IApplication,options?:ConstructorParameters<typeof EventHandle<any,any>>[1]):EventHandle<any,any>
}
const interactives:InteractiveType[]=[]
extensions.handleByList(ExtensionType.Interactive,interactives)
declare module '../types/core/Application.ts'{
    interface ApplicationOptions{
        interactive?:boolean // 是否启用交互事件
    }
}
export default class extends Plugin<IApplication>{

    static name= "InteractivePlugin"
    static extension=ExtensionType.ApplicationPlugin
    interactives:EventHandle<any,any>[]
    init(){
       if(this.ctx.options.interactive===false){
            return
       }
       this.interactives=interactives.map(Input=>new Input(this.ctx,{
           domElement:this.ctx.domElement,
           proxyHandler:this.ctx,
       }))
       this.interactives.forEach(input=>{
            input.attachEvents()
        })

       this.ctx.on('update', this.onUpdate)
       this.ctx.renderer.on('resize', this.onResize)
    }
    onUpdate=()=>{
        this.interactives.forEach(input=>{
            input.onUpdate()
        })
    }
    onResize=()=>{
        this.interactives.forEach(input=>{
            input.onResize()
        })
    }
    destroy(): void {
        this.interactives.forEach(input=>{
            input.destroy()
        })
        this.ctx.off('update', this.onUpdate)
        this.ctx.renderer.off('resize', this.onResize)
    }
} 

