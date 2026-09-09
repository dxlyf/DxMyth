import { Vector2 } from '../../Vector2';
import { Curve, CurveJSON } from '../Curve';
export declare class SplineCurve extends Curve<Vector2> {
    isSplineCurve: boolean;
    type: string;
    /** 定义曲线的 2D 点数组 */
    points: Vector2[];
    constructor(points?: Vector2[]);
    getPoint(t: number, optionalTarget?: Vector2): Vector2;
    /** 样条由多个控制点段组成，按控制点数量倍增细分 */
    getResolution(divisions: number): number;
    copy(source: SplineCurve): this;
    toJSON(): CurveJSON;
    fromJSON(json: Record<string, any>): this;
}
