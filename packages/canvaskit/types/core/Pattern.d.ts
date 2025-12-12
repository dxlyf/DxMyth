import { Matrix2D } from '../../../../../../../src/math/Matrix2D';
import { CanvasKit } from '../../../../../../../src/canvaskit';
export declare enum PatternRepeat {
    repeat = "repeat",
    noRepeat = "no-repeat",
    repeatX = "repeat-x",
    repeatY = "repeat-y"
}
export declare class Pattern {
    static isPattern(style: unknown): boolean;
    ckImage: CanvasKit.Image | null;
    _tileX: CanvasKit.TileMode;
    _tileY: CanvasKit.TileMode;
    image: CanvasImageSource | null;
    repetition: string | null;
    matrix?: Matrix2D;
    _shader: CanvasKit.Shader | null;
    isPattern: boolean;
    type: string;
    constructor(image: CanvasImageSource, repetition?: string | null);
    copy(source: Pattern): this;
    clone(): Pattern;
    setTransform(matrix?: Matrix2D): void;
    equals(other: Pattern): boolean;
    makeCKImage(): void;
    getShader(matrix?: Matrix2D): CanvasKit.Shader;
    dispose(): void;
}
