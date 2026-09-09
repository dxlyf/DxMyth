// ============================================================
// Polygon - 多边形（支持凸/凹，使用 even-odd 规则）
// 顶点按数组顺序存储：[x0,y0,x1,y1,...] 或 [{x,y},...]
// 内部使用扁平数组 [x0,y0,x1,y1,...] 以提高缓存命中率
// ============================================================

import { normalizeAngles } from '../Arc'
import { BoundingRect } from '../BoundingRect'
import { Vector2, Vector2Like } from '../Vector2'
import { Geometry, PointOut, distPointToSegmentSquared } from './Geometry'
import { buildArc } from '../Arc'
import { normal } from '../Bezier'

type JoinProc = (outer: Vector2Like[], inner: Vector2Like[], prevUnitNormal: Vector2, pivot: Vector2, afterUnitNormal: Vector2, radius: number, invMiterLimit: number) => void
type CapProc = (outer: Vector2Like[], inner: Vector2Like[], normal: Vector2, pivot: Vector2, stop: Vector2Like, radius: number) => void


export const isPointInPolygon = (points: Vector2Like[], x: number, y: number, fillRule: CanvasFillRule = 'nonzero') => {
    let winding = 0
    let len = points.length
    for (let k = 0; k < len; k++) {
        const p0 = points[k]
        const p1 = points[(k + 1) % len]
        if (p0.y > y !== p1.y > y && x <= p0.x + (p1.x - p0.x) * (y - p0.y) / (p1.y - p0.y)) {
            if (p0.y < p1.y) {
                winding++
            } else {
                winding--
            }
        }
    }
    return fillRule === 'evenodd' ? winding % 2 !== 0 : winding !== 0
}
const handleInnerJoin = (inner: Vector2Like[], pivot: Vector2, afterNormal: Vector2) => {
    inner.push({
        x: pivot.x,
        y: pivot.y,
    })
    inner.push({
        x: pivot.x - afterNormal.x,
        y: pivot.y - afterNormal.y,
    })
}
const processJoinRound: JoinProc = (outer, inner, prevUnitNormal, pivot, afterUnitNormal, radius, invMiterLimit) => {
    const sinh = prevUnitNormal.cross(afterUnitNormal)
    const clockwise = sinh > 0
    if (Math.abs(sinh) <= 1e-2) {
        return
    }
    const prevNormal = Vector2.from(prevUnitNormal).multiplyScalar(radius)
    const afterNormal = Vector2.from(afterUnitNormal).multiplyScalar(radius)
    if (!clockwise) {
        let tmp = outer
        outer = inner
        inner = tmp
        prevNormal.negate()
        afterNormal.negate()
    }

    const startAngle = Math.atan2(prevNormal.y, prevNormal.x)
    const endAngle = Math.atan2(afterNormal.y, afterNormal.x)
    buildArc(outer, pivot.x, pivot.y, radius, startAngle, endAngle, !clockwise)
    handleInnerJoin(inner, pivot, afterNormal)
}
const processJoinMiter: JoinProc = (outer, inner, prevUnitNormal, pivot, afterUnitNormal, radius, invMiterLimit) => {
    const cosh = prevUnitNormal.dot(afterUnitNormal)
    const sinh = prevUnitNormal.cross(afterUnitNormal)
    const clockwise = sinh > 0

    if (Math.abs(sinh) <= 1e-2) {
        return
    }
    const halfCos = Math.sqrt((1 + cosh) / 2)
    const afterNormal = Vector2.from(afterUnitNormal).multiplyScalar(radius)
    //    const prevNormal=Vector2.from(prevUnitNormal).normalize()
    if (halfCos < invMiterLimit) {
        processJoinBevel(outer, inner, prevUnitNormal, pivot, afterUnitNormal, radius, invMiterLimit)
        return
    }
    const mid = Vector2.from(prevUnitNormal).add(afterUnitNormal).normalize().multiplyScalar(radius / halfCos)
    if (!clockwise) {
        let tmp = outer;
        outer = inner;
        inner = tmp;
        mid.negate()
        afterNormal.negate()
    }
    outer[outer.length - 1] = {
        x: pivot.x + mid.x,
        y: pivot.y + mid.y,
    }
    handleInnerJoin(inner, pivot, afterNormal)
}
const processJoinBevel: JoinProc = (outer, inner, prevUnitNormal, pivot, afterUnitNormal, radius, invMiterLimit) => {
    const sinh = prevUnitNormal.cross(afterUnitNormal)
    if (Math.abs(sinh) <= 1e-2) {
        return
    }
    const clockwise = sinh > 0
    const afterNormal = Vector2.from(afterUnitNormal).multiplyScalar(radius)
    if (!clockwise) {
        let tmp = outer;
        outer = inner;
        inner = tmp;
        afterNormal.negate()
    }
    outer.push({
        x: pivot.x + afterNormal.x,
        y: pivot.y + afterNormal.y,
    })
    handleInnerJoin(inner, pivot, afterNormal)
}

