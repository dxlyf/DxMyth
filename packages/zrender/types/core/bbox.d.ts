/**
 * @author Yi Shen(https://github.com/pissang)
 */
import * as vec2 from './vector';
/**
 * 从顶点数组中计算出最小包围盒，写入`min`和`max`中
 */
export declare function fromPoints(points: ArrayLike<number>[], min: vec2.VectorArray, max: vec2.VectorArray): void;
export declare function fromLine(x0: number, y0: number, x1: number, y1: number, min: vec2.VectorArray, max: vec2.VectorArray): void;
/**
 * 从三阶贝塞尔曲线(p0, p1, p2, p3)中计算出最小包围盒，写入`min`和`max`中
 */
export declare function fromCubic(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, min: vec2.VectorArray, max: vec2.VectorArray): void;
/**
 * 从二阶贝塞尔曲线(p0, p1, p2)中计算出最小包围盒，写入`min`和`max`中
 */
export declare function fromQuadratic(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, min: vec2.VectorArray, max: vec2.VectorArray): void;
/**
 * 从圆弧中计算出最小包围盒，写入`min`和`max`中
 */
export declare function fromArc(x: number, y: number, rx: number, ry: number, startAngle: number, endAngle: number, anticlockwise: boolean, min: vec2.VectorArray, max: vec2.VectorArray): void;
