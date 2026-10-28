/**
 * 移植自 paper/src/path/PathFitter.js，只保留几何核心。
 *
 * 基于 Philip J. Schneider 的 "An Algorithm for Automatically Fitting Digitized
 * Curves"（Graphics Gems, 1990），由 Jürg Lehni 做了修改与优化。用最少的
 * 三次贝塞尔曲线拟合一组点，`fit()` 返回新的 `Segment[]`。
 */

import { Point } from '../basic/Point';
import { Numerical } from '../util/Numerical';
import { Segment } from './Segment';
import type { Path } from './Path';

export class PathFitter {
    /** 参与拟合的点（已去掉相邻重复点）。 */
    points: Point[] = [];
    /** 原路径是否闭合。 */
    closed: boolean;

    constructor(path: Path) {
        const points = this.points,
            segments = path._segments,
            closed = path._closed;
        // 复制路径上的点，并去掉相邻的重复点。
        let prev: Point | undefined;
        for (let i = 0, l = segments.length; i < l; i++) {
            const point = segments[i].point;
            if (!prev || !prev.equals(point)) {
                points.push(prev = point.clone());
            }
        }
        // 简化闭合路径时，需要把首尾点各复制一份。
        if (closed) {
            points.unshift(points[points.length - 1]);
            points.push(points[1]); // 原来下标 0 的点现在在 1。
        }
        this.closed = closed;
    }

    /** 按给定误差拟合，返回新的 segment 数组（没有点时返回 `null`）。 */
    fit(error?: number): Segment[] | null {
        const points = this.points,
            length = points.length;
        let segments: Segment[] | null = null;
        if (length > 0) {
            // 支持把多个重合点简化为一个 segment。
            segments = [new Segment(points[0])];
            if (length > 1) {
                this.fitCubic(segments, error as number, 0, length - 1,
                        // 左切线
                        points[1].subtract(points[0]),
                        // 右切线
                        points[length - 2].subtract(points[length - 1]));
                // 闭合路径要把复制出来的首尾 segment 再去掉。
                if (this.closed) {
                    segments.shift();
                    segments.pop();
                }
            }
        }
        return segments;
    }

    /** 对一组点拟合一段贝塞尔曲线。 */
    fitCubic(segments: Segment[], error: number, first: number, last: number,
            tan1: Point, tan2: Point): void {
        const points = this.points;
        // 若区间里只有两个点，用启发式方法。
        if (last - first === 1) {
            const pt1 = points[first],
                pt2 = points[last],
                dist = pt1.getDistance(pt2) / 3;
            this.addCurve(segments, [pt1, pt1.add(tan1.normalize(dist)),
                    pt2.add(tan2.normalize(dist)), pt2]);
            return;
        }
        // 对点做参数化，然后尝试拟合曲线。
        const uPrime = this.chordLengthParameterize(first, last);
        let maxError = Math.max(error, error * error),
            split: number,
            parametersInOrder = true;
        // 尝试 4 次迭代。
        for (let i = 0; i <= 4; i++) {
            const curve = this.generateBezier(first, last, uPrime, tan1, tan2);
            // 找出点与拟合曲线之间的最大偏差。
            const max = this.findMaxError(first, last, curve, uPrime);
            if (max.error < error && parametersInOrder) {
                this.addCurve(segments, curve);
                return;
            }
            split = max.index;
            // 误差不算太大时，尝试重新参数化并继续迭代。
            if (max.error >= maxError)
                break;
            parametersInOrder = this.reparameterize(first, last, uPrime, curve);
            maxError = max.error;
        }
        // 拟合失败:在误差最大处切开，递归拟合。
        const tanCenter = points[split! - 1].subtract(points[split! + 1]);
        this.fitCubic(segments, error, first, split!, tan1, tanCenter);
        this.fitCubic(segments, error, split!, last, tanCenter.negate(), tan2);
    }

    /** 把一段拟合结果追加为 segment。 */
    addCurve(segments: Segment[], curve: Point[]): void {
        const prev = segments[segments.length - 1];
        prev.handleOut = curve[1].subtract(curve[0]);
        segments.push(new Segment(curve[3], curve[2].subtract(curve[3])));
    }

