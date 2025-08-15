import { ApplicationHooks, ApplicationOptions } from "src/types/core/Application";
import { PluginManager } from "./PluginManager";
import { IBaseRenderer } from "src/types/core/BaseRenderer";
import {SyncHook,AsyncSeriesBailHook} from '@dxyl/tapable'
import ResizePlugin from 'src/plugins/ResizePlugin'
import RendererPlugin from 'src/plugins/RendererPlugin'

export class Application{
    static defaultPlugins=[RendererPlugin,ResizePlugin]
    options:ApplicationOptions
    pluginManager!:PluginManager<Application>
    renderer!:IBaseRenderer
    hooks:ApplicationHooks
    constructor(options:ApplicationOptions){
        this.options=options;
        this.hooks={
            renderer:new AsyncSeriesBailHook()
        } 
        this.pluginManager=new PluginManager(this,Application.defaultPlugins.concat(options.plugins??[]))
    }
    async init(){
        this.pluginManager.install()
        await this.initRenderer()
        this.initPlugins()
    }
    async initRenderer(){
        this.renderer=(await this.hooks.renderer.promise(this))!
    }
    initPlugins(){
        this.pluginManager.callPluginHook('init')
    }
    dispose(){
        this.pluginManager.uninstall()
    }
}