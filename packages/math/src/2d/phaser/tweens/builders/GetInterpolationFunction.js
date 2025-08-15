/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Bezier from '../../math/interpolation/BezierInterpolation';
import CatmullRom from '../../math/interpolation/CatmullRomInterpolation';
import Linear from '../../math/interpolation/LinearInterpolation';

var FuncMap = {
    bezier: Bezier,
    catmull: CatmullRom,
    catmullrom: CatmullRom,
    linear: Linear
};

/**
 * This internal function is used to return the correct interpolation function for a Tween.
 *
 * It can take a variety of input, including a string, or a custom function.
 *
 * @function Phaser.Tweens.Builders.GetInterpolationFunction
 * @since 3.60.0
 *
 * @param {(string|function|null)} interpolation - The interpolation function to find. This can be either a string, or a custom function, or null.
 *
 * @return {?function} The interpolation function to use, or `null`.
 */
var GetInterpolationFunction = function (interpolation)
{
    if (interpolation === null)
    {
        return null;
    }

    //  Default interpolation function
    var interpolationFunction = FuncMap.linear;

    //  Prepare interpolation function
    if (typeof interpolation === 'string')
    {
        //  String based look-up

        //  1) They specified it correctly
        if (FuncMap.hasOwnProperty(interpolation))
        {
            interpolationFunction = FuncMap[interpolation];
        }
    }
    else if (typeof interpolation === 'function')
    {
        //  Custom function
        interpolationFunction = interpolation;
    }

    //  Return interpolation function
    return interpolationFunction;
};

export default GetInterpolationFunction;
