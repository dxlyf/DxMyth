declare const set: (eps?: number) => {
    set: (eps?: number) => void;
    reset: () => /*elided*/ any;
    compare: (a: import('../../index.js').BigNumber, b: import('../../index.js').BigNumber) => number;
    snap: (v: import('./vector.js').Vector) => import('./vector.js').Vector;
    orient: (a: import('./vector.js').Vector, b: import('./vector.js').Vector, c: import('./vector.js').Vector) => number;
};
export declare let precision: ReturnType<typeof set>;
export {};
