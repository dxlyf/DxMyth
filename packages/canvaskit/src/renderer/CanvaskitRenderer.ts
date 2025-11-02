
import { BaseRenderer } from 'src/base/BaseRenderer'
import { CK, getCanvasKit } from 'src/canvaskit'
import type * as CanvasKit from 'src/canvaskit'
import { IDisplayObject } from 'src/interface/DisplayObject'
import { INode } from 'src/interface/Node'
import { CanvaskitRendererOptions,CanvaskitRendererEvents, ICanvaskitRenderer } from 'src/interface/Renderer'
import { Container } from 'src/scene/Container'
import { DisplayObject } from 'src/scene/DisplayObject'


export class CanvaskitRenderer extends BaseRenderer<CanvaskitRendererOptions,CanvaskitRendererEvents> implements ICanvaskitRenderer{
    surface: CanvasKit.Surface
    canvas: CanvasKit.Canvas
    ck: CanvasKit.CanvasKit
    container:Container=new Container()
    _path: CanvasKit.Path
    _paint: CanvasKit.Paint
    constructor(options: CanvaskitRendererOptions) {
        super(options)
    }
    async initialize() {
        await getCanvasKit()
        this.surface = CK.MakeWebGLCanvasSurface(this.domElment, CK.ColorSpace.SRGB)
        this.canvas = this.surface.getCanvas()
        this._path=new CK.Path()
        this._paint=new CK.Paint()
    }
    drawPath(path: CanvasKit.Path, paint: CanvasKit.Paint) {
        this.canvas.drawPath(path, paint)
    }
    drawCircle(cx: number, cy: number, radius: number, paint: CanvasKit.Paint) {
        this.canvas.drawCircle(cx, cy, radius, paint)
    }
    drawArc(val: CanvasKit.InputRect, startAngle: CanvasKit.AngleInDegrees, sweepAngle: CanvasKit.AngleInDegrees, useCenter: boolean, paint: CanvasKit.Paint) {
        this.canvas.drawArc(val, startAngle, sweepAngle, useCenter, paint)
    }
    drawRect(left: number, top: number, width: number, height: number, paint: CanvasKit.Paint) {
        this.canvas.drawRect4f(left, top, left + width, top + height, paint)
    }
    drawText(text: string, x: number, y: number, paint: CanvasKit.Paint, font: CanvasKit.Font) {
        this.canvas.drawText(text, x, y, paint, font)
    }
    drawImage(img: CanvasKit.Image, left: number, top: number, paint?: CanvasKit.Paint | null) {
        this.canvas.drawImage(img, left, top, paint)
    }
    add(node:INode){
        this.container.add(node)
    }
    remove(node:INode){
        this.container.remove(node)
    }


    drawObject(obj:IDisplayObject){
        const worldMatrix=obj.worldMatrix
        const canvas=this.canvas
        const path=this._path
        const paint=this._paint
        
        canvas.drawPath(path,paint)
    }
    render(): void {

        const effectFlag=this.container.getAllEffectFlag()
        const renderList=this.container.getPendingRenderList()
        const canvas=this.canvas

        canvas.clear(CK.Color4f(0, 0, 0, 1))
        canvas.save()
        canvas.scale(this.dpr, this.dpr)
        
        for(let i=0;i<renderList.length;i++){
            this.drawObject(renderList[i])
        }
        canvas.restore()
        this.surface.flush()
    }

}