declare class Delaunator<T extends ArrayLike<number> = Float64Array> {
    /**
     * Constructs a delaunay triangulation object given an array of points (`[x, y]` by default).
     * `getX` and `getY` are optional functions of the form `(point) => value` for custom point formats.
     */
    static from<P>(points: P[], getX?: (point: P) => number, getY?: (point: P) => number): Delaunator<Float64Array>;
    /**
     * Constructs a delaunay triangulation object given an array of point coordinates of the form:
     * `[x0, y0, x1, y1, ...]` (use a typed array for best performance). Duplicate points are skipped.
     */
    constructor(coords: T);
    /** Input coordinates of the form `[x0, y0, x1, y1, ...]`. */
    coords: T;
    /** A `Uint32Array` array of triangle vertex indices (each group of three numbers forms a triangle). All triangles are directed counterclockwise. */
    triangles: Uint32Array;
    /**
     * A `Int32Array` array of triangle half-edge indices that allows you to traverse the triangulation.
     * `i`-th half-edge in the array corresponds to vertex `triangles[i]` the half-edge is coming from.
     * `halfedges[i]` is the index of a twin half-edge in an adjacent triangle (or `-1` for outer half-edges on the convex hull).
     */
    halfedges: Int32Array;
    /** A `Uint32Array` array of indices that reference points on the convex hull of the input data, counter-clockwise. */
    hull: Uint32Array;
    private _triangles;
    private _halfedges;
    private _hashSize;
    private _hullPrev;
    private _hullNext;
    private _hullTri;
    private _hullHash;
    private _ids;
    private _dists;
    private trianglesLen;
    private _cx;
    private _cy;
    private _hullStart;
    /**
     * Updates the triangulation if you modified `delaunay.coords` values in place, avoiding expensive memory allocations.
     * Useful for iterative relaxation algorithms such as Lloyd's.
     */
    update(): void;
    /**
     * Calculate an angle-based key for the edge hash used for advancing convex hull.
     */
    private _hashKey;
    /**
     * Flip an edge in a pair of triangles if it doesn't satisfy the Delaunay condition.
     */
    private _legalize;
    /**
     * Link two half-edges to each other.
     */
    private _link;
    /**
     * Add a new triangle given vertex indices and adjacent half-edge ids.
     */
    private _addTriangle;
}
export { Delaunator };
