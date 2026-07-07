/**
 * ProxyPath2D - Path2D 代理类
 *
 * 与浏览器原生 Path2D 接口保持一致，同时将所有绘制命令编码为扁平数字数组
 * （而非 PathCommand 对象），大幅降低内存开销。
 *
 * 扁平编码格式（每个命令可变长）：
 *   [cmdType, arg1, arg2, ..., cmdType, arg1, arg2, ...]
 *
 * 各命令的 arg 数量固定，无需存储长度：
 *   BeginPath(10):     [10]
 *   ClosePath(0):      [0]
 *   MoveTo(1):         [1, x, y]
 *   LineTo(2):         [2, x, y]
 *   QuadCurveTo(3):    [3, cpx, cpy, x, y]
 *   BezierCurveTo(4):  [4, cp1x, cp1y, cp2x, cp2y, x, y]
 *   Arc(5):            [5, x, y, r, startA, endA, ccw(0|1)]
 *   ArcTo(6):          [6, x1, y1, x2, y2, r]
 *   Ellipse(7):        [7, x, y, rx, ry, rot, startA, endA, ccw(0|1)]
 *   Rect(8):           [8, x, y, w, h]
 *   RoundRect(9):      [9, x, y, w, h, r]  (仅单半径，复杂 radii 不常用)
 *
 * 内存对比（1000 条 MoveTo）：
 *   PathCommand 对象: ~80KB（1000 对象 + 1000 args 数组 + 字符串属性）
 *   扁平数组:        ~24KB（2000 个 number，含 1000 个 cmd 头 = 16000 bytes + 数组开销）
 */

/** 命令类型索引（数字编码，避免字符串比较） */
export const enum Cmd {
    ClosePath = 0,
    MoveTo = 1,
    LineTo = 2,
    QuadraticCurveTo = 3,
    BezierCurveTo = 4,
    Arc = 5,
    ArcTo = 6,
    Ellipse = 7,
    Rect = 8,
    RoundRect = 9,
    BeginPath = 10,
}

/** 每个命令类型的参数数量（不含 cmd 头），用于遍历时步进 */
const CMD_ARG_COUNT: Record<number, number> = {
    [Cmd.ClosePath]: 0,
    [Cmd.MoveTo]: 2,
    [Cmd.LineTo]: 2,
    [Cmd.QuadraticCurveTo]: 4,
    [Cmd.BezierCurveTo]: 6,
    [Cmd.Arc]: 6,
    [Cmd.ArcTo]: 5,
    [Cmd.Ellipse]: 8,
    [Cmd.Rect]: 4,
    [Cmd.RoundRect]: 5,
    [Cmd.BeginPath]: 0,
}

export class ProxyPath2D implements globalThis.Path2D {
    /** 底层原生 Path2D（可能为空） */
    ctx?: globalThis.Path2D
    /** 扁平编码的命令数组 */
    commandData: any[] = []
    dirty: boolean = true

    constructor(proxy?: globalThis.Path2D) {
        this.ctx = proxy
    }

    // ============ Path2D API ============

    addPath(path: ProxyPath2D, transform?: DOMMatrix2DInit): void {
        this._appendRaw(path.commandData)
    }
    moveTo(x: number, y: number): void {
        this._push(Cmd.MoveTo, x, y)
        this.ctx?.moveTo(x, y)
    }

