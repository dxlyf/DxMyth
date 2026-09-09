import { ColorInput, ColorValue } from './Color';
import { Matrix2D } from './Matrix2D';
export type ColorStop = {
    offset: number;
    color: ColorValue;
};
export declare abstract class Gradient {
    type: 'gradient';
    elementType: 'linear-gradient' | 'radial-gradient' | 'conic-gradient';
    stops: ColorStop[];
    matrix?: Matrix2D;
    ref: any;
    addColorStop(offset: number, color: ColorInput): void;
    cloneColorStops(): {
        offset: number;
        color: number[] | Float32Array<ArrayBuffer>;
    }[];
    transform(a: number, b: number, c: number, d: number, e: number, f: number): void;
    getColorAt(t: number): ColorValue;
    abstract getGradientColor(x: number, y: number): ColorValue;
    copy(source: Gradient): this;
    abstract clone(): Gradient;
    dispose(): void;
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
    getGradientColor(x: number, y: number): ColorValue;
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
    getGradientColor(x: number, y: number): ColorValue;
}
export declare class ConicGradient extends Gradient {
    startAngle: number;
    x: number;
    y: number;
    elementType: Gradient['elementType'];
    constructor(startAngle: number, x: number, y: number);
    clone(): ConicGradient;
    copy(source: ConicGradient): this;
    getGradientColor(x: number, y: number): ColorValue;
}
