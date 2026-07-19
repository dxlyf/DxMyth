
import { Scene } from "src/core/Scene"
import { ElementFlag } from "src/core/ElementFlags"
import { ConicGradient, LinearGradient, RadialGradient } from "src/core/Gradient"
import { ImagePattern } from "src/core/Pattern"
import { FillStyle, Renderer, StrokeStyle, type RendererProps } from "src/core/Renderer"
import { Shape } from "src/core/Shape"
import { Color, ColorValue, Matrix2D } from "@dxyl/math2"
import { ck, type CanvasKit } from "src/ck"
import { CKPath2D } from "src/ck"
import { toCKLineCap, toCKLineJoin } from "src/ck/convert"


export type CanvasKitRendererProps = RendererProps & {
    canvas?: HTMLCanvasElement
    backgroundColor?: ColorValue
}


/**
 * 基于 canvaskit-wasm (Skia WASM) 的渲染器。
 *
 * 与 CanvasRenderer 实现同一套 Renderer 抽象契约，使 Engine 通过
 * `renderType: 'canvaskit'` 即可切换到 Skia 渲染。
 *
 * 核心模型:
 *   - 路径累积器 `_currentPath: CKPath2D`：路径型 shape 经 renderer.rect/ellipse 等
 *     方法构建到此；渲染时取其 fillPath/strokePath。
 *   - 显式路径 `_explicitPath`：GraphicPath 经 drawPath() 设定，直接复用 shape 自有
 *     CKPath2D 的缓存 fillPath/strokePath，避免重建。
 *   - paint/font 按 ElementFlag.STYLE 脏标记构建并缓存到 shape._cache，重建前 delete
 *     旧对象以防 CanvasKit 对象泄漏。
 *   - strokeAlign: center 用 Stroke 样式 paint 直画 fillPath（支持 dash/cap/join）；
 *     inside/outside 用 Fill 样式 paint 画 CKPath2D.strokePath 预计算区域。
 *   - opacity: CanvasKit 无 globalAlpha，用 saveLayer(alphaf paint) 实现图层级透明度。
 *
 * v1 限制见计划文档「假设与限制」：字体仅默认 Typeface（fontFamily/weight/italic/
 * letterSpacing 不生效）；clipRule 用 clipPath 自身 fillRule；lineDash 仅 center 支持；
 * blend 混合模式暂按 source-over；maxWidth 用水平缩放近似；textBaseline 用 FontMetrics
 * 近似映射。
 */
export class CanvasKitRenderer extends Renderer<CanvasKitRendererProps> {

    type = "CanvasKitRenderer"
    declare domElement: HTMLCanvasElement

    surface: CanvasKit.Surface
    canvas: CanvasKit.Canvas

    // 路径累积器：shape.draw() 通过 renderer.rect/ellipse 等方法构建到这里
    private _currentPath: CKPath2D
    // drawPath() 显式指定路径（GraphicPath 走此分支）
    private _explicitPath: CKPath2D | null = null
    // 当前正在渲染的 shape（供 drawPath/fillText/drawImage 读取 style）
    private _currentShape: Shape | null = null
    // 当前 paint（每个 shape 按 style 构建并缓存到 shape._cache）
    private _fillPaint: CanvasKit.Paint
    private _strokePaint: CanvasKit.Paint
    // 当前字体（文本用）
    private _font: CanvasKit.Font
    // 缓存的 clear 用透明色
    private _transparent: CanvasKit.Color
    // 默认 typeface（canvaskit-wasm 无内置字体，需异步加载 TTF）
    private _defaultTypeface: CanvasKit.Typeface | null = null
    // typeface 代际：加载完成后自增，用于使已缓存 Font 失效重建
    private _typefaceGen = 0
    private _typefaceLoading = false

