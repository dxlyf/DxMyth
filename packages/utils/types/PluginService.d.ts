export type PluginServiceOPtions = {
    plugins?: IPlugin[];
    presets?: IPreset[];
};
export type PluginContext<HookList extends HookListType = any, HookMethods extends Record<string, IMethod> = any> = {
    pluginName: string;
    register<K extends keyof HookList>(hook: IHook<K, HookList[K]>): void;
    registerMethod<K extends keyof HookMethods>(name: K, fn?: IMethod<Parameters<HookMethods[K]>, ReturnType<HookMethods[K]>>): void;
} & PluginMethods<HookMethods>;
export type PluginMethods<HookMethods extends Record<string, IMethod> = any> = {
    [k in Exclude<keyof HookMethods, 'pluginName' | 'register' | 'registerMethod'>]: IMethod<Parameters<HookMethods[k]>, ReturnType<HookMethods[k]>>;
};
export type IPlugin<HookList extends HookListType = any, HookMethods extends Record<string, IMethod> = any> = {
    name: string;
    config?: any;
    apply: (api: PluginContext<HookList, HookMethods>, config?: any) => void;
};
export type IPreset = Omit<IPlugin, 'apply'> & {
    apply: (api: PluginContext, config?: any) => ({
        presets?: IPreset[];
        plugins?: IPlugin[];
    });
};
export type IHook<T = any, F = any> = {
    name: T;
    order?: number;
    fn: (...args: any[]) => F;
};
export declare enum HookType {
    create = "create",
    add = "add",
    modify = "modify",
    event = "event"
}
export type HookOpts<T> = {
    name: T;
    type?: HookType;
    initalValue?: any;
    args?: any;
    sync?: boolean;
};
export type IMethod<T extends any = any, R = any> = (...args: T extends Array<any> ? T : [T]) => R;
export type HookListType = Record<string, any>;
export declare class PluginService<HookList extends HookListType, HookMethods extends Record<string, IMethod> = any> {
    config?: PluginServiceOPtions;
    private hooks;
    private methods;
    private plugins;
    private extraPresets;
    private extraPlugins;
    constructor(config?: PluginServiceOPtions);
    initPresetsAndPlugins(config: PluginServiceOPtions): void;
    private resolvePresets;
    private resolvePlugins;
    private getApplyMethods;
    applyMethods<K extends Extract<keyof HookMethods, string>>(name: K, ...args: Parameters<HookMethods[K]> extends Array<any> ? Parameters<HookMethods[K]> : [Parameters<HookMethods[K]>]): ReturnType<HookMethods[K]>;
    private initPluginContext;
    private initPreset;
    private initPlugin;
    registerPlugin(plugin: IPlugin | IPreset): void;
    register(hook: IHook): void;
    registerMethod<K>(name: string, fn?: IMethod): void;
    applyPlugins<K extends Extract<keyof HookList, string> = Extract<keyof HookList, string>, T = HookList[K]>(inOpts: HookOpts<K> | K): Promise<Exclude<T, void> extends never ? void : T>;
    destroy(): void;
}
