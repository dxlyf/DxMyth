
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
}
const STROKE_STATE_PROPERTIES = new Set(['lineWidth', 'lineCap', 'lineJoin', 'miterLimit', 'strokeAlign'])
export abstract class Shape<Props extends ShapeProps = ShapeProps> extends Element<Props> {
    type = "DisplayObject"
    path: CKPath2D
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
    calcLocalStrokeBounds(out: BoundingRect): BoundingRect {
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
    /**
         * 生成合批键，相同键的 shape 可合并渲染
         * 返回 null 表示不可合批
         */
    public _getBatchKey(): string | null {
        const s = this.style

        // 阴影活跃时不可合批（每次 fill/stroke 都需要独立 shadow）
        if (s.shadowBlur > 0) return null

        // 非居中描边需要 clip，不可合批
        if (s.strokeAlign !== 'center' && s.strokeStyle) return null

        // lineDash 存在时不可合批（dashOffset 可能不同）
        if (s.lineDash && s.lineDash.length > 0) return null

        // 渐变/图案不可合批（参考语义复杂）
        if (s.fillStyle && s.fillStyle.type !== 'color') return null
        if (s.strokeStyle && s.strokeStyle.type !== 'color') return null

        // 序列化纯色填充样式
        const fillKey = s.fillStyle
            ? Color.toCSS_RGBA((s.fillStyle as any).value)
            : 'none'

        // 序列化纯色描边样式
        const strokeKey = s.strokeStyle
            ? Color.toCSS_RGBA((s.strokeStyle as any).value)
            : 'none'

        return [
            fillKey,
            strokeKey,
            s.opacity ?? 1,
            s.blend ?? 'source-over',
            s.fillRule ?? 'nonzero',
            s.lineWidth ?? 0,
            s.lineCap ?? 'butt',
            s.lineJoin ?? 'miter',
            s.miterLimit ?? 10,
            s.firstStroke ? '1' : '0',
            s.closePath ? '1' : '0',
        ].join('|')
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