const processCapButt: CapProc = (outer, inner, normal, pivot, stop) => {
    outer.push({
        x: stop.x,
        y: stop.y,
    })
}
const processCapSquare: CapProc = (outer, inner, normal, pivot, stop) => {
    const parallelNormal = Vector2.create(normal.x, normal.y).rotateCW()
    outer[outer.length - 1] = {
        x: pivot.x + parallelNormal.x + normal.x,
        y: pivot.y + parallelNormal.y + normal.y,
    }
    outer.push({
        x: pivot.x + parallelNormal.x - normal.x,
        y: pivot.y + parallelNormal.y - normal.y,
    })
}
const processCapRound: CapProc = (outer, inner, normal, pivot, stop, radius) => {
    const v0 = Vector2.from(normal)
    const v1 = Vector2.from(normal).negate()
    const startAngle = Math.atan2(v0.y, v0.x)
    const endAngle = Math.atan2(v1.y, v1.x)
    buildArc(outer, pivot.x, pivot.y, radius, startAngle, endAngle, false)
}
const joinFactor = {
    round: processJoinRound,
    miter: processJoinMiter,
    bevel: processJoinBevel,
}
const capFactor = {
    round: processCapRound,
    butt: processCapButt,
    square: processCapSquare,
}
export function isPolygonClockwise(points: Vector2Like[]) {
    let area = 0
    for (let i = 0, len = points.length; i < len; i++) {
        area += Vector2.cross(points[i], points[(i + 1) % len])
    }
    return area > 0
}
export function polygonOffset(points: Vector2Like[], width: number) {
    let absWidth = Math.abs(width)
    let newPoints: Vector2Like[] = []
    let firstUnitNormal = Vector2.create()
    let prevUnitNormal = Vector2.create()
    let unitNormal = Vector2.create()
  //  let first = Vector2.create()
    let prev = Vector2.create()
    let cur = Vector2.create()
    let normal = Vector2.create()
    const _isPolygonClockwise = isPolygonClockwise(points)
    const invMiterLimit = 1 / Number.MAX_SAFE_INTEGER
    const closed = Vector2.equalsEpsilon(points[0], points[points.length - 1], 1e-6)
    console.log('_isPolygonClockwise', _isPolygonClockwise)
    for (let i = 0, len = points.length; i < len; i++) {
        cur.copy(points[i])
        if (i > 0) {
            if (width > 0) {
                unitNormal.copy(cur).subtract(prev).normalize().rotateCCW()
            } else {
                unitNormal.copy(cur).subtract(prev).normalize().rotateCW()
            }
            normal.copy(unitNormal).multiplyScalar(absWidth)
            if (!_isPolygonClockwise) {
                normal.negate()
            }
            if (i === 1) {

                if(!closed){
                    newPoints.push({
                        x: prev.x + normal.x,
                        y: prev.y + normal.y
                    })
                }
                firstUnitNormal.copy(unitNormal)
            }
            else {

                const cosh = prevUnitNormal.dot(unitNormal)
                const sinh = prevUnitNormal.cross(unitNormal)
                if (Math.abs(sinh) > 1e-2) {
                    const halfCos = Math.sqrt((1 + cosh) / 2)
                    const mid = Vector2.from(prevUnitNormal).add(unitNormal).normalize().multiplyScalar(absWidth / halfCos)
                    if (!_isPolygonClockwise) {
                        mid.negate()
                    }
                    newPoints[newPoints.length - 1] = {
                        x: prev.x + mid.x,
                        y: prev.y + mid.y,
                    }
                }
                // if (Math.abs(sinh) > 1e-2) {
                //     processJoinMiter(clockwise ? newPoints : [], clockwise ? [] : newPoints, prevUnitNormal, prev, unitNormal, absWidth, invMiterLimit)
                // }
            }

            newPoints.push({
                x: cur.x + normal.x,
                y: cur.y + normal.y
            })
            if (i === len - 1) {
                if (closed) {
                    const cosh = unitNormal.dot(firstUnitNormal)
                    const sinh = unitNormal.cross(firstUnitNormal)
                    if (Math.abs(sinh) > 1e-2) {
                        const halfCos = Math.sqrt((1 + cosh) / 2)
                        const mid = Vector2.from(unitNormal).add(firstUnitNormal).normalize().multiplyScalar(absWidth / halfCos)
                        if (!_isPolygonClockwise) {
                            mid.negate()
                        }
                        newPoints[newPoints.length - 1] = {
                            x: cur.x + mid.x,
                            y: cur.y + mid.y,
                        }
                    }
                    
                    newPoints.push({
                        x: newPoints[0].x,
                        y: newPoints[0].y
                    })
                }
            }
            prevUnitNormal.copy(unitNormal)
        }
        prev.copy(cur)
    }
    return newPoints
}



