export default ParseObjMaterial;
/**
 * Takes a Wavefront Material file and extracts the diffuse reflectivity of the named
 * materials, converts them to integer color values and returns them.
 *
 * This is used internally by the `addOBJ` and `addModel` methods, but is exposed for
 * public consumption as well.
 *
 * Note this only works with diffuse values, specified in the `Kd r g b` format, where
 * `g` and `b` are optional, but `r` is required. It does not support spectral rfl files,
 * or any other material statement (such as `Ka` or `Ks`)
 *
 * @method Phaser.Geom.Mesh.ParseObjMaterial
 * @since 3.50.0
 *
 * @param {string} mtl - The OBJ MTL file as a raw string, i.e. loaded via `this.load.text`.
 *
 * @return {object} The parsed material colors, where each property of the object matches the material name.
 */
declare function ParseObjMaterial(mtl: string): object;
