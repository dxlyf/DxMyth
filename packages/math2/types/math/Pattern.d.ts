export type IPattern = {
    type: 'pattern';
    elementType: 'image';
    repeat?: 'repeat' | 'repeat-x' | 'repeat-y';
    source: CanvasImageSource;
    clone(): Pattern;
    copy(source: Pattern): void;
};
export declare class Pattern implements IPattern {
    type: 'pattern';
    elementType: 'image';
    repeat?: 'repeat' | 'repeat-x' | 'repeat-y';
    source: CanvasImageSource;
    clone(): IPattern;
    copy(source: IPattern): void;
}
export declare class ImagePattern extends Pattern {
    static fromUrl(url: string): ImagePattern;
    static fromImage(image: CanvasImageSource): ImagePattern;
    elementType: 'image';
    source: CanvasImageSource;
    constructor();
    clone(): ImagePattern;
    copy(source: ImagePattern): void;
}
