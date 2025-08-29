import { Path2D } from "skia-path2d";
import { DisplayObject } from "src/core/DisplayObject";
export type RectShapeProps={
    x?:number,
    y?:number,
    width?:number,
    height?:number
}
export class Rect extends DisplayObject<RectShapeProps>{
    defaultProps() {
        return [...super.defaultProps(),{
            shape:{
                x:0,
                y:0,
                width:100,
                height:100
            } as RectShapeProps
        }]
    }
    buildPath(path:Path2D): void {
        path.getPath().reset()
        path.rect(this.shape.x,this.shape.y,this.shape.width,this.shape.height)
    }
    
}
