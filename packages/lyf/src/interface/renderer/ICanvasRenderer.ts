export type CanvasRendererOptions = {
    canvas: HTMLCanvasElement
    width?: number
    height?: number
    dpr?: number
    resizeTo?: ResizeTo
}
export const CANVAS_RENDERER_EVENTS={
    RESIZE:'resize',
    DISPOSE:'dispose',
}  as const
export type CanvasRendererEventMap={
    [CANVAS_RENDERER_EVENTS.RESIZE]:[width:number,height:number]
    [CANVAS_RENDERER_EVENTS.DISPOSE]:[]

}