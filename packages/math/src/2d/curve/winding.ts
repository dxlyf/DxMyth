import {quadraticBezierTangentAt,computeQuadExtremas,computeCubicExtremas} from './bezier'
import { Vector2 as Point } from '../math/vec2'
import { interpolate,equalsEpsilon } from '../math/utils'

class SkConic{
    static default(){
        return new SkConic([Point.default(),Point.default(),Point.default()],0.5)
    }
    pts:Point[]
    w:number
    constructor(pts: Point[],w:number) {
        this.pts = pts
        this.w = w
    }
}
export class Ref<T = number> {
    static from<T = number>(value: T): Ref<T> {
        return new Ref(value)
    }
    value: T
    constructor(value: T) {
        this.value = value;
    }
    swap(other: Ref<T>) {
        let tmp = this.value
        this.value = other.value
        other.value = tmp
    }
}
export class PointerArray<T> {
    static from<T = any>(data: T[]): PointerArray<T> {
        const arr = new this(data)
        return arr as PointerArray<T>
    }
    data: T[] = []
    curIndex: number = 0
    constructor(data: T[]) {
        this.data = data
    }
    get length(): number {
        return this.data.length
    }
    copy(source: PointerArray<T>) {
        this.data = source.data
        this.curIndex = source.curIndex
        return this
    }
    clone() {
        return new PointerArray(this.data).copy(this)
    }
    slice(start: number) {
        const p = new PointerArray(this.data)
        p.curIndex = start
        return p
    }
    get(index: number) {
        return this.data[index + this.curIndex]
    }
    set(index: number, value: T) {
        this.data[index + this.curIndex] = value
        return this
    }

    set value(v: T) {
        this.data[this.curIndex] = v
    }
    get value() {
        return this.data[this.curIndex]
    }
    move(index: number) {
        this.curIndex = index
        return this
    }
    next(index: number = 1) {
        this.move(this.curIndex + index)
        return this
    }
    prev(index: number = 1) {
        this.move(this.curIndex - index)
        return this
    }
}
function ChopMonoAtY(pts: Point[], y: number, t: Ref<number>) {
    let ycrv = new Float32Array(4)
    ycrv[0] = pts[0].y - y;
    ycrv[1] = pts[1].y - y;
    ycrv[2] = pts[2].y - y;
    ycrv[3] = pts[3].y - y;

    // Check that the endpoints straddle zero.
    let tNeg = 0, tPos = 0;    // Negative and positive function parameters.
    if (ycrv[0] < 0) {
        if (ycrv[3] < 0)
            return false;
        tNeg = 0;
        tPos = 1;
    } else if (ycrv[0] > 0) {
        if (ycrv[3] > 0)
            return false;
        tNeg = 1;
        tPos = 0;
    } else {
        t.value = 0;
        return true;
    }

    const tol = 1 / 65536;  // 1 for fixed, 1e-5 for float.
    do {
        let tMid = (tPos + tNeg) / 2;
        let y01 = interpolate(ycrv[0], ycrv[1], tMid);
        let y12 = interpolate(ycrv[1], ycrv[2], tMid);
        let y23 = interpolate(ycrv[2], ycrv[3], tMid);
        let y012 = interpolate(y01, y12, tMid);
        let y123 = interpolate(y12, y23, tMid);
        let y0123 = interpolate(y012, y123, tMid);
        if (y0123 == 0) {
            t.value = tMid;
            return true;
        }
        if (y0123 < 0) tNeg = tMid;
        else tPos = tMid;
    } while (!(Math.abs(tPos - tNeg) <= tol));   // Nan-safe

    t.value = (tNeg + tPos) / 2;
    return true;

}



