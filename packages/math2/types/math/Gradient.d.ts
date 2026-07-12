import { ColorValue, ColorLike } from './Color';
import { Matrix2D, Matrix2DLike } from './Matrix2D';
export type ColorStop = {
    offset: number;
    color: ColorLike;
};
export interface IGradient {
    type: 'gradient';
    elementType: 'linear-gradient' | 'radial-gradient' | 'conic-gradient';
    stops: ColorStop[];
    matrix?: Matrix2DLike;
    clone(): IGradient;
    copy(source: IGradient): IGradient;
}
export declare class Gradient implements IGradient {
    type: 'gradient';
    elementType: 'linear-gradient' | 'radial-gradient' | 'conic-gradient';
    stops: ColorStop[];
    matrix?: Matrix2D;
    addColorStop(offset: number, color: ColorValue): void;
    cloneColorStops(): {
        offset: number;
        color: number[] | Float32Array<ArrayBuffer>;
    }[];
    transform(a: number, b: number, c: number, d: number, e: number, f: number): void;
    copy(source: Gradient): this;
    clone(): IGradient;
}
export declare class LinearGradient extends Gradient {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    elementType: Gradient['elementType'];
    constructor(x0: number, y0: number, x1: number, y1: number);
    clone(): LinearGradient;
    copy(source: LinearGradient): this;
}
export declare class RadialGradient extends Gradient {
    x0: number;
    y0: number;
    r0: number;
    x1: number;
    y1: number;
    r1: number;
    elementType: Gradient['elementType'];
    constructor(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number);
    clone(): RadialGradient;
    copy(source: RadialGradient): this;
}
export declare class ConicGradient extends Gradient {
    startAngle: number;
    x: number;
    y: number;
    elementType: Gradient['elementType'];
    constructor(startAngle: number, x: number, y: number);
    clone(): ConicGradient;
    copy(source: ConicGradient): this;
}
