export default GenerateGridVerts;
/**
 * Creates a grid of vertices based on the given configuration object and optionally adds it to a Mesh.
 *
 * The size of the grid is given in pixels. An example configuration may be:
 *
 * `{ width: 256, height: 256, widthSegments: 2, heightSegments: 2, tile: true }`
 *
 * This will create a grid 256 x 256 pixels in size, split into 2 x 2 segments, with
 * the texture tiling across the cells.
 *
 * You can split the grid into segments both vertically and horizontally. This will
 * generate two faces per grid segment as a result.
 *
 * The `tile` parameter allows you to control if the tile will repeat across the grid
 * segments, or be displayed in full.
 *
 * If adding this grid to a Mesh you can offset the grid via the `x` and `y` properties.
 *
 * UV coordinates are generated based on the given texture and frame in the config. For
 * example, no frame is given, the UVs will be in the range 0 to 1. If a frame is given,
 * such as from a texture atlas, the UVs will be generated within the range of that frame.
 *
 * @function Phaser.Geom.Mesh.GenerateGridVerts
 * @since 3.50.0
 *
 * @param {Phaser.Types.Geom.Mesh.GenerateGridConfig} config - A Grid configuration object.
 *
 * @return {Phaser.Types.Geom.Mesh.GenerateGridVertsResult} A Grid Result object, containing the generated vertices and indicies.
 */
declare function GenerateGridVerts(config: Phaser.Types.Geom.Mesh.GenerateGridConfig): Phaser.Types.Geom.Mesh.GenerateGridVertsResult;
