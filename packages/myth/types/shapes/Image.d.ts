import { DisplayObject } from '../../../../../../../../src/core/DisplayObject';
import { ImageSource } from '../../../../../../../../src/image/ImageSource';
import { Renderer2DContext } from '../../../../../../../../src/types/core/BaseRenderer';
import { DisplayObjectProps } from '../../../../../../../../src/types/core/DisplayObject';
import { RenderObject } from '../../../../../../../../src/types/core/Paint';
export type ImageShapeProps = {
    image: string | CanvasImageSource;
    sx?: number;
    sy?: number;
    sw?: number;
    sh?: number;
    dx?: number;
    dy?: number;
    dw?: number;
    dh?: number;
};
export type ImageStyleProps = {};
export declare class Image extends DisplayObject<DisplayObjectProps<ImageShapeProps, ImageStyleProps>> {
    _imageSource: ImageSource;
    constructor(props?: DisplayObjectProps<ImageShapeProps, ImageStyleProps>);
    defaultProps(): DisplayObjectProps<ImageShapeProps, ImageStyleProps>[];
    render(renderer: Renderer2DContext, renderObject: RenderObject): void;
}
