import { Color } from "../Color.js";
import { Path } from "./Path.js";
import { Shape } from "./Shape.js";
import { ShapeUtils } from "./ShapeUtils.js";
class ShapePath {
  type = "ShapePath";
  /** 形状颜色 */
  color;
  /** 已生成的子路径 */
  subPaths = [];
  /** 正在生成的当前路径 */
  currentPath = null;
  constructor() {
    this.color = new Color(1, 1, 1, 1);
  }
  /** 创建新路径并将其 currentPoint 移到给定点 */
  moveTo(x, y) {
    this.currentPath = new Path();
    this.subPaths.push(this.currentPath);
    this.currentPath.moveTo(x, y);
    return this;
  }
  /** 在当前路径上添加一条 LineCurve 到给定点 */
  lineTo(x, y) {
    this.currentPath.lineTo(x, y);
    return this;
  }
  /** 在当前路径上添加一条 QuadraticBezierCurve */
  quadraticCurveTo(aCPx, aCPy, aX, aY) {
    this.currentPath.quadraticCurveTo(aCPx, aCPy, aX, aY);
    return this;
  }
  /** 在当前路径上添加一条 CubicBezierCurve */
  bezierCurveTo(aCP1x, aCP1y, aCP2x, aCP2y, aX, aY) {
    this.currentPath.bezierCurveTo(aCP1x, aCP1y, aCP2x, aCP2y, aX, aY);
    return this;
  }
  /** 在当前路径上添加一条经过给定点列表的 SplineCurve */
  splineThru(pts) {
    this.currentPath.splineThru(pts);
    return this;
  }
  /**
   * 将子路径转换为形状数组。
   * @param isCCW 默认实心形状为顺时针、孔洞为逆时针；设为 true 则翻转
   */
  toShapes(isCCW) {
    function toShapesNoHoles(inSubpaths) {
      const shapes2 = [];
      for (let i = 0, l = inSubpaths.length; i < l; i++) {
        const tmpPath2 = inSubpaths[i];
        const tmpShape2 = new Shape();
        tmpShape2.curves = tmpPath2.curves;
        shapes2.push(tmpShape2);
      }
      return shapes2;
    }
    function isPointInsidePolygon(inPt, inPolygon) {
      const polyLen = inPolygon.length;
      let inside = false;
      for (let p = polyLen - 1, q = 0; q < polyLen; p = q++) {
        let edgeLowPt = inPolygon[p];
        let edgeHighPt = inPolygon[q];
        let edgeDx = edgeHighPt.x - edgeLowPt.x;
        let edgeDy = edgeHighPt.y - edgeLowPt.y;
        if (Math.abs(edgeDy) > Number.EPSILON) {
          if (edgeDy < 0) {
            edgeLowPt = inPolygon[q];
            edgeDx = -edgeDx;
            edgeHighPt = inPolygon[p];
            edgeDy = -edgeDy;
          }
          if (inPt.y < edgeLowPt.y || inPt.y > edgeHighPt.y) continue;
          if (inPt.y === edgeLowPt.y) {
            if (inPt.x === edgeLowPt.x) return true;
          } else {
            const perpEdge = edgeDy * (inPt.x - edgeLowPt.x) - edgeDx * (inPt.y - edgeLowPt.y);
            if (perpEdge === 0) return true;
            if (perpEdge < 0) continue;
            inside = !inside;
          }
        } else {
          if (inPt.y !== edgeLowPt.y) continue;
          if (edgeHighPt.x <= inPt.x && inPt.x <= edgeLowPt.x || edgeLowPt.x <= inPt.x && inPt.x <= edgeHighPt.x) return true;
        }
      }
      return inside;
    }
    const isClockWise = ShapeUtils.isClockWise;
    const subPaths = this.subPaths;
    if (subPaths.length === 0) return [];
    let solid;
    let tmpPath;
    let tmpShape;
    const shapes = [];
    if (subPaths.length === 1) {
      tmpPath = subPaths[0];
      tmpShape = new Shape();
      tmpShape.curves = tmpPath.curves;
      shapes.push(tmpShape);
      return shapes;
    }
    let holesFirst = !isClockWise(subPaths[0].getPoints());
    holesFirst = isCCW ? !holesFirst : holesFirst;
    const betterShapeHoles = [];
    const newShapes = [];
    let newShapeHoles = [];
    let mainIdx = 0;
    let tmpPoints;
    newShapes[mainIdx] = void 0;
    newShapeHoles[mainIdx] = [];
    for (let i = 0, l = subPaths.length; i < l; i++) {
      tmpPath = subPaths[i];
      tmpPoints = tmpPath.getPoints();
      solid = isClockWise(tmpPoints);
      solid = isCCW ? !solid : solid;
      if (solid) {
        if (!holesFirst && newShapes[mainIdx]) mainIdx++;
        newShapes[mainIdx] = { s: new Shape(), p: tmpPoints };
        newShapes[mainIdx].s.curves = tmpPath.curves;
        if (holesFirst) mainIdx++;
        newShapeHoles[mainIdx] = [];
      } else {
        newShapeHoles[mainIdx].push({ h: tmpPath, p: tmpPoints[0] });
      }
    }
    if (!newShapes[0]) return toShapesNoHoles(subPaths);
    if (newShapes.length > 1) {
      let ambiguous = false;
      let toChange = 0;
      for (let sIdx = 0, sLen = newShapes.length; sIdx < sLen; sIdx++) {
        betterShapeHoles[sIdx] = [];
      }
      for (let sIdx = 0, sLen = newShapes.length; sIdx < sLen; sIdx++) {
        const sho = newShapeHoles[sIdx];
        for (let hIdx = 0; hIdx < sho.length; hIdx++) {
          const ho = sho[hIdx];
          let hole_unassigned = true;
          for (let s2Idx = 0; s2Idx < newShapes.length; s2Idx++) {
            if (isPointInsidePolygon(ho.p, newShapes[s2Idx].p)) {
              if (sIdx !== s2Idx) toChange++;
              if (hole_unassigned) {
                hole_unassigned = false;
                betterShapeHoles[s2Idx].push(ho);
              } else {
                ambiguous = true;
              }
            }
          }
          if (hole_unassigned) {
            betterShapeHoles[sIdx].push(ho);
          }
        }
      }
      if (toChange > 0 && ambiguous === false) {
        newShapeHoles = betterShapeHoles;
      }
    }
    let tmpHoles;
    for (let i = 0, il = newShapes.length; i < il; i++) {
      tmpShape = newShapes[i].s;
      shapes.push(tmpShape);
      tmpHoles = newShapeHoles[i];
      for (let j = 0, jl = tmpHoles.length; j < jl; j++) {
        tmpShape.holes.push(tmpHoles[j].h);
      }
    }
    return shapes;
  }
}
export {
  ShapePath
};
