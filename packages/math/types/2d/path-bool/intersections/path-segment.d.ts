import { Epsilons } from '../Epsilons';
import { PathSegment } from '../primitives/PathSegment';
export declare function segmentsEqual(seg0: PathSegment, seg1: PathSegment, eps: number): boolean;
export declare function pathSegmentIntersection(seg0: PathSegment, seg1: PathSegment, eps: Epsilons): [number, number][];
