/**
 * PathCommand - 表示 Path2D 相关的绘制命令
 * 每个 command 对应 Path2D / CanvasRenderingContext2D 中的一个路径操作
 */

/** 命令类型枚举 */
export const enum PathCommandType {
    /** 开始新路径，清空当前路径 */
    BeginPath = 'beginPath',
    /** 移动到指定点，作为新子路径的起点 */
    MoveTo = 'moveTo',
    /** 从当前点画直线到指定点 */
    LineTo = 'lineTo',
    /** 二次贝塞尔曲线到指定点 */
    QuadraticCurveTo = 'quadraticCurveTo',
    /** 三次贝塞尔曲线到指定点 */
    BezierCurveTo = 'bezierCurveTo',
    /** 圆弧（基于圆心和角度） */
    Arc = 'arc',
    /** 切线圆弧（基于两个切点和半径） */
    ArcTo = 'arcTo',
    /** 椭圆弧（支持独立半径和旋转） */
    Ellipse = 'ellipse',
    /** 矩形子路径 */
    Rect = 'rect',
    /** 圆角矩形子路径 */
    RoundRect = 'roundRect',
    /** 关闭当前子路径，连接到起点 */
    ClosePath = 'closePath',
}

/** MoveTo 命令：移动到 (x, y) */
export interface MoveToCommand {
    type: PathCommandType.MoveTo
    x: number
    y: number
}

/** LineTo 命令：直线到 (x, y) */
 interface LineToCommand {
    type: PathCommandType.LineTo
    x: number
    y: number
}

/** QuadraticCurveTo 命令：二次贝塞尔，控制点 (cpx, cpy)，终点 (x, y) */
export interface QuadraticCurveToCommand {
    type: PathCommandType.QuadraticCurveTo
    cpx: number
    cpy: number
    x: number
    y: number
}

/** BezierCurveTo 命令：三次贝塞尔，控制点 (cp1x, cp1y) 和 (cp2x, cp2y)，终点 (x, y) */
export interface BezierCurveToCommand {
    type: PathCommandType.BezierCurveTo
    cp1x: number
    cp1y: number
    cp2x: number
    cp2y: number
    x: number
    y: number
}

/** Arc 命令：圆心 (x, y)，半径 radius，起止角度，方向 */
export interface ArcCommand {
    type: PathCommandType.Arc
    x: number
    y: number
    radius: number
    startAngle: number
    endAngle: number
    counterclockwise?: boolean
}

/** ArcTo 命令：切点 (x1, y1) 和 (x2, y2)，半径 radius */
export interface ArcToCommand {
    type: PathCommandType.ArcTo
    x1: number
    y1: number
    x2: number
    y2: number
    radius: number
}

/** Ellipse 命令：圆心 (x, y)，半径 (radiusX, radiusY)，旋转 rotation，起止角度，方向 */
export interface EllipseCommand {
    type: PathCommandType.Ellipse
    x: number
    y: number
    radiusX: number
    radiusY: number
    rotation: number
    startAngle: number
    endAngle: number
    counterclockwise?: boolean
}

/** Rect 命令：左上角 (x, y)，宽高 (w, h) */
export interface RectCommand {
    type: PathCommandType.Rect
    x: number
    y: number
    w: number
    h: number
}

/** RoundRect 命令：左上角 (x, y)，宽高 (w, h)，圆角 radii */
export interface RoundRectCommand {
    type: PathCommandType.RoundRect
    x: number
    y: number
    w: number
    h: number
    radii?: number | DOMPointInit | (number | DOMPointInit)[]
}

/** ClosePath 命令：关闭当前子路径 */
export interface ClosePathCommand {
    type: PathCommandType.ClosePath
}

/** BeginPath 命令：开始新路径 */
export interface BeginPathCommand {
    type: PathCommandType.BeginPath
}

/** 所有路径命令的联合类型 */
export type PathCommandLike =
    | BeginPathCommand
    | MoveToCommand
    | LineToCommand
    | QuadraticCurveToCommand
    | BezierCurveToCommand
    | ArcCommand
    | ArcToCommand
    | EllipseCommand
    | RectCommand
    | RoundRectCommand
    | ClosePathCommand

/**
 * PathCommand - 路径命令类
 * 统一封装 Path2D 各类绘制命令，便于序列化、存储、回放和跨渲染器复用
 *
 * 字段说明：
 * - type: 命令类型
 * - args: 数值参数（按命令类型顺序排列，与 Path2D API 一致）
 * - radii: 仅 RoundRect 使用
 * - counterclockwise: 仅 Arc / Ellipse 使用
 */
export class PathCommand {
    type: PathCommandType
    args: number[]
    /** 圆角矩形的圆角参数 */
    radii?: number | DOMPointInit | (number | DOMPointInit)[]
    /** Arc / Ellipse 的逆时针标志 */
    counterclockwise?: boolean

