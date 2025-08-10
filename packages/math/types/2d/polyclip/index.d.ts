import { Geom } from './geom-in';
export { type Geom };
export declare const union: (geom: Geom, ...moreGeoms: Geom[]) => import('./geom-in').MultiPoly;
export declare const intersection: (geom: Geom, ...moreGeoms: Geom[]) => import('./geom-in').MultiPoly;
export declare const xor: (geom: Geom, ...moreGeoms: Geom[]) => import('./geom-in').MultiPoly;
export declare const difference: (geom: Geom, ...moreGeoms: Geom[]) => import('./geom-in').MultiPoly;
export declare const setPrecision: (eps?: number) => void;
