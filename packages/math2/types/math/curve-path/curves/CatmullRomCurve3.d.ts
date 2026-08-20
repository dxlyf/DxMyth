import { Vector3 } from '../../Vector3';
import { Curve, CurveJSON } from '../Curve';
export type CatmullRomCurveType = 'centripetal' | 'chordal' | 'catmullrom';
export declare class CatmullRomCurve3 extends Curve<Vector3> {
    isCatmullRomCurve3: boolean;
    type: string;
    /** 定义曲线的 3D 点数组 */
    points: Vector3[];
    /** 是否闭合 */
    closed: boolean;
    /** 曲线类型：centripetal | chordal | catmullrom */
    curveType: CatmullRomCurveType;
    /** catmullrom 类型的张力，默认 0.5 */
    tension: number;
    constructor(points?: Vector3[], closed?: boolean, curveType?: CatmullRomCurveType, tension?: number);
    getPoint(t: number, optionalTarget?: Vector3): Vector3;
    copy(source: CatmullRomCurve3): this;
    toJSON(): CurveJSON;
    fromJSON(json: Record<string, any>): this;
}
