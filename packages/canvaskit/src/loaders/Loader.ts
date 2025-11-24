/**
 * @ref three.js
 */
import { LoadingManager,DefaultLoadingManager } from "./LoadingManager";





export interface LoaderOptions {
   
}
export type OnLoadCallback<T>=(data:T)=>void;
export type OnProgressCallback = (e:ProgressEvent)=>void;
export type OnErrorCallback = (error:Error)=>void;

export abstract class Loader<TData = unknown, TUrl = string> {
 /**
     * @default 'anonymous'
     */
   declare crossOrigin: string;

    /**
     * @default false
     */
   declare withCredentials: boolean;

    /**
     * @default ''
     */
   declare path: string;

    /**
     * @default ''
     */
   declare resourcePath: string;
   declare manager: LoadingManager;

    /**
     * @default {}
     */
   declare requestHeader: { [header: string]: string };

    static DEFAULT_MATERIAL_NAME: string;
   
    /**
     * Constructs a new loader.
     *
     * @param {LoadingManager} [manager] - The loading manager.
     */
    constructor( manager?:LoadingManager ) {
   
      /**
       * The loading manager.
       *
       * @type {LoadingManager}
       * @default DefaultLoadingManager
       */
      this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;
   
      /**
       * The crossOrigin string to implement CORS for loading the url from a
       * different domain that allows CORS.
       *
       * @type {string}
       * @default 'anonymous'
       */
      this.crossOrigin = 'anonymous';
   
      /**
       * Whether the XMLHttpRequest uses credentials.
       *
       * @type {boolean}
       * @default false
       */
      this.withCredentials = false;
   
      /**
       * The base path from which the asset will be loaded.
       *
       * @type {string}
       */
      this.path = '';
   
      /**
       * The base path from which additional resources like textures will be loaded.
       *
       * @type {string}
       */
      this.resourcePath = '';
   
      /**
       * The [request header](https://developer.mozilla.org/en-US/docs/Glossary/Request_header)
       * used in HTTP request.
       *
       * @type {Object<string, any>}
       */
      this.requestHeader = {};
   
    }
   
    /**
     * This method needs to be implemented by all concrete loaders. It holds the
     * logic for loading assets from the backend.
     *
     * @abstract
     * @param {string} url - The path/URL of the file to be loaded.
     * @param {Function} onLoad - Executed when the loading process has been finished.
     * @param {onProgressCallback} [onProgress] - Executed while the loading is in progress.
     * @param {onErrorCallback} [onError] - Executed when errors occur.
     */
   abstract load(
        url: TUrl,
        onLoad:OnLoadCallback<TData>,
        onProgress?: OnProgressCallback,
        onError?:OnErrorCallback,
    ):any
   
   
    /**
     * A async version of {@link Loader#load}.
     *
     * @param {string} url - The path/URL of the file to be loaded.
     * @param {onProgressCallback} [onProgress] - Executed while the loading is in progress.
     * @return {Promise} A Promise that resolves when the asset has been loaded.
     */
    loadAsync( url:TUrl, onProgress:OnProgressCallback ) {
   
      const scope = this;
   
      return new Promise( function ( resolve, reject ) {
   
        scope.load( url, resolve, onProgress, reject );
   
      } );
   
    }
   
    /**
     * This method needs to be implemented by all concrete loaders. It holds the
     * logic for parsing the asset into three.js entities.
     *
     * @abstract
     * @param {any} data - The data to parse.
     */
    parse( data:TData ){
      return data
    };
   
    /**
     * Sets the `crossOrigin` String to implement CORS for loading the URL
     * from a different domain that allows CORS.
     *
     * @param {string} crossOrigin - The `crossOrigin` value.
     * @return {Loader} A reference to this instance.
     */
    setCrossOrigin( crossOrigin:string ) {
   
      this.crossOrigin = crossOrigin;
      return this;
   
    }
   
    /**
     * Whether the XMLHttpRequest uses credentials such as cookies, authorization
     * headers or TLS client certificates, see [XMLHttpRequest.withCredentials](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials).
     *
     * Note: This setting has no effect if you are loading files locally or from the same domain.
     *
     * @param {boolean} value - The `withCredentials` value.
     * @return {Loader} A reference to this instance.
     */
    setWithCredentials( value:boolean ) {
   
      this.withCredentials = value;
      return this;  
   
    }
   
    /**
     * Sets the base path for the asset.
     *
     * @param {string} path - The base path.
     * @return {Loader} A reference to this instance.
     */
    setPath( path:string   ) {
   
      this.path = path;
      return this;
   
    }
   
    /**
     * Sets the base path for dependent resources like textures.
     *
     * @param {string} resourcePath - The resource path.
     * @return {Loader} A reference to this instance.
     */
    setResourcePath( resourcePath:string ) {
   
      this.resourcePath = resourcePath;
      return this;
   
    }
   
    /**
     * Sets the given request header.
     *
     * @param {Object} requestHeader - A [request header](https://developer.mozilla.org/en-US/docs/Glossary/Request_header)
     * for configuring the HTTP request.
     * @return {Loader} A reference to this instance.
     */
    setRequestHeader( requestHeader:Record<string, any> ) {
   
      this.requestHeader = requestHeader;
      return this;
   
    }
   
    /**
     * This method can be implemented in loaders for aborting ongoing requests.
     *
     * @abstract
     * @return {Loader} A reference to this instance.
     */
    abort() {
      return this;
   
    }
}

