

import { ColorValue,ColorLike, Color } from 'src/math/Color'
import { Matrix2D, Matrix2DLike } from './Matrix2D'
export type ColorStop = {
    offset: number
    color: ColorLike
}
export interface IGradient {
    type: 'gradient'
    elementType: 'linear-gradient' | 'radial-gradient' | 'conic-gradient'
    stops: ColorStop[]
    matrix?:Matrix2DLike
    clone(): IGradient
    copy(source: IGradient): IGradient
}
export class Gradient implements IGradient {
    type: 'gradient' = 'gradient'
    declare elementType: 'linear-gradient' | 'radial-gradient' | 'conic-gradient'
    stops: ColorStop[] = []
    matrix?:Matrix2D
    addColorStop(offset: number, color: ColorValue): void {
        this.stops.push({
            offset: offset,
            color: Color.fromInput(color)
        })
    }
    cloneColorStops() {
        return this.stops.map((stop) => ({
            offset: stop.offset,
            color: stop.color.slice()
        }))
    }
    transform(a:number,b:number,c:number,d:number,e:number,f:number){
        if(!this.matrix){
            this.matrix=Matrix2D.identity()
        }
        this.matrix.fromValues(a,b,c,d,e,f)
    }
    copy(source: Gradient) {
        this.stops = source.cloneColorStops()
        this.type = source.type
        this.elementType = source.elementType
        if(source.matrix){
            this.matrix=source.matrix.clone()
        }
        return this
    }
    clone(): IGradient {
        return new Gradient()
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
}
CanvasRenderingContext2D.prototype.createConicGradient