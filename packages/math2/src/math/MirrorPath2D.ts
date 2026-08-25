
import { Matrix2DLike } from "./Matrix2D"
import { parseSvgPath } from "./ParseSvgPath";
import { ellipseSvgArcFromPath, pointOnEllipse, ellipseToCubicBezier, normalizeAngles } from './Arc'
import { PathBuilder } from "./PathBuilder";
import { Vector2, Vector2Like } from "./Vector2";
import { QuadraticBezier } from "./QuadraticBezier";
import { CubicBezier } from "./CubicBezier";
import {EllipseArc} from './shape/EllipseArc'

export interface MirrorPath2D {
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
    /** 平滑三次贝塞尔：自动反射上一个控制点（对应 SVG S/s 命令） */
    bezierCurveToShort(cp2x: number, cp2y: number, x: number, y: number): void;
    /** 平滑二次贝塞尔：自动反射上一个控制点（对应 SVG T/t 命令） */
    quadraticCurveToShort(x: number, y: number): void;
    /** SVG 椭圆弧（对应 SVG A/a 命令），xAxisRotation 单位为弧度 */
    arcToSvg(rx: number, ry: number, xAxisRotation: number, largeArcFlag: boolean | number, sweepFlag: boolean | number, x: number, y: number): void;
}

type MoveCommand = ['M', x: number, y: number]
type LineCommand = ['L', x: number, y: number]
type QuadraticCurveToCommand = ['Q', cp1x: number, cp1y: number, x: number, y: number]
type BezierCurveToCommand = ['C', cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number]
type ArcCommand = ['AC', x: number, y: number, r: number, startA: number, endA: number, ccw: boolean]
type ArcToCommand = ['AT', x1: number, y1: number, x2: number, y2: number, r: number]
type EllipseCommand = ['E', x: number, y: number, rx: number, ry: number, rotation: number, startA: number, endA: number, ccw: boolean]
type RectCommand = ['R', x: number, y: number, w: number, h: number]
type RoundRectCommand = ['RR', x: number, y: number, w: number, h: number, r: number | number[]]
type CloseCommand = ['Z']
type MirrorPath2DCommand = MoveCommand | LineCommand | QuadraticCurveToCommand | BezierCurveToCommand | ArcCommand | ArcToCommand | EllipseCommand | RectCommand | RoundRectCommand | CloseCommand


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
/** 将 MirrorPath2D 命令回放到 PathBuilder（带变换时先归一化为点命令） */
function replayCommandsToPathBuilder(commands: MirrorPath2DCommand[], pb: PathBuilder): void {
    for (let i = 0; i < commands.length; i++) {
        const cmd = commands[i]
        switch (cmd[0]) {
            case 'M': pb.moveTo(cmd[1], cmd[2]); break
            case 'L': pb.lineTo(cmd[1], cmd[2]); break
            case 'Q': pb.quadraticCurveTo(cmd[1], cmd[2], cmd[3], cmd[4]); break
            case 'C': pb.bezierCurveTo(cmd[1], cmd[2], cmd[3], cmd[4], cmd[5], cmd[6]); break
            case 'AC': pb.arc(cmd[1], cmd[2], cmd[3], cmd[4], cmd[5], cmd[6]); break
            case 'AT': pb.arcTo(cmd[1], cmd[2], cmd[3], cmd[4], cmd[5]); break
            case 'E': pb.ellipse(cmd[1], cmd[2], cmd[3], cmd[4], cmd[5], cmd[6], cmd[7], cmd[8]); break
            case 'R': pb.rect(cmd[1], cmd[2], cmd[3], cmd[4]); break
            case 'RR': pb.roundRect(cmd[1], cmd[2], cmd[3], cmd[4], cmd[5]); break
            case 'Z': pb.closePath(); break
        }
    }
}

/** 将 PathBuilder 归一化后的点命令写回 MirrorPath2D */
function emitPathBuilder(pb: PathBuilder, target: MirrorPath2D): void {
    pb.visit({
        moveTo: (p) => target.moveTo(p.x, p.y),
        lineTo: (_start, end) => target.lineTo(end.x, end.y),
        quadraticCurveTo: (_p0, p1, p2) => target.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y),
        cubicCurveTo: (_p0, p1, p2, p3) => target.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y),
        close: () => target.closePath(),
    })
}

/** 将椭圆/圆弧段展平为折线点（三次贝塞尔近似） */
function flattenEllipseToPoints(
    cx: number, cy: number, rx: number, ry: number, rotation: number,
    startAngle: number, endAngle: number, ccw: boolean,
    epsilon: number, push: (x: number, y: number) => void,
): void {
    new EllipseArc(cx, cy, rx, ry, rotation, startAngle, endAngle, ccw)
    .getPoints()
    .forEach(p => push(p.x, p.y))
       
}

