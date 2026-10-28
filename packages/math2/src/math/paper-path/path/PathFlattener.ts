/**
 * 移植自 paper/src/path/PathFlattener.js，只保留几何核心。
 *
 * 把曲线按允许的最大误差递归细分成长度接近的直线段，建立「曲线参数 → 路径
 * 偏移」的查找表，用来按弧长高效地取点/切线/法线/曲率。
 *
 * 原文用 `Base.each(Curve._evaluateMethods, ...)` 动态生成 `*At` 方法，这里
 * 六个方法都显式写出。
 */

import { Point } from '../basic/Point';
import { Curve } from './Curve';
import type { Matrix } from '../basic/Matrix';
import type { Path } from './Path';

/** 展平表里的一段。 */
interface FlattenedPart {
    /** 从路径起点到该段末端的累计长度。 */
    offset: number;
    /** 该段的曲线 values。 */
    curve: number[];
    /** 段所属曲线的下标。 */
    index: number;
    /** 段末端的 curve-time。 */
    time: number;
    /** 该段是否是一条直线。 */
    isStraight: boolean;
}

export class PathFlattener {
    /** 每一条曲线的 values。 */
    curves: number[][] = [];
    /** 细分后的段表。 */
    parts: FlattenedPart[] = [];
    /** 路径总长度。 */
    length = 0;
    /** 上次查询所在的段下标，用于迭代式使用的优化。 */
    index = 0;

    /**
     * @param path 要展平的路径
     * @param flatness 直线允许偏离曲线的最大误差，默认 0.25
     * @param maxRecursion 细分的最多递归次数，默认 32
     * @param ignoreStraight 为真时不细分直线段（只关心展平结果时用）
     * @param matrix 可选变换矩阵，不修改原路径
     */
    constructor(path: Path, flatness?: number, maxRecursion?: number,
            ignoreStraight?: boolean, matrix?: Matrix) {
        // 不依赖 path.curves，只用 segments 并据此取曲线 values。
        const curves: number[][] = [],
            parts: FlattenedPart[] = [],
            // 默认最多细分 32 次。
            minSpan = 1 / (maxRecursion || 32),
            segments = path._segments;
        let length = 0,
            segment1 = segments[0],
            segment2;

        const addCurve = (segment1: any, segment2: any): void => {
            const curve = Curve.getValues(segment1, segment2, matrix);
            curves.push(curve);
            computeParts(curve, segment1._index, 0, 1);
        };

        const computeParts = (curve: number[], index: number, t1: number,
                t2: number): void => {
            // t 跨度足够大时才继续细分。
            if ((t2 - t1) > minSpan
                    && !(ignoreStraight && Curve.isStraight(curve))
                    // 经过大量测试，默认容差 0.25 在速度与精度之间比较平衡。
                    && !Curve.isFlatEnough(curve, flatness || 0.25)) {
                const halves = Curve.subdivide(curve, 0.5),
                    tMid = (t1 + t2) / 2;
                // 递归细分并重新计算分段。
                computeParts(halves[0], index, t1, tMid);
                computeParts(halves[1], index, tMid, t2);
            } else {
                // 把曲线当作直线，计算该段长度。
                const dx = curve[6] - curve[0],
                    dy = curve[7] - curve[1],
                    dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 0) {
                    length += dist;
                    parts.push({
                        offset: length,
                        curve: curve,
                        index: index,
                        time: t2,
                        // 直线段的 curve-time 不跟随长度，见 _get()。
                        isStraight: Curve.isStraight(curve)
                    });
                }
            }
        };

        for (let i = 1, l = segments.length; i < l; i++) {
            segment2 = segments[i];
            addCurve(segment1, segment2);
            segment1 = segment2;
        }
        if (path._closed)
            addCurve(segment2 || segment1, segments[0]);
        this.curves = curves;
        this.parts = parts;
        this.length = length;
        // 记录上次查询所在的段，便于迭代式使用。
        this.index = 0;
    }

    /** 找到偏移量所在的分段，并插值出曲线参数。 */
    _get(offset: number): { index: number; time: number } {
        const parts = this.parts,
            length = parts.length;
        let start: number, i: number, j = this.index;
        // 确保不会已经越过目标偏移:先向前回退到起点之前。
        for (;;) {
            i = j;
            if (!j || parts[--j].offset < offset)
                break;
        }
        // 找到第一个终点超过该偏移的分段，再与上一段做线性插值。
        for (; i < length; i++) {
            const part = parts[i];
            if (part.offset >= offset) {
                // 找到正确的分段，记住当前位置。
                this.index = i;
                // 取上一段以便对曲线参数做线性插值。
                const prev = parts[i - 1],
                    // 只有同一曲线上的上一段才使用它的参数值，否则用 0。
                    prevTime = prev && prev.index === part.index ? prev.time : 0,
                    prevOffset = prev ? prev.offset : 0;
                let factor = (offset - prevOffset) / (part.offset - prevOffset);
                if (part.isStraight) {
                    // 该段是直线，其 time 对应直线上该位置的点。
                    const v = part.curve;
                    factor = Curve.getTimeOf(v, new Point(
                            v[0] + (v[6] - v[0]) * factor,
                            v[1] + (v[7] - v[1]) * factor)) as number;
                }
                return {
                    index: part.index,
                    // 插值。
                    time: prevTime + (part.time - prevTime) * factor
                };
            }
        }
        // 走到这里说明超出了范围，返回最后一段。
        return {
            index: parts[length - 1].index,
            time: 1
        };
    }

    /** 偏移处的点。 */
    getPointAt(offset: number): Point | null {
        const param = this._get(offset);
        return Curve.getPoint(this.curves[param.index], param.time);
    }

    /** 偏移处的切线。 */
    getTangentAt(offset: number): Point | null {
        const param = this._get(offset);
        return Curve.getTangent(this.curves[param.index], param.time);
    }

    /** 偏移处的法线。 */
    getNormalAt(offset: number): Point | null {
        const param = this._get(offset);
        return Curve.getNormal(this.curves[param.index], param.time);
    }

    /** 偏移处按曲线速度加权的切线。 */
    getWeightedTangentAt(offset: number): Point | null {
        const param = this._get(offset);
        return Curve.getWeightedTangent(this.curves[param.index], param.time);
    }

    /** 偏移处按曲线速度加权的法线。 */
    getWeightedNormalAt(offset: number): Point | null {
        const param = this._get(offset);
        return Curve.getWeightedNormal(this.curves[param.index], param.time);
    }

    /** 偏移处的曲率。 */
    getCurvatureAt(offset: number): number {
        const param = this._get(offset);
        return Curve.getCurvature(this.curves[param.index], param.time);
    }
}
