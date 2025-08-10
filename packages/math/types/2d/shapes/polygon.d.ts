import { Vector2 } from '../math/vec2';
import { BoundingRect } from '../math/bounding_rect';
export declare class Polygon {
    vertices: Vector2[];
    constructor(vertices: Vector2[]);
    getVectors(): Vector2[];
    getArea(): number;
    getBoundingBox(boundingBox: BoundingRect): BoundingRect;
    contains(x: number, y: number, fillRule: 'nonzero' | 'evenodd'): boolean;
    containsStroke(x: number, y: number, width: number, alignment?: number): boolean;
}
