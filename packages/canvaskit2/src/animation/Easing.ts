// ============================================================
// Easing - 缓动函数集合
// 全部为纯函数：t ∈ [0, 1] → 结果 ∈ [0, 1]（部分 overshoot 函数可能超出 1）
// ============================================================

export type EasingFn = (t: number) => number

// ============ 线性 ============

export const easeLinear: EasingFn = (t) => t

// ============ 二次方 ============

export const easeInQuad: EasingFn = (t) => t * t
export const easeOutQuad: EasingFn = (t) => t * (2 - t)
export const easeInOutQuad: EasingFn = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

// ============ 三次方 ============

export const easeInCubic: EasingFn = (t) => t * t * t
export const easeOutCubic: EasingFn = (t) => --t * t * t + 1
export const easeInOutCubic: EasingFn = (t) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1

// ============ 四次方 ============

export const easeInQuart: EasingFn = (t) => t * t * t * t
export const easeOutQuart: EasingFn = (t) => 1 - --t * t * t * t
export const easeInOutQuart: EasingFn = (t) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t

// ============ 五次方 ============

export const easeInQuint: EasingFn = (t) => t * t * t * t * t
export const easeOutQuint: EasingFn = (t) => 1 + --t * t * t * t * t
export const easeInOutQuint: EasingFn = (t) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t

// ============ 正弦 ============

export const easeInSine: EasingFn = (t) => 1 - Math.cos((t * Math.PI) / 2)
export const easeOutSine: EasingFn = (t) => Math.sin((t * Math.PI) / 2)
export const easeInOutSine: EasingFn = (t) => 0.5 * (1 - Math.cos(Math.PI * t))

// ============ 指数 ============

export const easeInExpo: EasingFn = (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1)))
export const easeOutExpo: EasingFn = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))
export const easeInOutExpo: EasingFn = (t) => {
    if (t === 0) return 0
    if (t === 1) return 1
    if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10)
    return 1 - 0.5 * Math.pow(2, -20 * t + 10)
}

// ============ 圆形 ============

export const easeInCirc: EasingFn = (t) => 1 - Math.sqrt(1 - t * t)
export const easeOutCirc: EasingFn = (t) => Math.sqrt(1 - --t * t)
export const easeInOutCirc: EasingFn = (t) =>
    t < 0.5
        ? 0.5 * (1 - Math.sqrt(1 - 4 * t * t))
        : 0.5 * (Math.sqrt(1 - -2 * t * (2 - t) + 1) + 1)

// ============ 回弹（Back） ============

const BACK_CONST = 1.70158

export const easeInBack: EasingFn = (t) => t * t * ((BACK_CONST + 1) * t - BACK_CONST)
export const easeOutBack: EasingFn = (t) => --t * t * ((BACK_CONST + 1) * t + BACK_CONST) + 1
export const easeInOutBack: EasingFn = (t) => {
    const s = BACK_CONST * 1.525
    if (t < 0.5) {
        return 0.5 * (t * 2 * t * ((s + 1) * 2 * t - s))
    }
    return 0.5 * (--t * t * ((s + 1) * t + s) + 2)
}

// ============ 弹性（Elastic） ============

export const easeInElastic: EasingFn = (t) => {
    if (t === 0 || t === 1) return t
    const p = 0.3
    const s = p / 4
    return -Math.pow(2, 10 * (t - 1)) * Math.sin(((t - 1 - s) * (2 * Math.PI)) / p)
}

export const easeOutElastic: EasingFn = (t) => {
    if (t === 0 || t === 1) return t
    const p = 0.3
    const s = p / 4
    return Math.pow(2, -10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p) + 1
}

export const easeInOutElastic: EasingFn = (t) => {
    if (t === 0 || t === 1) return t
    const p = 0.45
    const s = p / 4
    if (t < 0.5) {
        return -0.5 * Math.pow(2, 10 * (2 * t - 1)) * Math.sin(((2 * t - 1 - s) * (2 * Math.PI)) / p)
    }
    return (
        0.5 * Math.pow(2, -10 * (2 * t - 1)) * Math.sin(((2 * t - 1 - s) * (2 * Math.PI)) / p) + 1
    )
}

// ============ 弹跳（Bounce） ============

export const easeOutBounce: EasingFn = (t) => {
    if (t < 1 / 2.75) {
        return 7.5625 * t * t
    } else if (t < 2 / 2.75) {
        t -= 1.5 / 2.75
        return 7.5625 * t * t + 0.75
    } else if (t < 2.5 / 2.75) {
        t -= 2.25 / 2.75
        return 7.5625 * t * t + 0.9375
    } else {
        t -= 2.625 / 2.75
        return 7.5625 * t * t + 0.984375
    }
}

export const easeInBounce: EasingFn = (t) => 1 - easeOutBounce(1 - t)

export const easeInOutBounce: EasingFn = (t) =>
    t < 0.5 ? 0.5 * easeInBounce(2 * t) : 0.5 * easeOutBounce(2 * t - 1) + 0.5

// ============ 步进 ============

/** 创建一个步进缓动：将 [0,1] 分成 steps 段，每段末尾跳到下一值 */
export function makeStep(steps: number, fromStart: boolean = false): EasingFn {
    return (t) => {
        if (t <= 0) return fromStart ? 0 : 0
        if (t >= 1) return 1
        const v = (t * steps) | 0
        return fromStart ? v / steps : (v + 1) / steps
    }
}

// ============ 集合 ============

export const Easing = {
    linear: easeLinear,
    // quad
    inQuad: easeInQuad,
    outQuad: easeOutQuad,
    inOutQuad: easeInOutQuad,
    // cubic
    inCubic: easeInCubic,
    outCubic: easeOutCubic,
    inOutCubic: easeInOutCubic,
    // quart
    inQuart: easeInQuart,
    outQuart: easeOutQuart,
    inOutQuart: easeInOutQuart,
    // quint
    inQuint: easeInQuint,
    outQuint: easeOutQuint,
    inOutQuint: easeInOutQuint,
    // sine
    inSine: easeInSine,
    outSine: easeOutSine,
    inOutSine: easeInOutSine,
    // expo
    inExpo: easeInExpo,
    outExpo: easeOutExpo,
    inOutExpo: easeInOutExpo,
    // circ
    inCirc: easeInCirc,
    outCirc: easeOutCirc,
    inOutCirc: easeInOutCirc,
    // back
    inBack: easeInBack,
    outBack: easeOutBack,
    inOutBack: easeInOutBack,
    // elastic
    inElastic: easeInElastic,
    outElastic: easeOutElastic,
    inOutElastic: easeInOutElastic,
    // bounce
    inBounce: easeInBounce,
    outBounce: easeOutBounce,
    inOutBounce: easeInOutBounce,
    // step
    step: makeStep,
}
