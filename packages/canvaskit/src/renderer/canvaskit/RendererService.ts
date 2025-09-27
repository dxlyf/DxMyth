import { IRendererService } from "src/interface/Renderer";
import type * as CanvasKit from 'src/canvaskit'
import type {CanvaskitRenderer,CanvaskitRendererOptions} from './Renderer'

export class CanvaskitRendererService implements IRendererService<CanvaskitRendererOptions>{
    renderer:CanvaskitRenderer
    constructor(renderer:CanvaskitRenderer){
        this.renderer=renderer
    }
    get surface(){
        return this.renderer.surface
    }
    get canvas(){
        return this.renderer.canvas
    }
    drawPath(path:CanvasKit.Path,paint:CanvasKit.Paint){
        this.canvas.drawPath(path,paint)
    }
    drawCircle(cx: number, cy: number, radius: number, paint: CanvasKit.Paint){
        this.canvas.drawCircle(cx,cy,radius,paint)
    }
    drawArc(val: CanvasKit.InputRect, startAngle: CanvasKit.AngleInDegrees, sweepAngle: CanvasKit.AngleInDegrees,
                useCenter: boolean, paint: CanvasKit.Paint){
        this.canvas.drawArc(val,startAngle,sweepAngle,useCenter,paint)
    }
    drawRect(left: number, top: number, width: number, height: number, paint: CanvasKit.Paint){
        this.canvas.drawRect4f(left,top,left+width,top+height,paint)
    }
    drawText(text:string,x:number,y:number,paint: CanvasKit.Paint, font: CanvasKit.Font){
        this.canvas.drawText(text,x,y,paint,font)
    }
    drawImage(img: CanvasKit.Image, left: number, top: number, paint?: CanvasKit.Paint | null){
        this.canvas.drawImage(img,left,top,paint)
    }
}