export function buildStrokePoints(points: Vector2Like[], options: { align?: 'outside' | 'inside' | 'center', width?: number, join?: 'round' | 'bevel' | 'miter', cap?: 'round' | 'butt' | 'square', miterLimit?: number }) {
    let { miterLimit = 10, width = 1, cap = 'butt', join = 'miter', align = 'center' } = options

    const halfWidth = width / 2
    const invMiterLimit = 1 / miterLimit

    let newPoints: Vector2Like[] = []
    // 去掉重复点
    let lastPoint = points[0]
    for (let i = 1; i < points.length; i++) {
        if (!Vector2.equalsEpsilon(points[i], lastPoint, 1e-6)) {
            newPoints.push(points[i])
            lastPoint = points[i]
        }
    }
    newPoints.unshift(points[0])

    if (newPoints.length < 2) {
        return []
    }
    if (align === 'outside') {
        newPoints = polygonOffset(newPoints, halfWidth)
    } else if (align === 'inside') {
        newPoints = polygonOffset(newPoints, -halfWidth)
    }

    const closed = Vector2.equalsEpsilon(newPoints[0], newPoints[points.length - 1], 1e-6)
    let newLength = newPoints.length
    let innerPoints: Vector2Like[] = []
    let outerPoints: Vector2Like[] = []

    let first = Vector2.create()
    let prev = Vector2.create()
    let cur = Vector2.create()
    let firstOffsetPoint = Vector2.create()

    let firstNormal = Vector2.create()
    let firstUnitNormal = Vector2.create()
    let prevNormal = Vector2.create()
    let prevUnitNormal = Vector2.create()

    let normal = Vector2.create()
    let unitNormal = Vector2.create()

    // join
    const joinProc = joinFactor[join]
    const capProc = capFactor[cap]

    for (let i = 0; i < newLength; i++) {
        cur.copy(newPoints[i])
        if (i > 0) {
            unitNormal.copy(cur).subtract(prev).normalize().rotateCCW()
            normal.copy(unitNormal).multiplyScalar(halfWidth)
            if (i === 1) {
                firstNormal.copy(normal)
                first.copy(prev)
                firstUnitNormal.copy(unitNormal)
                firstOffsetPoint.set(first.x + normal.x, first.y + normal.y)
                outerPoints.push({
                    x: firstOffsetPoint.x,
                    y: firstOffsetPoint.y,
                })
                innerPoints.push({
                    x: first.x - normal.x,
                    y: first.y - normal.y,
                })
            } else {
                joinProc(outerPoints, innerPoints, prevUnitNormal, prev, unitNormal, halfWidth, invMiterLimit)
            }
            outerPoints.push({
                x: cur.x + normal.x,
                y: cur.y + normal.y,
            })
            innerPoints.push({
                x: cur.x - normal.x,
                y: cur.y - normal.y,
            })
            if (i === newLength - 1) {

                if (closed) {
                    joinProc(outerPoints, innerPoints, unitNormal, cur, firstUnitNormal, halfWidth, invMiterLimit)
                    outerPoints.push({
                        x: firstOffsetPoint.x,
                        y: firstOffsetPoint.y,
                    })
                    let lastX = innerPoints[innerPoints.length - 1].x
                    let lastY = innerPoints[innerPoints.length - 1].y
                    innerPoints.push({
                        x: lastX,
                        y: lastY,
                    })
                    outerPoints = outerPoints.concat(innerPoints.reverse().slice(1))
                    outerPoints.push({
                        x: lastX,
                        y: lastY,
                    })

                } else {

                    capProc(outerPoints, innerPoints, normal, cur, innerPoints[innerPoints.length - 1], halfWidth)
                    outerPoints = outerPoints.concat(innerPoints.slice().reverse().slice(1))
                    capProc(outerPoints, innerPoints, Vector2.create(-firstNormal.x, -firstNormal.y), first, firstOffsetPoint, halfWidth)

                    if (!Vector2.equals(outerPoints[outerPoints.length - 1], firstOffsetPoint)) {
                        outerPoints.push({
                            x: firstOffsetPoint.x,
                            y: firstOffsetPoint.y,
                        })
                    }
                }
            }

            prevNormal.copy(normal)
            prevUnitNormal.copy(unitNormal)
        }
        prev.copy(cur)
    }
    return outerPoints

}
export class Polygon extends Geometry {
    /** 扁平顶点数据 [x0,y0,x1,y1,...] */
    points: number[]
    closed: boolean = false
    constructor(points: number[] = []) {
        super()
        this.points = points
    }

