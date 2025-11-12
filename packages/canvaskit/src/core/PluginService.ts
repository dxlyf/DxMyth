
export type PluginServiceOPtions = {
    plugins?: IPlugin[]
    presets?: IPreset[]
}
export type PluginContext<Ctx=any,HookList extends HookListType = any, HookMethods extends Record<string, IMethod> = any> = {
    pluginName: string
    ctx:Ctx
    register<K extends keyof HookList>(hook: IHook<K, HookList[K]>): void
    registerMethod<K extends keyof HookMethods>(name: K, fn?: IMethod<Parameters<HookMethods[K]>, ReturnType<HookMethods[K]>>): void
} & PluginMethods<HookMethods>&PluginService<Ctx,HookList,HookMethods>
export type PluginMethods<HookMethods extends Record<string, IMethod> = any> = {
    [k in Exclude<keyof HookMethods, 'pluginName' | 'register' | 'registerMethod'>]: IMethod<Parameters<HookMethods[k]>, ReturnType<HookMethods[k]>>
}

export type IPlugin<Ctx=any,HookList extends HookListType = any, HookMethods extends Record<string, IMethod> = any> = {
    name: string
    config?: any
    apply: (api: PluginContext<Ctx,HookList, HookMethods>, config?: any) => void
    dispose?:(api: PluginContext<Ctx,HookList, HookMethods>)=>void
}
export type IPreset = Omit<IPlugin, 'apply'> & {
    apply: (api: PluginContext, config?: any) => ({ presets?: IPreset[], plugins?: IPlugin[] })
}
export type IHook<T = any, F = any> = {
    name: T
    order?: number
    fn: (...args: any[]) => F
}
export enum HookType {
    create = 'create',
    add = 'add',
    modify = 'modify',
    event = 'event'
}
export type HookOpts<T> = {
    name: T
    type?: HookType
    initalValue?: any
    args?: any
    sync?: boolean
}
export type IMethod<T extends any = any, R = any> = (...args: T extends Array<any> ? T : [T]) => R
export type HookListType = Record<string, any>


