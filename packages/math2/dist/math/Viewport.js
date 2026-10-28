import { Point } from "./Point.js";
import { Matrix2D } from "./Matrix2D.js";
import { BoundingRect } from "./BoundingRect.js";
class Viewport {
  position;
  size;
  _zoom = 1;
  _rotation = 0;
  // 缓存变换矩阵（用于性能优化）
  _worldToScreenMatrix = null;
  _screenToWorldMatrix = null;
  _dirty = true;
  _screenToWorldMatrixDirty = true;
  // 可见区域缓存
  _cachedVisibleBounds = null;
  _visibleBoundsDirty = true;
  constructor(width = 0, height = 0) {
    this._worldToScreenMatrix = Matrix2D.identity();
    this._screenToWorldMatrix = Matrix2D.identity();
    this._cachedVisibleBounds = BoundingRect.fromLTRB(0, 0, width, height);
    this.position = new Point(0, 0);
    this.position.onChange(() => {
      this.markMatrixUpdate();
    });
    this.size = new Point(width, height);
    this.size.onChange(() => {
      this.markMatrixUpdate();
    });
    this.size.set(width, height);
  }
  // ============ 属性访问器 ============
  get zoom() {
    return this._zoom;
  }
  set zoom(value) {
    this._zoom = Math.max(0.01, Math.min(100, value));
    this.markMatrixUpdate();
  }
  get rotation() {
    return this._rotation;
  }
  set rotation(value) {
    this._rotation = value;
    this.markMatrixUpdate();
  }
  get width() {
    return this.size.x;
  }
  set width(value) {
    this.size.x = value;
  }
  get height() {
    return this.size.y;
  }
  set height(value) {
    this.size.y = value;
  }
  markMatrixUpdate() {
    this._dirty = true;
    this._visibleBoundsDirty = true;
  }
  // ============ 坐标转换 ============
  /**
   * 世界坐标 → 屏幕坐标
   */
  worldToScreen(worldPos) {
    const matrix = this.getWorldToScreenMatrix();
    return matrix.transformPoint(worldPos);
  }
  /**
   * 屏幕坐标 → 世界坐标
   */
  screenToWorld(screenPos) {
    const matrix = this.getScreenToWorldMatrix();
    return matrix.transformPoint(screenPos);
  }
  /**
   * 世界矩形 → 屏幕矩形
   */
  worldRectToScreen(worldRect) {
    const topLeft = this.worldToScreen({ x: worldRect.x, y: worldRect.y });
    const bottomRight = this.worldToScreen({
      x: worldRect.x + worldRect.width,
      y: worldRect.y + worldRect.height
    });
    return BoundingRect.fromLTRB(topLeft.x, topLeft.y, bottomRight.x, bottomRight.y);
  }
  /**
   * 屏幕矩形 → 世界矩形
   */
  screenRectToWorld(screenRect) {
    const topLeft = this.screenToWorld({ x: screenRect.x, y: screenRect.y });
    const bottomRight = this.screenToWorld({
      x: screenRect.x + screenRect.width,
      y: screenRect.y + screenRect.height
    });
    return BoundingRect.fromLTRB(topLeft.x, topLeft.y, bottomRight.x, bottomRight.y);
  }
  // ============ 变换矩阵 ============
  /**
   * 获取世界→屏幕变换矩阵
   */
  getWorldToScreenMatrix() {
    if (this._dirty) {
      this.updateWorldToScreenMatrix();
      this._dirty = false;
      this._screenToWorldMatrixDirty = true;
    }
    return this._worldToScreenMatrix;
  }
  /**
   * 获取屏幕→世界变换矩阵
   */
  getScreenToWorldMatrix() {
    const worldToScreen = this.getWorldToScreenMatrix();
    if (this._screenToWorldMatrixDirty) {
      this._screenToWorldMatrix.copy(worldToScreen).invert();
      this._screenToWorldMatrixDirty = false;
    }
    return this._screenToWorldMatrix;
  }
  /**
   * 构建世界→屏幕变换矩阵
   * 变换顺序：世界 → 视口变换 → 屏幕
   */
  updateWorldToScreenMatrix() {
    const matrix = this._worldToScreenMatrix;
    matrix.identity();
    matrix.translate(-this.position.x, -this.position.y);
    if (this._rotation !== 0) {
      matrix.rotate(-this._rotation);
    }
    matrix.scale(this._zoom, this._zoom);
    return matrix;
  }
  // ============ 视口操作 ============
  /**
   * 平移视口
   */
  pan(dx, dy) {
    const worldDelta = this.screenToWorld({ x: dx, y: dy });
    const current = this.screenToWorld({ x: 0, y: 0 });
    this.position.x = current.x - worldDelta.x;
    this.position.y = current.y - worldDelta.y;
    this.markMatrixUpdate();
  }
  /**
   * 在指定点缩放
   * @param zoomFactor 缩放因子（>1 放大，<1 缩小）
   * @param centerScreen 缩放中心（屏幕坐标），默认在视口中心
   */
  zoomAt(zoomFactor, centerScreen) {
    const center = centerScreen || { x: this.size.x / 2, y: this.size.y / 2 };
    const worldCenter = this.screenToWorld(center);
    this._zoom = Math.max(0.01, Math.min(100, this._zoom * zoomFactor));
    this.markMatrixUpdate();
    const newWorldCenter = this.screenToWorld(center);
    this.position.x += worldCenter.x - newWorldCenter.x;
    this.position.y += worldCenter.y - newWorldCenter.y;
  }
  /**
   * 使视口适应指定的边界
   */
  fitToBounds(bounds, padding = 20) {
    const aspect = this.size.width / this.size.height;
    const boundsAspect = bounds.width / bounds.height;
    let zoom;
    if (boundsAspect > aspect) {
      zoom = (this.size.width - padding * 2) / bounds.width;
    } else {
      zoom = (this.size.height - padding * 2) / bounds.height;
    }
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;
    this._zoom = zoom;
    this.position.set(centerX, centerY);
    this.markMatrixUpdate();
  }
  /**
   * 重置视口
   */
  reset() {
    this.position.set(0, 0);
    this._zoom = 1;
    this._rotation = 0;
    this._dirty = true;
    this._cachedVisibleBounds = null;
  }
  // ============ 可见区域计算 ============
  /**
   * 获取在世界坐标系中的可见区域
   */
  getVisibleWorldBounds() {
    if (!this._visibleBoundsDirty) {
      return this._cachedVisibleBounds;
    }
    const corners = [
      this.screenToWorld({ x: 0, y: 0 }),
      this.screenToWorld({ x: this.size.width, y: 0 }),
      this.screenToWorld({ x: 0, y: this.size.height }),
      this.screenToWorld({ x: this.size.width, y: this.size.height })
    ];
    this._cachedVisibleBounds.fromPoints(corners);
    return this._cachedVisibleBounds;
  }
  /**
   * 检查一个世界矩形是否在可见区域内
   */
  isVisible(worldRect, margin = 0) {
    const visible = this.getVisibleWorldBounds();
    const expandedVisible = {
      x: visible.x - margin,
      y: visible.y - margin,
      width: visible.width + margin * 2,
      height: visible.height + margin * 2
    };
    return !(worldRect.x + worldRect.width < expandedVisible.x || worldRect.x > expandedVisible.x + expandedVisible.width || worldRect.y + worldRect.height < expandedVisible.y || worldRect.y > expandedVisible.y + expandedVisible.height);
  }
}
export {
  Viewport
};
