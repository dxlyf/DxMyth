import { Path2D, ProxyPath2D } from 'skia-path2d';
import { DisplayObject } from '../../../../../../../../src/core/DisplayObject';
import { DisplayObjectProps } from '../../../../../../../../src/types/core/DisplayObject';
export type PathShapeProps = {};
export declare class Path extends DisplayObject<DisplayObjectProps<PathShapeProps>> {
    proxyPath: ProxyPath2D;
    constructor(props: DisplayObjectProps<PathShapeProps>);
    defaultProps(): Partial<DisplayObjectProps<PathShapeProps>>[];
    reset(): void;
    fromSvgPath(d: string): void;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
    closePath(): void;
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    lineTo(x: number, y: number): void;
    moveTo(x: number, y: number): void;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    rect(x: number, y: number, w: number, h: number): void;
    roundRect(x: number, y: number, w: number, h: number, radii?: unknown): void;
    buildPath(path: Path2D): void;
}