export class PluginService<Ctx,HookList extends HookListType, HookMethods extends Record<string, IMethod> = any> {
    private hooks: Map<string, IHook[]> = new Map()
    private methods: Map<string, IMethod[]> = new Map()
    private plugins: Map<string, IPlugin> = new Map()
    private extraPresets: IPreset[] = []
    private extraPlugins: IPlugin[] = []
    public context:Ctx
    constructor(context:Ctx,public config?: PluginServiceOPtions) {
        this.context=context
        if(this.config){
            this.initPresetsAndPlugins(this.config)
        }
    }
    initPresetsAndPlugins(config: PluginServiceOPtions) {
        this.extraPlugins = []
        this.extraPresets = []
        this.resolvePresets(config.presets ?? [])
        this.resolvePlugins(config.plugins ?? [])
    }
    private resolvePresets(presets: IPreset[]) {
        if (Array.isArray(presets)) {
            presets.forEach(preset => {
                this.initPreset(preset)
            })
        }
        const extraPresets = this.extraPresets
        while (extraPresets.length) {
            this.initPreset(extraPresets.shift()!)
        }
    }
    private resolvePlugins(plugins: IPlugin[]) {
        if (Array.isArray(plugins)) {
            plugins.forEach(plugin => {
                this.initPlugin(plugin)
            })
        }
        const extraPlugins = this.extraPlugins
        while (extraPlugins.length) {
            this.initPlugin(extraPlugins.shift()!)
        }
    }
    private getApplyMethods(name: string) {
        const methods = this.methods.get(name) ?? []
        return (...args: any[]) => {
            if (methods.length === 1) {
                return methods[0](...args)
            }
            return methods.reduceRight((a, b) => {
                return (...args: any) => {
                    return b(a(...args))
                }
            })(...args)
        }
    }
    applyMethods<K extends Extract<keyof HookMethods, string>>(name: K, ...args: Parameters<HookMethods[K]> extends Array<any> ? Parameters<HookMethods[K]> : [Parameters<HookMethods[K]>]): ReturnType<HookMethods[K]> {
        const methods = this.methods.get(name) ?? []
        if (methods.length === 1) {
            return methods[0](...args)
        }
        return methods.reduceRight((a, b) => {
            return (...args: any) => {
                return b(a(...args))
            }
        })(...args)
    }
    private getPluginContext(plugin: IPlugin | IPreset) {
        const pluginContext: any = {
            pluginName: plugin.name,
            ctx:this.context,
            registerMethod: this.registerMethod.bind(this),
            register: this.register.bind(this)
        }
        return new Proxy(pluginContext, {
            get: (target, key: string, receiver) => {
                if (this.methods.has(key)) {
                    return this.getApplyMethods(key)
                }
                return Reflect.get(target, key, receiver)
            }
        })
    }
    private initPreset(preset: IPreset) {
        this.registerPlugin(preset)
        const ctx = this.getPluginContext(preset)
        const { plugins, presets } = preset.apply(ctx, preset.config)
        if (presets) {
            this.extraPresets.push(...presets)
        }
        if (plugins) {
            this.extraPlugins.push(...plugins)
        }
    }
    private initPlugin(plugin: IPlugin) {
        this.registerPlugin(plugin)
        const ctx = this.getPluginContext(plugin)
        plugin.apply(ctx, plugin.config)
    }
    registerPlugin(plugin: IPlugin | IPreset) {
        if (this.plugins.has(plugin.name)) {
            throw `${plugin.name}:已存在`
        }
        this.plugins.set(plugin.name, plugin as IPlugin)
    }
    register(hook: IHook) {
        const hooks = this.hooks.get(hook.name) ?? []
        hooks.push(hook)
        this.hooks.set(hook.name, hooks)
    }
    registerMethod<K>(name: string, fn?: IMethod) {
        const methods = this.methods.get(name) ?? []
        methods.push(fn || ((fn: IHook['fn']) => {
            this.register({ name, fn })
        }))
        this.methods.set(name, methods)
    }
    async applyPlugins<K extends Extract<keyof HookList, string> = Extract<keyof HookList, string>, T = HookList[K]>(inOpts: HookOpts<K> | K): Promise<Exclude<T, void> extends never ? void : T> {
        const opts = typeof inOpts === 'string' ? { name: inOpts, type: undefined } as HookOpts<K> : inOpts
        let { name, type } = opts
        if (!type) {
            if (name.startsWith('modify')) {
                type = HookType.modify
            }
            if (name.startsWith('add')) {
                type = HookType.add
            }
            if (name.startsWith('on')) {
                type = HookType.event
            }
            if (name.startsWith('create')) {
                type = HookType.create
            }
        }
        const hooks = (this.hooks.get(name) ?? []).slice()
        hooks.sort((a, b) => {
            let _a = a.order ?? 0, _b = b.order ?? 0
            return _a - _b
        })
        switch (type) {
            case HookType.create:
                {
                    let initialValue = opts.initalValue
                    for (let hook of hooks) {
                        let ret = await Promise.resolve().then(() => hook.fn(opts.args))
                        if (ret !== undefined && ret !== null) {
                            return ret
                        }
                    }
                    return initialValue
                }
            case HookType.add:
                {
                    let initialValue = opts.initalValue ?? []
                    for (let hook of hooks) {
                        let ret = await Promise.resolve().then(() => hook.fn(opts.args))
                        if (ret !== undefined && ret !== null) {
                            initialValue.push(ret)
                        }
                    }
                    return initialValue
                }
            case HookType.modify:
                {
                    let initialValue = opts.initalValue ?? {}
                    for (let hook of hooks) {
                        let ret = await Promise.resolve().then(() => hook.fn(initialValue, opts.args))
                        if (ret !== undefined && ret !== null) {
                            initialValue = ret
                        }
                    }
                    return initialValue

                }
            case HookType.event:
                {
                    if (opts.sync) {
                        for (let hook of hooks) {
                            hook.fn(opts.args)

                        }
                    } else {
                        let p = Promise.resolve()
                        for (let hook of hooks) {
                            p = p.then(() => {
                                hook.fn(opts.args)
                            })
                        }

                    }
                    break
                }

        }
    }
    uninstallPlugin(plugin: IPlugin | IPreset) {
        if(this.plugins.has(plugin.name)){
            const ctx=this.getPluginContext(plugin)
            plugin.dispose?.(ctx)
            this.plugins.delete(plugin.name)
        }
    }
    dispose(): void {
        this.plugins.forEach(plugin=>{
            plugin?.dispose?.(this.getPluginContext(plugin))
        })
        this.extraPlugins = []
        this.extraPresets = []
        this.plugins.clear()
        this.hooks.clear()
        this.methods.clear()
    }
}