/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import BaseTween from '../tween/BaseTween';
import Defaults from '../tween/Defaults';
import GetAdvancedValue from '../../utils/object/GetAdvancedValue';
import GetBoolean from './GetBoolean';
import GetEaseFunction from './GetEaseFunction';
import GetFastValue from '../../utils/object/GetFastValue';
import GetNewValue from './GetNewValue';
import GetValue from '../../utils/object/GetValue';
import GetValueOp from './GetValueOp';
import MergeRight from '../../utils/object/MergeRight';
import Tween from '../tween/Tween';

/**
 * Creates a new Number Tween.
 *
 * @function Phaser.Tweens.Builders.NumberTweenBuilder
 * @since 3.0.0
 *
 * @param {Phaser.Tweens.TweenManager} parent - The owner of the new Tween.
 * @param {Phaser.Types.Tweens.NumberTweenBuilderConfig} config - Configuration for the new Tween.
 * @param {Phaser.Types.Tweens.TweenConfigDefaults} defaults - Tween configuration defaults.
 *
 * @return {Phaser.Tweens.Tween} The new tween.
 */
var NumberTweenBuilder = function (parent, config, defaults)
{
    if (config instanceof Tween)
    {
        config.parent = parent;

        return config;
    }

    if (defaults === undefined)
    {
        defaults = Defaults;
    }
    else
    {
        defaults = MergeRight(Defaults, defaults);
    }

    //  var tween = this.tweens.addCounter({
    //      from: 100,
    //      to: 200,
    //      ... (normal tween properties)
    //  })
    //
    //  Then use it in your game via:
    //
    //  tween.getValue()

    var from = GetFastValue(config, 'from', 0);
    var to = GetFastValue(config, 'to', 1);

    var targets = [ { value: from } ];

    var delay = GetFastValue(config, 'delay', defaults.delay);
    var easeParams = GetFastValue(config, 'easeParams', defaults.easeParams);
    var ease = GetFastValue(config, 'ease', defaults.ease);

    var ops = GetValueOp('value', to);

    var tween = new Tween(parent, targets);

    var tweenData = tween.add(
        0,
        'value',
        ops.getEnd,
        ops.getStart,
        ops.getActive,
        GetEaseFunction(GetFastValue(config, 'ease', ease), GetFastValue(config, 'easeParams', easeParams)),
        GetNewValue(config, 'delay', delay),
        GetFastValue(config, 'duration', defaults.duration),
        GetBoolean(config, 'yoyo', defaults.yoyo),
        GetFastValue(config, 'hold', defaults.hold),
        GetFastValue(config, 'repeat', defaults.repeat),
        GetFastValue(config, 'repeatDelay', defaults.repeatDelay),
        false,
        false
    );

    tweenData.start = from;
    tweenData.current = from;

    tween.completeDelay = GetAdvancedValue(config, 'completeDelay', 0);
    tween.loop = Math.round(GetAdvancedValue(config, 'loop', 0));
    tween.loopDelay = Math.round(GetAdvancedValue(config, 'loopDelay', 0));
    tween.paused = GetBoolean(config, 'paused', false);
    tween.persist = GetBoolean(config, 'persist', false);
    tween.isNumberTween = true;

    //  Set the Callbacks
    tween.callbackScope = GetValue(config, 'callbackScope', tween);

    var callbacks = BaseTween.TYPES;

    for (var i = 0; i < callbacks.length; i++)
    {
        var type = callbacks[i];

        var callback = GetValue(config, type, false);

        if (callback)
        {
            var callbackParams = GetValue(config, type + 'Params', []);

            tween.setCallback(type, callback, callbackParams);
        }
    }

    return tween;
};

export default NumberTweenBuilder;
