
export type RendererOptions={
    canvas:HTMLCanvasElement
    dpr?:number
    width?:number
    height?:number
}
export interface IRenderer<Options extends RendererOptions>{
    options:Options
    rendererService:IRendererService<Options>
    setSize(width:number,height:number):void
    render():void
}

export interface IRendererService<Options extends RendererOptions>{
    renderer:IRenderer<Options>
}