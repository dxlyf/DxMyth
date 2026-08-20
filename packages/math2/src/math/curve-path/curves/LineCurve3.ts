// ============================================================
// LineCurve3 — 3D 直线段曲线
// ============================================================

import { Vector3 } from '../../Vector3'
import { Curve } from '../Curve'

export class LineCurve3 extends Curve<Vector3> {
    isLineCurve3 = true
    type = 'LineCurve3'

    /** 起点 */
    v1: Vector3
    /** 终点 */
    v2: Vector3

    constructor(v1: Vector3 = new Vector3(), v2: Vector3 = new Vector3()) {
        super()
        this.v1 = v1
        this.v2 = v2
    }

    getPoint(t: number, optionalTarget: Vector3 = new Vector3()): Vector3 {
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
    getPointAt(u: number, optionalTarget?: Vector3): Vector3 {
        return this.getPoint(u, optionalTarget)
    }

    getTangent(t: number, optionalTarget: Vector3 = new Vector3()): Vector3 {
        return Vector3.subtract(optionalTarget, this.v2, this.v1).normalize()
    }

    getTangentAt(u: number, optionalTarget?: Vector3): Vector3 {
        return this.getTangent(u, optionalTarget)
    }

    copy(source: LineCurve3): this {
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
        this.v1.copy(Vector3.fromArray(json.v1))
        this.v2.copy(Vector3.fromArray(json.v2))
        return this
    }
}
