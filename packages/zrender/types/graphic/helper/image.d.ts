import { ImageLike } from '../../core/types';
export declare function findExistImage(newImageOrSrc: string | ImageLike): ImageLike;
/**
 * Caution: User should cache loaded images, but not just count on LRU.
 * Consider if required images more than LRU size, will dead loop occur?
 *
 * @param newImageOrSrc
 * @param image Existent image.
 * @param hostEl For calling `dirty`.
 * @param onload params: (image, cbPayload)
 * @param cbPayload Payload on cb calling.
 * @return image
 */
export declare function createOrUpdateImage<T>(newImageOrSrc: string | ImageLike, image: ImageLike, hostEl: {
    dirty: () => void;
}, onload?: (image: ImageLike, payload: T) => void, cbPayload?: T): ImageLike;
export declare function isImageReady(image: ImageLike): number;
