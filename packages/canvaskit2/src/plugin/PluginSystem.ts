
import type { Engine } from 'src/core/Engine'

export type IPlugin={
    name:string
    engine:Engine
    active:boolean
    init():void
    destroy():void
}
export class Plugin implements IPlugin{
    name:string
    engine:Engine
    active:boolean
    init(){}
    destroy(){}
}

export type PluginConstructor={
    name:string
    new():IPlugin
}
export class PluginSystem{
    engine:Engine
    plugins:Map<string,IPlugin>=new Map()
    constructor(engine:Engine){
        this.engine=engine
    }
    getPlugin(name:string){
        return this.plugins.get(name)
    }
    enablePlugin(name:string){
        const plugin=this.plugins.get(name)
        if(plugin){
            plugin.active=true
        }
    }
    disablePlugin(name:string){
        const plugin=this.plugins.get(name)
        if(plugin){
            plugin.active=false
        }
    }
    unregisterPlugin(name:string){
        const plugin=this.plugins.get(name)
        if(plugin){
            plugin.destroy()
            this.plugins.delete(name)
        }
    }
    registerPlugin(Plugin:PluginConstructor){
        if(this.plugins.has(Plugin.name)){
           return
        }
        const plugin=new Plugin()
        plugin.name=Plugin.name
        plugin.engine=this.engine
        plugin.init()
        this.plugins.set(Plugin.name,plugin)
    }
    registerPlugins(plugins:PluginConstructor[]){
        plugins.forEach(Plugin=>{
            this.registerPlugin(Plugin)
        })
    }
    unregisterPlugins(plugins:PluginConstructor[]){
        plugins.forEach(Plugin=>{
            this.unregisterPlugin(Plugin.name)
        })
    }
}