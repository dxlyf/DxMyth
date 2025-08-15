import { RGBColor, Color } from "./Color";
import { Matrix2D, Matrix2dLike } from '../math/Matrix2d'
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

export abstract class Gradient implements CanvasGradient {
    static isGradient(style: unknown) {
        if (style instanceof Gradient) {
            return true;
        }
        return false
    }
    type = 'Gradient'
    colorStops: GradientStop[] = [];
    matrix: Matrix2D | null = null;
    transform(matrix: Matrix2dLike) {
        this.matrix = Matrix2D.fromMatrix2D(matrix)
    }
    addColorStop(offset: number, color: string | Color) {
        this.insertColorStop(offset, color);

    }
    private insertColorStop(offset: number, color: string | Color) {
        var idx = this.colorStops.findIndex(d => d.offset === offset);
        if (idx !== -1) {
            this.colorStops[idx].color = Color.parse(color);
        } else {
            for (idx = 0; idx < this.colorStops.length; idx++) {
                if (this.colorStops[idx].offset > offset) {
                    break;
                }
            }
            this.colorStops.splice(idx, 0, { offset, color: Color.parse(color) });
        }
    }
    copyColorStops(source: Gradient) {
        this.colorStops = source.colorStops.map(stop => {
            return {
                offset: stop.offset,
                color: stop.color.clone()
            }
        })
        return this;
    }
    abstract clone(): Gradient;
    abstract copy(source: Gradient): Gradient;
    abstract equals(other: Gradient): boolean
    abstract toCanvasGradient(ctx: CanvasRenderingContext2D): CanvasGradient;
}
export class LinearGradient extends Gradient {

    type = 'LinearGradient'
    constructor(public x0: number, public y0: number, public x1: number, public y1: number) {
        super()
    }
    copy(source: LinearGradient) {
        this.x0 = source.x0;
        this.y0 = source.y0;
        this.x1 = source.x1;
        this.y1 = source.y1;
        this.copyColorStops(source)
        return this;
    }
    clone() {
        return new LinearGradient(this.x0, this.y0, this.x1, this.y1).copyColorStops(this)
    }
    equals(other: LinearGradient): boolean {
        return this.x0 !== other.x0 || this.y0 !== other.y0 || this.x1 !== other.x1 || this.y1 !== other.y1;
    }
    toCanvasGradient(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createLinearGradient(this.x0, this.y0, this.x1, this.y1)
        for (let stop of this.colorStops) {
            gradient.addColorStop(stop.offset, stop.color.toCssRGB())
        }
        return gradient
    }
}

export class RadialGradient extends Gradient {
    type = 'RadialGradient'
    constructor(public x0: number, public y0: number, public r0: number,
        public x1: number, public y1: number, public r1: number) {
        super()
    }
    copy(source: RadialGradient) {
        this.x0 = source.x0;
        this.y0 = source.y0;
        this.r0 = source.r0;
        this.x1 = source.x1;
        this.y1 = source.y1;
        this.r1 = source.r1;

        this.copyColorStops(source)
        return this;
    }
    clone() {
        return new RadialGradient(this.x0, this.y0, this.r0, this.x1, this.y1, this.r1).copyColorStops(this)
    }
    equals(other: RadialGradient): boolean {
        return this.x0 !== other.x0 || this.y0 !== other.y0 || this.x1 !== other.x1 || this.y1 !== other.y1 || this.r0 !== other.r0 || this.r1 !== other.r1;
    }
    toCanvasGradient(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createRadialGradient(this.x0, this.y0, this.r0, this.x1, this.y1, this.r1)
        for (let stop of this.colorStops) {
            gradient.addColorStop(stop.offset, stop.color.toCssRGB())
        }
        return gradient
    }
}
export class ConicGradient extends Gradient {
    type = 'ConicGradient'
    constructor(public startAngle: number, public x: number, public y: number) {
        super()
    }
    copy(source: ConicGradient) {
        this.startAngle = source.startAngle;
        this.x = source.x;
        this.y = source.y;
        this.copyColorStops(source)
        return this;
    }
    clone() {
        return new ConicGradient(this.startAngle, this.x, this.y).copyColorStops(this)
    }
    equals(other: ConicGradient): boolean {
        return this.startAngle !== other.startAngle || this.x !== other.x || this.y !== other.y;
    }
    toCanvasGradient(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createConicGradient(this.startAngle, this.x, this.y)
        for (let stop of this.colorStops) {
            gradient.addColorStop(stop.offset, stop.color.toCssRGB())
        }
        return gradient
    }
}
