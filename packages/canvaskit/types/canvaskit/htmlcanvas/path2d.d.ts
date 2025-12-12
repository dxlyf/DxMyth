import { CanvasKit } from '../index';
declare function arc(skpath: CanvasKit.Path, x: number, y: number, radius: number, startAngle: number, endAngle: number, ccw: boolean): void;
declare function arcTo(skpath: CanvasKit.Path, x1: number, y1: number, x2: number, y2: number, radius: number): void;
declare function bezierCurveTo(skpath: CanvasKit.Path, cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
declare function closePath(skpath: CanvasKit.Path): void;
declare function ellipse(skpath: CanvasKit.Path, x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, ccw: boolean): void;
declare function lineTo(skpath: CanvasKit.Path, x: number, y: number): void;
declare function moveTo(skpath: CanvasKit.Path, x: number, y: number): void;
declare function quadraticCurveTo(skpath: CanvasKit.Path, cpx: number, cpy: number, x: number, y: number): void;
declare function rect(skpath: CanvasKit.Path, x: number, y: number, width: number, height: number): void;
/**
 * 绘制圆角矩形
 * @param skpath 路径
 * @param x 矩形左上角x坐标
 * @param y 矩形左上角y坐标
 * @param width 矩形宽度
 * @param height 矩形高度
 * @param radius 圆角半径
 * [all-corners]
  [top-left-and-bottom-right, top-right-and-bottom-left]
  [top-left, top-right-and-bottom-left, bottom-right]
  [top-left, top-right, bottom-right, bottom-left]
 * @returns
 *
 */
declare function roundRect(skpath: CanvasKit.Path, x: number, y: number, width: number, height: number, radius?: number | number[]): void;
declare class Path2D {
    _path: CanvasKit.Path;
    constructor(path?: string | CanvasKit.Path | Path2D);
    _getPath(): CanvasKit.Path;
    addPath(path2d: Path2D, transform?: any): void;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, ccw: boolean): void;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
    conicTo(x: number, y: number, x1: number, y1: number, weight: number): void;
    closePath(): void;
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, ccw: boolean): void;
    lineTo(x: number, y: number): void;
    moveTo(x: number, y: number): void;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    rect(x: number, y: number, width: number, height: number): void;
    roundRect(x: number, y: number, width: number, height: number, radius: number | [number, number]): void;
    getBounds(): CanvasKit.Rect;
    computeTightBounds(): CanvasKit.Rect;
    contains(x: number, y: number): boolean;
    simplify(): boolean;
    stroke(opts?: CanvasKit.StrokeOpts): CanvasKit.Path;
    setFillType(fillType: CanvasKit.FillType): void;
    clone(): Path2D;
}
export { Path2D, arc, arcTo, bezierCurveTo, closePath, ellipse, lineTo, moveTo, quadraticCurveTo, rect, roundRect };