    constructor(
        type: PathCommandType,
        args: number[] = [],
        extra?: {
            radii?: number | DOMPointInit | (number | DOMPointInit)[]
            counterclockwise?: boolean
        }
    ) {
        this.type = type
        this.args = args
        if (extra?.radii !== undefined) this.radii = extra.radii
        if (extra?.counterclockwise !== undefined) this.counterclockwise = extra.counterclockwise
    }

    /** 开始新路径 */
    static beginPath(): PathCommand {
        return new PathCommand(PathCommandType.BeginPath)
    }

    /** 移动到 (x, y) */
    static moveTo(x: number, y: number): PathCommand {
        return new PathCommand(PathCommandType.MoveTo, [x, y])
    }

    /** 直线到 (x, y) */
    static lineTo(x: number, y: number): PathCommand {
        return new PathCommand(PathCommandType.LineTo, [x, y])
    }

    /** 二次贝塞尔曲线 */
    static quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): PathCommand {
        return new PathCommand(PathCommandType.QuadraticCurveTo, [cpx, cpy, x, y])
    }

    /** 三次贝塞尔曲线 */
    static bezierCurveTo(
        cp1x: number, cp1y: number,
        cp2x: number, cp2y: number,
        x: number, y: number
    ): PathCommand {
        return new PathCommand(PathCommandType.BezierCurveTo, [cp1x, cp1y, cp2x, cp2y, x, y])
    }

    /** 圆弧 */
    static arc(
        x: number, y: number, radius: number,
        startAngle: number, endAngle: number,
        counterclockwise?: boolean
    ): PathCommand {
        return new PathCommand(
            PathCommandType.Arc,
            [x, y, radius, startAngle, endAngle],
            { counterclockwise }
        )
    }

    /** 切线圆弧 */
    static arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): PathCommand {
        return new PathCommand(PathCommandType.ArcTo, [x1, y1, x2, y2, radius])
    }

    /** 椭圆弧 */
    static ellipse(
        x: number, y: number,
        radiusX: number, radiusY: number,
        rotation: number,
        startAngle: number, endAngle: number,
        counterclockwise?: boolean
    ): PathCommand {
        return new PathCommand(
            PathCommandType.Ellipse,
            [x, y, radiusX, radiusY, rotation, startAngle, endAngle],
            { counterclockwise }
        )
    }

    /** 矩形 */
    static rect(x: number, y: number, w: number, h: number): PathCommand {
        return new PathCommand(PathCommandType.Rect, [x, y, w, h])
    }

    /** 圆角矩形 */
    static roundRect(
        x: number, y: number, w: number, h: number,
        radii?: number | DOMPointInit | (number | DOMPointInit)[]
    ): PathCommand {
        return new PathCommand(PathCommandType.RoundRect, [x, y, w, h], { radii })
    }

    /** 关闭路径 */
    static closePath(): PathCommand {
        return new PathCommand(PathCommandType.ClosePath)
    }

    /** 克隆当前命令 */
    clone(): PathCommand {
        const cmd = new PathCommand(this.type, this.args.slice())
        if (this.radii !== undefined) cmd.radii = this.radii
        if (this.counterclockwise !== undefined) cmd.counterclockwise = this.counterclockwise
        return cmd
    }

    /** 应用到 Path2D / CanvasRenderingContext2D 类目标 */
    apply(target: Path2D|CanvasRenderingContext2D): void {
        const a = this.args
        switch (this.type) {
            case PathCommandType.BeginPath: (target as CanvasRenderingContext2D).beginPath(); break
            case PathCommandType.MoveTo: target.moveTo(a[0], a[1]); break
            case PathCommandType.LineTo: target.lineTo(a[0], a[1]); break
            case PathCommandType.QuadraticCurveTo: target.quadraticCurveTo(a[0], a[1], a[2], a[3]); break
            case PathCommandType.BezierCurveTo: target.bezierCurveTo(a[0], a[1], a[2], a[3], a[4], a[5]); break
            case PathCommandType.Arc: target.arc(a[0], a[1], a[2], a[3], a[4], this.counterclockwise); break
            case PathCommandType.ArcTo: target.arcTo(a[0], a[1], a[2], a[3], a[4]); break
            case PathCommandType.Ellipse: target.ellipse(a[0], a[1], a[2], a[3], a[4], a[5], a[6], this.counterclockwise); break
            case PathCommandType.Rect: target.rect(a[0], a[1], a[2], a[3]); break
            case PathCommandType.RoundRect: target.roundRect(a[0], a[1], a[2], a[3], this.radii); break
            case PathCommandType.ClosePath: target.closePath(); break
        }
    }
}
