export declare class ImageSource {
    static default(): ImageSource;
    static fromUrl(url: string): ImageSource;
    static fromImage(image: CanvasImageSource): ImageSource;
    static fromImageData(imageData: ImageBitmap): ImageSource;
    sourceUrl: string;
    source: CanvasImageSource | null;
    complete: boolean;
    cb: () => void;
    shouldRenderer(): boolean;
    onChange(cb: () => void): void;
    from(source: string | CanvasImageSource): this;
    set(image: CanvasImageSource): this;
}
