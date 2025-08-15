import { default as Eventful } from '../core/Eventful';
import { default as Animator } from './Animator';
import { default as Clip } from './Clip';
export declare function getTime(): number;
interface Stage {
    update?: () => void;
}
interface AnimationOption {
    stage?: Stage;
}
/**
 * @example
 *     const animation = new Animation();
 *     const obj = {
 *         x: 100,
 *         y: 100
 *     };
 *     animation.animate(node.position)
 *         .when(1000, {
 *             x: 500,
 *             y: 500
 *         })
 *         .when(2000, {
 *             x: 100,
 *             y: 100
 *         })
 *         .start();
 */
export default class Animation extends Eventful {
    stage: Stage;
    private _head;
    private _tail;
    private _running;
    private _time;
    private _pausedTime;
    private _pauseStart;
    private _paused;
    constructor(opts?: AnimationOption);
    /**
     * Add clip
     */
    addClip(clip: Clip): void;
    /**
     * Add animator
     */
    addAnimator(animator: Animator<any>): void;
    /**
     * Delete animation clip
     */
    removeClip(clip: Clip): void;
    /**
     * Delete animation clip
     */
    removeAnimator(animator: Animator<any>): void;
    update(notTriggerFrameAndStageUpdate?: boolean): void;
    _startLoop(): void;
    /**
     * Start animation.
     */
    start(): void;
    /**
     * Stop animation.
     */
    stop(): void;
    /**
     * Pause animation.
     */
    pause(): void;
    /**
     * Resume animation.
     */
    resume(): void;
    /**
     * Clear animation.
     */
    clear(): void;
    /**
     * Whether animation finished.
     */
    isFinished(): boolean;
    /**
     * Creat animator for a target, whose props can be animated.
     */
    animate<T>(target: T, options: {
        loop?: boolean;
    }): Animator<T>;
}
export {};
