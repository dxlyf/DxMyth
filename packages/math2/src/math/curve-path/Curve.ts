// ============================================================
// Curve — 解析曲线抽象基类（2D/3D），提供插值、弧长、切线等能力
// 移植自 three.js extras/core/Curve.js
// ============================================================

import { clamp } from '../MathUtils'
import { Vector2 } from '../Vector2'
import { Vector3 } from '../Vector3'
import { Matrix4 } from '../Matrix4'

/** 曲线序列化 JSON 结构（宽松类型） */
export interface CurveJSON {
    metadata?: { version: number; type: string; generator: string }
    arcLengthDivisions?: number
    type?: string
    [key: string]: any
}

/** 曲线采样点类型：2D 或 3D 向量 */
export type CurvePoint = Vector2 | Vector3

// ---- 曲线点通用辅助（Vector2 / Vector3 共用方法，避免联合类型方法签名冲突） ----

/** 判断曲线点是否为 2D 向量 */
export function isVector2Point(p: CurvePoint): boolean {
    return (p as Vector2).isVector2 === true
}

/** 两个曲线点之间的距离（自动适配 2D/3D） */
export function pointDistance(a: CurvePoint, b: CurvePoint): number {
    if (isVector2Point(a)) {
        return (a as Vector2).distanceTo(b as Vector2)
    }
    return (a as Vector3).distanceTo(b as Vector3)
}

/** 两个曲线点是否相等（自动适配 2D/3D） */
export function pointEquals(a: CurvePoint, b: CurvePoint): boolean {
    if (isVector2Point(a)) {
        return (a as Vector2).equals(b as Vector2)
    }
    return (a as Vector3).equals(b as Vector3)
}

/**
 * 解析曲线抽象基类。
 * 通过泛型 T 约束曲线所在空间的向量类型（Vector2 / Vector3）。
 */
export abstract class Curve<T extends CurvePoint = CurvePoint> {
    type: string = 'Curve'

    /** 计算累计段长时使用的细分数量 */
    arcLengthDivisions = 200

    /** 曲线参数变化时必须设为 true，用于使弧长缓存失效 */
    needsUpdate = false

    /** 预计算的累计弧长缓存 */
    cacheArcLengths: number[] | null = null

    // ---- 类型标记（供 CurvePath 等做运行时类型判断） ----
    isEllipseCurve?: boolean
    isLineCurve?: boolean
    isLineCurve3?: boolean
    isSplineCurve?: boolean
    isCatmullRomCurve3?: boolean
    /** SplineCurve / CatmullRomCurve3 的控制点 */
    points?: T[]

    /**
     * 返回曲线上参数 t 处的点。
     * @param t 插值因子，范围 [0,1]
     * @param optionalTarget 可选的目标向量（结果写入其中）
     */
    abstract getPoint(t: number, optionalTarget?: T): T

    /**
     * 按弧长等距采样：先做 u→t 映射，再求点。
     * @param u 插值因子，范围 [0,1]
     */
    getPointAt(u: number, optionalTarget?: T): T {
        const t = this.getUtoTmapping(u)
        return this.getPoint(t, optionalTarget)
    }

    /**
     * 通过 getPoint 采样曲线，返回曲线形状的点数组。
     * @param divisions 细分数量，返回点数 = divisions + 1
     */
    getPoints(divisions = 5): T[] {
        const points: T[] = []
        for (let d = 0; d <= divisions; d++) {
            points.push(this.getPoint(d / divisions))
        }
        return points
    }

    /**
     * 返回 getPoints 采样时的细分数量。
     * 默认直接返回 divisions，子类按自身类型覆盖（如直线返回 1、椭圆加倍）。
     */
    getResolution(divisions: number): number {
        return divisions
    }

    /**
     * 通过 getPointAt 采样曲线，返回等弧长间隔的点数组。
     * @param divisions 细分数量，返回点数 = divisions + 1
     */
    getSpacedPoints(divisions = 5): T[] {
        const points: T[] = []
        for (let d = 0; d <= divisions; d++) {
            points.push(this.getPointAt(d / divisions))
        }
        return points
    }

    /** 返回曲线总弧长 */
    getLength(): number {
        const lengths = this.getLengths()
        return lengths[lengths.length - 1]
    }

    /**
     * 返回累计段长数组。
     * @param divisions 细分数量，默认 this.arcLengthDivisions
     */
    getLengths(divisions: number = this.arcLengthDivisions): number[] {
        if (this.cacheArcLengths &&
            (this.cacheArcLengths.length === divisions + 1) &&
            !this.needsUpdate) {
            return this.cacheArcLengths
        }

        this.needsUpdate = false

        const cache: number[] = []
        let current: T
        let last: T = this.getPoint(0)
        let sum = 0

        cache.push(0)

        for (let p = 1; p <= divisions; p++) {
            current = this.getPoint(p / divisions)
            sum += pointDistance(current, last)
            cache.push(sum)
            last = current
        }

        this.cacheArcLengths = cache
        return cache
    }

    /**
     * 使累计段长缓存失效并重算。曲线参数每次变化后都应调用。
     */
    updateArcLengths(): void {
        this.needsUpdate = true
        this.getLengths()
    }

