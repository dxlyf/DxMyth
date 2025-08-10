import { BoundingRect } from '../math/bounding_rect'
import { Vector2 } from '../math/vec2'
import { nCr, factorial, clamp } from 'src/2d/utils'
import {mat3,vec3,mat4, vec4} from 'gl-matrix'

const mathSqrt = Math.sqrt;
const EPSILON_NUMERIC = 1e-4;
export class QuadBezier {
    static fromPoints(p0: Vector2, p1: Vector2, p2: Vector2) {
        return new QuadBezier(p0, p1, p2)
    }
    static fromXY(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number) {
        return new QuadBezier(new Vector2(x0, y0), new Vector2(x1, y1), new Vector2(x2, y2))
    }
    p0: Vector2 = Vector2.default()
    p1: Vector2 = Vector2.default()
    p2: Vector2 = Vector2.default()
    constructor(p0: Vector2, p1: Vector2, p2: Vector2) {
        this.p0.copy(p0)
        this.p1.copy(p1)
        this.p2.copy(p2)
    }
    getBoundingBox() {
        let bounds = BoundingRect.default()
        let extrenas: Vector2[] = []
        const count = computeQuadExtremas([this.p0, this.p1, this.p2], extrenas)
        for (let i = 0; i < count; i++) {
            bounds.expandByXY(extrenas[i].x, extrenas[i].y)
        }
        // const bbox=new Bezier([this.p0, this.p1, this.p2]).bbox()
        // bounds.min.setXY(bbox.x.min, bbox.y.min)
        // bounds.max.setXY(bbox.x.max, bbox.y.max)
        return bounds
    }
    split(t: number) {
        return chopQuadBezierAt(this.p0, this.p1, this.p2, t)
    }

    /**
     * 获取贝塞尔曲线上某一点的坐标
     * @param {number} t
     * @returns
     * @memberof QuadBezier
     */
    getPoint(t: number) {
        return quadraticBezierPointAt(this.p0, this.p1, this.p2, t)
    }
    getPoints(tolerance: number = 0.01) {
        return flattenQuadBezier(this.p0, this.p1, this.p2, tolerance)
    }
    getExtermas(extrenas: Vector2[]) {
        const count = computeQuadExtremas([this.p0, this.p1, this.p2], extrenas)
        return count
    }
    fatten(tessellationTolerance=1){
        return flattenQuadBezier(this.p0, this.p1, this.p2,tessellationTolerance)
    }
}
export class CubicBezier {
    static fromQuadBezier(q: QuadBezier) {
        const cp1 = Vector2.lerp(Vector2.default(), q.p0, q.p1, 2 / 3)
        const cp2 = Vector2.lerp(Vector2.default(), q.p2, q.p1, 2 / 3)
        return this.fromPoints(q.p0, cp1, cp2, q.p2)
    }
    static fromPoints(p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2) {
        return new CubicBezier(p0, p1, p2, p3)
    }
    static fromXY(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        return new CubicBezier(new Vector2(x0, y0), new Vector2(x1, y1), new Vector2(x2, y2), new Vector2(x3, y3))
    }
    p0: Vector2 = Vector2.default()
    p1: Vector2 = Vector2.default()
    p2: Vector2 = Vector2.default()
    p3: Vector2 = Vector2.default()
    constructor(p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2) {
        this.p0.copy(p0)
        this.p1.copy(p1)
        this.p2.copy(p2)
        this.p3.copy(p3)
    }
    getBoundingBox() {
        let bounds = BoundingRect.default()
        let extrenas: Vector2[] = []
        const count = computeCubicExtremas([this.p0, this.p1, this.p2, this.p3], extrenas)
        for (let i = 0; i < count; i++) {
            bounds.expandByXY(extrenas[i].x, extrenas[i].y)
        }
        // const bbox=new Bezier([this.p0, this.p1, this.p2, this.p3]).bbox()
        // bounds.min.setXY(bbox.x.min, bbox.y.min)
        // bounds.max.setXY(bbox.x.max, bbox.y.max)
        return bounds
    }

    split(t: number) {
        return chopCubicBezierAt(this.p0, this.p1, this.p2, this.p3, t)
    }
    getPoint(t: number) {
        return cubicBezierPointAt(this.p0, this.p1, this.p2, this.p3, t)
    }
    getPoints(tolerance: number = 0.01) {
        return flattenCubicBezier(this.p0, this.p1, this.p2, this.p3, tolerance)
    }
    getExtermas(extrenas: Vector2[]) {
        const count = computeCubicExtremas([this.p0, this.p1, this.p2, this.p3], extrenas)
        return count
    }
    fatten(tessellationTolerance=1){
        return flattenCubicBezier(this.p0, this.p1, this.p2, this.p3,tessellationTolerance)

    }
}



// 伯恩斯坦多项式
export function bernstein(n: number, i: number, t: number): number {
    return nCr(n, i) * Math.pow(t, i) * Math.pow(1 - t, n - i)
}

/**
 * 伯恩斯坦多项式，用于计算贝塞尔曲线上的点
 * B(t)=∑(nCi)ti(1-t)(n-i)p_i
 */
