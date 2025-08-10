declare const set: (eps?: number) => {
    set: (eps?: number) => void;
    reset: () => /*elided*/ any;
    compare: (a: import('..').BigNumber, b: import('..').BigNumber) => number;
    snap: (v: import('./vector').Vector) => import('./vector').Vector;
    orient: (a: import('./vector').Vector, b: import('./vector').Vector, c: import('./vector').Vector) => number;
};
export declare let precision: ReturnType<typeof set>;
export {};