    // ==================== 批量渲染（按颜色分组降 draw call） ====================
    // 批量 PathBuilder：同色 batchable shape 累积几何到此，detach 取 Path 后一次 drawPath
    private _batchPathBuilder: CanvasKit.PathBuilder
    // 批量 paint：纯色 fill，按组切换 color
    private _batchPaint: CanvasKit.Paint
    // 按颜色分组的 batchable shape 列表：key = Color.toCSS_RGBA(color)，value = {color, shapes}
    private _batchGroups: Map<string, { color: Color, shapes: Shape[] }> = new Map()
    // 暂存的 batch key 顺序（保持首次出现顺序，避免 Map 遍历顺序不确定性影响）
    private _batchKeys: string[] = []
    // 非 batchable shape 列表（走原 renderShape 路径）
    private _deferredList: Shape[] = []
    // 复用的 rect buffer（避免每元素 new Float32Array）
    private _batchRectBuf: Float32Array = new Float32Array(4)

    constructor(props?: Partial<CanvasKitRendererProps>) {
        super(props)
    }

    async init() {
        this.domElement = this.props.canvas || document.createElement('canvas')
        this.domElement.style.margin = '0'
        this.domElement.style.padding = '0'
        this.domElement.style.display = 'block'
        // 预设 canvas 尺寸：MakeWebGLCanvasSurface 首次创建 GL context 时会读取
        // canvas.width/height 作为 framebuffer 尺寸，预设可避免首帧用 300x150 的默认尺寸。
        const dpr = this.dpr || 1
        const initW = (this.props.width && this.props.width > 0) ? Math.floor(this.props.width * dpr) : 0
        const initH = (this.props.height && this.props.height > 0) ? Math.floor(this.props.height * dpr) : 0
        if (initW > 0 && initH > 0) {
            this.domElement.width = initW
            this.domElement.height = initH
        }
        this._initSurface()
        this._currentPath = new CKPath2D()
        this._transparent = ck.Color4f(0, 0, 0, 0)
        // 批量渲染资源：PathBuilder 复用（detach 自动重置），Paint 复用
        this._batchPathBuilder = new ck.PathBuilder()
        this._batchPaint = new ck.Paint()
        this._batchPaint.setAntiAlias(false) // 矩形批量无需抗锯齿，省 GPU 开销
        this._batchPaint.setStyle(ck.PaintStyle.Fill)
        if (!this.domElement.parentNode) {
            this.engine.containerDom.appendChild(this.domElement)
        }
        // 异步加载默认字体（不阻塞 init）；加载完成后 refresh 触发重绘渲染文本
        this._loadDefaultTypeface()
        console.log('[CanvasKitRenderer] init done, canvas size:', this.domElement.width, 'x', this.domElement.height)
    }

    private _initSurface(): void {
        this.surface?.delete()
        const expectedW = this.domElement.width
        const expectedH = this.domElement.height
        this.surface = ck.MakeWebGLCanvasSurface(this.domElement)
        // MakeWebGLCanvasSurface 首次为 canvas 创建 GL context 时，浏览器会重置 canvas
        // 尺寸到默认 300x150（创建新 context 的副作用），导致 surface 用错误尺寸创建。
        // 此时 GL context 已存在，恢复 canvas 尺寸后再次创建 surface 不会再被重置。
        if (this.domElement.width !== expectedW || this.domElement.height !== expectedH) {
            console.warn('[CanvasKitRenderer] canvas reset by GL context creation:', expectedW, 'x', expectedH, '->', this.domElement.width, 'x', this.domElement.height, ', restoring and recreating surface')
            this.domElement.width = expectedW
            this.domElement.height = expectedH
            this.surface?.delete()
            this.surface = ck.MakeWebGLCanvasSurface(this.domElement)
        }
        if (!this.surface) {
            throw new Error('CanvasKitRenderer: MakeCanvasSurface failed (WebGL unavailable)')
        }
        this.canvas = this.surface.getCanvas()
    }

