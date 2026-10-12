// ============================================================
// DisplayObject — 抽象形状基类
//
// 继承自 Element，专注「几何 + 样式」这两个渲染描述维度：
//   - 几何：持有一个 PathBuilder（geometry）
//   - 样式：持有一个 Paint（fill / stroke / strokeWidth /
//           lineCap / lineJoin / miterLimit / dash / dashOffset）
//   - 包围盒：由几何派生 localBounds；描边时外扩 strokeWidth/2 得到 paintBounds
//   - 命中：路径命中 isPointInPath；pointerEvents === 'stroke' 时按描边折线距离判定
//   - 绘制：draw 先填充后描边
//
// Paint 的 change 事件会被本类监听：样式更新时自动标记脏位（重绘/重算包围盒）。
//
// 继承链：Element → DisplayObject（本类）→ 具体图形（Rect/Circle/Path ...）
// 容器分支（Group/Layer）不经由本类，直接继承 Element。
// ============================================================

import { BoundingRect } from '../math/BoundingRect'
import { PathBuilder } from '../math/PathBuilder'
import { Element, ElementFlag, type ElementProps } from './Element'
import { Paint } from './Paint'
import type { RenderContext } from './Renderer'

export type DisplayObjectProps = ElementProps & {
    /** 几何路径 */
    geometry?: PathBuilder | null
    /** 绘制样式（缺省时自动创建空 Paint） */
    paint?: Paint
}

export abstract class DisplayObject<Props extends DisplayObjectProps = DisplayObjectProps>
    extends Element<Props> {

    type: string = 'DisplayObject'

    private _geometry: PathBuilder | null
    private _paint: Paint
    /** 折叠元素 alpha 时使用的临时画笔（避免污染原画笔/触发 change） */
    private _scratchPaint: Paint | null = null

    constructor(props: Partial<Props> = {}) {
        super(props)
        this._geometry = props.geometry ?? null
        this._paint = props.paint ?? new Paint()
        this._paint.on('change', this._onPaintChange)
    }

    // ==================== 几何 ====================

    get geometry(): PathBuilder | null { return this._geometry }
    set geometry(v: PathBuilder | null) {
        if (this._geometry === v) return
        this._geometry = v
        // 几何变化：局部几何/绘制包围盒均失效
        this.markFlag(ElementFlag.LOCAL_BOUNDS | ElementFlag.PAINT_BOUNDS)
    }

    // ==================== 样式 ====================

    get paint(): Paint { return this._paint }
    set paint(v: Paint) {
        if (this._paint === v) return
        this._paint.off('change', this._onPaintChange)
        this._paint = v
        this._paint.on('change', this._onPaintChange)
        this.markFlag(ElementFlag.STYLE | ElementFlag.PAINT_BOUNDS)
    }

    /** 样式变化：标记脏位（STYLE → 重绘，PAINT_BOUNDS → 重算绘制包围盒） */
    private _onPaintChange = (): void => {
        this.markFlag(ElementFlag.STYLE | ElementFlag.PAINT_BOUNDS)
    }

    // ==================== 包围盒 ====================

    /** 本地几何包围盒 = 路径几何范围；无几何时为空盒 */
    calcLocalBounds(out: BoundingRect): BoundingRect {
        const g = this._geometry
        if (!g || g.isEmpty) {
            out.setEmpty()
            return out
        }
        out.copy(g.computeTightBounds())
        return out
    }

    /** 本地绘制包围盒：有描边时在几何包围盒基础上外扩 strokeWidth/2 */
    calcLocalPaintBounds(out: BoundingRect): BoundingRect {
        out.copy(this.localBounds)
        const p = this._paint
        if (p.hasStroke && !out.isEmpty()) {
            const half = p.strokeWidth / 2
            out.outset(half, half)
        }
        return out
    }

    // ==================== 命中测试 ====================

    /** 路径命中：fill/all/auto 走 isPointInPath；stroke 走点到描边折线距离 */
    hitTest(localX: number, localY: number): boolean {
        const g = this._geometry
        if (!g || g.isEmpty) return false
        if (this.pointerEvents === 'stroke') {
            const tol = Math.max(this._paint.strokeWidth / 2, 0.5)
            return hitStroke(g, localX, localY, tol)
        }
        return g.isPointInPath(localX, localY)
    }

    // ==================== 渲染 ====================

    /** 先填充后描边；元素 alpha 折叠进 Paint.opacity（上下文不再暴露整体透明度） */
    draw(ctx: RenderContext): void {
        const paint = this._paint
        const alpha = this.alpha
        if (alpha >= 1) {
            ctx.drawPath(this._geometry, paint)
            return
        }
        let scratch = this._scratchPaint
        if (!scratch) scratch = this._scratchPaint = new Paint()
        scratch.copy(paint)
        scratch.opacity = paint.opacity * (alpha < 0 ? 0 : alpha)
        ctx.drawPath(this._geometry, scratch)
    }

    // ==================== 生命周期 ====================

    dispose(): void {
        this._paint.off('change', this._onPaintChange)
        super.dispose()
    }
}

/** 点到描边折线的距离判定（按 tolerance 命中） */
function hitStroke(g: PathBuilder, x: number, y: number, tolerance: number): boolean {
    const tolSq = tolerance * tolerance
    const polygons = g.toPolygons(true)
    for (let i = 0; i < polygons.length; i++) {
        const pts = polygons[i]
        for (let j = 1; j < pts.length; j++) {
            const a = pts[j - 1]
            const b = pts[j]
            if (pointToSegmentDistSq(x, y, a.x, a.y, b.x, b.y) <= tolSq) return true
        }
    }
    return false
}

/** 点到线段的最短距离平方 */
function pointToSegmentDistSq(
    px: number, py: number,
    ax: number, ay: number,
    bx: number, by: number,
): number {
    const dx = bx - ax
    const dy = by - ay
    const len2 = dx * dx + dy * dy
    let t = len2 > 0 ? ((px - ax) * dx + (py - ay) * dy) / len2 : 0
    t = t < 0 ? 0 : t > 1 ? 1 : t
    const cx = ax + t * dx
    const cy = ay + t * dy
    const ex = px - cx
    const ey = py - cy
    return ex * ex + ey * ey
}
