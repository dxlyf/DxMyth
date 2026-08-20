// ============================================================
// LineCurve — 2D 直线段曲线
// ============================================================

import { Vector2 } from '../../Vector2'
import { Curve } from '../Curve'

export class LineCurve extends Curve<Vector2> {
    isLineCurve = true
    type = 'LineCurve'

    /** 起点 */
    v1: Vector2
    /** 终点 */
    v2: Vector2

    constructor(v1: Vector2 = new Vector2(), v2: Vector2 = new Vector2()) {
        super()
        this.v1 = v1
        this.v2 = v2
    }

    getPoint(t: number, optionalTarget: Vector2 = new Vector2()): Vector2 {
        const point = optionalTarget

        if (t === 1) {
            point.copy(this.v2)
        } else {
            point.copy(this.v2).subtract(this.v1)
            point.multiplyScalar(t).add(this.v1)
        }

        return point
    }

    // 直线是线性的，可覆盖默认的 getPointAt
    getPointAt(u: number, optionalTarget?: Vector2): Vector2 {
        return this.getPoint(u, optionalTarget)
    }

    getTangent(t: number, optionalTarget: Vector2 = new Vector2()): Vector2 {
        return Vector2.subtract(optionalTarget, this.v2, this.v1).normalize()
    }

    getTangentAt(u: number, optionalTarget?: Vector2): Vector2 {
        return this.getTangent(u, optionalTarget)
    }

    copy(source: LineCurve): this {
        super.copy(source)
        this.v1.copy(source.v1)
        this.v2.copy(source.v2)
        return this
    }

    toJSON(): Record<string, unknown> {
        const data = super.toJSON()
        data.v1 = this.v1.toArray()
        data.v2 = this.v2.toArray()
        return data
    }

    fromJSON(json: Record<string, any>): this {
        super.fromJSON(json)
        this.v1.copy(Vector2.fromArray(json.v1))
        this.v2.copy(Vector2.fromArray(json.v2))
        return this
    }
}
