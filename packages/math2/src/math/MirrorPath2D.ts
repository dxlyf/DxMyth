
import { Matrix2DLike, Matrix2D } from "./Matrix2D"
import { parseSvgPath } from "./ParseSvgPath";

export interface IMirrorPath2D {
    addPath(path: MirrorPath2D, transform?: Matrix2DLike): void;
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
    roundRect(x: number, y: number, w: number, h: number, radii?: number | number[]): void;
}

type MoveCommand = { type: 'M', data: [x: number, y: number] }
type LineCommand = { type: 'L', data: [x: number, y: number] }
type QuadraticCurveToCommand = { type: 'Q', data: [cp1x: number, cp1y: number, x: number, y: number] }
type BezierCurveToCommand = { type: 'C', data: [cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number] }
type ArcCommand = { type: 'AC', data: [x: number, y: number, r: number, startA: number, endA: number, ccw: boolean, transform?: Matrix2D] }
type ArcToCommand = { type: 'AT', data: [x1: number, y1: number, x2: number, y2: number, r: number] }
type EllipseArcCommand = { type: 'EA', data: [rx: number, ry: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number,x: number, y: number] }
type EllipseCommand = { type: 'E', data: [x: number, y: number, rx: number, ry: number, rotation: number, startA: number, endA: number, ccw: boolean, transform?: Matrix2D] }
type RectCommand = { type: 'R', data: [x: number, y: number, w: number, h: number, transform?: Matrix2D] }
type RoundRectCommand = { type: 'RR', data: [x: number, y: number, w: number, h: number, r: number | number[], transform?: Matrix2D] }
type CloseCommand = { type: 'Z', data: [] }
type AddPathCommand = { type: 'addPath', data: [path: MirrorPath2D, transform?: Matrix2D] }
type MirrorPath2DCommand = MoveCommand | LineCommand | QuadraticCurveToCommand | BezierCurveToCommand | EllipseArcCommand | ArcCommand | ArcToCommand | EllipseCommand | RectCommand | RoundRectCommand | CloseCommand | AddPathCommand | AddPathCommand


function createMirrorPath2DFromSvgPath(svgPath: string, path: MirrorPath2D): MirrorPath2D {
    // Parse the SVG path string into an array of commands
    const commands = parseSvgPath(svgPath);

    // Track subpaths for proper path closure handling
    const subpaths: { startX: number, startY: number }[] = []
    let currentSubPath: { startX: number, startY: number } | null = null

    // Track current position for relative commands
    let lastX = 0;
    let lastY = 0;

    // Process each command in sequence
    for (let i = 0; i < commands.length; i++) {
        const command = commands[i];
        const type = command[0]; // The command letter
        const data = command; // The command parameters, 1-based indexed

        switch (type) {
            case 'M': // Move To (absolute)
                lastX = data[1];
                lastY = data[2];

                path.moveTo(lastX, lastY);
                break;
            case 'm': // Move To (relative)
                lastX += data[1];
                lastY += data[2];

                path.moveTo(lastX, lastY);
                break;
            case 'H': // Horizontal Line To (absolute)
                lastX = data[1];

                path.lineTo(lastX, lastY);
                break;
            case 'h': // Horizontal Line To (relative)
                lastX += data[1];

                path.lineTo(lastX, lastY);
                break;
            case 'V': // Vertical Line To (absolute)
                lastY = data[1];

                path.lineTo(lastX, lastY);
                break;
            case 'v': // Vertical Line To (relative)
                lastY += data[1];

                path.lineTo(lastX, lastY);
                break;
            case 'L': // Line To (absolute)
                lastX = data[1];
                lastY = data[2];

                path.lineTo(lastX, lastY);
                break;
            case 'l': // Line To (relative)
                lastX += data[1];
                lastY += data[2];

                path.lineTo(lastX, lastY);
                break;
            case 'C': // Cubic Bezier Curve (absolute)
                lastX = data[5];
                lastY = data[6];

                path.bezierCurveTo(
                    data[1], data[2], // First control point
                    data[3], data[4], // Second control point
                    lastX, lastY // End point
                );
                break;
            case 'c': // Cubic Bezier Curve (relative)
                path.bezierCurveTo(
                    lastX + data[1], lastY + data[2], // First control point
                    lastX + data[3], lastY + data[4], // Second control point
                    lastX + data[5], lastY + data[6] // End point
                );

                lastX += data[5];
                lastY += data[6];
                break;
            case 'S': // Smooth Cubic Bezier Curve (absolute)
                lastX = data[3];
                lastY = data[4];

                path.bezierCurveToShort(
                    data[1], data[2], // Control point
                    lastX, lastY // End point
                );
                break;
            case 's': // Smooth Cubic Bezier Curve (relative)
                path.bezierCurveToShort(
                    lastX + data[1], lastY + data[2], // Control point
                    lastX + data[3], lastY + data[4], // End point
                );

                lastX += data[3];
                lastY += data[4];
                break;
            case 'Q': // Quadratic Bezier Curve (absolute)
                lastX = data[3];
                lastY = data[4];

                path.quadraticCurveTo(
                    data[1], data[2], // Control point
                    lastX, lastY // End point
                );
                break;
            case 'q': // Quadratic Bezier Curve (relative)
                path.quadraticCurveTo(
                    lastX + data[1], lastY + data[2], // Control point
                    lastX + data[3], lastY + data[4] // End point
                );

                lastX += data[3];
                lastY += data[4];
                break;
            case 'T': // Smooth Quadratic Bezier Curve (absolute)
                lastX = data[1];
                lastY = data[2];

                path.quadraticCurveToShort(
                    lastX, lastY // End point
                );
                break;
            case 't': // Smooth Quadratic Bezier Curve (relative)
                lastX += data[1];
                lastY += data[2];

                path.quadraticCurveToShort(
                    lastX, lastY // End point
                );
                break;
            case 'A': // Arc (absolute)
                lastX = data[6];
                lastY = data[7];

                path.arcToSvg(
                    data[1], // rx
                    data[2], // ry
                    data[3] * Math.PI / 180, // x-axis-rotation（度 → 弧度）
                    data[4], // large-arc-flag
                    data[5], // sweep-flag
                    lastX, lastY // End point
                );
                break;
            case 'a': // Arc (relative)
                lastX += data[6];
                lastY += data[7];

                path.arcToSvg(
                    data[1], // rx
                    data[2], // ry
                    data[3] * Math.PI / 180, // x-axis-rotation（度 → 弧度）
                    data[4], // large-arc-flag
                    data[5], // sweep-flag
                    lastX, lastY // End point
                );
                break;
            case 'Z': // Close Path
            case 'z':
                path.closePath();
                if (subpaths.length > 0) {
                    // Return to the start of the current subpath
                    currentSubPath = subpaths.pop();
                    if (currentSubPath) {
                        lastX = currentSubPath.startX;
                        lastY = currentSubPath.startY;
                    }
                    else {
                        lastX = 0;
                        lastY = 0;
                    }
                }
                currentSubPath = null;
                break;
            default:
            // #if _DEBUG
            //  warn(`Unknown SVG path command: ${type}`);
            // #endif
        }

        // Track subpath starts for path closure
        if (type !== 'Z' && type !== 'z') {
            if (currentSubPath === null) {
                currentSubPath = { startX: lastX, startY: lastY };
                subpaths.push(currentSubPath);
            }
        }
    }

    return path;
}


