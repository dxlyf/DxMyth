// GLSL 120 角度和三角函数

// 函数
function f(x){
    return x
}
// 导数
function derivative(f, x, h = 1e-7) {
    return (f(x + h) - f(x)) / h;
}
  

// 从一个值范围映射到域范围
function mapValueToRange(value, rangeStart, rangeEnd, domainStart, domainEnd) {
    // 计算将值从一个范围映射到另一个范围的结果
    return domainStart + ((value - rangeStart) * (domainEnd - domainStart)) / (rangeEnd - rangeStart);
}
function mapValueToOriginalRange(mappedValue, rangeStart, rangeEnd, domainStart, domainEnd) {
    // 计算将值从目标范围映射回原始范围的结果
    return rangeStart + ((mappedValue - domainStart) * (rangeEnd - rangeStart)) / (domainEnd - domainStart);
}
function mapUsingRatio(value, rangeStart, rangeEnd, domainStart, domainEnd) {
    const ratio = (value - rangeStart) / (rangeEnd - rangeStart);
    return domainStart + ratio * (domainEnd - domainStart);
}
function mapClamped(value, rangeStart, rangeEnd, domainStart, domainEnd) {
    const mapped = domainStart + ((value - rangeStart) * (domainEnd - domainStart)) / (rangeEnd - rangeStart);
    // 限制输出在 domain 范围内
    return Math.max(domainStart, Math.min(domainEnd, mapped));
}
function mapNegOneToOne(start,end,value){
    const f=1/(start-end)
    const a=(start+end)*f;
    const b=(2*start*end)*f;
    return -b/value-a;// 映射 -start -end to -1 1
}
function mapNegOneToOne(start,end,value){
    //  2*start*end/(start-end)/value-(start+end)/(start-end)
    const f=1/(start-end)
    const a=(start+end)*f;
    const b=(2*start*end)*f;
    return b/value-a; // 映射到 start end to -1 1
}
// 示例用法
const clampedValue = mapClamped(150, 0, 100, 0, 1); // 输出 1，因为 150 超出了范围
console.log(clampedValue); // 输出 1

// 弧度转角度
function degrees(radians) {
    return radians * (180.0 / Math.PI);
}

// 角度转弧度
function radians(degrees) {
    return degrees * (Math.PI / 180.0);
}

// 正切函数
function tan(angle) {
    return Math.tan(angle);
}

// 双曲正弦函数
function sinh(angle) {
    return (Math.exp(angle) - Math.exp(-angle)) / 2.0;
}

// 双曲余弦函数
function cosh(angle) {
    return (Math.exp(angle) + Math.exp(-angle)) / 2.0;
}

// 双曲正切函数
function tanh(angle) {
    return sinh(angle) / cosh(angle);
}

// 反正切函数
function atan(y, x) {
    return Math.atan2(y, x);
}

// GLSL 120 几何函数

// 绝对值
function abs(x) {
    return Math.abs(x);
}

// 取整
function floor(x) {
    return Math.floor(x);
}

// 向上取整
function ceil(x) {
    return Math.ceil(x);
}

// 四舍五入
function round(x) {
    return Math.round(x);
}

// 平方根
function sqrt(x) {
    return Math.sqrt(x);
}

// 反平方根
function inversesqrt(x) {
    return 1.0 / Math.sqrt(x);
}

// GLSL 120 指数函数

// e 的 x 次方
function exp(x) {
    return Math.exp(x);
}

// 2 的 x 次方
function exp2(x) {
    return Math.pow(2, x);
}

// 自然对数
function log(x) {
    return Math.log(x);
}

// 以 2 为底的对数
function log2(x) {
    return Math.log2(x);
}

// 以 10 为底的对数
function log10(x) {
    return Math.log10(x);
}

// x 的 y 次方
function pow(x, y) {
    return Math.pow(x, y);
}
// 函数返回一个数字的整数部分，去掉小数部分。
function trunc(x) {
    return x < 0 ? Math.ceil(x) : Math.floor(x);
}
function roundEven(x) {
    // 使用 Math.round() 舍入到最接近的整数
    let rounded = Math.round(x);

    // 如果 x 是 0.5 的倍数，并且 Math.round() 后的结果是奇数，则调整结果
    if (x % 0.5 === 0 && rounded % 2 !== 0) {
        return rounded - Math.sign(x);
    }

    return rounded;
}
// GLSL 120 矩阵函数