    lineTo(x: number, y: number): void {
        this._push(Cmd.LineTo, x, y)
        this.ctx?.lineTo(x, y)
    }

    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
        this._push(Cmd.QuadraticCurveTo, cpx, cpy, x, y)
        this.ctx?.quadraticCurveTo(cpx, cpy, x, y)
    }

    bezierCurveTo(
        cp1x: number, cp1y: number,
        cp2x: number, cp2y: number,
        x: number, y: number
    ): void {
        this._push(Cmd.BezierCurveTo, cp1x, cp1y, cp2x, cp2y, x, y)
        this.ctx?.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    }

    arc(
        x: number, y: number,
        radius: number,
        startAngle: number, endAngle: number,
        counterclockwise?: boolean
    ): void {
        this._push(Cmd.Arc, x, y, radius, startAngle, endAngle, counterclockwise ? 1 : 0)
        this.ctx?.arc(x, y, radius, startAngle, endAngle, counterclockwise)
    }

    arcTo(
        x1: number, y1: number,
        x2: number, y2: number,
        radius: number
    ): void {
        this._push(Cmd.ArcTo, x1, y1, x2, y2, radius)
        this.ctx?.arcTo(x1, y1, x2, y2, radius)
    }

    ellipse(
        x: number, y: number,
        radiusX: number, radiusY: number,
        rotation: number,
        startAngle: number, endAngle: number,
        counterclockwise?: boolean
    ): void {
        this._push(Cmd.Ellipse, x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise ? 1 : 0)
        this.ctx?.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise)
    }

    closePath(): void {
        this._push(Cmd.ClosePath)
        this.ctx?.closePath()
    }

    rect(x: number, y: number, w: number, h: number): void {
        this._push(Cmd.Rect, x, y, w, h)
        this.ctx?.rect(x, y, w, h)
    }

    /** roundRect: 复杂 radii 降级为 PathCommand 存储（罕见） */
    roundRect(
        x: number, y: number, w: number, h: number,
        radii?: number | DOMPointInit | (number | DOMPointInit)[]
    ): void {
        this._push(Cmd.RoundRect, x, y, w, h, radii)
        this.ctx?.roundRect(x, y, w, h, radii)
    }

    // ============ 内部编码 ============

    /** 向 commandData 末尾追加一条命令 */
    private _push(cmd: Cmd, ...args: any[]): void {
        const d = this.commandData
        d[d.length] = cmd
        for (let i = 0; i < args.length; i++) {
            d[d.length] = args[i]
        }
        this.dirty = true
    }

    /** 直接拼接另一个扁平数组 */
    private _appendRaw(data: number[]): void {
        const d = this.commandData
        for (let i = 0; i < data.length; i++) {
            d[d.length] = data[i]
        }
        this.dirty = true
    }

    // ============ 工具 ============

    clear(): void {
        this.dirty = true
        this.commandData.length = 0
    }

    isEmpty(): boolean {
        return this.commandData.length === 0
    }

    /** 克隆（深拷贝扁平数组） */
    clone(): ProxyPath2D {
        const out = new ProxyPath2D()
        out.ctx = this.ctx
        const src = this.commandData
        const dst = out.commandData
        for (let i = 0; i < src.length; i++) {
            dst[i] = src[i]
        }
        return out
    }

    /** 将命令回放到目标 Path2D / CanvasRenderingContext2D */
    replayTo(target: globalThis.Path2D | CanvasRenderingContext2D): void {
        const d = this.commandData
        for (let i = 0; i < d.length; ) {
            const cmd = d[i++]
            switch (cmd) {
                case Cmd.BeginPath:
                    (target as CanvasRenderingContext2D).beginPath(); break
                case Cmd.ClosePath:
                    target.closePath(); break
                case Cmd.MoveTo:
                    target.moveTo(d[i++], d[i++]); break
                case Cmd.LineTo:
                    target.lineTo(d[i++], d[i++]); break
                case Cmd.QuadraticCurveTo:
                    target.quadraticCurveTo(d[i++], d[i++], d[i++], d[i++]); break
                case Cmd.BezierCurveTo:
                    target.bezierCurveTo(d[i++], d[i++], d[i++], d[i++], d[i++], d[i++]); break
                case Cmd.Arc:
                    target.arc(d[i++], d[i++], d[i++], d[i++], d[i++], !!d[i++]); break
                case Cmd.ArcTo:
                    target.arcTo(d[i++], d[i++], d[i++], d[i++], d[i++]); break
                case Cmd.Ellipse:
                    target.ellipse(d[i++], d[i++], d[i++], d[i++], d[i++], d[i++], d[i++], !!d[i++]); break
                case Cmd.Rect:
                    target.rect(d[i++], d[i++], d[i++], d[i++]); break
                case Cmd.RoundRect:
                    target.roundRect(d[i++], d[i++], d[i++], d[i++], d[i++]); break
            }
        }
    }

    /** 按命令类型遍历（回调接收 cmd 类型和 arg 数组引用） */
    forEach(cb: (cmd: Cmd, args: number[], offset: number) => void): void {
        const d = this.commandData
        for (let i = 0; i < d.length; ) {
            const cmd = d[i]
            const argCount = CMD_ARG_COUNT[cmd] ?? 0
            // 用 slice 切出 args 视图（number[] 的 slice 在 V8 中是 fast-path，开销很小）
            const args = d.slice(i + 1, i + 1 + argCount)
            cb(cmd, args, i)
            i += 1 + argCount
        }
    }

    /** 转换为原生 Path2D */
    toNativePath2D(): globalThis.Path2D {
        const path = new Path2D()
        this.replayTo(path)
        return path
    }
}
