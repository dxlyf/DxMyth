import { Vector2Like } from "./vec2"
import type { ITransformable } from './transformable'
export type Matrix2dLike = number[] | Float32Array;

const PI_2 = Math.PI * 2

function set<T extends Matrix2dLike = Matrix2dLike>(out: T, a: number, b: number, c: number, d: number, e: number, f: number) {
    out[0] = a;
    out[1] = b;
    out[2] = c
    out[3] = d;
    out[4] = e;
    out[5] = f;
    return out;
}
function identity<T extends Matrix2dLike = Matrix2dLike>(out: T) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
}
function translate<T extends Matrix2dLike = Matrix2dLike>(out: T, a: Matrix2dLike, v: Vector2Like) {
    const a00 = a[0], a02 = a[2], a04 = a[4];
    const a01 = a[1], a03 = a[3], a05 = a[5];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a04 + a00 * v[0] + a02 * v[1];
    out[5] = a05 + a01 * v[0] + a03 * v[1];
    return out;
}
function rotation<T extends Matrix2dLike = Matrix2dLike>(out: T, a: Matrix2dLike, radian: number) {
    const a00 = a[0], a01 = a[2], a02 = a[4];
    const a10 = a[1], a11 = a[3], a12 = a[5];
    const cos = Math.cos(radian);
    const sin = Math.sin(radian);
    out[0] = a00 * cos + a01 * sin;
    out[1] = a10 * cos + a11 * sin;
    out[2] = a00 * -sin + a01 * cos;
    out[3] = a10 * sin + a11 * cos;
    out[4] = a02;
    out[5] = a12;
    return out;
}
function scale<T extends Matrix2dLike = Matrix2dLike>(out: T, a: Matrix2dLike, v: Vector2Like) {
    const a00 = a[0], a01 = a[2], a02 = a[4];
    const a10 = a[1], a11 = a[3], a12 = a[5];
    const sx = v[0], sy = v[1]
    out[0] = a00 * sx;
    out[1] = a10 * sx;
    out[2] = a01 * sy;
    out[3] = a11 * sy;
    out[4] = a02;
    out[5] = a12;
    return out;
}
// 主行序
function makeTranslation<T extends Matrix2dLike = Matrix2dLike>(out: T, v: Vector2Like) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = v[0];
    out[5] = v[1];
    return out;
}
function makeRotation<T extends Matrix2dLike = Matrix2dLike>(out: T, radian: number) {
    const c = Math.cos(radian);
    const s = Math.sin(radian);
    out[0] = c;
    out[1] = s;
    out[2] = -s;
    out[3] = c;
    out[4] = 0;
    out[5] = 0;
    return out;
}
function makeScale<T extends Matrix2dLike = Matrix2dLike>(out: T, v: Vector2Like) {
    const sx = v[0];
    const sy = v[1];
    out[0] = sx;
    out[1] = 0;
    out[2] = 0;
    out[3] = sy;
    out[4] = 0;
    out[5] = 0;
    return out;
}
function makeSkew<T extends Matrix2dLike = Matrix2dLike>(out: T, v: Vector2Like) {
    const kx = Math.tan(v[0]);
    const ky = Math.tan(v[1]);
    out[0] = 1;
    out[1] = ky;
    out[2] = kx;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
}
function makeTranslationRotationScale<T extends Matrix2dLike = Matrix2dLike>(out: T, v: Vector2Like, radian: number, scale: Vector2Like) {
    const c = Math.cos(radian);
    const s = Math.sin(radian);
    out[0] = c * scale[0];
    out[1] = s * scale[0];
    out[2] = -s * scale[1];
    out[3] = c * scale[1];
    out[4] = v[0];
    out[5] = v[1];
    return out;
}
function makeTranslationRotationScaleOrigin<T extends Matrix2dLike = Matrix2dLike>(out: T, v: Vector2Like, radian: number, scale: Vector2Like, origin: Vector2Like) {
    const c = Math.cos(radian);
    const s = Math.sin(radian);
    const dx = v[0] + origin[0], dy = v[1] + origin[1];
    out[0] = c * scale[0];
    out[1] = s * scale[0];
    out[2] = -s * scale[1];
    out[3] = c * scale[1];
    out[4] = dx - (origin[0] * out[0] + origin[1] * out[2]);
    out[5] = dy - (origin[0] * out[1] + origin[1] * out[3]);
    return out;
}
function makeTranslationSkewRotationScaleOrigin<T extends Matrix2dLike = Matrix2dLike>(out: T, v: Vector2Like, skew: Vector2Like, radian: number, scale: Vector2Like, origin: Vector2Like) {
    const c = Math.cos(radian);
    const s = Math.sin(radian);
    const kx = Math.tan(skew[0]), ky = Math.tan(skew[1]);
    const dx = v[0] + origin[0], dy = v[1] + origin[1];
    out[0] = (c + kx * s) * scale[0];
    out[1] = (ky * s + c) * scale[0];
    out[2] = (-s + kx * c) * scale[1];
    out[3] = (ky * -s + c) * scale[1];
    out[4] = dx - (origin[0] * out[0] + origin[1] * out[2]);
    out[5] = dy - (origin[0] * out[1] + origin[1] * out[3]);
    return out;
}
function makeTranslationRotationScaleOriginPivot<T extends Matrix2dLike = Matrix2dLike>(out: T, v: Vector2Like, radian: number, scale: Vector2Like, origin: Vector2Like, pivot: Vector2Like) {
    const c = Math.cos(radian);
    const s = Math.sin(radian);
    const dx = v[0] + origin[0], dy = v[1] + origin[1];
    const px = pivot[0] + origin[0], py = pivot[1] + origin[1];
    out[0] = c * scale[0];
    out[1] = s * scale[0];
    out[2] = -s * scale[1];
    out[3] = c * scale[1];
    out[4] = dx - (px * out[0] + py * out[2]);
    out[5] = dy - (px * out[1] + py * out[3]);
    return out;
}
function makeTranslationSkewRotationScaleOriginPivot<T extends Matrix2dLike = Matrix2dLike>(out: T, v: Vector2Like, skew: Vector2Like, radian: number, scale: Vector2Like, origin: Vector2Like, pivot: Vector2Like) {
    const c = Math.cos(radian);
    const s = Math.sin(radian);
    const kx = Math.tan(skew[0]), ky = Math.tan(skew[1]);
    const dx = v[0] + origin[0], dy = v[1] + origin[1];
    const px = pivot[0] + origin[0], py = pivot[1] + origin[1];
    out[0] = (c + kx * s) * scale[0];
    out[1] = (ky * c + s) * scale[0];
    out[2] = (-s + kx * c) * scale[1];
    out[3] = (ky * -s + c) * scale[1];
    out[4] = dx - (px * out[0] + py * out[2]);
    out[5] = dy - (px * out[1] + py * out[3]);
    return out;
}
function makeTranslationRotationSkewScaleOriginPivot<T extends Matrix2dLike = Matrix2dLike>(out: T, v: Vector2Like, radian: number, skew: Vector2Like, scale: Vector2Like, origin: Vector2Like, pivot: Vector2Like) {
    const c = Math.cos(radian);
    const s = Math.sin(radian);
    const kx = Math.tan(skew[0]), ky = Math.tan(skew[1]);
    const dx = v[0] + origin[0], dy = v[1] + origin[1];
    const px = pivot[0] + origin[0], py = pivot[1] + origin[1];
    out[0] = (c + ky * -s) * scale[0];
    out[1] = (s + ky * c) * scale[0];
    out[2] = (c * kx - s) * scale[1];
    out[3] = (s * kx + c) * scale[1];
    out[4] = dx - (px * out[0] + py * out[2]);
    out[5] = dy - (px * out[1] + py * out[3]);
    return out;
}
function makeTKRSOP<T extends Matrix2dLike = Matrix2dLike>(out: T, v: Vector2Like, skew: Vector2Like, radian: number, scale: Vector2Like, origin: Vector2Like, pivot: Vector2Like) {
    const cx = Math.cos(radian + skew[1]);
    const sx = Math.sin(radian + skew[1]);
    const cy = -Math.sin(radian - skew[0]);
    const sy = Math.cos(radian - skew[0]);
    const dx = v[0] + origin[0], dy = v[1] + origin[1];
    const px = pivot[0] + origin[0], py = pivot[1] + origin[1];
    out[0] = cx * scale[0];
    out[1] = sx * scale[0];
    out[2] = cy * scale[1];
    out[3] = sy * scale[1];
    out[4] = dx - (px * out[0] + py * out[2]);
    out[5] = dy - (px * out[1] + py * out[3]);
    return out;
}
function makeTKRSOP2<T extends Matrix2dLike = Matrix2dLike>(out: T, v: Vector2Like, skew: Vector2Like, radian: number, scale: Vector2Like, origin: Vector2Like, pivot: Vector2Like) {
    const cx = Math.cos(radian + skew[1]);
    const sx = Math.sin(radian + skew[1]);
    const cy = -Math.sin(radian - skew[0]);
    const sy = Math.cos(radian - skew[0]);
    const ox = origin[0], oy = origin[1];
    const tx = v[0], ty = v[1];
    const px = pivot[0] + ox, py = pivot[1] + oy;
    out[0] = cx * scale[0];
    out[1] = sx * scale[0];
    out[2] = cy * scale[1];
    out[3] = sy * scale[1];
    out[4] = tx - (px * out[0] + py * out[2]) + ox * scale[0];
    out[5] = ty - (px * out[1] + py * out[3]) + oy * scale[1]; ////移除未缩放的原点以保持位置,原点不影响缩放
    return out;
}
function makeTKRSOP3<T extends Matrix2dLike = Matrix2dLike>(out: T, v: Vector2Like, skew: Vector2Like, radian: number, scale: Vector2Like, origin: Vector2Like, pivot: Vector2Like) {
    const cx = Math.cos(radian + skew[1]);
    const sx = Math.sin(radian + skew[1]);
    const cy = -Math.sin(radian - skew[0]);
    const sy = Math.cos(radian - skew[0]);
    const ox = origin[0], oy = origin[1];
    const tx = v[0], ty = v[1];
    const px = pivot[0] + ox, py = pivot[1] + oy;
    out[0] = cx * scale[0];
    out[1] = sx * scale[0];
    out[2] = cy * scale[1];
    out[3] = sy * scale[1];
    out[4] = tx - (px * out[0] + py * out[2]) + ox;
    out[5] = ty - (px * out[1] + py * out[3]) + oy; ////移除未缩放的原点以保持位置,原点不影响缩放
    return out;
}
function extractTranslation(out: Vector2Like, a: Matrix2dLike) {
    out[0] = a[4];
    out[1] = a[5];
    return out;
}
function extractRotation(a: Matrix2dLike) {
    return Math.atan2(a[1], a[0]);
}
function extractScale(out: Vector2Like, a: Matrix2dLike) {
    out[0] = Math.sqrt(a[0] * a[0] + a[1] * a[1]);
    out[1] = Math.sqrt(a[2] * a[2] + a[3] * a[3]);
    return out;
}
function extractOrigin(out: Vector2Like, a: Matrix2dLike) {
    const c = Math.cos(extractRotation(a));
    const s = Math.sin(extractRotation(a));
    out[0] = a[4] + c * a[2] * -a[4] - s * a[3] * -a[5];
    out[1] = a[5] + s * a[2] * -a[4] + c * a[3] * -a[5];
    return out;
}

