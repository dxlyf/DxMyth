import { Ticker } from "src/ticker";
import type { BaseRendererOptions,IBaseRenderer } from "./BaseRenderer";
import { IContainer } from "./Container";
import { IElement } from "./Element";
import { PluginConstructor } from "./Plugin";
import type {AsyncSeriesBailHook} from '@dxyl/tapable'
import { EventEmitter } from "src/events";
import { InteractivePointerEvents } from "../events/InteractivePointerEvent";
import * as opentype from '@dxyl/utils/opentype'
export type ApplicationEvents={
   update:[deltaTime:number]
}&InteractivePointerEvents
export interface IApplication extends EventEmitter<ApplicationEvents>{
    hooks:ApplicationHooks
    options:ApplicationOptions
    renderer:IBaseRenderer
    container:IContainer<any>
    ticker:Ticker
    readonly domElement:HTMLCanvasElement
    add(el:IElement<any>):void
    remove(el:IElement<any>):void
    render():void
    refresh():void
}
export interface ApplicationHooks{
    renderer:AsyncSeriesBailHook<[app:IApplication],IBaseRenderer>
    fonts:AsyncSeriesBailHook<[],Record<string,opentype.Font>>
}

export interface ApplicationOptions extends BaseRendererOptions{
    plugins?:PluginConstructor<IApplication>[]
}