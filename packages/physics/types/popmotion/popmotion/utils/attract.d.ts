/**
 * Creates an attractor that, given a strength constant, origin and value,
 * will calculate value as attracted to origin.
 */
export declare const createAttractor: (alterDisplacement?: Function) => (constant: number, origin: number, v: number) => number;
export declare const attract: (constant: number, origin: number, v: number) => number;
export declare const attractExpo: (constant: number, origin: number, v: number) => number;