export function getBezierPointWithBernstein(points: Vector2[], t: number): Vector2 {
    const n = points.length - 1
    if (n < 0) return Vector2.default()
    const ret = Vector2.default()
    for (let i = 0; i <= n; i++) {
        const p = points[i]
        const b = bernstein(n, i, t)
        ret.x += p.x * b
        ret.y += p.y * b
    }
    return ret
}
/**
 * 使用德卡斯特尔朱算法计算贝塞尔曲线上的点
 */
export function getBezierPointWithDeCasteljau(points: Vector2[], t: number): Vector2 {
    const n = points.length - 1
    if (n < 0) return Vector2.default()
    let result: Vector2[] = points.map(d => d.clone())
    for (let j = 1; j <= n; j++) {
        for (let i = 0; i < n - j + 1; i++) {
            result[i] = result[i].lerp(result[i + 1], t)
        }
    }
    return result[0]
}
export function conicBezierAt(p0: number, p1: number, p2: number, weight: number = 1,t:number) {
    const w=(4*weight)/(3*(1+weight))
    const c1p=p0+(p1-p0)*w
    const c2p=p2+(p1-p2)*w
    return cubicBezierAt(p0,c1p,c2p,p2,t)
}
export function conicBezierPointAt(p0: Vector2, p1: Vector2, p2: Vector2, weight: number = 1,t:number): Vector2 {
    const w=(4*weight)/(3*(1+weight))
    const c1p=Vector2.lerp(Vector2.default(), p0, p1, w)
    const c2p=Vector2.lerp(Vector2.default(), p1, p2, w)
    return cubicBezierPointAt(p0,c1p,c2p,p2,t)
}
/**
 * 如conicTo(p0, p1,p2, weight)=getRationalBezierPointWithBernstein([p0,p1,p2],[1,weight,1])
 * 有理贝塞尔曲线，使用伯恩斯坦多项式计算
 * @param points 
 * @param weight 
 * @param t 
 * @returns 
 */
export function getRationalBezierPointWithBernstein(points: Vector2[], weight: number[], t: number): Vector2 {
    const n = points.length - 1
    if (n < 0) return Vector2.default()
    const ret = Vector2.default()
    let w = 0
    for (let i = 0; i <= n; i++) {
        const p = points[i]
        const b = bernstein(n, i, t)
        ret.x += weight[i] * b * p.x
        ret.y += weight[i] * b * p.y
        w += weight[i] * b
    }
    ret.x /= w
    ret.y /= w
    return ret
}

/** 
 * 获取贝塞尔曲线的曲率
    曲率半径=1/k
*/
export function bezierCurvatureAt(points: Vector2[], t: number) {
    const firstDerivative = bezierFirstDerivative(points, t)
    const secondDerivative = bezierSecondDerivative(points, t)
    const numerator = Math.abs(firstDerivative.cross(secondDerivative))
    //pow(firstDerivative.magnitudeSquared(),3/2)=pow(firstDerivative.magnitude(),3)
    const denominator = Math.pow(firstDerivative.magnitudeSquared(), 3 / 2) //pow(firstDerivative.magnitudeSquared(),3/2)

    return numerator / denominator
}

export function quadBezierWithMatrixAt(p0: Vector2, p1: Vector2, p2: Vector2, t: number) {
        const m=mat3.fromValues(1,-2,1,
                                0,2,-2,
                                0,0,1)
        const vt=vec3.fromValues(1,t,t*t)
        const r=vec3.transformMat3(vec3.create(), vt,m)
        const px=vec3.fromValues(p0.x, p1.x, p2.x)
        const py=vec3.fromValues(p0.y, p1.y, p2.y)
        return Vector2.create(vec3.dot(r,px), vec3.dot(r,py))
}
export function cubicBezierWithMatrixAt(p0: Vector2, p1: Vector2, p2: Vector2,p3:Vector2, t: number) {
    const m=mat4.fromValues(1,-3,3,-1,
                            0,3,-6,3,
                            0,0,3,-3,
                            0,0,0,1)
    const vt=vec4.fromValues(1,t,t*t,t*t*t)
    const r=vec4.transformMat4(vec3.create(), vt,m)
    const px=vec4.fromValues(p0.x, p1.x, p2.x,p3.x)
    const py=vec4.fromValues(p0.y, p1.y, p2.y,p3.y)
    return Vector2.create(vec4.dot(r,px), vec4.dot(r,py))
}

export function quadraticBezierAt(v0:number, v1:number,v2:number,t:number){
    const _tt = t * t, _1t = 1 - t, _1tt = _1t * _1t
    return v0 * _1tt + 2  * t * _1t*v1 +  _tt*v2
}
/**
 * 根据二次贝塞尔曲线上的参数 t 计算对应的点
 *
 * @param p0 二次贝塞尔曲线的起点
 * @param p1 二次贝塞尔曲线的控制点
 * @param p2 二次贝塞尔曲线的终点
 * @param t 参数 t 的值，取值范围 [0, 1]
 * @returns 返回二次贝塞尔曲线上对应参数 t 的点
 */
