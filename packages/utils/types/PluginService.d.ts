export type PluginObject = {};
export type PluginServiceOPtions = {
    plugins?: IPlugin[];
    presets?: IPreset[];
};
export type PluginContext = {
    pluginName: string;
    register(hook: IHook): void;
    registerMethod(name: string, fn?: IMethod): void;
};
export type IPlugin = {
    name: string;
    config?: any;
    apply: (api: PluginContext, config?: any) => void;
};
export type IPreset = Omit<IPlugin, 'apply'> & {
    apply: (api: PluginContext, config?: any) => ({
        presets?: IPreset[];
        plugins?: IPlugin[];
    });
};
export type IHook = {
    name: string;
    order?: number;
    fn: Function;
};
export declare enum HookType {
    create = "create",
    add = "add",
    modify = "modify",
    event = "event"
}
export type HookOpts = {
    name: string;
    type?: HookType;
    initalValue?: any;
    args?: any;
    sync?: boolean;
};
export type IMethod = (...args: any[]) => void;
export declare class PluginService {
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
    private applyMethods;
    private initPluginContext;
    private initPreset;
    private initPlugin;
    registerPlugin(plugin: IPlugin | IPreset): void;
    register(hook: IHook): void;
    registerMethod(name: string, fn?: IMethod): void;
    applyPlugins<T = any>(opts: HookOpts): Promise<T | void>;
    destroy(): void;
}
