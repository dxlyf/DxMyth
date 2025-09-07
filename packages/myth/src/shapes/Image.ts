import { Path2D } from "skia-path2d";
import { DisplayObject } from "src/core/DisplayObject";
import { ImageSource } from "src/image/ImageSource";
import { Renderer2DContext } from "src/types/core/BaseRenderer";

import { DisplayObjectProps } from "src/types/core/DisplayObject";
import { RenderObject } from "src/types/core/Paint";
export type ImageShapeProps={
    image:string|CanvasImageSource
    sx?: number 
    sy?: number
    sw?: number
    sh?: number
    dx?: number
    dy?: number
    dw?: number
    dh?: number
}
export type ImageStyleProps={

}

export class Image extends DisplayObject<DisplayObjectProps<ImageShapeProps,ImageStyleProps>>{
    _imageSource:ImageSource
    constructor(props?:DisplayObjectProps<ImageShapeProps,ImageStyleProps>){
        super(props)
        this._imageSource=ImageSource.default()
        this._imageSource.onChange(()=>{
            this.owner.refresh()
        })
    }
    defaultProps() {
        return [...super.defaultProps(),{
            silent:true,
            style:{
                fontSize:14
            },
            shape:{
                text:''
            } 
        }] as DisplayObjectProps<ImageShapeProps,ImageStyleProps>[]
    }
    render(renderer:Renderer2DContext,renderObject:RenderObject){
        const imageUrl=this.shape.image
        const imageSource=this._imageSource.from(imageUrl)
        if(imageSource.shouldRenderer()){
            const image=imageSource.source as HTMLImageElement
            const {sx=0,sy=0,sw=image.width,sh=image.height,dx=0,dy=0,dw=image.width,dh=image.height}=this.shape
            renderer.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh)
        }
    }
    
}
