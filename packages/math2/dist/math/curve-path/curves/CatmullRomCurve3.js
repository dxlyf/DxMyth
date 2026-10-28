import { Vector3 } from "../../Vector3.js";
import { Curve } from "../Curve.js";
function CubicPoly() {
  let c0 = 0, c1 = 0, c2 = 0, c3 = 0;
  function init(x0, x1, t0, t1) {
    c0 = x0;
    c1 = t0;
    c2 = -3 * x0 + 3 * x1 - 2 * t0 - t1;
    c3 = 2 * x0 - 2 * x1 + t0 + t1;
  }
  return {
    initCatmullRom(x0, x1, x2, x3, tension) {
      init(x1, x2, tension * (x2 - x0), tension * (x3 - x1));
    },
    initNonuniformCatmullRom(x0, x1, x2, x3, dt0, dt1, dt2) {
      let t1 = (x1 - x0) / dt0 - (x2 - x0) / (dt0 + dt1) + (x2 - x1) / dt1;
      let t2 = (x2 - x1) / dt1 - (x3 - x1) / (dt1 + dt2) + (x3 - x2) / dt2;
      t1 *= dt1;
      t2 *= dt1;
      init(x1, x2, t1, t2);
    },
    calc(t) {
      const t2 = t * t;
      const t3 = t2 * t;
      return c0 + c1 * t + c2 * t2 + c3 * t3;
    }
  };
}
const tmp = new Vector3();
const px = CubicPoly();
const py = CubicPoly();
const pz = CubicPoly();
class CatmullRomCurve3 extends Curve {
  isCatmullRomCurve3 = true;
  type = "CatmullRomCurve3";
  /** 定义曲线的 3D 点数组 */
  points = [];
  /** 是否闭合 */
  closed;
  /** 曲线类型：centripetal | chordal | catmullrom */
  curveType;
  /** catmullrom 类型的张力，默认 0.5 */
  tension;
  constructor(points = [], closed = false, curveType = "centripetal", tension = 0.5) {
    super();
    this.points = points;
    this.closed = closed;
    this.curveType = curveType;
    this.tension = tension;
  }
  getPoint(t, optionalTarget = new Vector3()) {
    const point = optionalTarget;
    const points = this.points;
    const l = points.length;
    const p = (l - (this.closed ? 0 : 1)) * t;
    let intPoint = Math.floor(p);
    let weight = p - intPoint;
    if (this.closed) {
      intPoint += intPoint > 0 ? 0 : (Math.floor(Math.abs(intPoint) / l) + 1) * l;
    } else if (weight === 0 && intPoint === l - 1) {
      intPoint = l - 2;
      weight = 1;
    }
    let p0, p3;
    if (this.closed || intPoint > 0) {
      p0 = points[(intPoint - 1) % l];
    } else {
      Vector3.subtract(tmp, points[0], points[1]).add(points[0]);
      p0 = tmp;
    }
    const p1 = points[intPoint % l];
    const p2 = points[(intPoint + 1) % l];
    if (this.closed || intPoint + 2 < l) {
      p3 = points[(intPoint + 2) % l];
    } else {
      Vector3.subtract(tmp, points[l - 1], points[l - 2]).add(points[l - 1]);
      p3 = tmp;
    }
    if (this.curveType === "centripetal" || this.curveType === "chordal") {
      const pow = this.curveType === "chordal" ? 0.5 : 0.25;
      let dt0 = Math.pow(p0.distanceSquaredTo(p1), pow);
      let dt1 = Math.pow(p1.distanceSquaredTo(p2), pow);
      let dt2 = Math.pow(p2.distanceSquaredTo(p3), pow);
      if (dt1 < 1e-4) dt1 = 1;
      if (dt0 < 1e-4) dt0 = dt1;
      if (dt2 < 1e-4) dt2 = dt1;
      px.initNonuniformCatmullRom(p0.x, p1.x, p2.x, p3.x, dt0, dt1, dt2);
      py.initNonuniformCatmullRom(p0.y, p1.y, p2.y, p3.y, dt0, dt1, dt2);
      pz.initNonuniformCatmullRom(p0.z, p1.z, p2.z, p3.z, dt0, dt1, dt2);
    } else if (this.curveType === "catmullrom") {
      px.initCatmullRom(p0.x, p1.x, p2.x, p3.x, this.tension);
      py.initCatmullRom(p0.y, p1.y, p2.y, p3.y, this.tension);
      pz.initCatmullRom(p0.z, p1.z, p2.z, p3.z, this.tension);
    }
    point.set(
      px.calc(weight),
      py.calc(weight),
      pz.calc(weight)
    );
    return point;
  }
  copy(source) {
    super.copy(source);
    this.points = [];
    for (let i = 0, l = source.points.length; i < l; i++) {
      this.points.push(source.points[i].clone());
    }
    this.closed = source.closed;
    this.curveType = source.curveType;
    this.tension = source.tension;
    return this;
  }
  toJSON() {
    const data = super.toJSON();
    data.points = [];
    for (let i = 0, l = this.points.length; i < l; i++) {
      data.points.push(this.points[i].toArray());
    }
    data.closed = this.closed;
    data.curveType = this.curveType;
    data.tension = this.tension;
    return data;
  }
  fromJSON(json) {
    super.fromJSON(json);
    this.points = [];
    for (let i = 0, l = json.points.length; i < l; i++) {
      this.points.push(Vector3.fromArray(json.points[i]));
    }
    this.closed = json.closed;
    this.curveType = json.curveType;
    this.tension = json.tension;
    return this;
  }
}
export {
  CatmullRomCurve3
};
