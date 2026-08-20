import { Vector2 } from '../../Vector2';
import { Curve } from '../Curve';
export declare class QuadraticBezierCurve extends Curve<Vector2> {
    isQuadraticBezierCurve: boolean;
    type: string;
    /** 起点 */
    v0: Vector2;
    /** 控制点 */
    v1: Vector2;
    /** 终点 */
    v2: Vector2;
    constructor(v0?: Vector2, v1?: Vector2, v2?: Vector2);
    getPoint(t: number, optionalTarget?: Vector2): Vector2;
    copy(source: QuadraticBezierCurve): this;
    toJSON(): Record<string, unknown>;
    fromJSON(json: Record<string, any>): this;
}
