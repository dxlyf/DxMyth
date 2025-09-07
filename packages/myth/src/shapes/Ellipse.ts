import { Path2D } from "skia-path2d";
import { DisplayObject } from "src/core/DisplayObject";
import { DisplayObjectProps } from "src/types/core/DisplayObject";
export type EllipseShapeProps={
    cx?:number,
    cy?:number,
    xAxisRoation?:number,
    rx?:number,
    ry?:number,
    startAngle?:number,
    endAngle?:number,
    ccw?:boolean

}
export class Ellipse extends DisplayObject<DisplayObjectProps<EllipseShapeProps>>{
    defaultProps() {
        return [...super.defaultProps(),{
            shape:{
                cx:0,
                cy:0,
                rx:50,
                ry:50,
                xAxisRoation:0,
                startAngle:0,
                endAngle:Math.PI*2,
                ccw:false

            } as EllipseShapeProps
        }]
    }
    buildPath(path:Path2D): void {
        path.getPath().reset()
        const shape=this.shape as EllipseShapeProps
        path.ellipse(shape.cx,shape.cy,shape.rx,shape.ry,shape.xAxisRoation,shape.startAngle,shape.endAngle,shape.ccw)
    }
    
}
