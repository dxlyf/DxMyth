import { Vector2, Matrix2D } from '../../../../../../../src/math';
import { Color } from '../../../../../../../src/math/Color';
import { CanvasKit } from '../../../../../../../src/canvaskit';
export interface GradientStop {
    offset: number;
    color: Color;
}
export declare function isLinearGradient(grad: Gradient): grad is LinearGradient;
export declare function isRadialGradient(grad: Gradient): grad is RadialGradient;
export declare function isConicGradient(grad: Gradient): grad is ConicGradient;
interface IGradient {
    type: string;
    offsets: number[];
    colors: Float32Array[];
    matrix: Matrix2D | null;
}
export declare abstract class Gradient implements IGradient {
    static isGradient(style: unknown): boolean;
    isGradient: boolean;
    type: string;
    offsets: number[];
    colors: Float32Array[];
    matrix: Matrix2D | null;
    _shader: CanvasKit.Shader;
    transform(matrix: Matrix2D): void;
    addColorStop(offset: number, color: string | Color): void;
    private insertColorStop;
    copyColorStops<T extends Gradient>(source: T): this;
    abstract clone(): Gradient;
    abstract copy(source: IGradient): IGradient;
    abstract getShader(matrix?: Matrix2D): CanvasKit.Shader;
    dispose(): void;
}
export declare class LinearGradient extends Gradient {
    type: string;
    start: Vector2;
    end: Vector2;
    constructor(x0: number, y0: number, x1: number, y1: number);
    copy(source: LinearGradient): this;
    clone(): LinearGradient;
    getShader(matrix?: Matrix2D): CanvasKit.Shader;
}
export declare class RadialGradient extends Gradient {
    type: string;
    innerCenter: Vector2;
    outerCenter: Vector2;
    innerRadius: number;
    outerRadius: number;
    constructor(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number);
    copy(source: RadialGradient): this;
    clone(): RadialGradient;
    getShader(matrix?: Matrix2D): CanvasKit.Shader;
}
export declare class ConicGradient extends Gradient {
    startAngle: number;
    type: string;
    center: Vector2;
    constructor(startAngle: number, x: number, y: number);
    copy(source: ConicGradient): this;
    clone(): ConicGradient;
    getShader(matrix?: Matrix2D): CanvasKit.Shader;
}
export {};