export function quadraticBezierPointAt(p0: Vector2, p1: Vector2, p2: Vector2, t: number): Vector2 {
    const _tt = t * t, _1t = 1 - t, _1tt = _1t * _1t
    const x = p0.x * _1tt + 2 * _1t * t * p1.x + _tt * p2.x
    const y = p0.y * _1tt + 2 * _1t * t * p1.y + _tt * p2.y
    return Vector2.create(x, y)
}
export function cubicBezierAt(v0:number,v1:number,v2:number,v3:number, t: number) {
    const _tt = t * t, _ttt = _tt * t, _1t = 1 - t, _1tt = _1t * _1t, _1ttt = _1tt * _1t;
    return v0 * _1ttt + 3  * t * _1tt*v1 + 3*_1t*_tt*v2+_ttt*v3
}
/**
 * 根据贝塞尔曲线的四个控制点和一个时间参数 t，计算贝塞尔曲线上的点
 *
 * @param p0 贝塞尔曲线的第一个控制点（起始点）
 * @param p1 贝塞尔曲线的第二个控制点
 * @param p2 贝塞尔曲线的第三个控制点
 * @param p3 贝塞尔曲线的第四个控制点（终点）
 * @param t 时间参数，取值范围在 [0, 1] 之间
 * @returns 返回贝塞尔曲线上对应时间参数 t 的点
 */
export function cubicBezierPointAt(p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2, t: number): Vector2 {
    const _tt = t * t, _ttt = _tt * t, _1t = 1 - t, _1tt = _1t * _1t, _1ttt = _1tt * _1t
    const x = p0.x * _1ttt + 3 * _1tt * t * p1.x + 3 * _1t * _tt * p2.x + _ttt * p3.x
    const y = p0.y * _1ttt + 3 * _1tt * t * p1.y + 3 * _1t * _tt * p2.y + _ttt * p3.y
    return Vector2.create(x, y)
}

// 提升贝塞尔曲线阶数
export function raiseBezier(points: Vector2[]): Vector2[] {
    const n = points.length
    if (n <= 1) return []
    let result: Vector2[] = [points[0]]
    for (let i = 1; i < n; i++) {
        let p0 = points[i - 1]
        let p1 = points[i]
        result[i - 1] = Vector2.create(
            p0.x * i / n + p1.x * (n - i) / n,
            p0.y * i / n + p1.y * (n - i) / n,
        )
    }
    result[n] = points[n - 1]
    return result
}

/**
 * 获取贝塞尔曲线的一阶导数 (方向和速度向量)
 * @param points 
 * @param t 
 * @returns 
 */
export function bezierFirstDerivative(points: Vector2[], t: number): Vector2 {
    const n = points.length - 1
    if (n < 0) return Vector2.default()
    let ret = Vector2.default()
    for (let i = 0; i < n; i++) {
        const b = bernstein(n - 1, i, t)
        ret.x += (points[i + 1].x - points[i].x) * b
        ret.y += (points[i + 1].y - points[i].y) * b
    }
    return ret.multiplyScalar(n)
}
/**
 * 计算N阶贝塞尔曲线在参数t处的二阶导数 （加速度向量)
 * @param {Array} points - 控制点数组 [{x, y}, ...]
 * @param {number} t - 参数值 [0, 1]
 * @returns {Object} 二阶导数向量 {x, y}
 */
export function bezierSecondDerivative(points: Vector2[], t: number) {
    const n = points.length - 1;
    if (n < 2) return Vector2.create(0, 0); // 一阶曲线二阶导数为零

    let secondDeriv = Vector2.create(0, 0);

    for (let i = 0; i <= n - 2; i++) {
        const coefficient = bernstein(n - 2, i, t)
        secondDeriv.x += points[i + 2].x - 2 * points[i + 1].x + points[i].x * coefficient;
        secondDeriv.y += points[i + 2].y - 2 * points[i + 1].y + points[i].y * coefficient;
    }

    // 乘以n(n-1)
    secondDeriv.x *= n * (n - 1);
    secondDeriv.y *= n * (n - 1);

    return secondDeriv;
}



/**
 * 计算 k 阶差分 Δ^k P_i
 */
function difference(points: Vector2[], k: number): Vector2[] {
    let result = points;
    for (let d = 0; d < k; d++) {
        const next: Vector2[] = [];
        for (let i = 0; i < result.length - 1; i++) {
            const diff = result[i + 1].clone().sub(result[i])
            next.push(diff);
        }
        result = next;
    }
    return result;
}
/**
 * 获取贝塞尔曲线在t处的k阶导数
 * !n/(n-k)!*nCr()*Δ^k P_i(t)的和

 * @param points 
 * @param t 
 * @param k 阶数
 * @returns 
 */
export function bezierDerivative(points: Vector2[], t: number, k: number) {
    const n = points.length - 1;
    if (k > n) throw new Error("导数阶数不能超过贝塞尔曲线阶数");

    const coeff = factorial(n) / factorial(n - k);
    const diffPoints = difference(points, k); // Δ^k P_i
    const order = n - k;

    const result = Vector2.default()
    for (let i = 0; i <= order; i++) {
        const b = bernstein(order, i, t);
        result.x += diffPoints[i].x * b;
        result.y += diffPoints[i].y * b;
    }
    result.x *= coeff
    result.y *= coeff
    return result;
}

