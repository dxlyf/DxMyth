/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import CONST from './const';
import Circle from './circle'
import Ellipse from './ellipse'
import Intersects from './intersects'
import Line from './line'
import Mesh from './mesh'
import Point from './point'
import Polygon from './polygon'
import Rectangle from './rectangle'
import Triangle from './triangle'
/**
 * @namespace Phaser.Geom
 */

var Geom = {

    Circle,
    Ellipse,
    Intersects,
    Line,
    Mesh,
    Point,
    Polygon,
    Rectangle,
    Triangle,
    ...CONST,
};

export default Geom;
