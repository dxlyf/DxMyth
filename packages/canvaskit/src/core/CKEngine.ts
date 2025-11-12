
import {EventEmitter} from 'src/events'
import {IPlugin, PluginService,type PluginServiceOPtions} from 'src/core/PluginService'
import { merge } from 'src/utils';
import type { CKEnginePluginHooks, CKEnginePluginMethods,CKEngineEvents,CKEngineOptions} from 'src/types/CKEngine';
import {CanvaskitRenderer} from 'src/renderer/CanvaskitRenderer'
import { Ticker } from 'src/animation/Ticker';
import { BrowserEnvPresets } from 'src/plugins';
import { Container } from 'src/scene/Container';
import { Node } from 'src/scene/Node';



export interface CKEngine{
 
}
export class CKEngine extends EventEmitter<CKEngineEvents>{
    static defaultPresets=[BrowserEnvPresets]
    pluginService:PluginService<CKEngine,CKEnginePluginHooks,CKEnginePluginMethods>
    needRefresh:boolean=false
    options:CKEngineOptions
    ticker:Ticker
    renderer:CanvaskitRenderer
    container:Container
    constructor(){
        super(); 
        this.pluginService=new PluginService<CKEngine,CKEnginePluginHooks,CKEnginePluginMethods>(this)
        this.container=new Container()
        this.update=this.update.bind(this)
        this.ticker=Ticker.getInstance()
        this.ticker.add(this.update)
    }
    async init(options:CKEngineOptions){
         this.options=merge({},this.options,options);
         this.pluginService.initPresetsAndPlugins({
            plugins:[...(this.options.plugins??[])],
            presets:[...CKEngine.defaultPresets,...(this.options.presets??[])],
         });
         await this.initRenderer()
         this.emit('init',this)
    }
    async initRenderer(){
        this.renderer=new CanvaskitRenderer(this.options)
        await this.renderer.initialize()
    }
    add(child:Node){
        this.container.add(child)
    }
    remove(child:Node){
        this.container.remove(child)
    }
    refresh(){
        this.needRefresh=true
        this.ticker.start()
    }
    update(delta:number){
        this.emit('update',this)
        if(this.needRefresh){
            this.render()
            this.needRefresh=false
        }
     
    }
    render(){
        this.emit('render',this)
        this.renderer.render({container:this.container,delta:this.ticker.delta})
        this.needRefresh=false
    }
    start(){
        this.ticker.start()
    }
    dispose(){
        this.emit('dispose',this)
        this.renderer.dispose()
        this.container.dispose()
        this.pluginService.dispose()
        this.removeAllListeners()
    }

}