function valid_unit_divide(numer: number, denom: number, ratio: PointerArray<number>): number {

    if (numer < 0) {
        numer = -numer;
        denom = -denom;
    }

    if (denom == 0 || numer == 0 || numer >= denom) {
        return 0;
    }

    let r = numer / denom;
    if (Number.isNaN(r)) {
        return 0;
    }

    if (r == 0) { // catch underflow if numer <<<< denom
        return 0;
    }
    ratio.value = r;
    return 1;
}
// Just returns its argument, but makes it easy to set a break-point to know when
// SkFindUnitQuadRoots is going to return 0 (an error).
function return_check_zero(value: number): number {
    if (value == 0) {
        return 0;
    }
    return value;
}
function SkFindUnitQuadRoots(A: number, B: number, C: number, roots: PointerArray<number>): number {

    if (A == 0) {
        return return_check_zero(valid_unit_divide(-C, B, roots));
    }

    let r = roots.clone();

    // use doubles so we don't overflow temporarily trying to compute R
    let dr = B * B - 4 * A * C;
    if (dr < 0) {
        return return_check_zero(0);
    }
    dr = Math.sqrt(dr);
    let R = dr;
    if (!Number.isFinite(R)) {
        return return_check_zero(0);
    }

    let Q = (B < 0) ? -(B - R) / 2 : -(B + R) / 2;
    r.curIndex += valid_unit_divide(Q, A, r);
    r.curIndex += valid_unit_divide(C, Q, r);
    if (r.curIndex - roots.curIndex == 2) {
        if (roots.get(0) > roots.get(1)) {
            let tmp = roots.get(0)
            roots.set(0, roots.get(1))
            roots.set(1, tmp)

        } else if (roots.get(0) == roots.get(1)) { // nearly-equal?
            r.curIndex -= 1; // skip the double root
        }
    }
    return return_check_zero((r.curIndex - roots.curIndex));
}

// a<b<c or a>b>c
function between(a: number, b: number, c: number) {
    return (a - b) * (c - b) <= 0;
}
// 简单检查点是否在线段上
function checkOnCurve(x: number, y: number, start: Point, end: Point) {
    if (start.y == end.y) {
        return between(start.x, x, end.x) && x != end.x;
    } else {
        return x == start.x && y == start.y;
    }
}
/**
 *  Returns -1 || 0 || 1 depending on the sign of value:
 *  -1 if x < 0
 *   0 if x == 0
 *   1 if x > 0
 */
function signAsInt(x: number) {
    return x < 0 ? -1 : Number(x > 0);
}
function winding_line(pts: Point[], x: number, y: number, onCurveCount: Ref<number>) {
    let x0 = pts[0].x;
    let y0 = pts[0].y;
    let x1 = pts[1].x;
    let y1 = pts[1].y;

    let dy = y1 - y0;

    let dir = 1;
    if (y0 > y1) {
        let _tmp = y0;
        y0 = y1;
        y1 = _tmp
        dir = -1;
    }
    if (y < y0 || y > y1) {
        return 0;
    }
    if (checkOnCurve(x, y, pts[0], pts[1])) {
        onCurveCount.value += 1;
        return 0;
    }
    if (y == y1) {
        return 0;
    }
    // Ax+By+C=0
    // (x-x0)dy=(y-y0)dx A=dy B=-dx C=(dx*y0-dy*x0)=(x1-x0)y0-(y1-y0)x0=x1y0-y1x0
    // 点与直线的关系：
    // 点在直线左侧：A(x-x0)+B(y-y0)<0
    // 点在直线右侧：A(x-x0)+B(y-y0)>0
    // 点在直线上：A(x-x0)+B(y-y0)=0
    // 点与直线的距离：|A(x-x0)+B(y-y0)|/sqrt(A^2+B^2)
    
    // 判断点如果在左侧就大于0
    let cross = (x1 - x0) * (y - pts[0].y) - dy * (x - x0);

    if (!cross) {
        //过零意味着该点在直线上，并且由于
        //y的查询点是在上面处理的终点，我们可以
        //确保我们在这条线上（不包括终点）
        if (x != x1 || y != pts[1].y) {
            onCurveCount.value += 1;
        }
        dir = 0;
    } else if (signAsInt(cross) == dir) {
        dir = 0;
    }
    return dir;
}

