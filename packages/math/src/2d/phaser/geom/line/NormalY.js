/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import MATH_CONST from '../../math/const';
import Angle from './Angle';

/**
 * The Y value of the normal of the given line.
 * The normal of a line is a vector that points perpendicular from it.
 *
 * @function Phaser.Geom.Line.NormalY
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The line to calculate the normal of.
 *
 * @return {number} The Y value of the normal of the Line.
 */
var NormalY = function (line)
{
    return Math.sin(Angle(line) - MATH_CONST.TAU);
};

export default  NormalY;
