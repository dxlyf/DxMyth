import { DisplayObjectOptions } from '../../../../../../../src/types/DisplayObject';
import { DisplayObject } from '../../../../../../../src/scene/DisplayObject';
import { CanvaskitRenderer } from '../../../../../../../src/renderer/CanvaskitRenderer';
import { CanvasKit } from '../../../../../../../src/canvaskit';
import { TextStyleConfig } from '../../../../../../../src/types/Text';
export interface TextOptions<Shape extends TextShapeConfig = TextShapeConfig, Style extends TextStyleConfig = TextStyleConfig> extends DisplayObjectOptions<Style> {
    shape: Shape;
    onDraw?: (obj: Text, renderer: CanvaskitRenderer) => void;
}
export interface TextShapeConfig {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}
export declare class Text<Options extends TextOptions = TextOptions> extends DisplayObject<Options> {
    type: string;
    _ckPath: CanvasKit.Path;
    constructor(options?: Options);
    get shape(): Options['shape'];
    setShape(shape: Options['shape']): void;
    dirtyShape(): void;
    getDefaultProps(): Options[];
    shouldUpdateBounds(): number;
    innerCalcBounds(): void;
    hasFill(): boolean;
    hasStroke(): boolean;
    startDraw(renderer: CanvaskitRenderer): void;
    draw(renderer: CanvaskitRenderer): void;
    endDraw(renderer: CanvaskitRenderer): void;
    hitPath(x: number, y: number): boolean;
    dispose(): void;
}
