import { Vector2 } from '../Vector2';
import { CurvePath } from './CurvePath';
import { CurveJSON } from './Curve';
export declare class Path extends CurvePath<Vector2> {
    type: string;
    /** 当前偏移点：之后添加的曲线都从这里开始 */
    currentPoint: Vector2;
    constructor(points?: Vector2[]);
    /** 从点列表创建路径（每段作为 LineCurve） */
    setFromPoints(points: Vector2[]): this;
    /** 将 currentPoint 移动到给定点 */
    moveTo(x: number, y: number): this;
    /** 添加一条连接当前点与给定点的 LineCurve */
    lineTo(x: number, y: number): this;
    /** 添加一条连接当前点与给定点的 QuadraticBezierCurve */
    quadraticCurveTo(aCPx: number, aCPy: number, aX: number, aY: number): this;
    /** 添加一条连接当前点与给定点的 CubicBezierCurve */
    bezierCurveTo(aCP1x: number, aCP1y: number, aCP2x: number, aCP2y: number, aX: number, aY: number): this;
    /** 添加一条经过给定点列表的 SplineCurve（起点为当前点） */
    splineThru(pts: Vector2[]): this;
    /** 添加一条相对当前点的圆弧（作为 EllipseCurve） */
    arc(aX: number, aY: number, aRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean): this;
    /** 添加一条绝对定位的圆弧（作为 EllipseCurve） */
    absarc(aX: number, aY: number, aRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean): this;
    /** 添加一条相对当前点的椭圆（作为 EllipseCurve） */
    ellipse(aX: number, aY: number, xRadius: number, yRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean, aRotation: number): this;
    /** 添加一条绝对定位的椭圆（作为 EllipseCurve） */
    absellipse(aX: number, aY: number, xRadius: number, yRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean, aRotation: number): this;
    /**
     * 添加一个矩形子路径（Canvas 2D rect 语义，隐式闭合）。
     * @param x 左上角 X
     * @param y 左上角 Y
     * @param width 宽度
     * @param height 高度
     */
    rect(x: number, y: number, width: number, height: number): this;
    /**
     * 添加一个圆角矩形子路径（Canvas 2D roundRect 语义，隐式闭合）。
     * @param x 左上角 X
     * @param y 左上角 Y
     * @param w 宽度
     * @param h 高度
     * @param radii 圆角半径，支持：
     *   - number: 四个角统一半径
     *   - [all]: 四角统一半径
     *   - [tl, br]: 左上/右下与右上/左下两两相同（CSS 2 值规则）
     *   - [tl, tr, br, bl]: 分别指定四个角
     */
    roundRect(x: number, y: number, w: number, h: number, radii?: number | number[]): this;
    copy(source: Path): this;
    toJSON(): CurveJSON;
    fromJSON(json: CurveJSON & {
        currentPoint?: number[];
    }): this;
}
