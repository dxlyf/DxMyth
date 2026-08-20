// ============================================================
// QuadraticBezierCurve — 2D 二次贝塞尔曲线
// ============================================================

import { Vector2 } from '../../Vector2'
import { Curve } from '../Curve'
import { QuadraticBezier } from '../Interpolations'

export class QuadraticBezierCurve extends Curve<Vector2> {
    isQuadraticBezierCurve = true
    type = 'QuadraticBezierCurve'

    /** 起点 */
    v0: Vector2
    /** 控制点 */
    v1: Vector2
    /** 终点 */
    v2: Vector2

    constructor(v0: Vector2 = new Vector2(), v1: Vector2 = new Vector2(), v2: Vector2 = new Vector2()) {
        super()
        this.v0 = v0
        this.v1 = v1
        this.v2 = v2
    }

    getPoint(t: number, optionalTarget: Vector2 = new Vector2()): Vector2 {
        const point = optionalTarget
        const v0 = this.v0, v1 = this.v1, v2 = this.v2

        point.set(
            QuadraticBezier(t, v0.x, v1.x, v2.x),
            QuadraticBezier(t, v0.y, v1.y, v2.y)
        )

        return point
    }

    copy(source: QuadraticBezierCurve): this {
        super.copy(source)
        this.v0.copy(source.v0)
        this.v1.copy(source.v1)
        this.v2.copy(source.v2)
        return this
    }

    toJSON(): Record<string, unknown> {
        const data = super.toJSON()
        data.v0 = this.v0.toArray()
        data.v1 = this.v1.toArray()
        data.v2 = this.v2.toArray()
        return data
    }

    fromJSON(json: Record<string, any>): this {
        super.fromJSON(json)
        this.v0.copy(Vector2.fromArray(json.v0))
        this.v1.copy(Vector2.fromArray(json.v1))
        this.v2.copy(Vector2.fromArray(json.v2))
        return this
    }
}
