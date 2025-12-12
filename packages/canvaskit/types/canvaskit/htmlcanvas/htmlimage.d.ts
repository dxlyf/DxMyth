import { CanvasKit } from '../index';
export declare class HTMLImage {
    _skImage: CanvasKit.Image;
    width: number;
    height: number;
    naturalWidth: number;
    naturalHeight: number;
    getSkImage: () => CanvasKit.Image;
    constructor(skImage: CanvasKit.Image);
}
