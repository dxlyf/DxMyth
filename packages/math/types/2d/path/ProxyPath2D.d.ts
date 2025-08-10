import { PathCommand, MoveCommand, LineCommand, QuadCommand, CubicCommand, CloseCommand } from './SvgPathParse';
export type RectCommand = PathCommand<'R', [number, number, number, number]>;
export type RRectCommand = PathCommand<'RR', [number, number, number, number, any]>;
export type CircleCommand = PathCommand<'AC', [number, number, number, number, number, boolean]>;
export type ArcToCommand = PathCommand<'AT', [number, number, number, number, number]>;
export type EllipseCommand = PathCommand<'E', [number, number, number, number, number, number, number, boolean]>;
type CommandData = MoveCommand | LineCommand | QuadCommand | CubicCommand | CircleCommand | RRectCommand | RectCommand | EllipseCommand | ArcToCommand | CloseCommand;
type Command = CommandData[0];
type CommandParamsInfer<K extends CommandData[0], T extends CommandData = CommandData> = T extends PathCommand<K, infer U> ? U : never;
export interface IProxyPath2D {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/arc) */
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/arcTo) */
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo) */
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/closePath) */
    closePath(): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/ellipse) */
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineTo) */
    lineTo(x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/moveTo) */
    moveTo(x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo) */
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/rect) */
    rect(x: number, y: number, w: number, h: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/roundRect) */
    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]): void;
}
export declare class ProxyPath2D implements IProxyPath2D {
    commands: CommandData[];
    dirty: boolean;
    _cb: (() => void) | null;
    constructor(path?: string | ProxyPath2D);
    fromSvgPath(d: string): void;
    onChange(cb: () => void): void;
    equals(path: ProxyPath2D): boolean;
    reset(): void;
    clone(): ProxyPath2D;
    addCmd<T extends Command = Command>(cmd: T, args: CommandParamsInfer<T>): void;
    addPath(path: ProxyPath2D, transform?: DOMMatrix2DInit): void;
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
    toPath2D(path?: Path2D): Path2D;
    toCanvas(ctx: IProxyPath2D): IProxyPath2D;
}
export {};