/**
 * 计算贝塞尔曲线的N阶导数控制点
 * 求t的导
 * const  derivativeControls=getBezierDerivativeControlPoints(points)
 * const  tangent =getBezierPointWithDeCasteljau(derivativeControls, t)
*  计算p0点切线方向直线
* (x-p0.x)*tangent.y=(y-p0.y)*tangent.x
* 
*   求二阶导数控制点
const  firstDerivativeControls=getBezierDerivativeControlPoints(points)
const  secondDerivativeControls=getBezierDerivativeControlPoints(firstDerivativeControls)
 */
export function getBezierDerivativeControlPoints(points: Vector2[]): Vector2[] {
    const n = points.length - 1
    if (n < 0) return []
    let result: Vector2[] = Array.from({ length: n }).map(() => Vector2.default())
    for (let i = 0; i < n; i++) {
        result[i].x = n * (points[i + 1].x - points[i].x)
        result[i].y = n * (points[i + 1].y - points[i].y)
    }
    return result
}
export function chopBezierBetween(points: Vector2[], t0: number, t1: number):Vector2[] {
    if(t0===0&&t1===1)return points

    if(t0===0){
        return chopBezierAt(points,t1).left
    }
    if(t1===1){
        return chopBezierAt(points,t0).right
    }
    const right=chopBezierAt(points,t0).right
    return chopBezierAt(right,t1).left
}

/**
 * N阶贝塞尔曲线细分（使用德卡斯特里奥算法）
 * @param {Array} points - 控制点数组，格式 [{x, y}, ...]
 * @param {number} t - 分割参数 (0 < t < 1)
 * @returns {Array} [leftCurve, rightCurve] 分割后的两条曲线控制点
 */
export function chopBezierAt(points: Vector2[], t: number = 0.5) {
    const n = points.length - 1;
    const left: Vector2[] = [];
    const right: Vector2[] = [];
    const tmpPoints = points.map(d => d.clone()); // 深拷贝避免修改原数组

    left.push(tmpPoints[0].clone());
    right.unshift(tmpPoints[n].clone());

    // 德卡斯特里奥算法递归插值
    for (let level = 1; level <= n; level++) {
        for (let i = 0; i < n - level + 1; i++) {
            tmpPoints[i].x = (1 - t) * tmpPoints[i].x + t * tmpPoints[i + 1].x;
            tmpPoints[i].y = (1 - t) * tmpPoints[i].y + t * tmpPoints[i + 1].y;
        }
        left.push(tmpPoints[0].clone());
        right.unshift(tmpPoints[n - level].clone());
    }

    return {
        left,
        right
    };
}
// 根据t细分
export function chopQuadBezierAt(p0: Vector2, p1: Vector2, p2: Vector2, t: number = 0.5) {
    const v0 = p0.clone().lerp(p1, t)
    const v1 = p1.clone().lerp(p2, t)
    const v2 = v0.clone().lerp(v1, t)
    return [p0, v0, v2, v1, p2]
}
// 二次贝塞尔曲线细分最大曲率点
export function chopQuadBezierAtMaxCurature(src: Vector2[], dst: Vector2[]) {
    const t = findQuadMaxCurvature(src[0], src[1], src[2])
    if (t > 0 && t < 1) {
        return chopQuadBezierAt(src[0], src[1], src[2], t)
    } {
        return src
    }
}
//subdivideCubicBezier
export function chopCubicBezierAt(p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2, t: number = 0.5) {
    const v0 = p0.clone().lerp(p1, t)
    const v1 = p1.clone().lerp(p2, t)
    const v2 = p2.clone().lerp(p3, t)

    const v01 = v0.clone().lerp(v1, t)
    const v12 = v1.clone().lerp(v2, t)

    const v0112 = v01.clone().lerp(v12, t)
    return [p0, v0, v01, v0112, v12, v2, p3]
}
// 点与线段的距离
export function pointOnSegmentDistance(x: number, y: number, x1: number, y1: number, x2: number, y2: number) {
    const dx = x2 - x1
    const dy = y2 - y1
    const px = x - x1;
    const py = y - y1;
    const d = dx * dx + dy * dy;
    if (d == 0) {
        return 0;
    }
    const t = Math.max(0, Math.min(1, (px * dx + py * dy) / d));
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;
    const dx0 = (x - projX)
    const dy0 = (y - projY)
    const dist = dx0 * dx0 + dy0 * dy0;
    return dist
}
// 点与直线的距离
export function pointOnLineDistance(x: number, y: number, x1: number, y1: number, x2: number, y2: number) {
    const dx = x2 - x1
    const dy = y2 - y1
    const A = dy, B = -dx, C = dx * y1 - dy * x1;
    return Math.abs(A * x + B * y + C) / Math.sqrt(A * A + B * B)

}