    /** 用最小二乘法求该区间贝塞尔曲线的控制点。 */
    generateBezier(first: number, last: number, uPrime: number[], tan1: Point,
            tan2: Point): Point[] {
        const epsilon = Numerical.EPSILON,
            abs = Math.abs,
            points = this.points,
            pt1 = points[first],
            pt2 = points[last],
            // 构造 C 与 X 矩阵。
            C = [[0, 0], [0, 0]],
            X = [0, 0];

        for (let i = 0, l = last - first + 1; i < l; i++) {
            const u = uPrime[i],
                t = 1 - u,
                b = 3 * u * t,
                b0 = t * t * t,
                b1 = b * t,
                b2 = b * u,
                b3 = u * u * u,
                a1 = tan1.normalize(b1),
                a2 = tan2.normalize(b2),
                tmp = points[first + i]
                    .subtract(pt1.multiply(b0 + b1))
                    .subtract(pt2.multiply(b2 + b3));
            C[0][0] += a1.dot(a1);
            C[0][1] += a1.dot(a2);
            // C[1][0] += a1.dot(a2);
            C[1][0] = C[0][1];
            C[1][1] += a2.dot(a2);
            X[0] += a1.dot(tmp);
            X[1] += a2.dot(tmp);
        }

        // 计算 C 与 X 的行列式。
        const detC0C1 = C[0][0] * C[1][1] - C[1][0] * C[0][1];
        let alpha1: number,
            alpha2: number;
        if (abs(detC0C1) > epsilon) {
            // 克拉默法则
            const detC0X = C[0][0] * X[1] - C[1][0] * X[0],
                detXC1 = X[0] * C[1][1] - X[1] * C[0][1];
            // 求出 alpha 值
            alpha1 = detXC1 / detC0C1;
            alpha2 = detC0X / detC0C1;
        } else {
            // 矩阵欠定，假设 alpha1 == alpha2
            const c0 = C[0][0] + C[0][1],
                c1 = C[1][0] + C[1][1];
            alpha1 = alpha2 = abs(c0) > epsilon ? X[0] / c0
                            : abs(c1) > epsilon ? X[1] / c1
                            : 0;
        }

        // alpha 为负时退回 Wu/Barsky 启发式（见原文）。（alpha 为 0 会产生重合
        // 的控制点，导致后续 NewtonRaphsonRootFind() 除零。）
        const segLength = pt2.getDistance(pt1),
            eps = epsilon * segLength;
        let handle1: Point | null = null,
            handle2: Point | null = null;
        if (alpha1 < eps || alpha2 < eps) {
            // 退回标准（通常不精确）的公式，必要时继续细分。
            alpha1 = alpha2 = segLength / 3;
        } else {
            // 检查求出的控制点投影到 pt1-pt2 连线上时顺序是否正确。
            const line = pt2.subtract(pt1);
            // 控制点 1、2 分别沿左右切线方向偏移 alpha 距离。
            handle1 = tan1.normalize(alpha1);
            handle2 = tan2.normalize(alpha2);
            if (handle1.dot(line) - handle2.dot(line) > segLength * segLength) {
                // 退回上面的 Wu/Barsky 启发式。
                alpha1 = alpha2 = segLength / 3;
                handle1 = handle2 = null; // 强制重新计算
            }
        }

        // 贝塞尔曲线的首尾控制点正好落在首尾数据点上。
        return [pt1,
                pt1.add(handle1 || tan1.normalize(alpha1)),
                pt2.add(handle2 || tan2.normalize(alpha2)),
                pt2];
    }

    /** 用给定参数化拟合后，尝试找出更好的参数化。 */
    reparameterize(first: number, last: number, u: number[],
            curve: Point[]): boolean {
        for (let i = first; i <= last; i++) {
            u[i - first] = this.findRoot(curve, this.points[i], u[i - first]);
        }
        // 检测新的参数化是否打乱了点的顺序。若是，则会把点按错误顺序拟合。
        for (let i = 1, l = u.length; i < l; i++) {
            if (u[i] <= u[i - 1])
                return false;
        }
        return true;
    }

    /** 用牛顿-拉夫逊迭代求更好的根。 */
    findRoot(curve: Point[], point: Point, u: number): number {
        const curve1: Point[] = [],
            curve2: Point[] = [];
        // 生成 Q' 的控制点
        for (let i = 0; i <= 2; i++) {
            curve1[i] = curve[i + 1].subtract(curve[i]).multiply(3);
        }
        // 生成 Q'' 的控制点
        for (let i = 0; i <= 1; i++) {
            curve2[i] = curve1[i + 1].subtract(curve1[i]).multiply(2);
        }
        // 计算 Q(u)、Q'(u) 和 Q''(u)
        const pt = this.evaluate(3, curve, u),
            pt1 = this.evaluate(2, curve1, u),
            pt2 = this.evaluate(1, curve2, u),
            diff = pt.subtract(point),
            df = pt1.dot(pt1) + diff.dot(pt2);
        // u = u - f(u) / f'(u)
        return Numerical.isMachineZero(df) ? u : u - diff.dot(pt1) / df;
    }

    /** 在给定参数处求贝塞尔曲线的值。 */
    evaluate(degree: number, curve: Point[], t: number): Point {
        // 复制数组
        const tmp = curve.slice();
        // 三角形计算
        for (let i = 1; i <= degree; i++) {
            for (let j = 0; j <= degree - i; j++) {
                tmp[j] = tmp[j].multiply(1 - t).add(tmp[j + 1].multiply(t));
            }
        }
        return tmp[0];
    }

    /** 用相邻点之间的相对距离给点分配参数值。 */
    chordLengthParameterize(first: number, last: number): number[] {
        const u = [0];
        for (let i = first + 1; i <= last; i++) {
            u[i - first] = u[i - first - 1]
                    + this.points[i].getDistance(this.points[i - 1]);
        }
        for (let i = 1, m = last - first; i <= m; i++) {
            u[i] /= u[m];
        }
        return u;
    }

    /** 找出拟合曲线与数据点之间的最大平方距离。 */
    findMaxError(first: number, last: number, curve: Point[],
            u: number[]): { error: number; index: number } {
        let index = Math.floor((last - first + 1) / 2),
            maxDist = 0;
        for (let i = first + 1; i < last; i++) {
            const P = this.evaluate(3, curve, u[i - first]),
                v = P.subtract(this.points[i]),
                dist = v.x * v.x + v.y * v.y; // 平方距离
            if (dist >= maxDist) {
                maxDist = dist;
                index = i;
            }
        }
        return {
            error: maxDist,
            index: index
        };
    }
}
