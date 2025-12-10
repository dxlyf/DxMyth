import * as CanvasKit from '../index';
export declare class RadialCanvasGradient {
    x1: number;
    y1: number;
    r1: number;
    x2: number;
    y2: number;
    r2: number;
    _shader: CanvasKit.Shader;
    _colors: CanvasKit.Color[];
    _pos: number[];
    constructor(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number);
    addColorStop(offset: number, color: any): void;
    _copy(): RadialCanvasGradient;
    _dispose(): void;
    _getShader(currentTransform: number[]): CanvasKit.Shader;
}
