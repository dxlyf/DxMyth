import { CKPath2D } from "src/ck"
import { Renderer } from "src/core/Renderer"
import { Shape, type ShapeProps } from "src/core/Shape"
import { BoundingRect } from "@dxyl/math2"

export type LineProps = ShapeProps<{
    x1?: number
    y1?: number
    x2?: number
    y2?: number
}>

export class Line extends Shape<LineProps> {
    type = "Line"

    getDefaultProps(): Partial<LineProps>[] {
        return [...super.getDefaultProps(), {
            shape: {
                x1: 0,
                y1: 0,
                x2: 100,
                y2: 100,
            },
            style: {
                fillStyle: 'none',
                strokeStyle: '#000',
            }
        }]
    }

    calcLocalBounds(out: BoundingRect): BoundingRect {
        const s = this.props.shape
        const minX = Math.min(s.x1, s.x2)
        const minY = Math.min(s.y1, s.y2)
        out.fromXYWH(minX, minY, Math.abs(s.x2 - s.x1), Math.abs(s.y2 - s.y1))
        return out
    }

    draw(renderer: Renderer): void {
        const s = this.props.shape
        renderer.moveTo(s.x1, s.y1)
        renderer.lineTo(s.x2, s.y2)
    }

    buildPath(path: CKPath2D): void {
        const s = this.props.shape
        path.moveTo(s.x1, s.y1)
        path.lineTo(s.x2, s.y2)
    }

    render(renderer: Renderer) {
        renderer.renderShape(this)
    }
}