/** 将 arcTo 命令展平为 切点直线 + 圆弧 */
function flattenArcToPoints(
    p0: Vector2Like, x1: number, y1: number, x2: number, y2: number, radius: number,
    epsilon: number, push: (x: number, y: number) => void,
): void {
    const dx1 = x1 - p0.x
    const dy1 = y1 - p0.y
    const dx2 = x2 - x1
    const dy2 = y2 - y1
    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1)
    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)

    // 退化情形：直接连线到拐角点
    if (len1 < 1e-10 || len2 < 1e-10 || radius < 1e-10) {
        push(x1, y1)
        return
    }

    const ux1 = dx1 / len1, uy1 = dy1 / len1
    const ux2 = dx2 / len2, uy2 = dy2 / len2
    const cosAngle = ux1 * ux2 + uy1 * uy2
    const sinAngle = ux1 * uy2 - uy1 * ux2

    // 平行或接近平行时，直接连线到拐角点
    if (Math.abs(sinAngle) < 1e-10) {
        push(x1, y1)
        return
    }

    // 符号：顺时针为 -1，逆时针为 +1
    const sign = sinAngle > 0 ? 1 : -1
    // 圆心到拐角的距离（沿角平分线方向）
    const d = Math.abs(radius * Math.tan(Math.acos(cosAngle) / 2))

    // 切点位置
    const t1x = x1 - d * ux1, t1y = y1 - d * uy1
    const t2x = x1 + d * ux2, t2y = y1 + d * uy2

    // 圆心：从切点沿法线方向偏移 radius
    const nx = -uy1, ny = ux1
    const cx = t1x + sign * radius * nx
    const cy = t1y + sign * radius * ny

    const startAngle = Math.atan2(t1y - cy, t1x - cx)
    const endAngle = Math.atan2(t2y - cy, t2x - cx)

    push(t1x, t1y)
    flattenEllipseToPoints(cx, cy, radius, radius, 0, startAngle, endAngle, sign < 0, epsilon, push)
}

/** 将圆角矩形命令展平为 直线 + 圆角弧 */
function flattenRoundRectToPoints(
    x: number, y: number, w: number, h: number, radii: number | number[] | 0,
    epsilon: number, push: (x: number, y: number) => void,
): void {
    // 无圆角 → 普通矩形
    if (radii === 0) {
        push(x, y)
        push(x + w, y)
        push(x + w, y + h)
        push(x, y + h)
        return
    }

    // 解析圆角参数
    let r = 0, r2 = 0, r3 = 0, r4 = 0
    if (typeof radii === 'number') {
        r = r2 = r3 = r4 = radii
    } else {
        const arr = radii
        const len = arr.length
        if (len === 0) {
            push(x, y)
            push(x + w, y)
            push(x + w, y + h)
            push(x, y + h)
            return
        }
        r = arr[0]
        if (len === 1) {
            r2 = r3 = r4 = r
        } else if (len === 2) {
            r2 = arr[1]; r3 = r; r4 = r2
        } else if (len === 3) {
            r2 = arr[1]; r3 = arr[2]; r4 = r2
        } else {
            r2 = arr[1]; r3 = arr[2]; r4 = arr[3]
        }
    }

    // 半径非负
    r = Math.max(0, r); r2 = Math.max(0, r2); r3 = Math.max(0, r3); r4 = Math.max(0, r4)

    // Canvas 标准缩放算法：相邻半径之和超过对应边长时，等比缩小
    const hScale = w > 0 ? Math.min(1, w / (r + r2), w / (r4 + r3)) : 0
    const vScale = h > 0 ? Math.min(1, h / (r + r4), h / (r2 + r3)) : 0
    const scale = Math.min(hScale, vScale)
    if (scale < 1) {
        r *= scale; r2 *= scale; r3 *= scale; r4 *= scale
    }

    // 顺时针构建：上边 → 右上角 → 右边 → 右下角 → 下边 → 左下角 → 左边 → 左上角
    push(x + r, y)
    push(x + w - r2, y)
    if (r2 > 0) flattenArcToPoints({ x: x + w - r2, y }, x + w, y, x + w, y + r2, r2, epsilon, push)
    push(x + w, y + h - r3)
    if (r3 > 0) flattenArcToPoints({ x: x + w, y: y + h - r3 }, x + w, y + h, x + w - r3, y + h, r3, epsilon, push)
    push(x + r4, y + h)
    if (r4 > 0) flattenArcToPoints({ x: x + r4, y: y + h }, x, y + h, x, y + h - r4, r4, epsilon, push)
    push(x, y + r)
    if (r > 0) flattenArcToPoints({ x, y: y + r }, x, y, x + r, y, r, epsilon, push)
    push(x + r, y) // 回到起点
}

export class MirrorPath2D {
    commands: MirrorPath2DCommand[] = []

