import * as CanvasKit from '../index';
export declare class LinearCanvasGradient {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    _shader: CanvasKit.Shader;
    _colors: CanvasKit.Color[];
    _pos: number[];
    constructor(x1: number, y1: number, x2: number, y2: number);
    addColorStop(offset: number, color: any): void;
    _copy(): LinearCanvasGradient;
    _dispose(): void;
    _getShader(currentTransform: number[]): CanvasKit.Shader;
}