    /**
     * 将弧长参数 u（或给定距离 distance）映射为参数 t，用于等距采样。
     * @param u 插值因子，范围 [0,1]
     * @param distance 可选的曲线上距离
     */
    getUtoTmapping(u: number, distance: number | null = null): number {
        const arcLengths = this.getLengths()

        let i = 0
        const il = arcLengths.length

        let targetArcLength: number
        if (distance) {
            targetArcLength = distance
        } else {
            targetArcLength = u * arcLengths[il - 1]
        }

        // 二分查找：小于目标弧长的最大下标
        let low = 0
        let high = il - 1
        let comparison: number

        while (low <= high) {
            i = Math.floor(low + (high - low) / 2)
            comparison = arcLengths[i] - targetArcLength

            if (comparison < 0) {
                low = i + 1
            } else if (comparison > 0) {
                high = i - 1
            } else {
                high = i
                break
            }
        }

        i = high

        if (arcLengths[i] === targetArcLength) {
            return i / (il - 1)
        }

        // 在前后两点之间做线性插值
        const lengthBefore = arcLengths[i]
        const lengthAfter = arcLengths[i + 1]

        const segmentLength = lengthAfter - lengthBefore
        const segmentFraction = (targetArcLength - lengthBefore) / segmentLength

        const t = (i + segmentFraction) / (il - 1)
        return t
    }

    /**
     * 返回参数 t 处的单位切向量。
     * 若子类未实现解析切线，则用相邻两点差分近似。
     */
    getTangent(t: number, optionalTarget?: T): T {
        const delta = 0.0001
        let t1 = t - delta
        let t2 = t + delta

        if (t1 < 0) t1 = 0
        if (t2 > 1) t2 = 1

        const pt1 = this.getPoint(t1)
        const pt2 = this.getPoint(t2)

        const tangent: T = optionalTarget ?? ((isVector2Point(pt1) ? new Vector2() : new Vector3()) as T)

        if (isVector2Point(tangent)) {
            (tangent as Vector2).copy(pt2 as Vector2).subtract(pt1 as Vector2).normalize()
        } else {
            (tangent as Vector3).copy(pt2 as Vector3).subtract(pt1 as Vector3).normalize()
        }

        return tangent
    }

    /** 等弧长采样版本的 getTangent */
    getTangentAt(u: number, optionalTarget?: T): T {
        const t = this.getUtoTmapping(u)
        return this.getTangent(t, optionalTarget)
    }

    /**
     * 生成 Frenet 标架（需 3D 曲线），用于 TubeGeometry / ExtrudeGeometry。
     * @param segments 段数
     * @param closed 是否闭合
     */
    computeFrenetFrames(segments: number, closed = false): { tangents: Vector3[]; normals: Vector3[]; binormals: Vector3[] } {
        // see http://www.cs.indiana.edu/pub/techreports/TR425.pdf

        const normal = new Vector3()

        const tangents: Vector3[] = []
        const normals: Vector3[] = []
        const binormals: Vector3[] = []

        const vec = new Vector3()

        // 逐段计算切向量
        for (let i = 0; i <= segments; i++) {
            const u = i / segments
            tangents[i] = this.getTangentAt(u, new Vector3() as T) as Vector3
        }

        // 选择与首切向量垂直、且沿最小切向量分量方向的初始法向量
        normals[0] = new Vector3()
        binormals[0] = new Vector3()
        let min = Number.MAX_VALUE
        const tx = Math.abs(tangents[0].x)
        const ty = Math.abs(tangents[0].y)
        const tz = Math.abs(tangents[0].z)

        if (tx <= min) {
            min = tx
            normal.set(1, 0, 0)
        }
        if (ty <= min) {
            min = ty
            normal.set(0, 1, 0)
        }
        if (tz <= min) {
            normal.set(0, 0, 1)
        }

        Vector3.cross(vec, tangents[0], normal).normalize()

        Vector3.cross(normals[0], tangents[0], vec)
        Vector3.cross(binormals[0], tangents[0], normals[0])

        // 逐段计算缓变的法向量与副法向量
        for (let i = 1; i <= segments; i++) {
            normals[i] = normals[i - 1].clone()
            binormals[i] = binormals[i - 1].clone()

            Vector3.cross(vec, tangents[i - 1], tangents[i])

            if (vec.magnitude() > Number.EPSILON) {
                vec.normalize()

                const theta = Math.acos(clamp(tangents[i - 1].dot(tangents[i]), -1, 1)) // 浮点误差保护
                normals[i].applyMatrix4(Matrix4.fromRotation(vec, theta))
            }

            Vector3.cross(binormals[i], tangents[i], normals[i])
        }

        // 闭合曲线：修正首尾法向量
        if (closed === true) {
            let theta = Math.acos(clamp(normals[0].dot(normals[segments]), -1, 1))
            theta /= segments

            Vector3.cross(vec, normals[0], normals[segments])
            if (tangents[0].dot(vec) > 0) {
                theta = -theta
            }

            for (let i = 1; i <= segments; i++) {
                // 轻微扭转
                normals[i].applyMatrix4(Matrix4.fromRotation(tangents[i], theta * i))
                Vector3.cross(binormals[i], tangents[i], normals[i])
            }
        }

        return {
            tangents: tangents,
            normals: normals,
            binormals: binormals
        }
    }

    /** 返回当前曲线副本 */
    clone(): this {
        const Ctor = this.constructor as new () => this
        return new Ctor().copy(this)
    }

    /** 将 source 的值复制到当前曲线 */
    copy(source: Curve<T>): this {
        this.arcLengthDivisions = source.arcLengthDivisions
        return this
    }

    /** 序列化为 JSON */
    toJSON(): CurveJSON {
        const data: CurveJSON = {
            metadata: {
                version: 4.7,
                type: 'Curve',
                generator: 'Curve.toJSON'
            }
        }

        data.arcLengthDivisions = this.arcLengthDivisions
        data.type = this.type

        return data
    }

    /** 从 JSON 反序列化 */
    fromJSON(json: CurveJSON): this {
        this.arcLengthDivisions = json.arcLengthDivisions ?? this.arcLengthDivisions
        return this
    }
}
