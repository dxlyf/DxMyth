import { CanvasKit } from '../../../../../../../src/canvaskit';
import { CanvasBaseDrawStyle } from './Renderer';
import { DisplayObjectStyle } from './DisplayObject';
export interface ShapeStyleConfig extends DisplayObjectStyle, CanvasBaseDrawStyle {
}
export interface ShapeConfig {
    buildPath?(path: CanvasKit.Path): void;
}
