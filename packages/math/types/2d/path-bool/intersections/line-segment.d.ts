import { Epsilons } from '../Epsilons';
import { Vector } from '../primitives/Vector';
type LineSegment = [Vector, Vector];
export declare function lineSegmentIntersection([[x1, y1], [x2, y2]]: LineSegment, [[x3, y3], [x4, y4]]: LineSegment, eps: Epsilons): [number, number] | null;
export declare function lineSegmentsIntersect(seg1: LineSegment, seg2: LineSegment, eps: Epsilons): boolean;
export {};
