import { Vector2 } from '../../Vector2';
import { Curve } from '../Curve';
export declare class LineCurve extends Curve<Vector2> {
    isLineCurve: boolean;
    type: string;
    /** 起点 */
    v1: Vector2;
    /** 终点 */
    v2: Vector2;
    constructor(v1?: Vector2, v2?: Vector2);
    getPoint(t: number, optionalTarget?: Vector2): Vector2;
    getPointAt(u: number, optionalTarget?: Vector2): Vector2;
    getTangent(t: number, optionalTarget?: Vector2): Vector2;
    getTangentAt(u: number, optionalTarget?: Vector2): Vector2;
    copy(source: LineCurve): this;
    toJSON(): Record<string, unknown>;
    fromJSON(json: Record<string, any>): this;
}
