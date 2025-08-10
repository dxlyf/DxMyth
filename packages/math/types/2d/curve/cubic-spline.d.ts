export declare class Spline {
    readonly xs: number[];
    readonly ys: number[];
    readonly ks: Float64Array;
    constructor(xs: number[], ys: number[]);
    getNaturalKs(ks: Float64Array): Float64Array;
    /**
     * inspired by https://stackoverflow.com/a/40850313/4417327
     */
    getIndexBefore(target: number): number;
    at(x: number): number;
}
