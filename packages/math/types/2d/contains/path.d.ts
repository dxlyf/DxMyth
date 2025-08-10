import { ProxyPath2D } from '../path/ProxyPath2D';
import { default as windingLine } from './windingLine';
declare function windingCubic(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x: number, y: number): number;
declare function windingQuadratic(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x: number, y: number): number;
declare function windingArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number, anticlockwise: boolean, x: number, y: number): number;
export declare function contain(pathProxy: ProxyPath2D, x: number, y: number): boolean;
export declare function containStroke(pathProxy: ProxyPath2D, lineWidth: number, x: number, y: number): boolean;
export { windingCubic, windingArc, windingQuadratic, windingLine, };
