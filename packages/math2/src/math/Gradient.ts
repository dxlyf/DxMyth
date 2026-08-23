

import { ColorInput, ColorValue, Color } from 'src/math/Color'
import { Matrix2D, Matrix2DLike } from './Matrix2D'
import { clamp } from './MathUtils'
export type ColorStop = {
    offset: number
    color: ColorValue
}

export abstract class Gradient   {
    type: 'gradient' = 'gradient'
    elementType: 'linear-gradient' | 'radial-gradient' | 'conic-gradient'
    stops: ColorStop[] = []
    matrix?: Matrix2D
    addColorStop(offset: number, color: ColorInput): void {
        this.stops.push({
            offset: clamp(offset, 0, 1),
            color: Color.fromInput(color)
        })
        this.stops.sort((a, b) => a.offset - b.offset)
    }
    cloneColorStops() {
        return this.stops.map((stop) => ({
            offset: stop.offset,
            color: stop.color.slice()
        }))
    }
    transform(a: number, b: number, c: number, d: number, e: number, f: number) {
        if (!this.matrix) {
            this.matrix = Matrix2D.identity()
        }
        this.matrix.fromValues(a, b, c, d, e, f)
    }
    getColorAt(t: number): ColorValue {
        const stops = this.stops
        if (t <= stops[0].offset) {
            return stops[0].color
        }
        if (t >= stops[stops.length - 1].offset) {
            return stops[stops.length - 1].color
        }
        for (let i = 0; i < stops.length - 1; i++) {
            const start = stops[i]
            const end = stops[i + 1]
            if (t >= start.offset && t <= end.offset) {
                if (Math.abs(end.offset - start.offset) < 1e-6) {
                    return end.color
                }
                const t2 = clamp((t - start.offset) / (end.offset - start.offset), 0, 1)
                return Color.lerp(start.color, end.color, t2)
            }
        }
        return stops[stops.length - 1].color
    }
    abstract getGradientColor(x: number, y: number): ColorValue
    copy(source: Gradient) {
        this.stops = source.cloneColorStops()
        this.type = source.type
        this.elementType = source.elementType
        if (source.matrix) {
            this.matrix = source.matrix.clone()
        }
        return this
    }
    abstract clone(): Gradient
    dispose(){

    }
}

export class LinearGradient extends Gradient {
    elementType: Gradient['elementType'] = 'linear-gradient'
    constructor(public x0: number, public y0: number, public x1: number, public y1: number) {
        super()
    }
    clone() {
        return new LinearGradient(this.x0, this.y0, this.x1, this.y1).copy(this)
    }
    copy(source: LinearGradient) {
        super.copy(source)
        this.x0 = source.x0
        this.y0 = source.y0
        this.x1 = source.x1
        this.y1 = source.y1
        return this
    }
    getGradientColor(x: number, y: number) {
        // 纯标量运算：t = 投影 / |dir|²，避免向量分配
        const dx = this.x1 - this.x0
        const dy = this.y1 - this.y0
        const lenSq = dx * dx + dy * dy
        // 两点重合时退化为纯色
        if (lenSq === 0) {
            return this.getColorAt(0)
        }
        const t = ((x - this.x0) * dx + (y - this.y0) * dy) / lenSq
        return this.getColorAt(clamp(t, 0, 1))
    }
}
export class RadialGradient extends Gradient {
    elementType: Gradient['elementType'] = 'radial-gradient'
    constructor(public x0: number, public y0: number, public r0: number, public x1: number, public y1: number, public r1: number) {
        super()
    }
    clone() {
        return new RadialGradient(this.x0, this.y0, this.r0, this.x1, this.y1, this.r1).copy(this)
    }
    copy(source: RadialGradient) {
        super.copy(source)
        this.x0 = source.x0
        this.y0 = source.y0
        this.r0 = source.r0
        this.x1 = source.x1
        this.y1 = source.y1
        this.r1 = source.r1
        return this
    }
    getGradientColor(x: number, y: number) {
        const dx = this.x1 - this.x0
        const dy = this.y1 - this.y0
        const px = x - this.x0
        const py = y - this.y0
        const dr = this.r1 - this.r0

        // 同心圆退化：直接用距离求 t
        if (dx === 0 && dy === 0) {
            const len = Math.hypot(px, py)
            return this.getColorAt(clamp((len - this.r0) / dr, 0, 1))
        }
        // P(t) = c0 + (c1-c0)·t, D(t) = r0 + (r1-r0)·t
        // |p - P(t)| = D(t) → A·t² + B·t + C = 0
        const A = dx * dx + dy * dy - dr * dr
        const B = -2 * (dx * px + dy * py + this.r0 * dr)
        const C = px * px + py * py - this.r0 * this.r0
        if (Math.abs(A) < 1e-6) {
            // 线性退化：B·t + C = 0
            if (Math.abs(B) < 1e-12) {
                return this.getColorAt(0)
            }
            return this.getColorAt(clamp(-C / B, 0, 1))
        }
        const d = B * B - 4 * A * C
        if (d < 0) {
            return this.getColorAt(0)
        }
        const sqrtD = Math.sqrt(d)
        const inv = 0.5 / A
        const t0 = (-B + sqrtD) * inv
        const t1 = (-B - sqrtD) * inv
        // 取落在 [0,1] 内的根；都不在则按最近端点取色
        if (t0 >= 0 && t0 <= 1) {
            return this.getColorAt(t0)
        }
        if (t1 >= 0 && t1 <= 1) {
            return this.getColorAt(t1)
        }
        return this.getColorAt(clamp(Math.min(t0, t1), 0, 1))
    }
}
export class ConicGradient extends Gradient {
    elementType: Gradient['elementType'] = 'conic-gradient'
    constructor(public startAngle: number, public x: number, public y: number) {
        super()
    }
    clone() {
        return new ConicGradient(this.startAngle, this.x, this.y).copy(this)
    }
    copy(source: ConicGradient) {
        super.copy(source)
        this.startAngle = source.startAngle
        this.x = source.x
        this.y = source.y
        return this
    }
    getGradientColor(x: number, y: number) {
        // 极角（相对中心），减去起始角后归一化到 [0, 1]
        let t = (Math.atan2(y - this.y, x - this.x) - this.startAngle) / (Math.PI * 2)
        if (t < 0) t += 1
        return this.getColorAt(t)
    }
}