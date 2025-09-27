import { IPluginContext,IPluginService,IPlugin, ICommand, IHook, IMethod} from "./types";


export class PluginContext<Config extends Record<string, any> = {}> implements IPluginContext{
    id:string
    opts:any
    service:IPluginService<Config>
    constructor(service:IPluginService<Config>,plugin:IPlugin){
        this.service=service
        this.id=plugin.id
        this.opts=plugin.opts
    }   
    register(hook: IHook): void {
       const hooks= this.service.hooks.get(hook.name)??[]
       hook.pluginId=this.id
       this.service.hooks.set(hook.name,hooks.concat(hook))
    }
    registerMethod(name:string,fn?: IMethod): void {
        const methods=this.service.methods.get(name)??[]
        methods.push(fn||((handle:IHook['handle'])=>{
            this.register({name,handle})
        }))
        this.service.methods.set(name,methods)
    }
    registerCommand(command: ICommand): void {
        if(this.service.commands.has(command.name)){
            throw `${command.name}:命令已注册`
        }
        this.service.commands.set(command.name,command)
    }
    
}