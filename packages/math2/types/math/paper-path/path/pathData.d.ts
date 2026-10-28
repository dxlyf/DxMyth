import { Point } from '../basic/Point';
import { Size } from '../basic/Size';
/** 解析器要求目标对象提供的绘图命令。 */
export interface PathDataTarget {
    /** 清空已有内容。 */
    clear(): void;
    moveTo(point: Point): void;
    lineTo(point: Point): void;
    cubicCurveTo(handle1: Point, handle2: Point, to: Point): void;
    quadraticCurveTo(handle: Point, to: Point): void;
    /** 椭圆弧，参数顺序同 `Path#arcTo` 的 SVG 形式。 */
    arcTo(to: Point, radius: Size, rotation: number, clockwise: boolean, large: boolean): void;
    closePath(tolerance?: number): void;
}
/** 按 SVG path data 重建目标对象的几何。 */
export declare function parsePathData(target: PathDataTarget, data: string): void;
