import { Matrix2dLike } from '../math/Matrix2d';
export declare enum PatternRepeat {
    repeat = "repeat",
    noRepeat = "no-repeat",
    repeatX = "repeat-x",
    repeatY = "repeat-y"
}
export declare class Pattern implements CanvasPattern {
    static isPattern(style: unknown): boolean;
    image: CanvasImageSource | null;
    repetition: string | null;
    constructor(image: CanvasImageSource, repetition?: string | null);
    copy(source: Pattern): this;
    clone(): Pattern;
    setTransform(transform?: Matrix2dLike | DOMMatrixInit): void;
    equals(other: Pattern): boolean;
    toCanvasPattern(ctx: CanvasRenderingContext2D): CanvasPattern | null;
}
