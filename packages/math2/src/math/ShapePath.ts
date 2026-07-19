


import { BoundingRect } from './BoundingRect'
import { Point } from './Point'
import { PathBuilder } from './PathBuilder'
import { PathStroke } from './PathStroke';
import { pathBooleanOp,BoolOp } from './PathBool';

type FillRule = "evenodd" | "nonzero"; // 填充规则，evenodd或nonzero
type LineCap = "butt" | "round" | "square" // 线帽样式，butt、round或square
type LineJoin = "miter" | "round" | "bevel" // 线连接样式，miter、round或bevel
type StrokeAlign = "center" | "outside" | "inside" // 边框对齐，center、outside或inside
 type StrokeOptions = {
    lineWidth: number,
    lineJoin: LineJoin,
    lineCap: LineCap,
    strokeAlign: StrokeAlign,// 边框对齐
    miterLimit: number

}
export const CKPathCMD = {
    MOVE: 0,
    LINE: 1,
    QUAD: 2,
    CONIC: 3,
    CUBIC: 4,
    CLOSE: 5,
}

export class ShapePath extends PathBuilder {
    _strokePath: PathBuilder
    _computeStrokeTightBounds: BoundingRect
    strokeOptions: StrokeOptions
    fillRule: FillRule
    constructor() {
        super()
       // this._strokePath = PathBuilder.default()
        this.fillRule = 'nonzero'
        this.setStroke({})
    }

    setStroke(options: Partial<StrokeOptions>) {
        const prev = this.strokeOptions
        const newStrokeOptions: StrokeOptions = { strokeAlign: 'center', lineWidth: 1, lineJoin: 'miter', lineCap: 'butt', miterLimit: 10, ...(options || {}) }
        if (!prev || newStrokeOptions.strokeAlign != prev.strokeAlign || newStrokeOptions.lineWidth != prev.lineWidth || newStrokeOptions.lineJoin != prev.lineJoin || newStrokeOptions.lineCap != prev.lineCap || newStrokeOptions.miterLimit != prev.miterLimit) {
            this._strokePath = null
        }
        this.strokeOptions = newStrokeOptions
    }
    setFillRule(fillRule: FillRule): void {
        if (this.fillRule != fillRule) {
            this.markDirty()
        }
        this.fillRule = fillRule
    }
    markDirty(): void {
        super.markDirty()
        this._computeStrokeTightBounds = null
        this._strokePath = null
    }

    get strokePath() {
        if (!this._strokePath) {
            const strokeOptions = this.strokeOptions
            const strokeAlign = strokeOptions.strokeAlign
            if (strokeAlign === 'center') {
                this._strokePath = PathStroke.default().stroke(this,{
                    lineWidth: strokeOptions.lineWidth,
                    lineJoin: strokeOptions.lineJoin as any,
                    lineCap: strokeOptions.lineCap as any,
                    miterLimit: strokeOptions.miterLimit,
                })
            }
            else if (strokeAlign === 'outside') {
                const path0 = PathStroke.default().stroke(this,{
                    lineWidth: strokeOptions.lineWidth*2,
                    lineJoin: strokeOptions.lineJoin as any,
                    lineCap: strokeOptions.lineCap as any,
                    miterLimit: strokeOptions.miterLimit,
                })
                this._strokePath.reset()
                this._strokePath.addPath(pathBooleanOp(path0,this,BoolOp.Difference))
       
            } else if (strokeAlign === 'inside') {
                const path0 = PathStroke.default().stroke(this,{
                    lineWidth: strokeOptions.lineWidth*2,
                    lineJoin: strokeOptions.lineJoin as any,
                    lineCap: strokeOptions.lineCap as any,
                    miterLimit: strokeOptions.miterLimit,
                })
                this._strokePath.reset()
                this._strokePath.addPath(pathBooleanOp(path0,this,BoolOp.Intersect))
                
            }
        }
        return this._strokePath
    }
    getFillPath2D() {
        return new globalThis.Path2D(this.toSvgPath())
    }
    getStrokePath2D() {
        return new globalThis.Path2D(this.strokePath.toSvgPath())
    }
    opFillPath(other:PathBuilder, op: BoolOp) {
        return PathBuilder.default().addPath(pathBooleanOp(this,other,op))
    }
    opStrokePath(other: PathBuilder, op: BoolOp) {
        return PathBuilder.default().addPath(pathBooleanOp(this.strokePath,other,op))
    }
    isPointInStrokePath(x: number, y: number): boolean {
        return this.strokePath.isPointInPath(x, y)
    }
    computeStrokeTightBounds() {
        if (!this._computeStrokeTightBounds) {
            const bounds = this.strokePath.computeTightBounds()
            this._computeStrokeTightBounds = bounds.clone()
        }
        return this._computeStrokeTightBounds
    }

}
