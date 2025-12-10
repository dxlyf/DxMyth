import { DisplayObjectStyle } from './DisplayObject';
import { CanvasBaseDrawStyle, TextDrawingStyles } from './Renderer';
export interface TextStyleConfig extends DisplayObjectStyle, CanvasBaseDrawStyle, TextDrawingStyles {
    text?: string;
}
