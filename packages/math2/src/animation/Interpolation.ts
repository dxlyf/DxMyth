// ============================================================
// Interpolation — 值插值工具
// 支持 number / 1D Array / 2D Array / color / plain object 的插值
// ============================================================

/** 线性插值 */
export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
}

/** 对纯对象进行插值（浅层遍历） */
export function lerpObject<T extends Record<string, number>>(a: T, b: T, t: number): T {
    const result = {} as T
    for (const key in a) {
        if (Object.prototype.hasOwnProperty.call(a, key)) {
            result[key] = lerp(a[key] as number, (b[key] ?? a[key]) as number, t) as T[Extract<keyof T, string>]
        }
    }
    return result
}

/** 对一维数组进行插值 */
export function lerpArray(a: number[], b: number[], t: number, out: number[] = []): number[] {
    const len = Math.max(a.length, b.length)
    for (let i = 0; i < len; i++) {
        out[i] = lerp(a[i] ?? 0, b[i] ?? 0, t)
    }
    return out
}

/** 对二维数组进行插值 */
export function lerpArray2D(a: number[][], b: number[][], t: number, out: number[][] = []): number[][] {
    const len = Math.max(a.length, b.length)
    for (let i = 0; i < len; i++) {
        if (!out[i]) out[i] = []
        const rowA = a[i] ?? []
        const rowB = b[i] ?? []
        const rowLen = Math.max(rowA.length, rowB.length)
        for (let j = 0; j < rowLen; j++) {
            out[i][j] = lerp(rowA[j] ?? 0, rowB[j] ?? 0, t)
        }
    }
    return out
}

/**
 * 对 rgba 颜色数组进行插值
 * 颜色格式: [r, g, b, a] 各分量 0-255, alpha 0-1
 */
export function lerpColor(a: number[], b: number[], t: number, out: number[] = []): number[] {
    for (let i = 0; i < 4; i++) {
        out[i] = lerp(a[i] ?? 0, b[i] ?? 0, t)
    }
    return out
}

/** 判断值是否为数字 */
export function isNumberValue(v: unknown): v is number {
    return typeof v === 'number' && !isNaN(v)
}

/** 判断值是否为数字一维数组 */
export function isNumberArray(v: unknown): v is number[] {
    return Array.isArray(v) && v.length > 0 && typeof v[0] === 'number'
}

/** 判断值是否为数字二维数组 */
export function isNumberArray2D(v: unknown): v is number[][] {
    return Array.isArray(v) && v.length > 0 && Array.isArray(v[0]) && typeof (v[0] as number[])[0] === 'number'
}

/** 自动检测类型并进行插值 */
export function interpolateValue(a: unknown, b: unknown, t: number): unknown {
    if (isNumberValue(a) && isNumberValue(b)) {
        return lerp(a, b, t)
    }
    if (isNumberArray(a) && isNumberArray(b)) {
        return lerpArray(a, b, t)
    }
    if (isNumberArray2D(a) && isNumberArray2D(b)) {
        return lerpArray2D(a, b, t)
    }
    // 非数值类型使用离散动画
    return t < 1 ? a : b
}
