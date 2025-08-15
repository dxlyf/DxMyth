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
import GetInterpolationFunction from './GetInterpolationFunction';
import GetNewValue from './GetNewValue';
import GetProps from './GetProps';
import GetTargets from './GetTargets';
import GetValue from '../../utils/object/GetValue';
import GetValueOp from './GetValueOp';
import MergeRight from '../../utils/object/MergeRight';
import Tween from '../tween/Tween';

/**
 * Creates a new Tween.
 *
 * @function Phaser.Tweens.Builders.TweenBuilder
 * @since 3.0.0
 *
 * @param {Phaser.Tweens.TweenManager} parent - The owner of the new Tween.
 * @param {Phaser.Types.Tweens.TweenBuilderConfig|object} config - Configuration for the new Tween.
 * @param {Phaser.Types.Tweens.TweenConfigDefaults} defaults - Tween configuration defaults.
 *
 * @return {Phaser.Tweens.Tween} The new tween.
 */
var TweenBuilder = function (parent, config, defaults)
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

    //  Create arrays of the Targets and the Properties. This Targets array should not be manipulated outside of this Tween.
    var targets = GetTargets(config);

    if (!targets && defaults.targets)
    {
        targets = defaults.targets;
    }

    var props = GetProps(config);

    //  Default Tween values

    var delay = GetFastValue(config, 'delay', defaults.delay);
    var duration = GetFastValue(config, 'duration', defaults.duration);
    var easeParams = GetFastValue(config, 'easeParams', defaults.easeParams);
    var ease = GetFastValue(config, 'ease', defaults.ease);
    var hold = GetFastValue(config, 'hold', defaults.hold);
    var repeat = GetFastValue(config, 'repeat', defaults.repeat);
    var repeatDelay = GetFastValue(config, 'repeatDelay', defaults.repeatDelay);
    var yoyo = GetBoolean(config, 'yoyo', defaults.yoyo);
    var flipX = GetBoolean(config, 'flipX', defaults.flipX);
    var flipY = GetBoolean(config, 'flipY', defaults.flipY);
    var interpolation = GetFastValue(config, 'interpolation', defaults.interpolation);

    var addTarget = function (tween, targetIndex, key, value)
    {
        if (key === 'texture')
        {
            var texture = value;
            var frame = undefined;

            if (Array.isArray(value))
            {
                texture = value[0];
                frame = value[1];
            }
            else if (value.hasOwnProperty('value'))
            {
                texture = value.value;

                if (Array.isArray(value.value))
                {
                    texture = value.value[0];
                    frame = value.value[1];
                }
                else if (typeof value.value === 'string')
                {
                    texture = value.value;
                }
            }
            else if (typeof value === 'string')
            {
                texture = value;
            }

            tween.addFrame(
                targetIndex,
                texture,
                frame,
                GetNewValue(value, 'delay', delay),
                GetFastValue(value, 'duration', duration),
                GetFastValue(value, 'hold', hold),
                GetFastValue(value, 'repeat', repeat),
                GetFastValue(value, 'repeatDelay', repeatDelay),
                GetBoolean(value, 'flipX', flipX),
                GetBoolean(value, 'flipY', flipY)
            );
        }
        else
        {
            var ops = GetValueOp(key, value);

            var interpolationFunc = GetInterpolationFunction(GetFastValue(value, 'interpolation', interpolation));

            tween.add(
                targetIndex,
                key,
                ops.getEnd,
                ops.getStart,
                ops.getActive,
                GetEaseFunction(GetFastValue(value, 'ease', ease), GetFastValue(value, 'easeParams', easeParams)),
                GetNewValue(value, 'delay', delay),
                GetFastValue(value, 'duration', duration),
                GetBoolean(value, 'yoyo', yoyo),
                GetFastValue(value, 'hold', hold),
                GetFastValue(value, 'repeat', repeat),
                GetFastValue(value, 'repeatDelay', repeatDelay),
                GetBoolean(value, 'flipX', flipX),
                GetBoolean(value, 'flipY', flipY),
                interpolationFunc,
                (interpolationFunc) ? value : null
            );
        }
    };

    var tween = new Tween(parent, targets);

    //  Loop through every property defined in the Tween, i.e.: props { x, y, alpha }
    for (var p = 0; p < props.length; p++)
    {
        var key = props[p].key;
        var value = props[p].value;

        //  Create 1 TweenData per target, per property
        for (var targetIndex = 0; targetIndex < targets.length; targetIndex++)
        {
            //  Special-case for scale short-cut:
            if (key === 'scale' && !targets[targetIndex].hasOwnProperty('scale'))
            {
                addTarget(tween, targetIndex, 'scaleX', value);
                addTarget(tween, targetIndex, 'scaleY', value);
            }
            else
            {
                addTarget(tween, targetIndex, key, value);
            }
        }
    }

    tween.completeDelay = GetAdvancedValue(config, 'completeDelay', 0);
    tween.loop = Math.round(GetAdvancedValue(config, 'loop', 0));
    tween.loopDelay = Math.round(GetAdvancedValue(config, 'loopDelay', 0));
    tween.paused = GetBoolean(config, 'paused', false);
    tween.persist = GetBoolean(config, 'persist', false);

    //  Set the Callbacks
    tween.callbackScope = GetFastValue(config, 'callbackScope', tween);

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

export default TweenBuilder;
