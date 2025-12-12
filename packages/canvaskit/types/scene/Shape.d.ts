import { DisplayObjectOptions } from '../../../../../../../src/types/DisplayObject';
import { DisplayObject } from '../../../../../../../src/scene/DisplayObject';
import { ShapeStyleConfig, ShapeConfig } from '../../../../../../../src/types/Shape';
import { CanvaskitRenderer } from '../../../../../../../src/renderer/CanvaskitRenderer';
import { CanvasKit } from '../../../../../../../src/canvaskit';
export interface ShapeOptions<Shape extends ShapeConfig = ShapeConfig, Style extends ShapeStyleConfig = ShapeStyleConfig> extends DisplayObjectOptions<Style> {
    shape: Shape;
}
export declare class Shape<Options extends ShapeOptions = ShapeOptions> extends DisplayObject<Options> {
    type: string;
    _ckPath: CanvasKit.Path;
    constructor(options?: Options);
    get shape(): Options['shape'];
    get ckPath(): CanvasKit.Path;
    setShape(shape: Options['shape']): void;
    dirtyShape(): void;
    getDefaultProps(): Options[];
    innerCalcBounds(): void;
    buildInnerPath(): void;
    buildPath(path: CanvasKit.Path): void;
    hasFill(): boolean;
    hasStroke(): boolean;
    startDraw(renderer: CanvaskitRenderer): void;
    draw(renderer: CanvaskitRenderer): void;
    endDraw(renderer: CanvaskitRenderer): void;
    hitPath(x: number, y: number): boolean;
    dispose(): void;
}
