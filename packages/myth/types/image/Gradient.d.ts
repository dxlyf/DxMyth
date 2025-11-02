import { Color } from './Color';
import { Matrix2D, Matrix2dLike } from '../math/Matrix2d';
export interface GradientStop {
    offset: number;
    color: Color;
}
export declare function isLinearGradient(grad: Gradient): grad is LinearGradient;
export declare function isRadialGradient(grad: Gradient): grad is RadialGradient;
export declare function isConicGradient(grad: Gradient): grad is ConicGradient;
export declare abstract class Gradient implements CanvasGradient {
    static isGradient(style: unknown): boolean;
    type: string;
    colorStops: GradientStop[];
    matrix: Matrix2D | null;
    transform(matrix: Matrix2dLike): void;
    addColorStop(offset: number, color: string | Color): void;
    private insertColorStop;
    copyColorStops(source: Gradient): this;
    abstract clone(): Gradient;
    abstract copy(source: Gradient): Gradient;
    abstract equals(other: Gradient): boolean;
    abstract toCanvasGradient(ctx: CanvasRenderingContext2D): CanvasGradient;
}
export declare class LinearGradient extends Gradient {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    type: string;
    constructor(x0: number, y0: number, x1: number, y1: number);
    copy(source: LinearGradient): this;
    clone(): LinearGradient;
    equals(other: LinearGradient): boolean;
    toCanvasGradient(ctx: CanvasRenderingContext2D): CanvasGradient;
}
export declare class RadialGradient extends Gradient {
    x0: number;
    y0: number;
    r0: number;
    x1: number;
    y1: number;
    r1: number;
    type: string;
    constructor(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number);
    copy(source: RadialGradient): this;
    clone(): RadialGradient;
    equals(other: RadialGradient): boolean;
    toCanvasGradient(ctx: CanvasRenderingContext2D): CanvasGradient;
}
export declare class ConicGradient extends Gradient {
    startAngle: number;
    x: number;
    y: number;
    type: string;
    constructor(startAngle: number, x: number, y: number);
    copy(source: ConicGradient): this;
    clone(): ConicGradient;
    equals(other: ConicGradient): boolean;
    toCanvasGradient(ctx: CanvasRenderingContext2D): CanvasGradient;
}
