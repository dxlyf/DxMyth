import { CanvasKit } from '../../../../../../../src/canvaskit';
declare function loadImageFromUrl(url: string): Promise<HTMLImageElement>;
declare function loadImageBitmapFromImageBitmapSource(imageData: ImageBitmapSource): Promise<ImageBitmap>;
declare class Image {
    static default(): Image;
    static fromUrl(url: string): Image;
    static fromImageSource(image: CanvasImageSource): Image;
    static fromImageBitmapSource(imageData: ImageBitmapSource): Image;
    sourceUrl: string;
    image: CanvasImageSource | null;
    skImage: CanvasKit.Image | null;
    complete: boolean;
    cb: () => void;
    shouldRenderer(): boolean;
    onChange(cb: () => void): void;
    get width(): number;
    get height(): number;
    setImage(image: CanvasImageSource): this;
    dispose(): void;
}
export { Image, loadImageFromUrl, loadImageBitmapFromImageBitmapSource };
