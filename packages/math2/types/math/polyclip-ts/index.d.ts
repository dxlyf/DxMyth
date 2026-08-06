import { Geom } from './geom-in.js';
export type { Geom };
export declare const union: (geom: Geom, ...moreGeoms: Geom[]) => import('./geom-in.js').MultiPoly;
export declare const intersection: (geom: Geom, ...moreGeoms: Geom[]) => import('./geom-in.js').MultiPoly;
export declare const xor: (geom: Geom, ...moreGeoms: Geom[]) => import('./geom-in.js').MultiPoly;
export declare const difference: (geom: Geom, ...moreGeoms: Geom[]) => import('./geom-in.js').MultiPoly;
export declare const setPrecision: (eps?: number) => void;
