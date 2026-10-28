import { Matrix2D } from "./Matrix2D.js";
import { Point } from "./Point.js";
import { radToDeg, degToRad } from "./MathUtils.js";
import { EventEmitter } from "../events/EventEmitter.js";
class Transform extends EventEmitter {
  // ---- 内部存储 ----
  position;
  scale;
  _rotation = 0;
  skew;
  origin;
  pivot;
  // ---- 矩阵缓存 ----
  _matrix = Matrix2D.identity();
  _worldMatrix = Matrix2D.identity();
  _worldMatrixInvert = Matrix2D.identity();
  _worldScale = 1;
  // ---- 版本追踪 ----
  /** 当前局部属性版本（Point onChange 或 rotation setter 自动递增） */
  _localMatrixDirty = true;
  _worldMatrixDirty = true;
  _worldVersion = 0;
  _parentWorldVersion = -1;
  constructor(options = {}) {
    super();
    this.updateTransform = this.updateTransform.bind(this);
    this.position = Point.fromPoint(options.position ?? { x: 0, y: 0 }).onChange(this.updateTransform);
    this.scale = Point.fromPoint(options.scale ?? { x: 1, y: 1 }).onChange(this.updateTransform);
    this.skew = Point.fromPoint(options.skew ?? { x: 0, y: 0 }).onChange(this.updateTransform);
    this.origin = Point.fromPoint(options.origin ?? { x: 0, y: 0 }).onChange(this.updateTransform);
    this.pivot = Point.fromPoint(options.pivot ?? { x: 0, y: 0 }).onChange(this.updateTransform);
  }
  // ==================== 访问器 ====================
  get rotation() {
    return this._rotation;
  }
  set rotation(v) {
    if (this._rotation !== v) {
      this._rotation = v;
      this.updateTransform();
    }
  }
  get angle() {
    return radToDeg(this._rotation);
  }
  set angle(v) {
    this.rotation = degToRad(v);
  }
  /** 局部变换矩阵（只读，懒计算） */
  get matrix() {
    this.updateMatrix();
    return this._matrix;
  }
  /** 获取世界矩阵的全局缩放系数 */
  get worldScale() {
    this.updateWorldMatrix();
    return this._worldScale;
  }
  /** 世界变换矩阵（只读，懒计算，自动跟随 parent 链） */
  get worldMatrix() {
    this.updateWorldMatrix();
    return this._worldMatrix;
  }
  /** 世界变换矩阵的逆（只读，懒计算） */
  get worldMatrixInvert() {
    this.updateWorldMatrix();
    return this._worldMatrixInvert;
  }
  /** 本地版本是否变化（触发 world 重算） */
  _needsWorldUpdate() {
    const parent = this.parent;
    if (parent) {
      return this._worldMatrixDirty || parent._worldVersion !== this._parentWorldVersion || parent._needsWorldUpdate();
    }
    return this._worldMatrixDirty;
  }
  updateMatrix(force = false) {
    if (!force && !this._localMatrixDirty) {
      return;
    }
    Matrix2D.fromTranslateRotationSkewScaleOriginPivot(
      this._matrix,
      this.position,
      this._rotation,
      this.skew,
      this.scale,
      this.origin,
      this.pivot
    );
    this._localMatrixDirty = false;
    this._worldMatrixDirty = true;
  }
  /**
   * 计算世界变换矩阵。
   *
   * 无 parent: M_world = M_local
   * 有 parent: M_world = M_parent · M_local
   */
  updateWorldMatrix(force = false) {
    if (!force && !this._needsWorldUpdate()) {
      return;
    }
    this.updateMatrix();
    const parent = this.parent;
    if (this.parent) {
      Matrix2D.multiply(this._worldMatrix, parent.worldMatrix, this._matrix);
      this._parentWorldVersion = parent._worldVersion;
    } else {
      this._worldMatrix.copy(this._matrix);
    }
    this._worldMatrixInvert.copy(this._worldMatrix).invert();
    this._worldScale = this._worldMatrix.getScale();
    this._worldVersion++;
    this._worldMatrixDirty = false;
  }
  // ==================== 公开方法 ====================
  /**
   * 强制标记为脏，下次访问 matrix/worldMatrix 时会重算。
   * 适用于批量设置多个属性后仅触发一次重算的场景。
   */
  updateTransform() {
    this._localMatrixDirty = true;
    this._worldMatrixDirty = true;
    this.emit("transform:change", this);
    this.onTransformChange();
  }
  onTransformChange() {
  }
  /** 重置所有变换为默认值 */
  resetTransform() {
    this.position.set(0, 0);
    this.scale.set(1, 1);
    this._rotation = 0;
    this.skew.set(0, 0);
    this.origin.set(0, 0);
    this.pivot.set(0, 0);
    this.updateTransform();
  }
  /**
   * 将世界坐标转换为本地坐标。
   * result = M_world⁻¹ · point
   */
  worldToLocal(point, out) {
    const [a, b, c, d, tx, ty] = this.worldMatrixInvert;
    out.x = a * point.x + c * point.y + tx;
    out.y = b * point.x + d * point.y + ty;
    return out;
  }
  /**
   * 将本地坐标转换为世界坐标。
   * result = M_world · point
   */
  localToWorld(point, out) {
    const [a, b, c, d, tx, ty] = this.worldMatrix;
    out.x = a * point.x + c * point.y + tx;
    out.y = b * point.x + d * point.y + ty;
    return out;
  }
  decompose(matrix) {
    Matrix2D.decomposeTransform(matrix, this);
  }
  // ---- 便捷设置（批量操作仅触发一次版本变更） ----
  /** 批量设置变换属性 */
  setTransform(options) {
    if (options.position) this.position.copy(options.position);
    if (options.scale) this.scale.copy(options.scale);
    if (options.rotation !== void 0) this.rotation = options.rotation;
    if (options.skew) this.skew.copy(options.skew);
    if (options.origin) this.origin.copy(options.origin);
    if (options.pivot) this.pivot.copy(options.pivot);
    return this;
  }
  /** 从另一个 Transform 拷贝变换属性 */
  copyFrom(other) {
    this.position.copy(other.position);
    this.scale.copy(other.scale);
    this._rotation = other._rotation;
    this.skew.copy(other.skew);
    this.origin.copy(other.origin);
    this.pivot.copy(other.pivot);
    return this;
  }
}
export {
  Transform
};
