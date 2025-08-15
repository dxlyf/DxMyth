export default ParseObj;
/**
 * Parses a Wavefront OBJ File, extracting the models from it and returning them in an array.
 *
 * The model data *must* be triangulated for a Mesh Game Object to be able to render it.
 *
 * @function Phaser.Geom.Mesh.ParseObj
 * @since 3.50.0
 *
 * @param {string} data - The OBJ File data as a raw string.
 * @param {boolean} [flipUV=true] - Flip the UV coordinates?
 *
 * @return {Phaser.Types.Geom.Mesh.OBJData} The parsed model and material data.
 */
declare function ParseObj(data: string, flipUV?: boolean): Phaser.Types.Geom.Mesh.OBJData;
