import { Vector2 } from '../Vector2';
import { Vector3 } from '../Vector3';
import { Curve, CurveJSON } from './Curve';
export declare class CurvePath<T extends Vector2 | Vector3 = Vector2 | Vector3> extends Curve<T> {
    type: string;
    /** 定义路径的曲线数组 */
    curves: Curve[];
    /** 是否自动用一条直线曲线闭合路径 */
    autoClose: boolean;
    /** 各子曲线累计长度缓存 */
    cacheLengths: number[] | null;
    /** 添加一条曲线到路径 */
    add(curve: Curve): void;
    /**
     * 若起点与终点未连接，则添加一条直线曲线闭合路径。
     * @return 当前路径
     */
    closePath(): this;
    /**
     * 返回参数 t 处的点：先按整条路径弧长定位子曲线，再在子曲线上取点。
     */
    getPoint(t: number, optionalTarget?: T): T;
    getLength(): number;
    updateArcLengths(): void;
    /** 返回各子曲线累计长度的数组 */
    getCurveLengths(): number[];
    getSpacedPoints(divisions?: number): T[];
    getPoints(divisions?: number): T[];
    copy(source: CurvePath<T>): this;
    toJSON(): CurveJSON;
    fromJSON(json: CurveJSON & {
        autoClose?: boolean;
        curves?: CurveJSON[];
    }): this;
}
