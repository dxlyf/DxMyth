import { PathBuilder } from "./PathBuilder.js";
import { Point } from "./Point.js";
const length = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 };
const segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
const number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;
function parseSvgPath(path) {
  const data = [];
  path.replace(segment, (_, cmd, args) => {
    let type = cmd.toLowerCase();
    let command = cmd;
    const values = parseValues(args);
    if (type === "m" && values.length > 2) {
      data.push([command, ...values.splice(0, 2)]);
      type = "l";
      command = command === "m" ? "l" : "L";
    }
    while (true) {
      if (values.length === length[type]) {
        data.push([command, ...values]);
        return "";
      }
      if (values.length < length[type]) throw new Error("malformed path data");
      data.push([command, ...values.splice(0, length[type])]);
    }
  });
  return data;
}
function parseValues(args) {
  const numbers = args.match(number);
  return numbers ? numbers.map(Number) : [];
}
const svgCmdReg = /[MLHVCSQTAZmlhvcsqtaz]/;
const fromSvgPathToCmds = (svgPath) => {
  const cmds = [];
  let currentCmd = "";
  const allNumbers = [];
  for (let i = 0; i < svgPath.length; i++) {
    const ch = svgPath[i];
    if (svgCmdReg.test(ch)) {
      if (currentCmd && allNumbers.length > 0) {
        cmds.push({ cmd: currentCmd, params: [...allNumbers] });
        allNumbers.length = 0;
      } else if (currentCmd && allNumbers.length === 0) {
        if (currentCmd === "z" || currentCmd === "Z") {
          cmds.push({ cmd: currentCmd, params: [] });
        }
      }
      currentCmd = ch;
    } else if (ch === "," || ch === " ") {
      continue;
    } else if (ch === "-" || ch === "+" || ch === "." || ch >= "0" && ch <= "9" || ch === "e" || ch === "E") {
      let numEnd = i + 1;
      while (numEnd < svgPath.length && /[0-9.eE+\-]/.test(svgPath[numEnd])) {
        if ((svgPath[numEnd] === "+" || svgPath[numEnd] === "-") && !(svgPath[numEnd - 1] === "e" || svgPath[numEnd - 1] === "E")) {
          break;
        }
        if (svgCmdReg.test(svgPath[numEnd])) break;
        if (svgPath[numEnd] === "," || svgPath[numEnd] === " ") {
          numEnd++;
          break;
        }
        numEnd++;
      }
      const numStr = svgPath.substring(i, numEnd).trim();
      if (numStr && !svgCmdReg.test(numStr)) {
        const n = parseFloat(numStr);
        if (!isNaN(n)) allNumbers.push(n);
      }
      i = numEnd - 1;
    }
  }
  if (currentCmd) {
    cmds.push({ cmd: currentCmd, params: [...allNumbers] });
  }
  return cmds;
};
function fromSvgPath(svgPath) {
  const path = new PathBuilder();
  if (!svgPath || !svgPath.trim()) return path;
  const cmds = fromSvgPathToCmds(svgPath);
  let currentPoint = Point.fromPoint({ x: 0, y: 0 });
  let lastControlPoint = null;
  for (let ci = 0; ci < cmds.length; ci++) {
    const { cmd, params } = cmds[ci];
    const isRelative = cmd === cmd.toLowerCase();
    const absCmd = cmd.toUpperCase();
    let pi = 0;
    switch (absCmd) {
      case "M": {
        while (pi + 1 <= params.length) {
          const x = params[pi++];
          const y = params[pi++];
          const px = isRelative ? currentPoint.x + x : x;
          const py = isRelative ? currentPoint.y + y : y;
          if (pi === 2) {
            path.moveTo(px, py);
          } else {
            path.lineTo(px, py);
          }
          currentPoint = Point.fromPoint({ x: px, y: py });
          if (isRelative) break;
        }
        lastControlPoint = null;
        break;
      }
      case "L": {
        while (pi + 1 <= params.length) {
          const x = params[pi++];
          const y = params[pi++];
          const px = isRelative ? currentPoint.x + x : x;
          const py = isRelative ? currentPoint.y + y : y;
          path.lineTo(px, py);
          currentPoint = Point.fromPoint({ x: px, y: py });
        }
        lastControlPoint = null;
        break;
      }
      case "H": {
        while (pi < params.length) {
          const x = params[pi++];
          const px = isRelative ? currentPoint.x + x : x;
          path.lineTo(px, currentPoint.y);
          currentPoint = Point.fromPoint({ x: px, y: currentPoint.y });
        }
        lastControlPoint = null;
        break;
      }
      case "V": {
        while (pi < params.length) {
          const y = params[pi++];
          const py = isRelative ? currentPoint.y + y : y;
          path.lineTo(currentPoint.x, py);
          currentPoint = Point.fromPoint({ x: currentPoint.x, y: py });
        }
        lastControlPoint = null;
        break;
      }
      case "C": {
        while (pi + 5 <= params.length) {
          const cp1x = params[pi++];
          const cp1y = params[pi++];
          const cp2x = params[pi++];
          const cp2y = params[pi++];
          const x = params[pi++];
          const y = params[pi++];
          const p1x = isRelative ? currentPoint.x + cp1x : cp1x;
          const p1y = isRelative ? currentPoint.y + cp1y : cp1y;
          const p2x = isRelative ? currentPoint.x + cp2x : cp2x;
          const p2y = isRelative ? currentPoint.y + cp2y : cp2y;
          const px = isRelative ? currentPoint.x + x : x;
          const py = isRelative ? currentPoint.y + y : y;
          path.bezierCurveTo(p1x, p1y, p2x, p2y, px, py);
          lastControlPoint = { x: p2x, y: p2y };
          currentPoint = Point.fromPoint({ x: px, y: py });
        }
        break;
      }
      case "S": {
        while (pi + 3 <= params.length) {
          const cp2x = params[pi++];
          const cp2y = params[pi++];
          const x = params[pi++];
          const y = params[pi++];
          let cp1x, cp1y;
          if (lastControlPoint) {
            cp1x = 2 * currentPoint.x - lastControlPoint.x;
            cp1y = 2 * currentPoint.y - lastControlPoint.y;
          } else {
            cp1x = currentPoint.x;
            cp1y = currentPoint.y;
          }
          const p2x = isRelative ? currentPoint.x + cp2x : cp2x;
          const p2y = isRelative ? currentPoint.y + cp2y : cp2y;
          const px = isRelative ? currentPoint.x + x : x;
          const py = isRelative ? currentPoint.y + y : y;
          path.bezierCurveTo(cp1x, cp1y, p2x, p2y, px, py);
          lastControlPoint = { x: p2x, y: p2y };
          currentPoint = Point.fromPoint({ x: px, y: py });
        }
        break;
      }
      case "Q": {
        while (pi + 3 <= params.length) {
          const cpx = params[pi++];
          const cpy = params[pi++];
          const x = params[pi++];
          const y = params[pi++];
          const pcx = isRelative ? currentPoint.x + cpx : cpx;
          const pcy = isRelative ? currentPoint.y + cpy : cpy;
          const px = isRelative ? currentPoint.x + x : x;
          const py = isRelative ? currentPoint.y + y : y;
          path.quadraticCurveTo(pcx, pcy, px, py);
          lastControlPoint = { x: pcx, y: pcy };
          currentPoint = Point.fromPoint({ x: px, y: py });
        }
        break;
      }
      case "T": {
        while (pi + 1 <= params.length) {
          const x = params[pi++];
          const y = params[pi++];
          let cpx, cpy;
          if (lastControlPoint) {
            cpx = 2 * currentPoint.x - lastControlPoint.x;
            cpy = 2 * currentPoint.y - lastControlPoint.y;
          } else {
            cpx = currentPoint.x;
            cpy = currentPoint.y;
          }
          const px = isRelative ? currentPoint.x + x : x;
          const py = isRelative ? currentPoint.y + y : y;
          path.quadraticCurveTo(cpx, cpy, px, py);
          lastControlPoint = { x: cpx, y: cpy };
          currentPoint = Point.fromPoint({ x: px, y: py });
        }
        break;
      }
      case "A": {
        while (pi + 6 <= params.length) {
          const rx = params[pi++];
          const ry = params[pi++];
          const xAxisRotation = params[pi++] * Math.PI / 180;
          const largeArcFlag = params[pi++];
          const sweepFlag = params[pi++];
          const x = params[pi++];
          const y = params[pi++];
          const px = isRelative ? currentPoint.x + x : x;
          const py = isRelative ? currentPoint.y + y : y;
          path.arcToSvg(
            currentPoint.x,
            currentPoint.y,
            rx,
            ry,
            xAxisRotation,
            largeArcFlag !== 0,
            sweepFlag !== 0,
            px,
            py
          );
          currentPoint = Point.fromPoint({ x: px, y: py });
          lastControlPoint = null;
        }
        break;
      }
      case "Z": {
        path.closePath();
        lastControlPoint = null;
        break;
      }
    }
  }
  return path;
}
export {
  fromSvgPath,
  fromSvgPathToCmds,
  parseSvgPath
};
