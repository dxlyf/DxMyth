import { Loader } from './Loader';
type OnProgressCallback = (url: string, loaded: number, total: number) => void;
type OnErrorCallback = (url: string) => void;
/**
 * Handles and keeps track of loaded and pending data. A default global
 * instance of this class is created and used by loaders if not supplied
 * manually.
 *
 * In general that should be sufficient, however there are times when it can
 * be useful to have separate loaders - for example if you want to show
 * separate loading bars for objects and textures.
 *
 * ```js
 * const manager = new THREE.LoadingManager();
 * manager.onLoad = () => console.log( 'Loading complete!' );
 *
 * const loader1 = new OBJLoader( manager );
 * const loader2 = new ColladaLoader( manager );
 * ```
 */
declare class LoadingManager {
    /**
        * Will be called when loading of an item starts.
        * @param url The url of the item that started loading.
        * @param loaded The number of items already loaded so far.
        * @param total The total amount of items to be loaded.
        */
    onStart: ((url: string, loaded: number, total: number) => void) | undefined;
    /**
     * Will be called when all items finish loading.
     * The default is a function with empty body.
     */
    onLoad: () => void;
    /**
     * Will be called for each loaded item.
     * The default is a function with empty body.
     * @param url The url of the item just loaded.
     * @param loaded The number of items already loaded so far.
     * @param total The total amount of items to be loaded.
     */
    onProgress: OnProgressCallback;
    /**
     * Will be called when item loading fails.
     * The default is a function with empty body.
     * @param url The url of the item that errored.
     */
    onError: OnErrorCallback;
    private _abortController;
    itemStart: (url: string) => void;
    itemEnd: (url: string) => void;
    itemError: (url: string) => void;
    /**
     * Given a URL, uses the URL modifier callback (if any) and returns a resolved URL.
     * If no URL modifier is set, returns the original URL.
     * @param url the url to load
     */
    resolveURL: (url: string) => string;
    /**
     * If provided, the callback will be passed each resource URL before a request is sent.
     * The callback may return the original URL, or a new URL to override loading behavior.
     * This behavior can be used to load assets from .ZIP files, drag-and-drop APIs, and Data URIs.
     * @param callback URL modifier callback. Called with url argument, and must return resolvedURL.
     */
    setURLModifier: (callback?: (url: string) => string) => this;
    addHandler: (regex: RegExp, loader: Loader) => this;
    removeHandler: (regex: RegExp) => this;
    getHandler: (file: string) => Loader | null;
    abort: () => this;
    /**
     * Constructs a new loading manager.
     *
     * @param {Function} [onLoad] - Executes when all items have been loaded.
     * @param {Function} [onProgress] - Executes when single items have been loaded.
     * @param {Function} [onError] - Executes when an error occurs.
     */
    constructor(onLoad?: () => void, onProgress?: OnProgressCallback, onError?: OnErrorCallback);
    /**
     * Used for aborting ongoing requests in loaders using this manager.
     *
     * @type {AbortController}
     */
    get abortController(): AbortController;
}
/**
 * The global default loading manager.
 *
 * @constant
 * @type {LoadingManager}
 */
declare const DefaultLoadingManager: LoadingManager;
export { DefaultLoadingManager, LoadingManager };
