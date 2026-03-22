export type SvgRendererOptions = {
    canvas: SVGElement
    width?: number
    height?: number
    dpr?: number
    resizeTo?: ResizeTo
}
export const SVG_RENDERER_EVENTS={
    RESIZE:'resize',
    DISPOSE:'dispose',
}  as const
export type SvgRendererEventMap={
    [SVG_RENDERER_EVENTS.RESIZE]:[width:number,height:number]
    [SVG_RENDERER_EVENTS.DISPOSE]:[]

}