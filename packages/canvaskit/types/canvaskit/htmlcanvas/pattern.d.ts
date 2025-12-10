import * as CanvasKit from '../index';
export declare class CanvasPattern {
    _shader: CanvasKit.Shader;
    _image: any;
    _transform: number[];
    _tileX: CanvasKit.TileMode;
    _tileY: CanvasKit.TileMode;
    constructor(image?: any, repetition?: string);
    setTransform(m: any): void;
    _copy(): CanvasPattern;
    _dispose(): void;
    _getShader(currentTransform: number[]): CanvasKit.Shader;
}
