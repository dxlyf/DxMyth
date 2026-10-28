import { Vector2 } from "./Vector2.js";
import { BoundingRect } from "./BoundingRect.js";
import { CachePool } from "./CachePool.js";
class OrientedBoundingRect {
  static pool = CachePool.create({
    initSize: 10,
    create: () => new OrientedBoundingRect(),
    init: (item) => {
      item.topLeft.set(0, 0);
      item.topRight.set(0, 0);
      item.bottomRight.set(0, 0);
      item.bottomLeft.set(0, 0);
    }
  });
  /** 4 个角点（逆时针顺序：topLeft→topRight→bottomRight→bottomLeft） */
  topLeft;
  topRight;
  bottomRight;
  bottomLeft;
  constructor(tx = 0, ty = 0, trx = 0, try_ = 0, brx = 0, bry = 0, blx = 0, bly = 0) {
    this.topLeft = new Vector2(tx, ty);
    this.topRight = new Vector2(trx, try_);
    this.bottomRight = new Vector2(brx, bry);
    this.bottomLeft = new Vector2(blx, bly);
  }
  // ---- 派生属性 ----
  /** 中心点（对角线 topLeft-bottomRight 中点） */
  get center() {
    return { x: (this.topLeft.x + this.bottomRight.x) * 0.5, y: (this.topLeft.y + this.bottomRight.y) * 0.5 };
  }
  /** 旋转角（弧度），topLeft→topRight 方向 */
  get rotation() {
    return Math.atan2(this.topRight.y - this.topLeft.y, this.topRight.x - this.topLeft.x);
  }
  /** 宽度 */
  get width() {
    const dx = this.topRight.x - this.topLeft.x;
    const dy = this.topRight.y - this.topLeft.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  /** 高度 */
  get height() {
    const dx = this.bottomLeft.x - this.topLeft.x;
    const dy = this.bottomLeft.y - this.topLeft.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  /** 半宽 */
  get halfWidth() {
    return this.width * 0.5;
  }
  /** 半高 */
  get halfHeight() {
    return this.height * 0.5;
  }
  /** 面积 */
  get area() {
    return this.width * this.height;
  }
  /** 局部 X 轴（topLeft→topRight 方向单位向量） */
  getAxisX() {
    const dx = this.topRight.x - this.topLeft.x;
    const dy = this.topRight.y - this.topLeft.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return { x: 1, y: 0 };
    return { x: dx / len, y: dy / len };
  }
  /** 局部 Y 轴（topLeft→bottomLeft 方向单位向量） */
  getAxisY() {
    const dx = this.bottomLeft.x - this.topLeft.x;
    const dy = this.bottomLeft.y - this.topLeft.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return { x: 0, y: 1 };
    return { x: dx / len, y: dy / len };
  }
  // ---- 静态工厂 ----
  static default() {
    return new OrientedBoundingRect();
  }
  /** 从 4 个角点创建（逆时针：topLeft→topRight→bottomRight→bottomLeft） */
  static fromCorners(topLeft, topRight, bottomRight, bottomLeft) {
    return new OrientedBoundingRect(
      topLeft.x,
      topLeft.y,
      topRight.x,
      topRight.y,
      bottomRight.x,
      bottomRight.y,
      bottomLeft.x,
      bottomLeft.y
    );
  }
  /** 从 AABB 创建（旋转角为 0） */
  static fromBoundingRect(rect) {
    return new OrientedBoundingRect(
      rect.left,
      rect.top,
      rect.right,
      rect.top,
      rect.right,
      rect.bottom,
      rect.left,
      rect.bottom
    );
  }
  /** 从中心、半尺寸、旋转角创建 */
  static fromCenterRotation(cx, cy, hw, hh, rotation) {
    const cosA = Math.cos(rotation);
    const sinA = Math.sin(rotation);
    const toWorld = (lx, ly) => [
      cx + lx * cosA - ly * sinA,
      cy + lx * sinA + ly * cosA
    ];
    const [x0, y0] = toWorld(-hw, -hh);
    const [x1, y1] = toWorld(hw, -hh);
    const [x2, y2] = toWorld(hw, hh);
    const [x3, y3] = toWorld(-hw, hh);
    return new OrientedBoundingRect(x0, y0, x1, y1, x2, y2, x3, y3);
  }
  /** 从点集计算最小面积 OBB（PCA 方法） */
  static fromPoints(points) {
    if (points.length === 0) return new OrientedBoundingRect();
    let cx = 0, cy = 0;
    for (const p of points) {
      cx += p.x;
      cy += p.y;
    }
    cx /= points.length;
    cy /= points.length;
    let cxx = 0, cyy = 0, cxy = 0;
    for (const p of points) {
      const dx = p.x - cx, dy = p.y - cy;
      cxx += dx * dx;
      cyy += dy * dy;
      cxy += dx * dy;
    }
    cxx /= points.length;
    cyy /= points.length;
    cxy /= points.length;
    const angle = 0.5 * Math.atan2(2 * cxy, cxx - cyy);
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;
    for (const p of points) {
      const dx = p.x - cx, dy = p.y - cy;
      const lx = dx * cosA + dy * sinA;
      const ly = -dx * sinA + dy * cosA;
      if (lx < minX) minX = lx;
      if (ly < minY) minY = ly;
      if (lx > maxX) maxX = lx;
      if (ly > maxY) maxY = ly;
    }
    const hw = (maxX - minX) * 0.5;
    const hh = (maxY - minY) * 0.5;
    const localCx = (minX + maxX) * 0.5;
    const localCy = (minY + maxY) * 0.5;
    const worldCx = cx + localCx * cosA - localCy * sinA;
    const worldCy = cy + localCx * sinA + localCy * cosA;
    return OrientedBoundingRect.fromCenterRotation(worldCx, worldCy, hw, hh, angle);
  }
  // ---- 获取角点 ----
  /** 获取 4 个角点（逆时针），存入 out */
  getCorners(out) {
    if (!out[0]) out[0] = new Vector2();
    out[0].copy(this.topLeft);
    if (!out[1]) out[1] = new Vector2();
    out[1].copy(this.topRight);
    if (!out[2]) out[2] = new Vector2();
    out[2].copy(this.bottomRight);
    if (!out[3]) out[3] = new Vector2();
    out[3].copy(this.bottomLeft);
    return out;
  }
  /** 获取轴对齐包围盒 */
  getBoundingRect() {
    const rect = BoundingRect.default();
    rect.add(this.topLeft.x, this.topLeft.y);
    rect.add(this.topRight.x, this.topRight.y);
    rect.add(this.bottomRight.x, this.bottomRight.y);
    rect.add(this.bottomLeft.x, this.bottomLeft.y);
    return rect;
  }
  // ---- 包含与相交检测 ----
  /**
   * 判断点是否在 OBB 内部（含边界）
   * 使用叉积符号法：点与每条边形成的三角形方向一致则在内部
   */
  contains(x, y) {
    const corners = [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft];
    for (let i = 0; i < 4; i++) {
      const a = corners[i];
      const b = corners[(i + 1) % 4];
      const cross = (b.x - a.x) * (y - a.y) - (b.y - a.y) * (x - a.x);
      if (cross < 0) return false;
    }
    return true;
  }
  /**
   * 判断是否与另一个 OBB 相交（分离轴定理 SAT）
   * 2D 中检查 4 个分离轴：两个 OBB 的边法线方向
   */
  intersects(other) {
    const cornersA = [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft];
    const cornersB = [other.topLeft, other.topRight, other.bottomRight, other.bottomLeft];
    const getAxes = (c) => {
      const axes = [];
      for (let i = 0; i < 2; i++) {
        const dx = c[i + 1].x - c[i].x;
        const dy = c[i + 1].y - c[i].y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len > 0) {
          axes.push([dy / len, dx / len]);
        }
      }
      return axes;
    };
    const allAxes = [...getAxes(cornersA), ...getAxes(cornersB)];
    for (const [ax, ay] of allAxes) {
      let minA = Infinity, maxA = -Infinity;
      for (const c of cornersA) {
        const proj = c.x * ax + c.y * ay;
        if (proj < minA) minA = proj;
        if (proj > maxA) maxA = proj;
      }
      let minB = Infinity, maxB = -Infinity;
      for (const c of cornersB) {
        const proj = c.x * ax + c.y * ay;
        if (proj < minB) minB = proj;
        if (proj > maxB) maxB = proj;
      }
      if (maxA < minB || maxB < minA) return false;
    }
    return true;
  }
  /** 判断是否与 AABB 相交 */
  intersectsRect(rect) {
    const temp = OrientedBoundingRect.fromBoundingRect(rect);
    return this.intersects(temp);
  }
  // ---- 写入 / 变换 ----
  copy(other) {
    this.topLeft.copy(other.topLeft);
    this.topRight.copy(other.topRight);
    this.bottomRight.copy(other.bottomRight);
    this.bottomLeft.copy(other.bottomLeft);
    return this;
  }
  /** 用中心+半尺寸+旋转角设置 OBB */
  setFromCenterRotation(cx, cy, hw, hh, rotation) {
    const cosA = Math.cos(rotation);
    const sinA = Math.sin(rotation);
    const toWorld = (lx, ly) => [
      cx + lx * cosA - ly * sinA,
      cy + lx * sinA + ly * cosA
    ];
    const [x0, y0] = toWorld(-hw, -hh);
    const [x1, y1] = toWorld(hw, -hh);
    const [x2, y2] = toWorld(hw, hh);
    const [x3, y3] = toWorld(-hw, hh);
    this.topLeft.set(x0, y0);
    this.topRight.set(x1, y1);
    this.bottomRight.set(x2, y2);
    this.bottomLeft.set(x3, y3);
    return this;
  }
  /**
   * 应用 2D 仿射矩阵变换 OBB。
   * 变换 4 个角点后用 PCA 重新计算紧致包围盒。
   */
  applyMatrix2D(m) {
    const corners = [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft];
    for (const c of corners) {
      const x = c.x * m[0] + c.y * m[2] + m[4];
      const y = c.x * m[1] + c.y * m[3] + m[5];
      c.set(x, y);
    }
    return this;
  }
  /** 平移 OBB */
  translate(tx, ty) {
    this.topLeft.x += tx;
    this.topLeft.y += ty;
    this.topRight.x += tx;
    this.topRight.y += ty;
    this.bottomRight.x += tx;
    this.bottomRight.y += ty;
    this.bottomLeft.x += tx;
    this.bottomLeft.y += ty;
    return this;
  }
  /**
   * 将 OBB 扩展以包含指定点（放宽版，不再是最紧密包围）。
   */
  expandPoint(x, y) {
    if (this.contains(x, y)) return this;
    const allCorners = [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft].map((c) => ({ x: c.x, y: c.y }));
    allCorners.push({ x, y });
    const obb = OrientedBoundingRect.fromPoints(allCorners);
    this.copy(obb);
    return this;
  }
  /** 设置角点 */
  setCorners(topLeft, topRight, bottomRight, bottomLeft) {
    this.topLeft.set(topLeft.x, topLeft.y);
    this.topRight.set(topRight.x, topRight.y);
    this.bottomRight.set(bottomRight.x, bottomRight.y);
    this.bottomLeft.set(bottomLeft.x, bottomLeft.y);
    return this;
  }
  clone() {
    return new OrientedBoundingRect(
      this.topLeft.x,
      this.topLeft.y,
      this.topRight.x,
      this.topRight.y,
      this.bottomRight.x,
      this.bottomRight.y,
      this.bottomLeft.x,
      this.bottomLeft.y
    );
  }
  toString() {
    return `OrientedBoundingRect(topLeft=(${this.topLeft.x},${this.topLeft.y}) topRight=(${this.topRight.x},${this.topRight.y}) bottomRight=(${this.bottomRight.x},${this.bottomRight.y}) bottomLeft=(${this.bottomLeft.x},${this.bottomLeft.y}))`;
  }
}
export {
  OrientedBoundingRect
};
