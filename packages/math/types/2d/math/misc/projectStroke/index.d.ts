import { Vector2Like as XY } from '../../vec2';
import { TProjection, TProjectStrokeOnPointsOptions } from './types';
/**
 *
 * Used to calculate object's bounding box
 *
 * @see https://github.com/fabricjs/fabric.js/pull/8344
 *
 */
export declare const projectStrokeOnPoints: (points: XY[], options: TProjectStrokeOnPointsOptions, openPath?: boolean) => TProjection[];
