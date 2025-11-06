import { Vector2 } from "src/math";
import { RGBColor, Color } from "src/math/Color";
import { Matrix2D } from 'src/math/Matrix2D'
import { CanvaskitRenderer } from "src/renderer/CanvaskitRenderer";
import type * as CanvasKit from 'src/canvaskit'


export interface GradientStop {
    offset: number;
    color: Color;
}
export function isLinearGradient(grad: Gradient): grad is LinearGradient {
    return grad.type === 'LinearGradient';
}

export function isRadialGradient(grad: Gradient): grad is RadialGradient {
    return grad.type === 'RadialGradient';
}

export function isConicGradient(grad: Gradient): grad is ConicGradient {
    return grad.type === 'ConicGradient';
}
interface IGradient  {
    type: string
    offsets: number[]
    colors: Float32Array[]
    matrix: Matrix2D | null;
}
export abstract class Gradient implements IGradient {
    static isGradient(style: unknown) {
        if (style instanceof Gradient) {
            return true;
        }
        return false
    }
    isGradient = true
    type = 'Gradient'
    offsets: number[] = []
    colors: Float32Array[] = []
    matrix: Matrix2D | null = null;
    _shader: CanvasKit.Shader
    transform(matrix: Matrix2D) {
        this.matrix = matrix
    }
    addColorStop(offset: number, color: string | Color) {
        this.insertColorStop(offset, color);

    }
    private insertColorStop(offset: number, color: string | Color) {
        var idx = this.offsets.findIndex(d => d === offset);
        if (idx !== -1) {
            this.colors[idx] = Color.parse(color);
        } else {
            for (idx = 0; idx < this.offsets.length; idx++) {
                if (this.offsets[idx] > offset) {
                    break;
                }
            }
            this.offsets.splice(idx, 0, offset);
            this.colors.splice(idx, 0, Color.parse(color).normalize());
        }
    }
    copyColorStops<T extends Gradient>(source: T) {
        this.offsets = source.offsets.slice()
        this.colors = source.colors.map(d => d.slice())
        return this;
    }
    abstract clone(): Gradient;
    abstract copy(source: IGradient): IGradient;
    abstract toCanvasKitGradient(ck: CanvaskitRenderer,matrix?: Matrix2D): CanvasKit.Shader;
    dispose(): void {
        if (this._shader) {
            this._shader.delete()
            this._shader = null
        }
    }
}

export class LinearGradient extends Gradient {

    type = 'LinearGradient'
    start = Vector2.default()
    end = Vector2.default()
    constructor( x0: number,  y0: number,  x1: number,  y1: number) {
        super()
        this.start.set(x0, y0)
        this.end.set(x1, y1)
    }
    copy(source: LinearGradient) {
        this.start.copy(source.start)
        this.end.copy(source.end)
        this.copyColorStops(source)
        return this;
    }
    clone() {
        return new LinearGradient(this.start.x, this.start.y, this.end.x, this.end.y).copyColorStops(this)
    }
    toCanvasKitGradient( renderer: CanvaskitRenderer,matrix?: Matrix2D) {
        const CK = renderer.ck
        
        const points = [this.start.clone(), this.end.clone()]
        let points2;
        if(matrix){
            matrix.mapVectors(points, points)
        }
        this.dispose()

        this._shader = CK.Shader.MakeLinearGradient(points[0],points[1],this.colors, this.offsets, CK.TileMode.Clamp)
        return this._shader
    }

}

export class RadialGradient extends Gradient {
    type = 'RadialGradient'
    innerCenter = Vector2.default()
    outerCenter = Vector2.default()
    innerRadius = 0
    outerRadius = 0
    constructor(x0: number, y0: number, r0: number,
        x1: number, y1: number, r1: number) {
        super()
        this.innerCenter.set(x0, y0)
        this.outerCenter.set(x1, y1)
        this.innerRadius = r0
        this.outerRadius = r1
    }
    copy(source: RadialGradient) {
        this.innerCenter.copy(source.innerCenter)
        this.outerCenter.copy(source.outerCenter)
        this.innerRadius = source.innerRadius
        this.outerRadius = source.outerRadius
        this.copyColorStops(source)
        return this;
    }
    clone() {
        return new RadialGradient(this.innerCenter.x, this.innerCenter.y, this.innerRadius, this.outerCenter.x, this.outerCenter.y, this.outerRadius).copyColorStops(this)
    }
    toCanvasKitGradient( renderer: CanvaskitRenderer,matrix?: Matrix2D) {
        const CK = renderer.ck
        const pts = [this.innerCenter.clone(), this.outerCenter.clone()];
        if(matrix){
            matrix.mapVectors(pts, pts);
        }   
        const sx1 = pts[0].x;
        const sy1 = pts[0].y;
        const sx2 = pts[1].x;
        const sy2 = pts[1].y;

        const sx =matrix? matrix[0]:1;
        const sy = matrix?matrix[3]:1;
        const scaleFactor = (Math.abs(sx) + Math.abs(sy)) / 2;

        const sr1 = this.innerRadius * scaleFactor;
        const sr2 = this.outerRadius * scaleFactor;

        this.dispose();
        this._shader = CK.Shader.MakeTwoPointConicalGradient(
            [sx1, sy1], sr1, [sx2, sy2], sr2, this.colors, this.offsets,
            CK.TileMode.Clamp);
        return this._shader;
    }
}
export class ConicGradient extends Gradient {
    type = 'ConicGradient'
    center = Vector2.default()
    constructor(public startAngle: number, x: number, y: number) {
        super()
        this.center.set(x, y)
    }
    copy(source: ConicGradient) {
        this.startAngle = source.startAngle;
        this.center.copy(source.center)
        this.copyColorStops(source)
        return this;
    }
    clone() {
        return new ConicGradient(this.startAngle, this.center.x, this.center.y).copyColorStops(this)
    }
    toCanvasKitGradient( renderer: CanvaskitRenderer,matrix?: Matrix2D) {
        const CK = renderer.ck
        const center = this.center.clone();
        if(matrix){
            matrix.mapVector(center, center);
        }
        this.dispose();
        this._shader = CK.Shader.MakeSweepGradient(center.x, center.y, this.colors, this.offsets, CK.TileMode.Clamp)
        return this._shader;
    }
}


