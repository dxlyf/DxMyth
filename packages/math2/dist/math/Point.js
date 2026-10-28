class Point {
  static default() {
    return this.create();
  }
  static fromPoint(point) {
    return new Point(point.x, point.y);
  }
  static create(x = 0, y = 0) {
    return new Point(x, y);
  }
  _x;
  _y;
  _onChange = null;
  constructor(x = 0, y = 0) {
    this._x = x;
    this._y = y;
  }
  // ---- 属性访问器 ----
  get width() {
    return this._x;
  }
  get height() {
    return this._y;
  }
  set width(v) {
    if (this._x !== v) {
      this._x = v;
      this._onChange?.();
    }
  }
  set height(v) {
    if (this._y !== v) {
      this._y = v;
      this._onChange?.();
    }
  }
  get x() {
    return this._x;
  }
  set x(v) {
    if (this._x !== v) {
      this._x = v;
      this._onChange?.();
    }
  }
  get y() {
    return this._y;
  }
  set y(v) {
    if (this._y !== v) {
      this._y = v;
      this._onChange?.();
    }
  }
  // ---- 变更通知 ----
  /** 注册变更回调，x 或 y 变化时触发 */
  onChange(cb) {
    this._onChange = cb;
    return this;
  }
  // ---- 写入 ----
  set(x, y) {
    if (this._x !== x || this._y !== y) {
      this._x = x;
      this._y = y;
      this._onChange?.();
    }
    return this;
  }
  copy(v) {
    return this.set(v.x, v.y);
  }
  zero() {
    return this.set(0, 0);
  }
  // ---- 运算（就地修改） ----
  add(v) {
    return this.set(this._x + v.x, this._y + v.y);
  }
  translate(x, y) {
    return this.set(this._x + x, this._y + y);
  }
  scale(x, y) {
    return this.set(this._x * x, this._y * y);
  }
  rotate(angle, center) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const cx = center?.x || 0;
    const cy = center?.y || 0;
    const dx = this._x - cx;
    const dy = this._y - cy;
    const nx = dx * cos - dy * sin + cx;
    const ny = dx * sin + dy * cos + cy;
    return this.set(nx, ny);
  }
  subtract(v) {
    return this.set(this._x - v.x, this._y - v.y);
  }
  multiply(v) {
    return this.set(this.x * v.x, this.y * v.y);
  }
  multiplyScalar(s) {
    return this.set(this._x * s, this._y * s);
  }
  divide(v) {
    return this.set(this.x / v.x, this.y / v.y);
  }
  divideScalar(s) {
    return this.set(this._x / s, this._y / s);
  }
  // ---- 查询 ----
  magnitude() {
    return Math.hypot(this._x, this._y);
  }
  magnitudeSquared() {
    return this._x * this._x + this._y * this._y;
  }
  dot(v) {
    return this._x * v.x + this._y * v.y;
  }
  cross(v) {
    return this.x * v.y - this.y * v.x;
  }
  normalize() {
    const len = this.magnitude();
    if (len <= 0) {
      return this;
    }
    return this.set(this.x / len, this.y / len);
  }
  perpendicular() {
    return this.set(-this.y, this.x);
  }
  negate() {
    return this.set(-this.x, -this.y);
  }
  setLengthTo(x, y, length, originLength) {
    const dmag = Math.sqrt(x * x + y * y);
    const dscale = length / dmag;
    const nx = x * dscale;
    const ny = y * dscale;
    if (!Number.isFinite(x) || !Number.isFinite(y) || x == 0 && y == 0) {
      this.set(0, 0);
      return false;
    }
    if (originLength) {
      originLength.value = dmag;
    }
    this.set(nx, ny);
    return true;
  }
  isFinite() {
    return Number.isFinite(this.x) && Number.isFinite(this.y);
  }
  // ---- 工具 ----
  clone() {
    return new Point(this._x, this._y);
  }
  equals(b) {
    return this.x === b.x && this.y === b.y;
  }
  equalsEpsilon(b, epsilon = 1e-9) {
    return Math.abs(this.x - b.x) <= epsilon && Math.abs(this.y - b.y) <= epsilon;
  }
  toString() {
    return `Point(${this._x}, ${this._y})`;
  }
}
export {
  Point
};
