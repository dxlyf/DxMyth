import { Point } from "./Point.js";
import { Formatter } from "../util/Formatter.js";
class Matrix {
  a;
  b;
  c;
  d;
  tx;
  ty;
  /**
   * `new Matrix()` 是单位矩阵，`new Matrix(a, b, c, d, tx, ty)` 设置全部值。
   */
  constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
  }
  set(a, b, c, d, tx, ty) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
    return this;
  }
  clone() {
    return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
  }
  equals(matrix) {
    return matrix === this || !!matrix && this.a === matrix.a && this.b === matrix.b && this.c === matrix.c && this.d === matrix.d && this.tx === matrix.tx && this.ty === matrix.ty;
  }
  toString() {
    const f = Formatter.instance;
    return "[[" + [
      f.number(this.a),
      f.number(this.c),
      f.number(this.tx)
    ].join(", ") + "], [" + [
      f.number(this.b),
      f.number(this.d),
      f.number(this.ty)
    ].join(", ") + "]]";
  }
  /** 把矩阵重置为单位矩阵。 */
  reset() {
    this.a = this.d = 1;
    this.b = this.c = this.tx = this.ty = 0;
    return this;
  }
  /** 在当前矩阵上连接一个平移。 */
  translate(x, y) {
    this.tx += x * this.a + y * this.c;
    this.ty += x * this.b + y * this.d;
    return this;
  }
  /** 在当前矩阵上连接一个缩放，可指定中心点。 */
  scale(sx, sy = sx, center) {
    if (center)
      this.translate(center.x, center.y);
    this.a *= sx;
    this.b *= sx;
    this.c *= sy;
    this.d *= sy;
    if (center)
      this.translate(-center.x, -center.y);
    return this;
  }
  /** 在当前矩阵上连接一个旋转，可指定中心点。 */
  rotate(angle, center) {
    angle *= Math.PI / 180;
    const x = center ? center.x : 0, y = center ? center.y : 0, cos = Math.cos(angle), sin = Math.sin(angle), tx = x - x * cos + y * sin, ty = y - x * sin - y * cos, a = this.a, b = this.b, c = this.c, d = this.d;
    this.a = cos * a + sin * c;
    this.b = cos * b + sin * d;
    this.c = -sin * a + cos * c;
    this.d = -sin * b + cos * d;
    this.tx += tx * a + ty * c;
    this.ty += tx * b + ty * d;
    return this;
  }
  /** 在当前矩阵上连接一个错切，可指定中心点。 */
  shear(sx, sy, center) {
    if (center)
      this.translate(center.x, center.y);
    const a = this.a, b = this.b;
    this.a += sy * this.c;
    this.b += sy * this.d;
    this.c += sx * a;
    this.d += sx * b;
    if (center)
      this.translate(-center.x, -center.y);
    return this;
  }
  /** 在当前矩阵上连接一个斜切，角度单位为度。 */
  skew(sx, sy, center) {
    const toRadians = Math.PI / 180;
    return this.shear(
      Math.tan(sx * toRadians),
      Math.tan(sy * toRadians),
      center
    );
  }
  /** 追加指定矩阵:`(当前矩阵) * (指定矩阵)`。 */
  append(matrix) {
    if (matrix) {
      const a1 = this.a, b1 = this.b, c1 = this.c, d1 = this.d, a2 = matrix.a, b2 = matrix.c, c2 = matrix.b, d2 = matrix.d, tx2 = matrix.tx, ty2 = matrix.ty;
      this.a = a2 * a1 + c2 * c1;
      this.c = b2 * a1 + d2 * c1;
      this.b = a2 * b1 + c2 * d1;
      this.d = b2 * b1 + d2 * d1;
      this.tx += tx2 * a1 + ty2 * c1;
      this.ty += tx2 * b1 + ty2 * d1;
    }
    return this;
  }
  /** 前置指定矩阵:`(指定矩阵) * (当前矩阵)`。 */
  prepend(matrix) {
    if (matrix) {
      const a1 = this.a, b1 = this.b, c1 = this.c, d1 = this.d, tx1 = this.tx, ty1 = this.ty, a2 = matrix.a, b2 = matrix.c, c2 = matrix.b, d2 = matrix.d, tx2 = matrix.tx, ty2 = matrix.ty;
      this.a = a2 * a1 + b2 * b1;
      this.c = a2 * c1 + b2 * d1;
      this.b = c2 * a1 + d2 * b1;
      this.d = c2 * c1 + d2 * d1;
      this.tx = a2 * tx1 + b2 * ty1 + tx2;
      this.ty = c2 * tx1 + d2 * ty1 + ty2;
    }
    return this;
  }
  /** 返回追加指定矩阵后的新矩阵。 */
  appended(matrix) {
    return this.clone().append(matrix);
  }
  /** 返回前置指定矩阵后的新矩阵。 */
  prepended(matrix) {
    return this.clone().prepend(matrix);
  }
  /**
   * 原地求逆，使矩阵执行相反的变换。
   * 矩阵奇异时返回 `null`。
   */
  invert() {
    if (this.isInvertible()) {
      const a = this.a, b = this.b, c = this.c, d = this.d, tx = this.tx, ty = this.ty, det = a * d - b * c;
      this.a = d / det;
      this.b = -b / det;
      this.c = -c / det;
      this.d = a / det;
      this.tx = (c * ty - d * tx) / det;
      this.ty = (b * tx - a * ty) / det;
      return this;
    }
    return null;
  }
  /** 返回求逆后的新矩阵，矩阵奇异时为 `null`。 */
  inverted() {
    return this.clone().invert();
  }
  /** 去掉平移部分后的副本。 */
  _shiftless() {
    return new Matrix(this.a, this.b, this.c, this.d, 0, 0);
  }
  /** 单位矩阵时返回 `null`，否则返回自身。 */
  _orNullIfIdentity() {
    return this.isIdentity() ? null : this;
  }
  isIdentity() {
    return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0;
  }
  /**
   * 矩阵是否可逆。行列式为 0，或有任何值为 Infinity / NaN 时不可逆。
   */
  isInvertible() {
    const det = this.a * this.d - this.c * this.b;
    return !!det && !isNaN(det) && isFinite(this.tx) && isFinite(this.ty);
  }
  /** 缩放因子的几何平均值，用于描边宽度换算。 */
  _getMeanScale() {
    return Math.sqrt(Math.abs(this.a * this.d - this.b * this.c));
  }
  /** 矩阵是否奇异（即不可逆）。 */
  isSingular() {
    return !this.isInvertible();
  }
  /** 变换一个点并返回结果。 */
  transform(point) {
    return this._transformPoint(point);
  }
  /** 只接受一个点的快速版本。 */
  _transformPoint(point) {
    const x = point.x, y = point.y;
    return new Point(
      x * this.a + y * this.c + this.tx,
      x * this.b + y * this.d + this.ty
    );
  }
  /** 原地变换一个 x/y 坐标对数组。 */
  _transformCoordinates(src, dst, count) {
    for (let i = 0, max = 2 * count; i < max; i += 2) {
      const x = src[i], y = src[i + 1];
      dst[i] = x * this.a + y * this.c + this.tx;
      dst[i + 1] = x * this.b + y * this.d + this.ty;
    }
    return dst;
  }
  /**
   * 变换矩形的四个角，返回这些角的新包围盒（不是变换后的矩形本身）。
   * 对应原文 `Matrix#_transformBounds()`（Matrix.js 第 643 行）。
   *
   * @param bounds 要变换的矩形
   * @param dest 可选的目标矩形，传了就把结果写进去
   */
  _transformBounds(bounds, dest) {
    const x1 = bounds.x, y1 = bounds.y, x2 = x1 + bounds.width, y2 = y1 + bounds.height, coords = [x1, y1, x2, y1, x2, y2, x1, y2];
    this._transformCoordinates(coords, coords, 4);
    let minX = coords[0], minY = coords[1], maxX = coords[0], maxY = coords[1];
    for (let i = 2; i < 8; i += 2) {
      const x = coords[i], y = coords[i + 1];
      if (x < minX)
        minX = x;
      else if (x > maxX)
        maxX = x;
      if (y < minY)
        minY = y;
      else if (y > maxY)
        maxY = y;
    }
    const result = dest || bounds.clone();
    return result._set(minX, minY, maxX - minX, maxY - minY);
  }
  /** 反向变换一个点，不可逆时返回 `null`。 */
  inverseTransform(point) {
    return this._inverseTransform(point);
  }
  _inverseTransform(point) {
    if (this.isInvertible()) {
      const a = this.a, b = this.b, c = this.c, d = this.d, det = a * d - b * c, x = point.x - this.tx, y = point.y - this.ty;
      return new Point((x * d - y * c) / det, (y * a - x * b) / det);
    }
    return null;
  }
  /**
   * 把仿射变换分解为 `translation`、`rotation`、`scaling` 和 `skewing`。
   */
  decompose() {
    const a = this.a, b = this.b, c = this.c, d = this.d, det = a * d - b * c, degrees = 180 / Math.PI;
    let rotate, scale, skew;
    if (a !== 0 || b !== 0) {
      const r = Math.sqrt(a * a + b * b);
      rotate = Math.acos(a / r) * (b > 0 ? 1 : -1);
      scale = [r, det / r];
      skew = [Math.atan2(a * c + b * d, r * r), 0];
    } else if (c !== 0 || d !== 0) {
      const s = Math.sqrt(c * c + d * d);
      rotate = Math.asin(c / s) * (d > 0 ? 1 : -1);
      scale = [det / s, s];
      skew = [0, Math.atan2(a * c + b * d, s * s)];
    } else {
      rotate = 0;
      skew = scale = [0, 0];
    }
    return {
      translation: this.translation,
      rotation: rotate * degrees,
      scaling: new Point(scale[0], scale[1]),
      skewing: new Point(skew[0] * degrees, skew[1] * degrees)
    };
  }
  /** 矩阵值数组，顺序与构造函数一致。 */
  get values() {
    return [this.a, this.b, this.c, this.d, this.tx, this.ty];
  }
  /** 矩阵的平移量，以向量表示。 */
  get translation() {
    return new Point(this.tx, this.ty);
  }
  /** 矩阵的缩放值（可分解时）。 */
  get scaling() {
    return this.decompose().scaling;
  }
  /** 矩阵的旋转角度（可分解时）。 */
  get rotation() {
    return this.decompose().rotation;
  }
}
export {
  Matrix
};
