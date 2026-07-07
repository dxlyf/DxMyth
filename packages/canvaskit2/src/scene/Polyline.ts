import { CKPath2D } from "src/ck/CKPath2D"
import { Renderer } from "src/core/Renderer"
import { Shape, type ShapeProps } from "src/core/Shape"
import { BoundingRect } from "src/math/BoundingRect"

export type PolylineProps = ShapeProps<{
    /** 顶点数组 [x0, y0, x1, y1, ...] */
    points?: number[]
}>

export class Polyline extends Shape<PolylineProps> {
    type = "Polyline"

    getDefaultProps(): Partial<PolylineProps>[] {
        return [...super.getDefaultProps(), {
            shape: {
                points: [],
            },
            style: {
                closePath: false,
                fillStyle: 'none',
                strokeStyle: '#000',
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

    buildPath(path: CKPath2D): void {
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
