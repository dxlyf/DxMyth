import { Loader, OnErrorCallback, OnLoadCallback, OnProgressCallback } from './Loader';
import { LoadingManager } from './LoadingManager';
/**
 * A loader for loading images as an [ImageBitmap](https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap).
 * An `ImageBitmap` provides an asynchronous and resource efficient pathway to prepare
 * textures for rendering.
 *
 * Note that {@link Texture#flipY} and {@link Texture#premultiplyAlpha} are ignored with image bitmaps.
 * They needs these configuration on bitmap creation unlike regular images need them on uploading to GPU.
 *
 * You need to set the equivalent options via {@link ImageBitmapLoader#setOptions} instead.
 *
 * Also note that unlike {@link FileLoader}, this loader avoids multiple concurrent requests to the same URL only if `Cache` is enabled.
 *
 * ```js
 * const loader = new THREE.ImageBitmapLoader();
 * loader.setOptions( { imageOrientation: 'flipY' } ); // set options if needed
 * const imageBitmap = await loader.loadAsync( 'image.png' );
 *
 * const texture = new THREE.Texture( imageBitmap );
 * texture.needsUpdate = true;
 * ```
 *
 * @augments Loader
 */
declare class ImageBitmapLoader extends Loader<ImageBitmap> {
    readonly isImageBitmapLoader: boolean;
    _abortController: AbortController;
    /**
     * @default { premultiplyAlpha: 'none' }
     */
    options: ImageBitmapOptions;
    /**
     * Constructs a new image bitmap loader.
     *
     * @param {LoadingManager} [manager] - The loading manager.
     */
    constructor(manager: LoadingManager);
    /**
     * Sets the given loader options. The structure of the object must match the `options` parameter of
     * [createImageBitmap](https://developer.mozilla.org/en-US/docs/Web/API/Window/createImageBitmap).
     *
     * @param {Object} options - The loader options to set.
     * @return {ImageBitmapLoader} A reference to this image bitmap loader.
     */
    setOptions(options: ImageBitmapOptions): this;
    /**
     * Starts loading from the given URL and pass the loaded image bitmap to the `onLoad()` callback.
     *
     * @param {string} url - The path/URL of the file to be loaded. This can also be a data URI.
     * @param {function(ImageBitmap)} onLoad - Executed when the loading process has been finished.
     * @param {onProgressCallback} onProgress - Unsupported in this loader.
     * @param {onErrorCallback} onError - Executed when errors occur.
     * @return {ImageBitmap|undefined} The image bitmap.
     */
    load(url: string, onLoad: OnLoadCallback<ImageBitmap>, onProgress?: OnProgressCallback, onError?: OnErrorCallback): ImageBitmap | Promise<ImageBitmap>;
    /**
     * Aborts ongoing fetch requests.
     *
     * @return {ImageBitmapLoader} A reference to this instance.
     */
    abort(): this;
}
export { ImageBitmapLoader };
