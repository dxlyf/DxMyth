import { Point } from "../basic/Point.js";
import { Numerical } from "../util/Numerical.js";
import { findBoundsCollisions, findCurveBoundsCollisions } from "../util/CollisionDetection.js";
import { Curve } from "./Curve.js";
import { CurveLocation } from "./CurveLocation.js";
import { Segment } from "./Segment.js";
import { PathItem } from "./PathItem.js";
const operators = {
  unite: (inside1, inside2) => inside1 || inside2,
  intersect: (inside1, inside2) => inside1 && inside2,
  subtract: (inside1, inside2) => inside1 && !inside2,
  exclude: (inside1, inside2) => inside1 !== inside2
};
const min = Math.min, max = Math.max, abs = Math.abs;
function createPath(segments = [], closed = false) {
  const create = PathItem._createPath;
  if (!create)
    throw new Error("Path 尚未注册：请从包入口导入，或先加载 ./path/Path");
  return create(segments, closed);
}
function createCompoundPath(children) {
  const create = PathItem._createCompoundPath;
  if (!create)
    throw new Error("CompoundPath 尚未注册：请从包入口导入，或先加载 ./path/CompoundPath");
  return create(children);
}
function cloneItem(item) {
  return item.clone();
}
function getPaths(item) {
  const children = item._children;
  return children || [item];
}
function isCompound(item) {
  return !!item._children;
}
function preparePath(item, close) {
  const res = reducePath(cloneItem(item));
  return close ? closePaths(res) : res;
}
function reducePath(item) {
  if (isCompound(item)) {
    const children = item.children.filter((child) => !child.isEmpty());
    if (children.length === 1)
      return children[0];
    item.children = children;
    return item;
  }
  return item;
}
function closePaths(item) {
  const paths = getPaths(item);
  for (let i = 0, l = paths.length; i < l; i++) {
    const path = paths[i];
    if (!path._closed && !path.isEmpty()) {
      const count = path._segments.length;
      path.closePath(Numerical.EPSILON);
      if (path._segments.length === count) {
        path.firstSegment.handleIn = new Point(0, 0);
        path.lastSegment.handleOut = new Point(0, 0);
      }
    }
  }
  return item;
}
function createResult(paths, simplify) {
  const result = createCompoundPath(paths);
  return simplify ? reducePath(result) : result;
}
function filterIntersection(inter) {
  return inter.hasOverlap() || inter.isCrossing();
}
function traceBoolean(path1, path2, operation, options) {
  operation = operation || "unite";
  if (options && (options.trace == false || options.stroke) && /^(subtract|intersect)$/.test(operation))
    return splitBoolean(path1, path2, operation);
  let paths;
  if (operation === "exclude" && Array.isArray(path2) && path2.length > 1) {
    let result = path1;
    for (let i = 0, l = path2.length; i < l; i++)
      result = traceBoolean(result, path2[i], "exclude", options);
    return result;
  }
  paths = tracePaths(
    getOperands(
      path1,
      combinePaths(path2, operation)
    ),
    operators[operation]
  );
  return createResult(paths, true);
}
function combinePaths(paths, operation) {
  const isUnite = operation === "unite" || operation === "subtract";
  function combine(entries2) {
    if (entries2.length > 1) {
      if (isUnite) {
        let bounds = entries2[0].bounds;
        for (let i = 1, l = entries2.length; i < l; i++)
          bounds = bounds.unite(entries2[i].bounds);
        const key = bounds.width > bounds.height ? "x" : "y";
        entries2.sort((entry1, entry2) => entry1.center[key] - entry2.center[key]);
      }
      const middle = entries2.length >> 1;
      return traceBoolean(
        combine(entries2.slice(0, middle)),
        combine(entries2.slice(middle)),
        isUnite ? "unite" : operation
      );
    }
    return entries2[0].path;
  }
  const list = paths ? [].concat(paths) : [];
  const entries = list.map((path) => {
    const bounds = path._getBounds();
    return { path, bounds, center: bounds.center };
  });
  return entries.length ? combine(entries) : null;
}
function splitBoolean(path1, path2, operation, options) {
  const other = combinePaths(path2, operation), _path1 = preparePath(path1), _path2 = other ? preparePath(other) : null, crossings = _path2 ? _path1.getIntersections(_path2, filterIntersection) : [], subtract = operation === "subtract", divide = operation === "divide", pieces = [], paths = [];
  for (let i = crossings.length - 1; i >= 0; i--) {
    const crossing = crossings[i], split = crossing.path, path = crossing.split();
    if (path && split) {
      path.firstSegment.handleIn = new Point(0, 0);
      split.lastSegment.handleOut = new Point(0, 0);
      if (pieces.indexOf(path) === -1)
        pieces.push(path);
    }
  }
  const children = getPaths(_path1);
  for (let i = 0, l = children.length; i < l; i++) {
    if (pieces.indexOf(children[i]) === -1)
      pieces.push(children[i]);
  }
  for (let i = 0, l = pieces.length; i < l; i++) {
    const piece = pieces[i];
    if (divide || !_path2 || _path2.contains(
      piece.getPointAt(piece.length / 2)
    ) !== subtract)
      paths.unshift(piece);
  }
  return createResult(paths, false);
}
function getRayWinding(point, v) {
  let winding = 0;
  const x = point.x, y = point.y;
  if (y >= min(v[1], v[3], v[5], v[7]) && y <= max(v[1], v[3], v[5], v[7]) && x < max(v[0], v[2], v[4], v[6])) {
    const monoCurves = Curve.getMonoCurves(v), roots = [];
    for (let i = 0, l = monoCurves.length; i < l; i++) {
      const mv = monoCurves[i], y0 = mv[1], y3 = mv[7], dir = y0 < y3 ? 1 : y0 > y3 ? -1 : 0;
      if (dir && y >= min(y0, y3) && y < max(y0, y3)) {
        const px = Curve.solveCubic(mv, 1, y, roots, 0, 1) > 0 ? Curve.getPoint(mv, roots[0]).x : abs(y - y0) < abs(y - y3) ? mv[0] : mv[6];
        if (px > x)
          winding += dir;
      }
    }
  }
  return winding;
}
function reorientPaths(paths, isInside, clockwise) {
  const length = paths.length;
  if (length) {
    const lookup = /* @__PURE__ */ new Map();
    const list = paths.filter((path) => !!path);
    for (let i = 0, l = list.length; i < l; i++) {
      const path = list[i];
      lookup.set(path, {
        container: null,
        winding: path.isClockwise() ? 1 : -1,
        index: paths.indexOf(path)
      });
    }
    const sorted = list.slice().sort((a, b) => abs(b.getArea()) - abs(a.getArea())), first = sorted[0], bounds = sorted.map((path) => {
      const rect = path._getBounds();
      return [rect.left, rect.top, rect.right, rect.bottom];
    }), collisions = findBoundsCollisions(
      bounds,
      bounds,
      Numerical.GEOMETRIC_EPSILON
    );
    if (clockwise == null)
      clockwise = first.isClockwise();
    for (let i = 0, l = sorted.length; i < l; i++) {
      const path1 = sorted[i], entry1 = lookup.get(path1), collisionsForI = collisions[i];
      let containerWinding = 0;
      if (collisionsForI) {
        let point = null;
        for (let j = collisionsForI.length - 1; j >= 0; j--) {
          if (collisionsForI[j] < i) {
            point = point || path1.getInteriorPoint();
            const path2 = sorted[collisionsForI[j]];
            const curves = path2.curves;
            let winding = 0;
            for (let k = 0, n = curves.length; k < n; k++)
              winding += getRayWinding(
                point,
                curves[k].getValues()
              );
            if (winding) {
              const entry2 = lookup.get(path2);
              containerWinding = entry2.winding;
              entry1.winding += containerWinding;
              entry1.container = entry2.exclude ? entry2.container : path2;
              break;
            }
          }
        }
      }
      if (isInside(entry1.winding) === isInside(containerWinding)) {
        entry1.exclude = true;
        paths[entry1.index] = null;
      } else {
        const container = entry1.container;
        path1.setClockwise(
          container ? !container.isClockwise() : clockwise
        );
      }
    }
  }
  return paths;
}
function getWinding(point, curves, dir, dontFlip) {
  const ia = dir ? 1 : 0, io = ia ^ 1, pv = [point.x, point.y], pa = pv[ia], po = pv[io], windingEpsilon = 1e-9, paL = pa - windingEpsilon, paR = pa + windingEpsilon;
  let windingL = 0, windingR = 0, pathWindingL = 0, pathWindingR = 0, onPath = false, onAnyPath = false;
  const roots = [];
  let vPrev = null, vClose = null;
  function addWinding(v) {
    const o0 = v[io + 0], o3 = v[io + 6];
    if (po < min(o0, o3) || po > max(o0, o3)) {
      return;
    }
    const a0 = v[ia + 0], a1 = v[ia + 2], a2 = v[ia + 4], a3 = v[ia + 6];
    if (o0 === o3) {
      if (a0 < paR && a3 > paL || a3 < paR && a0 > paL) {
        onPath = true;
      }
      return;
    }
    const t = po === o0 ? 0 : po === o3 ? 1 : paL > max(a0, a1, a2, a3) || paR < min(a0, a1, a2, a3) ? 1 : Curve.solveCubic(v, io, po, roots, 0, 1) > 0 ? roots[0] : 1, a = t === 0 ? a0 : t === 1 ? a3 : Curve.getPoint(v, t)[dir ? "y" : "x"], winding = o0 > o3 ? 1 : -1, windingPrev = vPrev[io] > vPrev[io + 6] ? 1 : -1, a3Prev = vPrev[ia + 6];
    if (po !== o0) {
      if (a < paL) {
        pathWindingL += winding;
      } else if (a > paR) {
        pathWindingR += winding;
      } else {
        onPath = true;
      }
    } else {
      if (winding !== windingPrev) {
        if (a0 < paL) {
          pathWindingL += winding;
        } else if (a0 > paR) {
          pathWindingR += winding;
        }
      } else if (a0 != a3Prev) {
        if (a3Prev < paR && a > paR) {
          pathWindingR += winding;
          onPath = true;
        } else if (a3Prev > paL && a < paL) {
          pathWindingL += winding;
          onPath = true;
        }
      }
    }
    vPrev = v;
    return !dontFlip && a > paL && a < paR && Curve.getTangent(v, t)[dir ? "x" : "y"] === 0 && getWinding(point, curves, !dir, true);
  }
  function handleCurve(v) {
    const o0 = v[io + 0], o1 = v[io + 2], o2 = v[io + 4], o3 = v[io + 6];
    if (po <= max(o0, o1, o2, o3) && po >= min(o0, o1, o2, o3)) {
      const a0 = v[ia + 0], a1 = v[ia + 2], a2 = v[ia + 4], a3 = v[ia + 6], monoCurves = paL > max(a0, a1, a2, a3) || paR < min(a0, a1, a2, a3) ? [v] : Curve.getMonoCurves(v, dir);
      for (let i = 0, l = monoCurves.length; i < l; i++) {
        const res = addWinding(monoCurves[i]);
        if (res)
          return res;
      }
    }
  }
  for (let i = 0, l = curves.length; i < l; i++) {
    const curve = curves[i], path = curve._path, v = curve.getValues();
    let res;
    if (!i || curves[i - 1]._path !== path) {
      vPrev = null;
      if (!path._closed) {
        vClose = Curve.getValues(
          path.lastCurve.segment2,
          curve.segment1,
          null,
          true
        );
        if (vClose[io] !== vClose[io + 6]) {
          vPrev = vClose;
        }
      }
      if (!vPrev) {
        vPrev = v;
        let prev = path.lastCurve;
        while (prev && prev !== curve) {
          const v2 = prev.getValues();
          if (v2[io] !== v2[io + 6]) {
            vPrev = v2;
            break;
          }
          prev = prev.previous;
        }
      }
    }
    if (res = handleCurve(v))
      return res;
    if (i + 1 === l || curves[i + 1]._path !== path) {
      if (vClose && (res = handleCurve(vClose)))
        return res;
      if (onPath && !pathWindingL && !pathWindingR) {
        pathWindingL = pathWindingR = path.isClockwise() !== dir ? 1 : -1;
      }
      windingL += pathWindingL;
      windingR += pathWindingR;
      pathWindingL = pathWindingR = 0;
      if (onPath) {
        onAnyPath = true;
        onPath = false;
      }
      vClose = null;
    }
  }
  windingL = abs(windingL);
  windingR = abs(windingR);
  return {
    winding: max(windingL, windingR),
    windingL,
    windingR,
    onPath: onAnyPath
  };
}
function getPart(v, hasHandles, time1, time2, point1, point2) {
  let part;
  if (hasHandles) {
    part = Curve.getPart(v, time1, time2).slice();
    const dx1 = point1.x - part[0], dy1 = point1.y - part[1], dx2 = point2.x - part[6], dy2 = point2.y - part[7];
    part[0] += dx1;
    part[1] += dy1;
    part[2] += dx1;
    part[3] += dy1;
    part[4] += dx2;
    part[5] += dy2;
    part[6] += dx2;
    part[7] += dy2;
  } else {
    part = [
      point1.x,
      point1.y,
      point1.x,
      point1.y,
      point2.x,
      point2.y,
      point2.x,
      point2.y
    ];
  }
  return part;
}
function createGraph(operands) {
  const curves = [], curveOperands = [], offsets = /* @__PURE__ */ new Map(), nonZeros = [];
  let bounds = null;
  for (let i = 0, l = operands.length; i < l; i++) {
    const operand = operands[i], paths = getPaths(operand);
    nonZeros.push(true);
    const operandBounds = operand._getBounds();
    bounds = bounds ? bounds.unite(operandBounds) : operandBounds;
    for (let j = 0, k = paths.length; j < k; j++) {
      const pathCurves = paths[j].curves;
      offsets.set(paths[j], curves.length);
      for (let m = 0, n = pathCurves.length; m < n; m++) {
        curves.push(pathCurves[m]);
        curveOperands.push(i);
      }
    }
  }
  const graphBounds = bounds, epsilon = Numerical.getEpsilon(
    max(
      abs(graphBounds.left),
      abs(graphBounds.right),
      abs(graphBounds.top),
      abs(graphBounds.bottom)
    ),
    graphBounds.topLeft.getDistance(graphBounds.bottomRight) * Numerical.GEOMETRIC_EPSILON
  ), values = [], cuts = [], xs = [], ys = [], isEnds = [];
  function addCut(index, time, point, isEnd) {
    cuts[index].push({ time, point: xs.length });
    xs.push(point.x);
    ys.push(point.y);
    isEnds.push(isEnd);
  }
  for (let i = 0, l = curves.length; i < l; i++) {
    const curve = curves[i];
    values.push(curve.getValues());
    cuts.push([]);
    addCut(i, 0, curve._segment1._point, true);
    addCut(i, 1, curve._segment2._point, true);
  }
  const collisions = findCurveBoundsCollisions(values, values, 2 * epsilon), locations = CurveLocation.expand(Curve.getIntersections(
    curves,
    null,
    null,
    null,
    null,
    false,
    epsilon,
    collisions
  ));
  for (let i = 0, l = locations.length; i < l; i++) {
    const loc = locations[i], curve = loc.curve;
    addCut(
      offsets.get(curve._path) + curve.index,
      loc.time,
      loc.point,
      false
    );
  }
  for (let i = 0, l = curves.length; i < l; i++) {
    const times = Curve.getReversals(values[i], epsilon);
    for (let j = 0, k = times.length; j < k; j++) {
      addCut(i, times[j], Curve.getPoint(values[i], times[j]), false);
    }
  }
  const count = xs.length, parents = new Array(count), order = new Array(count);
  for (let i = 0; i < count; i++)
    parents[i] = order[i] = i;
  function getRoot(i) {
    while (parents[i] !== i)
      i = parents[i] = parents[parents[i]];
    return i;
  }
  order.sort((a, b) => xs[a] - xs[b]);
  for (let i = 0; i < count; i++) {
    const a = order[i];
    for (let j = i + 1; j < count && xs[order[j]] - xs[a] <= epsilon; j++) {
      const b = order[j], dx = xs[b] - xs[a], dy = ys[b] - ys[a];
      if (dx * dx + dy * dy <= epsilon * epsilon)
        parents[getRoot(a)] = getRoot(b);
    }
  }
  let vertexIndices = {}, vertices = [];
  function createVertices() {
    vertexIndices = {};
    vertices = [];
    for (let i = 0; i < count; i++) {
      const root = getRoot(i);
      let index = vertexIndices[root];
      if (index === void 0) {
        index = vertexIndices[root] = vertices.length;
        vertices.push({
          x: xs[i],
          y: ys[i],
          isEnd: isEnds[i],
          point: i,
          outgoing: []
        });
      } else if (isEnds[i] && !vertices[index].isEnd) {
        vertices[index] = {
          x: xs[i],
          y: ys[i],
          isEnd: true,
          point: i,
          outgoing: []
        };
      }
    }
  }
  createVertices();
  function getVertex(point) {
    return vertexIndices[getRoot(point)];
  }
  function getPiece(i, cut1, cut2) {
    return getPart(
      values[i],
      curves[i].hasHandles(),
      cut1.time,
      cut2.time,
      vertices[getVertex(cut1.point)],
      vertices[getVertex(cut2.point)]
    );
  }
  function sortCuts(list) {
    return list.sort((a, b) => a.time - b.time);
  }
  let marks;
  function getHotPixels(i) {
    const v = values[i], left = min(v[0], v[2], v[4], v[6]) - 2 * epsilon, top = min(v[1], v[3], v[5], v[7]) - 2 * epsilon, right = max(v[0], v[2], v[4], v[6]) + 2 * epsilon, bottom = max(v[1], v[3], v[5], v[7]) + 2 * epsilon, indices = collisions[i], hotPixels = [];
    for (let j = 0, k = indices.length; j < k; j++) {
      const list = cuts[indices[j]];
      for (let m = 0, n = list.length; m < n; m++) {
        const index = getVertex(list[m].point);
        if (marks[index] !== i) {
          const vertex = vertices[index];
          marks[index] = i;
          if (vertex.x >= left && vertex.x <= right && vertex.y >= top && vertex.y <= bottom)
            hotPixels.push(index);
        }
      }
    }
    return hotPixels.sort((a, b) => a - b);
  }
  function isNearPiece(piece, index, vertex) {
    const v = piece.values, x = vertex.x, y = vertex.y;
    return getVertex(piece.cut1.point) !== index && getVertex(piece.cut2.point) !== index && x >= min(v[0], v[2], v[4], v[6]) - epsilon && x <= max(v[0], v[2], v[4], v[6]) + epsilon && y >= min(v[1], v[3], v[5], v[7]) - epsilon && y <= max(v[1], v[3], v[5], v[7]) + epsilon;
  }
  function addPiece(pieces, i, cut1, cut2) {
    pieces.push({
      values: getPiece(i, cut1, cut2),
      cut1,
      cut2
    });
  }
  function cutAtHotPixels(i) {
    const candidates = getHotPixels(i);
    if (candidates.length) {
      const list = sortCuts(cuts[i]), pieces = [];
      for (let j = 1, k = list.length; j < k; j++)
        addPiece(pieces, i, list[j - 1], list[j]);
      while (pieces.length) {
        const piece = pieces.pop();
        for (let j = 0, k = candidates.length; j < k; j++) {
          const index = candidates[j], vertex = vertices[index];
          if (isNearPiece(piece, index, vertex)) {
            const point = new Point(vertex.x, vertex.y), t = Curve.getNearestTime(piece.values, point);
            if (t > 0 && t < 1 && point.isClose(
              Curve.getPoint(piece.values, t),
              epsilon
            )) {
              const cut1 = piece.cut1, cut2 = piece.cut2, cut = {
                time: curves[i].hasHandles() ? cut1.time + (cut2.time - cut1.time) * t : Curve.getNearestTime(values[i], point),
                point: vertex.point
              };
              cuts[i].push(cut);
              addPiece(pieces, i, cut1, cut);
              addPiece(pieces, i, cut, cut2);
              break;
            }
          }
        }
      }
    }
  }
  function mergeShortPieces() {
    const pieces = [];
    let isMerged = false;
    for (let i = 0, l = curves.length; i < l; i++) {
      const list = sortCuts(cuts[i]);
      for (let j = 1, k = list.length; j < k; j++) {
        const cut1 = list[j - 1], cut2 = list[j];
        if (getVertex(cut1.point) !== getVertex(cut2.point) && Curve.getLength(getPiece(i, cut1, cut2)) < 4 * epsilon)
          pieces.push([cut1.point, cut2.point]);
      }
    }
    for (let i = 0, l = pieces.length; i < l; i++) {
      const root1 = getRoot(pieces[i][0]), root2 = getRoot(pieces[i][1]);
      if (root1 !== root2) {
        parents[root1] = root2;
        isMerged = true;
      }
    }
    if (isMerged)
      createVertices();
    return isMerged;
  }
  do {
    marks = new Array(vertices.length);
    for (let i = 0, l = curves.length; i < l; i++)
      cutAtHotPixels(i);
  } while (mergeShortPieces());
  const edges = [], edgesByVertex = [];
  function getCoincidence(edge1, edge2) {
    const v1 = edge1.values, v2 = edge2.values, times = [];
    for (let i = 1; i <= 3; i++) {
      const point = Curve.getPoint(v2, i / 4), time = Curve.getNearestTime(v1, point);
      if (!point.isClose(Curve.getPoint(v1, time), epsilon))
        return 0;
      times.push(time);
    }
    return times[0] < times[2] ? 1 : -1;
  }
  function addEdge(edge) {
    const first = min(edge.from, edge.to), last = max(edge.from, edge.to), list = edgesByVertex[first] || (edgesByVertex[first] = []);
    for (let i = 0, l = list.length; i < l; i++) {
      const other = list[i], direction = max(other.from, other.to) === last && getCoincidence(other, edge);
      if (direction) {
        for (let j = 0; j < 2; j++)
          other.windings[j] += direction * edge.windings[j];
        return;
      }
    }
    list.push(edge);
    edges.push(edge);
  }
  for (let i = 0, l = curves.length; i < l; i++) {
    const list = cuts[i], isStraight = !curves[i].hasHandles();
    let prev = list[0];
    for (let j = 1, k = list.length; j < k; j++) {
      const cut = list[j], from = getVertex(prev.point), to = getVertex(cut.point), part = getPiece(i, prev, cut);
      if (from !== to || Curve.getLength(part) >= 4 * epsilon) {
        const windings = [0, 0];
        windings[curveOperands[i]] = 1;
        addEdge({
          values: part,
          from,
          to,
          isStraight,
          windings,
          curve: i,
          time1: prev.time,
          time2: cut.time
        });
      }
      prev = cut;
    }
  }
  const halfEdges = [];
  function getPointAt(halfEdge, distance) {
    const v = halfEdge.values, edge = halfEdge.edge, t = distance / edge.length;
    return edge.isStraight ? new Point(
      v[0] + (v[6] - v[0]) * t,
      v[1] + (v[7] - v[1]) * t
    ) : Curve.getPoint(v, Curve.getTimeAt(v, distance));
  }
  function getSide(halfEdge1, halfEdge2) {
    const v1 = halfEdge1.values, point = getPointAt(halfEdge2, min(
      halfEdge1.edge.length,
      halfEdge2.edge.length
    ) / 2), time = Curve.getNearestTime(v1, point);
    return time > 0 && time < 1 ? Curve.getTangent(v1, time).cross(
      point.subtract(Curve.getPoint(v1, time))
    ) > 0 ? -1 : 1 : 0;
  }
  function getDirections(v) {
    const angles = [];
    for (let i = 0; i < 6; i += 2) {
      const dx = v[i + 2] - v[i], dy = v[i + 3] - v[i + 1];
      if (dx || dy)
        angles.push(Math.atan2(dy, dx));
    }
    const first = angles[0];
    let from = 0, to = 0;
    for (let i = 1, l = angles.length; i < l; i++) {
      const difference = (angles[i] - first + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
      from = min(from, difference);
      to = max(to, difference);
    }
    return to - from < Math.PI ? {
      start: (first + from + 2 * Math.PI) % (2 * Math.PI),
      width: to - from
    } : null;
  }
  function sortByDirections(outgoing) {
    let distance = Infinity;
    for (let j = 0, k = outgoing.length; j < k; j++) {
      const halfEdge = halfEdges[outgoing[j]], v = halfEdge.values;
      halfEdge.directions = getDirections(v);
      if (!halfEdge.directions)
        return false;
      distance = min(
        distance,
        Math.sqrt((v[6] - v[0]) * (v[6] - v[0]) + (v[7] - v[1]) * (v[7] - v[1])) / 2
      );
    }
    const sorted = outgoing.slice().sort((a, b) => halfEdges[a].directions.start - halfEdges[b].directions.start);
    let gap = Infinity, width = 0;
    for (let j = 0, k = sorted.length; j < k; j++) {
      const directions1 = halfEdges[sorted[j]].directions, directions2 = halfEdges[sorted[(j + 1) % k]].directions;
      gap = min(gap, directions2.start - directions1.start - directions1.width + (j + 1 < k ? 0 : 2 * Math.PI));
      width = max(width, directions1.width);
    }
    if (gap > 0 && distance * Math.cos(width / 2) * Math.sin(min(gap, Math.PI / 2)) > 2 * epsilon) {
      for (let j = 0, k = sorted.length; j < k; j++)
        outgoing[j] = sorted[j];
      return true;
    }
    return false;
  }
  for (let i = 0, l = edges.length; i < l; i++) {
    const edge = edges[i], v = edge.values;
    edge.reversed = [v[6], v[7], v[4], v[5], v[2], v[3], v[0], v[1]];
    halfEdges.push(
      { edge, values: v, from: edge.from, to: edge.to },
      {
        edge,
        values: edge.reversed,
        from: edge.to,
        to: edge.from
      }
    );
    vertices[edge.from].outgoing.push(2 * i);
    vertices[edge.to].outgoing.push(2 * i + 1);
  }
  for (let i = 0, l = vertices.length; i < l; i++) {
    const vertex = vertices[i], outgoing = vertex.outgoing;
    if (outgoing.length > 2 && !sortByDirections(outgoing)) {
      let distance = Infinity;
      for (let j = 0, k = outgoing.length; j < k; j++) {
        const edge = halfEdges[outgoing[j]].edge;
        edge.length = edge.length || Curve.getLength(edge.values);
        distance = min(distance, edge.length / 2);
      }
      for (let j = 0, k = outgoing.length; j < k; j++) {
        const halfEdge = halfEdges[outgoing[j]], point = getPointAt(halfEdge, distance);
        halfEdge.point = point;
        halfEdge.angle = Math.atan2(
          point.y - vertex.y,
          point.x - vertex.x
        );
      }
      outgoing.sort((a, b) => halfEdges[a].angle - halfEdges[b].angle);
      let start = -Math.PI, gap = 0;
      for (let j = 0, k = outgoing.length; j < k; j++) {
        const angle = halfEdges[outgoing[j]].angle, previous = halfEdges[outgoing[(j || k) - 1]].angle, difference = (angle - previous + 2 * Math.PI) % (2 * Math.PI) || 2 * Math.PI;
        if (difference > gap) {
          gap = difference;
          start = angle;
        }
      }
      for (let j = 0, k = outgoing.length; j < k; j++) {
        const halfEdge = halfEdges[outgoing[j]];
        halfEdge.angle = (halfEdge.angle - start + 2 * Math.PI) % (2 * Math.PI);
      }
      outgoing.sort((a, b) => {
        const halfEdge1 = halfEdges[a], halfEdge2 = halfEdges[b];
        return halfEdge1.point.isClose(halfEdge2.point, epsilon) && getSide(halfEdge1, halfEdge2) || halfEdge1.angle - halfEdge2.angle;
      });
    }
    for (let j = 0, k = outgoing.length; j < k; j++)
      halfEdges[outgoing[j]].position = j;
  }
  for (let i = 0, l = halfEdges.length; i < l; i++) {
    const outgoing = vertices[halfEdges[i].to].outgoing, position = halfEdges[i ^ 1].position;
    halfEdges[i].next = outgoing[(position || outgoing.length) - 1];
  }
  const faces = [];
  for (let i = 0, l = halfEdges.length; i < l; i++) {
    if (halfEdges[i].face === void 0) {
      const face = {
        halfEdges: [],
        area: 0,
        windings: null,
        component: null
      };
      let index = i;
      do {
        const halfEdge = halfEdges[index];
        halfEdge.face = face;
        face.halfEdges.push(index);
        face.area += Curve.getArea(halfEdge.values);
        index = halfEdge.next;
      } while (index !== i);
      faces.push(face);
    }
  }
  const components = [], rays = [], boundsList = [];
  for (let i = 0, l = faces.length; i < l; i++) {
    const face = faces[i];
    if (!face.component) {
      const component = {
        edges: [],
        bounds: [Infinity, Infinity, -Infinity, -Infinity],
        outside: face
      }, list = [face];
      face.component = component;
      for (let j = 0; j < list.length; j++) {
        const indices = list[j].halfEdges;
        if (list[j].area < component.outside.area)
          component.outside = list[j];
        for (let k = 0, n = indices.length; k < n; k++) {
          const other = halfEdges[indices[k] ^ 1].face;
          if (!other.component) {
            other.component = component;
            list.push(other);
          }
        }
      }
      const vertex = vertices[halfEdges[component.outside.halfEdges[0]].from];
      components.push(component);
      rays.push([vertex.x, vertex.y, Infinity, vertex.y]);
      boundsList.push(component.bounds);
    }
  }
  for (let i = 0, l = edges.length; i < l; i++) {
    const edge = edges[i], v = edge.values, component = halfEdges[2 * i].face.component, b = component.bounds;
    component.edges.push(edge);
    b[0] = min(b[0], v[0], v[2], v[4], v[6]);
    b[1] = min(b[1], v[1], v[3], v[5], v[7]);
    b[2] = max(b[2], v[0], v[2], v[4], v[6]);
    b[3] = max(b[3], v[1], v[3], v[5], v[7]);
  }
  const rayCollisions = findBoundsCollisions(rays, boundsList, 0, true);
  for (let i = 0, l = components.length; i < l; i++) {
    const outside = components[i].outside, point = new Point(rays[i][0], rays[i][1]), indices = rayCollisions[i], windings = [0, 0];
    for (let j = 0, k = indices.length; j < k; j++) {
      if (indices[j] !== i) {
        const list = components[indices[j]].edges;
        for (let m = 0, n = list.length; m < n; m++) {
          const edge = list[m], winding = getRayWinding(point, edge.values);
          windings[0] += winding * edge.windings[0];
          windings[1] += winding * edge.windings[1];
        }
      }
    }
    outside.windings = windings;
    const queue = [outside];
    for (let j = 0; j < queue.length; j++) {
      const face = queue[j], indices2 = face.halfEdges;
      for (let k = 0, n = indices2.length; k < n; k++) {
        const index = indices2[k], other = halfEdges[index ^ 1].face;
        if (!other.windings) {
          const edgeWindings = halfEdges[index].edge.windings, sign = index & 1 ? -1 : 1;
          other.windings = [
            face.windings[0] - sign * edgeWindings[0],
            face.windings[1] - sign * edgeWindings[1]
          ];
          queue.push(other);
        }
      }
    }
  }
  return {
    curves,
    values,
    vertices,
    edges,
    halfEdges,
    faces,
    nonZeros,
    epsilon
  };
}
function tracePaths(operands, operator) {
  const graph = createGraph(operands), halfEdges = graph.halfEdges, faces = graph.faces, nonZeros = graph.nonZeros;
  for (let i = 0, l = faces.length; i < l; i++) {
    const face = faces[i], windings = face.windings;
    face.isInside = !!operator(
      nonZeros[0] ? !!windings[0] : !!(windings[0] & 1),
      nonZeros[1] ? !!windings[1] : !!(windings[1] & 1)
    );
  }
  function isBoundary(index) {
    return halfEdges[index].face.isInside && !halfEdges[index ^ 1].face.isInside;
  }
  function getTimes(index) {
    const edge = halfEdges[index].edge;
    return index & 1 ? [edge.time2, edge.time1] : [edge.time1, edge.time2];
  }
  function isContinued(index, next) {
    return halfEdges[index].edge.curve === halfEdges[next].edge.curve && getTimes(index)[1] === getTimes(next)[0];
  }
  const paths = [], isVisited = [];
  for (let i = 0, l = halfEdges.length; i < l; i++) {
    if (!isVisited[i] && isBoundary(i)) {
      const contour = [];
      let index = i;
      do {
        isVisited[index] = true;
        contour.push(index);
        index = halfEdges[index].next;
        while (!isBoundary(index))
          index = halfEdges[index ^ 1].next;
      } while (index !== i);
      const length = contour.length;
      let start = 0;
      while (start < length && isContinued(
        contour[(start || length) - 1],
        contour[start]
      ))
        start++;
      const segments = [];
      let handleIn = null;
      for (let j = 0; j < length; ) {
        const first = contour[(start + j) % length];
        let last = first;
        while (++j < length && isContinued(
          last,
          contour[(start + j) % length]
        ))
          last = contour[(start + j) % length];
        const edge = halfEdges[first].edge, isStraight = edge.isStraight, v = first === last ? halfEdges[first].values : getPart(
          graph.values[edge.curve],
          !isStraight,
          getTimes(first)[0],
          getTimes(last)[1],
          graph.vertices[halfEdges[first].from],
          graph.vertices[halfEdges[last].to]
        );
        segments.push(new Segment(
          new Point(v[0], v[1]),
          handleIn || void 0,
          isStraight ? void 0 : new Point(v[2] - v[0], v[3] - v[1])
        ));
        handleIn = isStraight ? null : new Point(v[4] - v[6], v[5] - v[7]);
      }
      if (handleIn)
        segments[0].handleIn = handleIn;
      const path = createPath(segments, true);
      if (path.getArea() !== 0)
        paths.push(path);
    }
  }
  return paths;
}
function getOperands(path1, path2) {
  const operands = [preparePath(path1, true)];
  if (path2)
    operands.push(preparePath(path2, true));
  return operands;
}
function divideBoolean(path1, path2, options) {
  return options && (options.trace == false || options.stroke) ? splitBoolean(path1, path2, "divide") : createResult([
    traceBoolean(path1, path2, "subtract", options),
    traceBoolean(path1, path2, "intersect", options)
  ], true);
}
function resolveCrossings(item) {
  const paths = tracePaths(
    [closePaths(cloneItem(item))],
    (inside) => !!inside
  );
  const result = createResult(paths, true);
  if (result === item)
    return item;
  if (isCompound(item) && result instanceof Object && result._children) {
    item.children = result.children;
    return item;
  }
  if (!isCompound(item) && !result._children) {
    item.segments = result.segments;
    item.closed = result.closed;
    return item;
  }
  return result;
}
function reorient(item, nonZero, clockwise) {
  if (isCompound(item) && item.children.length) {
    const paths = reorientPaths(
      item.removeChildren(),
      (w) => !!(nonZero ? w : w & 1),
      clockwise
    );
    item.children = paths.filter((path) => !!path);
  } else if (clockwise !== void 0) {
    item.setClockwise(clockwise);
  }
  return item;
}
function getInteriorPoint(item) {
  const bounds = item._getBounds(), point = bounds.center;
  const nearest = item.getNearestPoint(point);
  if (!item.contains(point) || nearest && nearest.isClose(point, Numerical.GEOMETRIC_EPSILON)) {
    const curves = item.curves, monoCurves = [], ys = [], intercepts = [], roots = [];
    for (let i = 0, l = curves.length; i < l; i++)
      monoCurves.push(...Curve.getMonoCurves(curves[i].getValues()));
    for (let i = 0, l = monoCurves.length; i < l; i++)
      ys.push(monoCurves[i][1], monoCurves[i][7]);
    ys.sort((a, b) => a - b);
    let y = point.y, below = y, above = y;
    for (let i = 0, l = ys.length; i < l && above === y; i++) {
      if (ys[i] <= y) {
        below = ys[i];
      } else {
        above = ys[i];
      }
    }
    y = point.y = (below + above) / 2;
    for (let i = 0, l = monoCurves.length; i < l; i++) {
      const mv = monoCurves[i], mo0 = mv[1], mo3 = mv[7];
      if (y > min(mo0, mo3) && y < max(mo0, mo3)) {
        intercepts.push(
          Curve.solveCubic(mv, 1, y, roots, 0, 1) === 1 ? Curve.getPoint(mv, roots[0]).x : (mv[0] + mv[6]) / 2
        );
      }
    }
    if (intercepts.length > 1) {
      intercepts.sort((a, b) => a - b);
      point.x = (intercepts[0] + intercepts[1]) / 2;
    }
  }
  return point;
}
export {
  divideBoolean,
  getInteriorPoint,
  getPaths,
  getWinding,
  reducePath,
  reorient,
  resolveCrossings,
  traceBoolean
};