function decomposeTKRS(matrix: Matrix2dLike) {
    const a = matrix[0]
    const b = matrix[1]
    const c = matrix[2]
    const d = matrix[3]

    const tx = matrix[4]
    const ty = matrix[5]

    const position = { x: tx, y: ty };
    let scaleX = Math.hypot(a, b);
    let scaleY = Math.hypot(c, d);

    const det = a * d - b * c;
    if (det < 0) {
        // 解决翻转的情况
        // 根据你项目的惯例，调整 scaleX or scaleY
        scaleX *= -1;
        scaleY *= -1;
    }

    const rotation = Math.atan2(b, a);

    // 去除 scale，获得正交基
    const r0x = a / scaleX;
    const r0y = b / scaleX;
    const r1x = c / scaleY;
    const r1y = d / scaleY;

    // 计算 skewX
    const skewX = Math.atan(r0x * r1x + r0y * r1y);
    const skewY = 0; // 很少使用 skewY，默认 0

    return {
        position,
        scale: { x: scaleX, y: scaleY },
        rotation,
        skew: { x: skewX, y: skewY }
    };
}

function decomposeTKRSPO(matrix: Matrix2dLike, transform: ITransformable) {
    const EPSILON = 1e-6;
    let a = matrix[0];
    let b = matrix[1];
    let c = matrix[2];
    let d = matrix[3];
    let tx = matrix[4];
    let ty = matrix[5];

    let ox = transform.origin.x;
    let oy = transform.origin.y;
    let px = transform.pivot.x;
    let py = transform.pivot.y;

    // 1. 计算缩放值
    let scaleX = Math.hypot(a, b);
    let scaleY = Math.hypot(c, d);

    // 处理极小值的情况
    if (scaleX < EPSILON) scaleX = 0;
    if (scaleY < EPSILON) scaleY = 0;

    // 2. 计算行列式以检测翻转
    const det = a * d - b * c;
    if (det < 0) {
        // 根据行列式符号调整缩放值
        // 判断谁是主轴（优先保持 X 轴正向）
        if (scaleX > scaleY) {
            scaleY *= -1;
            c *= -1;
            d *= -1;
        } else {
            scaleX *= -1;
            a *= -1;
            b *= -1;
        }
    }

    // 3. 计算旋转角度
    let rotation = Math.atan2(b, a);

    // 4. 计算倾斜值
    let skewX = 0;
    let skewY = 0;

    if (scaleX > EPSILON && scaleY > EPSILON) {
        // 计算归一化矩阵
        const normA = a / scaleX;
        const normB = b / scaleX;
        const normC = c / scaleY;
        const normD = d / scaleY;

        // 计算倾斜角度（使用更稳定的方法）

        skewX = Math.atan(normA * normC + normB * normD); // X axis skew onto Y
        skewY = Math.atan(normA * normB + normC * normD); // Y axis skew onto X
    }
    // 5. 计算位置（更精确的方法）
    // 移除变换矩阵中的pivot和origin影响
    const pivotMatrixX = a * (px + ox) + c * (py + oy);
    const pivotMatrixY = b * (px + ox) + d * (py + oy);

    const positionX = tx + pivotMatrixX - ox;
    const positionY = ty + pivotMatrixY - oy;

    // 6. 赋值给transform对象
    transform.position.setXY(positionX, positionY);
    transform.skew.set(skewX, skewY);
    transform.scale.set(scaleX, scaleY);
    transform.rotation = rotation;
}
/**
 * 分解 2D 变换矩阵，还原为平移、旋转和缩放值
 * @param out 输出数组，按顺序存储 [tx, ty, rotation, scaleX, scaleY]
 * @param a 输入的 2D 变换矩阵
 * @returns 输出数组
 */
