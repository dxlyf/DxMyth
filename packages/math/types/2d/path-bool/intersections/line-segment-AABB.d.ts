import { AABB } from '../primitives/AABB';
import { Vector } from '../primitives/Vector';
type LineSegment = [Vector, Vector];
export declare function lineSegmentAABBIntersect(seg: LineSegment, boundingBox: AABB): boolean;
export {};
