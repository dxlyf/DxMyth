import { TRGBAColorSource } from '../../color/typedefs';
import { AnimationBase } from './AnimationBase';
import { ColorAnimationOptions } from './types';
export declare class ColorAnimation extends AnimationBase<TRGBAColorSource> {
    constructor({ startValue, endValue, easing, onChange, onComplete, abort, ...options }: ColorAnimationOptions);
    protected calculate(timeElapsed: number): {
        value: TRGBAColorSource;
        valueProgress: number;
    };
}
