import { Quaternion } from "./Quaternion.js";
import { Matrix3 } from "./Matrix3.js";
import { Matrix4 } from "./Matrix4.js";
import { clamp } from "./MathUtils.js";
class Euler {
  // ---- 静态工厂 ----
  static zero() {
    return new Euler(0, 0, 0, "XYZ");
  }
  static fromValues(x = 0, y = 0, z = 0, order = "XYZ") {
    return new Euler(x, y, z, order);
  }
  static from(e) {
    return new Euler(e.x, e.y, e.z, e.order);
  }
  static fromArray(arr) {
    return new Euler(arr[0], arr[1], arr[2]);
  }
  /** 从旋转矩阵（3x3，仅旋转部分）提取欧拉角 */
  static fromMatrix3(m, order = "XYZ") {
    return new Euler(0, 0, 0, order).setFromRotationMatrix3(m);
  }
  /** 从四元数提取欧拉角 */
  static fromQuaternion(q, order = "XYZ") {
    return new Euler(0, 0, 0, order).setFromQuaternion(q);
  }
  static equals(a, b) {
    return a.x === b.x && a.y === b.y && a.z === b.z && (a.order ?? "XYZ") === (b.order ?? "XYZ");
  }
  static equalsEpsilon(a, b, epsilon = 1e-9) {
    return Math.abs(a.x - b.x) <= epsilon && Math.abs(a.y - b.y) <= epsilon && Math.abs(a.z - b.z) <= epsilon;
  }
  static add(out, a, b) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    out.z = a.z + b.z;
    out.order = b.order ?? a.order ?? "XYZ";
    return out;
  }
  static subtract(out, a, b) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    out.z = a.z - b.z;
    out.order = a.order ?? "XYZ";
    return out;
  }
  static lerp(out, a, b, t) {
    out.x = a.x + (b.x - a.x) * t;
    out.y = a.y + (b.y - a.y) * t;
    out.z = a.z + (b.z - a.z) * t;
    out.order = b.order ?? a.order ?? "XYZ";
    return out;
  }
  // ==================== 实例 ====================
  x;
  y;
  z;
  order;
  constructor(x = 0, y = 0, z = 0, order = "XYZ") {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
  }
  set(x, y, z, order = this.order) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
    return this;
  }
  copy(e) {
    this.x = e.x;
    this.y = e.y;
    this.z = e.z;
    this.order = e.order ?? "XYZ";
    return this;
  }
  zero() {
    return this.set(0, 0, 0);
  }
  add(e) {
    Euler.add(this, this, e);
    return this;
  }
  subtract(e) {
    Euler.subtract(this, this, e);
    return this;
  }
  lerp(to, t) {
    Euler.lerp(this, this, to, t);
    return this;
  }
  equals(e) {
    return Euler.equals(this, e);
  }
  equalsEpsilon(e, epsilon) {
    return Euler.equalsEpsilon(this, e, epsilon);
  }
  /** 从旋转矩阵（3x3，仅旋转部分）提取欧拉角，支持六种旋转顺序（three.js 算法） */
  setFromRotationMatrix3(m, order = this.order) {
    this.order = order;
    const m11 = m[0], m12 = m[3], m13 = m[6];
    const m21 = m[1], m22 = m[4], m23 = m[7];
    const m31 = m[2], m32 = m[5], m33 = m[8];
    const ord = order;
    if (ord === "XYZ") {
      this.y = Math.asin(clamp(m13, -1, 1));
      if (Math.abs(m13) < 0.9999999) {
        this.x = Math.atan2(-m23, m33);
        this.z = Math.atan2(-m12, m11);
      } else {
        this.x = Math.atan2(m32, m22);
        this.z = 0;
      }
    } else if (ord === "YXZ") {
      this.x = Math.asin(clamp(-m23, -1, 1));
      if (Math.abs(m23) < 0.9999999) {
        this.y = Math.atan2(m13, m33);
        this.z = Math.atan2(m21, m22);
      } else {
        this.y = Math.atan2(-m31, m11);
        this.z = 0;
      }
    } else if (ord === "ZXY") {
      this.x = Math.asin(clamp(m32, -1, 1));
      if (Math.abs(m32) < 0.9999999) {
        this.y = Math.atan2(-m31, m33);
        this.z = Math.atan2(-m12, m22);
      } else {
        this.y = 0;
        this.z = Math.atan2(m21, m11);
      }
    } else if (ord === "ZYX") {
      this.y = Math.asin(clamp(-m31, -1, 1));
      if (Math.abs(m31) < 0.9999999) {
        this.x = Math.atan2(m32, m33);
        this.z = Math.atan2(m21, m11);
      } else {
        this.x = 0;
        this.z = Math.atan2(-m12, m22);
      }
    } else if (ord === "YZX") {
      this.z = Math.asin(clamp(m21, -1, 1));
      if (Math.abs(m21) < 0.9999999) {
        this.x = Math.atan2(-m23, m22);
        this.y = Math.atan2(-m31, m11);
      } else {
        this.x = 0;
        this.y = Math.atan2(m13, m33);
      }
    } else if (ord === "XZY") {
      this.z = Math.asin(clamp(-m12, -1, 1));
      if (Math.abs(m12) < 0.9999999) {
        this.x = Math.atan2(m32, m22);
        this.y = Math.atan2(m13, m11);
      } else {
        this.x = Math.atan2(-m23, m33);
        this.y = 0;
      }
    }
    return this;
  }
  /** 从四元数提取欧拉角（q → 旋转矩阵 → 欧拉角） */
  setFromQuaternion(q, order = this.order) {
    return this.setFromRotationMatrix3(Quaternion.toMatrix3(q), order);
  }
  /** 转换为四元数（旋转顺序决定乘法次序，three.js 算法） */
  toQuaternion(out) {
    const q = out ?? new Quaternion();
    const x = this.x, y = this.y, z = this.z;
    const c1 = Math.cos(x / 2), c2 = Math.cos(y / 2), c3 = Math.cos(z / 2);
    const s1 = Math.sin(x / 2), s2 = Math.sin(y / 2), s3 = Math.sin(z / 2);
    switch (this.order) {
      case "XYZ":
        q.x = s1 * c2 * c3 + c1 * s2 * s3;
        q.y = c1 * s2 * c3 - s1 * c2 * s3;
        q.z = c1 * c2 * s3 + s1 * s2 * c3;
        q.w = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case "YXZ":
        q.x = s1 * c2 * c3 + c1 * s2 * s3;
        q.y = c1 * s2 * c3 - s1 * c2 * s3;
        q.z = c1 * c2 * s3 - s1 * s2 * c3;
        q.w = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      case "ZXY":
        q.x = s1 * c2 * c3 - c1 * s2 * s3;
        q.y = c1 * s2 * c3 + s1 * c2 * s3;
        q.z = c1 * c2 * s3 + s1 * s2 * c3;
        q.w = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case "ZYX":
        q.x = s1 * c2 * c3 - c1 * s2 * s3;
        q.y = c1 * s2 * c3 + s1 * c2 * s3;
        q.z = c1 * c2 * s3 - s1 * s2 * c3;
        q.w = c1 * c2 * c3 + s1 * s2 * s3;
        break;
      case "YZX":
        q.x = s1 * c2 * c3 + c1 * s2 * s3;
        q.y = c1 * s2 * c3 + s1 * c2 * s3;
        q.z = c1 * c2 * s3 - s1 * s2 * c3;
        q.w = c1 * c2 * c3 - s1 * s2 * s3;
        break;
      case "XZY":
        q.x = s1 * c2 * c3 - c1 * s2 * s3;
        q.y = c1 * s2 * c3 - s1 * c2 * s3;
        q.z = c1 * c2 * s3 + s1 * s2 * c3;
        q.w = c1 * c2 * c3 + s1 * s2 * s3;
        break;
    }
    return q;
  }
  /** 转换为 3x3 旋转矩阵 */
  toMatrix3(out) {
    const m = out ?? new Matrix3();
    return Quaternion.toMatrix3(this.toQuaternion(), m);
  }
  /** 转换为 4x4 旋转矩阵（左上 3x3 + 单位第四行/列） */
  toMatrix4(out) {
    const m = out ?? Matrix4.identity();
    return Quaternion.toMatrix4(this.toQuaternion(), m);
  }
  clone() {
    return new Euler(this.x, this.y, this.z, this.order);
  }
  toArray() {
    return [this.x, this.y, this.z];
  }
  toString() {
    return `Euler(${this.x}, ${this.y}, ${this.z}, ${this.order})`;
  }
}
export {
  Euler
};
