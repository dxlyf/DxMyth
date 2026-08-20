import { Color } from '../Color';
import { Vector2 } from '../Vector2';
import { Path } from './Path';
import { Shape } from './Shape';
export declare class ShapePath {
    type: string;
    /** 形状颜色 */
    color: Color;
    /** 已生成的子路径 */
    subPaths: Path[];
    /** 正在生成的当前路径 */
    currentPath: Path | null;
    constructor();
    /** 创建新路径并将其 currentPoint 移到给定点 */
    moveTo(x: number, y: number): this;
    /** 在当前路径上添加一条 LineCurve 到给定点 */
    lineTo(x: number, y: number): this;
    /** 在当前路径上添加一条 QuadraticBezierCurve */
    quadraticCurveTo(aCPx: number, aCPy: number, aX: number, aY: number): this;
    /** 在当前路径上添加一条 CubicBezierCurve */
    bezierCurveTo(aCP1x: number, aCP1y: number, aCP2x: number, aCP2y: number, aX: number, aY: number): this;
    /** 在当前路径上添加一条经过给定点列表的 SplineCurve */
    splineThru(pts: Vector2[]): this;
    /**
     * 将子路径转换为形状数组。
     * @param isCCW 默认实心形状为顺时针、孔洞为逆时针；设为 true 则翻转
     */
    toShapes(isCCW: boolean): Shape[];
}
