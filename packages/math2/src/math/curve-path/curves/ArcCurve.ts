// ============================================================
// ArcCurve — 圆弧曲线（2D，继承 EllipseCurve）
// ============================================================

import { EllipseCurve } from './EllipseCurve'

export class ArcCurve extends EllipseCurve {
    isArcCurve = true
    type = 'ArcCurve'

    constructor(aX: number, aY: number, aRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean) {
        super(aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise)
    }
}
