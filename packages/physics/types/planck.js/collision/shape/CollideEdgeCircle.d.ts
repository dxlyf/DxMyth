import { TransformValue } from '../../common/Transform';
import { EdgeShape } from './EdgeShape';
import { CircleShape } from './CircleShape';
import { Manifold } from '../Manifold';
export declare const CollideEdgeCircle: (manifold: Manifold, edgeA: EdgeShape, xfA: TransformValue, circleB: CircleShape, xfB: TransformValue) => void;