function decompose(a: Matrix2dLike) {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a04 = a[4];
    const a05 = a[5];

    // 提取平移值
    const tx = a04;
    const ty = a05;

    // 提取缩放值
    let scaleX = Math.sqrt(a00 * a00 + a01 * a01);
    let scaleY = Math.sqrt(a02 * a02 + a03 * a03);

    // 提取旋转值
    let rotation = Math.atan2(a01, a00);

    // 处理反射情况
    if (a00 * a03 - a01 * a02 < 0) {
        if (scaleX > scaleY) {
            scaleY = -scaleY;
        } else {
            scaleX = -scaleX;
        }
    }

    // 将结果存入输出数组
    return {
        position: { x: tx, y: ty },
        rotation,
        scale: { x: scaleX, y: scaleY }
    };
}
function multiply<T extends Matrix2dLike = Matrix2dLike>(out: T, a: Matrix2dLike, b: Matrix2dLike) {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a04 = a[4];
    const a05 = a[5];
    const b00 = b[0];
    const b01 = b[1];
    const b02 = b[2];
    const b03 = b[3];
    const b04 = b[4];
    const b05 = b[5];
    out[0] = a00 * b00 + a02 * b01;
    out[1] = a01 * b00 + a03 * b01;
    out[2] = a00 * b02 + a02 * b03;
    out[3] = a01 * b02 + a03 * b03;
    out[4] = a00 * b04 + a02 * b05 + a04;
    out[5] = a01 * b04 + a03 * b05 + a05;
    return out;
}
function invert<T extends Matrix2dLike = Matrix2dLike>(out: T, a: Matrix2dLike) {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a04 = a[4];
    const a05 = a[5];
    const det = a00 * a03 - a01 * a02;
    if (!det) {
        return null;
    }
    const invDet = 1 / det;
    out[0] = a03 * invDet;
    out[1] = -a01 * invDet;
    out[2] = -a02 * invDet;
    out[3] = a00 * invDet;
    out[4] = (a02 * a05 - a03 * a04) * invDet;
    out[5] = (a01 * a04 - a00 * a05) * invDet;
    return out;
}
function mapPoint(out: Vector2Like, a: Matrix2dLike, v: Vector2Like) {
    const x = v[0];
    const y = v[1];
    out[0] = a[0] * x + a[2] * y + a[4];
    out[1] = a[1] * x + a[3] * y + a[5];
    return out;
}
function mapPoints(out: Vector2Like[], a: Matrix2dLike, v: Vector2Like[]) {
    for (let i = 0; i < v.length; i += 2) {
        mapPoint(out[i], a, v[i]);
    }
    return out;
}

