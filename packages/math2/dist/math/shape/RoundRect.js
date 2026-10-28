import { BoundingRect } from "../BoundingRect.js";
import { Geometry, arcSegmentCount } from "./Geometry.js";
class RoundRect extends Geometry {
  x;
  y;
  width;
  height;
  /** 圆角半径（统一） */
  radius;
  constructor(x = 0, y = 0, width = 0, height = 0, radius = 0) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.radius = Math.max(0, Math.min(radius, Math.min(width, height) * 0.5));
  }
  get right() {
    return this.x + this.width;
  }
  get bottom() {
    return this.y + this.height;
  }
  /** 面积 = 矩形面积 - 4 个角方块（r²） + 4 个四分之一圆（πr²） */
  area() {
    const r = this.radius;
    return this.width * this.height - (4 - Math.PI) * r * r;
  }
  centroid(out) {
    const r = out || { x: 0, y: 0 };
    r.x = this.x + this.width * 0.5;
    r.y = this.y + this.height * 0.5;
    return r;
  }
  center(out) {
    return this.centroid(out);
  }
  /** 周长 = 2(w+h) - 8r + 2πr */
  perimeter() {
    const r = this.radius;
    return 2 * (this.width + this.height) - 8 * r + 2 * Math.PI * r;
  }
  /**
   * 点是否在圆角矩形内（不含边界）
   * 算法：
   *   - 在内矩形（去除四角）内 → true
   *   - 在角区域内 → 看是否在对应圆角圆内
   */
  contains(x, y) {
    const r = this.radius;
    const x1 = this.x, y1 = this.y;
    const x2 = this.right, y2 = this.bottom;
    if (x <= x1 || x >= x2 || y <= y1 || y >= y2) return false;
    const cx1 = x1 + r, cy1 = y1 + r;
    const cx2 = x2 - r, cy2 = y2 - r;
    if (x < cx1 && y < cy1) {
      const dx = x - cx1, dy = y - cy1;
      return dx * dx + dy * dy < r * r;
    }
    if (x > cx2 && y < cy1) {
      const dx = x - cx2, dy = y - cy1;
      return dx * dx + dy * dy < r * r;
    }
    if (x < cx1 && y > cy2) {
      const dx = x - cx1, dy = y - cy2;
      return dx * dx + dy * dy < r * r;
    }
    if (x > cx2 && y > cy2) {
      const dx = x - cx2, dy = y - cy2;
      return dx * dx + dy * dy < r * r;
    }
    return true;
  }
  /**
   * 带符号距离
   * 内部为正，外部为负
   * 算法：
   *   1. 将点坐标变换到 "角圆心" 坐标系下
   *   2. 用 max(|dx|-innerW, |dy|-innerH) 找到最近的角区域
   *   3. 若在角区域内：距角圆心的距离差
   *   4. 若在内十字区域：min 到四条直边的距离
   */
  signedDistance(x, y) {
    const r = this.radius;
    const x1 = this.x, y1 = this.y;
    const x2 = this.right, y2 = this.bottom;
    const cx1 = x1 + r, cy1 = y1 + r;
    const cx2 = x2 - r, cy2 = y2 - r;
    let cornerX, cornerY;
    let inCornerX = false, inCornerY = false;
    if (x < cx1) {
      cornerX = cx1;
      inCornerX = true;
    } else if (x > cx2) {
      cornerX = cx2;
      inCornerX = true;
    } else {
      cornerX = x;
    }
    if (y < cy1) {
      cornerY = cy1;
      inCornerY = true;
    } else if (y > cy2) {
      cornerY = cy2;
      inCornerY = true;
    } else {
      cornerY = y;
    }
    if (inCornerX && inCornerY) {
      const dx = x - cornerX;
      const dy = y - cornerY;
      const d = Math.sqrt(dx * dx + dy * dy);
      return r - d;
    } else {
      const dx1 = x - x1;
      const dx2 = x2 - x;
      const dy1 = y - y1;
      const dy2 = y2 - y;
      if (dx1 >= 0 && dx2 >= 0 && dy1 >= 0 && dy2 >= 0) {
        return Math.min(dx1, dx2, dy1, dy2);
      }
      const nearCx = x < cx1 ? cx1 : x > cx2 ? cx2 : x;
      const nearCy = y < cy1 ? cy1 : y > cy2 ? cy2 : y;
      const dx = x - nearCx;
      const dy = y - nearCy;
      const d = Math.sqrt(dx * dx + dy * dy);
      return -(d - r);
    }
  }
  getPoints(out) {
    const r = out || [];
    r.length = 0;
    const { x, y, radius } = this;
    const x2 = x + this.width;
    const y2 = y + this.height;
    if (radius <= 0) {
      r.push(
        { x, y },
        { x: x2, y },
        { x: x2, y: y2 },
        { x, y: y2 }
      );
      return r;
    }
    const pushArc = (cx, cy, a0, a1) => {
      const n = arcSegmentCount(radius, Math.PI * 0.5);
      for (let i = 1; i < n; i++) {
        const a = a0 + (a1 - a0) * (i / n);
        r.push({ x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) });
      }
    };
    r.push({ x: x + radius, y }, { x: x2 - radius, y });
    pushArc(x2 - radius, y + radius, -Math.PI * 0.5, 0);
    r.push({ x: x2, y: y2 - radius });
    pushArc(x2 - radius, y2 - radius, 0, Math.PI * 0.5);
    r.push({ x: x + radius, y: y2 });
    pushArc(x + radius, y2 - radius, Math.PI * 0.5, Math.PI);
    r.push({ x, y: y + radius });
    pushArc(x + radius, y + radius, Math.PI, Math.PI * 1.5);
    return r;
  }
  bounds(out) {
    const r = out || new BoundingRect();
    r.min.set(this.x, this.y);
    r.max.set(this.right, this.bottom);
    return r;
  }
}
export {
  RoundRect
};
