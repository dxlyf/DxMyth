import { Path2D } from "skia-path2d";
import { DisplayObject } from "src/core/DisplayObject";
import { DisplayObjectProps } from "src/types/core/DisplayObject";
export type PolylineShapeProps={
   points:number[]
}
export class Polyline extends DisplayObject<DisplayObjectProps<PolylineShapeProps>>{
    defaultProps() {
        return [...super.defaultProps(),{
            shape:{
                points:[]
            } as PolylineShapeProps
        }]
    }
    buildPath(path:Path2D): void {
        path.getPath().reset()
        const shape=this.shape as PolylineShapeProps
        const points=shape.points
        if(points.length>0){
            path.moveTo(points[0],points[1])
            for(let i=2;i<points.length;i+=2){
                path.lineTo(points[i],points[i+1])
            }
        }
    }
    
}
