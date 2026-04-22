import { INode, NodeProps, NodeEventMap } from '../INode';
export type ShapeProps = {} & NodeProps;
export type ShapeEventMap = {} & NodeEventMap;
export interface IShape<Props extends ShapeProps = ShapeProps, Events extends ShapeEventMap = ShapeEventMap> extends INode<Props, Events> {
}