    /** 顶点数 */
    get vertexCount(): number {
        return this.points.length >> 1
    }

    /** 从点对象数组构造 */
    static fromPoints(pts: Array<{ x: number, y: number }>): Polygon {
        const flat = new Array(pts.length * 2)
        for (let i = 0; i < pts.length; i++) {
            flat[i * 2] = pts[i].x
            flat[i * 2 + 1] = pts[i].y
        }
        return new Polygon(flat)
    }

    /**
     * 面积（带符号面积取绝对值）
     * Shoelace 公式：A = 0.5 * Σ (x_i * y_{i+1} - x_{i+1} * y_i)
     */
    signedArea(): number {
        const p = this.points
        const n = p.length
        if (n < 6) return 0
        let sum = 0
        for (let i = 0; i < n; i += 2) {
            const x0 = p[i]
            const y0 = p[i + 1]
            const x1 = p[(i + 2) % n]
            const y1 = p[(i + 3) % n]
            sum += x0 * y1 - x1 * y0
        }
        return sum * 0.5
    }

    area(): number {
        return Math.abs(this.signedArea())
    }

    /**
     * 重心（面积加权形心）
     * Cx = (1/6A) Σ (x_i + x_{i+1})(x_i y_{i+1} - x_{i+1} y_i)
     * Cy = (1/6A) Σ (y_i + y_{i+1})(x_i y_{i+1} - x_{i+1} y_i)
     */
    centroid(out?: PointOut): PointOut {
        const r = out || { x: 0, y: 0 }
        const p = this.points
        const n = p.length
        if (n < 6) {
            if (n === 2) { r.x = p[0]; r.y = p[1]; return r }
            if (n === 4) { r.x = (p[0] + p[2]) * 0.5; r.y = (p[1] + p[3]) * 0.5; return r }
            r.x = 0; r.y = 0
            return r
        }
        let sumA = 0
        let cx = 0
        let cy = 0
        for (let i = 0; i < n; i += 2) {
            const x0 = p[i]
            const y0 = p[i + 1]
            const x1 = p[(i + 2) % n]
            const y1 = p[(i + 3) % n]
            const cross = x0 * y1 - x1 * y0
            sumA += cross
            cx += (x0 + x1) * cross
            cy += (y0 + y1) * cross
        }
        const a6 = sumA * 3 // 6 * (sumA/2)
        if (Math.abs(a6) > 1e-12) {
            r.x = cx / a6
            r.y = cy / a6
        } else {
            // 退化：用顶点平均
            let sx = 0, sy = 0
            const cnt = n >> 1
            for (let i = 0; i < n; i += 2) {
                sx += p[i]
                sy += p[i + 1]
            }
            r.x = sx / cnt
            r.y = sy / cnt
        }
        return r
    }

