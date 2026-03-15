
import { IRenderer } from "./IRenderer"
import type {IPlugin} from './IPlugin'
import { IEventEmitter } from "./IEventEmitter"

export const LYF_EVENTS={
    BEFORE_INIT:'beforeInit',
    INIT:'init',
    DISPOSE:'dispose'
}
export type LyfEventMap={
    [LYF_EVENTS.BEFORE_INIT]:[instance:ILyf]
    [LYF_EVENTS.INIT]:[instance:ILyf]
    [LYF_EVENTS.DISPOSE]:[instance:ILyf]
}

export type LyfConfig={
    canvas?:HTMLCanvasElement
    width?:number
    height?:number
    dpr?:number
    plugins?:IPlugin[]
    rendererType?:string
}

export interface ILyf extends IEventEmitter<LyfEventMap>{
    config:LyfConfig
    setRenderer(type:string,renderer:IRenderer):void
    addInitTask(task:Promise<void>):void
    initialize:(config: LyfConfig)=>Promise<void>
    dispose:()=>void
}