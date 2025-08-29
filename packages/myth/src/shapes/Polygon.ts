import { Path2D } from "skia-path2d";
import { DisplayObject } from "src/core/DisplayObject";

export type PolygonShapeProps={
   points:number[]
}
export class Polygon extends DisplayObject<PolygonShapeProps>{
    defaultProps() {
        return [...super.defaultProps(),{
            shape:{
                points:[]
            } as PolygonShapeProps
        }]
    }
    buildPath(path:Path2D): void {
        path.getPath().reset()
        const shape=this.shape as PolygonShapeProps
        const points=shape.points
        if(points.length>0){
            path.moveTo(points[0],points[1])
            for(let i=2;i<points.length;i+=2){
                path.lineTo(points[i],points[i+1])
            }
            path.closePath()
        }
    }
    
}