// 矩阵乘法
function mat2_multiply(m1, m2) {
    const result = [];
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            result[i * 2 + j] =
                m1[i * 2] * m2[j] +
                m1[i * 2 + 1] * m2[j + 2];
        }
    }
    return result;
}

// 矩阵乘法
function mat3_multiply(m1, m2) {
    const result = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            result[i * 3 + j] =
                m1[i * 3] * m2[j] +
                m1[i * 3 + 1] * m2[j + 3] +
                m1[i * 3 + 2] * m2[j + 6];
        }
    }
    return result;
}

// 矩阵乘法
function mat4_multiply(m1, m2) {
    const result = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            result[i * 4 + j] =
                m1[i * 4] * m2[j] +
                m1[i * 4 + 1] * m2[j + 4] +
                m1[i * 4 + 2] * m2[j + 8] +
                m1[i * 4 + 3] * m2[j + 12];
        }
    }
    return result;
}

// GLSL 120 向量关系函数

// 检查两个向量是否相等
function equal(vec1, vec2) {
    for (let i = 0; i < vec1.length; i++) {
        if (vec1[i] !== vec2[i]) {
            return false;
        }
    }
    return true;
}

// 检查两个向量是否不等
function notEqual(vec1, vec2) {
    return !equal(vec1, vec2);
}

// 判断向量每个分量是否都大于等于另一个向量对应分量
function greaterThanEqual(vec1, vec2) {
    for (let i = 0; i < vec1.length; i++) {
        if (vec1[i] < vec2[i]) {
            return false;
        }
    }
    return true;
}

// 判断向量每个分量是否都小于等于另一个向量对应分量
function lessThanEqual(vec1, vec2) {
    for (let i = 0; i < vec1.length; i++) {
        if (vec1[i] > vec2[i]) {
            return false;
        }
    }
    return true;
}

// GLSL 120 常用函数

// 绝对值
function abs(x) {
    return Math.abs(x);
}

// 向上取整
function ceil(x) {
    return Math.ceil(x);
}

// 向下取整
function floor(x) {
    return Math.floor(x);
}

// 四舍五入
function round(x) {
    return Math.round(x);
}

// 取两者最小值
function min(x, y) {
    return Math.min(x, y);
}

// 取两者最大值
function max(x, y) {
    return Math.max(x, y);
}

// 取小数部分
function fract(x) {
    return x - Math.floor(x);
}

// 余数
function mod(x, y) {
    return x % y;
}
function customFloor(x) {
    // 如果是正数或零，直接取整；如果是负数，向下取整
    //return x >= 0 ? parseInt(x) : parseInt(x) - (x % 1 !== 0 ? 1 : 0);
}
function customFloor(x) {
    if (x >= 0) {
      // 对于正数，直接去掉小数部分
      return x - (x - parseInt(x));
    } else {
      // 对于负数，先去掉小数部分，然后调整结果
      let intPart = x - (x - parseInt(x));
      if (x !== intPart) {
        intPart -= 1;
      }
      return intPart;
    }
}
function customTrunc(x) {
    return x - (x - parseInt(x));
  }
// 等于数学中的mod
function remainder(a, b) {
    return a - Math.floor(a / b) * b;
}
// 等于js自带%
function remainder(a, b) {
    // 计算余数时先向零取整，然后计算差值
    return a - Math.trunc(a / b) * b;
}


// 数学中取楼mod(-0.1,8)=7.9 mod(0.1,-8)=-7.9
function mod(n, m) {
    return ((n % m) + m) % m;
}
// 指数函数
function exp(x) {
    return Math.exp(x);
}

// 对数函数
function log(x) {
    return Math.log(x);
}

// 平方根
function sqrt(x) {
    return Math.sqrt(x);
}

// 平方
function pow(x, y) {
    return Math.pow(x, y);
}

// 三角函数
function sin(x) {
    return Math.sin(x);
}

function cos(x) {
    return Math.cos(x);
}

function tan(x) {
    return Math.tan(x);
}

// 反三角函数
function asin(x) {
    return Math.asin(x);
}

function acos(x) {
    return Math.acos(x);
}

function atan(x) {
    return Math.atan(x);
}


// 双曲三角函数
function sinh(x) {
    return (Math.exp(x) - Math.exp(-x)) / 2;
}

function cosh(x) {
    return (Math.exp(x) + Math.exp(-x)) / 2;
}

