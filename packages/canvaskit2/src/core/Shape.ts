
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
        this.setStyles(this.props.style || {})
        this.setShapes(this.props.shape || {})
        this.path = new CKPath2D()
        this.path.setFillRule(this.props.style.fillRule)

        this.flags.add(ElementFlag.SHAPE)
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
            this.dirtyStyle()
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
            this._localStrokeBoundsVersion=-1
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
            this.flags.add(ElementFlag.BOUNDS)
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
        return !!this.style.strokeStyle
    }
    hitTest(x: number, y: number): boolean {
        this.builtinBuildPath()
        if (this.hasFill() && this.path.isPointInPath(x, y)) {
            return true
        }
        if (this.hasStroke()) {
            return this.path.isPointInStrokePath(x, y)
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
    builtinBuildPath(forceUpdate = false) {
        if (this.flags.has(ElementFlag.SHAPE) || forceUpdate) {
            this.flags.remove(ElementFlag.SHAPE)
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
        this.builtinBuildPath()
        renderer.renderShape(this)
    }
}