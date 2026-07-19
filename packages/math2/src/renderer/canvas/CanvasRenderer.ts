
import { EventEmitter } from 'src/events/EventEmitter'
import { PointerEventSystem, type PointerEvent, type PointerEventsMaps } from 'src/events/PointerEventSystem'
import { Transform } from 'src/math/Transform'
import { ShapePath } from 'src/math/ShapePath'
import { CanvasTextMeasure } from 'src/math/Paragraph'
import { BoundingRect } from 'src/math/BoundingRect'
import { Matrix2D } from 'src/math/Matrix2D'
import { loadImage } from 'src/utils/loadResource'

type CanvasRendererProps = {
    dpr?: number
    canvas?: HTMLCanvasElement
    width: number
    height: number
}
type IRenderObjectStyle = {
    // 填充相关
    fillStyle?: string | CanvasGradient | CanvasPattern
    fillRule?: CanvasFillRule
    // 边框相关
    strokeStyle?: string | CanvasGradient | CanvasPattern
    globalAlpha?: number
    globalCompositeOperation?: GlobalCompositeOperation
    clipPath?: Path2D
    clipObj?: IRenderObject<keyof RenderObjectShape>
    // 边框相关
    lineWidth?: number
    lineCap?: CanvasLineCap
    lineJoin?: CanvasLineJoin
    lineDash?: number[]
    lineDashOffset?: number
    miterLimit?: number
    // 阴影相关
    shadowBlur?: number
    shadowColor?: string
    shadowOffsetX?: number
    shadowOffsetY?: number
    // 文本相关
    fontSize?: number
    fontFamily?: string
    fontStyle?: 'normal' | 'italic'
    fontWeight?: number | 'bold' | 'normal'
    fontStretch?: CanvasFontStretch
    fontKerning?: CanvasFontKerning
    fontVariant?: CanvasFontVariantCaps
    lineHeight?: number
    letterSpacing?: number
    wordSpacing?: number
    textBaseline?: CanvasTextBaseline
    textAlign?: CanvasTextAlign

}
type RenderObjectShape = {
    image: {
        src?: string
        image?: CanvasImageSource
        width?: number
        height?: number
    },
    group: {
        remove?(obj: IRenderObject<keyof RenderObjectShape>): void
        add?<K extends keyof RenderObjectShape>(type:K, config: IRenderObject<K>): IRenderObject<K>
    },
    text: {
        text: string
    },
    rect: {
        width: number
        height: number
    },
    circle: {
        radius: number
        startAngle: number
        endAngle: number
        clockwise?: boolean
    },
    ellipse: {
        rx: number
        ry: number
        xrotation?: number
        startAngle: number
        endAngle: number
        clockwise?: boolean
    },
    path: {
        path?: ShapePath
    },
    line: {
        x1: number
        y1: number
        x2: number
        y2: number
    },
    shape: {

    }
}

const defaultShapes: RenderObjectShape = {
    image: {
        src: '',
        image: null
    },
    group: {},
    circle: {
        radius: 0,
        startAngle: 0,
        endAngle: 2 * Math.PI,
        clockwise: false
    },
    rect: {
        width: 0,
        height: 0
    },
    ellipse: {
        rx: 0,
        ry: 0,
        xrotation: 0,
        startAngle: 0,
        endAngle: 2 * Math.PI,
        clockwise: false
    },
    path: {},
    line: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    },
    text: {
        text: ''
    },
    shape: {

    }
}


