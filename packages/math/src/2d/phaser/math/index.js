/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import CONST from './const';
import Extend from '../utils/object/Extend';

    //  Collections of functions
import Angle from './angle/'
import Distance from './distance/'
import Easing from './easing/'
import Fuzzy from './fuzzy/'
import Interpolation from './interpolation/'
import Pow2 from './pow2/'
import Snap from './snap/'

    //  Expose the RNG Class
import RandomDataGenerator from './random-data-generator/RandomDataGenerator'

    //  Single functions
import Average from './Average'
import Bernstein from './Bernstein'
import Between from './Between'
import CatmullRom from './CatmullRom'
import CeilTo from './CeilTo'
import Clamp from './Clamp'
import DegToRad from './DegToRad'
import Difference from './Difference'
import Euler from './Euler'
import Factorial from './Factorial'
import FloatBetween from './FloatBetween'
import FloorTo from './FloorTo'
import FromPercent from './FromPercent'
import GetSpeed from './GetSpeed'
import IsEven from './IsEven'
import IsEvenStrict from './IsEvenStrict'
import Linear from './Linear'
import LinearXY from './LinearXY'
import MaxAdd from './MaxAdd'
import Median from './Median'
import MinSub from './MinSub'
import Percent from './Percent'
import RadToDeg from './RadToDeg'
import RandomXY from './RandomXY'
import RandomXYZ from './RandomXYZ'
import RandomXYZW from './RandomXYZW'
import Rotate from './Rotate'
import RotateAround from './RotateAround'
import RotateAroundDistance from './RotateAroundDistance'
import RotateTo from './RotateTo'
import RoundAwayFromZero from './RoundAwayFromZero'
import RoundTo from './RoundTo'
import SinCosTableGenerator from './SinCosTableGenerator'
import SmootherStep from './SmootherStep'
import SmoothStep from './SmoothStep'
import ToXY from './ToXY'
import TransformXY from './TransformXY'
import Within from './Within'
import Wrap from './Wrap'

    //  Vector classes
import Vector2 from './Vector2'
import Vector3 from './Vector3'
import Vector4 from './Vector4'
import Matrix3 from './Matrix3'
import Matrix4 from './Matrix4'
import Quaternion from './Quaternion'
import RotateVec3 from './RotateVec3'
/**
 * @namespace Phaser.Math
 */

var PhaserMath = {

    //  Collections of functions
Angle:Angle,
Distance:Distance,
Easing:Easing,
Fuzzy:Fuzzy,
Interpolation:Interpolation,
Pow2:Pow2,
Snap:Snap,

    //  Expose the RNG Class
RandomDataGenerator:RandomDataGenerator,

    //  Single functions
Average:Average,
Bernstein:Bernstein,
Between:Between,
CatmullRom:CatmullRom,
CeilTo:CeilTo,
Clamp:Clamp,
DegToRad:DegToRad,
Difference:Difference,
Euler:Euler,
Factorial:Factorial,
FloatBetween:FloatBetween,
FloorTo:FloorTo,
FromPercent:FromPercent,
GetSpeed:GetSpeed,
IsEven:IsEven,
IsEvenStrict:IsEvenStrict,
Linear:Linear,
LinearXY:LinearXY,
MaxAdd:MaxAdd,
Median:Median,
MinSub:MinSub,
Percent:Percent,
RadToDeg:RadToDeg,
RandomXY:RandomXY,
RandomXYZ:RandomXYZ,
RandomXYZW:RandomXYZW,
Rotate:Rotate,
RotateAround:RotateAround,
RotateAroundDistance:RotateAroundDistance,
RotateTo:RotateTo,
RoundAwayFromZero:RoundAwayFromZero,
RoundTo:RoundTo,
SinCosTableGenerator:SinCosTableGenerator,
SmootherStep:SmootherStep,
SmoothStep:SmoothStep,
ToXY:ToXY,
TransformXY:TransformXY,
Within:Within,
Wrap:Wrap,

    //  Vector classes
Vector2:Vector2,
Vector3:Vector3,
Vector4:Vector4,
Matrix3:Matrix3,
Matrix4:Matrix4,
Quaternion:Quaternion,
RotateVec3:RotateVec3,

};

//   Merge in the consts

PhaserMath = Extend(false, PhaserMath, CONST);

//  Export it

export default  PhaserMath;
