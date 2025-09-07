import { Path2D,ProxyPath2D } from "skia-path2d";
import { ElementEffectFlag } from "src/constants";
import { DisplayObject } from "src/core/DisplayObject";
import { DisplayObjectProps } from "src/types/core/DisplayObject";
export type PathShapeProps={

}
export class Path extends DisplayObject<DisplayObjectProps<PathShapeProps>>{
    proxyPath=new ProxyPath2D()
    constructor(props:DisplayObjectProps<PathShapeProps>){
        super(props)
        this.proxyPath.onChange(()=>{
            this.effectFlag|=ElementEffectFlag.Shape

        })
    }
    defaultProps() {
        return [...super.defaultProps(),{
            shape:{

            } as PathShapeProps
        }]
    }
    reset(){
        this.proxyPath.reset()
    }
    fromSvgPath(d: string){
        this.proxyPath.fromSvgPath(d)
    }
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void{
        this.proxyPath.arc(x,y,radius,startAngle,endAngle,counterclockwise)
    }
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void{
        this.proxyPath.arcTo(x1,y1,x2,y2,radius)
    }
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void{
        this.proxyPath.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x,y)
    }
    closePath(): void{
        this.proxyPath.closePath()
    }
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void{
        this.proxyPath.ellipse(x,y,radiusX,radiusY,rotation,startAngle,endAngle,counterclockwise)
    }
    lineTo(x: number, y: number): void{
        this.proxyPath.lineTo(x,y)
    }
    moveTo(x: number, y: number): void{
        this.proxyPath.moveTo(x,y)
    }
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void{
        this.proxyPath.quadraticCurveTo(cpx,cpy,x,y)
    }
    rect(x: number, y: number, w: number, h: number): void{
        this.proxyPath.rect(x,y,w,h)
    }
    roundRect(x: number, y: number, w: number, h: number, radii?: unknown): void{
        this.proxyPath.roundRect(x,y,w,h,radii)
    }
    buildPath(path:Path2D): void {
        path.getPath().reset()
        
        this.proxyPath.toPath2D(path)
    }
    
}
