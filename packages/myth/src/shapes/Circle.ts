import { Path2D } from "skia-path2d";
import { DisplayObject } from "src/core/DisplayObject";
import { DisplayObjectProps } from "src/types/core/DisplayObject";
export type CircleShapeProps={
    cx?:number,
    cy?:number,
    r?:number,
    startAngle?:number,
    endAngle?:number,
    ccw?:boolean

}
export class Circle extends DisplayObject<DisplayObjectProps<CircleShapeProps>>{
    defaultProps() {
        return [...super.defaultProps(),{
            shape:{
                cx:0,
                cy:0,
                r:50,
                startAngle:0,
                endAngle:Math.PI*2,
                ccw:false

            } as CircleShapeProps
        }]
    }
    buildPath(path:Path2D): void {
        path.getPath().reset()
        const shape=this.shape as CircleShapeProps
        path.arc(shape.cx,shape.cy,shape.r,shape.startAngle,shape.endAngle,shape.ccw)
    }
    
}
