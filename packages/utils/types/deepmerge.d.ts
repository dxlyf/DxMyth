export interface Options {
    arrayMerge?(target: any[], source: any[], options?: ArrayMergeOptions): any[];
    clone?: boolean;
    customMerge?: (key: string, options?: Options) => ((x: any, y: any) => any) | undefined;
    isMergeableObject?(value: object): boolean;
}
export interface ArrayMergeOptions {
    isMergeableObject(value: object): boolean;
    cloneUnlessOtherwiseSpecified(value: object, options?: Options): object;
}
declare function deepmerge<T>(target: Partial<T>, source: Partial<T>, options?: Options): T;
declare namespace deepmerge {
    var all: typeof deepmergeAll;
}
declare function deepmergeAll(objects: object[], options?: Options): object;
export default deepmerge;
