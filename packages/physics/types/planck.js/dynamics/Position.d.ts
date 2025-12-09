import { Vec2, Vec2Value } from '../common/Vec2';
import { TransformValue } from '../common/Transform';
export declare class Position {
    /** location */
    c: Vec2;
    /** angle */
    a: number;
    getTransform(xf: TransformValue, p: Vec2Value): TransformValue;
}
export declare function getTransform(xf: TransformValue, p: Vec2Value, c: Vec2Value, a: number): TransformValue;
