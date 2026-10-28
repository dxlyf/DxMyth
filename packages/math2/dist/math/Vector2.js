import { CachePool } from "./CachePool.js";
import { degToRad, clamp } from "./MathUtils.js";
class Vector2 {
  static pool = CachePool.create({
    initSize: 20,
    create: () => new Vector2(0, 0),
    init(item) {
      item.set(0, 0);
    }
  });
  // ---- 静态工厂 ----
  static default() {
    return this.create();
  }
  static create(x = 0, y = 0) {
    return new Vector2(x, y);
  }
  static zero() {
    return new Vector2(0, 0);
  }
  static fromPoint(v) {
    return new Vector2(v.x, v.y);
  }
  static fromValues(x, y) {
    return new Vector2(x, y);
  }
  static fromScalar(s) {
    return new Vector2(s, s);
  }
  static fromRotation(angle) {
    return new Vector2(Math.cos(angle), Math.sin(angle));
  }
  /** 从夹角 (rad) 创建单位向量 */
  static fromAngle(angle) {
    return new Vector2(Math.cos(degToRad(angle)), Math.sin(degToRad(angle)));
  }
  /** 从类向量对象创建 */
  static from(v) {
    return new Vector2(v.x, v.y);
  }
  /** 从数组创建 */
  static fromArray(arr) {
    return new Vector2(arr[0], arr[1]);
  }
  // ---- 静态运算（out 可复用） ----
  /** out = a + b */
  static add(out, a, b) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    return out;
  }
  static addScalar(out, a, s) {
    out.x = a.x + s;
    out.y = a.y + s;
    return out;
  }
  static addScaledVector(out, a, v, s) {
    out.x = a.x + v.x * s;
    out.y = a.y + v.y * s;
    return out;
  }
  /** out = a - b */
  static subtract(out, a, b) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    return out;
  }
  static multiply(out, a, b) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    return out;
  }
  /** out = v * s */
  static multiplyScalar(out, v, s) {
    out.x = v.x * s;
    out.y = v.y * s;
    return out;
  }
  /** out = v / s */
  static divide(out, v, s) {
    out.x = v.x / s.x;
    out.y = v.y / s.y;
    return out;
  }
  /** out = -v */
  static negate(out, v) {
    out.x = -v.x;
    out.y = -v.y;
    return out;
  }
  /** out = normalized(v)；零向量时返回零向量 */
  static normalize(out, v) {
    const len = Vector2.magnitude(v);
    if (len === 0) {
      out.x = 0;
      out.y = 0;
      return out;
    }
    out.x = v.x / len;
    out.y = v.y / len;
    return out;
  }
  /** a · b */
  static dot(a, b) {
    return a.x * b.x + a.y * b.y;
  }
  /** a × b (2D 叉积 = 标量) */
  static cross(a, b) {
    return a.x * b.y - a.y * b.x;
  }
  /** out = a 在 b 上的投影 */
  static project(out, a, b) {
    const dot = Vector2.dot(a, b);
    const lenSq = Vector2.dot(b, b);
    if (lenSq === 0) {
      out.x = 0;
      out.y = 0;
      return out;
    }
    const s = dot / lenSq;
    out.x = b.x * s;
    out.y = b.y * s;
    return out;
  }
  static set(out, x, y) {
    out.x = x;
    out.y = y;
    return out;
  }
  static perpendicular(out, v) {
    return Vector2.set(out, -v.y, v.x);
  }
  static rotateCW(out, v) {
    return Vector2.set(out, -v.y, v.x);
  }
  static rotateCCW(out, v) {
    return Vector2.set(out, v.y, -v.x);
  }
  /** out = lerp(a, b, t)；t=0 得 a，t=1 得 b */
  static lerp(out, a, b, t) {
    out.x = a.x + (b.x - a.x) * t;
    out.y = a.y + (b.y - a.y) * t;
    return out;
  }
  /** out = a 沿 b 方向按指定距离移动 */
  static moveTo(out, a, b, distance) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len === 0) {
      out.x = a.x;
      out.y = a.y;
      return out;
    }
    out.x = a.x + dx / len * distance;
    out.y = a.y + dy / len * distance;
    return out;
  }
  /** |a - b| */
  static distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }
  /** |a - b|^2（避免 sqrt） */
  static distanceSquared(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  }
  /** a 和 b 之间的夹角 (rad),[0,PI] */
  static angleTo(a, b) {
    const dot = Vector2.dot(a, b);
    const lenProd = Math.hypot(a.x, a.y) * Math.hypot(b.x, b.y);
    if (lenProd === 0) return 0;
    return Math.acos(Math.max(-1, Math.min(1, dot / lenProd)));
  }
  // [-pi,pi]
  static angleToSigned(a, b) {
    return Math.atan2(Vector2.cross(a, b), Vector2.dot(a, b));
  }
  // [-PI,PI]
  static angle(v) {
    return Math.atan2(v.y, v.x);
  }
  static equals(a, b) {
    return a.x === b.x && a.y === b.y;
  }
  /** 判断 a 与 b 是否近似相等 */
  static equalsEpsilon(a, b, epsilon = 1e-9) {
    return Math.abs(a.x - b.x) <= epsilon && Math.abs(a.y - b.y) <= epsilon;
  }
  /** out = min(a, b)（逐分量取最小） */
  static min(out, a, b) {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    return out;
  }
  /** out = max(a, b)（逐分量取最大） */
  static max(out, a, b) {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    return out;
  }
  /** out = clamp(v, min, max) */
  static clamp(out, v, min, max) {
    out.x = clamp(v.x, min.x, max.x);
    out.y = clamp(v.y, min.y, max.y);
    return out;
  }
  static clampScalar(out, v, min, max) {
    out.x = clamp(v.x, min, max);
    out.y = clamp(v.y, min, max);
    return out;
  }
  static clampLength(out, v, min, max) {
    const length = Vector2.magnitude(v) || 1;
    const s = clamp(length, min, max);
    out.x = v.x / length * s;
    out.y = v.y / length * s;
    return out;
  }
  static magnitude(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }
  /** out = reflect(v, normal)；normal 需为单位向量 */
  static reflect(out, v, normal) {
    const d = 2 * Vector2.dot(v, normal);
    out.x = v.x - d * normal.x;
    out.y = v.y - d * normal.y;
    return out;
  }
  /**
   * out = m * v（矩阵变换）
   */
  static applyMatrix2D(out, v, m) {
    const x = v.x, y = v.y;
    out.x = m[0] * x + m[2] * y + m[4];
    out.y = m[1] * x + m[3] * y + m[5];
    return out;
  }
  static translate(out, v, tx, ty) {
    out.x = v.x + tx;
    out.y = v.y + ty;
    return out;
  }
  static rotateAround(out, v, angle, origin) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const ox = origin.x;
    const oy = origin.y;
    const x = v.x - ox;
    const y = v.y - oy;
    out.x = x * c - y * s + ox;
    out.y = y * s + x * c + oy;
    return out;
  }
  static rotate(out, v, angle, origin) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const ox = origin?.x ?? 0;
    const oy = origin?.y ?? 0;
    const x = v.x - ox;
    const y = v.y - oy;
    out.x = x * c - y * s + ox;
    out.y = y * s + x * c + oy;
    return out;
  }
  static scale(out, v, sx, sy) {
    out.x = v.x * sx;
    out.y = v.y * sy;
    return out;
  }
  /**
   * 计算点到线段的最短距离
   */
  static pointToSegmentDistance(p, a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) {
      return this.distance(p, a);
    }
    let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    const projX = a.x + t * dx;
    const projY = a.y + t * dy;
    return this.distance(p, { x: projX, y: projY });
  }
  /**
   * 计算点到折线的距离
   */
  static pointToPolylineDistance(p, points) {
    if (points.length < 2) return Infinity;
    let minDist = Infinity;
    for (let i = 0; i < points.length - 1; i++) {
      const dist = this.pointToSegmentDistance(p, points[i], points[i + 1]);
      if (dist < minDist) minDist = dist;
    }
    return minDist;
  }
  /**
   * 判断点是否在线段上（考虑线宽）
   */
  static isPointOnSegment(p, a, b, lineWidth) {
    const dist = this.pointToSegmentDistance(p, a, b);
    return dist <= lineWidth / 2;
  }
  /**
   * 计算两条线段的交点
   */
  static segmentIntersection(a1, a2, b1, b2) {
    const d1x = a2.x - a1.x;
    const d1y = a2.y - a1.y;
    const d2x = b2.x - b1.x;
    const d2y = b2.y - b1.y;
    const denom = d1x * d2y - d1y * d2x;
    if (Math.abs(denom) < 1e-10) return null;
    const t = ((b1.x - a1.x) * d2y - (b1.y - a1.y) * d2x) / denom;
    const u = ((b1.x - a1.x) * d1y - (b1.y - a1.y) * d1x) / denom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: a1.x + t * d1x,
        y: a1.y + t * d1y
      };
    }
    return null;
  }
  static random(out, min, max) {
    out.x = Math.floor(Math.random() * (max.x - min.x + 1) + min.x);
    out.y = Math.floor(Math.random() * (max.y - min.y + 1) + min.y);
    return out;
  }
  static randomScalar(out, min, max) {
    out.x = Math.floor(Math.random() * (max - min + 1) + min);
    out.y = Math.floor(Math.random() * (max - min + 1) + min);
    return out;
  }
  // ==================== 实例部分 ====================
  x;
  y;
  isVector2 = true;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  // ---- 写入 ----
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  copy(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }
  zero() {
    return this.set(0, 0);
  }
  // ---- 运算（委托给静态方法） ----
  add(v) {
    Vector2.add(this, this, v);
    return this;
  }
  addScalar(s) {
    Vector2.addScalar(this, this, s);
    return this;
  }
  addScaledVector(v, s) {
    Vector2.addScaledVector(this, this, v, s);
    return this;
  }
  subtract(v) {
    Vector2.subtract(this, this, v);
    return this;
  }
  multiply(v) {
    Vector2.multiply(this, this, v);
    return this;
  }
  multiplyScalar(s) {
    Vector2.multiplyScalar(this, this, s);
    return this;
  }
  divide(v) {
    Vector2.divide(this, this, v);
    return this;
  }
  divideScalar(scalar) {
    return this.multiplyScalar(1 / scalar);
  }
  negate() {
    Vector2.negate(this, this);
    return this;
  }
  normalize() {
    Vector2.normalize(this, this);
    return this;
  }
  lerp(to, t) {
    Vector2.lerp(this, this, to, t);
    return this;
  }
  project(onto) {
    Vector2.project(this, this, onto);
    return this;
  }
  /** this = min(this, v)（逐分量取最小） */
  min(v) {
    Vector2.min(this, this, v);
    return this;
  }
  /** this = max(this, v)（逐分量取最大） */
  max(v) {
    Vector2.max(this, this, v);
    return this;
  }
  perp() {
    Vector2.perpendicular(this, this);
    return this;
  }
  perpendicular() {
    Vector2.perpendicular(this, this);
    return this;
  }
  rotateCW() {
    Vector2.rotateCW(this, this);
    return this;
  }
  rotateCCW() {
    Vector2.rotateCCW(this, this);
    return this;
  }
  setLength(len) {
    return this.normalize().multiplyScalar(len);
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
  /** 应用矩阵变换 this = m * this */
  applyMatrix2D(m) {
    Vector2.applyMatrix2D(this, this, m);
    return this;
  }
  clamp(min, max) {
    Vector2.clamp(this, this, min, max);
    return this;
  }
  clampScalar(min, max) {
    Vector2.clampScalar(this, this, min, max);
    return this;
  }
  clampLength(min, max) {
    Vector2.clampLength(this, this, min, max);
    return this;
  }
  // ---- 查询 ----
  /** 长度 */
  magnitude() {
    return Math.hypot(this.x, this.y);
  }
  /** 长度的平方 */
  magnitudeSquared() {
    return this.x * this.x + this.y * this.y;
  }
  dot(v) {
    return Vector2.dot(this, v);
  }
  cross(v) {
    return Vector2.cross(this, v);
  }
  angle() {
    return Vector2.angle(this);
  }
  angleTo(v) {
    return Vector2.angleTo(this, v);
  }
  /**
  * 求两个向量的夹角，通过解交叉积公式 a x b = |a||b|sin(θ) 来求出 θ
  * the cross product a x b = |a||b|sin(θ) for θ.
  * @param {number} x the x-coordinate
  * @param {number} y the y-coordinate
  * @return {number} the angle in radians
  */
  angleWithSep(x, y) {
    return Math.atan2(
      this.x * y - this.y * x,
      this.x * x + this.y * y
    );
  }
  angleToSigned(v) {
    return Vector2.angleToSigned(this, v);
  }
  distance(v) {
    return Vector2.distance(this, v);
  }
  distanceTo(v) {
    return Vector2.distance(this, v);
  }
  distanceSquaredTo(v) {
    return Vector2.distanceSquared(this, v);
  }
  translate(tx, ty) {
    return Vector2.translate(this, this, tx, ty);
  }
  scale(sx, sy) {
    return Vector2.scale(this, this, sx, sy);
  }
  rotate(angle, origin) {
    Vector2.rotate(this, this, angle, origin);
    return this;
  }
  rotateAround(angle, origin) {
    Vector2.rotateAround(this, this, angle, origin);
    return this;
  }
  floor() {
    return this.set(Math.floor(this.x), Math.floor(this.y));
  }
  ceil() {
    return this.set(Math.ceil(this.x), Math.ceil(this.y));
  }
  round() {
    return this.set(Math.round(this.x), Math.round(this.y));
  }
  truncate() {
    return this.set(Math.trunc(this.x), Math.trunc(this.y));
  }
  abs() {
    return this.set(Math.abs(this.x), Math.abs(this.y));
  }
  sign() {
    return this.set(Math.sign(this.x), Math.sign(this.y));
  }
  fract() {
    return this.set(this.x - Math.floor(this.x), this.y - Math.floor(this.y));
  }
  isFinite() {
    return Number.isFinite(this.x) && Number.isFinite(this.y);
  }
  isZero() {
    return this.x === 0 && this.y === 0;
  }
  isOne() {
    return this.x === 1 && this.y === 1;
  }
  // ---- 工具 ----
  clone() {
    return new this.constructor(this.x, this.y);
  }
  toArray() {
    return [this.x, this.y];
  }
  toString() {
    return `Vector2(${this.x}, ${this.y})`;
  }
  equals(v) {
    return Vector2.equals(this, v);
  }
  equalsEpsilon(v, epsilon) {
    return Vector2.equalsEpsilon(this, v, epsilon);
  }
}
export {
  Vector2
};
