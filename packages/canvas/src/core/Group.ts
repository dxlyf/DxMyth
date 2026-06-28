import { BoundingRect } from "src/math/BoundingRect";
import { Node } from "./Node";
import { NodeProps } from "src/types/Node";
import { IRenderer } from "src/types/Renderer";


export class Group extends Node<NodeProps>{
    type: string='Group'
    calculateBounds(): BoundingRect {
        throw new Error("Method not implemented.");
    }
    
}