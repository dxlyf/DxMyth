import { type CanvasKit, ck } from 'src/ck'
import { FillRule, LineCap, LineJoin } from 'src/core/Renderer';
import { BoundingRect } from 'src/math/BoundingRect';
import {toCKFillRule,toCKLineCap,toCKLineJoin} from './convert'

function radiansToDegrees(rad: number) {
    return (rad / Math.PI) * 180;
}

function degreesToRadians(deg: number) {
    return (deg / 180) * Math.PI;
}
function almostEqual(floata: number, floatb: number) {
    return Math.abs(floata - floatb) < 1e-6;
}
function allAreFinite(args: any) {
    for (var i = 0; i < args.length; i++) {
        if (args[i] !== undefined && !Number.isFinite(args[i])) {
            return false;
        }
    }
    return true;
}
function _ellipseHelper(skpath: CanvasKit.PathBuilder, x: number, y: number, radiusX: number, radiusY: number, startAngle: number, endAngle: number) {
    const sweepDegrees = radiansToDegrees(endAngle - startAngle);
    const startDegrees = radiansToDegrees(startAngle);

    const oval = ck.LTRBRect(x - radiusX, y - radiusY, x + radiusX, y + radiusY);

    // draw in 2 180 degree segments because trying to draw all 360 degrees at once
    // draws nothing.
    if (almostEqual(Math.abs(sweepDegrees), 360)) {
        const halfSweep = sweepDegrees / 2;
        skpath.arcToOval(oval, startDegrees, halfSweep, false);
        skpath.arcToOval(oval, startDegrees + halfSweep, halfSweep, false);
        return;
    }
    skpath.arcToOval(oval, startDegrees, sweepDegrees, false);
}

function ellipse(skpath: CanvasKit.PathBuilder, x: number, y: number, radiusX: number, radiusY: number, rotation: number,
    startAngle: number, endAngle: number, ccw: boolean) {
    if (!allAreFinite([x, y, radiusX, radiusY, rotation, startAngle, endAngle])) {
        return;
    }
    if (radiusX < 0 || radiusY < 0) {
        throw 'radii cannot be negative';
    }

    // based off of CanonicalizeAngle in Chrome
    const tao = 2 * Math.PI;
    let newStartAngle = startAngle % tao;
    if (newStartAngle < 0) {
        newStartAngle += tao;
    }
    const delta = newStartAngle - startAngle;
    startAngle = newStartAngle;
    endAngle += delta;

    // Based off of AdjustEndAngle in Chrome.
    if (!ccw && (endAngle - startAngle) >= tao) {
        // Draw complete ellipse
        endAngle = startAngle + tao;
    } else if (ccw && (startAngle - endAngle) >= tao) {
        // Draw complete ellipse
        endAngle = startAngle - tao;
    } else if (!ccw && startAngle > endAngle) {
        endAngle = startAngle + (tao - (startAngle - endAngle) % tao);
    } else if (ccw && startAngle < endAngle) {
        endAngle = startAngle - (tao - (endAngle - startAngle) % tao);
    }

    // Based off of Chrome's implementation in
    // https://cs.chromium.org/chromium/src/third_party/blink/renderer/platform/graphics/path.cc
    // of note, can't use addArc or addOval because they close the arc, which
    // the spec says not to do (unless the user explicitly calls closePath).
    // This throws off points being in/out of the arc.
    if (!rotation) {
        _ellipseHelper(skpath, x, y, radiusX, radiusY, startAngle, endAngle);
        return;
    }
    const rotated = ck.Matrix.rotated(rotation, x, y);
    const rotatedInvert = ck.Matrix.rotated(-rotation, x, y);
    skpath.transform(rotatedInvert);
    _ellipseHelper(skpath, x, y, radiusX, radiusY, startAngle, endAngle);
    skpath.transform(rotated);
}
export type StrokeOptions = {
    lineWith: number,
    lineJoin: LineJoin,
    lineCap: LineCap,
    miterLimit: number

}
export class CKPath2D {
    _pathBuilder: CanvasKit.PathBuilder
    _bounds: BoundingRect
    _computeTightBounds: BoundingRect
    _computeStrokeTightBounds: BoundingRect
    _path: CanvasKit.Path = null
    _strokePath: CanvasKit.Path = null
    lineWith: number = 1
    lineJoin: LineJoin = 'miter'
    lineCap: LineCap = 'butt'
    miterLimit: number = 10
    fillRule:FillRule='nonzero'
    constructor() {
        this._pathBuilder = new ck.PathBuilder()
    }
    
