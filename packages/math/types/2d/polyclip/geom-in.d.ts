import { Bbox } from './bbox';
import { default as Segment } from './segment';
export type Ring = [number, number][];
export type Poly = Ring[];
export type MultiPoly = Poly[];
export type Geom = Poly | MultiPoly;
export declare class RingIn {
    poly: PolyIn;
    isExterior: boolean;
    segments: Segment[];
    bbox: Bbox;
    constructor(geomRing: Ring, poly: PolyIn, isExterior: boolean);
    getSweepEvents(): import('./sweep-event').default[];
}
export declare class PolyIn {
    multiPoly: MultiPolyIn;
    exteriorRing: RingIn;
    interiorRings: RingIn[];
    bbox: Bbox;
    constructor(geomPoly: Poly, multiPoly: MultiPolyIn);
    getSweepEvents(): import('./sweep-event').default[];
}
export declare class MultiPolyIn {
    isSubject: boolean;
    polys: PolyIn[];
    bbox: Bbox;
    constructor(geom: Geom, isSubject: boolean);
    getSweepEvents(): import('./sweep-event').default[];
}
