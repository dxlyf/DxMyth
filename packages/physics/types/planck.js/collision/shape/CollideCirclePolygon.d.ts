import { TransformValue } from '../../common/Transform';
import { CircleShape } from './CircleShape';
import { PolygonShape } from './PolygonShape';
import { Manifold } from '../Manifold';
export declare const CollidePolygonCircle: (manifold: Manifold, polygonA: PolygonShape, xfA: TransformValue, circleB: CircleShape, xfB: TransformValue) => void;