function tanh(x) {
    return sinh(x) / cosh(x);
}

// 反双曲三角函数
function asinh(x) {
    return Math.log(x + Math.sqrt(x * x + 1));
}

function acosh(x) {
    return Math.log(x + Math.sqrt(x * x - 1));
}

function atanh(x) {
    return 0.5 * Math.log((1 + x) / (1 - x));
}

// smoothstep 函数
function smoothstep(edge0, edge1, x) {
    const t = Math.clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
}

// mix 函数
function mix(x, y, a) {
    return x * (1 - a) + y * a;
}

// clamp 函数
function clamp(x, minVal, maxVal) {
    return Math.min(Math.max(x, minVal), maxVal);
}

// step 函数
function step(edge, x) {
    return x < edge ? 0 : 1;
}

// sign 函数
function sign(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
}


// dot 函数
function dot(x, y) {
    let result = 0;
    for (let i = 0; i < x.length; i++) {
        result += x[i] * y[i];
    }
    return result;
}

// cross 函数
function cross(x, y) {
    return [
        x[1] * y[2] - x[2] * y[1],
        x[2] * y[0] - x[0] * y[2],
        x[0] * y[1] - x[1] * y[0]
    ];
}

// normalize 函数
function normalize(x) {
    const length = Math.sqrt(dot(x, x));
    return x.map(component => component / length);
}

// reflect 函数
function reflect(I, N) {
    const dotProduct = 2 * dot(I, N);
    return I.map(component => component - dotProduct * N);
}

// length 函数
function length(x) {
    return Math.sqrt(dot(x, x));
}

// distance 函数
function distance(p0, p1) {
    return length(p0.map((component, i) => component - p1[i]));
}


// faceforward 函数
function faceforward(N, I, Nref) {
    const dotProduct = dot(Nref, I);
    return dotProduct < 0 ? N : N.map(component => -component);
}

// refract 函数
function refract(I, N, eta) {
    const cosI = -dot(I, N);
    const k = 1.0 - eta * eta * (1.0 - cosI * cosI);

    if (k < 0) {
        return [0, 0, 0]; // total internal reflection
    } else {
        return I.map((component, i) => eta * component + (eta * cosI - Math.sqrt(k)) * N[i]);
    }
}
// 模拟 dFdx 函数
// 该像素点右边的v值 - 该像素点的v值 // v 可以是任意值
function dFdx(p) {
    // 这里简单地返回 p 相对于屏幕空间 x 的变化率
    // 在实际使用中，可能需要根据具体需求进行更复杂的实现
    return (p - 1.0) / resolution.x;
  }
  
  // 模拟 dFdy 函数
  //该像素点下面的v值 - 该像素点的v值
  function dFdy(p) {
    // 这里简单地返回 p 相对于屏幕空间 y 的变化率
    // 在实际使用中，可能需要根据具体需求进行更复杂的实现
    return (p + 1.0) / resolution.y;
  }
  
  // 模拟 fwidth 函数
  function fwidth(p) {
    // fwidth 是 dFdx 和 dFdy 的绝对值的最大值
    // Math.max(Math.abs(dFdx(p)),Math.abs(dFdy(p)))
    return Math.abs(dFdx(p))+Math.abs(dFdy(p));
  }
// outerProduct 函数用于计算两个向量的外积（outer product），结果是一个矩阵
function outerProduct(vecA, vecB) {
    if (vecA.length !== vecB.length) {
        throw new Error("Vectors must have the same length");
    }

    const numRows = vecA.length;
    const numCols = vecB.length;

    const result = Array.from({ length: numRows }, () =>
        Array.from({ length: numCols }, () => 0)
    );

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            result[i][j] = vecA[i] * vecB[j];
        }
    }

    return result;
}
// 计算2x2矩阵的行列式
function determinant2x2(matrix) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
}

// 计算3x3矩阵的行列式
function determinant3x3(matrix) {
    const a = matrix[0][0];
    const b = matrix[0][1];
    const c = matrix[0][2];
    const d = matrix[1][0];
    const e = matrix[1][1];
    const f = matrix[1][2];
    const g = matrix[2][0];
    const h = matrix[2][1];
    const i = matrix[2][2];

    return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}

