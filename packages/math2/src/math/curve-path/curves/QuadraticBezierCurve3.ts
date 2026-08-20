// ============================================================
// QuadraticBezierCurve3 — 3D 二次贝塞尔曲线
// ============================================================

import { Vector3 } from '../../Vector3'
import { Curve } from '../Curve'
import { QuadraticBezier } from '../Interpolations'

export class QuadraticBezierCurve3 extends Curve<Vector3> {
    isQuadraticBezierCurve3 = true
    type = 'QuadraticBezierCurve3'

    /** 起点 */
    v0: Vector3
    /** 控制点 */
    v1: Vector3
    /** 终点 */
    v2: Vector3

    constructor(v0: Vector3 = new Vector3(), v1: Vector3 = new Vector3(), v2: Vector3 = new Vector3()) {
        super()
        this.v0 = v0
        this.v1 = v1
        this.v2 = v2
    }

    getPoint(t: number, optionalTarget: Vector3 = new Vector3()): Vector3 {
        const point = optionalTarget
        const v0 = this.v0, v1 = this.v1, v2 = this.v2

        point.set(
            QuadraticBezier(t, v0.x, v1.x, v2.x),
            QuadraticBezier(t, v0.y, v1.y, v2.y),
            QuadraticBezier(t, v0.z, v1.z, v2.z)
        )

        return point
    }

    copy(source: QuadraticBezierCurve3): this {
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
        this.v0.copy(Vector3.fromArray(json.v0))
        this.v1.copy(Vector3.fromArray(json.v1))
        this.v2.copy(Vector3.fromArray(json.v2))
        return this
    }
}
