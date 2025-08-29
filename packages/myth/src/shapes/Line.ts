import { Path2D } from "skia-path2d";
import { DisplayObject } from "src/core/DisplayObject";

export type LineShapeProps={
    x0?:number,
    y0?:number,
    x1?:number,
    y1?:number
}
export class Line extends DisplayObject<LineShapeProps>{
    defaultProps() {
        return [...super.defaultProps(),{
            shape:{
                x0:0,
                y0:0,
                x1:50,
                y1:50,

            } as LineShapeProps
        }]
    }
    buildPath(path:Path2D): void {
        path.getPath().reset()
        const shape=this.shape as LineShapeProps
        path.moveTo(shape.x0,shape.y0)
        path.lineTo(shape.x1,shape.y1)
    }
    
}
