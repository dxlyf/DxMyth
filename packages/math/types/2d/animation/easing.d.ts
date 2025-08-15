/**
 * 缓动代码来自 https://github.com/sole/tween.js/blob/master/src/Tween.js
 * @see http://sole.github.io/tween.js/examples/03_graphs.html
 * @exports zrender/animation/easing
 */
type easingFunc = (percent: number) => number;
export type AnimationEasing = keyof typeof easingFuncs | easingFunc;
declare const easingFuncs: {
    /**
    * @param {number} k
    * @return {number}
    */
    linear(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    quadraticIn(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    quadraticOut(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    quadraticInOut(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    cubicIn(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    cubicOut(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    cubicInOut(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    quarticIn(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    quarticOut(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    quarticInOut(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    quinticIn(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    quinticOut(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    quinticInOut(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    sinusoidalIn(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    sinusoidalOut(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    sinusoidalInOut(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    exponentialIn(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    exponentialOut(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    exponentialInOut(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    circularIn(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    circularOut(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    circularInOut(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    elasticIn(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    elasticOut(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    elasticInOut(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    backIn(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    backOut(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    backInOut(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    bounceIn(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    bounceOut(k: number): number;
    /**
    * @param {number} k
    * @return {number}
    */
    bounceInOut(k: number): number;
};
export default easingFuncs;
