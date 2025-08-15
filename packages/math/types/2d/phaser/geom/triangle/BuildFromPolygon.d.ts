export default BuildFromPolygon;
/**
 * Takes an array of vertex coordinates, and optionally an array of hole indices, then returns an array
 * of Triangle instances, where the given vertices have been decomposed into a series of triangles.
 *
 * @function Phaser.Geom.Triangle.BuildFromPolygon
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Triangle[]} O - [out,$return]
 *
 * @param {array} data - A flat array of vertex coordinates like [x0,y0, x1,y1, x2,y2, ...]
 * @param {array} [holes=null] - An array of hole indices if any (e.g. [5, 8] for a 12-vertex input would mean one hole with vertices 5–7 and another with 8–11).
 * @param {number} [scaleX=1] - Horizontal scale factor to multiply the resulting points by.
 * @param {number} [scaleY=1] - Vertical scale factor to multiply the resulting points by.
 * @param {(array|Phaser.Geom.Triangle[])} [out] - An array to store the resulting Triangle instances in. If not provided, a new array is created.
 *
 * @return {(array|Phaser.Geom.Triangle[])} An array of Triangle instances, where each triangle is based on the decomposed vertices data.
 */
declare function BuildFromPolygon(data: array, holes?: array, scaleX?: number, scaleY?: number, out?: (array | Phaser.Geom.Triangle[])): (array | Phaser.Geom.Triangle[]);
