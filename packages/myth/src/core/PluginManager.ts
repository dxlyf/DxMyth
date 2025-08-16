
import { IPluginManager,IPlugin,PluginConstructor,PluginManagerEvents,PluginCallNames } from 'src/types/core/Plugin.ts'
import {EventEmitter4} from '@dxyl/utils'


export  class Plugin<Context> implements IPlugin<Context> {
    name: string;
    ctx: Context
    owner: IPluginManager<Context> 
    constructor(ctx: Context, owner: IPluginManager<Context>) {
        this.name = this.constructor.name;
        this.ctx = ctx;
        this.owner = owner;
    }
     create():void{}
     init():void{}
     destroy?():void{}
}

export class PluginManager<Context> extends EventEmitter4<PluginManagerEvents<Context>> implements IPluginManager<Context> {
    plugins: Map<string, PluginConstructor<Context>> = new Map();
    installPluginList: Map<string, IPlugin<Context>> = new Map();

    ctx: Context
    constructor(ctx: Context, plugins?: PluginConstructor<Context>[]) {
        super()
        this.ctx = ctx;
        if (plugins) {
            this.addPlugins(plugins)
        }
    }
    addPlugins(plugins: PluginConstructor<Context>[]) {
        plugins.filter(Boolean).forEach(p => {
            if (!this.plugins.has(p.name)) {
                this.plugins.set(p.name, p)
            }
        })
    }
    callPluginHook(name: Exclude<PluginCallNames,'create'>) {
        this.installPluginList.forEach(p => {
           if(typeof p[name] === 'function'&&(name as unknown)!=='create') {
             (p[name] as Function)()
           }
        })
    }
    install() {
        this.emit('install',this.ctx)
        this.plugins.forEach((Plugin,PluginName) => {
            if (!this.installPluginList.has(PluginName)) {
                let p=new Plugin(this.ctx,this)
                p.create()
                this.installPluginList.set(p.name, p)
            }
        })
    }
    uninstall() {
        this.emit('uninstall',this.ctx)
        this.installPluginList.forEach(p => {
            p.destroy()
        })
        this.installPluginList.clear()
      
    }
    clear() {
        this.uninstall()
    }
}