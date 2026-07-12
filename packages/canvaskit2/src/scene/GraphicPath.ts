import { CKPath2D } from "src/ck"
import { Renderer } from "src/core/Renderer"
import { Shape, type ShapeProps } from "src/core/Shape"
import { BoundingRect } from "@dxyl/math2"

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
    
}>

export class GraphicPath extends Shape<GraphicPathProps> {
    type = "GraphicPath"

    getDefaultProps(): Partial<GraphicPathProps>[] {
        return [...super.getDefaultProps(), {
            shape: {
            }
        }]
    }

    beginPath(){
        this.path.beginPath()
    }
    moveTo(x: number, y: number){
        this.path.moveTo(x, y)
    }
    lineTo(x: number, y: number){
        this.path.lineTo(x, y)
    }
    quadraticCurveTo(x1: number, y1: number, x2: number, y2: number){
        this.path.quadraticCurveTo(x1, y1, x2, y2)
    }
    bezierCurveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number){
        this.path.bezierCurveTo(x1, y1, x2, y2, x3, y3)
    }
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterClockwise: boolean){
        this.path.arc(x, y, radius, startAngle, endAngle, counterClockwise)
    }
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number){
        this.path.arcTo(x1, y1, x2, y2, radius)
    }
    ellipse(x: number, y: number, rx: number, ry: number,rotation: number, startAngle: number, endAngle: number, counterClockwise: boolean){
        this.path.ellipse(x, y, rx, ry, rotation, startAngle, endAngle, counterClockwise)
    }
    rect(x: number, y: number, width: number, height: number){
        this.path.rect(x, y, width, height)
    }
    roundRect(x: number, y: number, width: number, height: number, radius?: number | DOMPointInit | (number | DOMPointInit)[]){
        this.path.roundRect(x, y, width, height, radius)
    }
    closePath(){
        this.path.closePath()
    }

    buildPath(path: CKPath2D): void {
      
    }
    draw(renderer: Renderer): void {
        renderer.drawPath(this.path)
    }
}
