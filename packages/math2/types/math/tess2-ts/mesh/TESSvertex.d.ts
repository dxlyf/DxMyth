import { TESShalfEdge } from './TESShalfEdge';
export declare class TESSvertex {
    next: TESSvertex;
    prev: TESSvertex;
    anEdge: TESShalfEdge;
    coords: [number, number, number];
    s: number;
    t: number;
    pqHandle: number;
    n: number;
    idx: number;
}
