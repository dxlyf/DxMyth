import { Vector3 } from '../../Vector3';
import { Curve } from '../Curve';
export declare class LineCurve3 extends Curve<Vector3> {
    isLineCurve3: boolean;
    type: string;
    /** 起点 */
    v1: Vector3;
    /** 终点 */
    v2: Vector3;
    constructor(v1?: Vector3, v2?: Vector3);
    getPoint(t: number, optionalTarget?: Vector3): Vector3;
    getPointAt(u: number, optionalTarget?: Vector3): Vector3;
    getTangent(t: number, optionalTarget?: Vector3): Vector3;
    getTangentAt(u: number, optionalTarget?: Vector3): Vector3;
    copy(source: LineCurve3): this;
    toJSON(): Record<string, unknown>;
    fromJSON(json: Record<string, any>): this;
}
