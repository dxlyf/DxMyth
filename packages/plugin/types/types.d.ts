export declare enum AppplyPluginHookType {
    modify = "modify",
    add = "add",
    event = "event"
}
export type PluginType = 'plugin' | 'preset';
export type PluginOrder = 'pre' | 'post' | 'normal';
export type IPlugin<T = any> = {
    id: string;
    order?: PluginOrder;
    opts?: T;
    handle: (api: IPluginContextProxy, opts: T) => void;
};
export type IPreset<T = any> = Omit<IPlugin<T>, 'handle'> & {
    handle: (api: IPluginContextProxy, opts: T) => ({
        presets?: IPreset[];
        plugins?: IPlugin[];
    });
};
export type IPluginContextProxy = IPluginContext & {
    [Key: string]: (...args: any[]) => void;
};
export type IHook = {
    name: string;
    opts?: any;
    pluginId?: string;
    stage?: number;
    handle: <T = any>(...args: any) => Promise<T> | T;
};
export type IMethod = (...args: any[]) => void;
export type ICommand = {
    name: string;
    handle: <T = any>(config: any) => Promise<T>;
};
export type PluginServiceConfig = {
    cwd?: string;
    plugins?: IPlugin[];
    presets?: IPreset[];
    resolvePresetsOrPlugins?(pluginOrPreset: IPlugin): IPlugin;
    getConfig?(...args: any[]): any;
};
export type ApplyPluginOption = {
    name: string;
    type?: AppplyPluginHookType;
    initalValue?: any;
    args?: any;
    sync?: boolean;
};
export type IPluginService<Config extends Record<string, any> = {}> = {
    config: PluginServiceConfig & Config;
    hooks: Map<string, IHook[]>;
    methods: Map<string, IMethod[]>;
    commands: Map<string, ICommand>;
    registerPlugin(plugin: IPlugin): void;
    registerPreset(preset: IPreset): void;
    applyPlugins<T = any>(opts: ApplyPluginOption): Promise<T>;
    run<T = any>(command: string, args: any): Promise<void>;
};
export type IPluginContext = {
    id: string;
    opts: any;
    service: IPluginService;
    register(hook: IHook): void;
    registerMethod(name: string, fn?: IMethod): void;
    registerCommand(comand: ICommand): void;
};
