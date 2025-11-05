
import { BaseRenderer } from 'src/base/BaseRenderer'
import { CK, getCanvasKit } from 'src/canvaskit'
import type * as CanvasKit from 'src/canvaskit'
import { CanvaskitRendererOptions, CanvaskitRendererEvents } from 'src/types/Renderer'
import { DisplayObject } from 'src/scene/DisplayObject'
import { IPaint, PaintStyle, PaintType, RenderObject } from 'src/core/Paint'
import { RenderListConfig } from 'src/core/Paint'



const objTransformMatrix= new Float32Array(9)
export class CanvaskitRenderer extends BaseRenderer<CanvaskitRendererOptions, CanvaskitRendererEvents> {
    surface: CanvasKit.Surface
    canvas: CanvasKit.Canvas
    ck: CanvasKit.CanvasKit
    _path: CanvasKit.Path
    _paint: CanvasKit.Paint
    _currentRenderObject: RenderObject
    constructor(options: CanvaskitRendererOptions) {
        super(options)
    }
    async initialize() {
        await getCanvasKit()
        this.surface = CK.MakeWebGLCanvasSurface(this.domElment, CK.ColorSpace.SRGB)
        this.canvas = this.surface.getCanvas()
        this._path = new CK.Path()
        this._paint = new CK.Paint()
    }

    drawRect(x: number, y: number, width: number, height: number) {
        this._path.reset()
        this._path.addRect(CK.XYWHRect(x, y, width, height))
    }
    applyPaint(ckPaint: CanvasKit.Paint, paint: IPaint) {
        const canvas = this.canvas
        if (paint.style === PaintStyle.Fill) {
            if (paint.type === PaintType.Color) {
                ckPaint.setStyle(CK.PaintStyle.Fill)
                ckPaint.setColor(paint.color.toCKColor())
            } else if (paint.type === PaintType.Gradient) {
                // ctx.fillStyle=paint.gradient!.toCanvasGradient(ctx)
            } else if (paint.type === PaintType.Pattern) {
                // ctx.fillStyle=paint.pattern!.toCanvasPattern(ctx)
            }
        } else if (paint.style === PaintStyle.Stroke) {
            if (paint.type === PaintType.Color) {
                ckPaint.setStyle(CK.PaintStyle.Stroke)
                ckPaint.setColor(paint.color.toCKColor())
                //  ctx.strokeStyle=paint.color!.toCssRGB()
            } else if (paint.type === PaintType.Gradient) {
                //  ctx.strokeStyle=paint.gradient!.toCanvasGradient(ctx)
            } else if (paint.type === PaintType.Pattern) {
                //  ctx.strokeStyle=paint.pattern!.toCanvasPattern(ctx)
            }
            //  ckPaint.setStrokeJoin(CK.StrokeJoin.Miter)
            // ctx.lineJoin=paint.lineJoin!
            // ctx.lineCap=paint.lineCap!
            // ctx.lineWidth=paint.width!
            // ctx.miterLimit=paint.miterLimit!
        }
    }
    startDraw(renderObject: RenderObject) {
        const object=renderObject.object
        this._currentRenderObject = renderObject
        this.canvas.save()
        if(!object.matrix.hasIdentity()){
           this.canvas.concat(object.matrix.toRowMajorOrderMatrix3x3(objTransformMatrix))
        }
    }
    draw(renderObject: RenderObject) {
        const { object, paints } = renderObject
        paints.forEach((paint) => {
            object.render(this)
            const tmpPaint = new CK.Paint()
            this.applyPaint(tmpPaint, paint)
            this.canvas.drawPath(this._path, tmpPaint)
            tmpPaint.delete()
        })

    }
    endDraw(renderObject: RenderObject) {
        this._path.reset()
        this.canvas.restore()
        this._currentRenderObject = null
    }
    render(renderObjects: RenderObject[]): void {
        const viewport = this.viewport
        const canvas = this.canvas
        canvas.clear(CK.Color4f(0, 0, 0, 1))
        canvas.save()
        canvas.scale(this.dpr, this.dpr)
        renderObjects.forEach((renderObject) => {
            this.startDraw(renderObject)
            this.draw(renderObject)
            this.endDraw(renderObject)
        })
        canvas.restore()
        this.surface.flush()
    }

}