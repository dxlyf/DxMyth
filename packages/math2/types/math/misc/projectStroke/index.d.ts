import { Vector2Like } from '../../Vector2';
import { TProjection, TProjectStrokeOnPointsOptions } from './types';
/**
 *
 * Used to calculate object's bounding box
 *
 * @see https://github.com/fabricjs/fabric.js/pull/8344
 *
 */
export declare const projectStrokeOnPoints: (points: Vector2Like[], options: TProjectStrokeOnPointsOptions, openPath?: boolean) => TProjection[];
