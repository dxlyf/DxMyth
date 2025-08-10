/**
 * _.memoize(calColor);
 * _.memoize(calColor, (...args) => args[0]);
 * @param f
 * @param resolver
 */
declare const _default: (f: Function, resolver?: (...args: any[]) => string) => {
    (...args: any[]): any;
    cache: Map<any, any>;
};
export default _default;