    /**
     * 异步加载默认 typeface。canvaskit-wasm 的 Typeface.GetDefault() 返回 null（WASM 构建无内置字体），
     * 需自行 fetch TTF 并通过 MakeTypefaceFromData 构造。加载成功后自增 _typefaceGen 并 refresh 触发重绘。
     * 字体文件位于 public/arial.ttf，由 Vite 静态服务在 BASE_URL/arial.ttf。
     */
    private async _loadDefaultTypeface(): Promise<void> {
        if (this._defaultTypeface || this._typefaceLoading) return
        this._typefaceLoading = true
        try {
            const response = await fetch(`${import.meta.env.BASE_URL}arial.ttf`)
            if (!response.ok) {
                console.warn('[CanvasKitRenderer] default typeface fetch failed:', response.status)
                return
            }
            const buffer = await response.arrayBuffer()
            // canvaskit-wasm 运行时接受 Uint8Array，类型定义声明为 ArrayBuffer，此处用 any 绕过
            const typeface = ck.Typeface.MakeTypefaceFromData(new Uint8Array(buffer) as any)
            if (typeface) {
                this._defaultTypeface = typeface
                this._typefaceGen++
                console.log('[CanvasKitRenderer] default typeface loaded')
                this.engine?.refresh()
            } else {
                console.warn('[CanvasKitRenderer] MakeTypefaceFromData returned null')
            }
        } catch (e) {
            console.warn('[CanvasKitRenderer] failed to load default typeface:', e)
        } finally {
            this._typefaceLoading = false
        }
    }

    updateViewSize(width: number, height: number) {
        const prevW = this.domElement.width
        const prevH = this.domElement.height
        this.domElement.width = this.width
        this.domElement.height = this.height
        this.domElement.style.width = `${width}px`
        this.domElement.style.height = `${height}px`
        // CanvasKit WebGL surface 在创建时绑定 canvas 尺寸；canvas 尺寸变化后需重建 surface，
        // 否则 GL framebuffer 仍为旧尺寸，渲染会被裁剪到旧尺寸区域。
        if (this.surface && (prevW !== this.domElement.width || prevH !== this.domElement.height)) {
            this._initSurface()
        }
    }

    /** 释放 CanvasKit 原生对象。由 Engine.destroy 末尾安全调用。 */
    dispose(): void {
        this._currentPath?.delete()
        this._currentPath = undefined as any
        this._batchPathBuilder?.delete()
        this._batchPathBuilder = undefined as any
        this._batchPaint?.delete()
        this._batchPaint = undefined as any
        this._batchGroups.clear()
        this._batchKeys.length = 0
        this._deferredList.length = 0
        this._defaultTypeface?.delete()
        this._defaultTypeface = null
        this.surface?.delete()
        this.surface = undefined as any
        this.canvas = undefined as any
    }

    // ==================== 矩阵转换 ====================

    /**
     * Matrix2D [a,b,c,d,e,f] = [scaleX, skewY, skewX, scaleY, tx, ty]
     * → CanvasKit Matrix3x3 (行优先) [scaleX, skewX, tx, skewY, scaleY, ty, 0, 0, 1]
     * 返回 number[] 兼容 InputMatrix。
     */
    private _toCKMatrix(m: Matrix2D): number[] {
        return [m[0], m[2], m[4], m[1], m[3], m[5], 0, 0, 1]
    }

