import { Vector2 } from "../../Vector2.js";
import { findIndexRight } from "../../MathUtils.js";
import { StrokeLineCapProjections } from "./StrokeLineCapProjections.js";
import { StrokeLineJoinProjections } from "./StrokeLineJoinProjections.js";
const projectStrokeOnPoints = (points, options, openPath = false) => {
  const projections = [];
  if (points.length === 0) {
    return projections;
  }
  const reduced = points.reduce(
    (reduced2, point) => {
      if (!reduced2[reduced2.length - 1].equals(point)) {
        reduced2.push(Vector2.from(point));
      }
      return reduced2;
    },
    [Vector2.from(points[0])]
  );
  if (reduced.length === 1) {
    openPath = true;
  } else if (!openPath) {
    const start = reduced[0];
    const index = findIndexRight(reduced, (point) => !point.equals(start));
    reduced.splice(index + 1);
  }
  reduced.forEach((A, index, points2) => {
    let B, C;
    if (index === 0) {
      C = points2[1];
      B = openPath ? A : points2[points2.length - 1];
    } else if (index === points2.length - 1) {
      B = points2[index - 1];
      C = openPath ? A : points2[0];
    } else {
      B = points2[index - 1];
      C = points2[index + 1];
    }
    if (openPath && points2.length === 1) {
      projections.push(
        ...new StrokeLineCapProjections(A, A, options).project()
      );
    } else if (openPath && (index === 0 || index === points2.length - 1)) {
      projections.push(
        ...new StrokeLineCapProjections(
          A,
          index === 0 ? C : B,
          options
        ).project()
      );
    } else {
      projections.push(
        ...new StrokeLineJoinProjections(A, B, C, options).project()
      );
    }
  });
  return projections;
};
export {
  projectStrokeOnPoints
};
