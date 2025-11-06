import { TFabricEnv } from './types';
import { DOMWindow } from 'jsdom';
/**
 * Sets the environment variables used by fabric.\
 * This is exposed for special cases, such as configuring a test environment, and should be used with care.
 *
 * **CAUTION**: Must be called before using the package.
 *
 * @example
 * <caption>Passing `window` and `document` objects to fabric (in case they are mocked or something)</caption>
 * import { getEnv, setEnv } from 'fabric';
 * // we want fabric to use the `window` and `document` objects exposed by the environment we are running in.
 * setEnv({ ...getEnv(), window, document });
 * // done with setup, using fabric is now safe
 */
export declare const setEnv: (value: TFabricEnv) => void;
/**
 * In order to support SSR we **MUST** access the browser env only after the window has loaded
 */
export declare const getEnv: () => TFabricEnv;
export declare const getFabricDocument: () => Document;
export declare const getFabricWindow: () => (Window & typeof globalThis) | DOMWindow;
/**
 * @returns the config value if defined, fallbacks to the environment value
 */
export declare const getDevicePixelRatio: () => number;
