import { TransformValue } from '../../common/Transform';
import { Manifold } from '../Manifold';
import { EdgeShape } from './EdgeShape';
import { PolygonShape } from './PolygonShape';
/**
 * This function collides and edge and a polygon, taking into account edge
 * adjacency.
 */
export declare const CollideEdgePolygon: (manifold: Manifold, edgeA: EdgeShape, xfA: TransformValue, polygonB: PolygonShape, xfB: TransformValue) => void;
