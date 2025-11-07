
import {EventEmitter} from 'src/events'
import {IPlugin, PluginService,type PluginServiceOPtions} from 'src/core/PluginService'
import { merge } from 'src/utils';
import type { CKEnginePluginHooks, CKEnginePluginMethods,CKEngineEvents,CKEngineOptions} from 'src/types/CKEngine';
import {CanvaskitRenderer} from 'src/renderer/CanvaskitRenderer'
import { Ticker } from 'src/animation/Ticker';
import { BrowserEnvPresets } from 'src/plugins';
import { Container } from 'src/scene/Container';
import { Node } from 'src/scene/Node';
import { getRendertList } from './Paint';


export interface CKEngine{
 
}
export class CKEngine extends EventEmitter<CKEngineEvents>{
    static defaultPresets=[BrowserEnvPresets]
    pluginService=new PluginService<CKEnginePluginHooks,CKEnginePluginMethods>();
    needRefresh:boolean=false
    ready:boolean=false
    options:CKEngineOptions
    ticker:Ticker
    renderer:CanvaskitRenderer
    container:Container
    constructor(){
        super(); 
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
         this.ready=true
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
        if(this.needRefresh){
            this.render()
            this.needRefresh=false
        }
    }
    render(){
        if(this.ready){
        
            const pendingRenderObjects=this.container.getPendingRenderList()
            const renderObjects=getRendertList({
                objects:pendingRenderObjects,
                dpr:this.renderer.dpr,
                viewport:this.renderer.viewport,
            })
            this.renderer.render(renderObjects)
            this.needRefresh=false
        }
    }
    start(){
        this.ticker.start()
    }
    dispose(){
        this.renderer.dispose()
        this.container.dispose()
    }

}

