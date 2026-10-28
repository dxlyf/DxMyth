/**
 * 移植自 paper/src/util/Numerical.js。
 *
 * 数值工具:epsilon 比较、求根与积分。这里只是一个普通命名空间对象，不需要类。
 */

// n = 2 .. 16 的横坐标与权重查找表。
// 由于数值对称，只保存一半，算法里再利用对称性。
const abscissas = [
    [0.5773502691896257645091488],
    [0, 0.7745966692414833770358531],
    [0.3399810435848562648026658, 0.8611363115940525752239465],
    [0, 0.5384693101056830910363144, 0.9061798459386639927976269],
    [0.2386191860831969086305017, 0.6612093864662645136613996, 0.9324695142031520278123016],
    [0, 0.4058451513773971669066064, 0.7415311855993944398638648, 0.9491079123427585245261897],
    [0.1834346424956498049394761, 0.5255324099163289858177390, 0.7966664774136267395915539, 0.9602898564975362316835609],
    [0, 0.3242534234038089290385380, 0.6133714327005903973087020, 0.8360311073266357942994298, 0.9681602395076260898355762],
    [0.1488743389816312108848260, 0.4333953941292471907992659, 0.6794095682990244062343274, 0.8650633666889845107320967, 0.9739065285171717200779640],
    [0, 0.2695431559523449723315320, 0.5190961292068118159257257, 0.7301520055740493240934163, 0.8870625997680952990751578, 0.9782286581460569928039380],
    [0.1252334085114689154724414, 0.3678314989981801937526915, 0.5873179542866174472967024, 0.7699026741943046870368938, 0.9041172563704748566784659, 0.9815606342467192506905491],
    [0, 0.2304583159551347940655281, 0.4484927510364468528779129, 0.6423493394403402206439846, 0.8015780907333099127942065, 0.9175983992229779652065478, 0.9841830547185881494728294],
    [0.1080549487073436620662447, 0.3191123689278897604356718, 0.5152486363581540919652907, 0.6872929048116854701480198, 0.8272013150697649931897947, 0.9284348836635735173363911, 0.9862838086968123388415973],
    [0, 0.2011940939974345223006283, 0.3941513470775633698972074, 0.5709721726085388475372267, 0.7244177313601700474161861, 0.8482065834104272162006483, 0.9372733924007059043077589, 0.9879925180204854284895657],
    [0.0950125098376374401853193, 0.2816035507792589132304605, 0.4580167776572273863424194, 0.6178762444026437484466718, 0.7554044083550030338951012, 0.8656312023878317438804679, 0.9445750230732325760779884, 0.9894009349916499325961542]
];

const weights = [
    [1],
    [0.8888888888888888888888889, 0.5555555555555555555555556],
    [0.6521451548625461426269361, 0.3478548451374538573730639],
    [0.5688888888888888888888889, 0.4786286704993664680412915, 0.2369268850561890875142640],
    [0.4679139345726910473898703, 0.3607615730481386075698335, 0.1713244923791703450402961],
    [0.4179591836734693877551020, 0.3818300505051189449503698, 0.2797053914892766679014678, 0.1294849661688696932706114],
    [0.3626837833783619829651504, 0.3137066458778872873379622, 0.2223810344533744705443560, 0.1012285362903762591525314],
    [0.3302393550012597631645251, 0.3123470770400028400686304, 0.2606106964029354623187429, 0.1806481606948574040584720, 0.0812743883615744119718922],
    [0.2955242247147528701738930, 0.2692667193099963550912269, 0.2190863625159820439955349, 0.1494513491505805931457763, 0.0666713443086881375935688],
    [0.2729250867779006307144835, 0.2628045445102466621806889, 0.2331937645919904799185237, 0.1862902109277342514260976, 0.1255803694649046246346943, 0.0556685671161736664827537],
    [0.2491470458134027850005624, 0.2334925365383548087608499, 0.2031674267230659217490645, 0.1600783285433462263346525, 0.1069393259953184309602547, 0.0471753363865118271946160],
    [0.2325515532308739101945895, 0.2262831802628972384120902, 0.2078160475368885023125232, 0.1781459807619457382800467, 0.1388735102197872384636018, 0.0921214998377284479144218, 0.0404840047653158795200216],
    [0.2152638534631577901958764, 0.2051984637212956039659241, 0.1855383974779378137417166, 0.1572031671581935345696019, 0.1215185706879031846894148, 0.0801580871597602098056333, 0.0351194603317518630318329],
    [0.2025782419255612728806202, 0.1984314853271115764561183, 0.1861610000155622110268006, 0.1662692058169939335532009, 0.1395706779261543144478048, 0.1071592204671719350118695, 0.0703660474881081247092674, 0.0307532419961172683546284],
    [0.1894506104550684962853967, 0.1826034150449235888667637, 0.1691565193950025381893121, 0.1495959888165767320815017, 0.1246289712555338720524763, 0.0951585116824927848099251, 0.0622535239386478928628438, 0.0271524594117540948517806]
];

