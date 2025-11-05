import { NodeEvents, NodeOptions } from "./Node";
import { ShapeConfig } from "./Shape";
import { StyleConfig } from "./Style";

export interface DisplayObjectEvents extends NodeEvents{

}

export interface DisplayObjectOptions<Shape extends ShapeConfig={},Style extends StyleConfig=StyleConfig> extends NodeOptions{
     shape:Shape
     style:Style
}
// export interface IDisplayObject<Options extends DisplayObjectOptions=DisplayObjectOptions> extends INode<Options>{
//     get shape():Options['shape']
//     get style():Options['style']

// }