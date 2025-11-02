import { NodeEvents, NodeOptions,INode } from "./Node";
import { ICanvaskitRenderer } from "./Renderer";
import { ShapeConfig } from "./Shape";
import { StyleConfig } from "./Style";

export interface DisplayObjectEvents extends NodeEvents{

}

export interface DisplayObjectOptions<Shape extends ShapeConfig={},Style extends StyleConfig={}> extends NodeOptions{
     shape:Shape
     style:Style
}
export interface IDisplayObject<Options extends DisplayObjectOptions=DisplayObjectOptions> extends INode<Options>{
  
}