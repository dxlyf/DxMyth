export default LazyWrapper;
/**
 * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
 *
 * @private
 * @constructor
 * @param {*} value The value to wrap.
 */
declare function LazyWrapper(value: any): void;
declare class LazyWrapper {
    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @constructor
     * @param {*} value The value to wrap.
     */
    private constructor();
    __wrapped__: any;
    __actions__: any[];
    __dir__: number;
    __filtered__: boolean;
    __iteratees__: any[];
    __takeCount__: number;
    __views__: any[];
}
