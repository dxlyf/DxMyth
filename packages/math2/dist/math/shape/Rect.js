import { BoundingRect } from "../BoundingRect.js";
import { Geometry } from "./Geometry.js";
class Rect extends Geometry {
  x;
  y;
  width;
  height;
  constructor(x = 0, y = 0, width = 0, height = 0) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  get right() {
    return this.x + this.width;
  }
  get bottom() {
    return this.y + this.height;
  }
  area() {
    return this.width * this.height;
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
  perimeter() {
    return 2 * (this.width + this.height);
  }
  contains(x, y) {
    return x > this.x && x < this.right && y > this.y && y < this.bottom;
  }
  /** 点在矩形内（含边界） */
  containsInclusive(x, y) {
    return x >= this.x && x <= this.right && y >= this.y && y <= this.bottom;
  }
  signedDistance(x, y) {
    const dx1 = x - this.x;
    const dx2 = this.right - x;
    const dy1 = y - this.y;
    const dy2 = this.bottom - y;
    if (dx1 >= 0 && dx2 >= 0 && dy1 >= 0 && dy2 >= 0) {
      return Math.min(dx1, dx2, dy1, dy2);
    }
    const cx = dx1 < 0 ? this.x - x : dx2 < 0 ? x - this.right : 0;
    const cy = dy1 < 0 ? this.y - y : dy2 < 0 ? y - this.bottom : 0;
    return -Math.sqrt(cx * cx + cy * cy);
  }
  getPoints(out) {
    const r = out || [];
    r.length = 0;
    r.push(
      { x: this.x, y: this.y },
      { x: this.right, y: this.y },
      { x: this.right, y: this.bottom },
      { x: this.x, y: this.bottom }
    );
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
  Rect
};
