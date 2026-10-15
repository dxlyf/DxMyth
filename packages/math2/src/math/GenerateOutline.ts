import type { FlattenedContour } from './PathBuilder'
import { LineCap, LineJoin, type StrokeOptions } from './PathStroke'
import { Vector2, type Vector2Like } from './Vector2'

/**
 * 多边形描边选项：在通用描边选项（StrokeOptions）基础上增加 offset 对齐参数。
 */
export type PolygonStrokerOptions = StrokeOptions & {
    /**
     * 描边相对路径中心线的偏移比例，取值 [0,1]。
     * 0.5 为居中（默认）；0 表示整体偏向一侧，1 表示偏向另一侧。
     */
    alignment?: number
}

const TAU = Math.PI * 2

/** 把角度规整到 (-π, π]。 */
function wrapAngle(a: number): number {
    a %= TAU
    if (a > Math.PI) a -= TAU
    else if (a <= -Math.PI) a += TAU
    return a
}

/** 按圆弧扫过的角度决定离散段数（整圆约 24 段）。 */
function arcSegments(sweep: number): number {
    return Math.max(2, Math.ceil(Math.abs(sweep) / (Math.PI / 12)))
}

/**
 * 生成描边轮廓。
 *
 * 与 PathStroke 输出「一条合并轮廓」不同，这里把描边区域按图元拆成一组彼此独立的多边形：
 *   - 每段折线        -> 一个四边形（线段主体）；
 *   - 每个拐点        -> 一个 join 多边形（miter / bevel / round，只补在凸角外侧的缺口处）；
 *   - 每个开放端点    -> 一个 cap 多边形（butt / round / square）。
 *
 * 每个输出多边形都尽量保持凸性，便于后续直接三角化（earcut / 扇形展开）。
 *
 * @param contours 展平后的折线轮廓（PathBuilder.getSubPaths 的产物）
 * @param options  描边选项
 * @returns 一组闭合多边形，每项形如 { points, closed:true }
 */
