
import type {ColorStop, Gradient as IGradient} from './Renderer'
import { ColorValue,Color } from 'src/math/Color'
export  class Gradient implements IGradient{
    type:'gradient'='gradient'
    declare elementType: 'linear-gradient' | 'radial-gradient' | 'conic-gradient'
    stops:ColorStop[]=[]
    addColorStop(offset: number, color: ColorValue): void {
        this.stops.push({
            offset:offset,
            color:Color.fromInput(color)
        })
    }
    cloneColorStops(){
        return this.stops.map((stop)=>({
            offset:stop.offset,
            color:stop.color.slice()
        }))
    }
    copy(source: IGradient): void {
        
    }
    clone(): IGradient {
        return new Gradient()
    }
}

export class LinearGradient extends Gradient{
    elementType:Gradient['elementType']='linear-gradient'
    constructor(public x0:number,public y0:number,public x1:number,public y1:number){
        super()
    }
    clone() {
        return new LinearGradient(this.x0,this.y0,this.x1,this.y1)
    }
    copy(source: LinearGradient): void {
        this.x0=source.x0
        this.y0=source.y0
        this.x1=source.x1
        this.y1=source.y1
        this.stops=source.cloneColorStops()
        this.type=source.type
        this.elementType=source.elementType
    }
}
export class RadialGradient extends Gradient{
    elementType:Gradient['elementType']='radial-gradient'
    constructor(public x0:number,public y0:number,public r0:number,public x1:number,public y1:number,public r1:number){
        super()
    }
    clone() {
        return new RadialGradient(this.x0,this.y0,this.r0,this.x1,this.y1,this.r1)
    }
    copy(source: RadialGradient): void {
        this.x0=source.x0
        this.y0=source.y0
        this.r0=source.r0
        this.x1=source.x1
        this.y1=source.y1
        this.r1=source.r1
        this.stops=source.cloneColorStops()
        this.type=source.type
        this.elementType=source.elementType
    }
}
export class ConicGradient extends Gradient{
    elementType:Gradient['elementType']='conic-gradient'
    constructor(public startAngle:number,public x:number,public y:number){
        super()
    }
    clone() {
        return new ConicGradient(this.startAngle,this.x,this.y)
    }
    copy(source: ConicGradient): void {
        this.startAngle=source.startAngle
        this.x=source.x
        this.y=source.y
        this.stops=source.cloneColorStops()
        this.type=source.type
        this.elementType=source.elementType
    }
}
CanvasRenderingContext2D.prototype.createConicGradient