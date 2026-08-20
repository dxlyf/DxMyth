// ============================================================
// SplineCurve — 2D Catmull-Rom 样条曲线
// ============================================================

import { Vector2 } from '../../Vector2'
import { Curve, type CurveJSON } from '../Curve'
import { CatmullRom } from '../Interpolations'

export class SplineCurve extends Curve<Vector2> {
    isSplineCurve = true
    type = 'SplineCurve'

    /** 定义曲线的 2D 点数组 */
    points: Vector2[] = []

    constructor(points: Vector2[] = []) {
        super()
        this.points = points
    }

    getPoint(t: number, optionalTarget: Vector2 = new Vector2()): Vector2 {
        const point = optionalTarget

        const points = this.points
        const p = (points.length - 1) * t

        const intPoint = Math.floor(p)
        const weight = p - intPoint

        const p0 = points[intPoint === 0 ? intPoint : intPoint - 1]
        const p1 = points[intPoint]
        const p2 = points[intPoint > points.length - 2 ? points.length - 1 : intPoint + 1]
        const p3 = points[intPoint > points.length - 3 ? points.length - 1 : intPoint + 2]

        point.set(
            CatmullRom(weight, p0.x, p1.x, p2.x, p3.x),
            CatmullRom(weight, p0.y, p1.y, p2.y, p3.y)
        )

        return point
    }

    copy(source: SplineCurve): this {
        super.copy(source)

        this.points = []
        for (let i = 0, l = source.points.length; i < l; i++) {
            this.points.push(source.points[i].clone())
        }

        return this
    }

    toJSON(): CurveJSON {
        const data = super.toJSON()

        data.points = []
        for (let i = 0, l = this.points.length; i < l; i++) {
            data.points.push(this.points[i].toArray())
        }

        return data
    }

    fromJSON(json: Record<string, any>): this {
        super.fromJSON(json)

        this.points = []
        for (let i = 0, l = json.points.length; i < l; i++) {
            this.points.push(Vector2.fromArray(json.points[i]))
        }

        return this
    }
}
