import { CachePool } from "./CachePool.js";
import { TWO_PI } from "./MathUtils.js";
var MatrixIndex = /* @__PURE__ */ ((MatrixIndex2) => {
  MatrixIndex2[MatrixIndex2["A"] = 0] = "A";
  MatrixIndex2[MatrixIndex2["B"] = 1] = "B";
  MatrixIndex2[MatrixIndex2["C"] = 2] = "C";
  MatrixIndex2[MatrixIndex2["D"] = 3] = "D";
  MatrixIndex2[MatrixIndex2["TX"] = 4] = "TX";
  MatrixIndex2[MatrixIndex2["TY"] = 5] = "TY";
  return MatrixIndex2;
})(MatrixIndex || {});
class Matrix2D extends Float32Array {
  static pool = CachePool.create({
    initSize: 20,
    create: () => Matrix2D.identity(),
    init(item) {
      item.identity();
    }
  });
  // ---- 静态工厂 ----
  static identity() {
    return new Matrix2D(1, 0, 0, 1, 0, 0);
  }
  static from(arr) {
    return new Matrix2D(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]);
  }
  static fromValues(a, b, c, d, e, f) {
    return new Matrix2D(a, b, c, d, e, f);
  }
  static fromArray(arr) {
    return new Matrix2D(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]);
  }
  static fromTranslate(tx, ty) {
    return new Matrix2D(1, 0, 0, 1, tx, ty);
  }
  static fromScale(sx, sy) {
    return new Matrix2D(sx, 0, 0, sy, 0, 0);
  }
  static fromRotate(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Matrix2D(c, s, -s, c, 0, 0);
  }
  static fromSkew(sx, sy) {
    return new Matrix2D(1, Math.tan(sy), Math.tan(sx), 1, 0, 0);
  }
  /**
   * 通过变换参数组合构建仿射矩阵（静态，写入 out）。
   *
   * M = T(position) · Sk(skew) · S(scale) · R(rotation) · T(-origin)
   *
   * @param out      写入目标矩阵
   * @param position 平移 { x, y }
   * @param rotation 旋转角 (rad)
   * @param skew     倾斜 { x, y }
   * @param scale    缩放 { x, y }（默认 {1,1}）
   * @param origin   变换原点 { x, y }（默认 {0,0}）
   */
  static fromTranslateRotationSkewScaleOrigin(out, position, rotation, skew, scale = { x: 1, y: 1 }, origin = { x: 0, y: 0 }) {
    const x = position.x, y = position.y;
    let ox = origin.x, oy = origin.y;
    const sx = scale.x, sy = scale.y;
    const cos = rotation === 0 ? 1 : Math.cos(rotation);
    const sin = rotation === 0 ? 0 : Math.sin(rotation);
    const tanx = skew.x === 0 ? 0 : Math.tan(skew.x);
    const tany = skew.y === 0 ? 0 : Math.tan(skew.y);
    let tx = x + ox;
    let ty = y + oy;
    let a = cos - sin * tany;
    let b = sin + cos * tany;
    let c = cos * tanx - sin;
    let d = sin * tanx + cos;
    a *= sx;
    b *= sx;
    c *= sy;
    d *= sy;
    out[0] = a;
    out[1] = b;
    out[2] = c;
    out[3] = d;
    out[4] = tx - (a * ox + c * oy);
    out[5] = ty - (b * ox + d * oy);
    return this;
  }
  static fromTranslateRotationSkewScaleOriginPivot(out, position, rotation, skew, scale, origin, pivot) {
    const x = position.x, y = position.y;
    let ox = origin.x, oy = origin.y;
    const px = pivot.x, py = pivot.y;
    const sx = scale.x, sy = scale.y;
    const cos = rotation === 0 ? 1 : Math.cos(rotation);
    const sin = rotation === 0 ? 0 : Math.sin(rotation);
    const tanx = skew.x === 0 ? 0 : Math.tan(skew.x);
    const tany = skew.y === 0 ? 0 : Math.tan(skew.y);
    let tx = x + ox;
    let ty = y + oy;
    let a = cos - sin * tany;
    let b = sin + cos * tany;
    let c = cos * tanx - sin;
    let d = sin * tanx + cos;
    a *= sx;
    b *= sx;
    c *= sy;
    d *= sy;
    ox += px;
    oy += py;
    out[0] = a;
    out[1] = b;
    out[2] = c;
    out[3] = d;
    out[4] = tx - (a * ox + c * oy);
    out[5] = ty - (b * ox + d * oy);
    return this;
  }
  // ---- 静态工具 ----
  /** out = a * b */
  static multiply(out, a, b) {
    const a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
    const b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    out[4] = a0 * b4 + a2 * b5 + a4;
    out[5] = a1 * b4 + a3 * b5 + a5;
    return out;
  }
  /** out = m 的逆矩阵；行列式为 0 时返回 null */
  static invert(out, m) {
    const a = m[0], b = m[1], c = m[2], d = m[3], tx = m[4], ty = m[5];
    const det = a * d - b * c;
    if (det === 0) return null;
    const invDet = 1 / det;
    out[0] = d * invDet;
    out[1] = -b * invDet;
    out[2] = -c * invDet;
    out[3] = a * invDet;
    out[4] = (c * ty - d * tx) * invDet;
    out[5] = (b * tx - a * ty) * invDet;
    return out;
  }
  /** 判断两个矩阵是否相等 */
  static equals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
  }
  static mapPoint(out, matrix, v) {
    const x = v.x, y = v.y;
    out.x = matrix[0] * x + matrix[2] * y + matrix[4];
    out.y = matrix[1] * x + matrix[3] * y + matrix[5];
    return out;
  }
  static mapPoints(out, matrix, points) {
    for (let i = 0; i < points.length; i++) {
      out[i] = Matrix2D.mapPoint(out[i] || { x: 0, y: 0 }, matrix, points[i]);
    }
    return out;
  }
  // ==================== 实例 API ====================
  constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
    super(6);
    this[0] = a;
    this[1] = b;
    this[2] = c;
    this[3] = d;
    this[4] = tx;
    this[5] = ty;
  }
  // ---- 命名属性访问器（兼容 Matrix2DLike 接口） ----
  get a() {
    return this[0];
  }
  set a(v) {
    this[0] = v;
  }
  get b() {
    return this[1];
  }
  set b(v) {
    this[1] = v;
  }
  get c() {
    return this[2];
  }
  set c(v) {
    this[2] = v;
  }
  get d() {
    return this[3];
  }
  set d(v) {
    this[3] = v;
  }
  get tx() {
    return this[4];
  }
  set tx(v) {
    this[4] = v;
  }
  get ty() {
    return this[5];
  }
  set ty(v) {
    this[5] = v;
  }
  // ---- 写入 ----
  fromValues(a, b, c, d, tx, ty) {
    this[0] = a;
    this[1] = b;
    this[2] = c;
    this[3] = d;
    this[4] = tx;
    this[5] = ty;
    return this;
  }
  identity() {
    return this.fromValues(1, 0, 0, 1, 0, 0);
  }
  fromArray(m) {
    this.fromValues(m[0], m[1], m[2], m[3], m[4], m[5]);
  }
  /** 重置为平移矩阵 */
  fromTranslate(tx, ty) {
    return this.fromValues(1, 0, 0, 1, tx, ty);
  }
  /** 重置为缩放矩阵 */
  fromScale(sx, sy) {
    return this.fromValues(sx, 0, 0, sy, 0, 0);
  }
  /** 重置为旋转矩阵 */
  fromRotation(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return this.fromValues(c, s, -s, c, 0, 0);
  }
  /** 重置为倾斜矩阵 */
  fromSkew(sx, sy) {
    return this.fromValues(1, Math.tan(sy), Math.tan(sx), 1, 0, 0);
  }
  copy(m) {
    this[0] = m[0];
    this[1] = m[1];
    this[2] = m[2];
    this[3] = m[3];
    this[4] = m[4];
    this[5] = m[5];
    return this;
  }
  // ---- 自身变换（this = this * op） ----
  multiplyMatrices(a, b) {
    return Matrix2D.multiply(this, a, b);
  }
  multiply(m) {
    return Matrix2D.multiply(this, this, m);
  }
  /** this = m * this */
  premultiply(m) {
    return Matrix2D.multiply(this, m, this);
  }
  translate(tx, ty) {
    this[4] = this[0] * tx + this[2] * ty + this[4];
    this[5] = this[1] * tx + this[3] * ty + this[5];
    return this;
  }
  scale(sx, sy) {
    this[0] *= sx;
    this[1] *= sx;
    this[2] *= sy;
    this[3] *= sy;
    return this;
  }
  rotate(angle) {
    const c = Math.cos(angle), s = Math.sin(angle);
    const a = this[0], b = this[1], c0 = this[2], d = this[3];
    this[0] = a * c + c0 * s;
    this[1] = b * c + d * s;
    this[2] = a * -s + c0 * c;
    this[3] = b * -s + d * c;
    return this;
  }
  skew(sx, sy) {
    const tanSx = Math.tan(sx), tanSy = Math.tan(sy);
    const a = this[0], b = this[1], c = this[2], d = this[3];
    this[0] = a + c * tanSy;
    this[1] = b + d * tanSy;
    this[2] = a * tanSx + c;
    this[3] = b * tanSx + d;
    return this;
  }
  fromTranslationRotationScale(position, angleInRad, scale) {
    this.fromTranslationRotationScalePivot(position, angleInRad, scale, { x: 0, y: 0 });
    return this;
  }
  fromTranslationRotationSkewScalePivot(position, angleInRad, skew, scale, pivot) {
    const cos = Math.cos(angleInRad);
    const sin = Math.sin(angleInRad);
    const skewX = Math.tan(skew.x);
    const skewY = Math.tan(skew.y);
    let a = cos - sin * skewY;
    let b = sin + cos * skewY;
    let c = cos * skewX - sin;
    let d = sin * skewX + cos;
    a *= scale.x;
    b *= scale.x;
    c *= scale.y;
    d *= scale.y;
    const tx = position.x - (pivot.x * a - pivot.y * c);
    const ty = position.y - (pivot.x * b + pivot.y * d);
    this.fromValues(a, b, c, d, tx, ty);
    return this;
  }
  fromTranslationRotationScalePivot(position, angleInRad, scale, pivot) {
    const cos = Math.cos(angleInRad);
    const sin = Math.sin(angleInRad);
    const a = scale.x * cos;
    const b = scale.x * sin;
    const c = -scale.y * sin;
    const d = scale.y * cos;
    const tx = position.x - (pivot.x * a - pivot.y * c);
    const ty = position.y - (pivot.x * b + pivot.y * d);
    this.fromValues(a, b, c, d, tx, ty);
    return this;
  }
  fromTranslateRotationSkewScaleOriginPivot(position, rotation, skew, scale, origin, pivot) {
    Matrix2D.fromTranslateRotationSkewScaleOriginPivot(this, position, rotation, skew, scale, origin, pivot);
    return this;
  }
  fromTranslateRotationSkewScaleOrigin(position, rotation, skew, scale = { x: 1, y: 1 }, origin = { x: 0, y: 0 }) {
    Matrix2D.fromTranslateRotationSkewScaleOrigin(this, position, rotation, skew, scale, origin);
    return this;
  }
  static decomposeAffine(matrix) {
    const [a, b, c, d, tx, ty] = matrix;
    const translate = { x: tx, y: ty };
    const scaleX = Math.sqrt(a * a + b * b);
    const scaleY = Math.sqrt(c * c + d * d);
    const rotation = Math.atan2(b, a);
    const skewX = Math.atan2(a * c + b * d, scaleX * scaleY);
    const delta = a * d - b * c;
    return {
      translate,
      scaleX,
      scaleY,
      scale: Math.sqrt(Math.abs(delta)),
      // 统一缩放 = sqrt(|det|)
      rotation,
      skewX,
      determinant: delta
    };
  }
  /**
   * 从组合矩阵逆解所有变换分量。
   *
   * 与 fromTranslationRotationSkewScaleOriginPivot 互为逆运算，
   * M = T(pos+origin) · R · Sk · S · T(-origin-pivot) 的矩阵可无损还原。
   *
   * 分解策略:
   *   - 线性部分 L = [a c; b d] 用 QR 分解提取 rotation / scale / skew
   *   - skewY 约定为 0（QR 唯一分解），若原矩阵 skewY ≠ 0 则信息并入 rotation
   *   - origin / pivot 无法从单矩阵唯一确定，约定 origin = (0,0), pivot = (0,0)
   *
   * @returns out 对象（含 position/scale/skew/rotation/origin/pivot）
   */
  static decomposeTransform(matrix, transform) {
    const a = matrix[0];
    const b = matrix[1];
    const c = matrix[2];
    const d = matrix[3];
    const pivot = transform.pivot;
    const skewX = -Math.atan2(-c, d);
    const skewY = Math.atan2(b, a);
    const delta = Math.abs(skewX + skewY);
    if (delta < 1e-5 || Math.abs(TWO_PI - delta) < 1e-5) {
      transform.rotation = skewY;
      transform.skew.x = transform.skew.y = 0;
    } else {
      transform.rotation = 0;
      transform.skew.x = skewX;
      transform.skew.y = skewY;
    }
    transform.scale.x = Math.sqrt(a * a + b * b);
    transform.scale.y = Math.sqrt(c * c + d * d);
    const pivot_origin_x = pivot.x + transform.origin.x;
    const pivot_origin_y = pivot.y + transform.origin.y;
    transform.position.x = matrix[4] + (pivot_origin_x * a + pivot_origin_y * c) - transform.origin.x;
    transform.position.y = matrix[5] + (pivot_origin_x * b + pivot_origin_y * d) - transform.origin.y;
    return transform;
  }
  decomposeTRSP(matrix, out = {}) {
    const position = out.position ?? { x: 0, y: 0 };
    const scale = out.scale ?? { x: 1, y: 1 };
    const pivot = out.pivot ?? { x: 0, y: 0 };
    position.x = matrix[4];
    position.y = matrix[5];
    scale.x = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
    scale.y = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);
    if (scale.x === 0 || scale.y === 0) {
      throw new Error("Cannot decompose matrix with zero scale");
    }
    const rotation = Math.atan2(matrix[1] / scale.x, matrix[0] / scale.x);
    const rs = new Matrix2D();
    rs.fromValues(matrix[0], matrix[1], matrix[2], matrix[3], 0, 0);
    const det = rs[0] * rs[3] - rs[1] * rs[2];
    if (det === 0) throw new Error("Matrix is not invertible for pivot extraction");
    const invRS = new Matrix2D();
    invRS.fromValues(rs[3] / det, -rs[1] / det, -rs[2] / det, rs[0] / det, 0, 0);
    pivot.x = -(invRS[0] * matrix[4] + invRS[2] * matrix[5] - position.x);
    pivot.y = -(invRS[1] * matrix[4] + invRS[3] * matrix[5] - position.y);
    out.position.x = position.x;
    out.position.y = position.y;
    out.scale.x = scale.x;
    out.scale.y = scale.y;
    out.rotation = rotation;
    out.pivot.x = pivot.x;
    out.pivot.y = pivot.y;
    return out;
  }
  /** 实例版：从自身矩阵逆解分量 */
  decomposeTranslateRotationSkewScalePivotOrigin(out) {
    const result = Matrix2D.decomposeTransform(this, out);
    return result;
  }
  decomposeTranslateRotationSkewScalePivot(transform) {
    const a = this.a;
    const b = this.b;
    const c = this.c;
    const d = this.d;
    const pivot = transform.pivot;
    const skewX = -Math.atan2(-c, d);
    const skewY = Math.atan2(b, a);
    const delta = Math.abs(skewX + skewY);
    if (delta < 1e-5 || Math.abs(TWO_PI - delta) < 1e-5) {
      transform.rotation = skewY;
      transform.skew.x = transform.skew.y = 0;
    } else {
      transform.rotation = 0;
      transform.skew.x = skewX;
      transform.skew.y = skewY;
    }
    transform.scale.x = Math.sqrt(a * a + b * b);
    transform.scale.y = Math.sqrt(c * c + d * d);
    const pivot_origin_x = pivot.x + transform.origin.x;
    const pivot_origin_y = pivot.y + transform.origin.y;
    transform.position.x = this.tx + (pivot_origin_x * a + pivot_origin_y * c) - transform.origin.x;
    transform.position.y = this.ty + (pivot_origin_x * b + pivot_origin_y * d) - transform.origin.y;
    return transform;
  }
  invert() {
    return Matrix2D.invert(this, this);
  }
  /**
   * 从变换对象构建矩阵（实例，写入 this）。
   *
   * @param transform { position, scale?, skew?, rotation?, origin? }
   */
  fromTransform(transform) {
    Matrix2D.fromTranslateRotationSkewScaleOriginPivot(
      this,
      transform.position,
      transform.rotation ?? 0,
      transform.skew ?? { x: 0, y: 0 },
      transform.scale ?? { x: 1, y: 1 },
      transform.origin ?? { x: 0, y: 0 },
      transform.pivot ?? { x: 0, y: 0 }
    );
    return this;
  }
  // ---- 查询 ----
  /** 行列式 */
  determinant() {
    return this[0] * this[3] - this[1] * this[2];
  }
  isIdentity() {
    return !(this[1] !== 0 || this[2] !== 0 || this[0] !== 1 || this[3] !== 1 || this[4] !== 0 || this[5] !== 0);
  }
  isSingular() {
    return this.determinant() === 0;
  }
  equals(m) {
    return Matrix2D.equals(this, m);
  }
  /** X 轴缩放量 */
  getScaleX() {
    return Math.hypot(this[0], this[1]);
  }
  /** Y 轴缩放量 */
  getScaleY() {
    return Math.hypot(this[2], this[3]);
  }
  getScale() {
    return Math.sqrt(this.getScaleX() * this.getScaleY());
  }
  /** 旋转角 (rad) */
  getRotation() {
    return Math.atan2(this[1], this[0]);
  }
  // ---- 点变换 ----
  /** p = this * (x, y) */
  mapPoint(out, v) {
    const x = v.x, y = v.y;
    out.x = this[0] * x + this[2] * y + this[4];
    out.y = this[1] * x + this[3] * y + this[5];
    return out;
  }
  mapPoints(out, points) {
    for (let i = 0; i < points.length; i++) {
      out[i] = this.mapPoint(out[i] || { x: 0, y: 0 }, points[i]);
    }
    return out;
  }
  transformPoint(v) {
    return {
      x: this[0] * v.x + this[2] * v.y + this[4],
      y: this[1] * v.x + this[3] * v.y + this[5]
    };
  }
  // ---- 工具 ----
  clone() {
    return new Matrix2D(this[0], this[1], this[2], this[3], this[4], this[5]);
  }
  toString() {
    return `Matrix2D(${this[0]}, ${this[1]}, ${this[2]}, ${this[3]}, ${this[4]}, ${this[5]})`;
  }
}
export {
  Matrix2D,
  MatrixIndex
};
