import { BoundingRect } from 'src/math/BoundingRect'
import { Color } from 'src/math/Color'
import { Path2D, type IPath2DReadable } from 'src/math/Path2D'
import { Element, ElementFlag, type ElementProps } from './Element'
import {
    Paint,
    type BlendMode,
    type FillRule,
    type LineCap,
    type LineJoin,
    type PaintOrder,
    type PaintSource,
    type ShadowPaint,
    type StrokeAlign,
} from './Paint'
import type { Renderer2D } from './Renderer2D'

/** 图元的绘制样式属性，统一描述填充、描边与合成方式 */
export type DisplayObjectProps = ElementProps & {
    /** 填充源，null 表示不填充 */
    fill: PaintSource | null
    /** 描边源，null 表示不描边 */
    stroke: PaintSource | null
    opacity: number
    fillRule: FillRule
    lineWidth: number
    lineCap: LineCap
    lineJoin: LineJoin
    miterLimit: number
    strokeAlign: StrokeAlign
    /** 虚线模式（数组本身被原地修改时需手动调用 invalidatePaint） */
    lineDash: number[]
    lineDashOffset: number
    /** 混合模式，与底层画布 globalCompositeOperation 语义一致 */
    blend: BlendMode
    /** fill / stroke 的绘制顺序，默认先 fill 后 stroke */
    paintOrder: PaintOrder
    /** 阴影，null 表示无阴影；对象内部字段被原地修改时需手动调用 invalidatePaint */
    shadow: ShadowPaint | null
    /**
     * 剪切路径，null 表示不剪切。
     *
     * 路径坐标与图元同一局部坐标系；后端需能读取命令流（IPath2DReadable），
     * 才会按路径生成裁剪区域。路径内容被原地修改时需手动调用 invalidateClip。
     */
    clip: IPath2DReadable | null
}

/** 影响 Paint 结果、需要重建样式并重绘的属性名 */
const STYLE_PROPS = new Set<string>([
    'fill',
    'stroke',
    'opacity',
    'fillRule',
    'lineWidth',
    'lineCap',
    'lineJoin',
    'miterLimit',
    'strokeAlign',
    'lineDash',
    'lineDashOffset',
    'blend',
    'paintOrder',
    'shadow',
])

/**
 * 渲染图元基类。
 *
 * 图元 = 路径（Path2D）+ 样式（Paint）。子类往 `path` 里记录命令，
 * 由后端在 `render` 时把路径转成各自的绘制资源：
 * - Canvas 后端直接把命令重放给原生 Path2D；
 * - WebGL / WebGPU 后端遍历命令做三角化，结果存放在 `geometryCache`。
 *
 * ```ts
 * class Circle extends DisplayObject {
 *     constructor(x: number, y: number, r: number) {
 *         super({ fill: '#f00' })
 *         this.circle(x, y, r)
 *     }
 *     private circle(x: number, y: number, r: number) {
 *         this.path.arc(x, y, r, 0, Math.PI * 2)
 *         this.invalidatePath()
 *     }
 * }
 * ```
 */
export class DisplayObject<Props extends DisplayObjectProps = DisplayObjectProps> extends Element<Props> {
    type: string = 'DisplayObject'
    /** 图元持有的路径，子类通过 IPath2D 方法往里面记录命令 */
    readonly path: Path2D = new Path2D()
    /**
     * 几何缓存，由渲染后端按自身规则写入（如 'fill' / 'stroke'）。
     *
     * 后端用 `path.version` 判断缓存是否失效，避免每次绘制都重新三角化。
     */
    readonly geometryCache = new Map<string, unknown>()
    /** 由 props 构建的绘制样式，样式属性变化时重建 */
    private _paint: Paint | null = null

    /** 当前绘制样式（懒构建） */
    get paint(): Paint {
        if (!this._paint) {
            this._paint = this.createPaint()
        }
        return this._paint
    }

    getDefaultProps(): Partial<Props> {
        return {
            fill: Color.BLACK,
            stroke: null,
            opacity: 1,
            fillRule: 'nonzero',
            lineWidth: 1,
            lineCap: 'butt',
            lineJoin: 'miter',
            miterLimit: 10,
            strokeAlign: 'center',
            lineDash: [],
            lineDashOffset: 0,
            blend: 'source-over',
            paintOrder: 'fill-stroke',
            shadow: null,
            clip: null,
        } as Partial<Props>
    }

