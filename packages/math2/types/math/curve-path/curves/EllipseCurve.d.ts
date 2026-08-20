import { Vector2 } from '../../Vector2';
import { Curve } from '../Curve';
export declare class EllipseCurve extends Curve<Vector2> {
    isEllipseCurve: boolean;
    type: string;
    /** 椭圆中心 X */
    aX: number;
    /** 椭圆中心 Y */
    aY: number;
    /** X 方向半径 */
    xRadius: number;
    /** Y 方向半径 */
    yRadius: number;
    /** 起始角（弧度，从正 X 轴起） */
    aStartAngle: number;
    /** 结束角（弧度，从正 X 轴起） */
    aEndAngle: number;
    /** 是否顺时针绘制 */
    aClockwise: boolean;
    /** 椭圆旋转角（弧度，逆时针，相对正 X 轴） */
    aRotation: number;
    constructor(aX?: number, aY?: number, xRadius?: number, yRadius?: number, aStartAngle?: number, aEndAngle?: number, aClockwise?: boolean, aRotation?: number);
    getPoint(t: number, optionalTarget?: Vector2): Vector2;
    copy(source: EllipseCurve): this;
    toJSON(): Record<string, unknown>;
    fromJSON(json: Record<string, any>): this;
}
