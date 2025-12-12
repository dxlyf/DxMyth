import { SpringOptions, Animation } from '../types';
/**
 * This is based on the spring implementation of Wobble https://github.com/skevy/wobble
 */
export declare function spring({ from, to, restSpeed, restDelta, ...options }: SpringOptions): Animation<number>;
export declare namespace spring {
    var needsInterpolation: (a: any, b: any) => boolean;
}
