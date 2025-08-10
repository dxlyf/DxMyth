import { Vector } from './Vector';
export type AABB = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
export declare function boundingBoxesOverlap(a: AABB, b: AABB): boolean;
export declare function mergeBoundingBoxes(a: AABB | null, b: AABB): AABB;
export declare function extendBoundingBox(boundingBox: AABB | null, point: Vector): {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
export declare function boundingBoxMaxExtent(boundingBox: AABB): number;
export declare function boundingBoxAroundPoint(point: Vector, padding: number): AABB;
export declare function expandBoundingBox(boundingBox: AABB, padding: number): AABB;
