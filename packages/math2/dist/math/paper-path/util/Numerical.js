const abscissas = [
  [0.5773502691896257],
  [0, 0.7745966692414834],
  [0.33998104358485626, 0.8611363115940526],
  [0, 0.5384693101056831, 0.906179845938664],
  [0.2386191860831969, 0.6612093864662645, 0.932469514203152],
  [0, 0.4058451513773972, 0.7415311855993945, 0.9491079123427585],
  [0.1834346424956498, 0.525532409916329, 0.7966664774136267, 0.9602898564975363],
  [0, 0.3242534234038089, 0.6133714327005904, 0.8360311073266358, 0.9681602395076261],
  [0.14887433898163122, 0.4333953941292472, 0.6794095682990244, 0.8650633666889845, 0.9739065285171717],
  [0, 0.26954315595234496, 0.5190961292068118, 0.7301520055740494, 0.8870625997680953, 0.978228658146057],
  [0.1252334085114689, 0.3678314989981802, 0.5873179542866175, 0.7699026741943047, 0.9041172563704749, 0.9815606342467192],
  [0, 0.2304583159551348, 0.44849275103644687, 0.6423493394403402, 0.8015780907333099, 0.9175983992229779, 0.9841830547185881],
  [0.10805494870734367, 0.31911236892788974, 0.5152486363581541, 0.6872929048116855, 0.827201315069765, 0.9284348836635735, 0.9862838086968123],
  [0, 0.20119409399743451, 0.3941513470775634, 0.5709721726085388, 0.7244177313601701, 0.8482065834104272, 0.937273392400706, 0.9879925180204854],
  [0.09501250983763744, 0.2816035507792589, 0.45801677765722737, 0.6178762444026438, 0.755404408355003, 0.8656312023878318, 0.9445750230732326, 0.9894009349916499]
];
const weights = [
  [1],
  [0.8888888888888888, 0.5555555555555556],
  [0.6521451548625461, 0.34785484513745385],
  [0.5688888888888889, 0.47862867049936647, 0.23692688505618908],
  [0.46791393457269104, 0.3607615730481386, 0.17132449237917036],
  [0.4179591836734694, 0.3818300505051189, 0.27970539148927664, 0.1294849661688697],
  [0.362683783378362, 0.31370664587788727, 0.22238103445337448, 0.10122853629037626],
  [0.3302393550012598, 0.31234707704000286, 0.26061069640293544, 0.1806481606948574, 0.08127438836157441],
  [0.29552422471475287, 0.26926671930999635, 0.21908636251598204, 0.1494513491505806, 0.06667134430868814],
  [0.2729250867779006, 0.26280454451024665, 0.23319376459199048, 0.18629021092773426, 0.1255803694649046, 0.05566856711617366],
  [0.24914704581340277, 0.2334925365383548, 0.20316742672306592, 0.16007832854334622, 0.10693932599531843, 0.04717533638651183],
  [0.2325515532308739, 0.22628318026289723, 0.2078160475368885, 0.17814598076194574, 0.13887351021978725, 0.09212149983772845, 0.04048400476531588],
  [0.2152638534631578, 0.2051984637212956, 0.18553839747793782, 0.15720316715819355, 0.12151857068790319, 0.08015808715976021, 0.03511946033175186],
  [0.2025782419255613, 0.19843148532711158, 0.1861610000155622, 0.16626920581699392, 0.13957067792615432, 0.10715922046717194, 0.07036604748810812, 0.03075324199611727],
  [0.1894506104550685, 0.18260341504492358, 0.16915651939500254, 0.14959598881657674, 0.12462897125553388, 0.09515851168249279, 0.062253523938647894, 0.027152459411754096]
];
const abs = Math.abs, sqrt = Math.sqrt, pow = Math.pow, log2 = Math.log2 || function(x) {
  return Math.log(x) * Math.LOG2E;
}, EPSILON = 1e-12, MACHINE_EPSILON = 112e-18;
function clamp(value, min, max) {
  return value < min ? min : value > max ? max : value;
}
function getDiscriminant(a, b, c) {
  function split(v) {
    const x = v * 134217729, y = v - x, hi = y + x, lo = v - hi;
    return [hi, lo];
  }
  let D = b * b - a * c;
  const E = b * b + a * c;
  if (abs(D) * 3 < E) {
    const ad = split(a), bd = split(b), cd = split(c), p = b * b, dp = bd[0] * bd[0] - p + 2 * bd[0] * bd[1] + bd[1] * bd[1], q = a * c, dq = ad[0] * cd[0] - q + ad[0] * cd[1] + ad[1] * cd[0] + ad[1] * cd[1];
    D = p - q + (dp - dq);
  }
  return D;
}
function getNormalizationFactor(...values) {
  const norm = Math.max.apply(Math, values);
  return norm && (norm < 1e-8 || norm > 1e8) ? pow(2, -Math.round(log2(norm))) : 0;
}
const Numerical = {
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
  getEpsilon(magnitude, epsilon) {
    return Math.max(
      EPSILON,
      magnitude * 4 * MACHINE_EPSILON,
      epsilon || 0
    );
  },
  /** 判断数值在 EPSILON 容差内是否为 0。 */
  isZero(val) {
    return val >= -EPSILON && val <= EPSILON;
  },
  isMachineZero(val) {
    return val >= -MACHINE_EPSILON && val <= MACHINE_EPSILON;
  },
  clamp,
  /** 高斯-勒让德数值积分。 */
  integrate(f, a, b, n) {
    const x = abscissas[n - 2], w = weights[n - 2], A = (b - a) * 0.5, B = A + a, m = n + 1 >> 1;
    let i = 0, sum = n & 1 ? w[i++] * f(B) : 0;
    while (i < m) {
      const Ax = A * x[i];
      sum += w[i++] * (f(B + Ax) + f(B - Ax));
    }
    return A * sum;
  },
  /** 结合二分法的牛顿-拉夫逊求根。 */
  findRoot(f, df, x, a, b, n, tolerance) {
    for (let i = 0; i < n; i++) {
      const fx = f(x), dx = fx / df(x), nx = x - dx;
      if (abs(dx) < tolerance) {
        x = nx;
        break;
      }
      if (fx > 0) {
        b = x;
        x = nx <= a ? (a + b) * 0.5 : nx;
      } else {
        a = x;
        x = nx >= b ? (a + b) * 0.5 : nx;
      }
    }
    return clamp(x, a, b);
  },
  /**
   * 用 ITP 方法找出函数在 `a` 与 `b` 之间变号的位置，已知两端取值 `fa`、
   * `fb` 异号。它在该快的地方和割线法一样快，且永远不会慢于二分法。
   * 参考 kurbo 的 solve_itp()。
   */
  findSignChange(f, a, b, fa, fb, tolerance) {
    const sign = fa < 0 ? 1 : -1, steps = Math.max(Math.ceil(log2((b - a) / tolerance)) - 1, 0), k1 = 0.2 / (b - a);
    let scaled = tolerance * Math.pow(2, steps + 1);
    fa *= sign;
    fb *= sign;
    while (b - a > 2 * tolerance) {
      const half = (a + b) / 2, r = scaled - (b - a) / 2, xf = (fb * a - fa * b) / (fb - fa), sigma = half - xf, delta = k1 * (b - a) * (b - a), xt = delta <= abs(sigma) ? xf + (sigma < 0 ? -delta : delta) : half, x = abs(xt - half) <= r ? xt : half - (sigma < 0 ? -r : r), fx = sign * f(x);
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
  solveQuadratic(a, b, c, roots, min, max) {
    let x1, x2 = Infinity;
    if (abs(a) < EPSILON) {
      if (abs(b) < EPSILON)
        return abs(c) < EPSILON ? -1 : 0;
      x1 = -c / b;
    } else {
      b *= -0.5;
      let D = getDiscriminant(a, b, c);
      if (D && abs(D) < MACHINE_EPSILON) {
        const f = getNormalizationFactor(abs(a), abs(b), abs(c));
        if (f) {
          a *= f;
          b *= f;
          c *= f;
          D = getDiscriminant(a, b, c);
        }
      }
      if (D >= -MACHINE_EPSILON) {
        const Q = D < 0 ? 0 : sqrt(D), R = b + (b < 0 ? -Q : Q);
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
    const boundless = min == null, minB = min - EPSILON, maxB = max + EPSILON;
    if (isFinite(x1) && (boundless || x1 > minB && x1 < maxB))
      roots[count++] = boundless ? x1 : clamp(x1, min, max);
    if (x2 !== x1 && isFinite(x2) && (boundless || x2 > minB && x2 < maxB))
      roots[count++] = boundless ? x2 : clamp(x2, min, max);
    return count;
  },
  /**
   * 用数值稳定的方法求解一元三次方程 ax^3 + bx^2 + cx + d = 0。
   *
   * @return 找到的实根个数；如果有无穷多解则返回 -1
   */
  solveCubic(a, b, c, d, roots, min, max) {
    const f = getNormalizationFactor(abs(a), abs(b), abs(c), abs(d));
    let x, b1, c2, qd, q;
    if (f) {
      a *= f;
      b *= f;
      c *= f;
      d *= f;
    }
    function evaluate(x0) {
      x = x0;
      const tmp = a * x;
      b1 = tmp + b;
      c2 = b1 * x + c;
      qd = (tmp + b1) * x + c2;
      q = c2 * x + d;
    }
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
      evaluate(-(b / a) / 3);
      const t = q / a, r = pow(abs(t), 1 / 3), s = t < 0 ? -1 : 1, td = -qd / a, rd = td > 0 ? 1.324717957244746 * Math.max(r, sqrt(td)) : r, x0 = x - s * rd;
      if (x0 !== x) {
        let xr = x0;
        do {
          evaluate(xr);
          xr = qd === 0 ? x : x - q / qd / (1 + MACHINE_EPSILON);
        } while (s * xr > s * x);
        if (abs(a) * x * x > abs(d / x)) {
          c2 = -d / x;
          b1 = (c2 - c) / x;
        }
      }
    }
    let count = Numerical.solveQuadratic(a, b1, c2, roots, min, max);
    const boundless = min == null;
    if (isFinite(x) && (count === 0 || count > 0 && x !== roots[0] && x !== roots[1]) && (boundless || x > min - EPSILON && x < max + EPSILON))
      roots[count++] = boundless ? x : clamp(x, min, max);
    return count;
  },
  /**
   * 求出 Bernstein 形式多项式在 [0, 1] 上的根:不断细分，直到每一段的系数
   * 至多变号一次。没有变号的段没有根，变号一次的段恰有一个根，因为
   * Bernstein 形式具有变差缩减性。落在舍入误差内的系数按 0 处理:只有这类
   * 系数的段算作一个根，比给定宽度还窄、仍可能含根的段也算作一个根。
   */
  solveBernstein(coefficients, errors, roots, width) {
    let count = 0;
    function subdivide(values, bounds) {
      const left = [], right = [], leftBounds = [], rightBounds = [], v = values.slice(), e = bounds.slice();
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
    function evaluate(values, t) {
      const v = values.slice();
      for (let n = v.length - 1; n > 0; n--) {
        for (let i = 0; i < n; i++)
          v[i] = v[i] + (v[i + 1] - v[i]) * t;
      }
      return v[0];
    }
    function solve(values, bounds, from, to) {
      let changes = 0, zeros = 0, sign = 0;
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
      if (zeros === values.length || (changes || zeros) && to - from <= width) {
        roots[count++] = (from + to) / 2;
      } else if (changes === 1 && !zeros) {
        let a = 0, b = 1;
        const isNegative = values[0] < 0;
        while (from + (to - from) * a < from + (to - from) * b && (a + b) / 2 > a && (a + b) / 2 < b) {
          const t = (a + b) / 2;
          if (evaluate(values, t) < 0 === isNegative) {
            a = t;
          } else {
            b = t;
          }
        }
        roots[count++] = from + (to - from) * (a + b) / 2;
      } else if (changes || zeros) {
        const parts = subdivide(values, bounds), middle = (from + to) / 2;
        solve(parts[0], parts[2], from, middle);
        solve(parts[1], parts[3], middle, to);
      }
    }
    solve(coefficients, errors, 0, 1);
    return count;
  }
};
export {
  Numerical,
  clamp
};
