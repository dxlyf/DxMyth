import { CompositeCore } from './composite-core';
import { CompositeOperation } from './composite-types';
export declare class ImageDataCompositor extends CompositeCore {
    applyToImageData(sourceData: ImageData, destData: ImageData, operation: CompositeOperation, dx?: number, dy?: number): ImageData;
}
