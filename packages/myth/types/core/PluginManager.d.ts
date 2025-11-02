import { IPluginManager, IPlugin, PluginConstructor, PluginManagerEvents, PluginCallNames } from '../../../../../../../../src/types/core/Plugin.ts';
import { EventEmitter4 } from '@dxyl/utils';
export declare class Plugin<Context> implements IPlugin<Context> {
    name: string;
    ctx: Context;
    owner: IPluginManager<Context>;
    constructor(ctx: Context, owner: IPluginManager<Context>);
    create(): void;
    init(): void;
    destroy?(): void;
}
export declare class PluginManager<Context> extends EventEmitter4<PluginManagerEvents<Context>> implements IPluginManager<Context> {
    plugins: Map<string, PluginConstructor<Context>>;
    installPluginList: Map<string, IPlugin<Context>>;
    ctx: Context;
    constructor(ctx: Context, plugins?: PluginConstructor<Context>[]);
    addPlugins(plugins: PluginConstructor<Context>[]): void;
    callPluginHook(name: Exclude<PluginCallNames, 'create'>): void;
    install(): void;
    uninstall(): void;
    clear(): void;
}
