
import { BoundingRect, Color } from '@dxyl/math2'
import { Element, type ElementProps } from './Element'
import { Renderer, type RenderStyle } from 'src/core/Renderer'
import type { Paintolor, Gradient, Pattern, ColorValue, FillRule } from 'src/core/Renderer'
import { ElementFlag } from './ElementFlags'
import { CKPath2D } from 'src/ck'

type FillStyle = ColorValue | Gradient | Pattern
type StrokeStyle = ColorValue | Gradient | Pattern
export type ShapeStyle = Omit<RenderStyle, 'fillStyle' | 'strokeStyle' | 'shadowColor'> & {
    fillStyle?: FillStyle
    strokeStyle?: StrokeStyle
    shadowColor?: ColorValue
}
export type ShapeProps<ShapeExtraProps extends Record<string, any> = {}> = ElementProps & {
    shape?: ShapeExtraProps
    style?: ShapeStyle
    /** 裁剪路径：可以为 CKPath2D 或另一个 Shape（取其 fillPath） */
    clipPath?: CKPath2D | Shape
    /** 裁剪时使用的填充规则，默认 nonzero */
    clipRule?: FillRule
}
const STROKE_STATE_PROPERTIES = new Set(['lineWidth', 'lineCap', 'lineJoin', 'miterLimit', 'strokeAlign'])
export abstract class Shape<Props extends ShapeProps = ShapeProps> extends Element<Props> {
    type = "DisplayObject"
    path: CKPath2D
    /** 缓存的裁剪用 Path2D（Canvas API） */
    _clipPath2DCache: Path2D | null = null
    _clipPathDirty: boolean = true
    constructor(props: Props) {
        super(props)

        this.path = new CKPath2D()
        this.path.setFillRule(this.props.style.fillRule)
        this.setStyles(this.props.style || {})
        this.setShapes(this.props.shape || {})
    }
    get style(): RenderStyle {
        return this.props.style as RenderStyle
    }
    get shape(): Props['shape'] {
        return this.props.shape
    }
    /** 裁剪路径 */
    get clipPath(): Props['clipPath'] {
        return this.props.clipPath
    }
    set clipPath(value: Props['clipPath']) {
        if (this.props.clipPath !== value) {
            this.props.clipPath = value
            this._clipPathDirty = true
            this.flags.add(ElementFlag.REPAINT)
        }
    }
    get clipRule(): Props['clipRule'] {
        return this.props.clipRule
    }
    set clipRule(value: Props['clipRule']) {
        if (this.props.clipRule !== value) {
            this.props.clipRule = value
            this._clipPathDirty = true
            this.flags.add(ElementFlag.REPAINT)
        }
    }
    setFillRule(fillRule: FillRule) {
        this.path.setFillRule(fillRule)
        this.setStyle('fillRule', fillRule)
    }

