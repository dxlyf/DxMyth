import { Point } from "../basic/Point.js";
import { Curve } from "./Curve.js";
class PathFlattener {
  /** 每一条曲线的 values。 */
  curves = [];
  /** 细分后的段表。 */
  parts = [];
  /** 路径总长度。 */
  length = 0;
  /** 上次查询所在的段下标，用于迭代式使用的优化。 */
  index = 0;
  /**
   * @param path 要展平的路径
   * @param flatness 直线允许偏离曲线的最大误差，默认 0.25
   * @param maxRecursion 细分的最多递归次数，默认 32
   * @param ignoreStraight 为真时不细分直线段（只关心展平结果时用）
   * @param matrix 可选变换矩阵，不修改原路径
   */
  constructor(path, flatness, maxRecursion, ignoreStraight, matrix) {
    const curves = [], parts = [], minSpan = 1 / (maxRecursion || 32), segments = path._segments;
    let length = 0, segment1 = segments[0], segment2;
    const addCurve = (segment12, segment22) => {
      const curve = Curve.getValues(segment12, segment22, matrix);
      curves.push(curve);
      computeParts(curve, segment12._index, 0, 1);
    };
    const computeParts = (curve, index, t1, t2) => {
      if (t2 - t1 > minSpan && !(ignoreStraight && Curve.isStraight(curve)) && !Curve.isFlatEnough(curve, flatness || 0.25)) {
        const halves = Curve.subdivide(curve, 0.5), tMid = (t1 + t2) / 2;
        computeParts(halves[0], index, t1, tMid);
        computeParts(halves[1], index, tMid, t2);
      } else {
        const dx = curve[6] - curve[0], dy = curve[7] - curve[1], dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          length += dist;
          parts.push({
            offset: length,
            curve,
            index,
            time: t2,
            // 直线段的 curve-time 不跟随长度，见 _get()。
            isStraight: Curve.isStraight(curve)
          });
        }
      }
    };
    for (let i = 1, l = segments.length; i < l; i++) {
      segment2 = segments[i];
      addCurve(segment1, segment2);
      segment1 = segment2;
    }
    if (path._closed)
      addCurve(segment2 || segment1, segments[0]);
    this.curves = curves;
    this.parts = parts;
    this.length = length;
    this.index = 0;
  }
  /** 找到偏移量所在的分段，并插值出曲线参数。 */
  _get(offset) {
    const parts = this.parts, length = parts.length;
    let i, j = this.index;
    for (; ; ) {
      i = j;
      if (!j || parts[--j].offset < offset)
        break;
    }
    for (; i < length; i++) {
      const part = parts[i];
      if (part.offset >= offset) {
        this.index = i;
        const prev = parts[i - 1], prevTime = prev && prev.index === part.index ? prev.time : 0, prevOffset = prev ? prev.offset : 0;
        let factor = (offset - prevOffset) / (part.offset - prevOffset);
        if (part.isStraight) {
          const v = part.curve;
          factor = Curve.getTimeOf(v, new Point(
            v[0] + (v[6] - v[0]) * factor,
            v[1] + (v[7] - v[1]) * factor
          ));
        }
        return {
          index: part.index,
          // 插值。
          time: prevTime + (part.time - prevTime) * factor
        };
      }
    }
    return {
      index: parts[length - 1].index,
      time: 1
    };
  }
  /** 偏移处的点。 */
  getPointAt(offset) {
    const param = this._get(offset);
    return Curve.getPoint(this.curves[param.index], param.time);
  }
  /** 偏移处的切线。 */
  getTangentAt(offset) {
    const param = this._get(offset);
    return Curve.getTangent(this.curves[param.index], param.time);
  }
  /** 偏移处的法线。 */
  getNormalAt(offset) {
    const param = this._get(offset);
    return Curve.getNormal(this.curves[param.index], param.time);
  }
  /** 偏移处按曲线速度加权的切线。 */
  getWeightedTangentAt(offset) {
    const param = this._get(offset);
    return Curve.getWeightedTangent(this.curves[param.index], param.time);
  }
  /** 偏移处按曲线速度加权的法线。 */
  getWeightedNormalAt(offset) {
    const param = this._get(offset);
    return Curve.getWeightedNormal(this.curves[param.index], param.time);
  }
  /** 偏移处的曲率。 */
  getCurvatureAt(offset) {
    const param = this._get(offset);
    return Curve.getCurvature(this.curves[param.index], param.time);
  }
}
export {
  PathFlattener
};