type IRenderObject<T extends keyof RenderObjectShape> = {
    owner?: CanvasRenderer
    parent?: IRenderObject<keyof RenderObjectShape>
    type?: T
    id?: string
    firstFill?: boolean
    draggable?: boolean
    cursor?: string
    visible?: boolean
    silent?: boolean
    style?: IRenderObjectStyle
    position?: { x: number, y: number }
    scale?: { x: number, y: number }
    origin?: { x: number, y: number }
    rotation?: number
    scaleStroke?: boolean
    transform?: Transform
    bounds?: BoundingRect
    path?: ShapePath
    children?: IRenderObject<keyof RenderObjectShape>[]
    event?: EventEmitter<CanvasRendererEvents>
    onUpdate?:()=>void
    beforeDraw?: (ctx: CanvasRenderingContext2D) => void
    afterDraw?: (ctx: CanvasRenderingContext2D) => void
    draw?: (ctx: CanvasRenderingContext2D) => void
    dirty?: () => void
    updatePath?: () => void
    hitTest?: (x: number, y: number) => boolean
    [K: string]: any

} & RenderObjectShape[T]

const DrawProperties = new Set([
    'fillStyle',
    'strokeStyle',
    'globalAlpha',
    'globalCompositeOperation',
    'lineWidth',
    'lineCap',
    'lineJoin',
    'lineDash',
    'lineDashOffset',
    'miterLimit',
    'shadowBlur',
    'shadowColor',
    'shadowOffsetX',
    'shadowOffsetY',
    'fontSize',
    'fontFamily',
    'fontStyle',
    'fontWeight',
    'fontStretch',
    'fontKerning',
    'fontVariant',
    'lineHeight',
    'letterSpacing',
    'wordSpacing',
])
type CanvasRendererEvents = {
    'render:before':[renderer:CanvasRenderer]
    'render:after':[renderer:CanvasRenderer]
    tick:[delta:number]
} & PointerEventsMaps
function createOffscreenCanvas(width: number, height: number, dpr: number): HTMLCanvasElement | OffscreenCanvas {
    const w = width * dpr
    const h = height * dpr
    if (typeof OffscreenCanvas !== 'undefined') {
        return new OffscreenCanvas(w, h)
    }
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    return canvas
}
export class CanvasRenderer extends EventEmitter<CanvasRendererEvents> {
    static createOffscreenCanvas = createOffscreenCanvas
    domElement: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    dpr: number
    width: number
    height: number
    objects: IRenderObject<keyof RenderObjectShape>[] = []
    pointerEventSystem: PointerEventSystem
    _rect: DOMRect
    _textMeasure: CanvasTextMeasure
    objUid: number = 0
    animationRef=0
    constructor(props: CanvasRendererProps) {
        super()
        this.dpr = props.dpr || window.devicePixelRatio
        this.width = props.width ?? window.innerWidth
        this.height = props.height ?? window.innerHeight
        this.domElement = props.canvas ?? document.createElement('canvas')
        this.ctx = this.domElement.getContext('2d')!
        this.pointerEventSystem = new PointerEventSystem({
            target: this.domElement,
            screenToWorld: (point, x, y, target) => {
                point.set(x - this._rect.left, y - this._rect.top)
                return point
            },
            hitTest: (x, y) => {
                return this.findHover(x, y)
            }
        })
        this.pointerEventSystem.emit = (type: string, e: PointerEvent) => {

            const paths = e.composedPath() as IRenderObject<keyof RenderObjectShape>[]
            for (let i = 0, len = paths.length; i < len; i++) {
                const el = paths[i]
                e.currentTarget = el
                el.event.emit(e.type as any, e)
                if (e.cancelBubble) {
                    return
                }
            }
            this.emit(type as keyof PointerEventsMaps, e)
            return true
        }
        if (!this.domElement.parentElement) {
            document.body.appendChild(this.domElement)
        }
        this._textMeasure = new CanvasTextMeasure()
        this.setSize(this.width, this.height)
        this.pointerEventSystem.attachEvents()
        this.initInteraction()
        this.tick=this.tick.bind(this)
        this.start()
    }
    start(){
        if(this.animationRef){
            return
        }
        this.lastTime=performance.now()
        this.animationRef=requestAnimationFrame(this.tick)
    }
    stop(){
        cancelAnimationFrame(this.animationRef)
        this.animationRef=0
    }

