import { EasingFunction, EasingName } from './easing';
/** 关键帧配置 */
export interface KeyframeConfig {
    /** 关键帧到达时间（相对于动画起始，毫秒） */
    time: number;
    /** 目标值 */
    value: unknown;
    /** 本段缓动（覆盖动画级 easing） */
    easing?: EasingFunction | EasingName | [number, number, number, number];
}
/** 关键帧运行时数据 */
export interface KeyframeRuntime {
    /** 到达时间（毫秒） */
    time: number;
    /** 归一化进度 [0, 1] */
    percent: number;
    /** 目标值 */
    value: unknown;
    /** 缓动函数 */
    easingFunc: EasingFunction;
}
/**
 * 从配置创建关键帧运行时数组（已排序、已归一化 percent）
 * @param keyframes - 关键帧配置数组
 * @param totalDuration - 动画总时长（毫秒）
 */
export declare function buildKeyframes(keyframes: KeyframeConfig[], totalDuration: number): KeyframeRuntime[];
/**
 * 根据当前进度在关键帧之间查找插值区间
 * @returns [fromKf, toKf, segmentPercent]
 */
export declare function findKeyframeInterval(keyframes: KeyframeRuntime[], percent: number): [KeyframeRuntime, KeyframeRuntime, number];
