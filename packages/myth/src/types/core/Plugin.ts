
import type {EventEmitter4} from '@dxyl/utils'

type FunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
export type PluginCallNames = FunctionPropertyNames<Required<IPlugin<any>>>;

export type PluginManagerEvents<Context>={
    'install':[ctx:Context],
    'uninstall':[ctx:Context]
}
export interface  IPluginManager<Context> extends EventEmitter4<PluginManagerEvents<Context>>{
    ctx:Context
    install():void
    uninstall():void
}

export interface IPlugin<Context>{
     name:string;
     ctx:Context
     owner:IPluginManager<Context>
     create?():void
     init?():void
     destroy?():void
}