// 二次贝塞尔曲线扁平化转换成线段
export function flattenQuadBezier(p0: Vector2, p1: Vector2, p2: Vector2, tessellationTolerance = 1, maxDepth = 1000) {
    const points: Vector2[] = []
    function recurse(p0: Vector2, p1: Vector2, p2: Vector2, depth = 0) {
        const d01 = pointOnLineDistance(p1.x, p1.y, p0.x, p0.y, p2.x, p2.y)
        if (d01 < tessellationTolerance || depth > maxDepth) {
            points.push(p2)
            return
        }
        const [v1, v2, v3, v4, v5] = chopQuadBezierAt(p0, p1, p2, 0.5)
        recurse(v1, v2, v3, depth + 1)
        recurse(v3, v4, v5, depth + 1)
    }
    points.push(p0)
    recurse(p0, p1, p2)
    return points
}

// 三次贝塞尔曲线扁平化转换成线段
export function flattenCubicBezier(p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2, tessellationTolerance = 1, maxDepth = 1000) {
    const points: Vector2[] = []
    function recurse(p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2, depth = 0) {
        const d01 = pointOnLineDistance(p1.x, p1.y, p0.x, p0.y, p3.x, p3.y)
        const d02 = pointOnLineDistance(p2.x, p2.y, p0.x, p0.y, p3.x, p3.y)

        if (Math.max(d01, d02) < tessellationTolerance || depth > maxDepth) {
            points.push(p3)
            return
        }
        const [v1, v2, v3, v4, v5, v6, v7] = chopCubicBezierAt(p0, p1, p2, p3, 0.5)
        recurse(v1, v2, v3, v4, depth + 1)
        recurse(v4, v5, v6, v7, depth + 1)
    }
    points.push(p0)
    recurse(p0, p1, p2, p3)
    return points
}



/**
 * 两次贝塞尔曲线转换为三次贝塞尔曲线。
 * @param p0 
 * @param p1 
 * @param p2 
 * @returns 
 */
export function quadBezierToCubic(p0: Vector2, p1: Vector2, p2: Vector2) {
    const cp1 = Vector2.lerp(Vector2.default(), p0, p1, 2 / 3)
    const cp2 = Vector2.lerp(Vector2.default(), p2, p1, 2 / 3)
    return [p0, cp1, cp2, p2]
}


/**
 * 计算在t位置的二次贝塞曲线的一阶导数（斜率）
 * 二次导数：2(p1-p0)(1-t)+2(p2-p1)t=2(p1-p0)+2t(p2-2p1+p0)
*/
export function evalQuadBezierTangentAt(p0: Vector2, p1: Vector2, p2: Vector2, t: number) {
    const x = 2 * (p1.x - p0.x) + 2 * (p2.x - 2 * p1.x + p0.x) * t
    const y = 2 * (p1.y - p0.y) + 2 * (p2.y - 2 * p1.y + p0.y) * t
    return Vector2.create(x, y)
}




/**
 * 计算在t位置的二次贝塞曲线的二阶导数（曲率）
 *  F(t)    = a (1 - t) ^ 2 + 2 b t (1 - t) + c t ^ 2
 *  F'(t)   = 2 (b - a) + 2 (a - 2b + c) t
 *  F''(t)  = 2 (a - 2b + c)
 *  
 *  A = 2 (b - a)
 *  B = 2 (a - 2b + c)
 *  
 *  Maximum curvature for a quadratic means solving
 *   Fx' Fx'' + Fy' Fy'' = 0
 *   
 *   t = - (Ax Bx + Ay By) / (Bx ^ 2 + By ^ 2)
*/
export function findQuadMaxCurvature(p0: Vector2, p1: Vector2, p2: Vector2) {
    const ax = 2 * (p1.x - p0.x)
    const ay = 2 * (p1.y - p0.y)

    const bx = 2 * (p0.x - 2 * p1.x + p2.x)
    const by = 2 * (p0.y - 2 * p1.y + p2.y)

    //  Fx' Fx'' + Fy' Fy'' = 0
    // (ax+bxt)*bx+(ay+byt)*by=0
    // axbx+bx^2t+ayby+by^2t=0
    // bx^2t+by^2t=-axbx+ayby
    // t(bx^2+by^2)=-axbx+ayby
    // t=-(axbx+ayby)/(bx^2+by^2)

    let numer = -(ax * bx + ay * by)
    let denom = bx * bx + by * by
    if (denom < 0) {
        numer = -numer
        denom = -denom
    }
    if (numer <= 0) {
        return 0
    }
    if (numer >= denom) {  // Also catches denom=0.
        return 1
    }
    let t = numer / denom
    return t
}



/**
 * 计算在t位置的三次贝塞曲线的一阶导数（斜率）
 * 3t^2(p3-3p2+3p1-p0)+6t(p2-2p1+p0)+3(p1-p0)
*/
export function evalCubicBezierTangentAt(p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2, t: number) {
    const x = 3 * t * t * (p3.x - 3 * p2.x + 3 * p1.x - p0.x) + 6 * t * (p2.x - 2 * p1.x + p0.x) + 3 * (p1.x - p0.x)
    const y = 3 * t * t * (p3.y - 3 * p2.y + 3 * p1.y - p0.y) + 6 * t * (p2.y - 2 * p1.y + p0.y) + 3 * (p1.y - p0.x)
    return Vector2.create(x, y)
}


