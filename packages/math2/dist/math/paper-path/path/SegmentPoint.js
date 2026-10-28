import { Point } from "../basic/Point.js";
import { Numerical } from "../util/Numerical.js";
class SegmentPoint extends Point {
  /** 该点所属的 segment。 */
  _owner;
  constructor(point, owner) {
    super();
    if (point) {
      this._x = point.x;
      this._y = point.y;
    }
    this._owner = owner;
  }
  _set(x, y, dontNotify) {
    this._x = x;
    this._y = y;
    if (!dontNotify)
      this._owner._changed(this);
    return this;
  }
  get x() {
    return this._x;
  }
  set x(x) {
    this._x = x;
    this._owner._changed(this);
  }
  get y() {
    return this._y;
  }
  set y(y) {
    this._y = y;
    this._owner._changed(this);
  }
  isZero() {
    const isZero = Numerical.isZero;
    return isZero(this._x) && isZero(this._y);
  }
}
export {
  SegmentPoint
};
