import { CanvasKit } from '../../../../../../../src/canvaskit';
import { CanvasDrawBaseStyle } from './Renderer';
import { DisplayObjectStyle } from './DisplayObject';
export interface ShapeStyleConfig extends DisplayObjectStyle, CanvasDrawBaseStyle {
}
export interface ShapeConfig {
    buildPath?(path: CanvasKit.Path): void;
}