/*  Looking for F' dot F'' == 0

    A = b - a
    B = c - 2b + a
    C = d - 3c + 3b - a

    F' = 3Ct^2 + 6Bt + 3A
    F'' = 6Ct + 6B

    F' dot F'' -> CCt^3 + 3BCt^2 + (2BB + CA)t + AB
*/
function formulate_F1DotF2(src: number[], coeff: number[]) {
    let a = src[2] - src[0];
    let b = src[4] - 2 * src[2] + src[0];
    let c = src[6] + 3 * (src[2] - src[4]) - src[0];

    coeff[0] = c * c;
    coeff[1] = 3 * b * c;
    coeff[2] = 2 * b * b + c * a;
    coeff[3] = a * b;
}
/**
 *  Given an array and count, remove all pair-wise duplicates from the array,
 *  keeping the existing sorting, and return the new count
 */
function collaps_duplicates(array: number[], count: number) {
    let cur = 0
    for (let n = count; n > 1; --n) {
        if (array[cur] == array[cur + 1]) {
            for (let i = 1; i < n; ++i) {
                array[i - 1] = array[i]
            }
            count -= 1;
        } else {
            cur++
        }
    }
    return count;
}

function bubble_sort(array: any[], count: number) {
    for (let i = count - 1; i > 0; --i) {
        for (let j = i; j > 0; --j) {
            if (array[j] < array[j - 1]) {
                let tmp = array[j];
                array[j] = array[j - 1];
                array[j - 1] = tmp;
            }
        }
    }
}
/*  Solve coeff(t) == 0, returning the number of roots that
    lie withing 0 < t < 1.
    coeff[0]t^3 + coeff[1]t^2 + coeff[2]t + coeff[3]

    Eliminates repeated roots (so that all tValues are distinct, and are always
    in increasing order.
*/
function solve_cubic_poly(coeff: number[], tValues: number[]): number {
    if (Math.abs(coeff[0]) <= 1e-6) {  // we're just a quadratic
        return findUnitQuadRoots(coeff[1], coeff[2], coeff[3], tValues);
    }

    let a, b, c, Q, R;

    {
        let inva = 1 / coeff[0];
        a = coeff[1] * inva;
        b = coeff[2] * inva;
        c = coeff[3] * inva;
    }
    Q = (a * a - b * 3) / 9;
    R = (2 * a * a * a - 9 * a * b + 27 * c) / 54;

    let Q3 = Q * Q * Q;
    let R2MinusQ3 = R * R - Q3;
    let adiv3 = a / 3;

    if (R2MinusQ3 < 0) { // we have 3 real roots
        // the divide/root can, due to finite precisions, be slightly outside of -1...1
        let theta = Math.cos(clamp(R / Math.sqrt(Q3), -1, 1));
        let neg2RootQ = -2 * Math.sqrt(Q);

        tValues[0] = clamp(neg2RootQ * Math.cos(theta / 3) - adiv3, 0, 1);
        tValues[1] = clamp(neg2RootQ * Math.cos((theta + 2 * Math.PI) / 3) - adiv3, 0, 1);
        tValues[2] = clamp(neg2RootQ * Math.cos((theta - 2 * Math.PI) / 3) - adiv3, 0, 1);

        // now sort the roots
        bubble_sort(tValues, 3);
        return collaps_duplicates(tValues, 3);
    } else {              // we have 1 real root
        let A = Math.abs(R) + Math.sqrt(R2MinusQ3);
        A = Math.pow(A, 0.3333333);
        if (R > 0) {
            A = -A;
        }
        if (A != 0) {
            A += Q / A;
        }
        tValues[0] = clamp(A - adiv3, 0, 1);
        return 1;
    }
}
export function findCubicMaxCurvature(src: Vector2[], tValues: number[]) {
    let coeffX = new Array(4).fill(0), coeffY = new Array(4).fill(0);
    let i;

    formulate_F1DotF2(src.map(d => d.x), coeffX);
    formulate_F1DotF2(src.map(d => d.y), coeffY);

    for (i = 0; i < 4; i++) {
        coeffX[i] += coeffY[i];
    }

    let numRoots = solve_cubic_poly(coeffX, tValues);
    // now remove extrema where the curvature is zero (mins)
    // !!!! need a test for this !!!!
    return numRoots;
}


/**
 * 返回1，结果有效，0结果无效。
 * @param numer 被除数。
 * @param denom 除数
 * @param ratio 结果
 * @returns 
 */