function hasIdentity(a: Matrix2dLike) {
    return a[0] === 1 && a[1] === 0 && a[2] === 0 && a[3] === 1 && a[4] === 0 && a[5] === 0;
}
function hasTranslation(a: Matrix2dLike) {
    return a[4] !== 0 || a[5] !== 0;
}
function hasRotation(a: Matrix2dLike) {
    return a[0] !== 1 || a[1] !== 0 || a[2] !== 0 || a[3] !== 1;
}
function hasScale(a: Matrix2dLike) {
    return a[0] !== 1 || a[3] !== 1
}
/**
 * 列主序存储
 * 行主序(Row-major order) 优先存储每一行的数据，而列主序(Column-major order) 优先存储每一列的数据
 * 
 * 如果是列主序，前面三个元素代表一列，如果是行主序，前面三个元素代表一行。
 * [1,0,0,0,1,0,0,0,1]
 * 
 * 列主序每一列代表轴的朝向，行主序每一行代表轴的朝向。
 * 
 * [1,0,0]
 * [0,1,0]
 * [0,0,1]
 * 

 */
export class Matrix2D extends Float32Array {
    static IENTITY_MATRIX = new Matrix2D();
    static default() {
        return new this()
    }
    // 列主序
    static fromColumns(a: number, b: number, c: number, d: number, e: number, f: number) {
        return set(new this(), a, b, c, d, e, f)
    }
    static fromRows(a: number, c: number, e: number, b: number, d: number, f: number) {
        return set(new this(), a, b, c, d, e, f)
    }
    static fromMatrix2D(a: Matrix2dLike) {
        const m = this.default()
        m.set(a)
        return m
    }
    static fromSinCos(sin: number, cos: number) {
        return this.fromRows(cos, sin, -sin, cos, 0, 0)
    }
    static fromScale(sx: number, sy: number) {
        return this.fromRows(sx, 0, 0, sy, 0, 0)
    }
    static fromTranslate(tx: number, ty: number) {
        return this.fromRows(1, 0, tx, 1, ty, 0)
    }
    static fromRotation(rad: number) {
        return this.fromSinCos(Math.sin(rad), Math.cos(rad))
    }
    static fromAngle(deg: number) {
        return this.fromRotation(deg * Math.PI / 180)
    }
    
