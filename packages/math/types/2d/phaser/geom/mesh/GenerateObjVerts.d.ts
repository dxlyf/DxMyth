export default GenerateObjVerts;
/**
 * This method will return an object containing Face and Vertex instances, generated
 * from the parsed triangulated OBJ Model data given to this function.
 *
 * The obj data should have been parsed in advance via the ParseObj function:
 *
 * ```javascript
 * var data = Phaser.Geom.Mesh.ParseObj(rawData, flipUV);
 *
 * var results = GenerateObjVerts(data);
 * ```
 *
 * Alternatively, you can parse obj files loaded via the OBJFile loader:
 *
 * ```javascript
 * preload ()
 * {
 *   this.load.obj('alien', 'assets/3d/alien.obj);
 * }
 *
 * var results = GenerateObjVerts(this.cache.obj.get('alien));
 * ```
 *
 * Make sure your 3D package has triangulated the model data prior to exporting it.
 *
 * You can use the data returned by this function to populate the vertices of a Mesh Game Object.
 *
 * You may add multiple models to a single Mesh, although they will act as one when
 * moved or rotated. You can scale the model data, should it be too small (or large) to visualize.
 * You can also offset the model via the `x`, `y` and `z` parameters.
 *
 * @function Phaser.Geom.Mesh.GenerateObjVerts
 * @since 3.50.0
 *
 * @param {Phaser.Types.Geom.Mesh.OBJData} data - The parsed OBJ model data.
 * @param {Phaser.GameObjects.Mesh} [mesh] - An optional Mesh Game Object. If given, the generated Faces will be automatically added to this Mesh. Set to `null` to skip.
 * @param {number} [scale=1] - An amount to scale the model data by. Use this if the model has exported too small, or large, to see.
 * @param {number} [x=0] - Translate the model x position by this amount.
 * @param {number} [y=0] - Translate the model y position by this amount.
 * @param {number} [z=0] - Translate the model z position by this amount.
 * @param {number} [rotateX=0] - Rotate the model on the x axis by this amount, in radians.
 * @param {number} [rotateY=0] - Rotate the model on the y axis by this amount, in radians.
 * @param {number} [rotateZ=0] - Rotate the model on the z axis by this amount, in radians.
 * @param {boolean} [zIsUp=true] - Is the z axis up (true), or is y axis up (false)?
 *
 * @return {Phaser.Types.Geom.Mesh.GenerateVertsResult} The parsed Face and Vertex objects.
 */
declare function GenerateObjVerts(data: Phaser.Types.Geom.Mesh.OBJData, mesh?: Phaser.GameObjects.Mesh, scale?: number, x?: number, y?: number, z?: number, rotateX?: number, rotateY?: number, rotateZ?: number, zIsUp?: boolean): Phaser.Types.Geom.Mesh.GenerateVertsResult;
