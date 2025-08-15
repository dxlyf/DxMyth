export default GenerateVerts;
/**
 * Generates a set of Face and Vertex objects by parsing the given data.
 *
 * This method will take vertex data in one of two formats, based on the `containsZ` parameter.
 *
 * If your vertex data are `x`, `y` pairs, then `containsZ` should be `false` (this is the default)
 *
 * If your vertex data is groups of `x`, `y` and `z` values, then the `containsZ` parameter must be true.
 *
 * The `uvs` parameter is a numeric array consisting of `u` and `v` pairs.
 *
 * The `normals` parameter is a numeric array consisting of `x`, `y` vertex normal values and, if `containsZ` is true, `z` values as well.
 *
 * The `indicies` parameter is an optional array that, if given, is an indexed list of vertices to be added.
 *
 * The `colors` parameter is an optional array, or single value, that if given sets the color of each vertex created.
 *
 * The `alphas` parameter is an optional array, or single value, that if given sets the alpha of each vertex created.
 *
 * When providing indexed data it is assumed that _all_ of the arrays are indexed, not just the vertices.
 *
 * The following example will create a 256 x 256 sized quad using an index array:
 *
 * ```javascript
 * const vertices = [
 *   -128, 128,
 *   128, 128,
 *   -128, -128,
 *   128, -128
 * ];
 *
 * const uvs = [
 *   0, 1,
 *   1, 1,
 *   0, 0,
 *   1, 0
 * ];
 *
 * const indices = [ 0, 2, 1, 2, 3, 1 ];
 *
 * GenerateVerts(vertices, uvs, indicies);
 * ```
 *
 * If the data is not indexed, it's assumed that the arrays all contain sequential data.
 *
 * @function Phaser.Geom.Mesh.GenerateVerts
 * @since 3.50.0
 *
 * @param {number[]} vertices - The vertices array. Either `xy` pairs, or `xyz` if the `containsZ` parameter is `true`.
 * @param {number[]} uvs - The UVs pairs array.
 * @param {number[]} [indicies] - Optional vertex indicies array. If you don't have one, pass `null` or an empty array.
 * @param {boolean} [containsZ=false] - Does the vertices data include a `z` component?
 * @param {number[]} [normals] - Optional vertex normals array. If you don't have one, pass `null` or an empty array.
 * @param {number|number[]} [colors=0xffffff] - An array of colors, one per vertex, or a single color value applied to all vertices.
 * @param {number|number[]} [alphas=1] - An array of alpha values, one per vertex, or a single alpha value applied to all vertices.
 * @param {boolean} [flipUV=false] - Flip the UV coordinates?
 *
 * @return {Phaser.Types.Geom.Mesh.GenerateVertsResult} The parsed Face and Vertex objects.
 */
declare function GenerateVerts(vertices: number[], uvs: number[], indicies?: number[], containsZ?: boolean, normals?: number[], colors?: number | number[], alphas?: number | number[], flipUV?: boolean): Phaser.Types.Geom.Mesh.GenerateVertsResult;
