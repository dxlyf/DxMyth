import { Path2D } from "skia-path2d";
import { DisplayObject } from "src/core/DisplayObject";

import { DisplayObjectProps } from "src/types/core/DisplayObject";
export type TextShapeProps={
    text?:string
}

export class Text extends DisplayObject<TextShapeProps>{
    defaultProps() {
        return [...super.defaultProps(),{
            silent:true,
            style:{
                fontSize:14
            },
            shape:{
                text:''
            } as TextShapeProps
        }] as DisplayObjectProps<TextShapeProps>[]
    }
    buildPath(path:Path2D): void {
        path.getPath().reset()
        const font=this.owner.fonts.Arial
        const svgPath= font.getPath(this.shape.text,0,0,this.style.fontSize,{}).toPathData(2)
        path.fromSvgPath(svgPath)
    }
    
}
