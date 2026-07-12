import { PointLike } from './Point';
declare function windCubicBezier(px: number, py: number, p0: PointLike, p1: PointLike, p2: PointLike, p3: PointLike): number;
declare function windQuadraticBezier(px: number, py: number, p0: PointLike, p1: PointLike, p2: PointLike): number;
declare function windLine(x: number, y: number, x0: number, y0: number, x1: number, y1: number): number;
export { windLine, windQuadraticBezier, windCubicBezier, };
