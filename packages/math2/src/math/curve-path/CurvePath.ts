// ============================================================
// CurvePath — 曲线路径：一组首尾相连曲线的集合，同时保留 Curve 的 API
// 移植自 three.js extras/core/CurvePath.js
// ============================================================

import { Vector2 } from '../Vector2'
import { Vector3 } from '../Vector3'
import { Curve, CurveJSON, isVector2Point, pointEquals, type CurvePoint } from './Curve'
import {
    ArcCurve, CatmullRomCurve3, CubicBezierCurve, CubicBezierCurve3,
    EllipseCurve, LineCurve, LineCurve3, QuadraticBezierCurve,
    QuadraticBezierCurve3, SplineCurve
} from './curves'

/** 曲线类型 → 构造函数的注册表（用于 fromJSON 反序列化） */
const curveRegistry: Record<string, new (...args: any[]) => Curve> = {
    ArcCurve,
    CatmullRomCurve3,
    CubicBezierCurve,
    CubicBezierCurve3,
    EllipseCurve,
    LineCurve,
    LineCurve3,
    QuadraticBezierCurve,
    QuadraticBezierCurve3,
    SplineCurve
}

export class CurvePath<T extends Vector2 | Vector3 = Vector2 | Vector3> extends Curve<T> {
    type = 'CurvePath'

    /** 定义路径的曲线数组 */
    curves: Curve[] = []

    /** 是否自动用一条直线曲线闭合路径 */
    autoClose = false

    /** 各子曲线累计长度缓存 */
    cacheLengths: number[] | null = null

    /** 添加一条曲线到路径 */
    add(curve: Curve): void {
        this.curves.push(curve)
    }

    /**
     * 若起点与终点未连接，则添加一条直线曲线闭合路径。
     * @return 当前路径
     */
    closePath(): this {
        const startPoint = this.curves[0].getPoint(0)
        const endPoint = this.curves[this.curves.length - 1].getPoint(1)

        if (!pointEquals(startPoint, endPoint)) {
            if (isVector2Point(startPoint)) {
                this.curves.push(new LineCurve(endPoint as Vector2, startPoint as Vector2))
            } else {
                this.curves.push(new LineCurve3(endPoint as Vector3, startPoint as Vector3))
            }
        }

        return this
    }

    /**
     * 返回参数 t 处的点：先按整条路径弧长定位子曲线，再在子曲线上取点。
     */
    getPoint(t: number, optionalTarget?: T): T {
        const d = t * this.getLength()
        const curveLengths = this.getCurveLengths()
        let i = 0

        while (i < curveLengths.length) {
            if (curveLengths[i] >= d) {
                const diff = curveLengths[i] - d
                const curve = this.curves[i]

                const segmentLength = curve.getLength()
                const u = segmentLength === 0 ? 0 : 1 - diff / segmentLength

                return curve.getPointAt(u, optionalTarget as CurvePoint) as T
            }

            i++
        }

        // 不可达：d 不会超过总弧长，与 three.js 保持一致
        return null as unknown as T
    }

    getLength(): number {
        // 不能使用基类 Curve 的 getLength()：基类依赖 getPoint()，
        // 而 CurvePath 的 getPoint() 依赖 getLength()
        const lens = this.getCurveLengths()
        return lens[lens.length - 1]
    }

    updateArcLengths(): void {
        // 必须重算 cacheLengths
        this.needsUpdate = true
        this.cacheLengths = null
        this.getCurveLengths()
    }

    /** 返回各子曲线累计长度的数组 */
    getCurveLengths(): number[] {
        if (this.cacheLengths && this.cacheLengths.length === this.curves.length) {
            return this.cacheLengths
        }

        const lengths: number[] = []
        let sums = 0

        for (let i = 0, l = this.curves.length; i < l; i++) {
            sums += this.curves[i].getLength()
            lengths.push(sums)
        }

        this.cacheLengths = lengths
        return lengths
    }

    getSpacedPoints(divisions = 40): T[] {
        const points: T[] = []

        for (let i = 0; i <= divisions; i++) {
            points.push(this.getPoint(i / divisions))
        }

        if (this.autoClose) {
            points.push(points[0])
        }

        return points
    }

    getPoints(divisions = 12): T[] {
        const points: T[] = []
        let last: T | undefined

        for (let i = 0, curves = this.curves; i < curves.length; i++) {
            const curve = curves[i]
            const resolution = curve.isEllipseCurve ? divisions * 2
                : (curve.isLineCurve || curve.isLineCurve3) ? 1
                    : curve.isSplineCurve ? divisions * (curve.points ? curve.points.length : 1)
                        : divisions

            const pts = curve.getPoints(resolution)

            for (let j = 0; j < pts.length; j++) {
                const point = pts[j]

                if (last && pointEquals(last, point)) continue // 确保没有连续重复点

                points.push(point as T)
                last = point as T
            }
        }

        if (this.autoClose && points.length > 1 && !pointEquals(points[points.length - 1], points[0])) {
            points.push(points[0])
        }

        return points
    }

    copy(source: CurvePath<T>): this {
        super.copy(source)

        this.curves = []
        for (let i = 0, l = source.curves.length; i < l; i++) {
            this.curves.push(source.curves[i].clone())
        }

        this.autoClose = source.autoClose

        return this
    }

    toJSON(): CurveJSON {
        const data = super.toJSON()

        data.autoClose = this.autoClose
        data.curves = []

        for (let i = 0, l = this.curves.length; i < l; i++) {
            data.curves.push(this.curves[i].toJSON())
        }

        return data
    }

    fromJSON(json: CurveJSON & { autoClose?: boolean; curves?: CurveJSON[] }): this {
        super.fromJSON(json)

        this.autoClose = json.autoClose ?? this.autoClose
        this.curves = []

        const list = json.curves ?? []
        for (let i = 0, l = list.length; i < l; i++) {
            const curveJSON = list[i]
            const ctor = curveRegistry[curveJSON.type ?? '']
            if (ctor) {
                this.curves.push(new ctor().fromJSON(curveJSON))
            }
        }

        return this
    }
}
