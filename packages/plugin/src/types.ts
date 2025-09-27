export enum AppplyPluginHookType{
    modify='modify',
    add='add',
    event='event'
}
export type PluginType='plugin'|'preset'
export type PluginOrder='pre'|'post'|'normal'

export type IPlugin<T=any>={
    id:string // 唯一标识
    order?:PluginOrder
    opts?:T
    handle:(api:IPluginContextProxy,opts:T)=>void
}
export type IPreset<T=any>=Omit<IPlugin<T>,'handle'>&{
    handle:(api:IPluginContextProxy,opts:T)=>({presets?:IPreset[],plugins?:IPlugin[]})
}
export type IPluginContextProxy=IPluginContext&{
    [Key:string]:(...args:any[])=>void
}

export type IHook={
    name:string// 钩子名称
    opts?:any
    pluginId?:string
    stage?:number

    handle:<T=any>(...args:any)=>Promise<T>|T 
}
export type IMethod=(...args:any[])=>void
export type ICommand={
    name:string
    handle:<T=any>(config:any)=>Promise<T>
}

export type PluginServiceConfig={
    cwd?:string
    plugins?:IPlugin[]
    presets?:IPreset[]
    resolvePresetsOrPlugins?(pluginOrPreset:IPlugin):IPlugin
    getConfig?(...args:any[]):any
}
export type ApplyPluginOption={
    name:string
    type?:AppplyPluginHookType
    initalValue?:any,
    args?:any
    sync?:boolean
}
// 插件服务
export type IPluginService<Config extends Record<string,any>={}>={
    config: PluginServiceConfig & Config;
    hooks: Map<string, IHook[]>;
    methods: Map<string, IMethod[]>;
    commands: Map<string, ICommand>;
    registerPlugin(plugin: IPlugin):void 
    registerPreset(preset: IPreset):void
    applyPlugins<T=any>(opts:ApplyPluginOption):Promise<T>
    run<T=any>(command:string,args:any):Promise<void>

}
// 插件API，提供给插件使用
export type IPluginContext={
   id:string // 插件id
   opts:any // 插件配置选项
   service:IPluginService
   register(hook:IHook):void // 注钩子
   registerMethod(name:string,fn?: IMethod):void
   registerCommand(comand:ICommand):void
}