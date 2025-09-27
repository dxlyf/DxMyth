import { IRenderer } from "src/interface/Renderer"
import {EventEmitter} from 'src/events'
import { PluginService, PluginServiceOPtions,IPlugin, IPreset } from "./PluginService"
import { BrowserEnvPresets } from "src/plugins"

export interface ApplicationOptions extends PluginServiceOPtions{
    canvas:HTMLCanvasElement
    width:number
    height:number
}

export class Application extends EventEmitter{
    static defaultPresets:IPreset[]=[BrowserEnvPresets]
    options:ApplicationOptions
    renderer:IRenderer<any>
    pluginService:PluginService
    constructor(options:ApplicationOptions){
        super()
        this.options=options
        this.pluginService=new PluginService({
            presets:Application.defaultPresets.concat((options.presets??[])),
            plugins:options.plugins
        })
    }
    async initialize(){
        this.pluginService.initPresetsAndPlugins()
        this.renderer=await this.pluginService.applyPlugins<IRenderer<any>>({name:'createRenderer',args:this})
    }
}