export class MirrorPath2D implements IMirrorPath2D {
    commands: MirrorPath2DCommand[] = []
    matrix: Matrix2D = Matrix2D.identity()

    /** 脏标记：路径发生变化后置为 true，消费方处理完可手动置回 false */
    dirty: boolean = false


    /** 追加命令并标记为脏 */
    private _push(cmd: MirrorPath2DCommand): void {
        this._push(cmd)
        this.dirty = true
    }

    constructor(path?: MirrorPath2D | string) {
        if (typeof path === 'string') {
            createMirrorPath2DFromSvgPath(path, this)
        } else if (path instanceof MirrorPath2D) {
            this.copy(path)
        }
    }

    get isEmpty(): boolean {
        return this.commands.length === 0
    }

    /** 当前点：最后一条命令的结束点（无命令时返回 null） */
    private getLastPoint(): { x: number, y: number } {
        const commands = this.commands
        findLasPoint:
        for (let i = commands.length - 1; i >= 0; i--) {
            const cmd = commands[i]
            const data = cmd.data as number[]
            switch (cmd.type) {
                case 'M':
                case 'L':
                    return { x: data[0], y: data[1] }
                case 'Q':
                    return { x: data[2], y: data[3] }
                case 'EA':
                    return { x: data[5], y: data[6] }
                case 'C':
                    return { x: data[4], y: data[5] }
                case 'AT':
                    return { x: data[2], y: data[3] }
                case 'addPath':
                    return (data[0] as unknown as MirrorPath2D).getLastPoint()
                case 'Z':
                    break // 闭合后回退到子路径起点，继续向前查找
                default:
                    break findLasPoint;
            }
        }
        return { x: 0, y: 0 }
    }

