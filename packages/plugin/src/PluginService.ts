

import { PluginContext } from './PluginContext';
import { ICommand, IHook, ApplyPluginOption, IMethod, IPlugin, IPluginService, IPreset, PluginServiceConfig, AppplyPluginHookType, IPluginContext } from './types'

export class PluginService<Config extends Record<string, any> = {}> implements IPluginService<Config> {
    config: PluginServiceConfig & Config;
    hooks: Map<string, IHook[]>;
    methods: Map<string, IMethod[]>;
    commands: Map<string, ICommand>;
    plugins: Map<string, IPlugin<any>>;
    presets: Map<string, IPreset>
    extraPlugins: IPlugin<any>[];
    extraPresets: IPreset<any>[]
    constructor(config: PluginServiceConfig & Config) {
        this.config = config
        this.hooks = new Map()
        this.methods = new Map()
        this.commands = new Map()
        this.plugins = new Map()
        this.presets = new Map()
    }

    initPresetsAndPlugins(): void {
        this.plugins.clear()
        this.presets.clear()
        this.extraPlugins = []
        this.extraPresets = []
        this.resolvePresets(this.config.presets ?? [], false)
        this.resolvePlugins(this.config.plugins ?? [], false)
    }
    getSortPlugins<T extends IPlugin>(plugins: T[]): T[] {
        const normal: T[] = [], pre: T[] = [], post: T[] = []
        plugins.forEach(plugin => {
            switch (plugin.order) {
                case 'pre':
                    pre.push(plugin)
                    break
                case 'post':
                    post.push(plugin)
                    break
                default:
                    normal.push(plugin)
                    break
            }
        })
        return [...pre, ...normal, ...post].filter(Boolean)
    }
    resolvePresets(presets: IPreset[], extra: boolean): void {
        for (let i = 0; i < presets.length; i++) {
            this.initPreset(presets[i])
        }
        let extraPresets = this.extraPresets
        while (extraPresets.length) {
            this.initPreset(extraPresets.shift())
        }
        this.extraPresets = []
    }
    resolvePlugins(plugins: IPlugin[], extra: boolean): void {
        let sortPlugins = this.getSortPlugins(plugins.concat(this.extraPlugins))
        this.extraPlugins = []
        while (sortPlugins.length) {
            this.initPlugin(sortPlugins.shift())
            if (this.extraPlugins.length) {
                sortPlugins = this.getSortPlugins(sortPlugins.concat(this.extraPlugins))
                this.extraPlugins = []
            }
        }
        this.extraPlugins = []
    }
    registerPlugin(plugin: IPlugin): void {
        if (!this.plugins.has(plugin.id)) {
            throw `${plugin.id}:插件已注册`
        }
        this.extraPlugins.push(plugin)
        this.plugins.set(plugin.id, plugin)
    }
    registerPreset(preset: IPreset) {
        if (this.presets.has(preset.id)) {
            throw `${preset.id}:预设已注册`
        }
        this.extraPresets.push(preset)
        this.presets.set(preset.id, preset)
    }
    applyMethods(methods: IMethod[]) {
        return (...args: any[]) => {
            methods.forEach(fn => {
                fn(...args)
            })
        }
    }
    initPluginCtx(plugin: IPlugin) {
        const pluginContext = new PluginContext<Config>(this, plugin)
        return new Proxy(pluginContext, {
            get: (target, key: string, receiver) => {
                if (this.methods.has(key)) {
                    const methods = this.methods.get(key)
                    return this.applyMethods(methods)
                }
                return Reflect.get(target, key, receiver)
            }
        })
    }
    initPlugin(plugin: IPlugin): void {
        if (this.plugins.has(plugin.id)) {
            return
        }
        this.plugins.set(plugin.id, plugin)
        const pluginContext = this.initPluginCtx(plugin)
        plugin.handle(pluginContext as any, plugin.opts)
    }
    initPreset(preset: IPreset): void {
        if (this.presets.has(preset.id)) {
            return
        }
        this.presets.set(preset.id, preset)
        const pluginContext = this.initPluginCtx(preset)
        const { presets, plugins } = preset.handle(pluginContext as any, preset.opts)
        if (presets) {
            this.extraPresets.push(...presets)
        }
        if (plugins) {
            this.extraPlugins.push(...plugins)
        }
    }
    async hookFirst<T = any>(name: string, ...args: any[]): Promise<T> {
        const hooks = this.hooks.get(name) ?? []
        for (let hook of hooks) {
            let result = await Promise.resolve().then(() => hook.handle(...args))
            if (result !== null && result !== undefined) {
                return result
            }
        }
        return null
    }
    hookFirstSync<T = any>(name: string, ...args: any[]): T {
        const hooks = this.hooks.get(name) ?? []
        for (let hook of hooks) {
            let result = hook.handle(...args)
            if (result !== null && result !== undefined) {
                return result
            }
        }
        return null
    }
    async hookParallel(name: string, ...args: any[]): Promise<any> {
        const hooks = this.hooks.get(name) ?? []
        const parallelPromises: Promise<any>[] = [];
        for (const hook of hooks) {
            parallelPromises.push(Promise.resolve().then(() => hook.handle(...args)))
        }
        return Promise.all(parallelPromises);
    }
    runHookSync(name: string, ...args: any[]) {
        const hooks = this.hooks.get(name) ?? []
        for (const hook of hooks) {
            hook.handle(...args)
        }
    }
    async runHook(name: string, ...args: any[]) {
        const hooks = this.hooks.get(name) ?? []
        for (const hook of hooks) {
            await Promise.resolve().then(() => hook.handle(...args))
        }
    }
    async applyPlugins<T = any>(opts: ApplyPluginOption): Promise<T> {
        let { name, type, args, initalValue = [] } = opts
        const hooks = (this.hooks.get(name) ?? []).slice()
        hooks.sort((a, b) => {
            let aStage = a.stage ?? 0, bStage = b.stage ?? 0
            return aStage - bStage
        })
        if (hooks) {
            if (!type) {
                if (name.startsWith('add')) {
                    type = AppplyPluginHookType.add
                }
                else if (name.startsWith('modify')) {
                    type = AppplyPluginHookType.modify
                } else if (name.startsWith('on')) {
                    type = AppplyPluginHookType.event
                }
            }

            switch (type) {
                case AppplyPluginHookType.add:
                    for (let hook of hooks) {
                        const result = await Promise.resolve().then(() => hook.handle(args))
                        if (result !== undefined && result !== null) {
                            initalValue = initalValue.concat(result)
                        }
                    }
                    return initalValue
                case AppplyPluginHookType.modify:
                    for (let hook of hooks) {
                        const result = await Promise.resolve().then(() => hook.handle(initalValue, args))
                        initalValue = result
                    }
                    return initalValue
                case AppplyPluginHookType.event:
                    if (opts.sync) {
                        for (let hook of hooks) {
                            hook.handle(opts.args)
                        }
                    } else {
                        for (let hook of hooks) {
                            await Promise.resolve().then(() => hook.handle(args))
                        }
                    }
            }

        }
    }
    reset(){
        this.hooks.clear()
        this.commands.clear()
        this.methods.clear()
        this.extraPlugins=[]
        this.extraPresets=[]
        this.plugins.clear()
        this.presets.clear()
    }
    async run<T = any>(name: string, ...args: any[]):Promise<T> {
        if (!this.commands.has(name)) {
            throw `${name}:命令不存在`
        }
        const config = this.config.getConfig?.(...args) ?? {}
        this.initPresetsAndPlugins()
        await this.applyPlugins({name:'onRunBefore'})
        let ret=await this.commands.get(name).handle(config)
        await this.applyPlugins({name:'onRunAfter'})
        return ret as T
    }


}
