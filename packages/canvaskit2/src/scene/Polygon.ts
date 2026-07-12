import { Path2D } from "src/core/Path2D"
import { Renderer } from "src/core/Renderer"
import { Shape, type ShapeProps } from "src/core/Shape"
import { BoundingRect } from "@dxyl/math2"

export type PolygonProps = ShapeProps<{
    /** 顶点数组 [x0, y0, x1, y1, ...] */
    points?: number[]
}>

export class Polygon extends Shape<PolygonProps> {
    type = "Polygon"

    getDefaultProps(): Partial<PolygonProps>[] {
        return [...super.getDefaultProps(), {
            shape: {
                points: [],
            },
            style: {
                closePath: true,
            }
        }]
    }

    calcLocalBounds(out: BoundingRect): BoundingRect {
        const pts = this.props.shape.points
        if (pts.length < 4) return out
        let minX = pts[0], minY = pts[1], maxX = pts[0], maxY = pts[1]
        for (let i = 2; i < pts.length; i += 2) {
            if (pts[i] < minX) minX = pts[i]
            if (pts[i + 1] < minY) minY = pts[i + 1]
            if (pts[i] > maxX) maxX = pts[i]
            if (pts[i + 1] > maxY) maxY = pts[i + 1]
        }
        out.fromXYWH(minX, minY, maxX - minX, maxY - minY)
        return out
    }

    draw(renderer: Renderer): void {
        this.builtinBuildPath()
        const pts = this.props.shape.points
        if (pts.length < 4) return
        renderer.moveTo(pts[0], pts[1])
        for (let i = 2; i < pts.length; i += 2) {
            renderer.lineTo(pts[i], pts[i + 1])
        }
    }

    buildPath(path: Path2D): void {
        const pts = this.props.shape.points
        if (pts.length < 4) return
        path.moveTo(pts[0], pts[1])
        for (let i = 2; i < pts.length; i += 2) {
            path.lineTo(pts[i], pts[i + 1])
        }
    }

    render(renderer: Renderer) {
        renderer.renderShape(this)
    }
}