    center(out?: PointOut): PointOut {
        const r = out || { x: 0, y: 0 }
        const b = this.bounds()
        r.x = b.centerX
        r.y = b.centerY
        return r
    }

    perimeter(): number {
        const p = this.points
        const n = p.length
        if (n < 4) return 0
        let sum = 0
        for (let i = 0; i < n; i += 2) {
            const x0 = p[i]
            const y0 = p[i + 1]
            const x1 = p[(i + 2) % n]
            const y1 = p[(i + 3) % n]
            const dx = x1 - x0
            const dy = y1 - y0
            sum += Math.sqrt(dx * dx + dy * dy)
        }
        return sum
    }

    /**
     * 射线投射法（even-odd 规则）
     * 性能：O(n)，无内存分配
     */
    contains(x: number, y: number): boolean {
        const p = this.points
        const n = p.length
        if (n < 6) return false
        let inside = false
        for (let i = 0, j = n - 2; i < n; j = i, i += 2) {
            const xi = p[i], yi = p[i + 1]
            const xj = p[j], yj = p[j + 1]
            const intersects =
                yi > y !== yj > y &&
                x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
            if (intersects) inside = !inside
        }
        return inside
    }

    signedDistance(x: number, y: number): number {
        const p = this.points
        const n = p.length
        if (n < 4) return Infinity
        let minD2 = Infinity
        for (let i = 0, j = n - 2; i < n; j = i, i += 2) {
            const d2 = distPointToSegmentSquared(
                x, y,
                p[j], p[j + 1],
                p[i], p[i + 1]
            )
            if (d2 < minD2) minD2 = d2
        }
        const dist = Math.sqrt(minD2)
        return this.contains(x, y) ? dist : -dist
    }

    getPoints(out?: PointOut[]): PointOut[] {
        const r = out || []
        r.length = 0
        const p = this.points
        for (let i = 0; i < p.length; i += 2) {
            r.push({ x: p[i], y: p[i + 1] })
        }
        return r
    }

    bounds(out?: BoundingRect): BoundingRect {
        const r = out || new BoundingRect()
        const p = this.points
        const n = p.length
        if (n === 0) {
            r.setEmpty()
            return r
        }
        let minX = p[0], minY = p[1]
        let maxX = p[0], maxY = p[1]
        for (let i = 2; i < n; i += 2) {
            const x = p[i]
            const y = p[i + 1]
            if (x < minX) minX = x
            else if (x > maxX) maxX = x
            if (y < minY) minY = y
            else if (y > maxY) maxY = y
        }
        r.min.set(minX, minY)
        r.max.set(maxX, maxY)
        return r
    }
}
