import PathProxy from "../PathProxy.js";
import { containStroke as containStroke$1 } from "./line.js";
import { containStroke as containStroke$4 } from "./cubic.js";
import { containStroke as containStroke$3 } from "./quadratic.js";
import { containStroke as containStroke$2 } from "./arc.js";
import { quadraticRootAt, quadraticAt, cubicRootAt, cubicExtrema, cubicAt, quadraticExtremum } from "../curve.js";
import windingLine from "./windingLine.js";
const CMD = PathProxy.CMD;
const PI2 = Math.PI * 2;
const EPSILON = 1e-4;
function isAroundEqual(a, b) {
  return Math.abs(a - b) < EPSILON;
}
const roots = [-1, -1, -1];
const extrema = [-1, -1];
function swapExtrema() {
  const tmp = extrema[0];
  extrema[0] = extrema[1];
  extrema[1] = tmp;
}
function windingCubic(x0, y0, x1, y1, x2, y2, x3, y3, x, y) {
  if (y > y0 && y > y1 && y > y2 && y > y3 || y < y0 && y < y1 && y < y2 && y < y3) {
    return 0;
  }
  const nRoots = cubicRootAt(y0, y1, y2, y3, y, roots);
  if (nRoots === 0) {
    return 0;
  } else {
    let w = 0;
    let nExtrema = -1;
    let y0_;
    let y1_;
    for (let i = 0; i < nRoots; i++) {
      let t = roots[i];
      let unit = t === 0 || t === 1 ? 0.5 : 1;
      let x_ = cubicAt(x0, x1, x2, x3, t);
      if (x_ < x) {
        continue;
      }
      if (nExtrema < 0) {
        nExtrema = cubicExtrema(y0, y1, y2, y3, extrema);
        if (extrema[1] < extrema[0] && nExtrema > 1) {
          swapExtrema();
        }
        y0_ = cubicAt(y0, y1, y2, y3, extrema[0]);
        if (nExtrema > 1) {
          y1_ = cubicAt(y0, y1, y2, y3, extrema[1]);
        }
      }
      if (nExtrema === 2) {
        if (t < extrema[0]) {
          w += y0_ < y0 ? unit : -unit;
        } else if (t < extrema[1]) {
          w += y1_ < y0_ ? unit : -unit;
        } else {
          w += y3 < y1_ ? unit : -unit;
        }
      } else {
        if (t < extrema[0]) {
          w += y0_ < y0 ? unit : -unit;
        } else {
          w += y3 < y0_ ? unit : -unit;
        }
      }
    }
    return w;
  }
}
function windingQuadratic(x0, y0, x1, y1, x2, y2, x, y) {
  if (y > y0 && y > y1 && y > y2 || y < y0 && y < y1 && y < y2) {
    return 0;
  }
  const nRoots = quadraticRootAt(y0, y1, y2, y, roots);
  if (nRoots === 0) {
    return 0;
  } else {
    const t = quadraticExtremum(y0, y1, y2);
    if (t >= 0 && t <= 1) {
      let w = 0;
      let y_ = quadraticAt(y0, y1, y2, t);
      for (let i = 0; i < nRoots; i++) {
        let unit = roots[i] === 0 || roots[i] === 1 ? 0.5 : 1;
        let x_ = quadraticAt(x0, x1, x2, roots[i]);
        if (x_ < x) {
          continue;
        }
        if (roots[i] < t) {
          w += y_ < y0 ? unit : -unit;
        } else {
          w += y2 < y_ ? unit : -unit;
        }
      }
      return w;
    } else {
      const unit = roots[0] === 0 || roots[0] === 1 ? 0.5 : 1;
      const x_ = quadraticAt(x0, x1, x2, roots[0]);
      if (x_ < x) {
        return 0;
      }
      return y2 < y0 ? unit : -unit;
    }
  }
}
function windingArc(cx, cy, r, startAngle, endAngle, anticlockwise, x, y) {
  y -= cy;
  if (y > r || y < -r) {
    return 0;
  }
  const tmp = Math.sqrt(r * r - y * y);
  roots[0] = -tmp;
  roots[1] = tmp;
  const dTheta = Math.abs(startAngle - endAngle);
  if (dTheta < 1e-4) {
    return 0;
  }
  if (dTheta >= PI2 - 1e-4) {
    startAngle = 0;
    endAngle = PI2;
    const dir = anticlockwise ? 1 : -1;
    if (x >= roots[0] + cx && x <= roots[1] + cx) {
      return dir;
    } else {
      return 0;
    }
  }
  if (startAngle > endAngle) {
    const tmp2 = startAngle;
    startAngle = endAngle;
    endAngle = tmp2;
  }
  if (startAngle < 0) {
    startAngle += PI2;
    endAngle += PI2;
  }
  let w = 0;
  for (let i = 0; i < 2; i++) {
    const x_ = roots[i];
    if (x_ + cx > x) {
      let angle = Math.atan2(y, x_);
      let dir = anticlockwise ? 1 : -1;
      if (angle < 0) {
        angle = PI2 + angle;
      }
      if (angle >= startAngle && angle <= endAngle || angle + PI2 >= startAngle && angle + PI2 <= endAngle) {
        if (angle > Math.PI / 2 && angle < Math.PI * 1.5) {
          dir = -dir;
        }
        w += dir;
      }
    }
  }
  return w;
}
function containPath(path, lineWidth, isStroke, x, y) {
  const data = path.data;
  const len = path.len();
  let w = 0;
  let xi = 0;
  let yi = 0;
  let x0 = 0;
  let y0 = 0;
  let x1;
  let y1;
  for (let i = 0; i < len; ) {
    const cmd = data[i++];
    const isFirst = i === 1;
    if (cmd === CMD.M && i > 1) {
      if (!isStroke) {
        w += windingLine(xi, yi, x0, y0, x, y);
      }
    }
    if (isFirst) {
      xi = data[i];
      yi = data[i + 1];
      x0 = xi;
      y0 = yi;
    }
    switch (cmd) {
      case CMD.M:
        x0 = data[i++];
        y0 = data[i++];
        xi = x0;
        yi = y0;
        break;
      case CMD.L:
        if (isStroke) {
          if (containStroke$1(xi, yi, data[i], data[i + 1], lineWidth, x, y)) {
            return true;
          }
        } else {
          w += windingLine(xi, yi, data[i], data[i + 1], x, y) || 0;
        }
        xi = data[i++];
        yi = data[i++];
        break;
      case CMD.C:
        if (isStroke) {
          if (containStroke$4(
            xi,
            yi,
            data[i++],
            data[i++],
            data[i++],
            data[i++],
            data[i],
            data[i + 1],
            lineWidth,
            x,
            y
          )) {
            return true;
          }
        } else {
          w += windingCubic(
            xi,
            yi,
            data[i++],
            data[i++],
            data[i++],
            data[i++],
            data[i],
            data[i + 1],
            x,
            y
          ) || 0;
        }
        xi = data[i++];
        yi = data[i++];
        break;
      case CMD.Q:
        if (isStroke) {
          if (containStroke$3(
            xi,
            yi,
            data[i++],
            data[i++],
            data[i],
            data[i + 1],
            lineWidth,
            x,
            y
          )) {
            return true;
          }
        } else {
          w += windingQuadratic(
            xi,
            yi,
            data[i++],
            data[i++],
            data[i],
            data[i + 1],
            x,
            y
          ) || 0;
        }
        xi = data[i++];
        yi = data[i++];
        break;
      case CMD.A:
        const cx = data[i++];
        const cy = data[i++];
        const rx = data[i++];
        const ry = data[i++];
        const theta = data[i++];
        const dTheta = data[i++];
        i += 1;
        const anticlockwise = !!(1 - data[i++]);
        x1 = Math.cos(theta) * rx + cx;
        y1 = Math.sin(theta) * ry + cy;
        if (!isFirst) {
          w += windingLine(xi, yi, x1, y1, x, y);
        } else {
          x0 = x1;
          y0 = y1;
        }
        const _x = (x - cx) * ry / rx + cx;
        if (isStroke) {
          if (containStroke$2(
            cx,
            cy,
            ry,
            theta,
            theta + dTheta,
            anticlockwise,
            lineWidth,
            _x,
            y
          )) {
            return true;
          }
        } else {
          w += windingArc(
            cx,
            cy,
            ry,
            theta,
            theta + dTheta,
            anticlockwise,
            _x,
            y
          );
        }
        xi = Math.cos(theta + dTheta) * rx + cx;
        yi = Math.sin(theta + dTheta) * ry + cy;
        break;
      case CMD.R:
        x0 = xi = data[i++];
        y0 = yi = data[i++];
        const width = data[i++];
        const height = data[i++];
        x1 = x0 + width;
        y1 = y0 + height;
        if (isStroke) {
          if (containStroke$1(x0, y0, x1, y0, lineWidth, x, y) || containStroke$1(x1, y0, x1, y1, lineWidth, x, y) || containStroke$1(x1, y1, x0, y1, lineWidth, x, y) || containStroke$1(x0, y1, x0, y0, lineWidth, x, y)) {
            return true;
          }
        } else {
          w += windingLine(x1, y0, x1, y1, x, y);
          w += windingLine(x0, y1, x0, y0, x, y);
        }
        break;
      case CMD.Z:
        if (isStroke) {
          if (containStroke$1(
            xi,
            yi,
            x0,
            y0,
            lineWidth,
            x,
            y
          )) {
            return true;
          }
        } else {
          w += windingLine(xi, yi, x0, y0, x, y);
        }
        xi = x0;
        yi = y0;
        break;
    }
  }
  if (!isStroke && !isAroundEqual(yi, y0)) {
    w += windingLine(xi, yi, x0, y0, x, y) || 0;
  }
  return w !== 0;
}
function contain(pathProxy, x, y) {
  return containPath(pathProxy, 0, false, x, y);
}
function containStroke(pathProxy, lineWidth, x, y) {
  return containPath(pathProxy, lineWidth, true, x, y);
}
export {
  contain,
  containStroke
};