    static identity = identity
    static multiply = multiply
    static invert = invert
    static translate=translate
    static scale=scale
    static rotation=rotation
    static makeTranslation = makeTranslation
    static makeRotation = makeRotation
    static makeScale = makeScale
    static makeTranslationRotationScale = makeTranslationRotationScale
    static makeTranslationRotationScaleOrigin = makeTranslationRotationScaleOrigin
    static makeTranslationSkewRotationScaleOrigin = makeTranslationSkewRotationScaleOrigin
    static makeTranslationRotationScaleOriginPivot = makeTranslationRotationScaleOriginPivot
    static makeTranslationSkewRotationScaleOriginPivot = makeTranslationSkewRotationScaleOriginPivot
    static extractTranslation = extractTranslation
    static extractRotation = extractRotation
    static extractScale = extractScale
    static extractOrigin = extractOrigin
    static decomposeTKRSPO = decomposeTKRSPO
    static decompose = decompose
    static mapPoint = mapPoint
    static mapPoints = mapPoints
    static hasTranslation = hasTranslation
    static hasRotation = hasRotation
    static hasScale = hasScale
    static hasIdentity = hasIdentity

    constructor() {
        super(6);
        identity(this);
    }
    get a() {
        return this[0]
    }
    set a(v: number) {
        this[0] = v
    }
    get b() {
        return this[1]
    }
    set b(v: number) {
        this[1] = v
    }
    get c() {
        return this[2]
    }
    set c(v: number) {
        this[2] = v
    }
    get d() {
        return this[3]
    }
    set d(v: number) {
        this[3] = v
    }
    get e() {
        return this[4]
    }
    set e(v: number) {
        this[4] = v
    }
    get f() {
        return this[5]
    }
    set f(v: number) {
        this[5] = v
    }
    get tx() {
        return this[4]
    }
    set tx(v: number) {
        this[4] = v
    }
    get ty() {
        return this[5]
    }
    set ty(v: number) {
        this[5] = v
    }
    copy(out: Matrix2dLike) {
        set(this, out[0], out[1], out[2], out[3], out[4], out[5]);
        return this;
    }
    clone() {
        return (this.constructor as typeof Matrix2D).default().copy(this)
    }
    identity() {
        return identity(this);
    }
    multiplyMatrices(a: Matrix2dLike, b: Matrix2dLike) {
        return multiply(this, a, b);
    }
    premultiply(a: Matrix2dLike) {
        return multiply(this, a, this);
    }
    multiply(a: Matrix2dLike) {
        return multiply(this, this, a);
    }
    invert() {
        return invert(this, this);
    }
    translate(v: Vector2Like) {
        return translate(this, this, v)
    }

