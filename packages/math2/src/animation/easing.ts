// ============================================================
// Easing — 缓动函数库
// 基于 tween.js 实现，支持 cubic-bezier 自定义缓动
// ============================================================

/** 缓动函数类型：输入 t∈[0,1]，输出插值后的进度 */
export type EasingFunction = (t: number) => number

/** 内置缓动名称联合类型 */
export type EasingName = keyof typeof Easing

/**
 * 内置缓动函数集合
 * 每个函数接收归一化进度 k∈[0,1]，返回缓动后的进度值
 */
export const Easing = {
    // ---- 线性 ----
    linear: (k: number): number => k,

    // ---- 二次方 (quadratic) ----
    quadraticIn: (k: number): number => k * k,
    quadraticOut: (k: number): number => k * (2 - k),
    quadraticInOut: (k: number): number => {
        if ((k *= 2) < 1) return 0.5 * k * k
        return -0.5 * (--k * (k - 2) - 1)
    },

    // ---- 三次方 (cubic) ----
    cubicIn: (k: number): number => k * k * k,
    cubicOut: (k: number): number => --k * k * k + 1,
    cubicInOut: (k: number): number => {
        if ((k *= 2) < 1) return 0.5 * k * k * k
        return 0.5 * ((k -= 2) * k * k + 2)
    },

    // ---- 四次方 (quartic) ----
    quarticIn: (k: number): number => k * k * k * k,
    quarticOut: (k: number): number => 1 - --k * k * k * k,
    quarticInOut: (k: number): number => {
        if ((k *= 2) < 1) return 0.5 * k * k * k * k
        return -0.5 * ((k -= 2) * k * k * k - 2)
    },

    // ---- 五次方 (quintic) ----
    quinticIn: (k: number): number => k * k * k * k * k,
    quinticOut: (k: number): number => --k * k * k * k * k + 1,
    quinticInOut: (k: number): number => {
        if ((k *= 2) < 1) return 0.5 * k * k * k * k * k
        return 0.5 * ((k -= 2) * k * k * k * k + 2)
    },

    // ---- 正弦 (sinusoidal) ----
    sinusoidalIn: (k: number): number => 1 - Math.cos(k * Math.PI / 2),
    sinusoidalOut: (k: number): number => Math.sin(k * Math.PI / 2),
    sinusoidalInOut: (k: number): number => 0.5 * (1 - Math.cos(Math.PI * k)),

    // ---- 指数 (exponential) ----
    exponentialIn: (k: number): number => k === 0 ? 0 : Math.pow(1024, k - 1),
    exponentialOut: (k: number): number => k === 1 ? 1 : 1 - Math.pow(2, -10 * k),
    exponentialInOut: (k: number): number => {
        if (k === 0) return 0
        if (k === 1) return 1
        if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1)
        return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2)
    },

    // ---- 圆形 (circular) ----
    circularIn: (k: number): number => 1 - Math.sqrt(1 - k * k),
    circularOut: (k: number): number => Math.sqrt(1 - --k * k),
    circularInOut: (k: number): number => {
        if ((k *= 2) < 1) return -0.5 * (Math.sqrt(1 - k * k) - 1)
        return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1)
    },

    // ---- 弹性 (elastic) ----
    elasticIn: (k: number): number => {
        if (k === 0) return 0
        if (k === 1) return 1
        const p = 0.3
        const s = p / 4
        return -Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p)
    },
    elasticOut: (k: number): number => {
        if (k === 0) return 0
        if (k === 1) return 1
        const p = 0.3
        const s = p / 4
        return Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1
    },
    elasticInOut: (k: number): number => {
        if (k === 0) return 0
        if (k === 1) return 1
        const p = 0.3 * 1.5
        const s = p / 4
        if ((k *= 2) < 1) {
            return -0.5 * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p)
        }
        return Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1
    },

    // ---- 回退 (back) ----
    backIn: (k: number): number => {
        const s = 1.70158
        return k * k * ((s + 1) * k - s)
    },
    backOut: (k: number): number => {
        const s = 1.70158
        return --k * k * ((s + 1) * k + s) + 1
    },
    backInOut: (k: number): number => {
        const s = 1.70158 * 1.525
        if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s))
        return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2)
    },

    // ---- 弹跳 (bounce) ----
    bounceIn: (k: number): number => 1 - Easing.bounceOut(1 - k),
    bounceOut: (k: number): number => {
        if (k < 1 / 2.75) return 7.5625 * k * k
        if (k < 2 / 2.75) return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75
        if (k < 2.5 / 2.75) return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375
        return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375
    },
    bounceInOut: (k: number): number => {
        if (k < 0.5) return Easing.bounceIn(k * 2) * 0.5
        return Easing.bounceOut(k * 2 - 1) * 0.5 + 0.5
    },
}

/**
 * cubic-bezier 自定义缓动函数生成器
 * 使用 Newton 迭代法采样 cubic bezier 曲线
 *
 * @param x1 - 控制点1 x ∈ [0,1]
 * @param y1 - 控制点1 y
 * @param x2 - 控制点2 x ∈ [0,1]
 * @param y2 - 控制点2 y
 * @returns 标准缓动函数 (t: number) => number
 */
export function createCubicBezierEasing(
    x1: number, y1: number, x2: number, y2: number
): EasingFunction {
    // 预计算系数
    const cx = 3 * x1
    const bx = 3 * (x2 - x1) - cx
    const ax = 1 - cx - bx
    const cy = 3 * y1
    const by = 3 * (y2 - y1) - cy
    const ay = 1 - cy - by

    const sampleCurveX = (t: number): number => ((ax * t + bx) * t + cx) * t
    const sampleCurveY = (t: number): number => ((ay * t + by) * t + cy) * t
    const sampleCurveDerivativeX = (t: number): number => (3 * ax * t + 2 * bx) * t + cx

    const solveCurveX = (x: number, epsilon: number = 1e-6): number => {
        let t0: number, t1: number, t2: number

        // 二分法找初值
        let a = 0, b = 1
        for (let i = 0; i < 8; i++) {
            t2 = (a + b) / 2
            const x2 = sampleCurveX(t2)
            if (Math.abs(x2 - x) < epsilon) return t2
            if (x > x2) a = t2
            else b = t2
        }

        // Newton 迭代精炼
        t2 = (a + b) / 2
        for (let i = 0; i < 4; i++) {
            const dx = sampleCurveDerivativeX(t2)
            if (Math.abs(dx) < 1e-8) break
            t2 -= (sampleCurveX(t2) - x) / dx
            t2 = Math.max(0, Math.min(1, t2))
        }

        return t2
    }

    return (t: number): number => {
        if (t <= 0) return 0
        if (t >= 1) return 1
        return sampleCurveY(solveCurveX(t))
    }
}

/**
 * 解析缓动参数：支持内置名称字符串 / 自定义函数 / cubic-bezier 元组
 *
 * @example
 *   resolveEasing('cubicOut')     // => Easing.cubicOut
 *   resolveEasing((t) => t * t)   // => (t) => t * t
 *   resolveEasing([0.42, 0, 1, 1])// => cubicBezier easing
 */
export function resolveEasing(
    easing: EasingFunction | EasingName | [number, number, number, number]
): EasingFunction {
    if (typeof easing === 'function') return easing
    if (typeof easing === 'string') {
        const fn = Easing[easing as EasingName]
        return fn ?? Easing.linear
    }
    if (Array.isArray(easing) && easing.length === 4) {
        return createCubicBezierEasing(easing[0], easing[1], easing[2], easing[3])
    }
    return Easing.linear
}
