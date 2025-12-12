import { LayoutNode } from '../types';
import { Axis, Box, Point, Projection } from './types';
export declare function resetAxis(axis: Axis, originAxis: Axis): void;
export declare function resetBox(box: Box, originBox: Box): void;
/**
 * Scales a point based on a factor and an originPoint
 */
export declare function scalePoint(point: number, scale: number, originPoint: number): number;
/**
 * Applies a translate/scale delta to a point
 */
export declare function applyPointProjection(point: number, translate: number, scale: number, originPoint: number, boxScale?: number): number;
/**
 * Applies a translate/scale delta to an axis
 */
export declare function applyAxisProjection(axis: Axis, translate: number, scale: number, originPoint: number, boxScale?: number): void;
/**
 * Applies a translate/scale delta to a box
 */
export declare function applyBoxProjection(box: Box, { x, y }: Projection): void;
/**
 * Apply a tree of deltas to a box. We do this to calculate the effect of all the transforms
 * in a tree upon our box before then calculating how to project it into our desired viewport-relative box
 */
export declare function applyTreeProjection(box: Box, treeScale: Point, path: LayoutNode[]): void;
