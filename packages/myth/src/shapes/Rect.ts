import { DisplayObject } from "src/core/DisplayObject";
import { BoundingRect } from "src/math/BoundingRect";
import { IBaseRenderer } from "src/types/core/BaseRenderer";
import { IViewport } from "src/types/core/Viewport";
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
    calcLocalBounds(): BoundingRect {
        const bounds=BoundingRect.default()
        const shape=this.shape as Required<RectShapeProps>
        bounds.fromRect(shape.x,shape.y,shape.width,shape.height)
        return bounds
    }
    isInViewport(viewport:IViewport): boolean {
        return viewport.intersect(this.getBounds())
    }
    render(renderer: IBaseRenderer): void {
        const shape=this.shape as Required<RectShapeProps>
        renderer.drawRect(shape.x,shape.y,shape.width,shape.height)
    }
    
}