    rotate(radian: number) {
        return rotation(this, this, radian)
    }

    scale(v: Vector2Like) {
        return scale(this, this, v)
    }
    makeTranslation(v: Vector2Like) {
        return makeTranslation(this, v);
    }
    makeRotation(radian: number) {
        return makeRotation(this, radian);
    }
    makeScale(v: Vector2Like) {
        return makeScale(this, v);
    }
    makeSkew(v: Vector2Like) {
        return makeSkew(this, v)
    }
    makeTRS(v: Vector2Like, radian: number, scale: Vector2Like) {
        return makeTranslationRotationScale(this, v, radian, scale);
    }
    makeTKRSOP(translate: Vector2Like, skew: Vector2Like, radian: number, scale: Vector2Like, origin: Vector2Like, pivot: Vector2Like) {
        return makeTKRSOP3(this, translate, skew, radian, scale, origin, pivot);
    }
    extractTranslation(out: Vector2Like) {
        return extractTranslation(out, this);
    }
    extractRotation() {
        return extractRotation(this);
    }
    extractScale(out: Vector2Like) {
        return extractScale(out, this);
    }
    extractOrigin(out: Vector2Like) {
        return extractOrigin(out, this);
    }
    
    preScale(sx: number, sy: number) {
        return this.multiplyMatrices(this, Matrix2D.fromScale(sx, sy))
    }
    postScale(sx: number, sy: number) {
        return this.multiplyMatrices(Matrix2D.fromScale(sx, sy), this)
    }
    preRotate(angle: number) {
        return this.multiplyMatrices(this, Matrix2D.fromRotation(angle))
    }
    preRotateDegrees(angle: number) {
        return this.preRotate(angle * Math.PI / 180)
    }
    postRotate(angle: number) {
        return this.multiplyMatrices(Matrix2D.fromRotation(angle), this)
    }
    postRotateDegrees(angle: number) {
        return this.postRotate(angle * Math.PI / 180)
    }
    preTranslate(tx: number, ty: number) {
        return this.multiplyMatrices(this, Matrix2D.fromTranslate(tx, ty))
    }
    postTranslate(tx: number, ty: number) {
        return this.multiplyMatrices(Matrix2D.fromTranslate(tx, ty), this)
    }
    mapPoint(v: Vector2Like, out = v) {
        return mapPoint(out, this, v);
    }
    
