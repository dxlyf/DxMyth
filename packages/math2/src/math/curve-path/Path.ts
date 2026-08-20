// ============================================================
// Path — 2D 路径：提供类似 Canvas 2D API 的建路方法
// 移植自 three.js extras/core/Path.js
// ============================================================

import { Vector2 } from '../Vector2'
import { CurvePath } from './CurvePath'
import { EllipseCurve } from './curves/EllipseCurve'
import { SplineCurve } from './curves/SplineCurve'
import { CubicBezierCurve } from './curves/CubicBezierCurve'
import { QuadraticBezierCurve } from './curves/QuadraticBezierCurve'
import { LineCurve } from './curves/LineCurve'
import type { CurveJSON } from './Curve'

export class Path extends CurvePath<Vector2> {
    type = 'Path'

    /** 当前偏移点：之后添加的曲线都从这里开始 */
    currentPoint: Vector2

    constructor(points?: Vector2[]) {
        super()
        this.currentPoint = new Vector2()
        if (points) {
            this.setFromPoints(points)
        }
    }

    /** 从点列表创建路径（每段作为 LineCurve） */
    setFromPoints(points: Vector2[]): this {
        this.moveTo(points[0].x, points[0].y)
        for (let i = 1, l = points.length; i < l; i++) {
            this.lineTo(points[i].x, points[i].y)
        }
        return this
    }

    /** 将 currentPoint 移动到给定点 */
    moveTo(x: number, y: number): this {
        this.currentPoint.set(x, y)
        return this
    }

    /** 添加一条连接当前点与给定点的 LineCurve */
    lineTo(x: number, y: number): this {
        const curve = new LineCurve(this.currentPoint.clone(), new Vector2(x, y))
        this.curves.push(curve)

        this.currentPoint.set(x, y)

        return this
    }

    /** 添加一条连接当前点与给定点的 QuadraticBezierCurve */
    quadraticCurveTo(aCPx: number, aCPy: number, aX: number, aY: number): this {
        const curve = new QuadraticBezierCurve(
            this.currentPoint.clone(),
            new Vector2(aCPx, aCPy),
            new Vector2(aX, aY)
        )
        this.curves.push(curve)

        this.currentPoint.set(aX, aY)

        return this
    }

    /** 添加一条连接当前点与给定点的 CubicBezierCurve */
    bezierCurveTo(aCP1x: number, aCP1y: number, aCP2x: number, aCP2y: number, aX: number, aY: number): this {
        const curve = new CubicBezierCurve(
            this.currentPoint.clone(),
            new Vector2(aCP1x, aCP1y),
            new Vector2(aCP2x, aCP2y),
            new Vector2(aX, aY)
        )
        this.curves.push(curve)

        this.currentPoint.set(aX, aY)

        return this
    }

    /** 添加一条经过给定点列表的 SplineCurve（起点为当前点） */
    splineThru(pts: Vector2[]): this {
        const npts = [this.currentPoint.clone()].concat(pts)

        const curve = new SplineCurve(npts)
        this.curves.push(curve)

        this.currentPoint.copy(pts[pts.length - 1])

        return this
    }

    /** 添加一条相对当前点的圆弧（作为 EllipseCurve） */
    arc(aX: number, aY: number, aRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean): this {
        const x0 = this.currentPoint.x
        const y0 = this.currentPoint.y

        this.absarc(aX + x0, aY + y0, aRadius, aStartAngle, aEndAngle, aClockwise)

        return this
    }

    /** 添加一条绝对定位的圆弧（作为 EllipseCurve） */
    absarc(aX: number, aY: number, aRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean): this {
        this.absellipse(aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise, 0)
        return this
    }

    /** 添加一条相对当前点的椭圆（作为 EllipseCurve） */
    ellipse(aX: number, aY: number, xRadius: number, yRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean, aRotation: number): this {
        const x0 = this.currentPoint.x
        const y0 = this.currentPoint.y

        this.absellipse(aX + x0, aY + y0, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation)

        return this
    }

    /** 添加一条绝对定位的椭圆（作为 EllipseCurve） */
    absellipse(aX: number, aY: number, xRadius: number, yRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean, aRotation: number): this {
        const curve = new EllipseCurve(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation)

        if (this.curves.length > 0) {
            // 若已有前一条曲线，尝试衔接
            const firstPoint = curve.getPoint(0)

            if (!firstPoint.equals(this.currentPoint)) {
                this.lineTo(firstPoint.x, firstPoint.y)
            }
        }

        this.curves.push(curve)

        const lastPoint = curve.getPoint(1)
        this.currentPoint.copy(lastPoint)

        return this
    }

