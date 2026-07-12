import { CKPath2D } from "src/ck/CKPath2D"
import { Renderer } from "src/core/Renderer"
import { Shape, type ShapeProps } from "src/core/Shape"
import { BoundingRect } from "@dxyl/math2"

export type RectProps = ShapeProps<{
    x?: number
    y?: number
    width?: number
    height?: number
    /** 圆角半径，设置后使用 roundRect 绘制 */
    radius?: number | [number, number, number, number]
}>

export class Rect extends Shape<RectProps> {
    type = "Rect"

    getDefaultProps(): Partial<RectProps>[] {
        return [...super.getDefaultProps(), {
            shape: {
                x: 0,
                y: 0,
                width: 100,
                height: 100,
            }
        }]
    }

    calcLocalBounds(out: BoundingRect): BoundingRect {
        const shape = this.props.shape
        out.fromXYWH(shape.x, shape.y, shape.width, shape.height)
        return out
    }

    draw(renderer: Renderer): void {
        this.builtinBuildPath()
        const shape = this.props.shape
        const r = shape.radius
        if (r !== undefined && r !== 0) {
            (renderer as any).roundRect(shape.x, shape.y, shape.width, shape.height, r)
        } else {
            renderer.rect(shape.x, shape.y, shape.width, shape.height)
        }
    }

    buildPath(path: CKPath2D): void {
        const shape = this.props.shape
        const r = shape.radius
        if (r !== undefined && r !== 0) {
            path.roundRect(shape.x, shape.y, shape.width, shape.height, r)
        } else {
            path.rect(shape.x, shape.y, shape.width, shape.height)
        }
    }

    render(renderer: Renderer) {
        renderer.renderShape(this)
    }
}
