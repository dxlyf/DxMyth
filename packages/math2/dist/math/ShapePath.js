import { PathBuilder } from "./PathBuilder.js";
import { PathStroke } from "./PathStroke.js";
import { pathBooleanOp, BoolOp } from "./PathBool.js";
const CKPathCMD = {
  MOVE: 0,
  LINE: 1,
  QUAD: 2,
  CONIC: 3,
  CUBIC: 4,
  CLOSE: 5
};
class ShapePath extends PathBuilder {
  _strokePath;
  _computeStrokeTightBounds;
  strokeOptions;
  fillRule;
  constructor() {
    super();
    this.fillRule = "nonzero";
    this.setStroke({});
  }
  setStroke(options) {
    const prev = this.strokeOptions;
    const newStrokeOptions = { strokeAlign: "center", lineWidth: 1, lineJoin: "miter", lineCap: "butt", miterLimit: 10, ...options || {} };
    if (!prev || newStrokeOptions.strokeAlign != prev.strokeAlign || newStrokeOptions.lineWidth != prev.lineWidth || newStrokeOptions.lineJoin != prev.lineJoin || newStrokeOptions.lineCap != prev.lineCap || newStrokeOptions.miterLimit != prev.miterLimit) {
      this._strokePath = null;
    }
    this.strokeOptions = newStrokeOptions;
  }
  setFillRule(fillRule) {
    if (this.fillRule != fillRule) {
      this.markDirty();
    }
    this.fillRule = fillRule;
  }
  markDirty() {
    super.markDirty();
    this._computeStrokeTightBounds = null;
    this._strokePath = null;
  }
  get strokePath() {
    if (!this._strokePath) {
      const strokeOptions = this.strokeOptions;
      const strokeAlign = strokeOptions.strokeAlign;
      if (strokeAlign === "center") {
        this._strokePath = PathStroke.default().stroke(this, {
          lineWidth: strokeOptions.lineWidth,
          lineJoin: strokeOptions.lineJoin,
          lineCap: strokeOptions.lineCap,
          miterLimit: strokeOptions.miterLimit
        });
      } else if (strokeAlign === "outside") {
        const path0 = PathStroke.default().stroke(this, {
          lineWidth: strokeOptions.lineWidth * 2,
          lineJoin: strokeOptions.lineJoin,
          lineCap: strokeOptions.lineCap,
          miterLimit: strokeOptions.miterLimit
        });
        this._strokePath.reset();
        this._strokePath.addPath(pathBooleanOp(path0, this, BoolOp.Difference));
      } else if (strokeAlign === "inside") {
        const path0 = PathStroke.default().stroke(this, {
          lineWidth: strokeOptions.lineWidth * 2,
          lineJoin: strokeOptions.lineJoin,
          lineCap: strokeOptions.lineCap,
          miterLimit: strokeOptions.miterLimit
        });
        this._strokePath.reset();
        this._strokePath.addPath(pathBooleanOp(path0, this, BoolOp.Intersect));
      }
    }
    return this._strokePath;
  }
  getFillPath2D() {
    return new globalThis.Path2D(this.toSvgPath());
  }
  getStrokePath2D() {
    return new globalThis.Path2D(this.strokePath.toSvgPath());
  }
  opFillPath(other, op) {
    return PathBuilder.default().addPath(pathBooleanOp(this, other, op));
  }
  opStrokePath(other, op) {
    return PathBuilder.default().addPath(pathBooleanOp(this.strokePath, other, op));
  }
  isPointInStrokePath(x, y) {
    return this.strokePath.isPointInPath(x, y);
  }
  computeStrokeTightBounds() {
    if (!this._computeStrokeTightBounds) {
      const bounds = this.strokePath.computeTightBounds();
      this._computeStrokeTightBounds = bounds.clone();
    }
    return this._computeStrokeTightBounds;
  }
}
export {
  CKPathCMD,
  ShapePath
};
