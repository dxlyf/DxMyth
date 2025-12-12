import { DisplayObjectStyle } from './DisplayObject';
import { CanvasDrawBaseStyle, TextDrawingStyles } from './Renderer';
export interface TextStyleConfig extends DisplayObjectStyle, CanvasDrawBaseStyle, TextDrawingStyles {
    text?: string;
}
