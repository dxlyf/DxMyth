import { DisplayObjectStyle } from "./DisplayObject";
import type {CanvasKit} from 'src/canvaskit'
import { CanvasBaseDrawStyle,TextDrawingStyles } from "./Renderer";

export interface TextStyleConfig extends DisplayObjectStyle,CanvasBaseDrawStyle,TextDrawingStyles{
    text?:string
}