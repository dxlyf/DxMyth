// ============================================================
// Keyframe — 关键帧定义
// 借鉴 GSAP 体系，关键帧可携带独立的缓动函数
// ============================================================

import type { EasingFunction, EasingName } from './easing'
import { resolveEasing } from './easing'

/** 关键帧配置 */
export interface KeyframeConfig {
    /** 关键帧到达时间（相对于动画起始，毫秒） */
    time: number
    /** 目标值 */
    value: unknown
    /** 本段缓动（覆盖动画级 easing） */
    easing?: EasingFunction | EasingName | [number, number, number, number]
}

/** 关键帧运行时数据 */
export interface KeyframeRuntime {
    /** 到达时间（毫秒） */
    time: number
    /** 归一化进度 [0, 1] */
    percent: number
    /** 目标值 */
    value: unknown
    /** 缓动函数 */
    easingFunc: EasingFunction
}

/**
 * 从配置创建关键帧运行时数组（已排序、已归一化 percent）
 * @param keyframes - 关键帧配置数组
 * @param totalDuration - 动画总时长（毫秒）
 */
export function buildKeyframes(
    keyframes: KeyframeConfig[],
    totalDuration: number
): KeyframeRuntime[] {
    if (keyframes.length === 0) return []

    // 排序
    const sorted = [...keyframes].sort((a, b) => a.time - b.time)

    // 确保包含起点
    if (sorted[0].time > 0) {
        sorted.unshift({ time: 0, value: sorted[0].value, easing: sorted[0].easing })
    }

    const result: KeyframeRuntime[] = sorted.map((kf) => ({
        time: kf.time,
        percent: totalDuration > 0 ? Math.min(kf.time / totalDuration, 1) : 0,
        value: kf.value,
        easingFunc: resolveEasing(kf.easing ?? 'linear'),
    }))

    return result
}

/**
 * 根据当前进度在关键帧之间查找插值区间
 * @returns [fromKf, toKf, segmentPercent]
 */
export function findKeyframeInterval(
    keyframes: KeyframeRuntime[],
    percent: number
): [KeyframeRuntime, KeyframeRuntime, number] {
    const len = keyframes.length
    if (len === 0) throw new Error('No keyframes')
    if (len === 1) return [keyframes[0], keyframes[0], 1]

    // 夹在范围内
    if (percent <= keyframes[0].percent) {
        return [keyframes[0], keyframes[0], 0]
    }
    if (percent >= keyframes[len - 1].percent) {
        return [keyframes[len - 1], keyframes[len - 1], 1]
    }

    // 二分查找
    let lo = 0, hi = len - 1
    while (lo < hi - 1) {
        const mid = (lo + hi) >> 1
        if (keyframes[mid].percent <= percent) lo = mid
        else hi = mid
    }

    const from = keyframes[lo]
    const to = keyframes[hi]
    const range = to.percent - from.percent
    const w = range > 0 ? (percent - from.percent) / range : 0
    // 使用 to 的缓动函数
    const easedW = to.easingFunc(Math.min(Math.max(w, 0), 1))

    return [from, to, easedW]
}
