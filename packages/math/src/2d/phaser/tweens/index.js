/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
import States from './tween/const'

import Builders from './builders'
import Events from './events'

import TweenManager from './TweenManager'
import Tween from './tween/Tween'
import TweenData from './tween/TweenData'
import TweenFrameData from './tween/TweenFrameData'

import BaseTween from './tween/BaseTween'
import TweenChain from './tween/TweenChain'
/**
 * @namespace Phaser.Tweens
 */

var Tweens = {

States:States,

Builders:Builders,
Events:Events,

TweenManager:TweenManager,
Tween:Tween,
TweenData:TweenData,
TweenFrameData:TweenFrameData,

BaseTween:BaseTween,
TweenChain:TweenChain,
};

export default Tweens;
