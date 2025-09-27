import { Application } from "src/core/Application";
import { IPlugin, PluginContext } from "src/core/PluginService";
import { CanvaskitRenderer } from "src/renderer/canvaskit/Renderer";

export default {
    name:'RendererPlugin',
    apply(api:PluginContext){
        api.register({
            name:'createRenderer',
            fn:(app:Application)=>{
                return new CanvaskitRenderer(app.options) 
            }
        })
        
    }
} as IPlugin