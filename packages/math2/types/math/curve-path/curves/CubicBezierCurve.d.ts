import { Vector2 } from '../../Vector2';
import { Curve } from '../Curve';
export declare class CubicBezierCurve extends Curve<Vector2> {
    isCubicBezierCurve: boolean;
    type: string;
    /** 起点 */
    v0: Vector2;
    /** 控制点 1 */
    v1: Vector2;
    /** 控制点 2 */
    v2: Vector2;
    /** 终点 */
    v3: Vector2;
    constructor(v0?: Vector2, v1?: Vector2, v2?: Vector2, v3?: Vector2);
    getPoint(t: number, optionalTarget?: Vector2): Vector2;
    copy(source: CubicBezierCurve): this;
    toJSON(): Record<string, unknown>;
    fromJSON(json: Record<string, any>): this;
}
