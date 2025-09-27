import { IPluginContext, IPluginService, IPlugin, ICommand, IHook, IMethod } from './types';
export declare class PluginContext<Config extends Record<string, any> = {}> implements IPluginContext {
    id: string;
    opts: any;
    service: IPluginService<Config>;
    constructor(service: IPluginService<Config>, plugin: IPlugin);
    register(hook: IHook): void;
    registerMethod(name: string, fn?: IMethod): void;
    registerCommand(command: ICommand): void;
}
