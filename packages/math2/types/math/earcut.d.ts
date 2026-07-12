/**
 * Triangulate a polygon given as a flat array of vertex coordinates.
 *
 * @param data flat array of vertex coordinates
 * @param holeIndices indices (in vertices, not coordinates) where each hole ring starts
 * @param dim number of coordinates per vertex in `data`
 * @returns triangles as triplets of vertex indices into `data`
 * @example earcut([10,0, 0,50, 60,60, 70,10]); // [1,0,3, 3,2,1]
 */
export default function earcut(data: ArrayLike<number>, holeIndices?: ArrayLike<number> | null, dim?: number): number[];
/**
 * Return the relative difference between the polygon area and the area of its triangulation.
 *
 * @param data flat array of vertex coordinates
 * @param holeIndices indices where each hole ring starts
 * @param dim number of coordinates per vertex in `data`
 * @param triangles output of {@link earcut}
 * @returns deviation, ~0 if correct
 */
export declare function deviation(data: ArrayLike<number>, holeIndices: ArrayLike<number> | null, dim: number, triangles: ArrayLike<number>): number;
/**
 * Turn a polygon in multi-dimensional array form (e.g. as in GeoJSON) into the flat form Earcut accepts.
 *
 * @param data array of rings; the first ring is the outer contour, the rest are holes
 * @returns flat vertices, hole indices, and dimensions
 */
export declare function flatten(data: ReadonlyArray<ReadonlyArray<ArrayLike<number>>>): {
    vertices: number[];
    holes: number[];
    dimensions: number;
};
/**
 * Refine a triangulation toward the constrained Delaunay triangulation by legalizing every
 * interior edge in place with Lawson flips.
 *
 * @param triangles triangle indices; mutated in place
 * @param coords the flat vertex coordinates passed to {@link earcut}
 * @param dim number of coordinates per vertex in `coords`
 */
export declare function refine(triangles: number[], coords: ArrayLike<number>, dim?: number): void;
