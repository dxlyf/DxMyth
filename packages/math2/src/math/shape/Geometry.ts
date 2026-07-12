// ============================================================
// Geometry - 几何图形基类
// 提供面积、重心、中心点、周长、包含判断、描边命中等通用接口
// 性能要点：
//   - 公开可变字段，避免闭包与访问器开销
//   - 距离比较优先使用平方距离，避免 sqrt
//   - 中心点/重心支持 out 参数复用，避免分配
// ============================================================

import { BoundingRect } from '../BoundingRect'

/** 描边对齐方式 */
export type StrokeAlign = 'inner' | 'outer' | 'center'

/** 输出点（避免分配） */
export interface PointOut {
    x: number
    y: number
}

const EPS = 1e-9

export abstract class Geometry {
    /** 面积 */
    abstract area(): number

    /** 重心（几何形心，面积加权） */
    abstract centroid(out?: PointOut): PointOut

    /** 中心点（包围盒中心） */
    abstract center(out?: PointOut): PointOut

    /** 周长（边界总长度，开放曲线为曲线长度） */
    abstract perimeter(): number

    /** 点是否在图形内部（不含边界） */
    abstract contains(x: number, y: number): boolean

    /**
     * 点到边界的带符号距离
     * @returns 内部为正（到最近边界距离），外部为负，边界上为 0
     */
    abstract signedDistance(x: number, y: number): number

    /** 轴对齐包围盒（就地写入 out，避免分配） */
    abstract bounds(out?: BoundingRect): BoundingRect

    /** 点是否在边界上（epsilon 容差，无宽度） */
    isPointOnBoundary(x: number, y: number, epsilon: number = EPS): boolean {
        return Math.abs(this.signedDistance(x, y)) <= epsilon
    }

    /**
     * 点是否在描边带内
     * - center: 描边以边界为中心，内外各 lineWidth/2
     * - inner : 描边向内偏移，整条宽度位于图形内部一侧
     * - outer : 描边向外偏移，整条宽度位于图形外部一侧
     */
    isPointOnStroke(
        x: number,
        y: number,
        lineWidth: number,
        strokeAlign: StrokeAlign = 'center'
    ): boolean {
        const d = this.signedDistance(x, y)
        const half = lineWidth * 0.5
        switch (strokeAlign) {
            case 'center':
                return Math.abs(d) <= half
            case 'inner':
                return d >= 0 && d <= lineWidth
            case 'outer':
                return d <= 0 && d >= -lineWidth
        }
        return false
    }
}

// ============================================================
// 共享工具函数 - 不导出，仅供本目录内类使用
// ============================================================

/**
 * 点到线段的最近距离（无符号）
 * 算法：投影参数 t = clamp(dot(p-a, b-a)/|b-a|², 0, 1)，最近点 = a + t*(b-a)
 */
export function distPointToSegment(
    px: number, py: number,
    ax: number, ay: number,
    bx: number, by: number
): number {
    const abx = bx - ax
    const aby = by - ay
    const apx = px - ax
    const apy = py - ay
    const ab2 = abx * abx + aby * aby
    let t = ab2 > 0 ? (apx * abx + apy * aby) / ab2 : 0
    if (t < 0) t = 0
    else if (t > 1) t = 1
    const cx = ax + t * abx
    const cy = ay + t * aby
    const dx = px - cx
    const dy = py - cy
    return Math.sqrt(dx * dx + dy * dy)
}

/**
 * 点到线段的平方距离（避免 sqrt，用于比较）
 */
export function distPointToSegmentSquared(
    px: number, py: number,
    ax: number, ay: number,
    bx: number, by: number
): number {
    const abx = bx - ax
    const aby = by - ay
    const apx = px - ax
    const apy = py - ay
    const ab2 = abx * abx + aby * aby
    let t = ab2 > 0 ? (apx * abx + apy * aby) / ab2 : 0
    if (t < 0) t = 0
    else if (t > 1) t = 1
    const cx = ax + t * abx
    const cy = ay + t * aby
    const dx = px - cx
    const dy = py - cy
    return dx * dx + dy * dy
}

/**
 * 点到线段的带符号距离
 * 符号由线段方向决定：点在线段左侧（逆时针方向）为正，右侧为负
 * 注意：此处符号基于法线方向，与封闭区域的 inside/outside 含义不同
 */
export function signedDistPointToLine(
    px: number, py: number,
    ax: number, ay: number,
    bx: number, by: number
): number {
    const abx = bx - ax
    const aby = by - ay
    const apx = px - ax
    const apy = py - ay
    const ab2 = abx * abx + aby * aby
    let t = ab2 > 0 ? (apx * abx + apy * aby) / ab2 : 0
    if (t < 0) t = 0
    else if (t > 1) t = 1
    const cx = ax + t * abx
    const cy = ay + t * aby
    const dx = px - cx
    const dy = py - cy
    // 法线方向（左侧为正）：(-aby, abx)
    const sign = (abx * apy - aby * apx) >= 0 ? 1 : -1
    return sign * Math.sqrt(dx * dx + dy * dy)
}

/** 角度归一化到 [0, 2π) */
export function normalizeAnglePositive(a: number): number {
    const TAU = Math.PI * 2
    let r = a % TAU
    if (r < 0) r += TAU
    return r
}

/** 判断角度 angle 是否在 [start, end]（按 ccw 方向）范围内 */
export function isAngleInRange(
    angle: number,
    start: number,
    end: number,
    ccw: boolean
): boolean {
    const TAU = Math.PI * 2
    let s = normalizeAnglePositive(start)
    let e = normalizeAnglePositive(end)
    let a = normalizeAnglePositive(angle)
    if (!ccw) {
        // 顺时针：交换 start/end，按 ccw 处理
        const t = s
        s = e
        e = t
    }
    if (s <= e) {
        return a >= s - 1e-9 && a <= e + 1e-9
    }
    // 跨越 0
    return a >= s - 1e-9 || a <= e + 1e-9
}

/** 两个角度之间的最短角度差（绝对值） */
export function angleDelta(a: number, b: number): number {
    const TAU = Math.PI * 2
    let d = (b - a) % TAU
    if (d < -Math.PI) d += TAU
    else if (d > Math.PI) d -= TAU
    return Math.abs(d)
}