function is_mono_quad(y0: number, y1: number, y2: number) {
    if (y0 == y1) {
        return true;
    }
    if (y0 < y1) {
        return y1 <= y2;
    } else {
        return y1 >= y2;
    }
}
// At^2+Bt+C
function poly_eval(A: number, B: number, C: number, t: number) {
    return (A * t + B) * t + C;
}
// At^2+Bt^2+Ct+D
function poly_eval_5(A: number, B: number, C: number, D: number, t: number) {
    return ((A * t + B) * t + C) * t + D;
}
function winding_mono_quad(pts: Point[], x: number, y: number, onCurveCount: Ref<number>) {
    let y0 = pts[0].y;
    let y2 = pts[2].y;

    let dir = 1;
    if (y0 > y2) {
        let _tmp = y0;
        y0 = y2;
        y2 = _tmp;
        dir = -1;
    }
    if (y < y0 || y > y2) {
        return 0;
    }
    if (checkOnCurve(x, y, pts[0], pts[2])) {
        onCurveCount.value += 1;
        return 0;
    }
    if (y == y2) {
        return 0;
    }


    let roots = PointerArray.from([0, 0]);
    let n = SkFindUnitQuadRoots(pts[0].y - 2 * pts[1].y + pts[2].y,
        2 * (pts[1].y - pts[0].y),
        pts[0].y - y,
        roots);

    let xt;
    if (0 == n) {
        // zero roots are returned only when y0 == y
        // Need [0] if dir == 1
        // and  [2] if dir == -1
        xt = pts[1 - dir].x;
    } else {
        let t = roots.get(0);
        let C = pts[0].x;
        let A = pts[2].x - 2 * pts[1].x + C;
        let B = 2 * (pts[1].x - C);
        xt = poly_eval(A, B, C, t);
    }
    if (equalsEpsilon(xt, x)) {
        if (x != pts[2].x || y != pts[2].y) {  // don't test end points; they're start points
            onCurveCount.value += 1;
            return 0;
        }
    }
    return xt < x ? dir : 0;
}
function find_minmax(N: number, pts: Point[], minPtr: Ref<number>, maxPtr: Ref<number>) {
    let min, max;
    min = max = pts[0].x;
    for (let i = 1; i < N; ++i) {
        min = Math.min(min, pts[i].x);
        max = Math.max(max, pts[i].x);
    }
    minPtr.value = min;
    maxPtr.value = max;
}
function eval_cubic_pts(c0: number, c1: number, c2: number, c3: number, t: number) {
    let A = c3 + 3 * (c1 - c2) - c0;
    let B = 3 * (c2 - c1 - c1 + c0);
    let C = 3 * (c1 - c0);
    let D = c0;
    return poly_eval_5(A, B, C, D, t);
}
function winding_mono_cubic(pts: Point[], x: number, y: number, onCurveCount: Ref<number>) {
    let y0 = pts[0].y;
    let y3 = pts[3].y;

    let dir = 1;
    if (y0 > y3) {
        let _tmp = y0;
        y0 = y3;
        y3 = _tmp;
        dir = -1;
    }
    if (y < y0 || y > y3) {
        return 0;
    }
    if (checkOnCurve(x, y, pts[0], pts[3])) {
        onCurveCount.value += 1;
        return 0;
    }
    if (y == y3) {
        return 0;
    }

    // quickreject or quickaccept
    let min = Ref.from(Infinity), max = Ref.from(-Infinity);
    find_minmax(4, pts, min, max);
    if (x < min.value) {
        return 0;
    }
    if (x > max.value) {
        return dir;
    }

    // compute the actual x(t) value
    let t = Ref.from(0);
    if (!ChopMonoAtY(pts as any, y, t as any)) {
        return 0;
    }
    let xt = eval_cubic_pts(pts[0].x, pts[1].x, pts[2].x, pts[3].x, t.value);
    if (equalsEpsilon(xt, x)) {
        if (x != pts[3].x || y != pts[3].y) {  // don't test end points; they're start points
            onCurveCount.value += 1;
            return 0;
        }
    }
    return xt < x ? dir : 0;
}
function winding_quad(pts: Point[], x: number, y: number, onCurveCount: Ref<number>) {
    let dst: Point[] = Array.from({ length: 5 }, () => Point.default());
    let n = 0;

    if (!is_mono_quad(pts[0].y, pts[1].y, pts[2].y)) {
        n = computeQuadExtremas(pts, dst);
        pts = dst;
    }
    let w = winding_mono_quad(pts, x, y, onCurveCount);
    if (n > 0) {
        w += winding_mono_quad(pts.slice(2), x, y, onCurveCount);
    }
    return w;
}

