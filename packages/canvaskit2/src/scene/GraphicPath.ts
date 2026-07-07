import { CKPath2D } from "src/ck/CKPath2D"
import { Renderer } from "src/core/Renderer"
import { Shape, type ShapeProps } from "src/core/Shape"
import { BoundingRect } from "src/math/BoundingRect"

/**
 * 路径命令编码（与 ProxyPath2D.Cmd 保持一致，避免跨模块依赖）
 */
const enum Cmd {
    MoveTo = 1,
    LineTo = 2,
    QuadraticCurveTo = 3,
    BezierCurveTo = 4,
    Arc = 5,
    ArcTo = 6,
    Ellipse = 7,
    Rect = 8,
    RoundRect = 9,
}

const CMD_ARG_COUNT: Record<number, number> = {
    [Cmd.MoveTo]: 2,
    [Cmd.LineTo]: 2,
    [Cmd.QuadraticCurveTo]: 4,
    [Cmd.BezierCurveTo]: 6,
    [Cmd.Arc]: 6,
    [Cmd.ArcTo]: 5,
    [Cmd.Ellipse]: 8,
    [Cmd.Rect]: 4,
    [Cmd.RoundRect]: 5,
}

export type GraphicPathProps = ShapeProps<{
    /** 扁平路径命令数组 [cmd, ...args, cmd, ...args] */
    commands?: number[]
}>

export class GraphicPath extends Shape<GraphicPathProps> {
    type = "GraphicPath"

    getDefaultProps(): Partial<GraphicPathProps>[] {
        return [...super.getDefaultProps(), {
            shape: {
                commands: [],
            }
        }]
    }

    calcLocalBounds(out: BoundingRect): BoundingRect {
        // 使用 CKPath2D 的内置紧边界
        this.builtinBuildPath()
        const bounds = this.path.computeTightBounds()
        out.copy(bounds)
        return out
    }

    draw(renderer: Renderer): void {
        this.builtinBuildPath()
        // 通过 renderer 原样重放命令
        const cmds = this.props.shape.commands
        if (!cmds || cmds.length === 0) return
        this._replayTo(renderer as any, cmds)
    }

    buildPath(path: CKPath2D): void {
        const cmds = this.props.shape.commands
        if (!cmds || cmds.length === 0) return
        this._replayTo(path, cmds)
    }

    render(renderer: Renderer) {
        renderer.renderShape(this)
    }

    /** 将命令重放到目标 */
    private _replayTo(target: any, d: number[]): void {
        for (let i = 0; i < d.length;) {
            const cmd = d[i++]
            switch (cmd) {
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
}
