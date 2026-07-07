import { CKPath2D } from "src/ck/CKPath2D"
import { Renderer } from "src/core/Renderer"
import { Shape, type ShapeProps } from "src/core/Shape"
import { BoundingRect } from "src/math/BoundingRect"

export type StarProps = ShapeProps<{
    x?: number
    y?: number
    /** 外半径 */
    outerRadius?: number
    /** 内半径 */
    innerRadius?: number
    /** 角的个数（默认5） */
    points?: number
    /** 起始旋转角度（弧度，默认 -PI/2 使顶部朝上） */
    rotation?: number
}>

export class Star extends Shape<StarProps> {
    type = "Star"

    getDefaultProps(): Partial<StarProps>[] {
        return [...super.getDefaultProps(), {
            shape: {
                x: 0,
                y: 0,
                outerRadius: 50,
                innerRadius: 20,
                points: 5,
                rotation: -Math.PI / 2,
            },
            style: {
                closePath: true,
            }
        }]
    }

    calcLocalBounds(out: BoundingRect): BoundingRect {
        const s = this.props.shape
        const r = s.outerRadius
        out.fromXYWH(s.x - r, s.y - r, r * 2, r * 2)
        return out
    }

    draw(renderer: Renderer): void {
        this.builtinBuildPath()
        const s = this.props.shape
        const n = s.points * 2
        const step = Math.PI / s.points
        const rot = s.rotation

        const x = s.x
        const y = s.y
        const outerR = s.outerRadius
        const innerR = s.innerRadius

        renderer.moveTo(
            x + Math.cos(rot) * outerR,
            y + Math.sin(rot) * outerR
        )
        for (let i = 1; i < n; i++) {
            const r = i % 2 === 0 ? outerR : innerR
            const angle = rot + step * i
            renderer.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r)
        }
    }

    buildPath(path: CKPath2D): void {
        const s = this.props.shape
        const n = s.points * 2
        const step = Math.PI / s.points
        const rot = s.rotation

        const x = s.x
        const y = s.y
        const outerR = s.outerRadius
        const innerR = s.innerRadius

        path.moveTo(
            x + Math.cos(rot) * outerR,
            y + Math.sin(rot) * outerR
        )
        for (let i = 1; i < n; i++) {
            const r = i % 2 === 0 ? outerR : innerR
            const angle = rot + step * i
            path.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r)
        }
    }

    render(renderer: Renderer) {
        renderer.renderShape(this)
    }
}