// 计算4x4矩阵的行列式
function determinant4x4(matrix) {
    const a = matrix[0];
    const b = matrix[1];
    const c = matrix[2];
    const d = matrix[3];

    const subMatrix1 = [b[1], b[2], b[3], c[1], c[2], c[3], d[1], d[2], d[3]];
    const subMatrix2 = [b[0], b[2], b[3], c[0], c[2], c[3], d[0], d[2], d[3]];
    const subMatrix3 = [b[0], b[1], b[3], c[0], c[1], c[3], d[0], d[1], d[3]];
    const subMatrix4 = [b[0], b[1], b[2], c[0], c[1], c[2], d[0], d[1], d[2]];

    const detA = a[0] * determinant3x3(subMatrix1);
    const detB = -a[1] * determinant3x3(subMatrix2);
    const detC = a[2] * determinant3x3(subMatrix3);
    const detD = -a[3] * determinant3x3(subMatrix4);

    return detA + detB + detC + detD;
}
// 计算2x2矩阵的逆矩阵
function inverseMat2(m) {
    const determinant = m[0] * m[3] - m[1] * m[2];

    if (determinant === 0) {
        throw new Error("Matrix is not invertible");
    }

    const inverseDeterminant = 1 / determinant;

    return [
        m[3] * inverseDeterminant,
        -m[1] * inverseDeterminant,
        -m[2] * inverseDeterminant,
        m[0] * inverseDeterminant,
    ];
}

// 计算3x3矩阵的逆矩阵
function inverseMat3(m) {
    const determinant =
        m[0] * (m[4] * m[8] - m[5] * m[7]) -
        m[1] * (m[3] * m[8] - m[5] * m[6]) +
        m[2] * (m[3] * m[7] - m[4] * m[6]);

    if (determinant === 0) {
        throw new Error("Matrix is not invertible");
    }

    const inverseDeterminant = 1 / determinant;

    return [
        (m[4] * m[8] - m[5] * m[7]) * inverseDeterminant,
        -(m[1] * m[8] - m[2] * m[7]) * inverseDeterminant,
        (m[1] * m[5] - m[2] * m[4]) * inverseDeterminant,
        -(m[3] * m[8] - m[5] * m[6]) * inverseDeterminant,
        (m[0] * m[8] - m[2] * m[6]) * inverseDeterminant,
        -(m[0] * m[5] - m[2] * m[3]) * inverseDeterminant,
        (m[3] * m[7] - m[4] * m[6]) * inverseDeterminant,
        -(m[0] * m[7] - m[1] * m[6]) * inverseDeterminant,
        (m[0] * m[4] - m[1] * m[3]) * inverseDeterminant,
    ];
}
function inverseMat4(m) {
    const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
    const a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
    const a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
    const a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    const determinant = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (determinant === 0) {
        throw new Error("Matrix is not invertible");
    }

    const inverseDeterminant = 1 / determinant;

    return [
        (a11 * b11 - a12 * b10 + a13 * b09) * inverseDeterminant,
        (a02 * b10 - a01 * b11 - a03 * b09) * inverseDeterminant,
        (a31 * b05 - a32 * b04 + a33 * b03) * inverseDeterminant,
        (a22 * b04 - a21 * b05 - a23 * b03) * inverseDeterminant,
        (a12 * b08 - a10 * b11 - a13 * b07) * inverseDeterminant,
        (a00 * b11 - a02 * b08 + a03 * b07) * inverseDeterminant,
        (a32 * b02 - a30 * b05 - a33 * b01) * inverseDeterminant,
        (a20 * b05 - a22 * b02 + a23 * b01) * inverseDeterminant,
        (a10 * b10 - a11 * b08 + a13 * b06) * inverseDeterminant,
        (a01 * b08 - a00 * b10 - a03 * b06) * inverseDeterminant,
        (a30 * b04 - a31 * b02 + a33 * b00) * inverseDeterminant,
        (a21 * b02 - a20 * b04 - a23 * b00) * inverseDeterminant,
        (a11 * b07 - a10 * b09 - a12 * b06) * inverseDeterminant,
        (a00 * b09 - a01 * b07 + a02 * b06) * inverseDeterminant,
        (a31 * b01 - a30 * b03 - a32 * b00) * inverseDeterminant,
        (a20 * b03 - a21 * b01 + a22 * b00) * inverseDeterminant
    ];
}
// 矩阵乘法
function matMul(m1, m2) {
    const result = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            result[i * 4 + j] =
                m1[i * 4] * m2[j] +
                m1[i * 4 + 1] * m2[j + 4] +
                m1[i * 4 + 2] * m2[j + 8] +
                m1[i * 4 + 3] * m2[j + 12];
        }
    }
    return result;
}

