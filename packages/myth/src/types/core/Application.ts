import type { BaseRendererOptions,IBaseRenderer } from "./BaseRenderer";
import { IPlugin } from "./Plugin";
import type {AsyncSeriesBailHook} from '@dxyl/tapable'

export interface IApplication{
    hooks:ApplicationHooks
    options:ApplicationOptions
}
export interface ApplicationHooks{
    renderer:AsyncSeriesBailHook<[app:IApplication],IBaseRenderer>
}

export interface ApplicationOptions extends Partial<BaseRendererOptions>{
    canvas:HTMLCanvasElement
    plugins:IPlugin<IApplication>[]
}