    initInteraction() {
        this.on('pointerenter', e => {
            const obj = e.target as IRenderObject<'circle'>
            if (obj && obj.cursor) {
                this.domElement.style.cursor = obj.cursor
                this.refresh()
            }
        })
        this.on('pointerleave', e => {
            this.domElement.style.cursor = 'default'
              this.refresh()
        })
        this.on('drag', (e) => {
           // const obj = e.target as IRenderObject<'circle'>
            let dragTarget;
            let paths=e.composedPath() as IRenderObject<keyof RenderObjectShape>[]
            for(let i=paths.length-1;i>=0;i--){
                if(paths[i].draggable){
                    dragTarget=paths[i]
                    break
                }
            }
            if (dragTarget) {
                dragTarget.transform.position.translate(e.deltaPoint.x, e.deltaPoint.y)
                this.refresh()
            }
        })
    }
    setSize(width: number, height: number, updateStyle = true) {
        this.width = width
        this.height = height
        this.domElement.width = width * this.dpr
        this.domElement.height = height * this.dpr
        if (updateStyle) {
            this.domElement.style.width = `${width}px`
            this.domElement.style.height = `${height}px`
        }
        this._rect = this.domElement.getBoundingClientRect()
    }
    save() {
        this.ctx.save()
    }
    translate(x: number, y: number) {
        this.ctx.translate(x, y)
    }
    scale(x: number, y: number) {
        this.ctx.scale(x, y)
    }
    rotate(angle: number) {
        this.ctx.rotate(angle)
    }
    transform(a: number, b: number, c: number, d: number, e: number, f: number) {
        this.ctx.transform(a, b, c, d, e, f)
    }
    setTransform(a: number, b: number, c: number, d: number, e: number, f: number) {
        this.ctx.setTransform(a, b, c, d, e, f)
    }
    resetTransform() {
        this.ctx.resetTransform()
    }
    getTransform() {
        return this.ctx.getTransform()
    }
    fill(fillRule?: CanvasFillRule): void
    fill(path?: globalThis.Path2D, fillRule?: CanvasFillRule): void
    fill(path?: unknown, fillRule?: CanvasFillRule) {
        if (!path) {
            this.ctx.fill()
        } else if (path instanceof globalThis.Path2D) {
            this.ctx.fill(path, fillRule)
        } else {
            this.ctx.fill((path as CanvasFillRule) || 'nonzero')
        }
    }
    stroke(path?: globalThis.Path2D) {
        if (path instanceof globalThis.Path2D) {
            this.ctx.stroke(path)
        } else {
            this.ctx.stroke()
        }
    }
    fillText(text: string, x: number, y: number) {
        this.ctx.fillText(text, x, y)
    }
    strokeText(text: string, x: number, y: number) {
        this.ctx.strokeText(text, x, y)
    }
    setFillStyle(fillStyle: string | CanvasGradient | CanvasPattern) {
        this.ctx.fillStyle = fillStyle
    }
    setStrokeStyle(strokeStyle: string | CanvasGradient | CanvasPattern) {
        this.ctx.strokeStyle = strokeStyle
    }
    setLineWidth(lineWidth: number) {
        this.ctx.lineWidth = lineWidth
    }
    setLineCap(lineCap: CanvasLineCap) {
        this.ctx.lineCap = lineCap
    }
    setLineJoin(lineJoin: CanvasLineJoin) {
        this.ctx.lineJoin = lineJoin
    }
    setLineDash(lineDash: number[]) {
        this.ctx.setLineDash(lineDash)
    }
    setLineDashOffset(lineDashOffset: number) {
        this.ctx.lineDashOffset = lineDashOffset
    }
    setGlobalAlpha(alpha: number) {
        this.ctx.globalAlpha = alpha
    }
    setGlobalCompositeOperation(operation: GlobalCompositeOperation) {
        this.ctx.globalCompositeOperation = operation
    }
    setMiterLimit(miterLimit: number) {
        this.ctx.miterLimit = miterLimit
    }
    setShadowBlur(blur: number) {
        this.ctx.shadowBlur = blur
    }
    setShadowColor(color: string) {
        this.ctx.shadowColor = color
    }
    setShadowOffsetX(x: number) {
        this.ctx.shadowOffsetX = x
    }
    setShadowOffsetY(y: number) {
        this.ctx.shadowOffsetY = y
    }
    setFont(font: string) {
        this.ctx.font = font
    }
    setFontStretch(stretch: CanvasFontStretch) {
        this.ctx.fontStretch = stretch
    }
    setFontVariant(fontKerning: CanvasFontKerning) {
        this.ctx.fontKerning = fontKerning
    }
    setFontVariantCaps(fontVariantCaps: CanvasFontVariantCaps) {
        this.ctx.fontVariantCaps = fontVariantCaps
    }

