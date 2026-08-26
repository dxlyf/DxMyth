// ============================================================
// ArcToCurve — 对标 Canvas 2D arcTo() 的复合曲线（直线段 + 圆弧）
// ============================================================
// Canvas 2D 的 arcTo(x1, y1, x2, y2, radius) 语义：
//   从当前点 P0 到角点 P1 再到控制点 P2 的两条连线之间，
//   画一条半径为 radius 且与两条直线相切的圆弧。
//   实际路径 = 直线段 P0→T1（切点） + 圆弧 T1→T2（切点）。
//
// 本类把一个 arcTo 完整表示为一条曲线：
//   - v0 : 当前点（对标 moveTo/lineTo 之后的 currentPoint）
//   - v1 : 角点（两条直线的交点）
//   - v2 : 第二个控制点
//   - radius : 圆弧半径
//   内部由 LineCurve（v0→t1）与 EllipseCurve（t1→t2 的圆弧）组合而成。
//
// 退化情况（与 Canvas 规范一致）：radius<=0、v0/v1 重合、v1/v2 重合
// 或三点共线时，退化为一条直线 v0→v1。
// ============================================================

import { Vector2 } from '../../Vector2'
import { Curve } from '../Curve'
import { LineCurve } from './LineCurve'
import { EllipseCurve } from './EllipseCurve'

export class ArcToCurve extends Curve<Vector2> {
    isArcToCurve = true
    type = 'ArcToCurve'

    /** 当前点（子路径起点） */
    v0: Vector2
    /** 角点（两条直线的交点，即 arcTo 的第一个控制点） */
    v1: Vector2
    /** 第二个控制点 */
    v2: Vector2
    /** 圆弧半径 */
    radius: number

    /** 是否退化：退化为直线 v0→v1（此时 arcCurve 为 null） */
    degenerate = false
    /** 直线段与圆弧的切点 T1（位于直线 v0→v1 上） */
    t1: Vector2
    /** 圆弧与另一条直线的切点 T2（位于直线 v1→v2 上） */
    t2: Vector2
    /** 圆弧圆心 */
    center: Vector2
    /** 圆弧起始角（弧度，相对圆心，从正 X 轴起） */
    startAngle = 0
    /** 圆弧结束角（弧度，相对圆心，从正 X 轴起） */
    endAngle = 0
    /** 圆弧方向：与 EllipseCurve 的 aClockwise 约定一致 */
    aClockwise = true

    /** 直线段子曲线 v0→t1 */
    lineCurve: LineCurve
    /** 圆弧子曲线 t1→t2（退化时为 null） */
    arcCurve: EllipseCurve | null = null

    /** 直线长度占总长度比例，用于 getPoint 的弧长参数化 */
    private _lineRatio = 0

    constructor(v0: Vector2 = new Vector2(), v1: Vector2 = new Vector2(), v2: Vector2 = new Vector2(), radius = 0) {
        super()
        this.v0 = v0
        this.v1 = v1
        this.v2 = v2
        this.radius = radius
        this.t1 = new Vector2()
        this.t2 = new Vector2()
        this.center = new Vector2()
        this.lineCurve = new LineCurve(v0.clone(), v1.clone())
        this._compute()
    }