function winding_cubic(pts: Point[], x: number, y: number, onCurveCount: Ref<number>) {
    let dst: Point[] = Array.from({ length: 10 }, () => Point.default());
    let n = computeCubicExtremas(pts, dst);
    let w = 0;
    for (let i = 0; i <= n; ++i) {
        w += winding_mono_cubic(dst.slice(i * 3), x, y, onCurveCount);
    }
    return w;
}
function conic_eval_numerator(src: number[], w: number, t: number) {

    let src2w = src[1] * w;
    let C = src[0];
    let A = src[2] - 2 * src2w + C;
    let B = 2 * (src2w - C);
    return poly_eval(A, B, C, t);
}
function conic_eval_denominator(w: number, t: number) {
    let B = 2 * (w - 1);
    let C = 1;
    let A = -B;
    return poly_eval(A, B, C, t);
}
function winding_mono_conic(conic: SkConic, x: number, y: number, onCurveCount: Ref<number>) {
    const pts = conic.pts;
    let y0 = pts[0].y;
    let y2 = pts[2].y;

    let dir = 1;
    if (y0 > y2) {
        let _tmp = y0;
        y0 = y2;
        y2 = _tmp;
        dir = -1;
    }
    if (y < y0 || y > y2) {
        return 0;
    }
    if (checkOnCurve(x, y, pts[0], pts[2])) {
        onCurveCount.value += 1;
        return 0;
    }
    if (y == y2) {
        return 0;
    }

    let roots = PointerArray.from([0, 0]);
    let A = pts[2].y;
    let B = pts[1].y * conic.w - y * conic.w + y;
    let C = pts[0].y;
    A += C - 2 * B;  // A = a + c - 2*(b*w - yCept*w + yCept)
    B -= C;  // B = b*w - w * yCept + yCept - a
    C -= y;
    let n = SkFindUnitQuadRoots(A, 2 * B, C, roots);

    let xt = 0;
    if (0 == n) {
        // zero roots are returned only when y0 == y
        // Need [0] if dir == 1
        // and  [2] if dir == -1
        xt = pts[1 - dir].x;
    } else {
        let t = roots.get(0);
        xt = conic_eval_numerator(pts.map(d => d.x), conic.w, t) / conic_eval_denominator(conic.w, t);
    }
    if (equalsEpsilon(xt, x)) {
        if (x != pts[2].x || y != pts[2].y) {  // don't test end points; they're start points
            onCurveCount.value += 1;
            return 0;
        }
    }
    return xt < x ? dir : 0;
}
function winding_conic(pts: Point[], x: number, y: number, weight: number, onCurveCount: Ref<number>) {
    let conic = new SkConic(pts, weight);
    let chopped = [SkConic.default(), SkConic.default()];
    // If the data points are very large, the conic may not be monotonic but may also
    // fail to chop. Then, the chopper does not split the original conic in two.
    let isMono = is_mono_quad(pts[0].y, pts[1].y, pts[2].y) || !conic.chopAtYExtrema(chopped);
    let w = winding_mono_conic(isMono ? conic : chopped[0], x, y, onCurveCount);
    if (!isMono) {
        w += winding_mono_conic(chopped[1], x, y, onCurveCount);
    }
    return w;
}