    mapPoints(v: Vector2Like[], out = v) {
        return mapPoints(out, this, v);
    }
    hasIdentity() {
        return hasIdentity(this)
    }
    hasRotation() {
        return hasRotation(this)
    }
    hasScale() {
        return hasScale(this)
    }
    decompose(transform: ITransformable): ITransformable {
        // sort out rotation / skew..
        const a = this.a;
        const b = this.b;
        const c = this.c;
        const d = this.d;
        const pivot = transform.pivot;

        const skewX = -Math.atan2(-c, d);
        const skewY = Math.atan2(b, a);

        const delta = Math.abs(skewX + skewY);

        if (delta < 0.00001 || Math.abs(PI_2 - delta) < 0.00001) {
            transform.rotation = skewY;
            transform.skew.x = transform.skew.y = 0;
        }
        else {
            transform.rotation = 0;
            transform.skew.x = skewX;
            transform.skew.y = skewY;
        }

        // next set scale
        transform.scale.x = Math.sqrt((a * a) + (b * b));
        transform.scale.y = Math.sqrt((c * c) + (d * d));

        // next set position
        const pivot_origin_x = pivot.x + transform.origin.x;
        const pivot_origin_y = pivot.y + transform.origin.y;

        // 处理origin偏移量，因为origin会影响到最终的position位置计算。
        transform.position.x = this.tx + ((pivot_origin_x * a) + (pivot_origin_y * c)) - transform.origin.x;
        transform.position.y = this.ty + ((pivot_origin_x * b) + (pivot_origin_y * d)) - transform.origin.y;
        return transform;
    }
    toMatrix3x3(columnMajorOrder = true) {
        if (columnMajorOrder) {
            return new Float32Array([
                this.a, this.b, 0,
                this.c, this.d, 0,
                this.tx, this.ty, 1,
            ])
        } else {
            return new Float32Array([
                this.a, this.c, this.tx,
                this.b, this.d, this.ty,
                0, 0, 1,
            ])
        }
    }

}