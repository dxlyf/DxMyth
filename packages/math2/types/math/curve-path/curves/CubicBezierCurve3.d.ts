import { Vector3 } from '../../Vector3';
import { Curve } from '../Curve';
export declare class CubicBezierCurve3 extends Curve<Vector3> {
    isCubicBezierCurve3: boolean;
    type: string;
    /** 起点 */
    v0: Vector3;
    /** 控制点 1 */
    v1: Vector3;
    /** 控制点 2 */
    v2: Vector3;
    /** 终点 */
    v3: Vector3;
    constructor(v0?: Vector3, v1?: Vector3, v2?: Vector3, v3?: Vector3);
    getPoint(t: number, optionalTarget?: Vector3): Vector3;
    copy(source: CubicBezierCurve3): this;
    toJSON(): Record<string, unknown>;
    fromJSON(json: Record<string, any>): this;
}
