import { Renderer } from "src/core/Renderer";
import { Shape,type ShapeProps} from "src/core/Shape";
import { BoundingRect } from "src/math/BoundingRect";

export type RectProps=ShapeProps<{
    x?:number
    y?:number
    width?:number
    height?:number
}>
export class Rect extends Shape<RectProps>{
    type="Rect"
    getDefaultProps(): Partial<RectProps>[] {
        return [...super.getDefaultProps(),{
            shape:{
                x:0,
                y:0,
                width:100,
                height:100,
            }
        }]
    }
    calcLocalBounds(out: BoundingRect): BoundingRect {
       const shape=this.props.shape
        out.fromXYWH(shape.x,shape.y,shape.width,shape.height)
        return out
    }
    hitTest(x: number, y: number): boolean {
        throw new Error("Method not implemented.");
    }

    draw(renderer:Renderer):void {
        const shape=this.props.shape
        renderer.rect(shape.x,shape.y,shape.width,shape.height)
    }
    render(renderer:Renderer){
        renderer.renderShape(this)
    }
  
}