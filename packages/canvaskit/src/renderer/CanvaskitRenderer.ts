
import { BaseRenderer } from 'src/base/BaseRenderer'
import { CK } from 'src/canvaskit'
import type  {CanvasKit} from 'src/canvaskit'
import { CanvaskitRendererOptions, CanvaskitRendererEvents } from 'src/types/Renderer'
import { DisplayObject } from 'src/scene/DisplayObject'
import { FillRule, IPaint, LineCap, LineJoin, PaintBorderSide, PaintStyle, PaintType, RenderObject } from 'src/core/Paint'
import { RenderListConfig } from 'src/core/Paint'
import { Matrix2D } from 'src/math'
import { ConicGradient, LinearGradient, RadialGradient } from 'src/core/Gradient'
import { DisposableManager } from 'src/core/Disposable'



const objTransformMatrix = new Float32Array(9)
const tmpMatrix = Matrix2D.identity()
export class CanvaskitRenderer extends BaseRenderer<CanvaskitRendererOptions, CanvaskitRendererEvents> {
    static CK: CanvasKit.CanvasKit = CK
    surface: CanvasKit.Surface
    canvas: CanvasKit.Canvas
    ck: CanvasKit.CanvasKit = CK
    private disposableManager = new DisposableManager()
    private _currentPath: CanvasKit.Path
    private _paint: CanvasKit.Paint
    private _globalAlpha = 1
    private _currentTransform: number[]
    private _stateStack: any[] = []
    constructor(options: CanvaskitRendererOptions) {
        super(options)
    }
    async initialize() {
        this.surface = CK.MakeWebGLCanvasSurface(this.domElment, CK.ColorSpace.SRGB)
        this.canvas = this.surface.getCanvas()
        this._currentPath = new CK.Path()
        this._paint = new CK.Paint()
        this._currentTransform = CK.Matrix.identity();
    }

    drawRect(x: number, y: number, width: number, height: number) {
        this._currentPath.addRect(CK.XYWHRect(x, y, width, height))
    }
    private getCKLineJoin(lineJoin: LineJoin) {
        switch (lineJoin) {
            case LineJoin.Miter:
                return CK.StrokeJoin.Miter
            case LineJoin.Round:
                return CK.StrokeJoin.Round
            case LineJoin.Bevel:
                return CK.StrokeJoin.Bevel
        }
    }
    private getCKLineCap(lineCap: LineCap) {
        switch (lineCap) {
            case LineCap.Butt:
                return CK.StrokeCap.Butt
            case LineCap.Round:
                return CK.StrokeCap.Round
            case LineCap.Square:
                return CK.StrokeCap.Square
        }
    }
    private getCKFillRule(fillRule: FillRule) {
        switch (fillRule) {
            case FillRule.NonZero:
                return CK.FillType.Winding
            case FillRule.EvenOdd:
                return CK.FillType.EvenOdd
            default:
                return CK.FillType.Winding
        }
    }

    createLinearGradient(x0: number, y0: number, x1: number, y1: number) {
        const gradient = new LinearGradient(x0, y0, x1, y1)
        this.disposableManager.addPersistent(gradient)
        return gradient
    }

    createRadialGradient(x0: number, y0: number,r0:number, x1: number, y1: number,r1:number) {
        const gradient = new RadialGradient(x0, y0,r0, x1, y1,r1)
        this.disposableManager.addPersistent(gradient)
        return gradient
    }
    createConicGradient(startAngle: number, x: number,y:number) {
        const gradient = new ConicGradient(startAngle,x,y)
        this.disposableManager.addPersistent(gradient)
        return gradient
    }
    applyPaint(ckPaint: CanvasKit.Paint, paint: IPaint, matrix?: Matrix2D) {
        const canvas = this.canvas

        if (paint.style === PaintStyle.Fill) {
            if (paint.type === PaintType.Color) {
                ckPaint.setStyle(CK.PaintStyle.Fill)
                ckPaint.setColor(paint.color)
            } else if (paint.type === PaintType.Gradient) {
                const shader = paint.gradient!.toCanvasKitGradient(this, matrix)
                ckPaint.setColor(CK.Color(0, 0, 0, this._globalAlpha));
                ckPaint.setShader(shader)
            } else if (paint.type === PaintType.Pattern) {
                // ctx.fillStyle=paint.pattern!.toCanvasPattern(ctx)
            }
        } else if (paint.style === PaintStyle.Stroke) {
            if (paint.type === PaintType.Color) {
                ckPaint.setStyle(CK.PaintStyle.Stroke)
                ckPaint.setColor(paint.color)
                //  ctx.strokeStyle=paint.color!.toCssRGB()
            } else if (paint.type === PaintType.Gradient) {
                //  ctx.strokeStyle=paint.gradient!.toCanvasGradient(ctx)
            } else if (paint.type === PaintType.Pattern) {
                //  ctx.strokeStyle=paint.pattern!.toCanvasPattern(ctx)
            }
            ckPaint.setStrokeWidth(paint.width!)
            ckPaint.setStrokeJoin(this.getCKLineJoin(paint.lineJoin!))
            ckPaint.setStrokeCap(this.getCKLineCap(paint.lineCap!))
            ckPaint.setStrokeMiter(paint.miterLimit!)

        }
    }

