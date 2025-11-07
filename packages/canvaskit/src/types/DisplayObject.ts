import { NodeEvents, NodeOptions } from "./Node";

export interface DisplayObjectEvents extends NodeEvents{

}
export interface DisplayObjectStyle {

}
export interface DisplayObjectOptions<Style extends DisplayObjectStyle=DisplayObjectStyle> extends NodeOptions{
     style:Style
}
