
import { BaseRenderer } from 'src/base/BaseRenderer'
import { CK } from 'src/canvaskit'
import { CanvasKit } from 'src/canvaskit'
import { CanvaskitRendererOptions, CanvaskitRendererEvents, FillStrokeValue, FillStrokeObject, CanvasDrawStyle } from 'src/types/Renderer'
import { DisplayObject } from 'src/scene/DisplayObject'
import { Matrix2D } from 'src/math'
import { ConicGradient, LinearGradient, RadialGradient } from 'src/core/Gradient'
import { DisposableManager } from 'src/core/Disposable'
import { Container } from 'src/scene/Container'
import { Color } from 'src/math/Color'
import { Gradient } from "src/core/Gradient";
import { Pattern, PatternRepeat } from "src/core/Pattern";
import { PaintStyle, PaintMode, BorderSide, BorderStyle, LineJoin, LineCap, FillRule, TextAlign, TextBaseline, TextRendering, FontStretch, FontVariant, FontKerning, GlobalCompositeOperation, ClipPathUnits } from "src/enum";
import { getTypeface } from 'src/canvaskit/htmlcanvas/font'
import { Image } from 'src/core/Image'
import { allAreFinite } from 'src/canvaskit/htmlcanvas/util'
import {arc,ellipse,arcTo,rect,roundRect,lineTo,moveTo,quadraticCurveTo,bezierCurveTo, Path2D} from 'src/canvaskit/htmlcanvas/path2d'
import { hasOwnProperty, isNullOrUndefined, isValidPaintValue } from 'src/utils'
import { NodeEffectFlags } from 'src/consts'
import { DrawStylePropertiesMap, DrawStylePropertiesSet, HasDrawStylePropertiesMap } from 'src/consts/CanvasDrawStyle'


const objTransformMatrix = new Float32Array(9)
const tmpMatrix = Matrix2D.identity()

export class CanvaskitRenderer extends BaseRenderer<CanvaskitRendererOptions, CanvaskitRendererEvents> {
    static CK: CanvasKit.CanvasKit = CK
    surface: CanvasKit.Surface
    canvas: CanvasKit.Canvas
    ck: CanvasKit.CanvasKit = CK
    private disposableManager = new DisposableManager()
    public _currentPath: CanvasKit.Path
    public _paint: CanvasKit.Paint
    private _currentTransform: number[]
    private _stateStack: any[] = []
    // contextState
    public globalAlpha = 1
    private _globalCompositeOperation: CanvasKit.BlendMode
    private _strokeWidth = 1
    private _miterLimit = 10
    // private _strokeJoin:CanvasKit.StrokeJoin
    // private _strokeCap:CanvasKit.StrokeCap
    private _lineDash: number[] = []
    private _lineDashOffset = 0
    private _fillStyle: FillStrokeObject=Color.BLACK
    private _strokeStyle: FillStrokeObject=Color.BLACK
    public shadowColor: Color =null
    public shadowBlur: number = 0
    public shadowOffsetX: number = 0
    public shadowOffsetY: number = 0
    // font 
    private _font: CanvasKit.Font
    private _fontString: string = '12px monospace'
    constructor(options: CanvaskitRendererOptions) {
        super(options)
    }
    async initialize() {
        this.surface = CK.MakeWebGLCanvasSurface(this.domElment, CK.ColorSpace.SRGB)
        this.canvas = this.surface.getCanvas()
        this._currentPath = new CK.Path()
        this._paint = new CK.Paint()
        // font
        this._font = new CK.Font(CK.Typeface.GetDefault(), 12)
        this._font.setSubpixel(true);

        this._currentTransform = CK.Matrix.identity();
        this._globalCompositeOperation = CK.BlendMode.SrcOver
        this._paint.setBlendMode(this._globalCompositeOperation)
        this._paint.setStrokeWidth(this._strokeWidth)

    }