    /** 脏标记：路径发生变化后置为 true，消费方处理完可手动置回 false */
    private _dirty: boolean = false

    get dirty(): boolean {
        return this._dirty
    }

    set dirty(value: boolean) {
        this._dirty = value
    }

    /** 追加命令并标记为脏 */
    private _push(cmd: MirrorPath2DCommand): void {
        this._push(cmd)
        this._dirty = true
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
    private _getLastPoint(): { x: number, y: number } | null {
        const commands = this.commands
        for (let i = commands.length - 1; i >= 0; i--) {
            const cmd = commands[i]
            switch (cmd[0]) {
                case 'M':
                case 'L':
                    return { x: cmd[1], y: cmd[2] }
                case 'Q':
                    return { x: cmd[3], y: cmd[4] }
                case 'C':
                    return { x: cmd[5], y: cmd[6] }
                case 'AC':
                    return {
                        x: cmd[1] + cmd[3] * Math.cos(cmd[5]),
                        y: cmd[2] + cmd[3] * Math.sin(cmd[5]),
                    }
                case 'AT':
                    return { x: cmd[3], y: cmd[4] }
                case 'E':
                    return pointOnEllipse(cmd[1], cmd[2], cmd[3], cmd[4], cmd[5], cmd[7])
                case 'R':
                    return { x: cmd[1], y: cmd[2] }
                case 'RR':
                    return { x: cmd[1], y: cmd[2] }
                case 'Z':
                    break // 闭合后回退到子路径起点，继续向前查找
            }
        }
        return null
    }

    addPath(path: MirrorPath2D, transform?: Matrix2DLike): this {
        if (!(path instanceof MirrorPath2D)) return this
        const commands = path.commands
        if (!transform) {
            for (let i = 0; i < commands.length; i++) {
                this._push([...commands[i]])
            }
            return this
        }
        // 带变换：先经 PathBuilder 归一化为点命令（弧线/圆角转为贝塞尔），再对全部点应用矩阵
        const pb = new PathBuilder()
        replayCommandsToPathBuilder(commands, pb)
        pb.transform(transform)
        emitPathBuilder(pb, this)
        return this
    }
    transform(transform: Matrix2DLike): this {
        const pb = new PathBuilder()
        replayCommandsToPathBuilder(this.commands, pb)
        pb.transform(transform)
        this.reset()
        emitPathBuilder(pb, this)
        return this
    }
    reset() {
        this.commands = []
        this._dirty = true
    }
    copy(source: MirrorPath2D) {
        this.commands = source.commands.map(cmd => [...cmd])
        this._dirty = true
        return this
    }
    clone() {
        return new MirrorPath2D().copy(this)
    }
    moveTo(x: number, y: number): this {
        this._push(['M', x, y])
        return this
    }

    lineTo(x: number, y: number): this {
        this._push(['L', x, y])
        return this
    }

    quadraticCurveTo(cp1x: number, cp1y: number, x: number, y: number): this {
        this._push(['Q', cp1x, cp1y, x, y])
        return this
    }

    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): this {
        this._push(['C', cp1x, cp1y, cp2x, cp2y, x, y])
        return this
    }

    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise = false): this {
        this._push(['AC', x, y, radius, startAngle, endAngle, !!counterclockwise])
        return this
    }

    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): this {
        this._push(['AT', x1, y1, x2, y2, radius])
        return this
    }

    ellipse(
        x: number, y: number, radiusX: number, radiusY: number, rotation: number,
        startAngle: number, endAngle: number, counterclockwise = false,
    ): this {
        this._push(['E', x, y, radiusX, radiusY, rotation, startAngle, endAngle, !!counterclockwise])
        return this
    }

    rect(x: number, y: number, w: number, h: number): this {
        this._push(['R', x, y, w, h])
        return this
    }

    roundRect(x: number, y: number, w: number, h: number, radii?: number | number[]): this {
        this._push(['RR', x, y, w, h, radii ?? 0])
        return this
    }

    closePath(): this {
        this._push(['Z'])
        return this
    }

    /** 平滑三次贝塞尔：若上一条是 C，则自动反射其控制点 */
    bezierCurveToShort(cp2x: number, cp2y: number, x: number, y: number): this {
        const lastPoint = this._getLastPoint()
        const lx = lastPoint ? lastPoint.x : 0
        const ly = lastPoint ? lastPoint.y : 0
        let cp1x: number, cp1y: number
        const last = this.commands[this.commands.length - 1]
        if (last && last[0] === 'C') {
            cp1x = lx + (lx - last[3])
            cp1y = ly + (ly - last[4])
        } else {
            cp1x = lx
            cp1y = ly
        }
        this._push(['C', cp1x, cp1y, cp2x, cp2y, x, y])
        return this
    }

    /** 平滑二次贝塞尔：若上一条是 Q，则自动反射其控制点 */
    quadraticCurveToShort(x: number, y: number): this {
        const lastPoint = this._getLastPoint()
        const lx = lastPoint ? lastPoint.x : 0
        const ly = lastPoint ? lastPoint.y : 0
        let cpx: number, cpy: number
        const last = this.commands[this.commands.length - 1]
        if (last && last[0] === 'Q') {
            cpx = lx + (lx - last[1])
            cpy = ly + (ly - last[2])
        } else {
            cpx = lx
            cpy = ly
        }
        this._push(['Q', cpx, cpy, x, y])
        return this
    }

    /** SVG 椭圆弧：利用当前点作起点，转换为椭圆弧命令 */
    arcToSvg(
        rx: number, ry: number, xAxisRotation: number,
        largeArcFlag: boolean | number, sweepFlag: boolean | number,
        x: number, y: number,
    ): this {
        const lastPoint = this._getLastPoint()
        const x1 = lastPoint ? lastPoint.x : 0
        const y1 = lastPoint ? lastPoint.y : 0
        ellipseSvgArcFromPath(this, x1, y1, rx, ry, xAxisRotation, !!largeArcFlag, !!sweepFlag, x, y)
        return this
    }
    getSubPaths(epsilon: number = 0.25): { points: Vector2Like[], closed: boolean }[] {
        const subPaths: { points: Vector2Like[], closed: boolean }[] = []
        let subPath: { points: Vector2Like[], closed: boolean } | null = null
        const finish = (closed: boolean) => {
            if (subPath) {
                // 闭合路径：末点与起点不重合时补上起点，保证多边形真正闭合
                if (closed && subPath.points.length > 0
                    && !Vector2.equalsEpsilon(subPath.points[subPath.points.length - 1], subPath.points[0])) {
                    subPath.points.push({ x: subPath.points[0].x, y: subPath.points[0].y })
                }
                subPath.closed = closed
                subPaths.push(subPath)
                subPath = null
            }
        }
        // 直接遍历命令，弧线/椭圆等用贝塞尔近似展平为折线点集
        let current: Vector2Like = { x: 0, y: 0 }
        const push = (x: number, y: number) => {
            if (subPath) subPath.points.push({ x, y })
            current.x = x
            current.y = y
        }
        const lastPoint = () =>
            subPath && subPath.points.length > 0
                ? subPath.points[subPath.points.length - 1]
                : current

        for (let i = 0; i < this.commands.length; i++) {
            const cmd = this.commands[i]
            switch (cmd[0]) {
                case 'M':
                    finish(false)
                    subPath = { points: [{ x: cmd[1], y: cmd[2] }], closed: false }
                    current.x = cmd[1]
                    current.y = cmd[2]
                    break
                case 'L':
                    push(cmd[1], cmd[2])
                    break
                case 'Q': {
                    const p0 = lastPoint()
                    const quad = new QuadraticBezier([p0, { x: cmd[1], y: cmd[2] }, { x: cmd[3], y: cmd[4] }])
                    quad.flatten(epsilon).forEach(p => push(p.x, p.y))
                    break
                }
                case 'C': {
                    const p0 = lastPoint()
                    const curve = new CubicBezier([
                        p0,
                        { x: cmd[1], y: cmd[2] },
                        { x: cmd[3], y: cmd[4] },
                        { x: cmd[5], y: cmd[6] },
                    ])
                    curve.flatten(epsilon).forEach(p => push(p.x, p.y))
                    break
                }
                case 'AC': // 圆弧（圆）→ 贝塞尔近似
                    flattenEllipseToPoints(cmd[1], cmd[2], cmd[3], cmd[3], 0, cmd[4], cmd[5], cmd[6], epsilon, push)
                    break
                case 'E': // 椭圆弧
                    flattenEllipseToPoints(cmd[1], cmd[2], cmd[3], cmd[4], cmd[5], cmd[6], cmd[7], cmd[8], epsilon, push)
                    break
                case 'AT': { // arcTo：切点直线 + 圆弧
                    flattenArcToPoints(lastPoint(), cmd[1], cmd[2], cmd[3], cmd[4], cmd[5], epsilon, push)
                    break
                }
                case 'R': // 矩形：四条边
                    push(cmd[1], cmd[2])
                    push(cmd[1] + cmd[3], cmd[2])
                    push(cmd[1] + cmd[3], cmd[2] + cmd[4])
                    push(cmd[1], cmd[2] + cmd[4])
                    break
                case 'RR': // 圆角矩形：自成一段子路径
                    finish(false)
                    flattenRoundRectToPoints(cmd[1], cmd[2], cmd[3], cmd[4], cmd[5], epsilon, push)
                    break
                case 'Z':
                    finish(true)
                    break
            }
        }
        if (subPath && subPath.points.length > 0) {
            finish(false)
        }
        return subPaths
    }
}
