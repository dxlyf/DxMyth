import { DisplayObjectStyle } from "./DisplayObject";
import type {CanvasKit} from 'src/canvaskit'
import { CanvasDrawBaseStyle,TextDrawingStyles } from "./Renderer";

export interface TextStyleConfig extends DisplayObjectStyle,CanvasDrawBaseStyle,TextDrawingStyles{
    text?:string
}