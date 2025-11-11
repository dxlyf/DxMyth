
import { BaseRenderer } from 'src/base/BaseRenderer'
import { CK } from 'src/canvaskit'
import type { CanvasKit } from 'src/canvaskit'
import { CanvaskitRendererOptions, CanvaskitRendererEvents,PaintBrushStyle } from 'src/types/Renderer'
import { DisplayObject } from 'src/scene/DisplayObject'
import { Matrix2D } from 'src/math'
import { ConicGradient, LinearGradient, RadialGradient } from 'src/core/Gradient'
import { DisposableManager } from 'src/core/Disposable'
import { Container } from 'src/scene/Container'
import { Color } from 'src/math/Color'
import { Gradient } from "src/core/Gradient";
import { Pattern } from "src/core/Pattern";
import { PaintStyle, PaintMode, BorderSide, BorderStyle, LineJoin, LineCap, FillRule, TextAlign, TextBaseline, TextRendering, FontStretch, FontVariant, FontKerning } from "src/enum";



const objTransformMatrix = new Float32Array(9)
const tmpMatrix = Matrix2D.identity()
const isValidValue = (value: any) => {
    return !(value === null || value === undefined || value === 'none')
}
const defaultPaintBrushStyle: PaintBrushStyle = {
    type: PaintStyle.Fill,
    mode: PaintMode.Color,
    opacity: 1,
    color: Color.WHITE,
    gradient: null,
    pattern: null,
    miterLimit: 10,
    lineJoin: LineJoin.Miter,
    lineCap: LineCap.Butt,
    lineWidth: 1,
    borderSide: BorderSide.Middle,
    borderStyle: BorderStyle.Solid,
    dash: null,
    lineDashOffset: 0,
    shadowColor: null,
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    fillRule: FillRule.NonZero,
    fontSize: 12,
    fontFamily: 'sans-serif',
    fontStretch: FontStretch.Normal,
    fontVariant: FontVariant.Normal,
    fontKerning: FontKerning.Auto,
    textRendering: TextRendering.Auto,
    textAlign: TextAlign.Start,
    textBaseline: TextBaseline.Alphabetic,
}

export class CanvaskitRenderer extends BaseRenderer<CanvaskitRendererOptions, CanvaskitRendererEvents> {
    static CK: CanvasKit.CanvasKit = CK
    surface: CanvasKit.Surface
    canvas: CanvasKit.Canvas
    ck: CanvasKit.CanvasKit = CK
    private disposableManager = new DisposableManager()
    public _currentPath: CanvasKit.Path
     public _paint: CanvasKit.Paint
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
    getCKLineJoin(lineJoin: LineJoin) {
        switch (lineJoin) {
            case LineJoin.Miter:
                return CK.StrokeJoin.Miter
            case LineJoin.Round:
                return CK.StrokeJoin.Round
            case LineJoin.Bevel:
                return CK.StrokeJoin.Bevel
        }
    }
    getCKLineCap(lineCap: LineCap) {
        switch (lineCap) {
            case LineCap.Butt:
                return CK.StrokeCap.Butt
            case LineCap.Round:
                return CK.StrokeCap.Round
            case LineCap.Square:
                return CK.StrokeCap.Square
        }
    }
    getCKFillRule(fillRule: FillRule) {
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

    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number) {
        const gradient = new RadialGradient(x0, y0, r0, x1, y1, r1)
        this.disposableManager.addPersistent(gradient)
        return gradient
    }
    createConicGradient(startAngle: number, x: number, y: number) {
        const gradient = new ConicGradient(startAngle, x, y)
        this.disposableManager.addPersistent(gradient)
        return gradient
    }
    setTransform(a: number, b: number, c: number, d: number, e: number, f: number) {
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
    clip(path?: CanvasKit.Path | FillRule, fillRule?: FillRule) {
        if (typeof path === 'string') {
            fillRule = path as FillRule
            path = this._currentPath
        }
        if (!fillRule) {
            fillRule = FillRule.NonZero
        }
        if (!path) {
            path = this._currentPath
        }
        let clip = path.copy()
        if (fillRule === FillRule.EvenOdd) {
            clip.setFillType(CK.FillType.EvenOdd)
        } else {
            clip.setFillType(CK.FillType.Winding)
        }
        this.canvas.clipPath(clip, CK.ClipOp.Intersect, true)
        clip.dispose()
    }
    setStrokeWidth(width: number) {
        this._paint.setStrokeWidth(width)
    }
    setFillRule(fillRule: FillRule) {
        this._paint.setStyle(this.getCKFillRule(fillRule))
    }
    setLineJoin(lineJoin: LineJoin) {
        this._paint.setStrokeJoin(this.getCKLineJoin(lineJoin))
    }
    setLineCap(lineCap: LineCap) {
        this._paint.setStrokeCap(this.getCKLineCap(lineCap))
    }
    setColor(color: Color) {
        this._paint.setColor(color)
    }
    fill(path?: CanvasKit.Path | FillRule, fillRule?: FillRule) {
        if (typeof path === 'string') {
            fillRule = path as FillRule
            path = this._currentPath
        }
        if (!path) {
            path = this._currentPath
        }
        if (!fillRule) {
            fillRule = FillRule.NonZero
        }
        const paint = this._paint.copy()
        paint.setStyle(CK.PaintStyle.Fill)
        if (fillRule === FillRule.EvenOdd) {
            path.setFillType(CK.FillType.EvenOdd)
        } else {
            path.setFillType(CK.FillType.Winding)
        }
        this.canvas.drawPath(this._currentPath, paint)
        paint.dispose()
    }
    stroke(path?: CanvasKit.Path) {
        if (!path) {
            path = this._currentPath
        }
        const paint = this._paint.copy()
        paint.setStyle(CK.PaintStyle.Stroke)
        this.canvas.drawPath(this._currentPath, this._paint)
        paint.dispose()
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
    renderObject(object: DisplayObject) {
        this.save()
        this.beginPath()
        if (!object.matrix.hasIdentity()) {
            this.transform(object.matrix[0], object.matrix[1], object.matrix[2], object.matrix[3], object.matrix[4], object.matrix[5])
        }
        tmpMatrix.fromRowMajorOrderMatrix3x3(this._currentTransform)
        object.render(this)
        this.restore()

    }

    render({ container, delta }: { container: Container, delta: number }): void {
        const viewport = this.viewport
        const renderList = container.updateRenderList({ viewport, delta })

        const canvas = this.canvas

        canvas.clear(CK.Color4f(0, 0, 0, 1))
        canvas.save()
        canvas.scale(this.dpr, this.dpr)

        renderList.forEach((object) => {
            if (object.shouldRender()) {
                this.renderObject(object)
            }
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