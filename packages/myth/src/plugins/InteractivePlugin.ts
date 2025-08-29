import { Plugin } from "src/core/PluginManager";
import { IApplication } from "src/types/core/Application";
import {extensions,ExtensionType} from 'src/extensions'


type InteractiveType<T=any>={
    new(app:IApplication):T
    init():void
    destroy():void
}
const interactives:InteractiveType[]=[]
extensions.handleByList(ExtensionType.Interactive,interactives)
declare module '../types/core/Application.ts'{
    interface ApplicationOptions{
        interactive?:boolean
    }
}
export default class extends Plugin<IApplication>{

    static name= "InteractivePlugin"
    static extension=ExtensionType.ApplicationPlugin
    interactives:InteractiveType[]
    init(){
       this.interactives=interactives.map(Input=>new Input(this.ctx))
    }
    destroy(): void {
        this.interactives.forEach(input=>{
            input.destroy()
        })
    }
} 

