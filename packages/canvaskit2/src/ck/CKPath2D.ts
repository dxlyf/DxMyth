
import { ck, type CanvasKit } from './lib'
import { CKPathBuilder } from './CKPathBuilder'
import { FillRule, LineCap, LineJoin ,StrokeAlign} from 'src/core/Renderer'
import { toCKLineJoin, toCKLineCap, toCKFillRule } from './convert'
import { BoundingRect } from '@dxyl/math2'

export type StrokeOptions = {
    lineWith: number,
    lineJoin: LineJoin,
    lineCap: LineCap,
    strokeAlign: StrokeAlign,// 边框对齐
    miterLimit: number

}

export class CKPath2D extends CKPathBuilder {
    _fillPath: CanvasKit.Path
    _strokePath: CanvasKit.Path
    _bounds: BoundingRect
    _computeTightBounds: BoundingRect
    _computeStrokeTightBounds: BoundingRect
    strokeOptions: StrokeOptions
    fillRule: FillRule
    constructor() {
        super()
        this.fillRule = 'nonzero'
        this.setStroke({})
    }
    setStroke(options: Partial<StrokeOptions>) {
        const prev = this.strokeOptions
        const newStrokeOptions: StrokeOptions = { strokeAlign: 'center', lineWith: 1, lineJoin: 'miter', lineCap: 'butt', miterLimit: 10, ...(options || {}) }
        if (!prev || newStrokeOptions.strokeAlign != prev.strokeAlign || newStrokeOptions.lineWith != prev.lineWith || newStrokeOptions.lineJoin != prev.lineJoin || newStrokeOptions.lineCap != prev.lineCap || newStrokeOptions.miterLimit != prev.miterLimit) {
            if (this._strokePath) {
                this._strokePath.delete()
            }
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
        this._bounds = null
        this._computeTightBounds = null
        this._computeStrokeTightBounds = null
        if (this._fillPath) {
            this._fillPath.delete()
        }
        if (this._strokePath) {
            this._strokePath.delete()
        }
        this._fillPath = null
        this._strokePath = null
    }
    get fillPath() {
        if (!this._fillPath) {
            this._fillPath = this.detach()
            this._fillPath.setFillType(toCKFillRule(this.fillRule))
        }
        return this._fillPath
    }
    get strokePath() {
        if (!this._strokePath) {
            const strokeOptions = this.strokeOptions
            const strokeAlign = strokeOptions.strokeAlign
            if (strokeAlign === 'center') {
                this._strokePath = this.fillPath.makeStroked({
                    width: strokeOptions.lineWith,
                    join: toCKLineJoin(strokeOptions.lineJoin),
                    cap: toCKLineCap(strokeOptions.lineCap),
                    miter_limit: strokeOptions.miterLimit,
                })
            }
            else if (strokeAlign === 'outside') {
                const path0= this.fillPath.makeStroked({
                    width: strokeOptions.lineWith*2,
                    join: toCKLineJoin(strokeOptions.lineJoin),
                    cap: toCKLineCap(strokeOptions.lineCap),
                    miter_limit: strokeOptions.miterLimit,
                })
                this._strokePath =ck.Path.MakeFromOp(path0,this.fillPath,ck.PathOp.Difference)
                path0.delete()
            } else if (strokeAlign === 'inside') {
                 const path0= this.fillPath.makeStroked({
                    width: strokeOptions.lineWith*2,
                    join: toCKLineJoin(strokeOptions.lineJoin),
                    cap: toCKLineCap(strokeOptions.lineCap),
                    miter_limit: strokeOptions.miterLimit,
                })
                this._strokePath =ck.Path.MakeFromOp(path0,this.fillPath,ck.PathOp.Intersect)
                path0.delete()
            }
        }
        return this._strokePath
    }
    getFillPath2D() {
        return new Path2D(this.fillPath.toSVGString())
    }
    getStrokePath2D() {
        return new Path2D(this.strokePath.toSVGString())
    }
    opFillPath(other: CanvasKit.Path, op: CanvasKit.PathOp) {
        return ck.Path.MakeFromOp(this.fillPath, other, op)
    }
    opStrokePath(other: CanvasKit.Path, op: CanvasKit.PathOp) {
        return ck.Path.MakeFromOp(this.strokePath, other, op)
    }
    isPointInPath(x: number, y: number): boolean {
        return this.fillPath.contains(x, y)
    }
    isPointInStrokePath(x: number, y: number): boolean {
        return this.strokePath.contains(x, y)
    }
    getBounds(): BoundingRect {
        if (!this._bounds) {
            const bounds = this.fillPath.getBounds()
            this._bounds = BoundingRect.fromLTRB(bounds[0], bounds[1], bounds[2], bounds[3])
        }
        return this._bounds
    }
    computeTightBounds() {
        if (!this._computeTightBounds) {
            const bounds = this.fillPath.computeTightBounds()
            this._computeTightBounds = BoundingRect.fromLTRB(bounds[0], bounds[1], bounds[2], bounds[3])
        }
        return this._computeTightBounds
    }
    computeStrokeTightBounds() {
        if (!this._computeStrokeTightBounds) {
            const bounds = this.strokePath.computeTightBounds()
            this._computeStrokeTightBounds = BoundingRect.fromLTRB(bounds[0], bounds[1], bounds[2], bounds[3])
        }
        return this._computeStrokeTightBounds
    }
    delete() {
        super.delete()
        this._fillPath && this._fillPath.delete()
        this._strokePath && this._strokePath.delete()
    }
    deleteLater() {
        super.deleteLater()
        this._fillPath && this._fillPath.deleteLater()
        this._strokePath && this._strokePath.deleteLater()
    }
    applyFillPath(ctx:CanvasRenderingContext2D|globalThis.Path2D){
       this.pathBuilder.conicTo()
  
    }
}