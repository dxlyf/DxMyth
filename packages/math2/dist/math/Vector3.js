import { CachePool } from "./CachePool.js";
class Vector3 {
  static pool = CachePool.create({
    initSize: 20,
    create: () => new Vector3(0, 0, 0),
    init(item) {
      item.set(0, 0, 0);
    }
  });
  // ---- 静态工厂 ----
  static default() {
    return this.create();
  }
  static create(x = 0, y = 0, z = 0) {
    return new Vector3(x, y, z);
  }
  static zero() {
    return new Vector3(0, 0, 0);
  }
  static one() {
    return new Vector3(1, 1, 1);
  }
  static fromValues(x, y, z) {
    return new Vector3(x, y, z);
  }
  static fromScalar(s) {
    return new Vector3(s, s, s);
  }
  /** 从类向量对象创建 */
  static from(v) {
    return new Vector3(v.x, v.y, v.z);
  }
  /** 从数组创建 */
  static fromArray(arr) {
    return new Vector3(arr[0], arr[1], arr[2]);
  }
  /** X 轴单位向量 */
  static unitX() {
    return new Vector3(1, 0, 0);
  }
  /** Y 轴单位向量 */
  static unitY() {
    return new Vector3(0, 1, 0);
  }
  /** Z 轴单位向量 */
  static unitZ() {
    return new Vector3(0, 0, 1);
  }
  // ---- 静态运算（out 可复用） ----
  /** out = a + b */
  static add(out, a, b) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    out.z = a.z + b.z;
    return out;
  }
  static addScaled(out, v, s) {
    out.x = s * v.x;
    out.y = s * v.y;
    out.z = s * v.z;
    return out;
  }
  /** out = a - b */
  static subtract(out, a, b) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    out.z = a.z - b.z;
    return out;
  }
  /** out = a ⊙ b（逐分量相乘） */
  static multiply(out, a, b) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    out.z = a.z * b.z;
    return out;
  }
  /** out = v * s */
  static multiplyScalar(out, v, s) {
    out.x = v.x * s;
    out.y = v.y * s;
    out.z = v.z * s;
    return out;
  }
  /** out = v / s */
  static divide(out, v, s) {
    out.x = v.x / s;
    out.y = v.y / s;
    out.z = v.z / s;
    return out;
  }
  /** out = -v */
  static negate(out, v) {
    out.x = -v.x;
    out.y = -v.y;
    out.z = -v.z;
    return out;
  }
  /** out = normalized(v)；零向量时返回零向量 */
  static normalize(out, v) {
    const len = Math.hypot(v.x, v.y, v.z);
    if (len === 0) {
      out.x = 0;
      out.y = 0;
      out.z = 0;
      return out;
    }
    out.x = v.x / len;
    out.y = v.y / len;
    out.z = v.z / len;
    return out;
  }
  /** a · b */
  static dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }
  /** out = a × b（3D 叉积） */
  static cross(out, a, b) {
    const ax = a.x, ay = a.y, az = a.z;
    const bx = b.x, by = b.y, bz = b.z;
    out.x = ay * bz - az * by;
    out.y = az * bx - ax * bz;
    out.z = ax * by - ay * bx;
    return out;
  }
  /** out = a 在 b 上的投影 */
  static project(out, a, b) {
    const dot = Vector3.dot(a, b);
    const lenSq = Vector3.dot(b, b);
    if (lenSq === 0) {
      out.x = 0;
      out.y = 0;
      out.z = 0;
      return out;
    }
    const s = dot / lenSq;
    out.x = b.x * s;
    out.y = b.y * s;
    out.z = b.z * s;
    return out;
  }
  /** out = lerp(a, b, t)；t=0 得 a，t=1 得 b */
  static lerp(out, a, b, t) {
    out.x = a.x + (b.x - a.x) * t;
    out.y = a.y + (b.y - a.y) * t;
    out.z = a.z + (b.z - a.z) * t;
    return out;
  }
  /** |a - b| */
  static distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
  }
  /** |a - b|²（避免 sqrt） */
  static distanceSquared(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return dx * dx + dy * dy + dz * dz;
  }
  /** a 和 b 之间的夹角 (rad) */
  static angleBetween(a, b) {
    const dot = Vector3.dot(a, b);
    const lenProd = Math.hypot(a.x, a.y, a.z) * Math.hypot(b.x, b.y, b.z);
    if (lenProd === 0) return 0;
    return Math.acos(Math.max(-1, Math.min(1, dot / lenProd)));
  }
  static equals(a, b) {
    return a.x === b.x && a.y === b.y && a.z === b.z;
  }
  /** 判断 a 与 b 是否近似相等 */
  static equalsEpsilon(a, b, epsilon = 1e-9) {
    return Math.abs(a.x - b.x) <= epsilon && Math.abs(a.y - b.y) <= epsilon && Math.abs(a.z - b.z) <= epsilon;
  }
  /** out = min(a, b)（逐分量取最小） */
  static min(out, a, b) {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    out.z = Math.min(a.z, b.z);
    return out;
  }
  /** out = max(a, b)（逐分量取最大） */
  static max(out, a, b) {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    out.z = Math.max(a.z, b.z);
    return out;
  }
  /** out = clamp(v, min, max) */
  static clamp(out, v, min, max) {
    out.x = Math.max(min.x, Math.min(max.x, v.x));
    out.y = Math.max(min.y, Math.min(max.y, v.y));
    out.z = Math.max(min.z, Math.min(max.z, v.z));
    return out;
  }
  /** out = reflect(v, normal)；normal 需为单位向量 */
  static reflect(out, v, normal) {
    const d = 2 * Vector3.dot(v, normal);
    out.x = v.x - d * normal.x;
    out.y = v.y - d * normal.y;
    out.z = v.z - d * normal.z;
    return out;
  }
  /** out = m * v（3x3 矩阵变换，列主序） */
  static applyMatrix3(out, v, m) {
    const x = v.x, y = v.y, z = v.z;
    out.x = m[0] * x + m[3] * y + m[6] * z;
    out.y = m[1] * x + m[4] * y + m[7] * z;
    out.z = m[2] * x + m[5] * y + m[8] * z;
    return out;
  }
  /** out = m * v（4x4 矩阵变换，w=1 带透视除法，列主序） */
  static applyMatrix4(out, v, m) {
    const x = v.x, y = v.y, z = v.z;
    const w = m[3] * x + m[7] * y + m[11] * z + m[15];
    const invW = w === 0 ? 1 : 1 / w;
    out.x = (m[0] * x + m[4] * y + m[8] * z + m[12]) * invW;
    out.y = (m[1] * x + m[5] * y + m[9] * z + m[13]) * invW;
    out.z = (m[2] * x + m[6] * y + m[10] * z + m[14]) * invW;
    return out;
  }
  // ==================== 实例部分 ====================
  x;
  y;
  z;
  isVector3 = true;
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  // ---- 写入 ----
  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  copy(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }
  zero() {
    return this.set(0, 0, 0);
  }
  one() {
    return this.set(1, 1, 1);
  }
  // ---- 运算（委托给静态方法） ----
  addVectors(a, b) {
    Vector3.add(this, a, b);
    return this;
  }
  add(v) {
    Vector3.add(this, this, v);
    return this;
  }
  addScaled(v, s) {
    Vector3.addScaled(this, v, s);
    return this;
  }
  subtractVectors(a, b) {
    Vector3.subtract(this, a, b);
    return this;
  }
  subtract(v) {
    Vector3.subtract(this, this, v);
    return this;
  }
  multiplyVectors(a, b) {
    Vector3.multiply(this, a, b);
    return this;
  }
  multiply(v) {
    Vector3.multiply(this, this, v);
    return this;
  }
  multiplyScalar(s) {
    Vector3.multiplyScalar(this, this, s);
    return this;
  }
  divide(s) {
    Vector3.divide(this, this, s);
    return this;
  }
  negate() {
    Vector3.negate(this, this);
    return this;
  }
  normalize() {
    Vector3.normalize(this, this);
    return this;
  }
  lerp(to, t) {
    Vector3.lerp(this, this, to, t);
    return this;
  }
  project(onto) {
    Vector3.project(this, this, onto);
    return this;
  }
  /** this = min(this, v)（逐分量取最小） */
  min(v) {
    Vector3.min(this, this, v);
    return this;
  }
  /** this = max(this, v)（逐分量取最大） */
  max(v) {
    Vector3.max(this, this, v);
    return this;
  }
  crossVectors(a, b) {
    Vector3.cross(this, a, b);
    return this;
  }
  cross(v) {
    Vector3.cross(this, this, v);
    return this;
  }
  /** this = m * this（3x3 矩阵变换） */
  applyMatrix3(m) {
    Vector3.applyMatrix3(this, this, m);
    return this;
  }
  /** this = m * this（4x4 矩阵变换，带透视除法） */
  applyMatrix4(m) {
    Vector3.applyMatrix4(this, this, m);
    return this;
  }
  // ---- 查询 ----
  /** 长度 */
  magnitude() {
    return Math.hypot(this.x, this.y, this.z);
  }
  /** 长度的平方 */
  magnitudeSquared() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  dot(v) {
    return Vector3.dot(this, v);
  }
  crossWith(v) {
    const r = Vector3.cross(Vector3.pool.get(), this, v);
    return r;
  }
  angle(v) {
    return Vector3.angleBetween(this, v);
  }
  distanceTo(v) {
    return Vector3.distance(this, v);
  }
  distanceSquaredTo(v) {
    return Vector3.distanceSquared(this, v);
  }
  transformDirection(m) {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const e = m;
    this.x = e[0] * x + e[4] * y + e[8] * z;
    this.y = e[1] * x + e[5] * y + e[9] * z;
    this.z = e[2] * x + e[6] * y + e[10] * z;
    return this.normalize();
  }
  applyQuat(q) {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const qx = q.x;
    const qy = q.y;
    const qz = q.z;
    const qw = q.w;
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;
    this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return this;
  }
  applyAxisAngle(axis, radians) {
    const c = Math.cos(radians);
    const s = Math.sin(radians);
    const { x, y, z } = this;
    const ax = axis.x;
    const ay = axis.y;
    const az = axis.z;
    const dot = ax * x + ay * y + az * z;
    this.x = x * c + (ay * z - az * y) * s + ax * dot * (1 - c);
    this.y = y * c + (az * x - ax * z) * s + ay * dot * (1 - c);
    this.z = z * c + (ax * y - ay * x) * s + az * dot * (1 - c);
    return this;
  }
  equals(v) {
    return Vector3.equals(this, v);
  }
  equalsEpsilon(v, epsilon) {
    return Vector3.equalsEpsilon(this, v, epsilon);
  }
  isFinite() {
    return Number.isFinite(this.x) && Number.isFinite(this.y) && Number.isFinite(this.z);
  }
  isZero() {
    return this.x === 0 && this.y === 0 && this.z === 0;
  }
  isOne() {
    return this.x === 1 && this.y === 1 && this.z === 1;
  }
  // ---- 工具 ----
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
  toArray() {
    return [this.x, this.y, this.z];
  }
  toString() {
    return `Vector3(${this.x}, ${this.y}, ${this.z})`;
  }
}
export {
  Vector3
};
