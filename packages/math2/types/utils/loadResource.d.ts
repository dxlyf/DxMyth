export declare function loadImage(url: string): Promise<HTMLImageElement>;
export declare function loadJSON<T = any>(url: string): Promise<T>;
export declare function loadText(url: string): Promise<string>;
export declare function loadBlob(url: string): Promise<Blob>;
export declare function loadArrayBuffer(url: string): Promise<ArrayBuffer>;
export declare function loadAudio(url: string): Promise<HTMLAudioElement>;
export declare function loadVideo(url: string): Promise<HTMLVideoElement>;
/** 批量加载资源，全部成功才返回，任一失败则 reject */
export declare function loadResources(urls: string[], loader: (url: string) => Promise<any>): Promise<any[]>;
