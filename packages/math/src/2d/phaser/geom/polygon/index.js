/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Polygon from './Polygon';
import Clone from './Clone';
import Contains from './Contains';
import ContainsPoint from './ContainsPoint';
import Earcut from './Earcut';
import GetAABB from './GetAABB';
import GetNumberArray from './GetNumberArray';
import GetPoints from './GetPoints';
import Perimeter from './Perimeter';
import Reverse from './Reverse';
import Simplify from './Simplify';
import Smooth from './Smooth';
import Translate from './Translate';

Polygon.Clone=Clone;
Polygon.Contains=Contains;
Polygon.ContainsPoint=ContainsPoint;
Polygon.Earcut=Earcut;
Polygon.GetAABB=GetAABB;
Polygon.GetNumberArray=GetNumberArray;
Polygon.GetPoints=GetPoints;
Polygon.Perimeter=Perimeter;
Polygon.Reverse=Reverse;
Polygon.Simplify=Simplify;
Polygon.Smooth=Smooth;
Polygon.Translate=Translate;

export default  Polygon;
