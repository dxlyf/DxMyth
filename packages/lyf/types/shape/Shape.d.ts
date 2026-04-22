import { Node } from '../core/Node';
import { IShape, ShapeProps, ShapeEventMap } from '../interface/shape/IShape';
export declare class Shape<Props extends ShapeProps, Events extends ShapeEventMap = ShapeEventMap> extends Node<Props, Events> implements IShape<Props, Events> {
    type: "Shape";
}
