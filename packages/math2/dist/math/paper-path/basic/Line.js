import { Point } from "./Point.js";
import { Numerical } from "../util/Numerical.js";
class Line {
  /** 起点的 x 坐标。 */
  _px;
  /** 起点的 y 坐标。 */
  _py;
  /** 方向向量的 x 分量。 */
  _vx;
  /** 方向向量的 y 分量。 */
  _vy;
  /**
   * `asVector` 为 true 时，`point2` 被当作方向向量而不是第二个点。
   */
  constructor(point1, point2, asVector) {
    this._px = point1.x;
    this._py = point1.y;
    this._vx = asVector ? point2.x : point2.x - point1.x;
    this._vy = asVector ? point2.y : point2.y - point1.y;
  }
  /** 直线的起点。 */
  get point() {
    return new Point(this._px, this._py);
  }
  /** 直线的方向向量。 */
  get vector() {
    return new Point(this._vx, this._vy);
  }
  /** 直线的长度。 */
  get length() {
    return Math.sqrt(this._vx * this._vx + this._vy * this._vy);
  }
  /**
   * 与另一条直线的交点。
   *
   * @return 交点；两线平行时返回 `null`
   */
  intersect(line, isInfinite) {
    return Line.intersect(
      this._px,
      this._py,
      this._vx,
      this._vy,
      line._px,
      line._py,
      line._vx,
      line._vy,
      true,
      isInfinite
    );
  }
  /**
   * 点位于直线的哪一侧：`-1`、`0` 或 `1`。
   */
  getSide(point, isInfinite) {
    return Line.getSide(
      this._px,
      this._py,
      this._vx,
      this._vy,
      point.x,
      point.y,
      true,
      isInfinite
    );
  }
  /** 点到直线的距离。 */
  getDistance(point) {
    return Math.abs(this.getSignedDistance(point));
  }
  /** 点到直线的有向距离。 */
  getSignedDistance(point) {
    return Line.getSignedDistance(
      this._px,
      this._py,
      this._vx,
      this._vy,
      point.x,
      point.y,
      true
    );
  }
  /** 两条直线的方向是否共线。 */
  isCollinear(line) {
    return Point.isCollinear(this._vx, this._vy, line._vx, line._vy);
  }
  /** 两条直线的方向是否垂直。 */
  isOrthogonal(line) {
    return Point.isOrthogonal(this._vx, this._vy, line._vx, line._vy);
  }
  // ---------------------------------------------------------------------
  // 静态方法
  /**
   * 两条直线的交点。
   *
   * @param asVector 为 true 时 `v1x/v1y`、`v2x/v2y` 已是方向向量
   * @param isInfinite 为 true 时把两条直线视为无限长
   * @return 交点，两线平行时返回 `null`
   */
  static intersect(p1x, p1y, v1x, v1y, p2x, p2y, v2x, v2y, asVector, isInfinite) {
    if (!asVector) {
      v1x -= p1x;
      v1y -= p1y;
      v2x -= p2x;
      v2y -= p2y;
    }
    const cross = v1x * v2y - v1y * v2x;
    if (!Numerical.isMachineZero(cross)) {
      const dx = p1x - p2x, dy = p1y - p2y;
      let u1 = (v2x * dy - v2y * dx) / cross, u2 = (v1x * dy - v1y * dx) / cross;
      const epsilon = Numerical.EPSILON, uMin = -epsilon, uMax = 1 + epsilon;
      if (isInfinite || uMin < u1 && u1 < uMax && uMin < u2 && u2 < uMax) {
        if (!isInfinite) {
          u1 = u1 <= 0 ? 0 : u1 >= 1 ? 1 : u1;
        }
        return new Point(
          p1x + u1 * v1x,
          p1y + u1 * v1y
        );
      }
    }
    return null;
  }
  /**
   * 点位于直线的哪一侧，返回 `-1`、`0` 或 `1`。
   */
  static getSide(px, py, vx, vy, x, y, asVector, isInfinite) {
    if (!asVector) {
      vx -= px;
      vy -= py;
    }
    const v2x = x - px, v2y = y - py;
    let ccw = v2x * vy - v2y * vx;
    if (!isInfinite && Numerical.isMachineZero(ccw)) {
      ccw = (v2x * vx + v2x * vx) / (vx * vx + vy * vy);
      if (ccw >= 0 && ccw <= 1)
        ccw = 0;
    }
    return ccw < 0 ? -1 : ccw > 0 ? 1 : 0;
  }
  /**
   * 点到直线的有向距离。
   */
  static getSignedDistance(px, py, vx, vy, x, y, asVector) {
    if (!asVector) {
      vx -= px;
      vy -= py;
    }
    return vx === 0 ? vy > 0 ? x - px : px - x : vy === 0 ? vx < 0 ? y - py : py - y : ((x - px) * vy - (y - py) * vx) / // 注意：这里比较 vy > vx 而不是它们的绝对值，
    // 以保持 fat-line clipping 的结果不变。
    (vy > vx ? Math.abs(vy) * Math.sqrt(1 + vx * vx / (vy * vy)) : Math.abs(vx) * Math.sqrt(1 + vy * vy / (vx * vx)));
  }
  /**
   * 点到直线的距离。
   */
  static getDistance(px, py, vx, vy, x, y, asVector) {
    return Math.abs(
      Line.getSignedDistance(px, py, vx, vy, x, y, asVector)
    );
  }
}
export {
  Line
};
