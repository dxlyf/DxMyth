type Path = (string | number)[];
export declare const isObject: (obj: any) => boolean;
export declare const isArray: (arr: any) => arr is any[];
export declare const isNullOrUndefined: (val: any) => boolean;
export declare const isPrimitive: (val: any) => boolean;
export declare const hasOwn: (obj: any, key: string) => boolean;
export declare const setPathValue: (obj: any, path: Path, value: any) => void;
export declare const getPathValue: (obj: any, path: Path, defaultValue?: any) => any;
export {};
