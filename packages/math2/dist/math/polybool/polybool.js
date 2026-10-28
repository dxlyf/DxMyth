import { GeometryEpsilon } from "./Geometry.js";
import { Geometry, boundingBoxesIntersect, lerp, lerpVec2 } from "./Geometry.js";
import { Shape } from "./Shape.js";
import { ShapeCombined } from "./Shape.js";
import BuildLog from "./BuildLog.js";
import { SegmentBase, SegmentCurve, SegmentLine, SegmentTValuePairsBuilder, SegmentTValuesBuilder, projectPointOntoSegmentLine, segmentCurveIntersectSegmentCurve, segmentLineIntersectSegmentCurve, segmentLineIntersectSegmentLine, segmentsIntersect } from "./Segment.js";
import { EventBool, Intersecter, ListBool, SegmentBoolBase, SegmentBoolCurve, SegmentBoolLine, copySegmentBool } from "./Intersecter.js";
import { SegmentSelector } from "./SegmentSelector.js";
import { SegmentChainer, joinCurves, joinLines, joinSegments, segmentsToReceiver } from "./SegmentChainer.js";
class PolyBool {
  geo;
  log;
  constructor(geo = new GeometryEpsilon(), log = null) {
    this.geo = geo;
    this.log = log;
  }
  shape() {
    return new Shape(this.geo, null, this.log);
  }
  buildLog(enable) {
    this.log = enable ? new BuildLog() : null;
    return this.log?.list;
  }
  segments(poly) {
    const shape = this.shape();
    shape.beginPath();
    for (const region of poly.regions) {
      const lastPoint = region[region.length - 1];
      shape.moveTo(
        lastPoint[lastPoint.length - 2],
        lastPoint[lastPoint.length - 1]
      );
      for (const p of region) {
        if (p.length === 2) {
          shape.lineTo(p[0], p[1]);
        } else if (p.length === 6) {
          shape.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
        } else {
          throw new Error("PolyBool: Invalid point in region");
        }
      }
      shape.closePath();
    }
    return { shape, inverted: poly.inverted };
  }
  combine(segments1, segments2) {
    return {
      shape: segments1.shape.combine(segments2.shape),
      inverted1: segments1.inverted,
      inverted2: segments2.inverted
    };
  }
  selectUnion(combined) {
    return {
      shape: combined.inverted1 ? combined.inverted2 ? combined.shape.intersect() : combined.shape.difference() : combined.inverted2 ? combined.shape.differenceRev() : combined.shape.union(),
      inverted: combined.inverted1 || combined.inverted2
    };
  }
  selectIntersect(combined) {
    return {
      shape: combined.inverted1 ? combined.inverted2 ? combined.shape.union() : combined.shape.differenceRev() : combined.inverted2 ? combined.shape.difference() : combined.shape.intersect(),
      inverted: combined.inverted1 && combined.inverted2
    };
  }
  selectDifference(combined) {
    return {
      shape: combined.inverted1 ? combined.inverted2 ? combined.shape.differenceRev() : combined.shape.union() : combined.inverted2 ? combined.shape.intersect() : combined.shape.difference(),
      inverted: combined.inverted1 && !combined.inverted2
    };
  }
  selectDifferenceRev(combined) {
    return {
      shape: combined.inverted1 ? combined.inverted2 ? combined.shape.difference() : combined.shape.intersect() : combined.inverted2 ? combined.shape.union() : combined.shape.differenceRev(),
      inverted: !combined.inverted1 && combined.inverted2
    };
  }
  selectXor(combined) {
    return {
      shape: combined.shape.xor(),
      inverted: combined.inverted1 !== combined.inverted2
    };
  }
  polygon(segments) {
    const regions = [];
    const receiver = {
      beginPath: () => {
      },
      moveTo: () => {
        regions.push([]);
      },
      lineTo: (x, y) => {
        regions[regions.length - 1].push([x, y]);
      },
      bezierCurveTo: (c1x, c1y, c2x, c2y, x, y) => {
        regions[regions.length - 1].push([c1x, c1y, c2x, c2y, x, y]);
      },
      closePath: () => {
      }
    };
    segments.shape.output(receiver);
    return { regions, inverted: segments.inverted };
  }
  // helper functions for common operations
  union(poly1, poly2) {
    const seg1 = this.segments(poly1);
    const seg2 = this.segments(poly2);
    const comb = this.combine(seg1, seg2);
    const seg3 = this.selectUnion(comb);
    return this.polygon(seg3);
  }
  intersect(poly1, poly2) {
    const seg1 = this.segments(poly1);
    const seg2 = this.segments(poly2);
    const comb = this.combine(seg1, seg2);
    const seg3 = this.selectIntersect(comb);
    return this.polygon(seg3);
  }
  difference(poly1, poly2) {
    const seg1 = this.segments(poly1);
    const seg2 = this.segments(poly2);
    const comb = this.combine(seg1, seg2);
    const seg3 = this.selectDifference(comb);
    return this.polygon(seg3);
  }
  differenceRev(poly1, poly2) {
    const seg1 = this.segments(poly1);
    const seg2 = this.segments(poly2);
    const comb = this.combine(seg1, seg2);
    const seg3 = this.selectDifferenceRev(comb);
    return this.polygon(seg3);
  }
  xor(poly1, poly2) {
    const seg1 = this.segments(poly1);
    const seg2 = this.segments(poly2);
    const comb = this.combine(seg1, seg2);
    const seg3 = this.selectXor(comb);
    return this.polygon(seg3);
  }
}
const polybool = new PolyBool();
export {
  EventBool,
  Geometry,
  GeometryEpsilon,
  Intersecter,
  ListBool,
  PolyBool,
  SegmentBase,
  SegmentBoolBase,
  SegmentBoolCurve,
  SegmentBoolLine,
  SegmentChainer,
  SegmentCurve,
  SegmentLine,
  SegmentSelector,
  SegmentTValuePairsBuilder,
  SegmentTValuesBuilder,
  Shape,
  ShapeCombined,
  boundingBoxesIntersect,
  copySegmentBool,
  polybool as default,
  joinCurves,
  joinLines,
  joinSegments,
  lerp,
  lerpVec2,
  projectPointOntoSegmentLine,
  segmentCurveIntersectSegmentCurve,
  segmentLineIntersectSegmentCurve,
  segmentLineIntersectSegmentLine,
  segmentsIntersect,
  segmentsToReceiver
};
