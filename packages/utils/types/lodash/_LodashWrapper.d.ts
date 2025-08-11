export default LodashWrapper;
/**
 * The base constructor for creating `lodash` wrapper objects.
 *
 * @private
 * @param {*} value The value to wrap.
 * @param {boolean} [chainAll] Enable explicit method chain sequences.
 */
declare function LodashWrapper(value: any, chainAll?: boolean): void;
declare class LodashWrapper {
    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable explicit method chain sequences.
     */
    private constructor();
    __wrapped__: any;
    __actions__: any[];
    __chain__: boolean;
    __index__: number;
    __values__: any;
}
