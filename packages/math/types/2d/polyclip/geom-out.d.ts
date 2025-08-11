import { MultiPoly, Poly, Ring } from './geom-in';
import { default as Segment } from './segment';
import { default as SweepEvent } from './sweep-event';
export declare class RingOut {
    events: SweepEvent[];
    poly: PolyOut | null;
    _isExteriorRing: boolean | undefined;
    _enclosingRing: RingOut | null | undefined;
    static factory(allSegments: Segment[]): RingOut[];
    constructor(events: SweepEvent[]);
    getGeom(): Ring;
    isExteriorRing(): boolean;
    enclosingRing(): RingOut;
    _calcEnclosingRing(): RingOut | null | undefined;
}
export declare class PolyOut {
    exteriorRing: RingOut;
    interiorRings: RingOut[];
    constructor(exteriorRing: RingOut);
    addInterior(ring: RingOut): void;
    getGeom(): Poly;
}
export declare class MultiPolyOut {
    rings: RingOut[];
    polys: PolyOut[];
    constructor(rings: RingOut[]);
    getGeom(): MultiPoly;
    _composePolys(rings: RingOut[]): PolyOut[];
}