    // ==================== 路径方法（累积器模型） ====================

    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void {
        this._currentPath.arc(x, y, radius, startAngle, endAngle, counterclockwise)
    }
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        this._currentPath.arcTo(x1, y1, x2, y2, radius)
    }
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
        this._currentPath.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    }
    closePath(): void {
        this._currentPath.closePath()
    }
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void {
        this._currentPath.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise)
    }
    lineTo(x: number, y: number): void {
        this._currentPath.lineTo(x, y)
    }
    moveTo(x: number, y: number): void {
        this._currentPath.moveTo(x, y)
    }
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
        this._currentPath.quadraticCurveTo(cpx, cpy, x, y)
    }
    rect(x: number, y: number, w: number, h: number): void {
        this._currentPath.rect(x, y, w, h)
    }
    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]): void {
        this._currentPath.roundRect(x, y, w, h, radii)
    }

    drawPath(path: CKPath2D): void {
        // GraphicPath 走此分支：直接复用 shape 自有 CKPath2D 的缓存 fillPath/strokePath
        this._explicitPath = path
    }

    // ==================== 渲染主循环 ====================

    render(scene: Scene): void {
        const renderList = scene.getRenderElements(this.viewport, true) as Shape[]
        this._renderBefore()
        // 批量渲染：扫描 batchable shape 按颜色分组，一次 drawPath 绘制同色元素；
        // 非 batchable shape 走原 renderShape 路径。
        // 顺序简化：所有 batchable 先画（底层），所有 non-batchable 后画（上层）。
        this._collectBatches(renderList)
        this._flushBatches()
        for (let i = 0, len = this._deferredList.length; i < len; i++) {
            const shape = this._deferredList[i]
            try {
                shape.render(this)
            } catch (err) {
                console.error(`[CanvasKitRenderer] render failed (${shape?.type}):`, err)
                break
            }
        }
        this._renderAfter()
    }

    /**
     * 扫描 renderList，将 batchable shape 按填充颜色分组收集，non-batchable 入 deferredList。
     * 每帧开始前清空上一帧的分组（复用 Map/Array 容器避免 GC）。
     */
    private _collectBatches(renderList: Shape[]): void {
        this._batchGroups.clear()
        this._batchKeys.length = 0
        this._deferredList.length = 0
        for (let i = 0, len = renderList.length; i < len; i++) {
            const shape = renderList[i]
            if (!shape.isBatchable || !shape.isBatchable()) {
                this._deferredList.push(shape)
                continue
            }
            // batch key：纯色 fillStyle.value 是 Color 对象，用 CSS RGBA 字符串作 key
            const color = (shape.style.fillStyle as any).value as Color
            const key = Color.toCSS_RGBA(color)
            let group = this._batchGroups.get(key)
            if (!group) {
                group = { color, shapes: [] }
                this._batchGroups.set(key, group)
                this._batchKeys.push(key)
            }
            group.shapes.push(shape)
        }
    }

    /**
     * 按颜色分组批量绘制：每组用 PathBuilder 累积 world 坐标矩形，detach 取 Path 后一次 drawPath。
     * worldMatrix 纯平移已由 isBatchable 保证，平移量 (m[4], m[5]) 烘焙到 rect 坐标。
     */
    private _flushBatches(): void {
        if (this._batchKeys.length === 0) return
        const canvas = this.canvas
        const pb = this._batchPathBuilder
        const paint = this._batchPaint
        const buf = this._batchRectBuf
        for (let k = 0, klen = this._batchKeys.length; k < klen; k++) {
            const group = this._batchGroups.get(this._batchKeys[k])!
            const shapes = group.shapes
            const n = shapes.length
            if (n === 0) continue
            for (let i = 0; i < n; i++) {
                const shape = shapes[i] as any
                const s = shape.props.shape
                const m = shape.worldMatrix
                const tx = m[4]
                const ty = m[5]
                // LTRB [l, t, r, b]
                buf[0] = s.x + tx
                buf[1] = s.y + ty
                buf[2] = s.x + s.width + tx
                buf[3] = s.y + s.height + ty
                pb.addRect(buf)
            }
            const path = pb.detach() // 取出 Path，PathBuilder 自动重置
            paint.setColor(group.color)
            canvas.drawPath(path, paint)
            path.delete()
        }
    }

    private _renderBefore(): void {
        const canvas = this.canvas
        canvas.clear(this._transparent)
        canvas.save()
        const vm = Matrix2D.pool.get()
        vm.fromScale(this.dpr, this.dpr)
        vm.multiply(this.viewport.getWorldToScreenMatrix())
        if (!vm.isIdentity()) {
            canvas.concat(this._toCKMatrix(vm))
        }
        Matrix2D.pool.release(vm)
    }

    private _renderAfter(): void {
        const canvas = this.canvas
        canvas.restore()
        if (this.props.backgroundColor) {
            const bg = Color.fromInput(this.props.backgroundColor as any)
            const bgPaint = new ck.Paint()
            bgPaint.setAntiAlias(false)
            bgPaint.setStyle(ck.PaintStyle.Fill)
            bgPaint.setColor(bg)
            bgPaint.setBlendMode(ck.BlendMode.DstATop)
            canvas.drawRect(ck.LTRBRect(0, 0, this.width, this.height), bgPaint)
            bgPaint.delete()
        }
        this.surface.flush()
    }

    // ==================== Shape 渲染 ====================

    renderShape(shape: Shape): void {
        const canvas = this.canvas
        canvas.save()
        // transform
        const m = shape.worldMatrix
        if (!m.isIdentity()) {
            canvas.concat(this._toCKMatrix(m))
        }
        // opacity: 用 saveLayer + alphaf paint
        const opacity = shape.style.opacity ?? 1
        if (opacity < 1) {
            const lp = new ck.Paint()
            lp.setAlphaf(opacity)
            canvas.saveLayer(lp)
            lp.delete()
        }
        // clipPath
        this._applyClipPath(shape)
        // 配置累积器
        this._currentShape = shape
        this._explicitPath = null
        this._currentPath.reset()
        this._currentPath.setFillRule(shape.style.fillRule || 'nonzero')
        this._currentPath.setStroke({
            lineWith: shape.style.lineWidth,
            lineCap: shape.style.lineCap,
            lineJoin: shape.style.lineJoin,
            miterLimit: shape.style.miterLimit,
            strokeAlign: shape.style.strokeAlign,
        })
        // 构建 paint（缓存到 shape._cache）
        this._buildPaints(shape)
        // shape.draw: 路径型 shape 在此构建路径或设 _explicitPath
        shape.draw(this)
        // 渲染累积/显式路径
        this._renderCurrentPath(shape)
        if (opacity < 1) canvas.restore()
        canvas.restore()
    }

    private _renderCurrentPath(shape: Shape): void {
        const path = this._explicitPath || this._currentPath
        const st = shape.style
        const hasFill = !!st.fillStyle
        const hasStroke = !!st.strokeStyle && (st.lineWidth ?? 0) > 0
        if (!hasFill && !hasStroke) return
        const fillPath = path.fillPath
        const center = st.strokeAlign !== 'inside' && st.strokeAlign !== 'outside'
        const drawFill = () => this.canvas.drawPath(fillPath, this._fillPaint)
        const drawStroke = () => {
            if (center) {
                // _strokePaint: Stroke 样式，直画 fillPath（支持 dash/cap/join/miter）
                this.canvas.drawPath(fillPath, this._strokePaint)
            } else {
                // _strokePaint: Fill 样式，画 CKPath2D.strokePath 预计算区域
                this.canvas.drawPath(path.strokePath, this._strokePaint)
            }
        }
        if (st.firstStroke) {
            if (hasStroke) drawStroke()
            if (hasFill) drawFill()
        } else {
            if (hasFill) drawFill()
            if (hasStroke) drawStroke()
        }
    }

    // ==================== Paint 构建 ====================

    private _buildPaints(shape: Shape): void {
        const cache = shape._cache
        const st = shape.style
        const dirty = shape.flags.has(ElementFlag.STYLE) || !cache._ckFillPaint
        if (dirty) {
            cache._ckFillPaint?.delete()
            cache._ckStrokePaint?.delete()
            cache._ckFillShader?.delete(); cache._ckFillShader = null
            cache._ckStrokeShader?.delete(); cache._ckStrokeShader = null

            // fill paint
            const fp = new ck.Paint()
            fp.setAntiAlias(true)
            fp.setStyle(ck.PaintStyle.Fill)
            this._applyFillToPaint(fp, st.fillStyle, cache, '_ckFillShader')
            cache._ckFillPaint = fp

            // stroke paint（按 align 决定样式）
            const sp = new ck.Paint()
            sp.setAntiAlias(true)
            const center = st.strokeAlign !== 'inside' && st.strokeAlign !== 'outside'
            if (center) {
                sp.setStyle(ck.PaintStyle.Stroke)
                sp.setStrokeWidth(st.lineWidth ?? 1)
                sp.setStrokeCap(toCKLineCap(st.lineCap || 'butt'))
                sp.setStrokeJoin(toCKLineJoin(st.lineJoin || 'miter'))
                sp.setStrokeMiter(st.miterLimit ?? 10)
                if (st.lineDash && st.lineDash.length) {
                    const pe = ck.PathEffect.MakeDash(st.lineDash, st.lineDashOffset || 0)
                    if (pe) {
                        sp.setPathEffect(pe)
                        pe.delete()
                    }
                }
            } else {
                // inside/outside: 画预计算 strokePath 区域
                sp.setStyle(ck.PaintStyle.Fill)
            }
            this._applyFillToPaint(sp, st.strokeStyle, cache, '_ckStrokeShader')
            cache._ckStrokePaint = sp
        }
        this._fillPaint = cache._ckFillPaint
        this._strokePaint = cache._ckStrokePaint
    }

    private _applyFillToPaint(
        paint: CanvasKit.Paint,
        fillStyle: FillStyle | StrokeStyle,
        cache: any,
        shaderKey: string,
    ): void {
        if (!fillStyle) {
            paint.setColorComponents(0, 0, 0, 0)
            return
        }
        if (fillStyle.type === 'color') {
            const c = (fillStyle as any).value as Color
            paint.setColor(c)
        } else if (fillStyle.type === 'gradient') {
            const shader = this._makeGradientShader(fillStyle as LinearGradient | RadialGradient | ConicGradient)
            if (shader) {
                cache[shaderKey] = shader
                paint.setShader(shader)
            }
        } else if (fillStyle.type === 'pattern' && (fillStyle as ImagePattern).source) {
            const shader = this._makePatternShader(fillStyle as ImagePattern)
            if (shader) {
                cache[shaderKey] = shader
                paint.setShader(shader)
            }
        }
    }

    private _makeGradientShader(g: LinearGradient | RadialGradient | ConicGradient): CanvasKit.Shader | null {
        const stops = g.stops
        if (!stops || !stops.length) return null
        // Color extends Float32Array，Float32Array[] 符合 InputFlexibleColorArray
        const colors = stops.map(s => s.color as Float32Array)
        const pos = stops.map(s => s.offset)
        // gradient.matrix 直接传给工厂方法的 localMatrix 参数（Shader 无 makeWithLocalMatrix）
        const lm = (g.matrix && !g.matrix.isIdentity()) ? this._toCKMatrix(g.matrix) : undefined
        let shader: CanvasKit.Shader | null = null
        if (g.elementType === 'linear-gradient') {
            const lg = g as LinearGradient
            shader = ck.Shader.MakeLinearGradient(
                [lg.x0, lg.y0], [lg.x1, lg.y1], colors, pos, ck.TileMode.Clamp, lm,
            )
        } else if (g.elementType === 'radial-gradient') {
            const rg = g as RadialGradient
            shader = ck.Shader.MakeTwoPointConicalGradient(
                [rg.x0, rg.y0], rg.r0, [rg.x1, rg.y1], rg.r1, colors, pos, ck.TileMode.Clamp, lm,
            )
        } else {
            // conic-gradient：CanvasKit sweep 用度数，ConicGradient.startAngle 为弧度，需转换
            const cg = g as ConicGradient
            const startDeg = cg.startAngle * 180 / Math.PI
            shader = ck.Shader.MakeSweepGradient(
                cg.x, cg.y, colors, pos, ck.TileMode.Clamp, lm, 0, startDeg, startDeg + 360,
            )
        }
        return shader
    }

    private _makePatternShader(p: ImagePattern): CanvasKit.Shader | null {
        let img = (p as any)._ckImage as CanvasKit.Image | undefined
        if (!img) {
            img = ck.MakeImageFromCanvasImageSource(p.source)
            if (!img) return null
            ;(p as any)._ckImage = img
        }
        const r = p.repeat || 'repeat'
        const tmx = (r === 'repeat' || r === 'repeat-x') ? ck.TileMode.Repeat : ck.TileMode.Decal
        const tmy = (r === 'repeat' || r === 'repeat-y') ? ck.TileMode.Repeat : ck.TileMode.Decal
        return img.makeShaderOptions(tmx, tmy, ck.FilterMode.Linear, ck.MipmapMode.None)
    }

    // ==================== clipPath ====================

    private _applyClipPath(shape: Shape): void {
        const clip = shape.props.clipPath as any
        if (!clip) return
        let ckPath: CKPath2D | null = null
        if (clip instanceof CKPath2D) {
            ckPath = clip
        } else if (clip instanceof Shape) {
            clip.updateBuildPath()
            ckPath = clip.path
        }
        if (ckPath) {
            // v1: 直接用 clipPath 自身 fillRule（fillPath 的 FillType），不单独应用 clipRule
            this.canvas.clipPath(ckPath.fillPath, ck.ClipOp.Intersect, true)
        }
    }

    // ==================== Image 渲染 ====================

    renderImage(shape: Shape): void {
        const canvas = this.canvas
        canvas.save()
        const m = shape.worldMatrix
        if (!m.isIdentity()) {
            canvas.concat(this._toCKMatrix(m))
        }
        const opacity = shape.style.opacity ?? 1
        if (opacity < 1) {
            const lp = new ck.Paint()
            lp.setAlphaf(opacity)
            canvas.saveLayer(lp)
            lp.delete()
        }
        this._applyClipPath(shape)
        this._currentShape = shape
        // shape.draw 调 renderer.drawImage
        shape.draw(this)
        if (opacity < 1) canvas.restore()
        canvas.restore()
    }

    drawImage(image: CanvasImageSource, dx: number, dy: number): void
    drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void
    drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void
    drawImage(image: unknown, sx: unknown, sy: unknown, sw?: unknown, sh?: unknown, dx?: unknown, dy?: unknown, dw?: unknown, dh?: unknown): void {
        const shape = this._currentShape
        if (!shape) return
        const cache = shape._cache
        let img = cache._ckImage as CanvasKit.Image | undefined
        if (!img || cache._ckImageSrc !== image) {
            img?.delete()
            img = ck.MakeImageFromCanvasImageSource(image as CanvasImageSource)
            cache._ckImage = img
            cache._ckImageSrc = image
        }
        if (!img) return
        const canvas = this.canvas
        const paint = new ck.Paint()
        paint.setAntiAlias(true)
        const iw = img.width()
        const ih = img.height()
        try {
            if (sw === undefined) {
                // 3-arg：原尺寸绘制于 (dx, dy)
                canvas.drawImage(img, sx as number, sy as number, paint)
            } else if (dx === undefined) {
                // 5-arg：缩放到 (dw, dh)
                canvas.drawImageRect(
                    img,
                    ck.LTRBRect(0, 0, iw, ih),
                    ck.LTRBRect(sx as number, sy as number, (sx as number) + (sw as number), (sy as number) + (sh as number)),
                    paint,
                )
            } else {
                // 9-arg：源裁剪 + 目标
                canvas.drawImageRect(
                    img,
                    ck.LTRBRect(sx as number, sy as number, (sx as number) + (sw as number), (sy as number) + (sh as number)),
                    ck.LTRBRect(dx as number, dy as number, (dx as number) + (dw as number), (dy as number) + (dh as number)),
                    paint,
                )
            }
        } finally {
            paint.delete()
        }
    }

    // ==================== Text 渲染 ====================

    renderText(shape: Shape): void {
        const canvas = this.canvas
        canvas.save()
        const m = shape.worldMatrix
        if (!m.isIdentity()) {
            canvas.concat(this._toCKMatrix(m))
        }
        const opacity = shape.style.opacity ?? 1
        if (opacity < 1) {
            const lp = new ck.Paint()
            lp.setAlphaf(opacity)
            canvas.saveLayer(lp)
            lp.delete()
        }
        this._applyClipPath(shape)
        this._currentShape = shape
        // 文本颜色用 fill/stroke paint
        this._buildPaints(shape)
        // 构建字体
        this.applyTextStyle(shape)
        // shape.draw 调 renderer.fillText/strokeText
        shape.draw(this)
        if (opacity < 1) canvas.restore()
        canvas.restore()
    }

    applyTextStyle(shape: Shape): void {
        const cache = shape._cache
        const st = shape.style
        // typeface 代际变化（异步加载完成后）时强制重建 Font
        const dirty = shape.flags.has(ElementFlag.STYLE) || !cache._ckFont || cache._ckFontTypefaceGen !== this._typefaceGen
        if (dirty) {
            cache._ckFont?.delete()
            // v1: 默认 typeface（异步加载的 Roboto）。fontFamily/fontWeight/italic 需加载对应
            // 字体文件，v1 不支持。letterSpacing: canvaskit-wasm 0.41 的 Font 无 setLetterSpacing，v1 忽略。
            cache._ckFont = new ck.Font(this._defaultTypeface, st.fontSize || 16)
            cache._ckFontTypefaceGen = this._typefaceGen
        }
        this._font = cache._ckFont
    }

    measureText(text: string): TextMetrics {
        if (!this._font || !text) {
            return { width: 0 } as TextMetrics
        }
        const w = this._measureWidth(this._font, text)
        return { width: w } as TextMetrics
    }

    fillText(text: string, x: number, y: number, maxWidth?: number): void {
        this._drawText(text, x, y, maxWidth, this._fillPaint)
    }

    strokeText(text: string, x: number, y: number, maxWidth?: number): void {
        this._drawText(text, x, y, maxWidth, this._strokePaint)
    }

    private _drawText(
        text: string,
        x: number,
        y: number,
        maxWidth: number | undefined,
        paint: CanvasKit.Paint,
    ): void {
        if (!text || !this._font || !paint) return
        const st = this._currentShape?.style
        const font = this._font
        let dx = 0, dy = 0
        if (st) {
            const w = this._measureWidth(font, text)
            if (st.textAlign === 'center') dx = -w / 2
            else if (st.textAlign === 'right' || st.textAlign === 'end') dx = -w
            const fm = font.getMetrics() // ascent<0, descent>0
            const tb = st.textBaseline
            if (tb === 'top') {
                dy = -fm.ascent
            } else if (tb === 'middle') {
                // 垂直居中：使 (ascent+descent) 中点对齐 y
                dy = (fm.descent - fm.ascent) / 2 - fm.descent
            } else if (tb === 'bottom') {
                dy = -fm.descent
            } else if (tb === 'hanging') {
                dy = -fm.ascent * 0.7
            }
            // 'alphabetic' / 'ideographic': dy = 0
        }
        // maxWidth: 水平缩放近似（CanvasKit 无原生 maxWidth）
        if (maxWidth && maxWidth > 0) {
            const tw = this._measureWidth(font, text)
            if (tw > maxWidth) {
                const s = maxWidth / tw
                const canvas = this.canvas
                canvas.save()
                canvas.concat([s, 0, 0, 0, 1, 0, 0, 0, 1])
                canvas.drawText(text, (x + dx) / s, y + dy, paint, font)
                canvas.restore()
                return
            }
        }
        this.canvas.drawText(text, x + dx, y + dy, paint, font)
    }

    private _measureWidth(font: CanvasKit.Font, text: string): number {
        const glyphs = font.getGlyphIDs(text)
        const widths = font.getGlyphWidths(glyphs)
        let sum = 0
        for (let i = 0; i < widths.length; i++) sum += widths[i]
        return sum
    }
}
