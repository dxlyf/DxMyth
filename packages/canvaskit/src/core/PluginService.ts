
export type PluginServiceOPtions = {
    plugins?: IPlugin[]
    presets?: IPreset[]
}
export type PluginContext = {
    pluginName: string
    register(hook: IHook): void
    registerMethod(name: string, fn?: IMethod): void
}
export type IPlugin = {
    name: string
    config?: any
    apply: (api: PluginContext, config?: any) => void
}
export type IPreset = Omit<IPlugin, 'apply'> & {
    apply: (api: PluginContext, config?: any) => ({ presets?: IPreset[], plugins?: IPlugin[] })
}
export type IHook = {
    name: string
    order?: number
    fn: Function
}
export enum HookType {
    create = 'create',
    add = 'add',
    modify = 'modify',
    event = 'event'
}
export type HookOpts = {
    name: string
    type?: HookType
    initalValue?: any
    args?: any
    sync?: boolean
}
export type IMethod = (...args: any[]) => void
export class PluginService {
    private hooks: Map<string, IHook[]> = new Map()
    private methods: Map<string, IMethod[]> = new Map()
    private plugins: Map<string, IPlugin> = new Map()
    private extraPresets: IPreset[] = []
    private extraPlugins: IPlugin[] = []
    constructor(public config?: PluginServiceOPtions) {

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
    private applyMethods(name: string) {
        const methods = this.methods.get(name) ?? []
        return (...args: any[]) => {
            methods.forEach(fn => {
                fn(...args)
            })
        }
    }
    private initPluginContext(plugin: IPlugin | IPreset) {
        const pluginContext: PluginContext = {
            pluginName: plugin.name,
            registerMethod: this.registerMethod.bind(this),
            register: this.register.bind(this)
        }
        return new Proxy(pluginContext, {
            get: (target, key: string, receiver) => {
                if (this.methods.has(key)) {
                    return this.applyMethods(key)
                }
                return Reflect.get(target, key, receiver)
            }
        })
    }
    private initPreset(preset: IPreset) {
        this.registerPlugin(preset)
        const ctx = this.initPluginContext(preset)
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
        const ctx = this.initPluginContext(plugin)
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
    registerMethod(name: string, fn?: IMethod) {
        const methods = this.methods.get(name) ?? []
        methods.push(fn || ((fn: IHook['fn']) => {
            this.register({ name, fn })
        }))
        this.methods.set(name, methods)
    }
    async applyPlugins<T = any>(opts: HookOpts):Promise<Exclude<T,void> extends never?void:T> {
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
    destroy(): void {
        this.extraPlugins = []
        this.extraPresets = []
        this.plugins.clear()
        this.hooks.clear()
        this.methods.clear()
    }
}