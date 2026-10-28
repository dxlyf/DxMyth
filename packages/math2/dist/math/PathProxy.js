import { vec2 } from "../gl-matrix/vec2.js";
import { BoundingRect } from "./BoundingRect.js";
import { fromLine, fromArc, fromQuadratic, fromCubic } from "./bbox.js";
import { quadraticLength, cubicLength, quadraticSubdivide, cubicSubdivide } from "./curve.js";
const CMD = {
  M: 1,
  L: 2,
  C: 3,
  Q: 4,
  A: 5,
  Z: 6,
  // Rect
  R: 7
};
const tmpOutX = [];
const tmpOutY = [];
const min = [];
const max = [];
const min2 = [];
const max2 = [];
const mathMin = Math.min;
const mathMax = Math.max;
const mathCos = Math.cos;
const mathSin = Math.sin;
const mathAbs = Math.abs;
const PI = Math.PI;
const PI2 = PI * 2;
const hasTypedArray = typeof Float32Array !== "undefined";
const tmpAngles = [];
function modPI2(radian) {
  const n = Math.round(radian / PI * 1e8) / 1e8;
  return n % 2 * PI;
}
function normalizeArcAngles(angles, anticlockwise) {
  let newStartAngle = modPI2(angles[0]);
  if (newStartAngle < 0) {
    newStartAngle += PI2;
  }
  let delta = newStartAngle - angles[0];
  let newEndAngle = angles[1];
  newEndAngle += delta;
  if (!anticlockwise && newEndAngle - newStartAngle >= PI2) {
    newEndAngle = newStartAngle + PI2;
  } else if (anticlockwise && newStartAngle - newEndAngle >= PI2) {
    newEndAngle = newStartAngle - PI2;
  } else if (!anticlockwise && newStartAngle > newEndAngle) {
    newEndAngle = newStartAngle + (PI2 - modPI2(newStartAngle - newEndAngle));
  } else if (anticlockwise && newStartAngle < newEndAngle) {
    newEndAngle = newStartAngle - (PI2 - modPI2(newEndAngle - newStartAngle));
  }
  angles[0] = newStartAngle;
  angles[1] = newEndAngle;
}
class PathProxy {
  dpr = 1;
  data;
  /**
   * If the line segment is too small to draw. It will be added to the pending pt.
   * It will be added if the subpath needs to be finished before stroke, fill, or starting a new subpath.
   */
  _pendingPtX;
  _pendingPtY;
  _ctx;
  _xi = 0;
  _yi = 0;
  _x0 = 0;
  _y0 = 0;
  _len = 0;
  // Calculating path len and seg len.
  _pathSegLen;
  _pathLen;
  static CMD = CMD;
  constructor(notSaveData) {
    if (notSaveData) {
      this._saveData = false;
    }
    if (this._saveData) {
      this.data = [];
    }
  }
  increaseVersion() {
    this._version++;
  }
  /**
   * Version can be used outside for compare if the path is changed.
   * For example to determine if need to update svg d str in svg renderer.
   */
  getVersion() {
    return this._version;
  }
  /**
   * @readOnly
   */
  setScale(sx, sy, segmentIgnoreThreshold) {
    segmentIgnoreThreshold = segmentIgnoreThreshold || 0;
    if (segmentIgnoreThreshold > 0) {
      this._ux = mathAbs(segmentIgnoreThreshold / this.dpr / sx) || 0;
      this._uy = mathAbs(segmentIgnoreThreshold / this.dpr / sy) || 0;
    }
  }
  setDPR(dpr) {
    this.dpr = dpr;
  }
  setContext(ctx) {
    this._ctx = ctx;
  }
  getContext() {
    return this._ctx;
  }
  beginPath() {
    this._ctx && this._ctx.beginPath();
    this.reset();
    return this;
  }
  /**
   * Reset path data.
   */
  reset() {
    if (this._saveData) {
      this._len = 0;
    }
    if (this._pathSegLen) {
      this._pathSegLen = null;
      this._pathLen = 0;
    }
    this._version++;
  }
  moveTo(x, y) {
    this._drawPendingPt();
    this.addData(CMD.M, x, y);
    this._ctx && this._ctx.moveTo(x, y);
    this._x0 = x;
    this._y0 = y;
    this._xi = x;
    this._yi = y;
    return this;
  }
  lineTo(x, y) {
    const dx = mathAbs(x - this._xi);
    const dy = mathAbs(y - this._yi);
    const exceedUnit = dx > this._ux || dy > this._uy;
    this.addData(CMD.L, x, y);
    if (this._ctx && exceedUnit) {
      this._ctx.lineTo(x, y);
    }
    if (exceedUnit) {
      this._xi = x;
      this._yi = y;
      this._pendingPtDist = 0;
    } else {
      const d2 = dx * dx + dy * dy;
      if (d2 > this._pendingPtDist) {
        this._pendingPtX = x;
        this._pendingPtY = y;
        this._pendingPtDist = d2;
      }
    }
    return this;
  }
  bezierCurveTo(x1, y1, x2, y2, x3, y3) {
    this._drawPendingPt();
    this.addData(CMD.C, x1, y1, x2, y2, x3, y3);
    if (this._ctx) {
      this._ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    }
    this._xi = x3;
    this._yi = y3;
    return this;
  }
  quadraticCurveTo(x1, y1, x2, y2) {
    this._drawPendingPt();
    this.addData(CMD.Q, x1, y1, x2, y2);
    if (this._ctx) {
      this._ctx.quadraticCurveTo(x1, y1, x2, y2);
    }
    this._xi = x2;
    this._yi = y2;
    return this;
  }
  arc(cx, cy, r, startAngle, endAngle, anticlockwise) {
    this._drawPendingPt();
    tmpAngles[0] = startAngle;
    tmpAngles[1] = endAngle;
    normalizeArcAngles(tmpAngles, anticlockwise);
    startAngle = tmpAngles[0];
    endAngle = tmpAngles[1];
    let delta = endAngle - startAngle;
    this.addData(
      CMD.A,
      cx,
      cy,
      r,
      r,
      startAngle,
      delta,
      0,
      anticlockwise ? 0 : 1
    );
    this._ctx && this._ctx.arc(cx, cy, r, startAngle, endAngle, anticlockwise);
    this._xi = mathCos(endAngle) * r + cx;
    this._yi = mathSin(endAngle) * r + cy;
    return this;
  }
  // TODO
  arcTo(x1, y1, x2, y2, radius) {
    this._drawPendingPt();
    if (this._ctx) {
      this._ctx.arcTo(x1, y1, x2, y2, radius);
    }
    return this;
  }
  // TODO
  rect(x, y, w, h) {
    this._drawPendingPt();
    this._ctx && this._ctx.rect(x, y, w, h);
    this.addData(CMD.R, x, y, w, h);
    return this;
  }
  closePath() {
    this._drawPendingPt();
    this.addData(CMD.Z);
    const ctx = this._ctx;
    const x0 = this._x0;
    const y0 = this._y0;
    if (ctx) {
      ctx.closePath();
    }
    this._xi = x0;
    this._yi = y0;
    return this;
  }
  fill(ctx) {
    ctx && ctx.fill();
    this.toStatic();
  }
  stroke(ctx) {
    ctx && ctx.stroke();
    this.toStatic();
  }
  len() {
    return this._len;
  }
  setData(data) {
    if (!this._saveData) {
      return;
    }
    const len = data.length;
    if (!(this.data && this.data.length === len) && hasTypedArray) {
      this.data = new Float32Array(len);
    }
    for (let i = 0; i < len; i++) {
      this.data[i] = data[i];
    }
    this._len = len;
  }
  appendPath(path) {
    if (!this._saveData) {
      return;
    }
    if (!(path instanceof Array)) {
      path = [path];
    }
    const len = path.length;
    let appendSize = 0;
    let offset = this._len;
    for (let i = 0; i < len; i++) {
      appendSize += path[i].len();
    }
    const oldData = this.data;
    if (hasTypedArray && (oldData instanceof Float32Array || !oldData)) {
      this.data = new Float32Array(offset + appendSize);
      if (offset > 0 && oldData) {
        for (let k = 0; k < offset; k++) {
          this.data[k] = oldData[k];
        }
      }
    }
    for (let i = 0; i < len; i++) {
      const appendPathData = path[i].data;
      for (let k = 0; k < appendPathData.length; k++) {
        this.data[offset++] = appendPathData[k];
      }
    }
    this._len = offset;
  }
  /**
   * 填充 Path 数据。
   * 尽量复用而不申明新的数组。大部分图形重绘的指令数据长度都是不变的。
   */
  addData(cmd, a, b, c, d, e, f, g, h) {
    if (!this._saveData) {
      return;
    }
    let data = this.data;
    if (this._len + arguments.length > data.length) {
      this._expandData();
      data = this.data;
    }
    for (let i = 0; i < arguments.length; i++) {
      data[this._len++] = arguments[i];
    }
  }
  _drawPendingPt() {
    if (this._pendingPtDist > 0) {
      this._ctx && this._ctx.lineTo(this._pendingPtX, this._pendingPtY);
      this._pendingPtDist = 0;
    }
  }
  _expandData() {
    if (!(this.data instanceof Array)) {
      const newData = [];
      for (let i = 0; i < this._len; i++) {
        newData[i] = this.data[i];
      }
      this.data = newData;
    }
  }
  /**
   * Convert dynamic array to static Float32Array
   *
   * It will still use a normal array if command buffer length is less than 10
   * Because Float32Array itself may take more memory than a normal array.
   *
   * 10 length will make sure at least one M command and one A(arc) command.
   */
  toStatic() {
    if (!this._saveData) {
      return;
    }
    this._drawPendingPt();
    const data = this.data;
    if (data instanceof Array) {
      data.length = this._len;
      if (hasTypedArray && this._len > 11) {
        this.data = new Float32Array(data);
      }
    }
  }
  getBoundingRect() {
    min[0] = min[1] = min2[0] = min2[1] = Number.MAX_VALUE;
    max[0] = max[1] = max2[0] = max2[1] = -Number.MAX_VALUE;
    const data = this.data;
    let xi = 0;
    let yi = 0;
    let x0 = 0;
    let y0 = 0;
    let i;
    for (i = 0; i < this._len; ) {
      const cmd = data[i++];
      const isFirst = i === 1;
      if (isFirst) {
        xi = data[i];
        yi = data[i + 1];
        x0 = xi;
        y0 = yi;
      }
      switch (cmd) {
        case CMD.M:
          xi = x0 = data[i++];
          yi = y0 = data[i++];
          min2[0] = x0;
          min2[1] = y0;
          max2[0] = x0;
          max2[1] = y0;
          break;
        case CMD.L:
          fromLine(xi, yi, data[i], data[i + 1], min2, max2);
          xi = data[i++];
          yi = data[i++];
          break;
        case CMD.C:
          fromCubic(
            xi,
            yi,
            data[i++],
            data[i++],
            data[i++],
            data[i++],
            data[i],
            data[i + 1],
            min2,
            max2
          );
          xi = data[i++];
          yi = data[i++];
          break;
        case CMD.Q:
          fromQuadratic(
            xi,
            yi,
            data[i++],
            data[i++],
            data[i],
            data[i + 1],
            min2,
            max2
          );
          xi = data[i++];
          yi = data[i++];
          break;
        case CMD.A:
          const cx = data[i++];
          const cy = data[i++];
          const rx = data[i++];
          const ry = data[i++];
          const startAngle = data[i++];
          const endAngle = data[i++] + startAngle;
          i += 1;
          const anticlockwise = !data[i++];
          if (isFirst) {
            x0 = mathCos(startAngle) * rx + cx;
            y0 = mathSin(startAngle) * ry + cy;
          }
          fromArc(
            cx,
            cy,
            rx,
            ry,
            startAngle,
            endAngle,
            anticlockwise,
            min2,
            max2
          );
          xi = mathCos(endAngle) * rx + cx;
          yi = mathSin(endAngle) * ry + cy;
          break;
        case CMD.R:
          x0 = xi = data[i++];
          y0 = yi = data[i++];
          const width = data[i++];
          const height = data[i++];
          fromLine(x0, y0, x0 + width, y0 + height, min2, max2);
          break;
        case CMD.Z:
          xi = x0;
          yi = y0;
          break;
      }
      vec2.min(min, min, min2);
      vec2.max(max, max, max2);
    }
    if (i === 0) {
      min[0] = min[1] = max[0] = max[1] = 0;
    }
    return new BoundingRect(
      min[0],
      min[1],
      max[0] - min[0],
      max[1] - min[1]
    );
  }
  _calculateLength() {
    const data = this.data;
    const len = this._len;
    const ux = this._ux;
    const uy = this._uy;
    let xi = 0;
    let yi = 0;
    let x0 = 0;
    let y0 = 0;
    if (!this._pathSegLen) {
      this._pathSegLen = [];
    }
    const pathSegLen = this._pathSegLen;
    let pathTotalLen = 0;
    let segCount = 0;
    for (let i = 0; i < len; ) {
      const cmd = data[i++];
      const isFirst = i === 1;
      if (isFirst) {
        xi = data[i];
        yi = data[i + 1];
        x0 = xi;
        y0 = yi;
      }
      let l = -1;
      switch (cmd) {
        case CMD.M:
          xi = x0 = data[i++];
          yi = y0 = data[i++];
          break;
        case CMD.L: {
          const x2 = data[i++];
          const y2 = data[i++];
          const dx = x2 - xi;
          const dy = y2 - yi;
          if (mathAbs(dx) > ux || mathAbs(dy) > uy || i === len - 1) {
            l = Math.sqrt(dx * dx + dy * dy);
            xi = x2;
            yi = y2;
          }
          break;
        }
        case CMD.C: {
          const x1 = data[i++];
          const y1 = data[i++];
          const x2 = data[i++];
          const y2 = data[i++];
          const x3 = data[i++];
          const y3 = data[i++];
          l = cubicLength(xi, yi, x1, y1, x2, y2, x3, y3, 10);
          xi = x3;
          yi = y3;
          break;
        }
        case CMD.Q: {
          const x1 = data[i++];
          const y1 = data[i++];
          const x2 = data[i++];
          const y2 = data[i++];
          l = quadraticLength(xi, yi, x1, y1, x2, y2, 10);
          xi = x2;
          yi = y2;
          break;
        }
        case CMD.A:
          const cx = data[i++];
          const cy = data[i++];
          const rx = data[i++];
          const ry = data[i++];
          const startAngle = data[i++];
          let delta = data[i++];
          const endAngle = delta + startAngle;
          i += 1;
          if (isFirst) {
            x0 = mathCos(startAngle) * rx + cx;
            y0 = mathSin(startAngle) * ry + cy;
          }
          l = mathMax(rx, ry) * mathMin(PI2, Math.abs(delta));
          xi = mathCos(endAngle) * rx + cx;
          yi = mathSin(endAngle) * ry + cy;
          break;
        case CMD.R: {
          x0 = xi = data[i++];
          y0 = yi = data[i++];
          const width = data[i++];
          const height = data[i++];
          l = width * 2 + height * 2;
          break;
        }
        case CMD.Z: {
          const dx = x0 - xi;
          const dy = y0 - yi;
          l = Math.sqrt(dx * dx + dy * dy);
          xi = x0;
          yi = y0;
          break;
        }
      }
      if (l >= 0) {
        pathSegLen[segCount++] = l;
        pathTotalLen += l;
      }
    }
    this._pathLen = pathTotalLen;
    return pathTotalLen;
  }
  /**
   * Rebuild path from current data
   * Rebuild path will not consider javascript implemented line dash.
   * @param {CanvasRenderingContext2D} ctx
   */
  rebuildPath(ctx, percent) {
    const d = this.data;
    const ux = this._ux;
    const uy = this._uy;
    const len = this._len;
    let x0;
    let y0;
    let xi;
    let yi;
    let x;
    let y;
    const drawPart = percent < 1;
    let pathSegLen;
    let pathTotalLen;
    let accumLength = 0;
    let segCount = 0;
    let displayedLength;
    let pendingPtDist = 0;
    let pendingPtX;
    let pendingPtY;
    if (drawPart) {
      if (!this._pathSegLen) {
        this._calculateLength();
      }
      pathSegLen = this._pathSegLen;
      pathTotalLen = this._pathLen;
      displayedLength = percent * pathTotalLen;
      if (!displayedLength) {
        return;
      }
    }
    lo: for (let i = 0; i < len; ) {
      const cmd = d[i++];
      const isFirst = i === 1;
      if (isFirst) {
        xi = d[i];
        yi = d[i + 1];
        x0 = xi;
        y0 = yi;
      }
      if (cmd !== CMD.L && pendingPtDist > 0) {
        ctx.lineTo(pendingPtX, pendingPtY);
        pendingPtDist = 0;
      }
      switch (cmd) {
        case CMD.M:
          x0 = xi = d[i++];
          y0 = yi = d[i++];
          ctx.moveTo(xi, yi);
          break;
        case CMD.L: {
          x = d[i++];
          y = d[i++];
          const dx = mathAbs(x - xi);
          const dy = mathAbs(y - yi);
          if (dx > ux || dy > uy) {
            if (drawPart) {
              const l = pathSegLen[segCount++];
              if (accumLength + l > displayedLength) {
                const t = (displayedLength - accumLength) / l;
                ctx.lineTo(xi * (1 - t) + x * t, yi * (1 - t) + y * t);
                break lo;
              }
              accumLength += l;
            }
            ctx.lineTo(x, y);
            xi = x;
            yi = y;
            pendingPtDist = 0;
          } else {
            const d2 = dx * dx + dy * dy;
            if (d2 > pendingPtDist) {
              pendingPtX = x;
              pendingPtY = y;
              pendingPtDist = d2;
            }
          }
          break;
        }
        case CMD.C: {
          const x1 = d[i++];
          const y1 = d[i++];
          const x2 = d[i++];
          const y2 = d[i++];
          const x3 = d[i++];
          const y3 = d[i++];
          if (drawPart) {
            const l = pathSegLen[segCount++];
            if (accumLength + l > displayedLength) {
              const t = (displayedLength - accumLength) / l;
              cubicSubdivide(xi, x1, x2, x3, t, tmpOutX);
              cubicSubdivide(yi, y1, y2, y3, t, tmpOutY);
              ctx.bezierCurveTo(tmpOutX[1], tmpOutY[1], tmpOutX[2], tmpOutY[2], tmpOutX[3], tmpOutY[3]);
              break lo;
            }
            accumLength += l;
          }
          ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
          xi = x3;
          yi = y3;
          break;
        }
        case CMD.Q: {
          const x1 = d[i++];
          const y1 = d[i++];
          const x2 = d[i++];
          const y2 = d[i++];
          if (drawPart) {
            const l = pathSegLen[segCount++];
            if (accumLength + l > displayedLength) {
              const t = (displayedLength - accumLength) / l;
              quadraticSubdivide(xi, x1, x2, t, tmpOutX);
              quadraticSubdivide(yi, y1, y2, t, tmpOutY);
              ctx.quadraticCurveTo(tmpOutX[1], tmpOutY[1], tmpOutX[2], tmpOutY[2]);
              break lo;
            }
            accumLength += l;
          }
          ctx.quadraticCurveTo(x1, y1, x2, y2);
          xi = x2;
          yi = y2;
          break;
        }
        case CMD.A:
          const cx = d[i++];
          const cy = d[i++];
          const rx = d[i++];
          const ry = d[i++];
          let startAngle = d[i++];
          let delta = d[i++];
          const psi = d[i++];
          const anticlockwise = !d[i++];
          const r = rx > ry ? rx : ry;
          const isEllipse = mathAbs(rx - ry) > 1e-3;
          let endAngle = startAngle + delta;
          let breakBuild = false;
          if (drawPart) {
            const l = pathSegLen[segCount++];
            if (accumLength + l > displayedLength) {
              endAngle = startAngle + delta * (displayedLength - accumLength) / l;
              breakBuild = true;
            }
            accumLength += l;
          }
          if (isEllipse && ctx.ellipse) {
            ctx.ellipse(cx, cy, rx, ry, psi, startAngle, endAngle, anticlockwise);
          } else {
            ctx.arc(cx, cy, r, startAngle, endAngle, anticlockwise);
          }
          if (breakBuild) {
            break lo;
          }
          if (isFirst) {
            x0 = mathCos(startAngle) * rx + cx;
            y0 = mathSin(startAngle) * ry + cy;
          }
          xi = mathCos(endAngle) * rx + cx;
          yi = mathSin(endAngle) * ry + cy;
          break;
        case CMD.R:
          x0 = xi = d[i];
          y0 = yi = d[i + 1];
          x = d[i++];
          y = d[i++];
          const width = d[i++];
          const height = d[i++];
          if (drawPart) {
            const l = pathSegLen[segCount++];
            if (accumLength + l > displayedLength) {
              let d2 = displayedLength - accumLength;
              ctx.moveTo(x, y);
              ctx.lineTo(x + mathMin(d2, width), y);
              d2 -= width;
              if (d2 > 0) {
                ctx.lineTo(x + width, y + mathMin(d2, height));
              }
              d2 -= height;
              if (d2 > 0) {
                ctx.lineTo(x + mathMax(width - d2, 0), y + height);
              }
              d2 -= width;
              if (d2 > 0) {
                ctx.lineTo(x, y + mathMax(height - d2, 0));
              }
              break lo;
            }
            accumLength += l;
          }
          ctx.rect(x, y, width, height);
          break;
        case CMD.Z:
          if (drawPart) {
            const l = pathSegLen[segCount++];
            if (accumLength + l > displayedLength) {
              const t = (displayedLength - accumLength) / l;
              ctx.lineTo(xi * (1 - t) + x0 * t, yi * (1 - t) + y0 * t);
              break lo;
            }
            accumLength += l;
          }
          ctx.closePath();
          xi = x0;
          yi = y0;
      }
    }
  }
  clone() {
    const newProxy = new PathProxy();
    const data = this.data;
    newProxy.data = data.slice ? data.slice() : Array.prototype.slice.call(data);
    newProxy._len = this._len;
    return newProxy;
  }
  canSave() {
    return !!this._saveData;
  }
  static initDefaultProps = function() {
    const proto = PathProxy.prototype;
    proto._saveData = true;
    proto._ux = 0;
    proto._uy = 0;
    proto._pendingPtDist = 0;
    proto._version = 0;
  }();
}
export {
  PathProxy as default,
  normalizeArcAngles
};
