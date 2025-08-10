import { pathFromSvgPath, PathCommand, MoveCommand, LineCommand, QuadCommand, CubicCommand, CloseCommand } from './SvgPathParse'


// Rect  x y w h
export type RectCommand = PathCommand<'R', [number, number, number, number]>

// RoundRect  x y w h r
export type RRectCommand = PathCommand<'RR', [number, number, number, number, any]>

// Arc x y r startAngle endAngle ccw
export type CircleCommand = PathCommand<'AC', [number, number, number, number, number, boolean]>
// ArcTo x1 y1 x y radius
export type ArcToCommand = PathCommand<'AT', [number, number, number, number, number]>

// Ellipse x y rx ry rotation startAngle endAngle ccw
export type EllipseCommand = PathCommand<'E', [number, number, number, number, number, number, number, boolean]>

type CommandData = MoveCommand | LineCommand | QuadCommand | CubicCommand | CircleCommand | RRectCommand | RectCommand | EllipseCommand | ArcToCommand | CloseCommand;
type Command = CommandData[0]
type CommandParamsInfer<K extends CommandData[0], T extends CommandData = CommandData> = T extends PathCommand<K, infer U> ? U : never

type Point = {
    x: number,
    y: number
}
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
export class ProxyPath2D implements IProxyPath2D {
    commands: CommandData[] = [];
    dirty = false
    _cb: (() => void) | null = null
    constructor(path?: string | ProxyPath2D) {
        if (typeof path === 'string') {
            pathFromSvgPath(this, path)
        } else if (path instanceof ProxyPath2D) {
            this.commands = [...path.commands];
        }
    }
    fromSvgPath(d: string) {
        pathFromSvgPath(this,d)
    }
    onChange(cb: () => void) {
        this._cb = cb
    }
    equals(path: ProxyPath2D): boolean {
        if (this.commands.length !== path.commands.length) return false
        for (let i = 0; i < this.commands.length; i++) {
            const a = this.commands[i]
            const b = path.commands[i]
            if (a[0] !== b[0]) return false
            for (let j = 1; j < a.length; j++) {
                if (a[j] !== b[j]) return false
            }
        }
        return true
    }
    reset() {
        this.commands.length = 0
        this.dirty = true
        this._cb?.()
    }
    clone() {
        return new (this.constructor as typeof ProxyPath2D)(this)
    }
    addCmd<T extends Command = Command>(cmd: T, args: CommandParamsInfer<T>) {
        this.commands.push([cmd].concat(args as any) as CommandData)
        this.dirty = true
        this._cb?.()
    }
    addPath(path: ProxyPath2D, transform?: DOMMatrix2DInit): void {
        this.commands = path.commands.slice()
    }
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise: boolean = false): void {
        this.addCmd('AC', [x, y, radius, startAngle, endAngle, counterclockwise])
    }
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        this.addCmd('AT', [x1, y1, x2, y2, radius])
    }
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
        this.addCmd('C', [cp1x, cp1y, cp2x, cp2y, x, y])
    }
    closePath(): void {
        if (this.commands.length > 0 && this.commands[this.commands.length - 1][0] !== 'Z') {
            this.addCmd('Z', [])
        }
    }
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise: boolean = false): void {
        this.addCmd('E', [x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise])
    }
    lineTo(x: number, y: number): void {
        this.addCmd('L', [x, y])
    }
    moveTo(x: number, y: number): void {
        this.addCmd('M', [x, y])
    }
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
        this.addCmd('Q', [cpx, cpy, x, y])
    }
    rect(x: number, y: number, w: number, h: number): void {
        this.addCmd('R', [x, y, w, h])
    }
    roundRect(x: number, y: number, w: number, h: number, radii?: unknown): void {
        this.addCmd('RR', [x, y, w, h, radii])
    }
    toPath2D(path=new Path2D()){
        return this.toCanvas(path) as Path2D
    }
    toCanvas(ctx: IProxyPath2D) {
        for (const cmd of this.commands) {
            switch (cmd[0]) {
                case 'M':
                    ctx.moveTo(cmd[1], cmd[2]);
                    break;
                case 'L':
                    ctx.lineTo(cmd[1], cmd[2]);
                    break;
                case 'Q':
                    ctx.quadraticCurveTo(cmd[1], cmd[2], cmd[3], cmd[4]);
                    break;
                case 'C':
                    ctx.bezierCurveTo(cmd[1], cmd[2], cmd[3], cmd[4], cmd[5], cmd[6]);
                    break;
                case 'AC':
                    ctx.arc(cmd[1], cmd[2], cmd[3], cmd[4], cmd[5], cmd[6]);
                    break;
                case 'E':
                    ctx.ellipse(cmd[1], cmd[2], cmd[3], cmd[4], cmd[5], cmd[6], cmd[7],cmd[8]);
                    break;
                case 'AT':
                    ctx.arcTo(cmd[1], cmd[2], cmd[3], cmd[4], cmd[5]);
                    break;
                case 'RR':
                    ctx.roundRect(cmd[1], cmd[2], cmd[3], cmd[4], cmd[5]);
                    break;
                case 'R':
                    ctx.rect(cmd[1], cmd[2], cmd[3], cmd[4]);
                    break;
                case 'Z':
                    ctx.closePath();
                    break
            }
        }
        return ctx
    }
}

