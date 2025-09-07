import { Path2D } from "skia-path2d";
import { BaseRenderer } from "src/core/BaseRenderer";
import { Color } from "src/image/Color";
import { BaseRendererOptions, RenderOptions } from "src/types/core/BaseRenderer";
import { IPaint, PaintStyle, PaintType } from "src/types/core/Paint";
import { IDisplayObject } from "src/types/core/DisplayObject";


export class WebglRenderer extends BaseRenderer<WebGL2RenderingContext>{
    renderMode='canvas'
    constructor(options:Partial<BaseRendererOptions>){
        super(options)
        this.initProgram()
    }
    initProgram(){
       
    }
    createContext(): WebGL2RenderingContext {
        return this.canvas.getContext('webgl2')!;
    }
    drawPath(path: Path2D): void {
       
    }
    drawRect(x: number, y: number, w: number, h: number): void {
      
    }
    drawImage(image: CanvasImageSource, dx: number, dy: number): void;
    drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: CanvasImageSource, ...args:any[]): void {
       
    }
    drawPaint(paint:IPaint){
        this.applyPaint(paint)
        switch(paint.style){
            case PaintStyle.Fill:
                //this.ctx.fill(paint.fillRule)
                break;
            case PaintStyle.Stroke:
              //  this.ctx.stroke()
                break;
        }
    }
    applyPaint(paint:IPaint){
        const ctx=this.ctx
        if(paint.style===PaintStyle.Fill){
            if(paint.type===PaintType.Color){
                ctx.fillStyle=paint.color!.toCssRGB()
            }else if(paint.type===PaintType.Gradient){
                ctx.fillStyle=paint.gradient!.toCanvasGradient(ctx)
            }else if(paint.type===PaintType.Pattern){
                ctx.fillStyle=paint.pattern!.toCanvasPattern(ctx)
            }
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
            object.render(this,renderObject)
            ctx.restore()
        })
        ctx.restore()
      //  resetCanvasDefaultStyle(ctx)
    }
}