
import { ck, type CanvasKit } from './lib'
import { CKPathBuilder } from './CKPathBuilder'
import { FillRule, LineCap, LineJoin, StrokeAlign } from 'src/core/Renderer'
import { toCKLineJoin, toCKLineCap, toCKFillRule } from './convert'
import { BoundingRect, Conic, Point } from '@dxyl/math2'

export type StrokeOptions = {
    lineWith: number,
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
                const path0 = this.fillPath.makeStroked({
                    width: strokeOptions.lineWith * 2,
                    join: toCKLineJoin(strokeOptions.lineJoin),
                    cap: toCKLineCap(strokeOptions.lineCap),
                    miter_limit: strokeOptions.miterLimit,
                })
                this._strokePath = ck.Path.MakeFromOp(path0, this.fillPath, ck.PathOp.Difference)
                path0.delete()
            } else if (strokeAlign === 'inside') {
                const path0 = this.fillPath.makeStroked({
                    width: strokeOptions.lineWith * 2,
                    join: toCKLineJoin(strokeOptions.lineJoin),
                    cap: toCKLineCap(strokeOptions.lineCap),
                    miter_limit: strokeOptions.miterLimit,
                })
                this._strokePath = ck.Path.MakeFromOp(path0, this.fillPath, ck.PathOp.Intersect)
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
    applyCmds(ctx: CanvasRenderingContext2D | globalThis.Path2D,cmds:Float32Array) {
        for (let i = 0; i < cmds.length;) {
            const cmd = cmds[i++]
            switch (cmd) {
                case CKPathCMD.MOVE:
                    ctx.moveTo(cmds[i++], cmds[i++]); break

                case CKPathCMD.LINE:
                    ctx.lineTo(cmds[i++], cmds[i++]); break
                case CKPathCMD.QUAD:
                    ctx.quadraticCurveTo(cmds[i++], cmds[i++], cmds[i++], cmds[i++]); break
                case CKPathCMD.CUBIC:
                    ctx.bezierCurveTo(cmds[i++], cmds[i++], cmds[i++], cmds[i++], cmds[i++], cmds[i++]); break
                case CKPathCMD.CONIC:
                    const conic = new Conic([Point.create(cmds[i - 2], cmds[i - 1]), Point.create(cmds[i++], cmds[i++]), Point.create(cmds[i++], cmds[i++])], cmds[i])
                    const pts = conic.toQuadraticBeziers()
                    for (let i = 0, len = pts.length; i < len; i++) {
                        const c = pts[0]
                        ctx.quadraticCurveTo(c[1].x, c[1].y, c[2].x, c[2].y)
                    }
                    break;
                case CKPathCMD.CLOSE:
                    ctx.closePath(); break
            }
        }
    }
    applyPath(path:CanvasKit.Path,ctx: CanvasRenderingContext2D | globalThis.Path2D) {
        const cmds = path.toCmds()
        this.applyCmds(ctx, cmds)
    }
    applyFillPath(ctx: CanvasRenderingContext2D | globalThis.Path2D) {
        const cmds = this.fillPath.toCmds()
        this.applyCmds(ctx, cmds)
    }
    applyStrokePath(ctx: CanvasRenderingContext2D | globalThis.Path2D) {
        const cmds = this.strokePath.toCmds()
        this.applyCmds(ctx, cmds)
    }
}
