import { Point } from "../basic/Point.js";
import { Numerical } from "../util/Numerical.js";
import { Size } from "../basic/Size.js";
function parsePathData(target, data) {
  const parts = data && data.match(/[mlhvcsqtaz][^mlhvcsqtaz]*/ig), number = "([+-]?(?:\\d*\\.\\d+|\\d+\\.?)(?:[eE][+-]?\\d+)?)", numbers = new RegExp(number, "g"), flag = "([01])", arcs = new RegExp([number, number, number, flag, flag, number, number].join("[\\s,]*"), "g");
  let coords, relative = false, previous = "", control = new Point(), current = new Point(), start = new Point();
  target.clear();
  for (let i = 0, l = parts && parts.length; i < l; i++) {
    const part = parts[i], command = part[0], lower = command.toLowerCase();
    coords = part.match(numbers);
    const length = coords && coords.length;
    relative = command === lower;
    const getCoord = (index, coord) => {
      let val = +coords[index];
      if (relative)
        val += current[coord];
      return val;
    };
    const getPoint = (index) => new Point(getCoord(index, "x"), getCoord(index + 1, "y"));
    if (previous === "z" && !/[mz]/.test(lower))
      target.moveTo(current);
    switch (lower) {
      case "m":
      case "l": {
        let move = lower === "m";
        for (let j = 0; j < length; j += 2) {
          current = getPoint(j);
          if (move) {
            target.moveTo(current);
            start = current;
            move = false;
          } else {
            target.lineTo(current);
          }
        }
        control = current;
        break;
      }
      case "h":
      case "v": {
        const coord = lower === "h" ? "x" : "y";
        current = current.clone();
        for (let j = 0; j < length; j++) {
          current[coord] = getCoord(j, coord);
          target.lineTo(current);
        }
        control = current;
        break;
      }
      case "c":
        for (let j = 0; j < length; j += 6) {
          target.cubicCurveTo(
            getPoint(j),
            control = getPoint(j + 2),
            current = getPoint(j + 4)
          );
        }
        break;
      case "s":
        for (let j = 0; j < length; j += 4) {
          target.cubicCurveTo(
            /[cs]/.test(previous) ? current.multiply(2).subtract(control) : current,
            control = getPoint(j),
            current = getPoint(j + 2)
          );
          previous = lower;
        }
        break;
      case "q":
        for (let j = 0; j < length; j += 4) {
          target.quadraticCurveTo(
            control = getPoint(j),
            current = getPoint(j + 2)
          );
        }
        break;
      case "t":
        for (let j = 0; j < length; j += 2) {
          target.quadraticCurveTo(
            control = /[qt]/.test(previous) ? current.multiply(2).subtract(control) : current,
            current = getPoint(j)
          );
          previous = lower;
        }
        break;
      case "a": {
        let match;
        arcs.lastIndex = 0;
        while (match = arcs.exec(part)) {
          coords = match;
          target.arcTo(
            current = getPoint(6),
            new Size(+coords[1], +coords[2]),
            +coords[3],
            !!+coords[5],
            !!+coords[4]
          );
        }
        break;
      }
      case "z":
        target.closePath(Numerical.EPSILON);
        current = start;
        break;
    }
    previous = lower;
  }
}
export {
  parsePathData
};
