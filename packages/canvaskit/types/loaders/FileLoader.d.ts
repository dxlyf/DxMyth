import { Loader, OnErrorCallback, OnProgressCallback, OnLoadCallback } from './Loader.js';
import { LoadingManager } from './LoadingManager.js';
type ResposeType = 'arraybuffer' | 'blob' | 'document' | 'json' | '';
/**
 * A low level class for loading resources with the Fetch API, used internally by
 * most loaders. It can also be used directly to load any file type that does
 * not have a loader.
 *
 * This loader supports caching. If you want to use it, add `THREE.Cache.enabled = true;`
 * once to your application.
 *
 * ```js
 * const loader = new THREE.FileLoader();
 * const data = await loader.loadAsync( 'example.txt' );
 * ```
 *
 * @augments Loader
 */
declare class FileLoader<TData = any> extends Loader<TData> {
    mimeType: string;
    responseType: ResposeType;
    _abortController: AbortController;
    /**
     * Constructs a new file loader.
     *
     * @param {LoadingManager} [manager] - The loading manager.
     */
    constructor(manager?: LoadingManager);
    /**
     * Starts loading from the given URL and pass the loaded response to the `onLoad()` callback.
     *
     * @param {string} url - The path/URL of the file to be loaded. This can also be a data URI.
     * @param {function(any)} onLoad - Executed when the loading process has been finished.
     * @param {onProgressCallback} [onProgress] - Executed while the loading is in progress.
     * @param {onErrorCallback} [onError] - Executed when errors occur.
     * @return {any|undefined} The cached resource if available.
     */
    load(url: string, onLoad: OnLoadCallback<TData>, onProgress?: OnProgressCallback, onError?: OnErrorCallback): any;
    /**
     * Sets the expected response type.
     *
     * @param {('arraybuffer'|'blob'|'document'|'json'|'')} value - The response type.
     * @return {FileLoader} A reference to this file loader.
     */
    setResponseType(value: ResposeType): this;
    /**
     * Sets the expected mime type of the loaded file.
     *
     * @param {string} value - The mime type.
     * @return {FileLoader} A reference to this file loader.
     */
    setMimeType(value: string): this;
    /**
     * Aborts ongoing fetch requests.
     *
     * @return {FileLoader} A reference to this instance.
     */
    abort(): this;
}
export { FileLoader };