function validUnitDivide(numer: number, denom: number, ratio: number[]) {
    if (numer < 0) {
        numer = -numer;
        denom = -denom;
    }

    if (denom == 0 || numer == 0 || numer >= denom) {
        return 0;
    }

    let r = numer / denom;
    if (!Number.isFinite(r)) {
        return 0;
    }

    if (r == 0) { // catch underflow if numer <<<< denom
        return 0;
    }
    ratio[0] = r;
    return 1;
}
/** 
 * 获取二次贝塞尔曲线极值。
 * Quad'(t) = At + B, where
    A = 2(a - 2b + c)
    B = 2(b - a)
    Solve for t, only if it fits between 0 < t < 1
*/
export function findQuadExtrema(a: number, b: number, c: number, tValue: number[]) {
    /*  At + B == 0
          t = -B / A
      */
    return validUnitDivide(a - b, a - b - b + c, tValue);
}

/** 
 * 获取三次贝塞尔曲线极值。
 * Cubic'(t) = At^2 + Bt + C, where
    A = 3(-a + 3(b - c) + d)
    B = 6(a - 2b + c)
    C = 3(b - a)
    Solve for t, keeping only those that fit betwee 0 < t < 1
*/
export function findCubicExtrema(a: number, b: number, c: number, d: number, tValue: number[]) {
    // we divide A,B,C by 3 to simplify
    const A = d - a + 3 * (b - c);
    const B = 2 * (a - b - b + c);
    const C = b - a;
    return findUnitQuadRoots(A, B, C, tValue);
}

/** From Numerical Recipes in C.

    Q = -1/2 (B + sign(B) sqrt[B*B - 4*A*C])
    x1 = Q / A
    x2 = C / Q
*/
export function findUnitQuadRoots(A: number, B: number, C: number, roots: number[]) {

    if (A == 0) {
        return validUnitDivide(-C, B, roots);
    }

    let rootsIndex = 0;

    // use doubles so we don't overflow temporarily trying to compute R
    let dr = B * B - 4 * A * C;
    if (dr < 0) {
        return 0;
    }
    dr = Math.sqrt(dr);
    let R = dr;
    if (!Number.isFinite(R)) {
        return 0;
    }

    let Q = (B < 0) ? -(B - R) / 2 : -(B + R) / 2;
    let tmp: number[] = []
    if (validUnitDivide(Q, A, tmp) > 0) {
        roots[rootsIndex] = tmp[0]
        rootsIndex++
    }
    if (validUnitDivide(C, Q, tmp)) {
        roots[rootsIndex] = tmp[0]
        rootsIndex++
    }
    if (rootsIndex == 2) {
        if (roots[0] > roots[1]) {
            let tmpValue = roots[0]
            roots[0] = roots[1]
            roots[1] = tmpValue
        } else if (roots[0] == roots[1]) { // nearly-equal?
            rootsIndex -= 1; // skip the double root
        }
    }
    return rootsIndex;
}

/**
 * 计算二次贝塞尔曲线极值点。
 * @param src 控制点
 * @param extremas 极值点
 * @returns 极值点个数
 */
export function computeQuadExtremas(src: Vector2[], extremas: Vector2[]) {
    let ts: number[] = [], tmp: number[] = [];
    let n = 0
    if (findQuadExtrema(src[0].x, src[1].x, src[2].x, tmp) > 0) {
        ts[n] = tmp[0]
        n++
    }
    if (findQuadExtrema(src[0].y, src[1].y, src[2].y, tmp) > 0) {
        ts[n] = tmp[0]
        n++
    }
    for (let i = 0; i < n; ++i) {
        extremas[i] = getBezierPointWithDeCasteljau(src, ts[i]);
    }
    extremas[n] = src[2];
    return n + 1;
}

/**
 *  计算三次贝塞尔曲线极值点。
 * @param src 控制点数组
 * @param extremas  极值点数组
 * @returns  极值点个数
 */
export function computeCubicExtremas(src: Vector2[], extremas: Vector2[]) {
    let ts: number[] = [0,0,0,0], tmp: number[] = [];
    let n = 0,tmp_n=0
    if ((tmp_n=findCubicExtrema(src[0].x, src[1].x, src[2].x, src[3].x, tmp)) > 0) {
        if(tmp_n==1){
            ts[0] = tmp[0]
        }
        if(tmp_n==2){
            ts[1] = tmp[1]
        }
        n+=tmp_n
    }
    if((tmp_n=findCubicExtrema(src[0].y, src[1].y, src[2].y, src[3].y, tmp)) > 0) {
        if(tmp_n==1){
            ts[n] = tmp[0]
        }
        if(tmp_n==2){
            ts[n+1] = tmp[1]
        }
        n+=tmp_n
    }
    for (let i = 0; i < n; ++i) {
        extremas[i] = getBezierPointWithDeCasteljau(src, ts[i]);
    }
    extremas[n] = src[3];
    return n + 1;
}


/**
 * 投射点到二次贝塞尔曲线上，返回投射距离。
 * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x
 * @param {number} y
 * @param {Array.<number>} out 投射点
 * @return {number}
 */