function tangent_line(pts: Point[], x: number, y: number, tangents: Point[]) {
    let y0 = pts[0].y;
    let y1 = pts[1].y;
    if (!between(y0, y, y1)) {
        return;
    }
    let x0 = pts[0].x;
    let x1 = pts[1].x;
    if (!between(x0, x, x1)) {
        return;
    }
    let dx = x1 - x0;
    let dy = y1 - y0;
    if (!equalsEpsilon((x - x0) * dy, dx * (y - y0))) {
        return;
    }
    let v = Point.default();
    v.set(dx, dy);
    tangents.push(v)
}


function tangent_quad(pts: Point[], x: number, y: number, tangents: Point[]) {
    if (!between(pts[0].y, y, pts[1].y) && !between(pts[1].y, y, pts[2].y)) {
        return;
    }
    if (!between(pts[0].x, x, pts[1].x) && !between(pts[1].x, x, pts[2].x)) {
        return;
    }
    let roots = PointerArray.from([0, 0]);
    let n = SkFindUnitQuadRoots(pts[0].y - 2 * pts[1].y + pts[2].y,
        2 * (pts[1].y - pts[0].y),
        pts[0].y - y,
        roots);
    for (let index = 0; index < n; ++index) {
        let t = roots.get(index);
        let C = pts[0].x;
        let A = pts[2].x - 2 * pts[1].x + C;
        let B = 2 * (pts[1].x - C);
        let xt = poly_eval(A, B, C, t);
        if (!equalsEpsilon(x, xt)) {
            continue;
        }
        tangents.push(quadraticBezierTangentAt(pts[0],pts[1],pts[2], t));
    }
}


function tangent_cubic(pts: Point[], x: number, y: number, tangents: Point[]) {
    if (!between(pts[0].y, y, pts[1].y) && !between(pts[1].y, y, pts[2].y)
        && !between(pts[2].y, y, pts[3].y)) {
        return;
    }
    if (!between(pts[0].x, x, pts[1].x) && !between(pts[1].x, x, pts[2].x)
        && !between(pts[2].x, x, pts[3].x)) {
        return;
    }
    let dst = Array.from({ length: 10 }, () => Point.default());
    let n = SkChopCubicAtYExtrema(pts, dst);
    for (let i = 0; i <= n; ++i) {
        let c = dst.slice(i * 3)
        let t = Ref.from(0);
        if (!ChopMonoAtY(c, y, t)) {
            continue;
        }
        let xt = eval_cubic_pts(c[0].x, c[1].x, c[2].x, c[3].x, t.value);
        if (!equalsEpsilon(x, xt)) {
            continue;
        }
        let tangent = Point.default();
        evalCubicAt(c, t.value, null, tangent, null);
        tangents.push(tangent);
    }
}


function tangent_conic(pts: Point[], x: number, y: number, w: number, tangents: Point[]) {
    if (!between(pts[0].y, y, pts[1].y) && !between(pts[1].y, y, pts[2].y)) {
        return;
    }
    if (!between(pts[0].y, x, pts[1].y) && !between(pts[1].y, x, pts[2].y)) {
        return;
    }
    let roots = PointerArray.from([0, 0]);
    let A = pts[2].y;
    let B = pts[1].y * w - y * w + y;
    let C = pts[0].y;
    A += C - 2 * B;  // A = a + c - 2*(b*w - yCept*w + yCept)
    B -= C;  // B = b*w - w * yCept + yCept - a
    C -= y;
    let n = SkFindUnitQuadRoots(A, 2 * B, C, roots);
    for (let index = 0; index < n; ++index) {
        let t = roots.get(index);
        let xt = conic_eval_numerator(pts.map(d => d.y), w, t) / conic_eval_denominator(w, t);
        if (!equalsEpsilon(x, xt)) {
            continue;
        }
        let conic = new SkConic(pts, w);
        tangents.push(conic.evalTangentAt(t));
    }
}


export {
    winding_line,
    winding_conic,
    winding_cubic,
    winding_quad,
    tangent_conic,
    tangent_cubic,
    tangent_line,
    tangent_quad
}