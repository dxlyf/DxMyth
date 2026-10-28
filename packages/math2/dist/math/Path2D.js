import { fromSvgPathToCmds } from "./ParseSvgPath.js";
const IDENTITY = [1, 0, 0, 1, 0, 0];
const mapPoint = (m, x, y) => ({
  x: m[0] * x + m[2] * y + m[4],
  y: m[1] * x + m[3] * y + m[5]
});
const parseRadii = (radii) => {
  if (radii === void 0) {
    return [0, 0, 0, 0];
  }
  if (typeof radii === "number") {
    return [radii, radii, radii, radii];
  }
  const n = radii.length;
  const tl = radii[0] ?? 0;
  const tr = n > 1 ? radii[1] : tl;
  const br = n > 2 ? radii[2] : tl;
  const bl = n > 3 ? radii[3] : tr;
  return [tl, tr, br, bl];
};
const roundRectCommands = (cmd) => {
  const { x, y, w, h } = cmd;
  let [tl, tr, br, bl] = parseRadii(cmd.radii);
  const k = Math.min(
    1,
    tl + tr > 0 ? w / (tl + tr) : 1,
    bl + br > 0 ? w / (bl + br) : 1,
    tl + bl > 0 ? h / (tl + bl) : 1,
    tr + br > 0 ? h / (tr + br) : 1
  );
  tl *= k;
  tr *= k;
  br *= k;
  bl *= k;
  const out = [{ type: "moveTo", x: x + tl, y }];
  out.push({ type: "lineTo", x: x + w - tr, y });
  if (tr > 0) {
    out.push({ type: "arc", x: x + w - tr, y: y + tr, radius: tr, startAngle: -Math.PI / 2, endAngle: 0, counterclockwise: false });
  }
  out.push({ type: "lineTo", x: x + w, y: y + h - br });
  if (br > 0) {
    out.push({ type: "arc", x: x + w - br, y: y + h - br, radius: br, startAngle: 0, endAngle: Math.PI / 2, counterclockwise: false });
  }
  out.push({ type: "lineTo", x: x + bl, y: y + h });
  if (bl > 0) {
    out.push({ type: "arc", x: x + bl, y: y + h - bl, radius: bl, startAngle: Math.PI / 2, endAngle: Math.PI, counterclockwise: false });
  }
  out.push({ type: "lineTo", x, y: y + tl });
  if (tl > 0) {
    out.push({ type: "arc", x: x + tl, y: y + tl, radius: tl, startAngle: Math.PI, endAngle: Math.PI * 1.5, counterclockwise: false });
  }
  out.push({ type: "closePath" });
  return out;
};
const scaleRadii = (radii, scale) => {
  if (radii === void 0) {
    return void 0;
  }
  return typeof radii === "number" ? radii * scale : radii.map((r) => r * scale);
};
const emitSvgArc = (path, x1, y1, rx, ry, rotation, largeArc, sweep, x2, y2) => {
  if (x1 === x2 && y1 === y2) {
    return;
  }
  rx = Math.abs(rx);
  ry = Math.abs(ry);
  if (rx === 0 || ry === 0) {
    path.lineTo(x2, y2);
    return;
  }
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  const dx = (x1 - x2) / 2;
  const dy = (y1 - y2) / 2;
  const px = cos * dx + sin * dy;
  const py = -sin * dx + cos * dy;
  const lambda = px * px / (rx * rx) + py * py / (ry * ry);
  if (lambda > 1) {
    const k = Math.sqrt(lambda);
    rx *= k;
    ry *= k;
  }
  const rx2 = rx * rx;
  const ry2 = ry * ry;
  const denom = rx2 * py * py + ry2 * px * px;
  const num = rx2 * ry2 - denom;
  const sign = largeArc === sweep ? -1 : 1;
  const c = sign * Math.sqrt(Math.max(0, num / denom));
  const cpx = c * rx * py / ry;
  const cpy = -c * ry * px / rx;
  const cx = cos * cpx - sin * cpy + (x1 + x2) / 2;
  const cy = sin * cpx + cos * cpy + (y1 + y2) / 2;
  const ux = (px - cpx) / rx;
  const uy = (py - cpy) / ry;
  const vx = (-px - cpx) / rx;
  const vy = (-py - cpy) / ry;
  const startAngle = Math.atan2(uy, ux);
  let delta = Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
  if (!sweep && delta > 0) {
    delta -= Math.PI * 2;
  } else if (sweep && delta < 0) {
    delta += Math.PI * 2;
  }
  path.ellipse(cx, cy, rx, ry, rotation, startAngle, startAngle + delta, !sweep);
};
class Path2D {
  /** 按调用顺序记录的全部命令 */
  commands = [];
  /** 命令版本号，每次命令变化自增，供几何缓存判断是否需要重建 */
  _version = 0;
  /** 当前命令版本号 */
  get version() {
    return this._version;
  }
  /** 已记录的命令数量 */
  get size() {
    return this.commands.length;
  }
  /** 追加一条命令并更新版本号 */
  addCommand(cmd) {
    this.commands.push(cmd);
    this._version++;
  }
  /** 清空已记录的命令 */
  clear() {
    this.commands.length = 0;
    this._version++;
  }
  /** 按记录顺序遍历命令，支持 for...of 与展开语法 */
  [Symbol.iterator]() {
    return this.commands[Symbol.iterator]();
  }
  /**
   * 以访问者模式按顺序回调每条命令。
   *
   * 只回调访问者中已声明的命令类型，便于做序列化、包围盒统计等遍历处理。
   */
  visit(visitor) {
    const handlers = visitor;
    for (const cmd of this.commands) {
      handlers[cmd.type]?.(cmd);
    }
  }
  /**
   * 从 SVG path 的 `d` 字符串创建路径。
   *
   * 支持 M / L / H / V / C / S / Q / T / A / Z 全部命令（大小写均可），
   * 隐式重复参数与 moveto 后的隐式 lineto 都会按规范展开；
   * 其中椭圆弧 A 会换算为中心参数化后记录成 ellipse 命令，不转成贝塞尔。
   *
   * @param d SVG path 数据，如 `"M10 10 L20 20 C30 30 40 40 50 50Z"`
   * @returns 记录了解析结果的 Path2D
   */
  static fromSvg(d) {
    const path = new Path2D();
    if (!d || !d.trim()) {
      return path;
    }
    let cx = 0, cy = 0;
    let sx = 0, sy = 0;
    let cubicX = Number.NaN, cubicY = Number.NaN;
    let quadX = Number.NaN, quadY = Number.NaN;
    for (const { cmd, params } of fromSvgPathToCmds(d)) {
      const relative = cmd === cmd.toLowerCase();
      let i = 0;
      switch (cmd.toUpperCase()) {
        case "M": {
          while (i + 1 < params.length) {
            const x = params[i++];
            const y = params[i++];
            const px = relative ? cx + x : x;
            const py = relative ? cy + y : y;
            if (i === 2) {
              path.moveTo(px, py);
              sx = px;
              sy = py;
            } else {
              path.lineTo(px, py);
            }
            cx = px;
            cy = py;
          }
          cubicX = cubicY = quadX = quadY = Number.NaN;
          break;
        }
        case "L": {
          while (i + 1 < params.length) {
            const x = params[i++];
            const y = params[i++];
            cx = relative ? cx + x : x;
            cy = relative ? cy + y : y;
            path.lineTo(cx, cy);
          }
          cubicX = cubicY = quadX = quadY = Number.NaN;
          break;
        }
        case "H": {
          while (i < params.length) {
            const x = params[i++];
            cx = relative ? cx + x : x;
            path.lineTo(cx, cy);
          }
          cubicX = cubicY = quadX = quadY = Number.NaN;
          break;
        }
        case "V": {
          while (i < params.length) {
            const y = params[i++];
            cy = relative ? cy + y : y;
            path.lineTo(cx, cy);
          }
          cubicX = cubicY = quadX = quadY = Number.NaN;
          break;
        }
        case "C": {
          while (i + 5 < params.length) {
            const cp1x = params[i++], cp1y = params[i++];
            const cp2x = params[i++], cp2y = params[i++];
            const x = params[i++], y = params[i++];
            const p1x = relative ? cx + cp1x : cp1x;
            const p1y = relative ? cy + cp1y : cp1y;
            const p2x = relative ? cx + cp2x : cp2x;
            const p2y = relative ? cy + cp2y : cp2y;
            const px = relative ? cx + x : x;
            const py = relative ? cy + y : y;
            path.bezierCurveTo(p1x, p1y, p2x, p2y, px, py);
            cubicX = p2x;
            cubicY = p2y;
            quadX = quadY = Number.NaN;
            cx = px;
            cy = py;
          }
          break;
        }
        case "S": {
          while (i + 3 < params.length) {
            const cp2x = params[i++], cp2y = params[i++];
            const x = params[i++], y = params[i++];
            const p1x = Number.isNaN(cubicX) ? cx : 2 * cx - cubicX;
            const p1y = Number.isNaN(cubicY) ? cy : 2 * cy - cubicY;
            const p2x = relative ? cx + cp2x : cp2x;
            const p2y = relative ? cy + cp2y : cp2y;
            const px = relative ? cx + x : x;
            const py = relative ? cy + y : y;
            path.bezierCurveTo(p1x, p1y, p2x, p2y, px, py);
            cubicX = p2x;
            cubicY = p2y;
            quadX = quadY = Number.NaN;
            cx = px;
            cy = py;
          }
          break;
        }
        case "Q": {
          while (i + 3 < params.length) {
            const cpx = params[i++], cpy = params[i++];
            const x = params[i++], y = params[i++];
            const pcx = relative ? cx + cpx : cpx;
            const pcy = relative ? cy + cpy : cpy;
            const px = relative ? cx + x : x;
            const py = relative ? cy + y : y;
            path.quadraticCurveTo(pcx, pcy, px, py);
            quadX = pcx;
            quadY = pcy;
            cubicX = cubicY = Number.NaN;
            cx = px;
            cy = py;
          }
          break;
        }
        case "T": {
          while (i + 1 < params.length) {
            const x = params[i++], y = params[i++];
            quadX = Number.isNaN(quadX) ? cx : 2 * cx - quadX;
            quadY = Number.isNaN(quadY) ? cy : 2 * cy - quadY;
            const px = relative ? cx + x : x;
            const py = relative ? cy + y : y;
            path.quadraticCurveTo(quadX, quadY, px, py);
            cubicX = cubicY = Number.NaN;
            cx = px;
            cy = py;
          }
          break;
        }
        case "A": {
          while (i + 6 < params.length) {
            const rx = params[i++], ry = params[i++];
            const rotation = params[i++] * Math.PI / 180;
            const largeArc = params[i++] !== 0;
            const sweep = params[i++] !== 0;
            const x = params[i++], y = params[i++];
            const px = relative ? cx + x : x;
            const py = relative ? cy + y : y;
            emitSvgArc(path, cx, cy, rx, ry, rotation, largeArc, sweep, px, py);
            cx = px;
            cy = py;
            cubicX = cubicY = quadX = quadY = Number.NaN;
          }
          break;
        }
        case "Z": {
          path.closePath();
          cx = sx;
          cy = sy;
          cubicX = cubicY = quadX = quadY = Number.NaN;
          break;
        }
      }
    }
    return path;
  }
  /**
   * 把另一个路径的命令经 transform 变换后追加到当前路径。
   *
   * 点与贝塞尔控制点按仿射矩阵精确变换；圆弧 / 椭圆的半径取矩阵的
   * 几何平均缩放量、角度随矩阵 X 轴旋转、行列式为负时翻转绘制方向，
   * 因此在旋转和等比缩放下精确，在非等比缩放或错切下为近似结果。
   *
   * @param path 源路径
   * @param transform 仿射矩阵 [a, b, c, d, tx, ty]，默认单位矩阵
   */
  addPath(path, transform = IDENTITY) {
    this.appendCommands(path === this ? path.commands.slice() : path.commands, transform);
  }
  arc(x, y, radius, startAngle, endAngle, counterclockwise = false) {
    this.addCommand({ type: "arc", x, y, radius, startAngle, endAngle, counterclockwise });
  }
  arcTo(x1, y1, x2, y2, radius) {
    this.addCommand({ type: "arcTo", x1, y1, x2, y2, radius });
  }
  bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    this.addCommand({ type: "bezierCurveTo", cp1x, cp1y, cp2x, cp2y, x, y });
  }
  closePath() {
    this.addCommand({ type: "closePath" });
  }
  ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise = false) {
    this.addCommand({
      type: "ellipse",
      x,
      y,
      radiusX,
      radiusY,
      rotation,
      startAngle,
      endAngle,
      counterclockwise
    });
  }
  lineTo(x, y) {
    this.addCommand({ type: "lineTo", x, y });
  }
  moveTo(x, y) {
    this.addCommand({ type: "moveTo", x, y });
  }
  quadraticCurveTo(cpx, cpy, x, y) {
    this.addCommand({ type: "quadraticCurveTo", cpx, cpy, x, y });
  }
  rect(x, y, w, h) {
    this.addCommand({ type: "rect", x, y, w, h });
  }
  roundRect(x, y, w, h, radii) {
    this.addCommand({ type: "roundRect", x, y, w, h, radii });
  }
  /** 逐条变换并追加命令 */
  appendCommands(commands, m) {
    const det = m[0] * m[3] - m[1] * m[2];
    const scaleX = Math.hypot(m[0], m[1]);
    const scaleY = Math.hypot(m[2], m[3]);
    const radiusScale = Math.sqrt(Math.abs(det));
    const angle = Math.atan2(m[1], m[0]);
    const flipped = det < 0;
    const keepRect = m[1] === 0 && m[2] === 0 && m[0] > 0 && m[3] > 0;
    for (const cmd of commands) {
      switch (cmd.type) {
        case "moveTo": {
          const p = mapPoint(m, cmd.x, cmd.y);
          this.addCommand({ type: "moveTo", x: p.x, y: p.y });
          break;
        }
        case "lineTo": {
          const p = mapPoint(m, cmd.x, cmd.y);
          this.addCommand({ type: "lineTo", x: p.x, y: p.y });
          break;
        }
        case "bezierCurveTo": {
          const c1 = mapPoint(m, cmd.cp1x, cmd.cp1y);
          const c2 = mapPoint(m, cmd.cp2x, cmd.cp2y);
          const p = mapPoint(m, cmd.x, cmd.y);
          this.addCommand({
            type: "bezierCurveTo",
            cp1x: c1.x,
            cp1y: c1.y,
            cp2x: c2.x,
            cp2y: c2.y,
            x: p.x,
            y: p.y
          });
          break;
        }
        case "quadraticCurveTo": {
          const c = mapPoint(m, cmd.cpx, cmd.cpy);
          const p = mapPoint(m, cmd.x, cmd.y);
          this.addCommand({ type: "quadraticCurveTo", cpx: c.x, cpy: c.y, x: p.x, y: p.y });
          break;
        }
        case "closePath":
          this.addCommand({ type: "closePath" });
          break;
        case "rect": {
          if (keepRect) {
            const p = mapPoint(m, cmd.x, cmd.y);
            this.addCommand({ type: "rect", x: p.x, y: p.y, w: m[0] * cmd.w, h: m[3] * cmd.h });
          } else {
            const p0 = mapPoint(m, cmd.x, cmd.y);
            const p1 = mapPoint(m, cmd.x + cmd.w, cmd.y);
            const p2 = mapPoint(m, cmd.x + cmd.w, cmd.y + cmd.h);
            const p3 = mapPoint(m, cmd.x, cmd.y + cmd.h);
            this.addCommand({ type: "moveTo", x: p0.x, y: p0.y });
            this.addCommand({ type: "lineTo", x: p1.x, y: p1.y });
            this.addCommand({ type: "lineTo", x: p2.x, y: p2.y });
            this.addCommand({ type: "lineTo", x: p3.x, y: p3.y });
            this.addCommand({ type: "closePath" });
          }
          break;
        }
        case "roundRect": {
          if (keepRect) {
            const p = mapPoint(m, cmd.x, cmd.y);
            this.addCommand({
              type: "roundRect",
              x: p.x,
              y: p.y,
              w: m[0] * cmd.w,
              h: m[3] * cmd.h,
              radii: scaleRadii(cmd.radii, radiusScale)
            });
          } else {
            this.appendCommands(roundRectCommands(cmd), m);
          }
          break;
        }
        case "arc": {
          const p = mapPoint(m, cmd.x, cmd.y);
          this.addCommand({
            type: "arc",
            x: p.x,
            y: p.y,
            radius: cmd.radius * radiusScale,
            startAngle: flipped ? angle - cmd.startAngle : cmd.startAngle + angle,
            endAngle: flipped ? angle - cmd.endAngle : cmd.endAngle + angle,
            counterclockwise: flipped !== cmd.counterclockwise
          });
          break;
        }
        case "arcTo": {
          const p1 = mapPoint(m, cmd.x1, cmd.y1);
          const p2 = mapPoint(m, cmd.x2, cmd.y2);
          this.addCommand({
            type: "arcTo",
            x1: p1.x,
            y1: p1.y,
            x2: p2.x,
            y2: p2.y,
            radius: cmd.radius * radiusScale
          });
          break;
        }
        case "ellipse": {
          const p = mapPoint(m, cmd.x, cmd.y);
          this.addCommand({
            type: "ellipse",
            x: p.x,
            y: p.y,
            radiusX: cmd.radiusX * scaleX,
            radiusY: cmd.radiusY * scaleY,
            rotation: flipped ? angle - cmd.rotation : cmd.rotation + angle,
            startAngle: flipped ? -cmd.startAngle : cmd.startAngle,
            endAngle: flipped ? -cmd.endAngle : cmd.endAngle,
            counterclockwise: flipped !== cmd.counterclockwise
          });
          break;
        }
      }
    }
  }
}
export {
  Path2D
};