    /** 根据 props 创建绘制样式，子类可覆写以追加自定义字段 */
    protected createPaint(): Paint {
        return new Paint({
            fill: this.props.fill,
            stroke: this.props.stroke,
            opacity: this.props.opacity,
            fillRule: this.props.fillRule,
            lineWidth: this.props.lineWidth,
            lineCap: this.props.lineCap,
            lineJoin: this.props.lineJoin,
            miterLimit: this.props.miterLimit,
            strokeAlign: this.props.strokeAlign,
            lineDash: this.props.lineDash,
            lineDashOffset: this.props.lineDashOffset,
            blend: this.props.blend,
            paintOrder: this.props.paintOrder,
            shadow: this.props.shadow,
        })
    }

    setProp<K extends Extract<keyof Props, string>>(prop: K, value: Props[K]) {
        const oldValue = this.props[prop]
        super.setProp(prop, value)
        if (oldValue === value) return
        if (STYLE_PROPS.has(prop)) {
            // 样式属性变化时丢弃 Paint 缓存并标脏，保证下次渲染取到新样式
            this.invalidatePaint()
        } else if (prop === 'clip') {
            this.invalidateClip()
        }
    }

    /** 样式变化后调用：丢弃 Paint 缓存并标记重绘 */
    invalidatePaint(): void {
        this._paint = null
        this.markFlag(ElementFlag.STYLE)
    }

    /** 剪切路径内容变化后调用：标记重绘 */
    invalidateClip(): void {
        this.markFlag(ElementFlag.STYLE)
    }

    /** 路径命令变化后调用：包围盒失效并标记重绘 */
    invalidatePath(): void {
        this.markFlag(ElementFlag.LOCAL_BOUNDS | ElementFlag.STYLE)
    }

    /**
     * 图元局部包围盒。
     *
     * 曲线取控制点包络、圆弧取圆心 ± 半径，属于偏保守的近似值，
     * 足够用于视口裁剪与合批，不作为精确几何范围使用。
     */
    calcBounds(out: BoundingRect): void {
        out.setEmpty()
        this.path.visit({
            moveTo: (c) => out.add(c.x, c.y),
            lineTo: (c) => out.add(c.x, c.y),
            bezierCurveTo: (c) => {
                out.add(c.cp1x, c.cp1y).add(c.cp2x, c.cp2y).add(c.x, c.y)
            },
            quadraticCurveTo: (c) => {
                out.add(c.cpx, c.cpy).add(c.x, c.y)
            },
            rect: (c) => {
                out.add(c.x, c.y).add(c.x + c.w, c.y + c.h)
            },
            roundRect: (c) => {
                out.add(c.x, c.y).add(c.x + c.w, c.y + c.h)
            },
            arc: (c) => {
                out.add(c.x - c.radius, c.y - c.radius).add(c.x + c.radius, c.y + c.radius)
            },
            arcTo: (c) => {
                out.add(c.x1, c.y1).add(c.x2, c.y2)
            },
            ellipse: (c) => {
                // 旋转椭圆用长半轴作圆，保证包络一定覆盖实际形状
                const r = Math.max(c.radiusX, c.radiusY)
                out.add(c.x - r, c.y - r).add(c.x + r, c.y + r)
            },
        })
    }

    /** 绘制范围：世界包围盒再按描边宽度、阴影模糊与偏移外扩 */
    calcPaintBounds(out: BoundingRect): void {
        out.copy(this.getWorldBounds())
        if (out.isEmpty()) return
        const paint = this.paint
        if (paint.stroke) {
            const width = paint.lineWidth * this.worldScale
            const outset =
                paint.strokeAlign === 'inside' ? 0 : paint.strokeAlign === 'outside' ? width : width / 2
            if (outset > 0) out.outset(outset, outset)
        }
        if (paint.shadow) {
            // 阴影范围 = 形状按偏移平移后，再按模糊半径外扩；用对称外扩覆盖任意方向
            const blur = Math.max(0, paint.shadow.blur ?? 0)
            const offsetX = Math.abs(paint.shadow.offsetX ?? 0)
            const offsetY = Math.abs(paint.shadow.offsetY ?? 0)
            out.outset(blur + offsetX, blur + offsetY)
        }
    }

    /** 渲染入口：把路径交给后端绘制，有剪切路径时先建立裁剪区域；子类可覆写以绘制多段几何 */
    render(renderer: Renderer2D): void {
        const clip = this.props.clip
        if (!clip) {
            renderer.drawPath(this.path, this.paint)
            return
        }
        renderer.save()
        renderer.clip(clip)
        renderer.drawPath(this.path, this.paint)
        renderer.restore()
    }

    dispose(): void {
        this.geometryCache.clear()
        this._paint = null
        super.dispose()
    }
}