    /** 根据 v0/v1/v2/radius 计算切点、圆心、起止角并构建两条子曲线 */
    private _compute(): void {
        const { v0, v1, v2, radius } = this
        const EPS = 1e-9

        // 角点指向两端的方向（单位向量）
        const aX = v0.x - v1.x // 角点 → 当前点
        const aY = v0.y - v1.y
        const bX = v2.x - v1.x // 角点 → 控制点2
        const bY = v2.y - v1.y
        const lenA = Math.hypot(aX, aY)
        const lenB = Math.hypot(bX, bY)

        // ---- 退化情况：直接画直线 v0→v1 ----
        // radius<=0：半径非正无切圆
        // lenA≈0：v0 与 v1 重合；lenB≈0：v1 与 v2 重合
        if (radius <= 0 || lenA < EPS || lenB < EPS) {
            this.degenerate = true
            this.lineCurve.v1.copy(v1)
            this.arcCurve = null
            this._lineRatio = 1
            return
        }

        const u1x = aX / lenA, u1y = aY / lenA // 沿直线 v1→v0 的单位向量
        const u2x = bX / lenB, u2y = bY / lenB // 沿直线 v1→v2 的单位向量

        // 两直线夹角 α（u1 与 u2 的夹角，范围 (0, π)）
        const cosA = u1x * u2x + u1y * u2y
        // 三点共线（cosA≈±1）时没有切圆，退化为直线
        if (cosA >= 1 - EPS || cosA <= -1 + EPS) {
            this.degenerate = true
            this.lineCurve.v1.copy(v1)
            this.arcCurve = null
            this._lineRatio = 1
            return
        }
        const halfA = Math.acos(cosA) / 2 // 半角（圆心在角平分线上）

        // 切点到角点的距离 d = r / tan(α/2) = r·cot(α/2)
        // 推导：直角三角形(角点, 切点, 圆心)中，角点处角为 α/2，
        //       对边为半径 r，邻边为 d，故 tan(α/2) = r / d
        const d = radius / Math.tan(halfA)

        // 两个切点
        this.t1.set(v1.x + u1x * d, v1.y + u1y * d)
        this.t2.set(v1.x + u2x * d, v1.y + u2y * d)

        // 圆心：沿内角平分线方向（u1+u2 归一化），距离 h = r / sin(α/2)
        // 推导：直角三角形中 sin(α/2) = r / h
        const bl = Math.hypot(u1x + u2x, u1y + u2y)
        const h = radius / Math.sin(halfA)
        this.center.set(
            v1.x + ((u1x + u2x) / bl) * h,
            v1.y + ((u1y + u2y) / bl) * h
        )

        // 圆弧起止角（相对圆心）
        this.startAngle = Math.atan2(this.t1.y - this.center.y, this.t1.x - this.center.x)
        this.endAngle = Math.atan2(this.t2.y - this.center.y, this.t2.x - this.center.x)

        // 最短有向角 Δ ∈ (-π, π)：弧的扫掠角 = π - 拐角内角，恒小于 π
        let delta = this.endAngle - this.startAngle
        if (delta > Math.PI) delta -= Math.PI * 2
        else if (delta < -Math.PI) delta += Math.PI * 2

        // EllipseCurve 约定：aClockwise=true → normalizeAngles 取递增角；
        // aClockwise=false → 取递减角。正 delta 需要递增角，负 delta 需要递减角。
        this.aClockwise = delta > 0

        // 构建子曲线：直线 v0→t1 + 圆弧 t1→t2
        this.lineCurve.v1.copy(this.t1)
        this.arcCurve = new EllipseCurve(
            this.center.x, this.center.y,
            radius, radius,
            this.startAngle, this.endAngle,
            this.aClockwise, 0
        )

        // 弧长比例参数化：t∈[0,1] 按弧长比例分配给直线段与圆弧
        const lineLen = this.t1.distanceTo(v0)
        const arcLen = radius * Math.abs(delta)
        const total = lineLen + arcLen
        this._lineRatio = total > EPS ? lineLen / total : 0
    }

    /**
     * 返回曲线上参数 t 处的点。
     * 参数化与弧长成比例：t 小于 _lineRatio 时落在直线段 v0→t1，
     * 否则落在圆弧 t1→t2，保证匀速插值。
     */
    getPoint(t: number, optionalTarget: Vector2 = new Vector2()): Vector2 {
        if (this.degenerate || !this.arcCurve) {
            return this.lineCurve.getPoint(t, optionalTarget)
        }
        if (this._lineRatio <= 0) {
            return this.arcCurve.getPoint(t, optionalTarget)
        }
        if (t <= this._lineRatio) {
            return this.lineCurve.getPoint(t / this._lineRatio, optionalTarget)
        }
        return this.arcCurve.getPoint((t - this._lineRatio) / (1 - this._lineRatio), optionalTarget)
    }

    /** 细分数量 = 直线段(1) + 圆弧(2×divisions) */
    getResolution(divisions: number): number {
        return 1 + (this.arcCurve ? this.arcCurve.getResolution(divisions) : 0)
    }

    /** 解析切线：直线段为固定方向，圆弧用 EllipseCurve 的解析切线 */
    getTangent(t: number, optionalTarget: Vector2 = new Vector2()): Vector2 {
        if (this.degenerate || !this.arcCurve) {
            return this.lineCurve.getTangent(t, optionalTarget)
        }
        if (this._lineRatio > 0 && t <= this._lineRatio) {
            return this.lineCurve.getTangent(t / this._lineRatio, optionalTarget)
        }
        const arcT = this._lineRatio <= 0 ? t : (t - this._lineRatio) / (1 - this._lineRatio)
        return this.arcCurve.getTangent(arcT, optionalTarget)
    }

    copy(source: ArcToCurve): this {
        super.copy(source)
        this.v0.copy(source.v0)
        this.v1.copy(source.v1)
        this.v2.copy(source.v2)
        this.radius = source.radius
        this._compute()
        return this
    }

    toJSON(): Record<string, unknown> {
        const data = super.toJSON()
        data.v0 = this.v0.toArray()
        data.v1 = this.v1.toArray()
        data.v2 = this.v2.toArray()
        data.radius = this.radius
        return data
    }

    fromJSON(json: Record<string, any>): this {
        super.fromJSON(json)
        this.v0.copy(Vector2.fromArray(json.v0))
        this.v1.copy(Vector2.fromArray(json.v1))
        this.v2.copy(Vector2.fromArray(json.v2))
        this.radius = json.radius
        this._compute()
        return this
    }
}