    setTextAlign(align: CanvasTextAlign) {
        this.ctx.textAlign = align
    }
    setBaseline(baseline: CanvasTextBaseline) {
        this.ctx.textBaseline = baseline
    }
    measureText(text: string) {
        return this.ctx.measureText(text)
    }
    restore() {
        this.ctx.restore()
    }
    clearRect() {
        this.ctx.clearRect(0, 0, this.domElement.width, this.domElement.height)
    }
    setObjectStrokePath(obj: IRenderObject<keyof RenderObjectShape>) {
        if (obj.path) {
            obj.path.setStroke({
                lineWidth: (obj.scaleStroke ? obj.style.lineWidth / obj.transform.worldScale : obj.style?.lineWidth) || 1,
                lineCap: obj.style?.lineCap || 'butt',
                lineJoin: obj.style?.lineJoin || 'miter',
                miterLimit: obj.style?.miterLimit || 10,
                strokeAlign: 'center'
            })
        }
    }
    addObject<K extends keyof RenderObjectShape>(type: K, config: IRenderObject<K>) {
        const obj: IRenderObject<K> = {

            owner: this,
            id: this.objUid++,
            cursor: 'pointer',
            draggable: false,
            silent: false,
            event: new EventEmitter<CanvasRendererEvents>(),
            transform: new Transform({
                position: config.position || { x: 0, y: 0 },
                scale: config.scale || { x: 1, y: 1 },
                rotation: config.rotation || 0,
                origin: config.origin || { x: 0, y: 0 },
            }),
            firstFill: true,
            visible: true,
            hitTest: true,
            bounds: BoundingRect.default(),
            updatePath() {
                if (this.path) {
                    this.owner.buildShapePath(this.path, this)
                }
            },
            dirty() {
                this.owner.setObjectStrokePath(this)
            },
            ...(defaultShapes[type] || {}),
            ...config,
            ...(type !== 'group' ? {
                scaleStroke: config.scaleStroke ?? false,
                style: {
                    fillRule: 'nonzero',
                    globalAlpha: 1,
                    globalCompositeOperation: 'source-over',
                    lineWidth: 1,
                    lineCap: 'butt',
                    lineJoin: 'miter',
                    lineDash: [],
                    lineDashOffset: 0,
                    miterLimit: 10,
                    clipPath: undefined,
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontSize: 12,
                    fontFamily: 'sans-serif',
                    letterSpacing: 0,
                    lineHeight: 1.2,
                    textBaseline: 'top',
                    textAlign: 'left',
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    ...(config.style || {}),
                }
            } : {
                children: [],
                remove(obj) {
                    obj.transform.parent = null
                    obj.parent = null
                    this.children = this.children.filter(item => item !== obj)
                },
                add(type, config) {
                    const child = this.owner.addObject(type, config)
                    child.parent = this
                    child.transform.parent = this.transform
                    this.children.push(child)
                    return child
                }

            }),
            type,
        }
        if (obj.type === 'image') {
            if (obj.src) {
                loadImage(obj.src).then(img => {
                    obj.image = img
                    obj.height = obj.height || img.height
                    obj.width = obj.width || img.width
                })
            }
        }
        if (obj.type !== 'text' && obj.type !== 'group' && obj.type !== 'image') {
            obj.path = obj.path || new ShapePath()
            if (obj.type != 'path') {
                this.buildShapePath(obj.path, obj)
            }
        }
        obj.dirty()
        this.objects.push(obj)
        return obj
    }
    add<K extends keyof RenderObjectShape>(type: K, config: IRenderObject<K>) {
        let obj = this.addObject(type, config)
        this.objects.push(obj)
        return obj
    }
    remove(config: IRenderObject<keyof RenderObjectShape>) {
        this.objects = this.objects.filter(item => item !== config)
    }