export function generateOutline(
    contours: FlattenedContour[],
    options: PolygonStrokerOptions = {},
): FlattenedContour[] {
    const {
        lineWidth = 1,
        lineJoin = LineJoin.Miter,
        lineCap = LineCap.Butt,
        miterLimit = 10,
        scale = 1,
        alignment = 0.5,
    } = options

    // 法向两侧的偏移距离：alignment=0.5 时两侧均为 lineWidth/2

    const dLeft = lineWidth * 0.5
    const dRight = lineWidth * 0.5
    const halfWidth = lineWidth * 0.5
    const eps = 1e-6 * (scale || 1)
    if(alignment !== 0.5) {
        contours=offsetContoursForAlignment(contours,(alignment-0.5)*lineWidth)
    }
    const polygons: FlattenedContour[] = []
    const pt = (x: number, y: number): Vector2Like => ({ x, y })

    /** 只收集至少 3 个顶点的多边形，退化块直接丢弃。 */
    const emit = (points: Vector2Like[]) => {
        if (points.length >= 3) {
            polygons.push({ points, closed: true })
        }
    }
    /** 单位切线；长度过小（零长段）返回 null。 */
    const unitTangent = (a: Vector2Like, b: Vector2Like): Vector2Like | null => {
        const dx = b.x - a.x
        const dy = b.y - a.y
        const len = Math.hypot(dx, dy)
        if (len <= eps) return null
        return pt(dx / len, dy / len)
    }
    /**
     * 单位法向：切线 (dx,dy) 逆时针旋转 90° -> (dy,-dx)。
     * 与 PathStroke 中 unitNormal.perpendicular().negate() 的约定保持一致。
     */
    const normalOf = (t: Vector2Like): Vector2Like => pt(t.y, -t.x)
    /**
     * 把一段圆弧离散成闭合多边形（round cap / round join 共用）。
     * @param cx,cy        圆心
     * @param radius       半径
     * @param ang0         起始角（弧度）
     * @param sweep        扫过角度（弧度，符号决定方向）
     * @param includeCenter 是否把圆心并入顶点：true 得到扇形块（join 需要）；
     *                      false 直接由弧两端点连弦封口（cap 的半圆弦恰为直径）
     */
    const emitArc = (
        cx: number, cy: number, radius: number,
        ang0: number, sweep: number, includeCenter: boolean,
    ) => {
        // const segs = arcSegments(sweep)
        const segs = ((15 * Math.abs(sweep) * Math.sqrt(radius) / Math.PI) >> 0) + 1;
        const poly: Vector2Like[] = includeCenter ? [pt(cx, cy)] : []
        for (let k = 0; k <= segs; k++) {
            const ang = ang0 + (sweep * k) / segs
            poly.push(pt(cx + Math.cos(ang) * radius, cy + Math.sin(ang) * radius))
        }
        emit(poly)
    }
    /** 生成端点封口多边形。out 为该端点朝外的单位切线方向。 */
    const emitCap = (p: Vector2Like, nn: Vector2Like, out: Vector2Like) => {
        const left = pt(p.x + nn.x * dLeft, p.y + nn.y * dLeft)
        const right = pt(p.x - nn.x * dRight, p.y - nn.y * dRight)
        if (lineCap === LineCap.Square) {
            emit([
                left,
                right,
                pt(right.x + out.x * halfWidth, right.y + out.y * halfWidth),
                pt(left.x + out.x * halfWidth, left.y + out.y * halfWidth),
            ])
        } else if (lineCap === LineCap.Round) {
            // 以 left/right 中点为圆心、halfWidth 为半径，朝外画半圆
            const cx = p.x + nn.x * ((dLeft - dRight) * 0.5)
            const cy = p.y + nn.y * ((dLeft - dRight) * 0.5)
            const ang0 = Math.atan2(nn.y, nn.x)
            const sweep = (nn.x * out.y - nn.y * out.x > 0 ? 1 : -1) * Math.PI
            emitArc(cx, cy, halfWidth, ang0, sweep, false)
        }
        // butt：线段矩形自身的端边即为封口，无需额外多边形
    }

    for (const contour of contours) {
        if (!contour || contour.points.length === 0) continue

        // 去掉相邻重复点
        const pts: Vector2Like[] = []
        for (const p of contour.points) {
            const last = pts[pts.length - 1]
            if (last && Math.abs(last.x - p.x) <= eps && Math.abs(last.y - p.y) <= eps) continue
            pts.push(pt(p.x, p.y))
        }
        // 闭合轮廓去掉与首点重合的末点（getSubPaths 会补一个首点）
        if (contour.closed && pts.length > 1) {
            const first = pts[0]
            const last = pts[pts.length - 1]
            if (Math.abs(first.x - last.x) <= eps && Math.abs(first.y - last.y) <= eps) {
                pts.pop()
            }
        }
        const n = pts.length
        if (n < 2) continue

        const closed = contour.closed
        // 闭合轮廓有 n 段；开放轮廓有 n-1 段
        const segCount = closed ? n : n - 1
        const nextIndex = (i: number) => (i + 1) % n

        // 1) 逐段生成线段矩形，并缓存每段的单位法向
        const normals: (Vector2Like | null)[] = []
        for (let i = 0; i < segCount; i++) {
            const a = pts[i]
            const b = pts[nextIndex(i)]
            const t = unitTangent(a, b)
            if (!t) {
                normals.push(null)
                continue
            }
            const nn = normalOf(t)
            normals.push(nn)
            const lx = nn.x * dLeft
            const ly = nn.y * dLeft
            const rx = -nn.x * dRight
            const ry = -nn.y * dRight
            emit([
                pt(a.x + lx, a.y + ly),
                pt(b.x + lx, b.y + ly),
                pt(b.x + rx, b.y + ry),
                pt(a.x + rx, a.y + ry),
            ])
        }

        // 2) 拐点 join：只在凸角外侧补缺口，内侧两段矩形本身已重叠
        const firstJoin = closed ? 0 : 1
        const lastJoin = closed ? n - 1 : n - 2
        for (let v = firstJoin; v <= lastJoin; v++) {
            const n0 = normals[(v - 1 + segCount) % segCount]
            const n1 = normals[v % segCount]
            if (!n0 || !n1) continue
            const p = pts[v]
            const turn = n0.x * n1.y - n0.y * n1.x
            if (Math.abs(turn) <= eps) continue // 共线，无需补角

            // 凸角（外侧）所在的法向方向与对应偏移距离
            const s = turn > 0 ? 1 : -1
            const radius = s > 0 ? dLeft : dRight
            const a0 = pt(s * n0.x, s * n0.y)
            const a1 = pt(s * n1.x, s * n1.y)
            const e0 = pt(p.x + a0.x * radius, p.y + a0.y * radius)
            const e1 = pt(p.x + a1.x * radius, p.y + a1.y * radius)

            if (lineJoin === LineJoin.Round) {
                const ang0 = Math.atan2(a0.y, a0.x)
                const sweep = wrapAngle(Math.atan2(a1.y, a1.x) - ang0)
                emitArc(p.x, p.y, radius, ang0, sweep, true)
            } else if (lineJoin === LineJoin.Bevel) {
                emit([pt(p.x, p.y), e0, e1])
            } else {
                // miter：尖角超过 miterLimit 时回落为 bevel
                const bx = a0.x + a1.x
                const by = a0.y + a1.y
                const blen = Math.hypot(bx, by)
                const cosHalf = blen <= eps ? 0 : (a0.x * bx + a0.y * by) / blen
                if (cosHalf <= eps || 1 / cosHalf > miterLimit) {
                    emit([pt(p.x, p.y), e0, e1])
                } else {
                    const miterLen = radius / cosHalf
                    const m = pt(p.x + (bx / blen) * miterLen, p.y + (by / blen) * miterLen)
                    emit([pt(p.x, p.y), e0, m, e1])
                }
            }
        }

        // 3) cap：仅开放轮廓；起点朝外方向为首段切线反向，终点为末段切线方向
        if (!closed && lineCap !== LineCap.Butt) {
            const startNormal = normals[0]
            if (startNormal) {
                const t0 = unitTangent(pts[0], pts[1])
                if (t0) emitCap(pts[0], startNormal, pt(-t0.x, -t0.y))
            }
            const endNormal = normals[segCount - 1]
            if (endNormal) {
                const t1 = unitTangent(pts[n - 2], pts[n - 1])
                if (t1) emitCap(pts[n - 1], endNormal, t1)
            }
        }
    }

    return polygons
}

