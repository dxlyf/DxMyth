import { PathCommand, PathCommandType } from './PathCommand'

/**
 * PathCommandData - 以 PathCommand 列表形式存储的路径数据
 * API 与 Path2D / CanvasRenderingContext2D 路径方法一致，
 * 但不直接绘制，而是将每次调用记录为 PathCommand，便于序列化、回放和跨渲染器复用。
 */
export class PathCommandData {
    /** 命令列表 */
    readonly commands: PathCommand[] = []

    constructor(commands?: PathCommand[]) {
        if (commands) {
            for (let i = 0; i < commands.length; i++) {
                this.commands.push(commands[i].clone())
            }
        }
    }

    /** 命令数量 */
    get length(): number {
        return this.commands.length
    }

    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/beginPath) */
    beginPath(): void {
        this.commands.push(PathCommand.beginPath())
    }

    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/moveTo) */
    moveTo(x: number, y: number): void {
        this.commands.push(PathCommand.moveTo(x, y))
    }

    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineTo) */
    lineTo(x: number, y: number): void {
        this.commands.push(PathCommand.lineTo(x, y))
    }

    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo) */
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
        this.commands.push(PathCommand.quadraticCurveTo(cpx, cpy, x, y))
    }

    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo) */
    bezierCurveTo(
        cp1x: number, cp1y: number,
        cp2x: number, cp2y: number,
        x: number, y: number
    ): void {
        this.commands.push(PathCommand.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y))
    }

    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/arc) */
    arc(
        x: number, y: number, radius: number,
        startAngle: number, endAngle: number,
        counterclockwise?: boolean
    ): void {
        this.commands.push(PathCommand.arc(x, y, radius, startAngle, endAngle, counterclockwise))
    }

    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/arcTo) */
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        this.commands.push(PathCommand.arcTo(x1, y1, x2, y2, radius))
    }

    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/ellipse) */
    ellipse(
        x: number, y: number,
        radiusX: number, radiusY: number,
        rotation: number,
        startAngle: number, endAngle: number,
        counterclockwise?: boolean
    ): void {
        this.commands.push(
            PathCommand.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise)
        )
    }

    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/rect) */
    rect(x: number, y: number, w: number, h: number): void {
        this.commands.push(PathCommand.rect(x, y, w, h))
    }

    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/roundRect) */
    roundRect(
        x: number, y: number, w: number, h: number,
        radii?: number | DOMPointInit | (number | DOMPointInit)[]
    ): void {
        this.commands.push(PathCommand.roundRect(x, y, w, h, radii))
    }

    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/closePath) */
    closePath(): void {
        this.commands.push(PathCommand.closePath())
    }

    /** 追加一条命令 */
    push(command: PathCommand): void {
        this.commands.push(command.clone())
    }

    /** 追加多条命令 */
    pushAll(commands: PathCommand[]): void {
        for (let i = 0; i < commands.length; i++) {
            this.commands.push(commands[i].clone())
        }
    }

    /** 清空所有命令 */
    clear(): void {
        this.commands.length = 0
    }

    /** 克隆当前路径数据 */
    clone(): PathCommandData {
        const out = new PathCommandData()
        for (let i = 0; i < this.commands.length; i++) {
            out.commands.push(this.commands[i].clone())
        }
        return out
    }

    /**
     * 将所有命令应用到目标对象（Path2D / CanvasRenderingContext2D / PathBuilder 等）
     */
    applyTo(target: Path2D|CanvasRenderingContext2D): void {
        for (let i = 0; i < this.commands.length; i++) {
            this.commands[i].apply(target)
        }
    }

    /** 遍历命令 */
    forEach(callback: (cmd: PathCommand, index: number) => void): void {
        for (let i = 0; i < this.commands.length; i++) {
            callback(this.commands[i], i)
        }
    }

    /** 转换为 Path2D（DOM 原生） */
    toPath2D(): Path2D {
        const path = new Path2D()
        this.applyTo(path)
        return path
    }
}
