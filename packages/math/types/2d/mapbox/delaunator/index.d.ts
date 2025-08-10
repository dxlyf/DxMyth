export class Delaunator {
    static from(points: any, getX?: typeof defaultGetX, getY?: typeof defaultGetY): Delaunator;
    constructor(coords: any);
    coords: any;
    _triangles: Uint32Array<ArrayBuffer>;
    _halfedges: Int32Array<ArrayBuffer>;
    _hashSize: number;
    _hullPrev: Uint32Array<ArrayBuffer>;
    _hullNext: Uint32Array<ArrayBuffer>;
    _hullTri: Uint32Array<ArrayBuffer>;
    _hullHash: Int32Array<ArrayBuffer>;
    _ids: Uint32Array<ArrayBuffer>;
    _dists: Float64Array<ArrayBuffer>;
    update(): void;
    hull: Uint32Array<ArrayBuffer> | undefined;
    triangles: Uint32Array<ArrayBuffer> | undefined;
    halfedges: Uint32Array<ArrayBuffer> | Int32Array<ArrayBuffer> | undefined;
    _cx: any;
    _cy: any;
    _hullStart: number | undefined;
    trianglesLen: number | undefined;
    _hashKey(x: any, y: any): number;
    _legalize(a: any): number;
    _link(a: any, b: any): void;
    _addTriangle(i0: any, i1: any, i2: any, a: any, b: any, c: any): number | undefined;
}
declare function defaultGetX(p: any): any;
declare function defaultGetY(p: any): any;
export {};