    addPath(path: MirrorPath2D, transform?: Matrix2DLike): this {
        path = path.clone();
        this._push({ type: 'addPath', data: [path, transform ? Matrix2D.from(transform) : undefined] } as AddPathCommand);
        return this
    }
    transform(transform: Matrix2DLike) {
        const commands = this.commands
        const transformData = (data: any[], index: number) => {
            const x = data[index]
            const y = data[index + 1]
            data[index] = transform[0] * x + transform[1] * y + transform[4]
            data[index + 1] = transform[2] * x + transform[3] * y + transform[5]
        }
        const adjustTransform = (currentMatrix?: Matrix2D, transform?: Matrix2D): Matrix2D => {
            if (currentMatrix) {
                return Matrix2D.from(currentMatrix).premultiply(transform);
            }

            return transform.clone();
        }
        for (let i = 0; i < commands.length; i++) {
            const cmd = commands[i]
            const data = cmd.data
            switch (cmd.type) {
                case 'M':
                case 'L':
                    transformData(data, 0)
                    break
                case 'Q':
                    transformData(data, 0)
                    transformData(data, 2)
                    break
                case 'C':
                    transformData(data, 0)
                    transformData(data, 2)
                    transformData(data, 4)
                    break
                case 'AT':
                    transformData(data, 0)
                    transformData(data, 2)
                    break
                case 'EA':
                    transformData(data, 0)
                    transformData(data, 5)
                    break
                case 'AC':
                    data[6] = adjustTransform(data[6] as Matrix2D, Matrix2D.from(transform))
                    break
                case 'E':
                    data[8] = adjustTransform(data[8] as Matrix2D, Matrix2D.from(transform))
                    break
                case 'R':
                    data[4] = adjustTransform(data[4] as Matrix2D, Matrix2D.from(transform))
                    break
                case 'RR':
                    data[5] = adjustTransform(data[5] as Matrix2D, Matrix2D.from(transform))
                    break
                case 'Z':
                    break
                case 'addPath':
                    {
                        const path = data[0] as MirrorPath2D
                        path.transform(transform)
                    }
                    break
            }
        }
        this.dirty = true
    }

    copy(source: MirrorPath2D) {
        this.commands = source.commands.map(cmd => ({
            type: cmd.type,
            data: cmd.data.slice(),
        })) as MirrorPath2DCommand[]
        this.dirty = true
        return this
    }
    clone() {
        return new MirrorPath2D().copy(this)
    }
    moveTo(x: number, y: number): this {
        this._push({type:'M',data:[x, y]})
        return this
    }

    lineTo(x: number, y: number): this {
        this._push({type:'L',data:[x, y]})
        return this
    }

    quadraticCurveTo(cp1x: number, cp1y: number, x: number, y: number): this {
        this._push({type:'Q',data:[cp1x, cp1y, x, y]})
        return this
    }

    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): this {
        this._push({type:'C',data:[cp1x, cp1y, cp2x, cp2y, x, y]})
        return this
    }

    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise = false): this {
        this._push({type:'AC',data:[x, y, radius, startAngle, endAngle, !!counterclockwise]})
        return this
    }

    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): this {
        this._push({type:'AT',data:[x1, y1, x2, y2, radius]})
        return this
    }

    ellipse(
        x: number, y: number, radiusX: number, radiusY: number, rotation: number,
        startAngle: number, endAngle: number, counterclockwise = false,
    ): this {
        this._push({type:'E',data:[x, y, radiusX, radiusY, rotation, startAngle, endAngle, !!counterclockwise]})
        return this
    }

    rect(x: number, y: number, w: number, h: number): this {
        this._push({type:'R',data:[x, y, w, h]})
        return this
    }

    roundRect(x: number, y: number, w: number, h: number, radii?: number | number[]): this {
        this._push({type:'RR',data:[x, y, w, h, radii ?? 0]})
        return this
    }

    closePath(): this {
        this._push({type:'Z',data:[]})
        return this
    }

    /** 平滑三次贝塞尔：若上一条是 C，则自动反射其控制点 */
    bezierCurveToShort(cp2x: number, cp2y: number, x: number, y: number): this {
        const lastPoint = this.getLastPoint()
        const lx = lastPoint ? lastPoint.x : 0
        const ly = lastPoint ? lastPoint.y : 0
        let cp1x: number, cp1y: number
        const last = this.commands[this.commands.length - 1]
        if (last && last.type === 'C') {
            cp1x = lx + (lx - last.data[2])
            cp1y = ly + (ly - last.data[3])
        } else {
            cp1x = lx
            cp1y = ly
        }
        this._push({type:'C',data:[cp1x, cp1y, cp2x, cp2y, x, y]})
        return this
    }

    /** 平滑二次贝塞尔：若上一条是 Q，则自动反射其控制点 */
    quadraticCurveToShort(x: number, y: number): this {
        const lastPoint = this.getLastPoint()
        const lx = lastPoint ? lastPoint.x : 0
        const ly = lastPoint ? lastPoint.y : 0
        let cpx: number, cpy: number
        const last = this.commands[this.commands.length - 1]
        if (last && last.type === 'Q') {
            cpx = lx + (lx - last.data[0])
            cpy = ly + (ly - last.data[1])
        } else {
            cpx = lx
            cpy = ly
        }
        this._push({type:'Q',data:[cpx, cpy, x, y]})
        return this
    }

    /** SVG 椭圆弧：利用当前点作起点，转换为椭圆弧命令 */
    arcToSvg(
        rx: number, ry: number, xAxisRotation: number,
        largeArcFlag: number, sweepFlag: number,
        x: number, y: number,
    ): this {
        this._push({type:'EA',data:[ rx, ry, xAxisRotation, largeArcFlag, sweepFlag,x,y]})
        return this
    }

}
