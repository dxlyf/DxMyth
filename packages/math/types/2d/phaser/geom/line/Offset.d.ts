export default Offset;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Offset a line by the given amount.
 *
 * @function Phaser.Geom.Line.Offset
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Line} O - [line,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to offset.
 * @param {number} x - The horizontal offset to add to the line.
 * @param {number} y - The vertical offset to add to the line.
 *
 * @return {Phaser.Geom.Line} The offset line.
 */
declare function Offset(line: Phaser.Geom.Line, x: number, y: number): Phaser.Geom.Line;
