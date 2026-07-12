import { CKPath2D } from "src/ck/CKPath2D"
import { Renderer } from "src/core/Renderer"
import { Shape, type ShapeProps } from "src/core/Shape"
import { BoundingRect } from "@dxyl/math2"

export type EllipseProps = ShapeProps<{
    x?: number
    y?: number
    radiusX?: number
    radiusY?: number
    /** 旋转角度（弧度），默认 0 */
    rotation?: number
    /** 起始角度（弧度），默认 0 */
    startAngle?: number
    /** 结束角度（弧度），默认 2*PI */
    endAngle?: number
    /** 是否逆时针绘制，默认 false */
    counterclockwise?: boolean
}>

export class Ellipse extends Shape<EllipseProps> {
    type = "Ellipse"

    getDefaultProps(): Partial<EllipseProps>[] {
        return [...super.getDefaultProps(), {
            shape: {
                x: 0,
                y: 0,
                radiusX: 50,
                radiusY: 30,
                rotation: 0,
                startAngle: 0,
                endAngle: Math.PI * 2,
                counterclockwise: false,
            }
        }]
    }
    draw(renderer: Renderer): void {
        const s = this.props.shape
        renderer.ellipse(
            s.x, s.y, s.radiusX, s.radiusY,
            s.rotation, s.startAngle, s.endAngle, s.counterclockwise
        )
    }

    buildPath(path: CKPath2D): void {
        const s = this.props.shape
        path.ellipse(
            s.x, s.y, s.radiusX, s.radiusY,
            s.rotation, s.startAngle, s.endAngle, s.counterclockwise
        )
    }

}
