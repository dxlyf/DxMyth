export default RotateFace;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Rotates the vertices of a Face to the given angle.
 *
 * The actual vertex positions are adjusted, not their transformed positions.
 *
 * Therefore, this updates the vertex data directly.
 *
 * @function Phaser.Geom.Mesh.RotateFace
 * @since 3.50.0
 *
 * @param {Phaser.Geom.Mesh.Face} face - The Face to rotate.
 * @param {number} angle - The angle to rotate to, in radians.
 * @param {number} [cx] - An optional center of rotation. If not given, the Face in-center is used.
 * @param {number} [cy] - An optional center of rotation. If not given, the Face in-center is used.
 */
declare function RotateFace(face: Phaser.Geom.Mesh.Face, angle: number, cx?: number, cy?: number): void;
