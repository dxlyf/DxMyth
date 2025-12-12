import { DisplayObjectOptions, DisplayObjectStyle } from '../../../../../../../src/types/DisplayObject';
import { DisplayObject } from '../../../../../../../src/scene/DisplayObject';
import { CanvaskitRenderer } from '../../../../../../../src/renderer/CanvaskitRenderer';
import { CanvasKit } from '../../../../../../../src/canvaskit';
import { CanvasDrawBaseStyle } from '../../../../../../../src/types/Renderer';
import { Image as ImageMgr } from '../../../../../../../src/core/Image';
export interface ImageOptions<Shape extends ImageShapeConfig = ImageShapeConfig, Style extends ImageStyleConfig = ImageStyleConfig> extends DisplayObjectOptions<Style> {
    shape: Shape;
    onDraw?: (obj: Text, renderer: CanvaskitRenderer) => void;
}
export interface ImageShapeConfig {
    sx?: number;
    sy?: number;
    sw?: number;
    sh?: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    image?: ImageMgr;
}
export interface ImageStyleConfig extends DisplayObjectStyle, CanvasDrawBaseStyle {
}
export declare class Image<Options extends ImageOptions = ImageOptions> extends DisplayObject<Options> {
    static fromUrl(url: string): Image<{
        shape: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        style: {
            fillStyle: string;
        };
    }>;
    type: string;
    _ckPath: CanvasKit.Path;
    constructor(options?: Options);
    get shape(): Options['shape'];
    setShape(shape: Options['shape']): void;
    dirtyShape(): void;
    getDefaultProps(): Options[];
    shouldUpdateBounds(): number;
    innerCalcBounds(): void;
    startDraw(renderer: CanvaskitRenderer): void;
    draw(renderer: CanvaskitRenderer): void;
    endDraw(renderer: CanvaskitRenderer): void;
    hitPath(x: number, y: number): boolean;
    dispose(): void;
}