    setTransform(a:number, b:number, c:number, d:number, e:number, f:number) {
        this.resetTransform();
        this.transform(a, b, c, d, e, f);
      };
    transform(a: number, b: number, c: number, d: number, e: number, f: number) {
        const newTransform = [a, c, e,
            b, d, f,
            0, 0, 1];
        const inverted = CK.Matrix.invert(newTransform);
        this._currentPath.transform(inverted);// 让canvas totalMatrix不影响之前的路径
        this.canvas.concat(newTransform);
        this._currentTransform = this.canvas.getTotalMatrix();
    }

    resetTransform() {
        this._currentPath.transform(this._currentTransform);
        var inverted = CK.Matrix.invert(this._currentTransform);
        this.canvas.concat(inverted);
        this._currentTransform = this.canvas.getTotalMatrix();
    };
    beginPath() {
      //  this._currentPath.rewind();
        this._currentPath.dispose()
        this._currentPath = new CK.Path();
    }
    closePath() {
        this._currentPath.close();
    }
    save() {

        this._stateStack.push({
            paint: this._paint.copy(),
            ctm: this._currentTransform.slice(),
        })
        this.canvas.save()
    }
    restore() {

        const newState = this._stateStack.pop()
        if (!newState) {
            return;
        }
        const combined = CK.Matrix.multiply(
            this._currentTransform,
            CK.Matrix.invert(newState.ctm)
        );
        this._currentPath.transform(combined);
        this._paint.delete();
        this._paint = newState.paint;
        this.canvas.restore()
        this._currentTransform = this.canvas.getTotalMatrix()
    }
    startDraw(renderObject: RenderObject) {
        const object = renderObject.object
        this.save()
        this.beginPath()
        if (!object.matrix.hasIdentity()) {
            this.transform(object.matrix[0], object.matrix[1], object.matrix[2], object.matrix[3], object.matrix[4], object.matrix[5])
        }
      
    }
    draw(renderObject: RenderObject) {
        const { object, paints } = renderObject
        tmpMatrix.fromRowMajorOrderMatrix3x3(this._currentTransform)
        paints.forEach((paint) => {
            object.render(this)
            const tmpPaint = this._paint.clone()
            this.applyPaint(tmpPaint, paint)
            let fillRule = this.getCKFillRule(paint.fillRule!)
            //let prevFillType=this._path.getFillType()
            this._currentPath.setFillType(fillRule)
            if(paint.style===PaintStyle.Stroke){
                if(paint.borderSide===PaintBorderSide.Outside){
                    let outerPath=this._currentPath.copy()
                    let innerPath=this._currentPath.copy()
                    outerPath.stroke({
                        width:paint.width!*2,
                    })
                    //innerPath.offset(10,0)
                   // outerPath.op(innerPath,CK.PathOp.Difference)
                    this._currentPath.dispose()
                    innerPath.dispose()
                    this._currentPath=outerPath
                    this.canvas.clipPath(this._currentPath,CK.ClipOp.Intersect,true)
                    
                }else if(paint.borderSide===PaintBorderSide.Inside){
                    let outerPath=this._currentPath.copy()
                    let innerPath=this._currentPath.copy()
                    outerPath.stroke({
                        width:paint.width!*2,
                    })
                    innerPath.op(outerPath,CK.PathOp.Difference)
                    this._currentPath.dispose()
                    outerPath.dispose()
                    this._currentPath=innerPath
                }
            }
            this.canvas.drawPath(this._currentPath, tmpPaint)
            tmpPaint.dispose()
        })

    }
    endDraw(renderObject: RenderObject) {
        this.restore()
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
    dispose() {
        this.disposableManager.destroy()
        this._paint.delete()
        this._currentPath.delete()
    }
}