    set globalCompositeOperation(value: GlobalCompositeOperation) {
        switch (value) {
            case GlobalCompositeOperation.SourceOver:
                this._globalCompositeOperation = CK.BlendMode.SrcOver
                break;
            case GlobalCompositeOperation.DestinationOver:
                this._globalCompositeOperation = CK.BlendMode.DstOver
                break;
            case GlobalCompositeOperation.SourceIn:
                this._globalCompositeOperation = CK.BlendMode.SrcIn
                break;
            case GlobalCompositeOperation.DestinationIn:
                this._globalCompositeOperation = CK.BlendMode.DstIn
                break;
            case GlobalCompositeOperation.SourceOut:
                this._globalCompositeOperation = CK.BlendMode.SrcOut
                break;
            case GlobalCompositeOperation.DestinationOut:
                this._globalCompositeOperation = CK.BlendMode.DstOut
                break;
            case GlobalCompositeOperation.SourceAtop:
                this._globalCompositeOperation = CK.BlendMode.SrcATop
                break;
            case GlobalCompositeOperation.DestinationAtop:
                this._globalCompositeOperation = CK.BlendMode.DstATop
                break;
            case GlobalCompositeOperation.Xor:
                this._globalCompositeOperation = CK.BlendMode.Xor
                break;
            case GlobalCompositeOperation.Color:
                this._globalCompositeOperation = CK.BlendMode.Color
                break;
            case GlobalCompositeOperation.ColorBurn:
                this._globalCompositeOperation = CK.BlendMode.ColorBurn
                break;
        }
        this._paint.setBlendMode(this._globalCompositeOperation)
    }
    get globalCompositeOperation() {
        switch (this._globalCompositeOperation) {
            case CK.BlendMode.SrcOver:
                return GlobalCompositeOperation.SourceOver
            case CK.BlendMode.DstOver:
                return GlobalCompositeOperation.DestinationOver
            case CK.BlendMode.SrcIn:
                return GlobalCompositeOperation.SourceIn
            case CK.BlendMode.DstIn:
                return GlobalCompositeOperation.DestinationIn
            case CK.BlendMode.SrcOut:
                return GlobalCompositeOperation.SourceOut
            case CK.BlendMode.DstOut:
                return GlobalCompositeOperation.DestinationOut
            case CK.BlendMode.SrcATop:
                return GlobalCompositeOperation.SourceAtop
            case CK.BlendMode.DstATop:
                return GlobalCompositeOperation.DestinationAtop
            case CK.BlendMode.Xor:
                return GlobalCompositeOperation.Xor
            case CK.BlendMode.Color:
                return GlobalCompositeOperation.Color
            case CK.BlendMode.ColorBurn:
                return GlobalCompositeOperation.ColorBurn
        }
    }
    set lineWidth(value: number) {
       if(this._strokeWidth!==value){
            this._strokeWidth = value
            this._paint.setStrokeWidth(value)
       }
    }
    get lineWidth() {
        return this._paint.getStrokeWidth()
    }
    set miterLimit(value: number) {
        this._miterLimit = value
        this._paint.setStrokeMiter(value)
    }
    get miterLimit() {
        return this._paint.getStrokeMiter()
    }
    set lineJoin(value: LineJoin) {
        switch (value) {
            case LineJoin.Miter:
                this._paint.setStrokeJoin(CK.StrokeJoin.Miter)
                break;
            case LineJoin.Round:
                this._paint.setStrokeJoin(CK.StrokeJoin.Round)
                break;
            case LineJoin.Bevel:
                this._paint.setStrokeJoin(CK.StrokeJoin.Bevel)
                break;
        }
    }
    get lineJoin() {
        switch (this._paint.getStrokeJoin()) {
            case CK.StrokeJoin.Miter:
                return LineJoin.Miter
            case CK.StrokeJoin.Round:
                return LineJoin.Round
            case CK.StrokeJoin.Bevel:
                return LineJoin.Bevel
        }
    }
    set lineCap(value: LineCap) {
        switch (value) {
            case LineCap.Butt:
                this._paint.setStrokeCap(CK.StrokeCap.Butt)
                break;
            case LineCap.Round:
                this._paint.setStrokeCap(CK.StrokeCap.Round)
                break;
            case LineCap.Square:
                this._paint.setStrokeCap(CK.StrokeCap.Square)
                break;
        }
    }
    get lineCap() {
        switch (this._paint.getStrokeCap()) {
            case CK.StrokeCap.Butt:
                return LineCap.Butt
            case CK.StrokeCap.Round:
                return LineCap.Round
            case CK.StrokeCap.Square:
                return LineCap.Square
        }
    }
    setLineDash(segments: number[]) {
        this._lineDash = segments.length % 2 === 0 ? segments : segments.concat(segments)
    }
    set LineDash(value: number[]) {
        this.setLineDash(value)
    }
    get LineDash() {
        return this._lineDash
    }
    set lineDashOffset(value: number) {
        this._lineDashOffset = value
    }
    get lineDashOffset() {
        return this._lineDashOffset
    }
    set fillStyle(value: FillStrokeValue) {
        if (!isValidPaintValue(value)) {
            return
        }
        if (Color.isColor(value)) {
            this._fillStyle = Color.parse(value).normalize()
        } else if(value&&((value as Gradient).isGradient||(value as Pattern).isPattern)){
            this._fillStyle = value as FillStrokeObject
        }
    }
    get fillStyle() {
        return this._fillStyle
    }
    set strokeStyle(value: FillStrokeValue) {
          if (!isValidPaintValue(value)) {
            return
        }
         if (Color.isColor(value)) {
            this._strokeStyle = Color.parse(value).normalize()
        } else if(value&&((value as Gradient).isGradient||(value as Pattern).isPattern)){
            this._strokeStyle = value as FillStrokeObject
        }
    }
    get strokeStyle() {
        return this._strokeStyle
    }
    get font() {
        return this._fontString;
    }
    set font(newFont) {
        var tf = getTypeface(newFont);
        if (tf) {
            // tf is a "dict" according to closure, that is, the field
            // names are not minified. Thus, we need to access it via
            // bracket notation to tell closure not to minify these names.
            this._font.setSize(tf['sizePx']);
            this._font.setTypeface(tf['typeface']);
            this._fontString = newFont;
        }
    }
    createCanvaskitPath(){
        const path= new CK.Path()
        this.disposableManager.addPersistent(path)
        return path
    }
    createCanvaskitPaint(){
        const paint= new CK.Paint()
        this.disposableManager.addPersistent(paint)
        return paint
    }
    clearRect(x: number, y: number, width: number, height: number) {
        this._paint.setStyle(CK.PaintStyle.Fill);
        this._paint.setBlendMode(CK.BlendMode.Clear);
        this.canvas.drawRect(CK.XYWHRect(x, y, width, height), this._paint);
        this._paint.setBlendMode(this._globalCompositeOperation);
    }
    drawRect(x: number, y: number, width: number, height: number) {
        this._currentPath.addRect(CK.XYWHRect(x, y, width, height))
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
    createPattern(image: CanvasImageSource, repetition: PatternRepeat) {
        const gradient = new Pattern(image, repetition)
        this.disposableManager.addPersistent(gradient)
        return gradient
    }
    translate(dx: number, dy: number) {
        const inverted = CK.Matrix.translated(-dx, -dy);
        this._currentPath.transform(inverted);
        this.canvas.translate(dx, dy);
        this._currentTransform = this.canvas.getTotalMatrix();
    }
    scale(sx: number, sy: number) {
        const inverted = CK.Matrix.scaled(1/sx, 1/sy);
        this._currentPath.transform(inverted);
        this.canvas.scale(sx, sy);
        this._currentTransform = this.canvas.getTotalMatrix();
    }
    rotate(angle: number) {
         // 回溯性地将此变换的逆变换应用到之前的
         // 路径上，这样在绘制时应用变换时就会相互抵消。
        const inverted = CK.Matrix.rotated(-angle);
        this._currentPath.transform(inverted);
        this.canvas.rotate(angle, 0, 0);
        this._currentTransform = this.canvas.getTotalMatrix();
    }
    getCurrentTransform(){
        return this._currentTransform
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
        this._currentPath.transform(inverted);// 让canvas totalMatrix不影响之前已添加的路径
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
        this._currentPath.reset();
        //this._currentPath.dispose()
        //this._currentPath = new CK.Path();
    }
    moveTo(x: number, y: number) {
        this._currentPath.moveTo(x, y)
       // moveTo(this._currentPath, x, y)
       this._currentPath.moveTo(x,y)
    }
    lineTo(x: number, y: number) {
        //lineTo(this._currentPath, x, y)
        this._currentPath.lineTo(x, y)
    }
    quadraticCurveTo(cp1x: number, cp1y: number, x: number, y: number) {
        this._currentPath.quadTo(cp1x, cp1y, x, y)
    }
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
        this._currentPath.cubicTo(cp1x, cp1y, cp2x, cp2y, x, y)
    }
    rect(x: number, y: number, width: number, height: number) {
        this._currentPath.addRect(CK.XYWHRect(x, y, width, height))
    }
    roundRect(x: number, y: number, width: number, height: number, radius:number|[number,number]) {
        const radiusArr=Array.isArray(radius)?radius:[radius??0,radius??0]
        const rx=radiusArr[0],ry=radiusArr[1]
        this._currentPath.addRRect(CK.RRectXY(CK.XYWHRect(x, y, width, height),rx,ry))
    }
    arc(x: number, y: number,radius:number, startAngle: number, endAngle: number, clockwise: boolean) {
        arc(this._currentPath, x, y, radius, startAngle, endAngle, clockwise)
    }
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
        this._currentPath.arcToTangent(x1, y1, x2, y2, radius)
    }
    ellipse(x: number, y: number, rx: number, ry: number, rotation: number, startAngle: number, endAngle: number, clockwise: boolean) {
        ellipse(this._currentPath, x, y, rx, ry, rotation, startAngle, endAngle, clockwise)
    }
    closePath() {
        this._currentPath.close();
    }
    clip(_path?: CanvasKit.Path|Path2D | FillRule, fillRule?: FillRule) {
        let path:CanvasKit.Path
        if (typeof _path === 'string') {
            fillRule = _path as FillRule
            path = this._currentPath
        }else if(_path&&(_path as Path2D)._getPath){
            path = (_path as Path2D)._getPath()
        }else{
            path = _path as CanvasKit.Path
        }
        if (!path) {
            path = this._currentPath
        }
        if (!fillRule) {
            fillRule = FillRule.NonZero
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
     applyPathBorderSide(path: CanvasKit.Path,style:CanvasDrawStyle) {
        const  canvas = this.canvas
        let { borderSide, lineWidth } = style
        if (borderSide === BorderSide.Outside) {
            let innerPath = path.copy()
            innerPath.setFillType(CK.FillType.EvenOdd)
            canvas.clipPath(innerPath, CK.ClipOp.Difference, true)
            innerPath.dispose()
            this.lineWidth = lineWidth * 2

        } else if (borderSide === BorderSide.Inside) {
            let innerPath = path.copy()
            innerPath.setFillType(CK.FillType.EvenOdd)
            canvas.clipPath(innerPath, CK.ClipOp.Intersect, true)
            innerPath.dispose()
            this.lineWidth = lineWidth * 2
        }
    }
    applyMask(obj:DisplayObject) {
        const style=obj.style as CanvasDrawStyle
        const mask=style.mask
        if(mask){
            const {path:maskPath,object:maskObject,maskFilter}=mask
            const maskPaint=this._paint.copy()
            maskPaint.setBlendMode(CK.BlendMode.Src);       // 覆盖 alpha
            maskPaint.setAntiAlias(true);
            // this.canvas.saveLayer(null,maskPaint)
            if(maskPath){
               //maskPaint.setMaskFilter(CK.MaskFilter.MakeBlur(CK.BlurStyle.))
            }
            maskPaint.dispose()
        }
    }
    applyClipPath(obj:DisplayObject) {
        const style=obj.style as CanvasDrawStyle
        const clip=style.clip
        if(clip&&clip){
          //  this.save()
            const {path:clipPath,object:clipObject}=clip
            if(clipObject){
                const clipPathUnits=clip.clipPathUnits??ClipPathUnits.UserSpaceOnUse
                const objClipPath=clipObject.ckPath
                const clipMatrix=Matrix2D.getPool()
                const clipInverseMatrix=Matrix2D.getPool()
               // const cts=this.getCurrentTransform()
                if(clipPathUnits===ClipPathUnits.ObjectBoundingBox){
                    clipMatrix.copy(obj.worldMatrix)
                    clipInverseMatrix.copy(obj.worldInverseMatrix)
                }else{
                    clipMatrix.copy(clipObject.worldMatrix)
                    clipInverseMatrix.copy(clipObject.worldInverseMatrix)
                }
                this.transform(clipMatrix[0],clipMatrix[1],clipMatrix[2],clipMatrix[3],clipMatrix[4],clipMatrix[5])
                this.clip(objClipPath,(clipObject.style as any).fillRule)
                this.transform(clipInverseMatrix[0],clipInverseMatrix[1],clipInverseMatrix[2],clipInverseMatrix[3],clipInverseMatrix[4],clipInverseMatrix[5])
                clipMatrix.releasePool()
                clipInverseMatrix.releasePool()
            }else if(clipPath){
                this.clip(clipPath,clip.fillRule)
            }
        }
    }
    applyPathStyle(style: CanvasDrawStyle) {
        Object.keys(style).forEach((name) => {
            let propName = name as keyof typeof style
            let value=style[propName]
            if (DrawStylePropertiesSet.has(propName)&&!isNullOrUndefined(value)) {
                if(HasDrawStylePropertiesMap.has(propName)){
                   propName=DrawStylePropertiesMap[name as keyof typeof DrawStylePropertiesMap] as keyof typeof style
                }
                (this as any)[propName] = value
            }
        })
    }
    drawPathStyle(path:CanvasKit.Path,style:CanvasDrawStyle){
       this.applyPathStyle(style)
       if (style.firstFill) {
            if (isValidPaintValue(style.fillStyle)) {
                this.fill(path,style.fillRule)
            }
            if (isValidPaintValue(style.strokeStyle)) {
                this.applyPathBorderSide(path, style)
                this.stroke(path)
            }
        }else{
            if (isValidPaintValue(style.strokeStyle)) {
                this.applyPathBorderSide(path, style)
                this.stroke(path)
            }
             if (isValidPaintValue(style.fillStyle)) {
                this.fill(path,style.fillRule)
            }
        }
    }
    _fillPaint() {
        const paint = this._paint
        const fillStyle = this._fillStyle
        paint.setStyle(CK.PaintStyle.Fill)
        if (fillStyle.type === 'Color') {
            const alphaColor = CK.multiplyByAlpha(fillStyle as Color, this.globalAlpha);
            paint.setColor(alphaColor);
        } else {
            const shader = (fillStyle as Gradient).getShader();
            paint.setColor(CK.Color(0, 0, 0, this.globalAlpha));
            paint.setShader(shader);
        }
        this.disposableManager.add({
            dispose: () => {
               // paint.setShader(null)
            }
        })
        return paint
    }
    _strokePaint() {
        const paint = this._paint
        paint.setStyle(CK.PaintStyle.Stroke);
        if (this._strokeStyle.type === 'Color') {
            const alphaColor = CK.multiplyByAlpha(this._strokeStyle as Color, this.globalAlpha);
            paint.setColor(alphaColor);
        } else {
            const shader = (this._strokeStyle as Gradient).getShader();
            paint.setColor(CK.Color(0, 0, 0, this.globalAlpha));
            paint.setShader(shader);
        }
        let dashedEffect: CanvasKit.PathEffect = null
        if (this._lineDash.length) {
            dashedEffect = CK.PathEffect.MakeDash(this._lineDash, this._lineDashOffset);
            paint.setPathEffect(dashedEffect);
        }
        this.disposableManager.add({
            dispose: () => {
                dashedEffect && dashedEffect.delete();
              //  paint.setPathEffect(null)
              //  paint.setShader(null)
            }
        })
        return paint;
    }
    _shadowPaint(basePaint: CanvasKit.Paint) {
        if(!isValidPaintValue(this.shadowColor)){
            return null
        }
        // multiply first to see if the alpha channel goes to 0 after multiplication.
        const alphaColor = CK.multiplyByAlpha(this.shadowColor, this.globalAlpha);
        // if alpha is zero, no shadows
        if (!CK.getColorComponents(alphaColor)[3]) {
            return null;
        }
        // one of these must also be non-zero (otherwise the shadow is
        // completely hidden.  And the spec says so).
        if (!(this.shadowBlur || this.shadowOffsetY || this.shadowOffsetX)) {
            return null;
        }
        const shadowPaint = basePaint.copy();
        shadowPaint.setColor(alphaColor);
        const blurEffect = CK.MaskFilter.MakeBlur(CK.BlurStyle.Normal,
            this.shadowBlur / 2,
            false);
        shadowPaint.setMaskFilter(blurEffect);

        // hack up a "destructor" which also cleans up the blurEffect. Otherwise,
        // we leak the blurEffect (since smart pointers don't help us in JS land).
        this.disposableManager.add({
            dispose: () => {
                blurEffect.delete();
                // shadowPaint.setMaskFilter(null)
                shadowPaint.dispose()
            }
        })
        return shadowPaint;
    }
    _applyShadowOffsetMatrix() {
        const inverted = CK.Matrix.invert(this._currentTransform);
        this.canvas.concat(inverted);
        this.canvas.concat(CK.Matrix.translated(this.shadowOffsetX, this.shadowOffsetY));
        this.canvas.concat(this._currentTransform);
    };
    fill(_path?: CanvasKit.Path|Path2D | FillRule, fillRule?: FillRule) {
        let path:CanvasKit.Path
        if (typeof _path === 'string') {
            fillRule = _path as FillRule
            path = this._currentPath
        }else if(_path&&(_path as Path2D)._getPath){
            path = (_path as Path2D)._getPath()
        }
        if (!path) {
            path = this._currentPath
        }
        if (!fillRule) {
            fillRule = FillRule.NonZero
        }
        if (fillRule === FillRule.EvenOdd) {
            path.setFillType(CK.FillType.EvenOdd)
        } else {
            path.setFillType(CK.FillType.Winding)
        }

        const paint = this._fillPaint()
        const shadowPaint = this._shadowPaint(paint)
        if (shadowPaint) {
            this.canvas.save();
            this._applyShadowOffsetMatrix();
            this.canvas.drawPath(this._currentPath, shadowPaint)
            this.canvas.restore()
        }
        this.canvas.drawPath(this._currentPath, paint)
    }
    stroke(_path?: CanvasKit.Path|Path2D) {
        let path:CanvasKit.Path
         if(_path&&(_path as Path2D)._getPath){
            path = (_path as Path2D)._getPath()
        }
        if (!path) {
            path = this._currentPath
        }
        const paint = this._strokePaint()
        const shadowPaint = this._shadowPaint(paint)
        if (shadowPaint) {
            this.canvas.save();
            this._applyShadowOffsetMatrix();
            this.canvas.drawPath(this._currentPath, shadowPaint)
            this.canvas.restore()
        }
        this.canvas.drawPath(this._currentPath, paint)
    }
    strokeRect(x: number, y: number, width: number, height: number) {
        const strokePaint = this._strokePaint();
        const shadowPaint = this._shadowPaint(strokePaint);
        if (shadowPaint) {
            this.canvas.save();
            this._applyShadowOffsetMatrix();
            this.canvas.drawRect(CK.XYWHRect(x, y, width, height), shadowPaint);
            this.canvas.restore();
        }
        this.canvas.drawRect(CK.XYWHRect(x, y, width, height), strokePaint);
    };
    fillRect(x: number, y: number, width: number, height: number) {
        const fillPaint = this._fillPaint();
        const shadowPaint = this._shadowPaint(fillPaint);
        if (shadowPaint) {
            this.canvas.save();
            this._applyShadowOffsetMatrix();
            this.canvas.drawRect(CK.XYWHRect(x, y, width, height), shadowPaint);
            this.canvas.restore();
        }
        this.canvas.drawRect(CK.XYWHRect(x, y, width, height), fillPaint);
    };

    fillText(text: string, x: number, y: number, maxWidth: number) {
        // TODO do something with maxWidth, probably involving measure
        const fillPaint = this._fillPaint();
        const blob = CK.TextBlob.MakeFromText(text, this._font);

        const shadowPaint = this._shadowPaint(fillPaint);
        if (shadowPaint) {
            this.canvas.save();
            this._applyShadowOffsetMatrix();
            this.canvas.drawTextBlob(blob, x, y, shadowPaint);
            this.canvas.restore();
        }
        this.canvas.drawTextBlob(blob, x, y, fillPaint);
        blob.delete();
        fillPaint.dispose();
    };
    measureText(text: string) {
        const ids = this._font.getGlyphIDs(text);
        const widths = this._font.getGlyphWidths(ids);
        let totalWidth = 0;
        for (const w of widths) {
            totalWidth += w;
        }
        return {
            width: totalWidth,
        };
    }
    drawImage(image: Image, dx: number, dy: number): void;
    drawImage(image: Image, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: Image, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(img: Image) {
        const iPaint = this._fillPaint();
        let destRect: CanvasKit.Rect,
            srcRect: CanvasKit.Rect;
        if (arguments.length === 3 || arguments.length === 5) {
            destRect = CK.XYWHRect(arguments[1], arguments[2],
                arguments[3] || img.width, arguments[4] || img.height);
            srcRect = CK.XYWHRect(0, 0, img.width, img.height);
        } else if (arguments.length === 9) {
            destRect = CK.XYWHRect(arguments[5], arguments[6],
                arguments[7], arguments[8]);
            srcRect = CK.XYWHRect(arguments[1], arguments[2],
                arguments[3], arguments[4]);
        } else {
            throw 'invalid number of args for drawImage, need 3, 5, or 9; got ' + arguments.length;
        }
        this.canvas.drawImageRect(img.skImage, srcRect, destRect, iPaint, false);
    };

    putImageData(imageData: ImageData, x: number, y: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number) {
        if (!allAreFinite([x, y, dirtyX, dirtyY, dirtyWidth, dirtyHeight])) {
            return;
        }
        if (dirtyX === undefined) {
            // fast, simple path for basic call
            this.canvas.writePixels(imageData.data as any, imageData.width, imageData.height, x, y);
            return;
        }
        dirtyX = dirtyX || 0;
        dirtyY = dirtyY || 0;
        dirtyWidth = dirtyWidth || imageData.width;
        dirtyHeight = dirtyHeight || imageData.height;

        // as per https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-putimagedata
        if (dirtyWidth < 0) {
            dirtyX = dirtyX + dirtyWidth;
            dirtyWidth = Math.abs(dirtyWidth);
        }
        if (dirtyHeight < 0) {
            dirtyY = dirtyY + dirtyHeight;
            dirtyHeight = Math.abs(dirtyHeight);
        }
        if (dirtyX < 0) {
            dirtyWidth = dirtyWidth + dirtyX;
            dirtyX = 0;
        }
        if (dirtyY < 0) {
            dirtyHeight = dirtyHeight + dirtyY;
            dirtyY = 0;
        }
        if (dirtyWidth <= 0 || dirtyHeight <= 0) {
            return;
        }
        var img = CK.MakeImage({
            'width': imageData.width,
            'height': imageData.height,
            'alphaType': CK.AlphaType.Unpremul,
            'colorType': CK.ColorType.RGBA_8888,
            'colorSpace': CK.ColorSpace.SRGB
        }, imageData.data, 4 * imageData.width);
        var src = CK.XYWHRect(dirtyX, dirtyY, dirtyWidth, dirtyHeight);
        var dst = CK.XYWHRect(x + dirtyX, y + dirtyY, dirtyWidth, dirtyHeight);
        var inverted = CK.Matrix.invert(this._currentTransform);
        this.canvas.save();
        // putImageData() operates in device space.
        this.canvas.concat(inverted);
        this.canvas.drawImageRect(img, src, dst, null, false);
        this.canvas.restore();
        img.delete();
    };

    getImageData(x: number, y: number, w: number, h: number) {
        var pixels = this.canvas.readPixels(x, y, {
            'width': w,
            'height': h,
            'colorType': CK.ColorType.RGBA_8888,
            'alphaType': CK.AlphaType.Unpremul,
            'colorSpace': CK.ColorSpace.SRGB,
        });
        if (!pixels) {
            return null;
        }
        // This essentially re-wraps the pixels from a Uint8Array to
        // a Uint8ClampedArray (without making a copy of pixels).
        return new ImageData(new Uint8ClampedArray(pixels.buffer as any), w, h);
    };
    _mapToLocalCoordinates(pts: number[]) {
        const inverted = CK.Matrix.invert(this._currentTransform);
        CK.Matrix.mapPoints(inverted, pts);
        return pts;
    };

    isPointInPath(x: number, y: number, fillmode: string) {
        const args = arguments;
        let path: CanvasKit.Path
        if (args.length === 3) {
            path = this._currentPath;
        } else if (args.length === 4) {
            path = args[0] as CanvasKit.Path;
            x = args[1];
            y = args[2];
            fillmode = args[3];
        } else {
            throw 'invalid arg count, need 3 or 4, got ' + args.length;
        }
        if (!isFinite(x) || !isFinite(y)) {
            return false;
        }
        fillmode = fillmode || 'nonzero';
        if (!(fillmode === 'nonzero' || fillmode === 'evenodd')) {
            return false;
        }
        // x and y are in canvas coordinates (i.e. unaffected by CTM)
        const pts = this._mapToLocalCoordinates([x, y]);
        x = pts[0];
        y = pts[1];
        path.setFillType(fillmode === 'nonzero' ?
            CK.FillType.Winding :
            CK.FillType.EvenOdd);
        return path.contains(x, y);
    };
    save() {
        let fs,ss;
        if(this._fillStyle){
            fs = this._fillStyle.clone()
        }
        if(this._strokeStyle){
            ss = this._strokeStyle.clone()
        }
        this._stateStack.push({
            paint: this._paint.copy(),
            ctm: this._currentTransform.slice(),
            globalAlpha: this.globalAlpha,
            blend: this._globalCompositeOperation,
            fillStyle:fs,
            strokeStyle:ss,
            strokeWidth:this._strokeWidth,
            shadowColor: this.shadowColor,
            shadowBlur: this.shadowBlur,
            shadowOffsetX: this.shadowOffsetX,
            shadowOffsetY: this.shadowOffsetY,
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
        this.globalAlpha = newState.globalAlpha
        this._globalCompositeOperation = newState.blend
        this._strokeWidth=newState.strokeWidth
        this.shadowColor = newState.shadowColor
        this.shadowBlur = newState.shadowBlur
        this.shadowOffsetX = newState.shadowOffsetX
        this.shadowOffsetY = newState.shadowOffsetY
        this._fillStyle=newState.fillStyle
        this._strokeStyle=newState.strokeStyle
        this.canvas.restore()
        this._currentTransform = this.canvas.getTotalMatrix()
    }
    transformObject(object: DisplayObject) {
        const objMat = object.worldMatrix
        if (!objMat.hasIdentity()) {
            this.transform(objMat[0], objMat[1], objMat[2], objMat[3], objMat[4], objMat[5])
        }
    }
    renderObject(object: DisplayObject) {
        this.emit('object:renderBefore',{object:object,renderer:this})
        object.renderBefore(this)
        this.save()
        this.applyClipPath(object)
        object.startDraw(this)
        this.transformObject(object)
        object.draw(this)
        object.endDraw(this)
        this.restore()
        object.effectFlag=NodeEffectFlags.None
        object.renderAfter(this)
        this.emit('object:renderAfter',{object:object,renderer:this})
    }

    render({ renderObjects, delta }: { renderObjects: DisplayObject[], delta: number }): void {
        const canvas = this.canvas
        if(this.options.backgroundColor){
            canvas.clear(Color.parse(this.options.backgroundColor).normalize())
        }else{
            this.clearRect(0,0,this.pixelWidth,this.pixelHeight)
        }
        canvas.save()
        canvas.scale(this.dpr, this.dpr)

        renderObjects.forEach((object) => {
            if (object.shouldRender()) {
                this.disposableManager.run(() => {
                   object.render(this)
                })
            }
        })
        canvas.restore()
        this.surface.flush()

    }
    dispose() {
        this.disposableManager.destroy()
        this._paint.delete()
        this._currentPath.delete()
        this._font.delete();
        this._stateStack.length=0
        this._fillStyle?.dispose?.()
        this._strokeStyle?.dispose?.()
        this.removeAllListeners()
    }
}