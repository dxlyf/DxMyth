import { NODE_TYPES } from "src/constanst";
import { Node } from "src/core/Node";
import type { IShape, ShapeProps,ShapeEventMap } from "src/interface/shape/IShape";

export class Shape<Props extends ShapeProps,Events extends ShapeEventMap=ShapeEventMap> extends Node<Props,Events> implements IShape<Props,Events> {
    type=NODE_TYPES.Shape
}