    getDefaultProps(): Partial<Props>[] {
        return [
            ...super.getDefaultProps(),
            {
                style: {
                    fillStyle: '#000',
                    strokeStyle: 'none',
                    strokeAlign: 'center',
                    firstStroke: false,
                    lineWidth: 1,
                    lineCap: 'butt',
                    lineJoin: 'miter',
                    miterLimit: 10,
                    fillRule: 'nonzero',
                    lineDashOffset: 0,
                    closePath: false,
                    // shadow
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    blend: 'source-over',
                    opacity: 1
                }
            }
        ] as Partial<Props>[]
    }
    setStyle<K extends keyof ShapeStyle>(name: K, value: ShapeStyle[K], forceUpdate = false) {
        const oldValue = (this.props.style as any)[name]
        let newValue: any = value
        if (name === 'fillStyle' || name === 'strokeStyle' || name === 'shadowColor') {
            if (value === 'none') {
                newValue = null
            }
            else if (typeof value === 'string' || typeof value === 'number' || Array.isArray(value)) {
                newValue = name === 'shadowColor' ? Color.fromInput(value) : {
                    type: 'color',
                    value: Color.fromInput(value as any)
                } as Paintolor
            }
        }
        if (forceUpdate || oldValue !== newValue) {
            (this.props.style as any)[name] = newValue
            this.flags.add(ElementFlag.STYLE)
        }
        if (name == 'fillRule') {
            this.path.setFillRule(this.style.fillRule)
        }
        if (STROKE_STATE_PROPERTIES.has(name)) {
            this.path.setStroke({
                lineWith: this.style.lineWidth,
                lineCap: this.style.lineCap,
                lineJoin: this.style.lineJoin,
                miterLimit: this.style.miterLimit,
                strokeAlign: this.style.strokeAlign,
            })
        }
    }
    setStyles(styles: Props['style'], forceUpdate = false) {
        Object.keys(styles).forEach((key: any) => {
            this.setStyle(key, (styles as any)[key], forceUpdate)
        })
    }
    setShape<K extends keyof Props['shape']>(name: K, value: Props['shape'][K], forceUpdate = false) {
        const oldValue = (this.props.shape as any)[name]
        if (forceUpdate || oldValue !== value) {
            (this.props.shape as any)[name] = value
            this.flags.add(ElementFlag.SHAPE)
        }
    }
    setShapes(shape: Props['shape'], forceUpdate = false) {
        Object.keys(shape).forEach((key: any) => {
            this.setShape(key, (shape as any)[key], forceUpdate)
        })
    }
    shouldRender(): boolean {
        return super.shouldRender() && this.style.opacity > 0
    }
    hasFill() {
        return !!this.style.fillStyle
    }
    hasStroke() {
        return !!this.style.strokeStyle && this.style.lineWidth > 0
    }
    /** 是否有裁剪路径 */
    hasClipPath(): boolean {
        return !!this.props.clipPath
    }
    /**
     * 是否可批量渲染。
     *
     * 批量渲染（renderer 按颜色分组累积几何，一次 drawCall 绘制同色元素）需要 shape：
     *   1. 几何可被 PathBuilder.addRect 等基础图元直接累积（renderer 端硬编码几何提取，
     *      目前仅支持 Rect 的 x/y/width/height）
     *   2. 满足通用样式+矩阵条件（见 _isBatchableByStyle）
     *
     * 默认返回 false：Text/Image/Star/Ellipse 等不支持的 shape 不会被误判批量，
     * 避免其 props.shape 结构不匹配导致几何提取错误（如 Text 无 width/height）。
     * 子类（如 Rect）重写此方法，补充几何限制后调用 _isBatchableByStyle。
     */
    isBatchable(): boolean {
        return false
    }
    /**
     * 通用批量条件检查（样式 + worldMatrix 纯平移）。
     * 供支持批量的子类（如 Rect）在重写 isBatchable 时复用。
     *
     * 条件：
     *   - 无 clipPath（裁剪需逐元素 clip）
     *   - opacity === 1（透明度需逐元素 saveLayer）
     *   - 无 shadow（阴影需逐元素 shadow 设置）
     *   - 无 stroke（描边需逐元素 stroke paint）
     *   - 纯色 fill（gradient/pattern 需逐元素 shader）
     *   - worldMatrix 纯平移（旋转/缩放/倾斜需逐元素 concat；平移可烘焙到几何坐标）
     */
    protected _isBatchableByStyle(): boolean {
        if (this.props.clipPath) return false
        const st = this.style
        if (st.opacity !== 1) return false
        if (st.shadowBlur && st.shadowBlur > 0) return false
        if (st.strokeStyle && (st.lineWidth ?? 0) > 0) return false
        if (!st.fillStyle || (st.fillStyle as any).type !== 'color') return false
        // worldMatrix 必须纯平移：a===1, b===0, c===0, d===1
        const m = this.worldMatrix
        if (m[0] !== 1 || m[1] !== 0 || m[2] !== 0 || m[3] !== 1) return false
        return true
    }
    /**
     * 获取裁剪用的 Path2D（用于 Canvas API 的 clip）。
     * 支持两种输入:
     *   - CKPath2D: 直接使用其 fillPath 转 Path2D
     *   - Shape: 使用其 updateBuildPath 后的 path
     * 结果会被缓存，直到 clipPath 变化或 _clipPathDirty 被外部置为 true。
     */
    getClipPath2D(): Path2D | null {
        if (!this.props.clipPath) return null
        if (!this._clipPathDirty && this._clipPath2DCache) {
            return this._clipPath2DCache
        }
        const clipPath = this.props.clipPath as any
        let ckPath: CKPath2D | null = null
        if (clipPath instanceof CKPath2D) {
            ckPath = clipPath
        } else if (clipPath instanceof Shape) {
            // 触发 clipPath shape 的路径更新
            clipPath.updateBuildPath()
            ckPath = clipPath.path
        }
        if (ckPath) {
            this._clipPath2DCache = ckPath.getFillPath2D()
        } else {
            this._clipPath2DCache = null
        }
        this._clipPathDirty = false
        return this._clipPath2DCache
    }
    hitTest(x: number, y: number): boolean {
        const pointerEvents = this.props.pointerEvents
        if (pointerEvents === 'none') {
            return false
        }
        const hasFill = this.hasFill()
        const hasStroke = this.hasStroke()
        if (!hasFill && !hasStroke) {
            return false
        }
        this.updateBuildPath()
        const path = this.path
        // 没有stroke，判断是否在fill范围内
        if (!hasStroke && !path.getBounds().contains(x, y)) {
            return false
        }

        // 裁剪路径命中过滤：若设置 clipPath，则点必须也在 clipPath 内
        if (this.props.clipPath) {
            let ckPath: CKPath2D | null = null
            const cp = this.props.clipPath as any
            if (cp instanceof CKPath2D) ckPath = cp
            else if (cp instanceof Shape) { cp.updateBuildPath(); ckPath = cp.path }
            if (ckPath && !ckPath.isPointInPath(x, y)) {
                return false
            }
        }

        if ((pointerEvents === 'fill' || pointerEvents === 'all') && hasFill && path.isPointInPath(x, y)) {
            return true
        }
        if ((pointerEvents === 'stroke' || pointerEvents === 'all') && hasStroke && path.isPointInStrokePath(x, y)) {
            return true
        }
        return false
    }
    calcLocalBounds(out: BoundingRect): BoundingRect {
        out.copy(this.path.computeTightBounds())
        return out
    }
    calcLocalPaintBounds(out: BoundingRect): BoundingRect {
        out.copy(this.path.computeStrokeTightBounds())
        return out
    }
    updateBuildPath(forceUpdate = false) {
        if (this.flags.has(ElementFlag.PATH) || forceUpdate) {
            this.flags.remove(ElementFlag.PATH)
            this.path.reset()
            this.buildPath(this.path)
        }
    }
    dispose(): void {
        super.dispose()
        this.path.delete()
    }
    abstract buildPath(path: CKPath2D): void
    abstract draw(renderer: Renderer): void
    render(renderer: Renderer): void {
        this.updateBuildPath()
        renderer.renderShape(this)
    }
}
