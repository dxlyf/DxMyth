import { clamp } from "../MathUtils.js";
import { Vector2 } from "../Vector2.js";
import { Vector3 } from "../Vector3.js";
import { Matrix4 } from "../Matrix4.js";
import { buildStrokePoints } from "../shape/Polygon.js";
function isVector2Point(p) {
  return p.isVector2 === true;
}
function pointDistance(a, b) {
  if (isVector2Point(a)) {
    return a.distanceTo(b);
  }
  return a.distanceTo(b);
}
function pointEquals(a, b) {
  if (isVector2Point(a)) {
    return a.equals(b);
  }
  return a.equals(b);
}
class Curve {
  type = "Curve";
  /** 计算累计段长时使用的细分数量 */
  arcLengthDivisions = 200;
  /** 曲线参数变化时必须设为 true，用于使弧长缓存失效 */
  needsUpdate = false;
  /** 预计算的累计弧长缓存 */
  cacheArcLengths = null;
  // ---- 类型标记（供 CurvePath 等做运行时类型判断） ----
  isEllipseCurve;
  isLineCurve;
  isLineCurve3;
  isSplineCurve;
  isCatmullRomCurve3;
  /** SplineCurve / CatmullRomCurve3 的控制点 */
  points;
  /**
   * 按弧长等距采样：先做 u→t 映射，再求点。
   * @param u 插值因子，范围 [0,1]
   */
  getPointAt(u, optionalTarget) {
    const t = this.getUtoTmapping(u);
    return this.getPoint(t, optionalTarget);
  }
  /**
   * 通过 getPoint 采样曲线，返回曲线形状的点数组。
   * @param divisions 细分数量，返回点数 = divisions + 1
   */
  getPoints(divisions = 5) {
    const points = [];
    for (let d = 0; d <= divisions; d++) {
      points.push(this.getPoint(d / divisions));
    }
    return points;
  }
  getStrokePoints(options) {
    const points = this.getPoints(options.divisions || 5);
    return buildStrokePoints(points, options);
  }
  /**
   * 返回 getPoints 采样时的细分数量。
   * 默认直接返回 divisions，子类按自身类型覆盖（如直线返回 1、椭圆加倍）。
   */
  getResolution(divisions) {
    return divisions;
  }
  /**
   * 通过 getPointAt 采样曲线，返回等弧长间隔的点数组。
   * @param divisions 细分数量，返回点数 = divisions + 1
   */
  getSpacedPoints(divisions = 5) {
    const points = [];
    for (let d = 0; d <= divisions; d++) {
      points.push(this.getPointAt(d / divisions));
    }
    return points;
  }
  /** 返回曲线总弧长 */
  getLength() {
    const lengths = this.getLengths();
    return lengths[lengths.length - 1];
  }
  /**
   * 返回累计段长数组。
   * @param divisions 细分数量，默认 this.arcLengthDivisions
   */
  getLengths(divisions = this.arcLengthDivisions) {
    if (this.cacheArcLengths && this.cacheArcLengths.length === divisions + 1 && !this.needsUpdate) {
      return this.cacheArcLengths;
    }
    this.needsUpdate = false;
    const cache = [];
    let current;
    let last = this.getPoint(0);
    let sum = 0;
    cache.push(0);
    for (let p = 1; p <= divisions; p++) {
      current = this.getPoint(p / divisions);
      sum += pointDistance(current, last);
      cache.push(sum);
      last = current;
    }
    this.cacheArcLengths = cache;
    return cache;
  }
  /**
   * 使累计段长缓存失效并重算。曲线参数每次变化后都应调用。
   */
  updateArcLengths() {
    this.needsUpdate = true;
    this.getLengths();
  }
  /**
   * 将弧长参数 u（或给定距离 distance）映射为参数 t，用于等距采样。
   * @param u 插值因子，范围 [0,1]
   * @param distance 可选的曲线上距离
   */
  getUtoTmapping(u, distance = null) {
    const arcLengths = this.getLengths();
    let i = 0;
    const il = arcLengths.length;
    let targetArcLength;
    if (distance) {
      targetArcLength = distance;
    } else {
      targetArcLength = u * arcLengths[il - 1];
    }
    let low = 0;
    let high = il - 1;
    let comparison;
    while (low <= high) {
      i = Math.floor(low + (high - low) / 2);
      comparison = arcLengths[i] - targetArcLength;
      if (comparison < 0) {
        low = i + 1;
      } else if (comparison > 0) {
        high = i - 1;
      } else {
        high = i;
        break;
      }
    }
    i = high;
    if (arcLengths[i] === targetArcLength) {
      return i / (il - 1);
    }
    const lengthBefore = arcLengths[i];
    const lengthAfter = arcLengths[i + 1];
    const segmentLength = lengthAfter - lengthBefore;
    const segmentFraction = (targetArcLength - lengthBefore) / segmentLength;
    const t = (i + segmentFraction) / (il - 1);
    return t;
  }
  /**
   * 返回参数 t 处的单位切向量。
   * 若子类未实现解析切线，则用相邻两点差分近似。
   */
  getTangent(t, optionalTarget) {
    const delta = 1e-4;
    let t1 = t - delta;
    let t2 = t + delta;
    if (t1 < 0) t1 = 0;
    if (t2 > 1) t2 = 1;
    const pt1 = this.getPoint(t1);
    const pt2 = this.getPoint(t2);
    const tangent = optionalTarget ?? (isVector2Point(pt1) ? new Vector2() : new Vector3());
    if (isVector2Point(tangent)) {
      tangent.copy(pt2).subtract(pt1).normalize();
    } else {
      tangent.copy(pt2).subtract(pt1).normalize();
    }
    return tangent;
  }
  /** 等弧长采样版本的 getTangent */
  getTangentAt(u, optionalTarget) {
    const t = this.getUtoTmapping(u);
    return this.getTangent(t, optionalTarget);
  }
  /**
   * 生成 Frenet 标架（需 3D 曲线），用于 TubeGeometry / ExtrudeGeometry。
   * @param segments 段数
   * @param closed 是否闭合
   */
  computeFrenetFrames(segments, closed = false) {
    const normal = new Vector3();
    const tangents = [];
    const normals = [];
    const binormals = [];
    const vec = new Vector3();
    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      tangents[i] = this.getTangentAt(u, new Vector3());
    }
    normals[0] = new Vector3();
    binormals[0] = new Vector3();
    let min = Number.MAX_VALUE;
    const tx = Math.abs(tangents[0].x);
    const ty = Math.abs(tangents[0].y);
    const tz = Math.abs(tangents[0].z);
    if (tx <= min) {
      min = tx;
      normal.set(1, 0, 0);
    }
    if (ty <= min) {
      min = ty;
      normal.set(0, 1, 0);
    }
    if (tz <= min) {
      normal.set(0, 0, 1);
    }
    Vector3.cross(vec, tangents[0], normal).normalize();
    Vector3.cross(normals[0], tangents[0], vec);
    Vector3.cross(binormals[0], tangents[0], normals[0]);
    for (let i = 1; i <= segments; i++) {
      normals[i] = normals[i - 1].clone();
      binormals[i] = binormals[i - 1].clone();
      Vector3.cross(vec, tangents[i - 1], tangents[i]);
      if (vec.magnitude() > Number.EPSILON) {
        vec.normalize();
        const theta = Math.acos(clamp(tangents[i - 1].dot(tangents[i]), -1, 1));
        normals[i].applyMatrix4(Matrix4.fromRotation(vec, theta));
      }
      Vector3.cross(binormals[i], tangents[i], normals[i]);
    }
    if (closed === true) {
      let theta = Math.acos(clamp(normals[0].dot(normals[segments]), -1, 1));
      theta /= segments;
      Vector3.cross(vec, normals[0], normals[segments]);
      if (tangents[0].dot(vec) > 0) {
        theta = -theta;
      }
      for (let i = 1; i <= segments; i++) {
        normals[i].applyMatrix4(Matrix4.fromRotation(tangents[i], theta * i));
        Vector3.cross(binormals[i], tangents[i], normals[i]);
      }
    }
    return {
      tangents,
      normals,
      binormals
    };
  }
  /** 返回当前曲线副本 */
  clone() {
    const Ctor = this.constructor;
    return new Ctor().copy(this);
  }
  /** 将 source 的值复制到当前曲线 */
  copy(source) {
    this.arcLengthDivisions = source.arcLengthDivisions;
    return this;
  }
  /** 序列化为 JSON */
  toJSON() {
    const data = {
      metadata: {
        version: 4.7,
        type: "Curve",
        generator: "Curve.toJSON"
      }
    };
    data.arcLengthDivisions = this.arcLengthDivisions;
    data.type = this.type;
    return data;
  }
  /** 从 JSON 反序列化 */
  fromJSON(json) {
    this.arcLengthDivisions = json.arcLengthDivisions ?? this.arcLengthDivisions;
    return this;
  }
}
export {
  Curve,
  isVector2Point,
  pointDistance,
  pointEquals
};