/**
     * 把中心线整体沿法向平移，使「原生居中描边」等价于 generateOutline 的 alignment 描边。
     *
     * alignment=0.5 时不平移；band 中线相对中心线的偏移为 lineWidth*(alignment-0.5)。
     * 内部顶点沿角平分线平移，使到相邻两段法向的垂直距离都等于该偏移量：
     *   offsetVec = (n0 + n1) * shift / (1 + n0·n1)
     * 开放路径的首末顶点用所在段的单侧法向平移。
     */
export function offsetOutlineForAlignment(contour: FlattenedContour, shift: number): { x: number; y: number }[] {
    const pts = contour.points.slice()
    if(contour.closed&&Vector2.equalsEpsilon(pts[pts.length-1],pts[0])){
        pts.pop()
    }
    const n = pts.length
    if (n < 2 || Math.abs(shift) < 1e-9) return pts.map(p => ({ x: p.x, y: p.y }))
    const closed = contour.closed
    const segCount = closed ? n : n - 1
    // 每段单位法向：切线 (dx,dy) 逆时针 90° -> (dy,-dx)，与 GenerateOutline 保持一致
    const normals: { x: number; y: number }[] = []
    for (let i = 0; i < segCount; i++) {
        const a = pts[i]
        const b = pts[(i + 1) % n]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const len = Math.hypot(dx, dy) || 1
        normals.push({ x: dy / len, y: -dx / len })
    }
    return pts.map((p, i) => {
        let vx: number, vy: number
        if (!closed && i === 0) {
            vx = normals[0].x * shift
            vy = normals[0].y * shift
        } else if (!closed && i === n - 1) {
            const nm = normals[segCount - 1]
            vx = nm.x * shift
            vy = nm.y * shift
        } else {
            const pn = normals[(i - 1 + segCount) % segCount]
            const nn = normals[i % segCount]
            const denom = 1 + (pn.x * nn.x + pn.y * nn.y)
            if (Math.abs(denom) < 1e-9) {
                vx = pn.x * shift
                vy = pn.y * shift
            } else {
                vx = ((pn.x + nn.x) * shift) / denom
                vy = ((pn.y + nn.y) * shift) / denom
            }
        }
        return { x: p.x + vx, y: p.y + vy }
    })
}

export function offsetContoursForAlignment(contours: FlattenedContour[], shift: number): FlattenedContour[] {
    return contours.map(contour => ({points:offsetOutlineForAlignment(contour, shift), closed: contour.closed}))
}
