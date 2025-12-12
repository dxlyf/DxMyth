import { TransformValue } from '../../common/Transform';
import { Manifold } from '../Manifold';
import { PolygonShape } from './PolygonShape';
/**
 *
 * Find edge normal of max separation on A - return if separating axis is found
 * Find edge normal of max separation on B - return if separation axis is found
 * Choose reference edge as min(minA, minB)
 * Find incident edge
 * Clip
 *
 * The normal points from 1 to 2
 */
export declare const CollidePolygons: (manifold: Manifold, polyA: PolygonShape, xfA: TransformValue, polyB: PolygonShape, xfB: TransformValue) => void;
