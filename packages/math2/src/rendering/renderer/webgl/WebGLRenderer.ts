import { Color, ColorInput } from "src/math/Color";
import { Matrix2D } from "src/math/Matrix2D";
import { PathBuilder } from "src/math/PathBuilder";
import { GraphicsPath } from "src/math/pixijs/path/GraphicsPath";
import { BlendOperation, createPaint, FillRule, FillStyle, FontStyles, LineCap, LineJoin, Paint, TextAlign, TextBaseline } from "src/rendering/Paint";
import { Renderer, RendererProps, RenderOptions } from "src/rendering/Renderer";
import { deepClone } from "src/utils/fast-json-patch/core";


export class WebGLRenderer extends Renderer {
    renderType = 'webgl'
    domElement: HTMLCanvasElement;
    gl: WebGL2RenderingContext
    _path = PathBuilder.default()
    _matrix = Matrix2D.identity()
    _stateStack: { paint: Paint, transform: Matrix2D }[] = []
    _currentState: Paint
    async initContext(props: RendererProps) {
        if (props.canvas) {
            this.domElement = props.canvas as HTMLCanvasElement
        } else {
            this.domElement = document.createElement('canvas')
        }
        this.gl = (this.domElement as HTMLCanvasElement).getContext('webgl2', {
            antialias: true,
            stencil: true,
            depth: false
        } as WebGLContextAttributes) as WebGL2RenderingContext
        this._currentState = createPaint()

    }
    transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
        this._matrix.multiply(Matrix2D.fromValues(a, b, c, d, e, f))
    }
    setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void {
        this._matrix.fromValues(a, b, c, d, e, f)
    }
    getTransform(): Matrix2D {
        return this._matrix
    }
    resetTransform(): void {
        this._matrix.identity()
    }
    translate(x: number, y: number): void {
        this._matrix.translate(x, y)
    }
    scale(sx: number, sy: number): void {
        this._matrix.scale(sx, sy)
    }
    rotate(angle: number): void {
        this._matrix.rotate(angle)
    }

    clear(): void {
        const c = this.clearColorValue
        this.gl.clearColor(c[0], c[1], c[2], c[3])
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    }
    save(): void {
        this._stateStack.push({
            paint: deepClone(this._currentState),
            transform: this._matrix.clone()
        })
    }
    restore(): void {
        const state = this._stateStack.pop()
        if (state) {
            this._currentState = state.paint
            this._matrix = state.transform
        }
    }
    beginPath(): void {
        this._path.reset()
    }
    closePath(): void {
        this._path.closePath()
    }
    moveTo(x: number, y: number): void {
        this._path.moveTo(x, y)
    }
    lineTo(x: number, y: number): void {
        this._path.lineTo(x, y)
    }
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        this._path.arcTo(x1, y1, x2, y2, radius)
    }
    quadraticCurveTo(x1: number, y1: number, x2: number, y2: number): void {
        this._path.quadraticCurveTo(x1, y1, x2, y2)
    }
    bezierCurveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
        this._path.bezierCurveTo(x1,y1,x2,y2,x3,y3,)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
    }
    rect(x: number, y: number, width: number, height: number): void {
        this._path.rect(x, y, width, height)
    }
    roundRect(x: number, y: number, width: number, height: number, radius: number | number[]): void {
        this._path.roundRect(x, y, width, height, radius)
    }
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, ccw: boolean): void {
        this._path.arc(x, y, radius, startAngle, endAngle, ccw)
    }
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, ccw: boolean): void {
        this._path.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, ccw)
    }
    setGlobalAlpha(alpha: number): void {
        this._currentState.globalAlpha = alpha
    }
    setBlend(operation: BlendOperation): void {
        this._currentState.blend = operation
    }
    setLineWidth(width: number): void {
        this._currentState.lineWidth = width
    }
    setLineJoin(lineJoin: LineJoin): void {
        this._currentState.lineJoin = lineJoin
    }
    setLineCap(lineCap: LineCap): void {
        this._currentState.lineCap = lineCap
    }
    setLineDash(lineDash: number[]): void {
        this._currentState.lineDash = lineDash
    }
    setLineDashOffset(lineDashOffset: number): void {
        this._currentState.lineDashOffset = lineDashOffset
    }
    setMiterLimit(miterLimit: number): void {
        this._currentState.miterLimit = miterLimit
    }
    setFillStyle(fillStyle: FillStyle): void {
        this._currentState.fillStyle = fillStyle
    }
    setStrokeStyle(fillStyle: FillStyle): void {
        this._currentState.strokeStyle = fillStyle
    }
    setShadowColor(shadowColor: ColorInput): void {
        this._currentState.shadowColor = Color.fromInput(shadowColor)
    }
    setShadowOffsetX(shadowOffsetX: number): void {
        this._currentState.shadowOffsetX = shadowOffsetX
    }
    setShadowOffsetY(shadowOffsetY: number): void {
        this._currentState.shadowOffsetY = shadowOffsetY
    }
    setShadowBlur(shadowBlur: number): void {
        this._currentState.shadowBlur = shadowBlur
    }
    setTextBaseline(textBaseline: TextBaseline): void {
        this._currentState.textBaseline = textBaseline
    }
    setTextAlign(textAlign: TextAlign): void {
        this._currentState.textAlign = textAlign
    }
    setWordSpacing(wordSpacing: number): void {
        this._currentState.wordSpacing = wordSpacing
    }
    setLetterSpacing(letterSpacing: number): void {
        this._currentState.letterSpacing = letterSpacing
    }
    setFont(style: Partial<FontStyles>): void {
        const { fontStyle = 'normal', fontFamily = 'sans-serif', fontWeight = 'normal', fontSize = 12, lineHeight } = style
        this._currentState.fontFamily = fontFamily
        this._currentState.fontSize = fontSize
        this._currentState.lineHeight = lineHeight
        this._currentState.fontStyle = fontStyle
        this._currentState.fontWeight = fontWeight
    }
    fill(fillRule: FillRule): void {
        throw new Error("Method not implemented.");
        
    }
    stroke(): void {
        throw new Error("Method not implemented.");
    }
    fillText(text: string, x: number, y: number): void {
        throw new Error("Method not implemented.");
    }
    drawRect(x: number, y: number, width: number, height: number, paint: Paint): void {
        throw new Error("Method not implemented.");
    }
    drawCircle(x: number, y: number, radius: number, paint: Paint): void {
        throw new Error("Method not implemented.");
    }
    drawRoundRect(x: number, y: number, width: number, height: number, radius: number | number[], paint: Paint): void {
        throw new Error("Method not implemented.");
    }
    drawEllipse(x: number, y: number, radiusX: number, radiusY: number, paint: Paint): void {
        throw new Error("Method not implemented.");
    }
    drawPath(path: PathBuilder, paint: Paint): void {
        throw new Error("Method not implemented.");
    }
    drawImage(image: CanvasImageSource, x: number, y: number, w: number, h: number): void {
        throw new Error("Method not implemented.");
    }
    render(renderOptions: RenderOptions): void {
        throw new Error("Method not implemented.");
    }


}