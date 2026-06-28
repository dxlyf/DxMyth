import { Matrix2D } from "../math/Matrix2D"

export type ColorStop = {
    offset: number
    color: string
}

export class Gradient {
    type: string
    colorStops: ColorStop[] = []
    matrix?: Matrix2D
    addColorStop(offset: number, color: string): void {
        this.colorStops.push({ offset, color })
    }
    setTransform(matrix: Matrix2D): void {
        this.matrix = matrix
    }
    getTransform(): Matrix2D {
        return this.matrix
    }
    clone() {
        return new (this.constructor as typeof Gradient)().copy(this)
    }
    copy(source: Gradient) {
        this.colorStops = source.colorStops.map(d => ({ offset: d.offset, color: d.color }))
        if (source.matrix) {
            if (!this.matrix) {
                this.matrix = Matrix2D.identity()
            }
            this.matrix.copy(source.matrix)
        }
        return this
    }
}
export class LinearGradient extends Gradient {
    type = 'linear'
    x0: number
    y0: number
    x1: number
    y1: number
    copy(source: LinearGradient) {
        super.copy(source)
        this.x0 = source.x0,
            this.y0 = source.y0
        this.x1 = source.x1
        this.y1 = source.y1
        return this
    }
}
export class RadialGradient extends Gradient {
    type = 'radial'
    x0: number
    y0: number
    r0: number
    x1: number
    y1: number
    r1: number
    copy(source: RadialGradient) {
        super.copy(source)
        this.x0 = source.x0,
            this.y0 = source.y0
        this.r0 = source.r0
        this.x1 = source.x1
        this.y1 = source.y1
        this.r1 = source.r1
        return this
    }
}
export class ConicGradient extends Gradient {
    type = 'conic'
    startAngle: number
    x: number
    y: number
    copy(source: ConicGradient) {
        super.copy(source)
        this.startAngle = source.startAngle,
            this.x = source.x
        this.y = source.y
        return this

    }
}
