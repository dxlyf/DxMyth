import { DisplayObjectOptions } from '../../../../../../../src/types/DisplayObject';
import { DisplayObject } from '../../../../../../../src/scene/DisplayObject';
import { CanvaskitRenderer } from '../../../../../../../src/renderer/CanvaskitRenderer';
import { CanvasKit } from '../../../../../../../src/canvaskit';
import { ParagraphStyleConfig } from '../../../../../../../src/types/Paragraph';
export interface ParagraphOptions<Shape extends ParagraphShapeConfig = ParagraphShapeConfig, Style extends ParagraphStyleConfig = ParagraphStyleConfig> extends DisplayObjectOptions<Style> {
    shape: Shape;
    onDraw?: (obj: Paragraph, renderer: CanvaskitRenderer) => void;
}
export interface ParagraphShapeConfig {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}
export declare class Paragraph<Options extends ParagraphOptions = ParagraphOptions> extends DisplayObject<Options> {
    type: string;
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
    createParagraph(fontProvider?: CanvasKit.TypefaceFontProvider): CanvasKit.Paragraph;
    draw(renderer: CanvaskitRenderer): void;
    endDraw(renderer: CanvaskitRenderer): void;
    hitPath(x: number, y: number): boolean;
    dispose(): void;
}
