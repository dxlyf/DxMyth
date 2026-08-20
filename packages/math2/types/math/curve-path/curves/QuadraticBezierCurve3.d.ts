import { Vector3 } from '../../Vector3';
import { Curve } from '../Curve';
export declare class QuadraticBezierCurve3 extends Curve<Vector3> {
    isQuadraticBezierCurve3: boolean;
    type: string;
    /** 起点 */
    v0: Vector3;
    /** 控制点 */
    v1: Vector3;
    /** 终点 */
    v2: Vector3;
    constructor(v0?: Vector3, v1?: Vector3, v2?: Vector3);
    getPoint(t: number, optionalTarget?: Vector3): Vector3;
    copy(source: QuadraticBezierCurve3): this;
    toJSON(): Record<string, unknown>;
    fromJSON(json: Record<string, any>): this;
}