    markDirty() {
        if (this._path) {
            this._path.delete()
        }
        this._path = null
        if (this._strokePath) {
            this._strokePath.delete()
        }
        this._strokePath = null
        this._bounds = null
        this._computeTightBounds = null
        this._computeStrokeTightBounds = null
    }
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/arc) */
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void {
        this._pathBuilder.arc(x, y, radius, startAngle, endAngle, counterclockwise)
        this.markDirty()
    }
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/arcTo) */
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        this._pathBuilder.arcToTangent(x1, y1, x2, y2, radius)
        this.markDirty()
    }
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo) */
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
        this._pathBuilder.cubicTo(cp1x, cp1y, cp2x, cp2y, x, y)
        this.markDirty()
    }
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/closePath) */
    closePath(): void {
        this._pathBuilder.close()
        this.markDirty()
    }
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/ellipse) */
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void {
        ellipse(this._pathBuilder, x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise)
        this.markDirty()
    }
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineTo) */
    lineTo(x: number, y: number): void {
        this._pathBuilder.lineTo(x, y)
        this.markDirty()
    }
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/moveTo) */
    moveTo(x: number, y: number): void {
        this._pathBuilder.moveTo(x, y)
        this.markDirty()
    }
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo) */
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
        this._pathBuilder.quadTo(cpx, cpy, x, y)
        this.markDirty()
    }
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/rect) */
    rect(x: number, y: number, w: number, h: number, isCCW?: boolean): void {
        this._pathBuilder.addRect(ck.XYWHRect(x, y, w, h), isCCW)
        this.markDirty()
    }
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/roundRect) */
    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]): void {
        let rrect = ck.XYWHRect(x, y, w, h)
        let corners = new Float32Array(4).fill(0)
        if (Array.isArray(radii)) {
            if (radii.length === 1) {
                corners.fill(radii[0] as number)
            } else if (radii.length === 2) {
                corners[0] = corners[1] = radii[0] as number
                corners[2] = corners[3] = radii[1] as number
            } else if (radii.length === 4) {
                corners[0] = radii[0] as number
                corners[1] = radii[1] as number
                corners[2] = radii[2] as number
                corners[3] = radii[3] as number
            }
        } else {
            corners.fill(radii as number)
        }
        rrect[4] = rrect[5] = corners[0]
        rrect[6] = rrect[7] = corners[1]
        rrect[8] = rrect[9] = corners[2]
        rrect[10] = rrect[11] = corners[3]
        this._pathBuilder.addRRect(rrect)
        this.markDirty()
    }
    beginPath() {
        this._pathBuilder = new ck.PathBuilder()
        this._path = null
    }
    getPath() {
        if (!this._path) {
            this._path = this._pathBuilder.detachAndDelete()
            this._path.setFillType(toCKFillRule(this.fillRule))
            this._pathBuilder = null
        }
        return this._path
    }
    
    private isEquaLastStroke(options: StrokeOptions) {
        return !(this.lineWith !== options.lineWith || this.lineJoin !== options.lineJoin || this.lineCap !== options.lineCap || this.miterLimit !== options.miterLimit)
    }
    getStrokePath(options: StrokeOptions) {

        if (!this._strokePath || !this.isEquaLastStroke(options)) {
            this.lineWith = options.lineWith
            this.lineJoin = options.lineJoin
            this.lineCap = options.lineCap
            this.miterLimit = options.miterLimit
            this._strokePath = this.getPath().makeStroked({
                width: options.lineWith,
                cap: toCKLineCap(options.lineCap),
                join: toCKLineJoin(options.lineJoin),
                miter_limit: options.miterLimit,
            })
        }
        return this._strokePath
    }
    isPointInPath(x: number, y: number): boolean {
        return this.getPath().contains(x, y)
    }
    isPointInStrokePath(x: number, y: number, options: StrokeOptions): boolean {
        return this.getStrokePath(options).contains(x, y)
    }
    getBounds(): BoundingRect {
        if (!this._bounds) {
            const bounds = this.getPath().getBounds()
            this._bounds = BoundingRect.fromLTRB(bounds[0], bounds[1], bounds[2], bounds[3])
        }
        return this._bounds
    }
    computeTightBounds() {
        if (!this._computeTightBounds) {
            const bounds = this.getPath().computeTightBounds()
            this._computeTightBounds = BoundingRect.fromLTRB(bounds[0], bounds[1], bounds[2], bounds[3])
        }
        return this._computeTightBounds
    }
    computeStrokeTightBounds() {
        if (!this._computeStrokeTightBounds) {
            const bounds = this.getStrokePath(this).computeTightBounds()
            this._computeStrokeTightBounds = BoundingRect.fromLTRB(bounds[0], bounds[1], bounds[2], bounds[3])
        }
        return this._computeStrokeTightBounds
    }
    toPath(): CanvasKit.Path {
        return this._pathBuilder.detach()
    }
    clear(){
        if(this._pathBuilder&&!this._pathBuilder.isDeleted()){
            this._pathBuilder.delete()
        }
         if(this._path&&!this._path.isDeleted()){
            this._path.delete()
        }
         if(this._strokePath&&!this._strokePath.isDeleted()){
            this._strokePath.delete()
        }
        this._pathBuilder=null
        this._path=null
        this._strokePath=null
        this._bounds=null
        this._computeTightBounds=null
        this._computeStrokeTightBounds=null
    }
    dispose(){
        this.clear()
    }
    reset(){
        this.clear()
        this._pathBuilder=new ck.PathBuilder()

    }

}