// 透视矩阵
function perspective(fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2.0);
    const nf = 1.0 / (near - far);
    return [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, 2.0 * far * near * nf, 0
    ];
}

// 旋转矩阵
function rotate(angle, axis) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const t = 1.0 - c;
    const x = axis[0], y = axis[1], z = axis[2];
    const tx = t * x, ty = t * y;
    return [
        tx * x + c, tx * y - s * z, tx * z + s * y, 0,
        tx * y + s * z, ty * y + c, ty * z - s * x, 0,
        tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
        0, 0, 0, 1
    ];
}

// 缩放矩阵
function scale(sx, sy, sz) {
    return [
        sx, 0, 0, 0,
        0, sy, 0, 0,
        0, 0, sz, 0,
        0, 0, 0, 1
    ];
}

// 平移矩阵
function translate(tx, ty, tz) {
    return [
        1, 0, 0, tx,
        0, 1, 0, ty,
        0, 0, 1, tz,
        0, 0, 0, 1
    ];
}
function rand(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}
/**
 * 这个rand函数以一个vec2类型的坐标作为输入，然后使用sin和dot函数对其进行操作，生成一个伪随机的浮点数，并使用fract函数将其限制在0到1之间。在这个例子中，使用了经典的Perlin噪声的技巧。
 * float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

 */

// 取小数部分
function fract(x) {
    return x - Math.floor(x);
}
function rand(co) {
    return fract(Math.sin(dot(co, [12.9898, 78.233])) * 43758.5453);
}
function dot(v1, v2) {
    let result = 0;
    for (let i = 0; i < v1.length; i++) {
        result += v1[i] * v2[i];
    }
    return result;
}
function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}


function grad(hash, x) {
    const h = hash & 15;
    const grad = 1 + (h & 7); // Gradient value 1-8
    return ((h & 8 ? -1 : 1) * grad * x); // Randomly invert half of the gradients
}

function perlinNoise(x, y) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);

    const fadeX = fade(x);
    const fadeY = fade(y);

    const hashX0 = p[X] + Y;
    const hashX1 = p[X + 1] + Y;

    const hash00 = p[hashX0];
    const hash01 = p[hashX1];

    const hashY0 = p[hash00];
    const hashY1 = p[hash01];

    const grad00 = grad(p[hashY0], x);
    const grad01 = grad(p[hashY1], x - 1);

    const grad0 = lerp(fadeX, grad00, grad01);

    const hashY2 = p[hashY0 + 1];
    const hashY3 = p[hashY1 + 1];

    const grad02 = grad(p[hashY2], x);
    const grad03 = grad(p[hashY3], x - 1);

    const grad1 = lerp(fadeX, grad02, grad03);

    return 0.5 * (lerp(fadeY, grad0, grad1) + 1.0);
}
// 线性插值
function lerp(t, a, b) {
    return a + t * (b - a);
}
// 三次方插值
function cubicHermiteInterpolation(t) {
    return t * t * (3 - 2 * t);
}

// 平滑插值
function smoothstep(edge0, edge1, x) {
    // 先规范化 x 到 [0, 1] 范围
    const t = Math.clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    // 应用平滑函数
    return t * t * (3 - 2 * t);
}

// 用法示例
let t = 0.6;
let cubicResult = cubicHermiteInterpolation(t);
let smoothstepResult = smoothstep(0.2, 0.8, t);

console.log("Cubic Hermite Interpolation: " + cubicResult);
console.log("Smoothstep Interpolation: " + smoothstepResult);

// // Permutation table. You can modify this table to use different random values.
// const p = [...Array(512)].map(() => Math.floor(Math.random() * 255));

// // 示例用法
// let noiseValue = perlinNoise(2.5, 3.7);
// console.log(noiseValue);

Math.clamp = function clamp(x, minVal, maxVal) {
    return Math.min(Math.max(x, minVal), maxVal);
}
function smoothstep(edge0, edge1, x) {
    // Scale, bias and saturate x to 0..1 range
    x = Math.clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    // Evaluate polynomial
    return x * x * (3 - 2 * x);
}

function line(x, y, line_width) {
    return smoothstep(x - line_width / 2.0, x, y) - smoothstep(x, x + line_width / 2.0, y);
}