export function quadraticProjectPoint(
    x0: number, y0: number, x1: number, y1: number, x2: number, y2: number,
    x: number, y: number, out: Vector2|null
): number {
    // http://pomax.github.io/bezierinfo/#projections
    let t: number=0;
    let interval = 0.005;
    let d = Infinity;
    const _v0=Vector2.create(x, y),_v1=Vector2.default(),_v2=Vector2.default();

    // 先粗略估计一下可能的最小距离的 t 值
    // PENDING
    for (let _t = 0; _t < 1; _t += 0.05) {
        _v1[0] = quadraticBezierAt(x0, x1, x2, _t);
        _v1[1] = quadraticBezierAt(y0, y1, y2, _t);
        const d1 = _v0.distanceSquared(_v1)
        if (d1 < d) {
            t = _t;
            d = d1;
        }
    }
    d = Infinity;

    // At most 32 iteration
    for (let i = 0; i < 32; i++) {
        if (interval < EPSILON_NUMERIC) {
            break;
        }
        const prev = t - interval;
        const next = t + interval;
        // t - interval
        _v1[0] = quadraticBezierAt(x0, x1, x2, prev);
        _v1[1] = quadraticBezierAt(y0, y1, y2, prev);

        const d1 = _v0.distanceSquared(_v1)

        if (prev >= 0 && d1 < d) {
            t = prev;
            d = d1;
        }
        else {
            // t + interval
            _v2[0] = quadraticBezierAt(x0, x1, x2, next);
            _v2[1] = quadraticBezierAt(y0, y1, y2, next);
            const d2 = _v2.distanceSquared(_v0);
            if (next <= 1 && d2 < d) {
                t = next;
                d = d2;
            }
            else {
                interval *= 0.5;
            }
        }
    }
    // t
    if (out) {
        out[0] = quadraticBezierAt(x0, x1, x2, t);
        out[1] = quadraticBezierAt(y0, y1, y2, t);
    }
    // console.log(interval, i);
    return mathSqrt(d);
}

/**
 * 计算二次贝塞尔曲线长度
 */
export function quadraticLength(
    x0: number, y0: number, x1: number, y1: number, x2: number, y2: number,
    iteration: number
) {
    let px = x0;
    let py = y0;

    let d = 0;

    const step = 1 / iteration;

    for (let i = 1; i <= iteration; i++) {
        let t = i * step;
        const x = quadraticBezierAt(x0, x1, x2, t);
        const y = quadraticBezierAt(y0, y1, y2, t);

        const dx = x - px;
        const dy = y - py;

        d += Math.sqrt(dx * dx + dy * dy);

        px = x;
        py = y;
    }

    return d;
}

/**
 * 投射点到三次贝塞尔曲线上，返回投射距离。
 * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
 */
export function cubicProjectPoint(
    x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
    x: number, y: number, out: Vector2|null
): number {
    // http://pomax.github.io/bezierinfo/#projections
    let t=0;
    let interval = 0.005;
    let d = Infinity;
    let prev;
    let next;
    let d1;
    let d2;

    const _v0=Vector2.create(x,y), _v1=Vector2.default(),_v2=Vector2.default();

    // 先粗略估计一下可能的最小距离的 t 值
    // PENDING
    for (let _t = 0; _t < 1; _t += 0.05) {
        _v1[0] = cubicBezierAt(x0, x1, x2, x3, _t);
        _v1[1] = cubicBezierAt(y0, y1, y2, y3, _t);
        d1 = _v0.distanceSquared(_v1);
        if (d1 < d) {
            t = _t;
            d = d1;
        }
    }
    d = Infinity;

    // At most 32 iteration
    for (let i = 0; i < 32; i++) {
        if (interval < EPSILON_NUMERIC) {
            break;
        }
        prev = t - interval;
        next = t + interval;
        // t - interval
        _v1[0] = cubicBezierAt(x0, x1, x2, x3, prev);
        _v1[1] = cubicBezierAt(y0, y1, y2, y3, prev);

        d1 = _v1.distanceSquared(_v0);

        if (prev >= 0 && d1 < d) {
            t = prev;
            d = d1;
        }
        else {
            // t + interval
            _v2[0] = cubicBezierAt(x0, x1, x2, x3, next);
            _v2[1] = cubicBezierAt(y0, y1, y2, y3, next);
            d2 = _v2.distanceSquared(_v0);

            if (next <= 1 && d2 < d) {
                t = next;
                d = d2;
            }
            else {
                interval *= 0.5;
            }
        }
    }
    // t
    if (out) {
        out[0] = cubicBezierAt(x0, x1, x2, x3, t);
        out[1] = cubicBezierAt(y0, y1, y2, y3, t);
    }
    // console.log(interval, i);
    return mathSqrt(d);
}

/**
 * 计算三次贝塞尔曲线长度
 */
export function cubicLength(
    x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
    iteration: number
) {
    let px = x0;
    let py = y0;

    let d = 0;

    const step = 1 / iteration;

    for (let i = 1; i <= iteration; i++) {
        let t = i * step;
        const x = cubicBezierAt(x0, x1, x2, x3, t);
        const y = cubicBezierAt(y0, y1, y2, y3, t);

        const dx = x - px;
        const dy = y - py;

        d += Math.sqrt(dx * dx + dy * dy);

        px = x;
        py = y;
    }

    return d;
}