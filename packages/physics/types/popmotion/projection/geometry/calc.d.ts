import { Axis, AxisProjection, Box, Projection, RelativeBox } from './types';
/**
 * Returns true if the provided value is within maxDistance of the provided target
 */
export declare function isNear(value: number, target?: number, maxDistance?: number): boolean;
/**
 * Calculate a transform origin relative to the source axis, between 0-1, that results
 * in an asthetically pleasing scale/transform needed to project from source to target.
 */
export declare function calcOrigin(source: Axis, target: Axis): number;
/**
 * Update the AxisDelta with a transform that projects source into target.
 *
 * The transform `origin` is optional. If not provided, it'll be automatically
 * calculated based on the relative positions of the two bounding boxes.
 */
export declare function updateAxisProjection(projection: AxisProjection, source: Axis, target: Axis, origin?: number): void;
/**
 * Update the projection with a transform that projects the source into the target.
 *
 * The transform `origin` is optional. If not provided, it'll be automatically
 * calculated based on the relative positions of the two bounding boxes.
 */
export declare function updateBoxProjection(projection: Projection, source: Box, target: Box, origin?: number): void;
export declare function calcRelativeAxis(target: Axis, parent: Axis, relative: Partial<Axis>, layout: Axis): void;
export declare function calcRelativeBox(target: Box, parent: Box, relative: RelativeBox, layout: Box): void;
