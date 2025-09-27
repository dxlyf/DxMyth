
import { BaseRenderer } from 'src/base/BaseRenderer'
import {CK} from 'src/canvaskit'
import type * as CanvasKit from 'src/canvaskit'
import { RendererOptions,IRendererService } from 'src/interface/Renderer'
import {CanvaskitRendererService} from './RendererService'
export interface CanvaskitRendererOptions extends RendererOptions{

}
export class CanvaskitRenderer extends BaseRenderer<CanvaskitRendererOptions>  {
    surface: CanvasKit.Surface
    canvas:CanvasKit.Canvas
    rendererService:CanvaskitRendererService
    constructor(options:CanvaskitRendererOptions) {
        super(options)
        this.surface=CK.MakeWebGLCanvasSurface(this.domElment,CK.ColorSpace.SRGB)
        this.canvas=this.surface.getCanvas()
        this.rendererService=new CanvaskitRendererService(this)
    }
    render(): void {
        throw new Error('Method not implemented.')
    }

}