// 常用数学方法的快捷引用与常量
const abs = Math.abs,
    sqrt = Math.sqrt,
    pow = Math.pow,
    // 回退用的 polyfill:
    log2 = Math.log2 || function(x: number) {
        return Math.log(x) * Math.LOG2E;
    },
    // 常量
    EPSILON = 1e-12,
    MACHINE_EPSILON = 1.12e-16;

/** 把数值限制在给定区间内。 */
export function clamp(value: number, min: number, max: number): number {
    return value < min ? min : value > max ? max : value;
}

function getDiscriminant(a: number, b: number, c: number): number {
    // d = b^2 - a * c，用下面的技巧可以算得足够精确。
    // 移植自 @hkrish 的 polysolve.c
    function split(v: number): [number, number] {
        const x = v * 134217729,
            y = v - x,
            hi = y + x, // 不要把 y 优化掉！
            lo = v - hi;
        return [hi, lo];
    }

    let D = b * b - a * c;
    const E = b * b + a * c;
    if (abs(D) * 3 < E) {
        const ad = split(a),
            bd = split(b),
            cd = split(c),
            p = b * b,
            dp = (bd[0] * bd[0] - p + 2 * bd[0] * bd[1]) + bd[1] * bd[1],
            q = a * c,
            dq = (ad[0] * cd[0] - q + ad[0] * cd[1] + ad[1] * cd[0])
                    + ad[1] * cd[1];
        D = (p - q) + (dp - dq); // 不要省略括号！
    }
    return D;
}

function getNormalizationFactor(...values: number[]): number {
    // 按 Jenkins & Traub 的 RPOLY 方式归一化系数。
    // 用 2 的幂缩放系数，使尾数的所有位保持不变。用无穷范数
    // (max(sum(abs(a)...))) 决定合适的缩放因子。
    const norm = Math.max.apply(Math, values);
    return norm && (norm < 1e-8 || norm > 1e8)
            ? pow(2, -Math.round(log2(norm)))
            : 0;
}

