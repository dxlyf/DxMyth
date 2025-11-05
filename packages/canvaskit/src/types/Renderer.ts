import type * as CanvasKit from 'src/canvaskit'
export type RendererOptions={
    canvas:HTMLCanvasElement
    dpr?:number // 设备像素比
    width?:number
    height?:number
}
export interface RendererEvents{
    resize:[width:number,height:number]
}
export type CanvaskitRendererOptions=RendererOptions & {

}
export interface CanvaskitRendererEvents extends RendererEvents{
    mousedown:[e:any]
}