    getBounds(obj: IRenderObject<keyof RenderObjectShape>) {
        if (obj.type === 'text') {
            const curFont = this.getFontString(obj.style)
            if (obj._prevtext !== obj.text || obj._prevFont !== curFont) {
                obj._prevtext = obj.text
                obj._prevFont = curFont
                let rect = this._textMeasure.measureBlock(obj.text, curFont, obj.style.fontSize, obj.style.lineHeight, obj.style.letterSpacing)
                rect = this._textMeasure.alignRect(rect, obj.style.textAlign, obj.style.textBaseline, 0, 0, obj.style.fontSize, obj.style.lineHeight)
                obj.bounds.fromLTRB(rect.left, rect.top, rect.right, rect.bottom)
            }
            return obj.bounds
        } else if (obj.type === 'image') {
            if (obj.image) {
                obj.bounds.fromLTRB(0, 0, obj.width, obj.height)
            }
            return obj.bounds
        } else if (obj.type === 'group') {
            obj.bounds.setEmpty()
            for (const child of obj.children) {
                obj.bounds.union(this.getBounds(child))
            }
            return obj.bounds
        }
        if (obj.style.strokeStyle) {
            return obj.path.computeStrokeTightBounds()
        }
        return obj.path.computeTightBounds()
    }
    hitTestObject(obj: IRenderObject<keyof RenderObjectShape>, x: number, y: number) {
        const local = obj.transform.worldToLocal({ x, y }, { x: 0, y: 0 })
        const hasFill = !!obj.style?.fillStyle
        const hasStroke = !!obj.style?.strokeStyle
        const path = obj.path
        if (obj.type === 'text') {
            return this.getBounds(obj).containsPoint(local)
        }
        if (obj.type === 'shape') {
            if (obj.hitTest&&obj.hitTest(local.x, local.y)) {
                return false
            }
            return false
        }
        if (!hasStroke) {
            const bounds = path.computeBounds()
            if (!bounds.containsPoint(local)) {
                return false
            }
        }
        if (hasFill && path.isPointInPath(local.x, local.y)) {
            return true
        }

        if (hasStroke && path.isPointInStrokePath(local.x, local.y)) {
            return true
        }
        return false
    }
    findHover(x: number, y: number) {
        let queue = this.objects.slice()
        while (queue.length > 0) {
            const obj = queue.pop()!
            if (obj.silent) {
                continue
            }
            if (obj.type === 'group') {
                if (obj.children) {
                    queue = queue.concat(obj.children)
                }
            } else {
                if (this.hitTestObject(obj, x, y)) {
                    return obj
                }
            }
        }
        return null

    }
    rect(x: number, y: number, width: number, height: number) {
        this.ctx.rect(x, y, width, height)
    }
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise: boolean = false) {
        this.ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise)
    }
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise: boolean = false) {
        this.ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise)
    }
    lineTo(x: number, y: number) {
        this.ctx.lineTo(x, y)
    }
    moveTo(x: number, y: number) {
        this.ctx.moveTo(x, y)
    }
    bezierCurveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        this.ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3)
    }
    quadraticCurveTo(x1: number, y1: number, x2: number, y2: number) {
        this.ctx.quadraticCurveTo(x1, y1, x2, y2)
    }
    beginPath() {
        this.ctx.beginPath()
    }
    closePath() {
        this.ctx.closePath()
    }

    buildShapePath(ctx: CanvasRenderingContext2D | Path2D | ShapePath, obj: IRenderObject<keyof RenderObjectShape>) {
        let _obj;
        switch (obj.type) {
            case 'ellipse':
                _obj = obj as IRenderObject<'ellipse'>
                ctx.ellipse(0, 0, _obj.rx, _obj.ry, _obj.xrotation, _obj.startAngle, _obj.endAngle, _obj.clockwise)
                break
            case 'circle':
                _obj = obj as IRenderObject<'circle'>
                ctx.arc(0, 0, _obj.radius, _obj.startAngle, _obj.endAngle, _obj.clockwise)
                break
            case 'rect':
                _obj = obj as IRenderObject<'rect'>
                ctx.rect(0, 0, _obj.width, _obj.height)
                break
            case 'line':
                _obj = obj as IRenderObject<'line'>
                ctx.moveTo(_obj.x1, _obj.y1)
                ctx.lineTo(_obj.x2, _obj.y2)
                break
        }
    }
    getFontString(style: IRenderObjectStyle) {
        return `${style.fontStyle} ${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`

    }
    applyObjectStyle(obj: IRenderObject<keyof RenderObjectShape>) {
        const ctx = this.ctx
        const style = obj.style!
        const type = obj.type
        const hasFill = !!style.fillStyle
        const hasStroke = !!style.strokeStyle

        const globalAlpha = style.globalAlpha || 1
        const globalCompositeOperation = style.globalCompositeOperation

        ctx.globalAlpha = globalAlpha
        if (globalCompositeOperation !== 'source-over') {
            ctx.globalCompositeOperation = globalCompositeOperation
        }
        if (hasFill) {
            ctx.fillStyle = style.fillStyle
        }
        if (hasStroke) {
            ctx.strokeStyle = style.strokeStyle
            ctx.lineWidth = style.lineWidth
            ctx.lineCap = style.lineCap
            ctx.lineJoin = style.lineJoin
            ctx.miterLimit = style.miterLimit
            if (style.lineDash) {
                ctx.setLineDash(style.lineDash)
                ctx.lineDashOffset = style.lineDashOffset
            }
        }
        if (style.shadowColor && (style.shadowBlur > 0 || style.shadowOffsetX !== 0 || style.shadowOffsetY !== 0)) {
            ctx.shadowBlur = style.shadowBlur
            ctx.shadowColor = style.shadowColor
            ctx.shadowOffsetX = style.shadowOffsetX
            ctx.shadowOffsetY = style.shadowOffsetY
        }
        if (type === 'text') {
            if (style.fontKerning) {
                ctx.fontKerning = style.fontKerning
            }
            if (style.fontVariant) {
                ctx.fontVariantCaps = style.fontVariant
            }
            if (style.fontKerning) {
                ctx.fontKerning = style.fontKerning
            }
            ctx.textBaseline = style.textBaseline
            ctx.textAlign = style.textAlign
            /* font-size font-family */
            //font: 1.2em "Fira Sans", sans-serif;

            /* font-size/line height font-family */
            //font: 1.2em/2 "Fira Sans", sans-serif;

            /* font-style font-weight font-size font-family */
            //font: italic bold 1.2em "Fira Sans", sans-serif;

            /* font-stretch font-variant font-size font-family */

            ctx.font = this.getFontString(style)
        }
    }
    renderFillText(obj: IRenderObject<'text'>) {
        const ctx = this.ctx
        const style = obj.style!
        const texts = obj.text.split('\n')
        const lineHeight = style.lineHeight * style.fontSize
        let y = 0
        for (let i = 0; i < texts.length; i++) {
            let text = texts[i]
            ctx.fillText(text, 0, y)
            y += lineHeight
        }
    }
    renderStrokeText(obj: IRenderObject<'text'>) {
        const ctx = this.ctx
        const style = obj.style!
        const texts = obj.text.split('\n')
        const lineHeight = style.lineHeight * style.fontSize
        let y = 0
        for (let i = 0; i < texts.length; i++) {
            let text = texts[i]
            ctx.strokeText(text, 0, y)
            y += lineHeight
        }
    }
    renderFillObject(obj: IRenderObject<keyof RenderObjectShape>) {
        const ctx = this.ctx
        if (obj.type === 'path') {
            ctx.fill(obj.path.applyContext() as Path2D, obj.style.fillRule)
        } else {
            ctx.fill(obj.style.fillRule)
        }
    }
    renderStrokeObject(obj: IRenderObject<keyof RenderObjectShape>) {
        const ctx = this.ctx
        if (obj.scaleStroke) {
            ctx.lineWidth = obj.style.lineWidth / obj.transform.worldScale
        }
        if (obj.type === 'path') {
            ctx.stroke(obj.path.applyContext() as Path2D)
        } else {
            ctx.stroke()
        }
    }

    renderObject(obj: IRenderObject<keyof RenderObjectShape>) {
        const ctx = this.ctx
        const style = obj.style!
        const worldMatrix = obj.transform.worldMatrix
        const clipPath = style.clipPath
        const clipObj = style.clipObj
        const hasClip = clipPath || clipObj
        const firstFill = obj.firstFill
        const hasFill = !!style.fillStyle
        const hasStroke = !!style.strokeStyle
        let clipMatrix;


        ctx.save()
        obj.beforeDraw?.(ctx)
        if (hasClip) {
            if (clipPath) {
                ctx.clip(clipPath)
            }
            if (clipObj) {
                const currentTransform = ctx.getTransform()
                const m = clipObj.transform.worldMatrix
                ctx.beginPath()
                ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5])
                obj.path.applyContext(ctx)
                ctx.clip()
                ctx.setTransform(currentTransform)
            }
        }
        ctx.beginPath()
        ctx.transform(worldMatrix[0], worldMatrix[1], worldMatrix[2], worldMatrix[3], worldMatrix[4], worldMatrix[5])

        this.applyObjectStyle(obj)
        if (obj.type === 'text') {
            if (firstFill) {
                hasFill && this.renderFillText(obj as IRenderObject<'text'>)
                hasStroke && this.renderStrokeText(obj as IRenderObject<'text'>)
            } else {
                hasStroke && this.renderStrokeText(obj as IRenderObject<'text'>)
                hasFill && this.renderFillText(obj as IRenderObject<'text'>)
            }
        } else if (obj.type === 'image') {
            if (obj.image) {
                ctx.drawImage(obj.image, 0, 0, obj.width, obj.height)

            }
        } else {
            this.buildShapePath(ctx, obj)
            if (firstFill) {
                hasFill && this.renderFillObject(obj)
                hasStroke && this.renderStrokeObject(obj)
            } else {
                hasStroke && this.renderStrokeObject(obj)
                hasFill && this.renderFillObject(obj)
            }
        }
        obj.draw?.(ctx)
        obj.afterDraw?.(ctx)
        ctx.restore()


    }


    public _getBatchKey(obj: IRenderObject<keyof RenderObjectShape>): string | null {
        const s = obj.style
        // 阴影活跃时不可合批（每次 fill/stroke 都需要独立 shadow）
        if (s.shadowBlur > 0) return null

        // 非居中描边需要 clip，不可合批
        // if (s.strokeAlign !== 'center' && s.strokeStyle) return null

        // lineDash 存在时不可合批（dashOffset 可能不同）
        if (s.lineDash && s.lineDash.length > 0) return null


        // 渐变/图案不可合批（参考语义复杂）
        if (s.fillStyle && typeof s.fillStyle !== 'string') return null
        if (s.strokeStyle && typeof s.strokeStyle !== 'string') return null

        // 序列化纯色填充样式
        const fillKey = s.fillStyle ?? 'none'

        // 序列化纯色描边样式
        const strokeKey = s.strokeStyle ?? 'none'
        return [
            fillKey,
            strokeKey,
            s.globalAlpha ?? 1,
            s.globalCompositeOperation ?? 'source-over',
            s.fillRule ?? 'nonzero',
            s.lineWidth ?? 0,
            s.lineCap ?? 'butt',
            s.lineJoin ?? 'miter',
            s.miterLimit ?? 10,
            obj.firstFill ? '1' : '0',
            // s.closePath ? '1' : '0',
        ].join('|')
    }
    batchRenderObjects(objects: IRenderObject<keyof RenderObjectShape>[]) {
        let prevBatchKey = null
        const batchList: IRenderObject<keyof RenderObjectShape>[] = []
        let list = objects.slice()
        const flushBatch = () => {
            if (!batchList.length) {
                return
            }
            if (batchList.length === 1) {
                this.renderObject(batchList[0])
                return
            }
            const ctx = this.ctx
            let len = batchList.length
            const firstObj = batchList[0]
            const style = firstObj.style!
            const firstFill = firstObj.firstFill
            const hasFill = !!style.fillStyle
            const hasStroke = !!style.strokeStyle
            const fillRule = style.fillRule

            ctx.save()
            ctx.beginPath()
            this.applyObjectStyle(firstObj)
            const dpr = this.dpr
            const m = Matrix2D.pool.get()
            for (let i = 0; i < len; i++) {
                const obj = batchList[i]
                m.fromScale(dpr, dpr)
                m.multiply(obj.transform.worldMatrix)
                obj.beforeDraw?.(ctx)
                ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5])
                this.buildShapePath(ctx, obj)
                obj.afterDraw?.(ctx)
            }

            if (firstFill) {
                hasFill && ctx.fill(fillRule)
                hasStroke && ctx.stroke()
            } else {
                hasStroke && ctx.stroke()
                hasFill && ctx.fill(fillRule)
            }
            ctx.restore()
            batchList.length = 0
            Matrix2D.pool.release(m)
        }
        while (list.length) {
            const obj = list.shift()
            if (obj.type === 'group' && obj.visible) {
                list = obj.children.concat(list)
            } else if (obj.visible && obj.style.globalAlpha > 0) {
                if (obj.type === 'text' || obj.type === 'path') {
                    flushBatch()
                    this.renderObject(obj)
                    continue
                }
                const batchKey = obj._batchKey || (obj._batchKey = this._getBatchKey(obj))
                if (batchKey === null) {
                    flushBatch()
                    this.renderObject(obj)

                } else {
                    if (batchKey !== prevBatchKey) {
                        flushBatch()
                    }
                    prevBatchKey = batchKey
                    batchList.push(obj)
                }
            }
        }
        flushBatch()
    }
    renderObjects(objects: IRenderObject<keyof RenderObjectShape>[]) {
        // let queue = objects.slice()
        // while (queue.length) {
        //     const obj = queue.shift()
        //     if (obj.type === 'group' && obj.visible) {
        //         queue = obj.children.concat(queue)
        //     } else if (obj.visible && obj.style.globalAlpha > 0) {
        //         this.renderObject(obj)
        //     }
        // }
        let i = 0, len = objects.length
        while (i < len) {
            const obj = objects[i++]
            obj.onUpdate?.()
            if (obj.type === 'group' && obj.visible) {
                this.renderObjects(obj.children)
            } else if (obj.visible && obj.style.globalAlpha > 0) {
                this.renderObject(obj)
            }
        }
    }
    render() {
        this.clearRect()
        const ctx = this.ctx
        ctx.save()
        if (this.dpr !== 1) {
            ctx.scale(this.dpr, this.dpr)
        }
        this.emit('render:before',this)
        this.renderObjects(this.objects)
        this.emit('render:after',this)
        ctx.restore()
    }
    private needUpdate=true
    private delta=0
    private lastTime=0
    refresh(){
        this.needUpdate=true
    }
    private tick(time:number){
        this.delta=time-this.lastTime
        this.lastTime=time
        this.emit('tick',this.delta)
        if(this.needUpdate){
            this.needUpdate=false
            this.render()
        }
        this.animationRef=requestAnimationFrame(this.tick)
    }
}