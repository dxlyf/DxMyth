// ============================================================
// AnimationTrack — 单属性动画轨道
// 对一个属性维护一组关键帧，负责在 tick 时计算当前值并写入目标
// ============================================================

import { type KeyframeConfig, type KeyframeRuntime, buildKeyframes, findKeyframeInterval } from './Keyframe'
import { interpolateValue } from './Interpolation'

export interface AnimationTrackConfig {
    /** 属性名 */
    property: string
    /** 关键帧列表 */
    keyframes: KeyframeConfig[]
    /** 目标对象 */
    target: Record<string, any>
}

export class AnimationTrack {
    /** 属性名 */
    readonly property: string
    /** 目标对象 */
    readonly target: Record<string, any>

    /** 初始值（动画开始前快照） */
    private _startValue: unknown
    /** 关键帧运行时数据 */
    private _keyframes: KeyframeRuntime[] = []
    /** 是否已准备（已调用 prepare） */
    private _prepared: boolean = false

    constructor(config: AnimationTrackConfig) {
        this.property = config.property
        this.target = config.target
        // 记录初始值
        this._startValue = config.target[config.property]
        // 构建关键帧
        if (config.keyframes.length > 0) {
            // 第一个关键帧使用当前值作为起点（如果没有 time=0 的帧）
            const kfs = [...config.keyframes]
            if (kfs[0].time > 0) {
                kfs.unshift({ time: 0, value: this._startValue })
            }
            this._keyframes = buildKeyframes(
                kfs,
                kfs[kfs.length - 1].time,
            )
        }
    }

    /** 是否有关键帧 */
    get hasKeyframes(): boolean {
        return this._keyframes.length > 0
    }

    /** 最后一个关键帧的时间（毫秒） */
    get endTime(): number {
        return this._keyframes.length > 0
            ? this._keyframes[this._keyframes.length - 1].time
            : 0
    }

    /**
     * 根据归一化进度计算并写入属性值
     * @param percent - 总动画进度 [0, 1]
     */
    tick(percent: number): void {
        const kfs = this._keyframes
        if (kfs.length === 0) return
        const [from, to, w] = findKeyframeInterval(kfs, percent)
        const value = interpolateValue(from.value, to.value, w)
        this.target[this.property] = value
    }

    /** 获取指定进度的值（不写入 target） */
    getValueAt(percent: number): unknown {
        const kfs = this._keyframes
        if (kfs.length === 0) return this._startValue
        const [from, to, w] = findKeyframeInterval(kfs, percent)
        return interpolateValue(from.value, to.value, w)
    }

    /** 重置到初始值 */
    reset(): void {
        this.target[this.property] = this._startValue
    }
}
