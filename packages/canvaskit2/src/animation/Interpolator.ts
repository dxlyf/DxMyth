// ============================================================
// Interpolator - 插值器
//
// 通用插值器接口：定义如何从 from 到 to 进行插值
// 每种数据类型可以有自己的插值器实现
// ============================================================

/** 通用插值器接口 */
export interface Interpolator<T> {
    /** 从 from 到 to，t ∈ [0,1] 进行插值 */
    interpolate(from: T, to: T, t: number): T
}

/** 数值插值器（最常用） */
export const NumberInterpolator: Interpolator<number> = {
    interpolate(from: number, to: number, t: number): number {
        return from + (to - from) * t
    },
}

/** 数组插值器工厂：逐分量线性插值（颜色等） */
export function ArrayInterpolator(len: number): Interpolator<number[]> {
    return {
        interpolate(from: number[], to: number[], t: number): number[] {
            const out = new Array(len)
            for (let i = 0; i < len; i++) {
                out[i] = from[i] + (to[i] - from[i]) * t
            }
            return out
        },
    }
}
