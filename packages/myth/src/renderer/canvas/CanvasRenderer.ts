import { ProxyPath2D } from "skia-path2d";
import { BaseRenderer } from "src/core/BaseRenderer";
import { getRendertList } from "src/core/Paint";
import { Color } from "src/image/Color";
import { BaseRendererOptions, RenderOptions } from "src/types/core/BaseRenderer";
import { IPaint, PaintStyle, PaintType } from "src/types/core/Paint";
import { resetCanvasDefaultStyle } from "./utils";
import { Viewport } from "src/core/Viewport";
import { IDisplayObject } from "src/types/core/DisplayObject";


const currentViewport=new Viewport();
export class CanvasRenderer extends BaseRenderer<CanvasRenderingContext2D,{}>{
    renderMode='canvas'
    constructor(options:Partial<BaseRendererOptions>){
        super(options)
    }
    createContext(): CanvasRenderingContext2D {
        return this.canvas.getContext('2d')!;
    }
    drawPath(path: ProxyPath2D): void {
        throw new Error("Method not implemented.");
    }
    drawRect(x: number, y: number, w: number, h: number): void {
        this.ctx.rect(x,y,w,h)
    }
    applyPaint(obj:IDisplayObject,paint:IPaint){
        const ctx=this.ctx
       
        if(paint.style===PaintStyle.Fill){
            if(paint.type===PaintType.Color){
                ctx.fillStyle=paint.color!.toCssRGB()
            }else if(paint.type===PaintType.Gradient){
                ctx.fillStyle=paint.gradient!.toCanvasGradient(ctx)
            }else if(paint.type===PaintType.Pattern){
                ctx.fillStyle=paint.pattern!.toCanvasPattern(ctx)
            }
            ctx.fill(paint.fillRule)
        }else if(paint.style===PaintStyle.Stroke){
            if(paint.type===PaintType.Color){
                ctx.strokeStyle=paint.color!.toCssRGB()
            }else if(paint.type===PaintType.Gradient){
                ctx.strokeStyle=paint.gradient!.toCanvasGradient(ctx)
            }else if(paint.type===PaintType.Pattern){
                ctx.strokeStyle=paint.pattern!.toCanvasPattern(ctx)
            }
            ctx.lineJoin=paint.lineJoin!
            ctx.lineCap=paint.lineCap!
            ctx.lineWidth=paint.width!
            ctx.miterLimit=paint.miterLimit!
            ctx.stroke()
        }
    }
    render(renderOptions:RenderOptions){
        const {renderObjects}=renderOptions

        const ctx=this.ctx
        if(this.options.backgroundColor){
            let color=Color.parse(this.options.backgroundColor)
            let oldFillStyle=  ctx.fillStyle
            ctx.fillStyle=color.toCssRGB()
            ctx.fillRect(0,0,this.pixelWidth,this.pixelHeight)
            ctx.fillStyle=oldFillStyle
        }else{
            ctx.clearRect(0,0,this.pixelWidth,this.pixelHeight)
        }
        ctx.save()
        ctx.scale(this.dpr,this.dpr)
        renderObjects.forEach(renderObject=>{
            const {object,paints}=renderObject
            const matrix=object.worldMatrix
            ctx.save()
            ctx.beginPath()
            ctx.transform(matrix.a,matrix.b,matrix.c,matrix.d,matrix.e,matrix.f)
            object.render(this)
            paints.forEach(paint=>{
                this.applyPaint(object,paint)
            })
            //resetCanvasDefaultStyle(ctx)
            ctx.restore()
        })
        ctx.restore()
      //  resetCanvasDefaultStyle(ctx)
    }
}