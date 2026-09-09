import { Vector2 } from '../../Vector2';
import { Curve } from '../Curve';
import { LineCurve } from './LineCurve';
import { EllipseCurve } from './EllipseCurve';
export declare class ArcToCurve extends Curve<Vector2> {
    isArcToCurve: boolean;
    type: string;
    /** 当前点（子路径起点） */
    v0: Vector2;
    /** 角点（两条直线的交点，即 arcTo 的第一个控制点） */
    v1: Vector2;
    /** 第二个控制点 */
    v2: Vector2;
    /** 圆弧半径 */
    radius: number;
    /** 是否退化：退化为直线 v0→v1（此时 arcCurve 为 null） */
    degenerate: boolean;
    /** 直线段与圆弧的切点 T1（位于直线 v0→v1 上） */
    t1: Vector2;
    /** 圆弧与另一条直线的切点 T2（位于直线 v1→v2 上） */
    t2: Vector2;
    /** 圆弧圆心 */
    center: Vector2;
    /** 圆弧起始角（弧度，相对圆心，从正 X 轴起） */
    startAngle: number;
    /** 圆弧结束角（弧度，相对圆心，从正 X 轴起） */
    endAngle: number;
    /** 圆弧方向：与 EllipseCurve 的 aClockwise 约定一致 */
    aClockwise: boolean;
    /** 直线段子曲线 v0→t1 */
    lineCurve: LineCurve;
    /** 圆弧子曲线 t1→t2（退化时为 null） */
    arcCurve: EllipseCurve | null;
    /** 直线长度占总长度比例，用于 getPoint 的弧长参数化 */
    private _lineRatio;
    constructor(v0?: Vector2, v1?: Vector2, v2?: Vector2, radius?: number);
    /** 根据 v0/v1/v2/radius 计算切点、圆心、起止角并构建两条子曲线 */
    private _compute;
    /**
     * 返回曲线上参数 t 处的点。
     * 参数化与弧长成比例：t 小于 _lineRatio 时落在直线段 v0→t1，
     * 否则落在圆弧 t1→t2，保证匀速插值。
     */
    getPoint(t: number, optionalTarget?: Vector2): Vector2;
    /** 细分数量 = 直线段(1) + 圆弧(2×divisions) */
    getResolution(divisions: number): number;
    /** 解析切线：直线段为固定方向，圆弧用 EllipseCurve 的解析切线 */
    getTangent(t: number, optionalTarget?: Vector2): Vector2;
    copy(source: ArcToCurve): this;
    toJSON(): Record<string, unknown>;
    fromJSON(json: Record<string, any>): this;
}