    /**
     * 添加一个矩形子路径（Canvas 2D rect 语义，隐式闭合）。
     * @param x 左上角 X
     * @param y 左上角 Y
     * @param width 宽度
     * @param height 高度
     */
    rect(x: number, y: number, width: number, height: number): this {
        this.moveTo(x, y)
        this.lineTo(x + width, y)
        this.lineTo(x + width, y + height)
        this.lineTo(x, y + height)
        this.lineTo(x, y) // 闭合

        return this
    }

    /**
     * 添加一个圆角矩形子路径（Canvas 2D roundRect 语义，隐式闭合）。
     * @param x 左上角 X
     * @param y 左上角 Y
     * @param w 宽度
     * @param h 高度
     * @param radii 圆角半径，支持：
     *   - number: 四个角统一半径
     *   - [all]: 四角统一半径
     *   - [tl, br]: 左上/右下与右上/左下两两相同（CSS 2 值规则）
     *   - [tl, tr, br, bl]: 分别指定四个角
     */
    roundRect(x: number, y: number, w: number, h: number, radii?: number | number[]): this {
        // 解析圆角半径（顺序：r=左上, r2=右上, r3=右下, r4=左下）
        let r = 0, r2 = 0, r3 = 0, r4 = 0

        if (radii === undefined || radii === 0) {
            return this.rect(x, y, w, h)
        }

        if (typeof radii === 'number') {
            r = r2 = r3 = r4 = radii
        } else {
            const arr = radii
            const len = arr.length
            if (len === 0) {
                return this.rect(x, y, w, h)
            }
            r = arr[0]
            if (len === 1) {
                r2 = r3 = r4 = r
            } else if (len === 2) {
                r2 = arr[1]; r3 = r; r4 = r2
            } else if (len === 3) {
                r2 = arr[1]; r3 = arr[2]; r4 = r2
            } else {
                r2 = arr[1]; r3 = arr[2]; r4 = arr[3]
            }
        }

        // 半径非负
        r = Math.max(0, r)
        r2 = Math.max(0, r2)
        r3 = Math.max(0, r3)
        r4 = Math.max(0, r4)

        // CSS/Canvas 标准缩放算法：相邻半径之和超过对应边长时，全部等比缩小
        const hScale = w > 0 ? Math.min(1, w / (r + r2), w / (r4 + r3)) : 0
        const vScale = h > 0 ? Math.min(1, h / (r + r4), h / (r2 + r3)) : 0
        const scale = Math.min(hScale, vScale)

        if (scale < 1) {
            r *= scale; r2 *= scale; r3 *= scale; r4 *= scale
        }

        // 从顶边左侧圆角起点开始，沿矩形边顺序构建（圆角用椭圆弧衔接）
        // 弧的切线端点用精确算术设置 currentPoint，避免 cos/sin 的 1-ULP 误差
        // 触发 absellipse 自动衔接产生额外线段
        this.moveTo(x + r, y)

        this.lineTo(x + w - r2, y)
        if (r2 > 0) {
            this.curves.push(new EllipseCurve(x + w - r2, y + r2, r2, r2, -Math.PI / 2, 0, false, 0))
            this.currentPoint.set(x + w, y + r2)
        }

        this.lineTo(x + w, y + h - r3)
        if (r3 > 0) {
            this.curves.push(new EllipseCurve(x + w - r3, y + h - r3, r3, r3, 0, Math.PI / 2, false, 0))
            this.currentPoint.set(x + w - r3, y + h)
        }

        this.lineTo(x + r4, y + h)
        if (r4 > 0) {
            this.curves.push(new EllipseCurve(x + r4, y + h - r4, r4, r4, Math.PI / 2, Math.PI, false, 0))
            this.currentPoint.set(x, y + h - r4)
        }

        this.lineTo(x, y + r)
        if (r > 0) {
            this.curves.push(new EllipseCurve(x + r, y + r, r, r, Math.PI, -Math.PI / 2, false, 0))
            this.currentPoint.set(x + r, y)
        }

        return this
    }

    copy(source: Path): this {
        super.copy(source)
        this.currentPoint.copy(source.currentPoint)
        return this
    }

    toJSON(): CurveJSON {
        const data = super.toJSON()
        data.currentPoint = this.currentPoint.toArray()
        return data
    }

    fromJSON(json: CurveJSON & { currentPoint?: number[] }): this {
        super.fromJSON(json)
        this.currentPoint.copy(Vector2.fromArray(json.currentPoint ?? [0, 0]))
        return this
    }
}