export const Numerical = {
    /** 判断数值是否接近 0 时使用的极小绝对值。 */
    EPSILON,
    /** 双精度（Javascript Number）机器 epsilon 的一半。 */
    MACHINE_EPSILON,
    /** 处理 curve-time 参数时使用的 epsilon。 */
    CURVETIME_EPSILON: 1e-8,
    /** 做"几何"判断（如点到直线的距离）时使用的 epsilon。 */
    GEOMETRIC_EPSILON: 1e-7,
    /** 做"三角"判断（如共线性）时使用的 epsilon。 */
    TRIGONOMETRIC_EPSILON: 1e-8,
    /** 按角度（度）判断时使用的 epsilon，例如 `arcTo()` 中。 */
    ANGULAR_EPSILON: 1e-5,
    /**
     * Kappa 是用贝塞尔曲线绘制圆时缩放控制柄所用的值。
     */
    KAPPA: 4 * (sqrt(2) - 1) / 3,

    /**
     * 返回按给定量级比较坐标时的容差:EPSILON 或更大的可选 epsilon，或在低于
     * 坐标分辨率时取最后一位的两个单位，使相接的数值仍被判定为相接 (#1940)。
     */
    getEpsilon(magnitude: number, epsilon?: number): number {
        return Math.max(EPSILON, magnitude * 4 * MACHINE_EPSILON,
                epsilon || 0);
    },

    /** 判断数值在 EPSILON 容差内是否为 0。 */
    isZero(val: number): boolean {
        return val >= -EPSILON && val <= EPSILON;
    },

    isMachineZero(val: number): boolean {
        return val >= -MACHINE_EPSILON && val <= MACHINE_EPSILON;
    },

    clamp,

    /** 高斯-勒让德数值积分。 */
    integrate(f: (x: number) => number, a: number, b: number,
            n: number): number {
        const x = abscissas[n - 2],
            w = weights[n - 2],
            A = (b - a) * 0.5,
            B = A + a,
            m = (n + 1) >> 1;
        let i = 0,
            sum = n & 1 ? w[i++] * f(B) : 0; // 处理奇数 n
        while (i < m) {
            const Ax = A * x[i];
            sum += w[i++] * (f(B + Ax) + f(B - Ax));
        }
        return A * sum;
    },

    /** 结合二分法的牛顿-拉夫逊求根。 */
    findRoot(f: (x: number) => number, df: (x: number) => number, x: number,
            a: number, b: number, n: number, tolerance: number): number {
        for (let i = 0; i < n; i++) {
            const fx = f(x),
                // 用牛顿-拉夫逊法计算下一个候选值。
                dx = fx / df(x),
                nx = x - dx;
            // 看牛顿-拉夫逊的结果是否可信，不可信就用二分法找另一个候选值。
            if (abs(dx) < tolerance) {
                x = nx;
                break;
            }
            // 更新求根区间并检查候选值是否落在其中；落在外面就用二分法。
            // 不需要比较上下界，因为切线斜率为正，保证 x 轴截距大于下界、
            // 小于上界。
            if (fx > 0) {
                b = x;
                x = nx <= a ? (a + b) * 0.5 : nx;
            } else {
                a = x;
                x = nx >= b ? (a + b) * 0.5 : nx;
            }
        }
        // 即使还没足够接近根，也返回当前最好的结果……但要确保它确实在给定
        // 区间 [a, b] 内。
        return clamp(x, a, b);
    },

    /**
     * 用 ITP 方法找出函数在 `a` 与 `b` 之间变号的位置，已知两端取值 `fa`、
     * `fb` 异号。它在该快的地方和割线法一样快，且永远不会慢于二分法。
     * 参考 kurbo 的 solve_itp()。
     */
    findSignChange(f: (x: number) => number, a: number, b: number, fa: number,
            fb: number, tolerance: number): number {
        // 从负值变为正值的符号变化:
        const sign = fa < 0 ? 1 : -1,
            steps = Math.max(Math.ceil(log2((b - a) / tolerance)) - 1, 0),
            // 把步数限制为二分法步数加一:
            k1 = 0.2 / (b - a);
        let scaled = tolerance * Math.pow(2, steps + 1);
        fa *= sign;
        fb *= sign;
        while (b - a > 2 * tolerance) {
            const half = (a + b) / 2,
                r = scaled - (b - a) / 2,
                // 割线，略微向中间收:
                xf = (fb * a - fa * b) / (fb - fa),
                sigma = half - xf,
                delta = k1 * (b - a) * (b - a),
                xt = delta <= abs(sigma)
                    ? xf + (sigma < 0 ? -delta : delta) : half,
                x = abs(xt - half) <= r
                    ? xt : half - (sigma < 0 ? -r : r),
                fx = sign * f(x);
            if (fx > 0) {
                b = x;
                fb = fx;
            } else if (fx < 0) {
                a = x;
                fa = fx;
            } else {
                return x;
            }
            scaled /= 2;
        }
        return (a + b) / 2;
    },

    /**
     * 以数值稳定的方式求解一元二次方程 ax^2 + bx + c = 0 的 x 值。
     *
     * @return 找到的实根个数；如果有无穷多解则返回 -1
     */
    solveQuadratic(a: number, b: number, c: number, roots: number[],
            min?: number, max?: number): number {
        let x1: number, x2: number = Infinity;
        if (abs(a) < EPSILON) {
            // 这可能只是一个一次方程
            if (abs(b) < EPSILON)
                return abs(c) < EPSILON ? -1 : 0;
            x1 = -c / b;
        } else {
            // 期望 a、b、c 是方程 Ax^2 - 2Bx + C == 0 的系数，因此取
            // b = -b/2:
            b *= -0.5;
            let D = getDiscriminant(a, b, c);
            // 判别式非常小时，可以试着归一化系数以获得更好的精度。
            if (D && abs(D) < MACHINE_EPSILON) {
                const f = getNormalizationFactor(abs(a), abs(b), abs(c));
                if (f) {
                    a *= f;
                    b *= f;
                    c *= f;
                    D = getDiscriminant(a, b, c);
                }
            }
            if (D >= -MACHINE_EPSILON) { // D < 0 时没有实根
                const Q = D < 0 ? 0 : sqrt(D),
                    R = b + (b < 0 ? -Q : Q);
                // 尽量减少浮点噪声。
                if (R === 0) {
                    x1 = c / a;
                    x2 = -x1;
                } else {
                    x1 = R / a;
                    x2 = c / R;
                }
            }
        }
        let count = 0;
        const boundless = min == null,
            minB = min - EPSILON,
            maxB = max + EPSILON;
        // 与 min / max 比较时需要把 EPSILON 算进去，因为有些解会略微越界。
        if (isFinite(x1) && (boundless || x1 > minB && x1 < maxB))
            roots[count++] = boundless ? x1 : clamp(x1, min, max);
        if (x2 !== x1
                && isFinite(x2) && (boundless || x2 > minB && x2 < maxB))
            roots[count++] = boundless ? x2 : clamp(x2, min, max);
        return count;
    },

    /**
     * 用数值稳定的方法求解一元三次方程 ax^3 + bx^2 + cx + d = 0。
     *
     * @return 找到的实根个数；如果有无穷多解则返回 -1
     */
    solveCubic(a: number, b: number, c: number, d: number, roots: number[],
            min?: number, max?: number): number {
        const f = getNormalizationFactor(abs(a), abs(b), abs(c), abs(d));
        let x: number, b1: number, c2: number, qd: number, q: number;
        if (f) {
            a *= f;
            b *= f;
            c *= f;
            d *= f;
        }

        function evaluate(x0: number): void {
            x = x0;
            // 在 x 处求 q、q'、b1 和 c2
            const tmp = a * x;
            b1 = tmp + b;
            c2 = b1 * x + c;
            qd = (tmp + b1) * x + c2;
            q = c2 * x + d;
        }

        // 如果 a 或 d 为 0，只需解一个二次方程，因此相应设置系数。
        if (abs(a) < EPSILON) {
            a = b;
            b1 = c;
            c2 = d;
            x = Infinity;
        } else if (abs(d) < EPSILON) {
            b1 = b;
            c2 = c;
            x = 0;
        } else {
            // 从这里开始迭代求最左边的根。迭代会顺带把三次方程降为二次方程，
            // 然后再解这个二次方程。
            evaluate(-(b / a) / 3);
            // 取一个好的初始近似值。
            const t = q / a,
                r = pow(abs(t), 1 / 3),
                s = t < 0 ? -1 : 1,
                td = -qd / a,
                // 关于为什么 1.324718*... 有效，见 Kahan 的笔记。
                rd = td > 0
                    ? 1.324717957244746 * Math.max(r, sqrt(td)) : r,
                x0 = x - s * rd;
            if (x0 !== x) {
                let xr = x0;
                do {
                    evaluate(xr);
                    // 牛顿法。除以 1 + MACHINE_EPSILON（1.000...002）以避免
                    // x0 越过根。
                    xr = qd === 0 ? x : x - q / qd / (1 + MACHINE_EPSILON);
                } while (s * xr > s * x);
                // 为二次方程调整系数。
                if (abs(a) * x * x > abs(d / x)) {
                    c2 = -d / x;
                    b1 = (c2 - c) / x;
                }
            }
        }
        // 三次方程已经降为二次方程。
        let count = Numerical.solveQuadratic(a, b1, c2, roots, min, max);
        const boundless = min == null;
        if (isFinite(x) && (count === 0
                || count > 0 && x !== roots[0] && x !== roots[1])
                && (boundless || x > min - EPSILON && x < max + EPSILON))
            roots[count++] = boundless ? x : clamp(x, min, max);
        return count;
    },

    /**
     * 求出 Bernstein 形式多项式在 [0, 1] 上的根:不断细分，直到每一段的系数
     * 至多变号一次。没有变号的段没有根，变号一次的段恰有一个根，因为
     * Bernstein 形式具有变差缩减性。落在舍入误差内的系数按 0 处理:只有这类
     * 系数的段算作一个根，比给定宽度还窄、仍可能含根的段也算作一个根。
     */
    solveBernstein(coefficients: number[], errors: number[], roots: number[],
            width: number): number {
        let count = 0;

        // 用 de Casteljau 算法在中点拆分系数，误差也随之拆分，并计入每一步的
        // 舍入误差:
        function subdivide(values: number[], bounds: number[]): number[][] {
            const left: number[] = [],
                right: number[] = [],
                leftBounds: number[] = [],
                rightBounds: number[] = [],
                v = values.slice(),
                e = bounds.slice();
            for (let n = v.length; n > 0; n--) {
                left.push(v[0]);
                right.unshift(v[n - 1]);
                leftBounds.push(e[0]);
                rightBounds.unshift(e[n - 1]);
                for (let i = 0; i < n - 1; i++) {
                    v[i] = (v[i] + v[i + 1]) / 2;
                    e[i] = (e[i] + e[i + 1]) / 2 + MACHINE_EPSILON * abs(v[i]);
                }
            }
            return [left, right, leftBounds, rightBounds];
        }

        function evaluate(values: number[], t: number): number {
            const v = values.slice();
            for (let n = v.length - 1; n > 0; n--) {
                for (let i = 0; i < n; i++)
                    v[i] = v[i] + (v[i + 1] - v[i]) * t;
            }
            return v[0];
        }

        function solve(values: number[], bounds: number[], from: number,
                to: number): void {
            let changes = 0,
                zeros = 0,
                sign = 0;
            for (let i = 0, l = values.length; i < l; i++) {
                const value = values[i];
                if (abs(value) <= bounds[i]) {
                    zeros++;
                } else {
                    const s = value > 0 ? 1 : -1;
                    if (sign && s !== sign)
                        changes++;
                    sign = s;
                }
            }
            if (zeros === values.length
                    || (changes || zeros) && to - from <= width) {
                roots[count++] = (from + to) / 2;
            } else if (changes === 1 && !zeros) {
                // 恰好一个根，位于两端之间，二分法把它精确到数字精度的极限:
                let a = 0,
                    b = 1;
                const isNegative = values[0] < 0;
                while (from + (to - from) * a < from + (to - from) * b
                        && (a + b) / 2 > a && (a + b) / 2 < b) {
                    const t = (a + b) / 2;
                    if (evaluate(values, t) < 0 === isNegative) {
                        a = t;
                    } else {
                        b = t;
                    }
                }
                roots[count++] = from + (to - from) * (a + b) / 2;
            } else if (changes || zeros) {
                const parts = subdivide(values, bounds),
                    middle = (from + to) / 2;
                solve(parts[0], parts[2], from, middle);
                solve(parts[1], parts[3], middle, to);
            }
        }

        solve(coefficients, errors, 0, 1);
        return count;
    }
};
