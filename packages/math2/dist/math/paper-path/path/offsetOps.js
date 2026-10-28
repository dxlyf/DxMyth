import { Point } from "../basic/Point.js";
import { Matrix } from "../basic/Matrix.js";
import { Rectangle } from "../basic/Rectangle.js";
import { Line } from "../basic/Line.js";
import { Numerical } from "../util/Numerical.js";
import { Curve } from "./Curve.js";
import { Segment } from "./Segment.js";
import { reducePath } from "./booleanOps.js";
import { PathItem } from "./PathItem.js";
const abs = Math.abs, clamp = Numerical.clamp, errorThreshold = 0.1, epsilon = Numerical.EPSILON, geomEpsilon = Numerical.GEOMETRIC_EPSILON;
const penSamples = [];
for (let i = 0; i <= 32; i++) {
  const phi = (i + 0.5) * Math.PI / 16;
  penSamples.push({ phi, cos: Math.cos(phi), sin: Math.sin(phi) });
}
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
function getPaths(item) {
  const children = item._children;
  return children || [item];
}
function outlineStroke(paths, radius, join, cap, miterLimit) {
  const tolerance = Math.min(errorThreshold, radius / 100), areas = [];
  function addSides(side1, side2, isStrip) {
    const part = createPath(side1);
    for (let i = side2.length - 1; i >= 0; i--)
      part.add(side2[i].reversed());
    part.closed = true;
    const united = part.unite();
    if (isStrip ? 2 * abs(united.getArea()) > tolerance * united.length : !united.isEmpty())
      areas.push(united);
  }
  function addPart(v) {
    const curvature = Curve.getCurvature(v, 0.5);
    if (abs(curvature) * radius > 1) {
      const inner = curvature > 0 ? -radius : radius, evolute = getEvolute(v, inner, tolerance);
      addSides(getOffsetSegments(v, -inner, tolerance), evolute);
      addSides(getOffsetSegments(v, inner, tolerance), evolute);
    } else {
      addSides(
        getOffsetSegments(v, radius, tolerance),
        getOffsetSegments(v, -radius, tolerance)
      );
    }
  }
  function addSector(point, normal1, normal2, direction) {
    const sector = createPath();
    sector.moveTo(point);
    sector.lineTo(point.add(normal1));
    sector.arcTo(
      point.add(direction.normalize(radius)),
      point.add(normal2)
    );
    sector.closePath();
    areas.push(sector);
  }
  function addPolygon(points) {
    areas.push(createPath(points.map((point) => new Segment(point)), true));
  }
  function addJoin(point, tangent1, tangent2) {
    let normal1 = new Point(tangent1.y, -tangent1.x).multiply(radius), normal2 = new Point(tangent2.y, -tangent2.x).multiply(radius);
    const angle = normal1.getDirectedAngle(normal2);
    if (!Numerical.isZero(tangent1.cross(tangent2)) || tangent1.dot(tangent2) < 0) {
      if (angle < 0) {
        normal1 = normal1.negate();
        normal2 = normal2.negate();
      }
      const widening = Math.sqrt(tolerance / radius) * 180 / Math.PI * (angle < 0 ? -1 : 1), outer1 = normal1.rotate(-widening), outer2 = normal2.rotate(widening);
      let direction = normal1.add(normal2);
      if (direction.length < geomEpsilon * radius)
        direction = tangent1;
      if (join === "round") {
        addSector(point, outer1, outer2, direction);
      } else {
        const length = radius / Math.cos(abs(angle) * Math.PI / 360), points = [point, point.add(outer1), point.add(normal1)];
        if (join === "miter" && length <= miterLimit * radius)
          points.push(point.add(direction.normalize(length)));
        addPolygon(points.concat(
          point.add(normal2),
          point.add(outer2)
        ));
      }
    }
  }
  function addCap(point, tangent) {
    const normal = new Point(-tangent.y, tangent.x).multiply(radius);
    if (cap === "round") {
      addSector(point, normal, normal.negate(), tangent);
    } else if (cap === "square") {
      const ahead = tangent.multiply(radius);
      addPolygon([
        point.add(normal),
        point.add(normal).add(ahead),
        point.subtract(normal).add(ahead),
        point.subtract(normal)
      ]);
    }
  }
  function isSliver(v, t1, t2) {
    return getTurn(v, t1, t2) * radius < tolerance && (abs(Curve.getCurvature(v, (t1 + t2) / 2)) * radius > 1 || Curve.getLength(v, t1, t2) < tolerance);
  }
  function addPath(path) {
    const segments = path._segments, closed = path._closed, curves = path.curves;
    for (let i = 0, l = segments.length; i < l; i++) {
      const segment = segments[i], handleIn = segment._handleIn, handleOut = segment._handleOut;
      if (!handleIn.isZero() && !handleOut.isZero()) {
        const angle = abs(handleOut.getDirectedAngle(
          handleIn.negate()
        )) * Math.PI / 180, lengthIn = handleIn.length, lengthOut = handleOut.length;
        if (angle && angle * Math.max(radius, lengthIn, lengthOut) < tolerance) {
          const direction = handleOut.normalize().subtract(
            handleIn.normalize()
          );
          segment.handleIn = direction.normalize(-lengthIn);
          segment.handleOut = direction.normalize(lengthOut);
        }
      }
    }
    if (!path.length) {
      if (segments.length && !closed && cap !== "butt") {
        const center = segments[0]._point;
        areas.push(cap === "round" ? pathConstructor().Circle(center, radius) : pathConstructor().Rectangle(new Rectangle(
          center.x - radius,
          center.y - radius,
          2 * radius,
          2 * radius
        )));
      }
    } else {
      const ends = [];
      for (let i = 0, l = curves.length; i < l; i++) {
        const curve = curves[i];
        if (curve.hasLength(geomEpsilon)) {
          const v = regularize(curve.getValues(), tolerance / 4), reversals = Curve.getReversals(v, tolerance);
          let start = Curve.getTangent(v, 0), end = Curve.getTangent(v, 1);
          if (reversals.length) {
            const points = [new Point(v[0], v[1])];
            for (let j = 0, m = reversals.length; j < m; j++)
              points.push(Curve.getPoint(v, reversals[j]));
            points.push(new Point(v[6], v[7]));
            start = points[1].subtract(points[0]).normalize();
            end = points[points.length - 1].subtract(
              points[points.length - 2]
            ).normalize();
            for (let j = 1, m = points.length; j < m; j++) {
              const p1 = points[j - 1], p2 = points[j];
              addPart([
                p1.x,
                p1.y,
                p1.x,
                p1.y,
                p2.x,
                p2.y,
                p2.x,
                p2.y
              ]);
              if (j < m - 1) {
                const tangent = p2.subtract(p1).normalize(), normal = new Point(-tangent.y, tangent.x).multiply(radius);
                addSector(p2, normal, normal.negate(), tangent);
                addSector(
                  p2,
                  normal.negate(),
                  normal,
                  tangent.negate()
                );
              }
            }
          } else {
            const times = getCuspTimes(v, radius).concat(1);
            for (let j = 0, t0 = 0, m = times.length; j < m; j++) {
              const t = times[j];
              if (t === 1 || !isSliver(v, t0, t) && !isSliver(v, t, times[j + 1])) {
                addPart(Curve.getPart(v, t0, t));
                t0 = t;
              }
            }
          }
          ends.push({ curve, start, end });
        }
      }
      for (let i = 1, l = ends.length; i <= l; i++) {
        const end1 = ends[i - 1], end2 = ends[i % l];
        if (i < l || closed)
          addJoin(end2.curve._segment1._point, end1.end, end2.start);
      }
      if (!closed && ends.length) {
        const first = ends[0], last = ends[ends.length - 1];
        addCap(first.curve._segment1._point, first.start.negate());
        addCap(last.curve._segment2._point, last.end);
      }
    }
  }
  function addProfilePath(path) {
    const pens = path._getStrokeProfilePens(), getValues = path._getStrokeProfileValues(), closed = path._closed, length = path.length, curves = path.curves, spans = [], ends = [], allParts = [];
    function getPen(offset, after) {
      const values = getValues(offset, after), width = values.width, aspect = values.aspect, angle = values.angle, toRadians = Math.PI / 180, a = radius * width[0];
      return {
        a,
        b: a * aspect[0],
        angle: angle[0] * toRadians,
        da: radius * width[1],
        db: radius * (width[1] * aspect[0] + width[0] * aspect[1]),
        dda: radius * width[2],
        ddb: radius * (width[2] * aspect[0] + 2 * width[1] * aspect[1] + width[0] * aspect[2]),
        dAngle: angle[1] * toRadians,
        ddAngle: angle[2] * toRadians
      };
    }
    function getSpanPen(span, offset) {
      const end = span.next.offset;
      return offset < end ? getPen(Math.max(offset, span.entry.offset), true) : getPen(end, false);
    }
    function getOffset(part, t) {
      return part.offset + part.length * Curve.getLength(part.v, 0, t) / part.curveLength;
    }
    function getTime(part, offset) {
      const start = part.offset;
      return offset <= start ? 0 : offset >= start + part.length ? 1 : Curve.getTimeAt(part.v, (offset - start) * part.curveLength / part.length);
    }
    function getSpan(offset, after) {
      for (let i = 0, l = spans.length; i < l; i++) {
        const span = spans[i];
        if (after ? offset < span.next.offset : offset <= span.next.offset)
          return span;
      }
      return spans[spans.length - 1];
    }
    function addPen(point, pen, strips) {
      function getPoint(phi) {
        return new Point(Math.cos(phi), Math.sin(phi));
      }
      if (pen.a > 0 && pen.b > 0) {
        const full = 2 * Math.PI, angles = [], ellipse = createPath();
        (strips || []).forEach((strip) => {
          [strip.from.phi, strip.to.phi].forEach((phi) => {
            angles.push((phi % full + full) % full);
          });
        });
        angles.sort((a, b) => a - b);
        if (!angles.length)
          angles.push(0);
        angles.push(angles[0] + full);
        ellipse.moveTo(getPoint(angles[0]));
        for (let i = 1, l = angles.length; i < l; i++) {
          const phi0 = angles[i - 1], sweep = angles[i] - phi0, count = Math.ceil(sweep / (Math.PI / 2) - 1e-9), step = sweep / count;
          if (sweep > geomEpsilon) {
            for (let j = 1; j <= count; j++) {
              ellipse.arcTo(
                getPoint(phi0 + (j - 0.5) * step),
                getPoint(phi0 + j * step)
              );
            }
          }
        }
        ellipse.closePath(geomEpsilon);
        ellipse.transform(new Matrix().translate(point.x, point.y).rotate(pen.angle * 180 / Math.PI).scale(pen.a, pen.b));
        areas.push(ellipse);
      }
    }
    function getAxes(pen) {
      const cos = Math.cos(pen.angle), sin = Math.sin(pen.angle);
      return [new Point(cos, sin), new Point(-sin, cos)];
    }
    function getContacts(part, t, span) {
      const v = part.v, pen = getSpanPen(span, getOffset(part, t)), a = pen.a, b = pen.b, da = pen.da, db = pen.db, dAngle = pen.dAngle, contacts = { sides: null, strips: [] };
      if (a > 0) {
        const point = Curve.getPoint(v, t), tangent = Curve.getTangent(v, t), normal = new Point(-tangent.y, tangent.x), curvature = Curve.getCurvature(v, t), axes = getAxes(pen), t1 = tangent.dot(axes[0]), t2 = tangent.dot(axes[1]), dt1 = (dAngle - curvature) * t2, dt2 = (curvature - dAngle) * t1, fcs = (c, s) => {
          return t1 * b * c + t2 * a * s + da * b * c * c + a * db * s * s + dAngle * (a * a - b * b) * s * c;
        }, dfcs = (c, s) => {
          return -t1 * b * s + t2 * a * c + 2 * (a * db - da * b) * s * c + dAngle * (a * a - b * b) * (c * c - s * s);
        }, f = (phi) => fcs(
          Math.cos(phi),
          Math.sin(phi)
        ), df = (phi) => dfcs(
          Math.cos(phi),
          Math.sin(phi)
        );
        let sample = penSamples[0], phi0 = sample.phi, f0 = fcs(sample.cos, sample.sin), d0 = dfcs(sample.cos, sample.sin);
        const roots = [];
        const addRoot = (phi02, phi1, f02, f1) => {
          const phi = Numerical.findSignChange(
            f,
            phi02,
            phi1,
            f02,
            f1,
            epsilon
          ), c = Math.cos(phi), s = Math.sin(phi), dfs = (dt1 * b + t1 * db) * c + (dt2 * a + t2 * da) * s + da * db + pen.dda * b * c * c + a * pen.ddb * s * s + (pen.ddAngle * (a * a - b * b) + 2 * dAngle * (a * da - b * db)) * s * c, dfphi = df(phi), dphi = dfphi ? -dfs / dfphi : 0, side = {
            phi,
            point: point.add(axes[0].multiply(a * c)).add(axes[1].multiply(b * s)),
            derivative: axes[0].multiply(t1 + da * c - (a * dphi + dAngle * b) * s).add(axes[1].multiply(t2 + db * s + (b * dphi + dAngle * a) * c)),
            distance: 0
          };
          side.distance = side.point.subtract(point).dot(normal);
          roots.push(side);
        };
        for (let i = 1, l = penSamples.length; i < l; i++) {
          const sample2 = penSamples[i], phi1 = sample2.phi, f1 = fcs(sample2.cos, sample2.sin), d1 = dfcs(sample2.cos, sample2.sin);
          if (f0 * f1 <= 0 && f0 !== f1) {
            addRoot(phi0, phi1, f0, f1);
          } else if (d0 * d1 < 0) {
            const phi = Numerical.findSignChange(
              df,
              phi0,
              phi1,
              d0,
              d1,
              epsilon
            ), f2 = f(phi);
            if (f2 * f0 < 0) {
              addRoot(phi0, phi, f0, f2);
              addRoot(phi, phi1, f2, f1);
            }
          }
          phi0 = phi1;
          f0 = f1;
          d0 = d1;
        }
        const count = roots.length;
        for (let i = 0; i < count; i++) {
          const from = roots[i], to = roots[(i + 1) % count], phi = from.phi + ((to.phi - from.phi + 2 * Math.PI) % (2 * Math.PI) || 2 * Math.PI) / 2;
          if (f(phi) > 0) {
            contacts.strips.push({
              from,
              to,
              distance: axes[0].multiply(a * Math.cos(phi)).add(axes[1].multiply(b * Math.sin(phi))).dot(normal)
            });
          }
        }
        contacts.strips.sort((a2, b2) => b2.distance - a2.distance);
        if (count > 1) {
          roots.sort((a2, b2) => b2.distance - a2.distance);
          contacts.sides = [roots[0], roots[count - 1]];
        }
      }
      return contacts;
    }
    function getSides(part, t, span) {
      return getContacts(part, t, span).sides;
    }
    function addPiece(part, span, ta, tb) {
      const v = part.v, turn = abs(getSpanPen(span, getOffset(part, tb)).angle - getSpanPen(span, getOffset(part, ta)).angle) + getTurn(v, ta, tb), count = Math.max(16, Math.ceil(turn * 18 / Math.PI)), splits = [[ta, ta], [tb, tb]], cache = {};
      function getStrips(t) {
        return cache[t] || (cache[t] = getContacts(part, t, span).strips);
      }
      function getEnd(t, j, end) {
        const strip = getStrips(t)[j];
        return strip ? strip[end].point : Curve.getPoint(v, t);
      }
      function getMotions(strip) {
        const vector = strip.to.point.subtract(strip.from.point), normal = new Point(-vector.y, vector.x);
        return [
          strip.from.derivative.dot(normal),
          strip.to.derivative.dot(normal)
        ];
      }
      function isSame(strips, before) {
        if (strips.length !== before.length)
          return false;
        for (let i = 0, l = strips.length; i < l; i++) {
          const phi = strips[i].from.phi;
          for (let j = 0; j < l; j++) {
            if (j !== i && getAngle(phi, before[j].from.phi) < getAngle(phi, before[i].from.phi))
              return false;
          }
        }
        return true;
      }
      function getAngle(phi1, phi2) {
        const angle = Math.abs(phi1 - phi2) % (2 * Math.PI);
        return Math.min(angle, 2 * Math.PI - angle);
      }
      function isClose(strips, before) {
        return strips.every((strip, i) => {
          const other = before[i];
          return getAngle(strip.from.phi, other.from.phi) < 0.35 && getAngle(strip.to.phi, other.to.phi) < 0.35;
        });
      }
      const samples = [];
      for (let i = 0; i < count; i++)
        samples.push(ta + (tb - ta) * i / count);
      samples.push(tb);
      getCurvatureExtrema(v).concat(getInflections(v)).forEach((t) => {
        if (t > ta && t < tb)
          samples.push(t);
      });
      samples.sort((a, b) => a - b);
      for (let i = 1, t0 = ta, s0 = getStrips(ta); i < samples.length; i++) {
        const t1 = samples[i], s1 = getStrips(t1);
        if (isSame(s1, s0) && !isClose(s1, s0) && t1 - t0 > Numerical.CURVETIME_EPSILON) {
          samples.splice(i--, 0, (t0 + t1) / 2);
          continue;
        }
        while (!isSame(s1, s0)) {
          let t = t0, u = t1;
          for (let j = 0; j < 40; j++) {
            const middle = (t + u) / 2;
            if (isSame(getStrips(middle), s0)) {
              t = middle;
            } else {
              u = middle;
            }
          }
          splits.push([t, u]);
          addPen(
            Curve.getPoint(v, t),
            getSpanPen(span, getOffset(part, t)),
            getStrips(t).concat(getStrips(u))
          );
          t0 = u;
          s0 = getStrips(u);
        }
        s0.forEach((strip, j) => {
          const m0 = getMotions(strip), m1 = getMotions(s1[j]);
          for (let k = 0; k < 2; k++) {
            if (m0[k] * m1[k] < 0) {
              const t = Numerical.findSignChange(
                (t2) => {
                  const strip2 = getStrips(t2)[j];
                  return strip2 ? getMotions(strip2)[k] : 0;
                },
                t0,
                t1,
                m0[k],
                m1[k],
                1e-9
              );
              splits.push([t, t]);
            }
          }
        });
        t0 = t1;
        s0 = s1;
      }
      splits.sort((a, b) => a[0] - b[0]);
      for (let i = 1, l = splits.length; i < l; i++) {
        const t0 = splits[i - 1][1], t1 = splits[i][0], strips = t1 - t0 > geomEpsilon ? getStrips((t0 + t1) / 2) : [];
        strips.forEach((strip, j) => {
          const motions = getMotions(strip), from = fitSide((t) => getEnd(t, j, "from"), t0, t1), to = fitSide((t) => getEnd(t, j, "to"), t0, t1);
          if (motions[0] * motions[1] < 0) {
            const still = fitSide((t) => {
              const strip2 = getStrips(t)[j];
              if (!strip2)
                return Curve.getPoint(v, t);
              const motions2 = getMotions(strip2), point = strip2.from.point, factor = clamp(motions2[0] / (motions2[0] - motions2[1]), 0, 1);
              return point.add(strip2.to.point.subtract(point).multiply(factor));
            }, t0, t1);
            addSides(from, still, true);
            addSides(to, still, true);
          } else {
            addSides(from, to, true);
          }
        });
      }
    }
    function addPart2(part) {
      const start = part.offset, end = start + part.length;
      part.curveLength = Curve.getLength(part.v);
      for (let i = 0, l = spans.length; i < l; i++) {
        const span = spans[i], from = Math.max(span.entry.offset, start), to = Math.min(span.next.offset, end), ta = getTime(part, from), tb = getTime(part, to);
        if (to > from && tb > ta)
          addPiece(part, span, ta, tb);
      }
    }
    function fitSide(evaluate, t0, t1) {
      const count = 8, segments = [new Segment(evaluate(t0))];
      function fit(t02, t12, p0, p3, depth) {
        const delta = (t12 - t02) * 1e-5, chord = p3.subtract(p0), tangent0 = (() => {
          const tangent = evaluate(t02 + delta).subtract(p0);
          return (tangent.isZero() ? chord : tangent).normalize();
        })(), tangent3 = (() => {
          const tangent = p3.subtract(evaluate(t12 - delta));
          return (tangent.isZero() ? chord : tangent).normalize();
        })(), points = [], times = [];
        let total = 0;
        for (let i = 0, prev = p0; i <= count; i++) {
          const point = i < count ? evaluate(t02 + (t12 - t02) * (i + 1) / (count + 1)) : p3;
          total += point.getDistance(prev);
          if (i < count) {
            points.push(point);
            times.push(total);
          }
          prev = point;
        }
        for (let i = 0; i < count; i++)
          times[i] = total ? times[i] / total : 0;
        const fitLength = chord.length;
        let handle1 = new Point(), handle2 = new Point(), c = [], error = 0;
        for (let iteration = 0; iteration < 4; iteration++) {
          let c11 = 0, c12 = 0, c22 = 0, x1 = 0, x2 = 0;
          for (let i = 0; i < count; i++) {
            const u = times[i], w = 1 - u, a1 = tangent0.multiply(3 * w * w * u), a2 = tangent3.multiply(-3 * w * u * u), rest = points[i].subtract(p0.multiply(w * w * (w + 3 * u))).subtract(p3.multiply(u * u * (u + 3 * w)));
            c11 += a1.dot(a1);
            c12 += a1.dot(a2);
            c22 += a2.dot(a2);
            x1 += a1.dot(rest);
            x2 += a2.dot(rest);
          }
          const det = c11 * c22 - c12 * c12;
          let alpha = det ? (x1 * c22 - x2 * c12) / det : 0, beta = det ? (c11 * x2 - c12 * x1) / det : 0;
          if (!(alpha > epsilon && beta > epsilon && alpha < 2 * total && beta < 2 * total)) {
            alpha = beta = fitLength / 3;
          }
          handle1 = tangent0.multiply(alpha);
          handle2 = tangent3.multiply(-beta);
          c = [
            p0.x,
            p0.y,
            p0.x + handle1.x,
            p0.y + handle1.y,
            p3.x + handle2.x,
            p3.y + handle2.y,
            p3.x,
            p3.y
          ];
          error = 0;
          for (let i = 0; i < count; i++) {
            const time = Curve.getNearestTime(c, points[i]);
            error = Math.max(error, points[i].getDistance(
              Curve.getPoint(c, time)
            ));
            times[i] = time;
          }
          if (error <= tolerance)
            break;
        }
        for (let i = 0; i <= count; i++) {
          const point = evaluate(t02 + (t12 - t02) * (i + 0.5) / (count + 1));
          error = Math.max(error, point.getDistance(
            Curve.getPoint(
              c,
              Curve.getNearestTime(c, point)
            )
          ));
        }
        if (error > tolerance && depth < 12) {
          const t = (t02 + t12) / 2, point = evaluate(t);
          fit(t02, t, p0, point, depth + 1);
          fit(t, t12, point, p3, depth + 1);
        } else {
          segments[segments.length - 1].handleOut = handle1;
          segments.push(new Segment(p3, handle2));
        }
      }
      fit(t0, t1, segments[0]._point, evaluate(t1), 0);
      return segments;
    }
    function addJoin2(end1, end2) {
      const point = end2.point, part1 = end1.last, part2 = end2.first, offset = part2.offset, tangent1 = end1.end, tangent2 = end2.start, cross = tangent1.cross(tangent2), span = getSpan(offset, true), pen = getSpanPen(span, offset);
      if (!Numerical.isZero(cross) || tangent1.dot(tangent2) < 0) {
        if (join === "round") {
          addPen(point, pen, getContacts(
            part1,
            1,
            getSpan(offset, false)
          ).strips.concat(
            getContacts(part2, 0, span).strips
          ));
        } else {
          const span1 = getSpan(offset, false), k = cross > 0 ? 1 : 0, sides1 = getSides(part1, 1, span1), sides2 = getSides(part2, 0, span);
          if (sides1 && sides2) {
            const side1 = sides1[k].point, side2 = sides2[k].point, direction1 = sides1[k].derivative.normalize(), direction2 = sides2[k].derivative.normalize(), widening = Math.sqrt(tolerance * pen.a), points = [
              sides1[1 - k].point,
              side1.subtract(direction1.multiply(widening)),
              side1
            ];
            if (join === "miter") {
              const miter = Line.intersect(
                side1.x,
                side1.y,
                direction1.x,
                direction1.y,
                side2.x,
                side2.y,
                direction2.x,
                direction2.y,
                true,
                true
              );
              if (miter && miter.getDistance(point) <= miterLimit * pen.a)
                points.push(miter);
            }
            addPolygon(points.concat(
              side2,
              side2.add(
                direction2.multiply(widening)
              ),
              sides2[1 - k].point
            ));
          }
        }
      }
    }
    function addCap2(part, t, tangent) {
      const offset = part.offset + (t ? part.length : 0), span = getSpan(offset, !t), pen = getSpanPen(span, offset);
      if (cap === "round") {
        addPen(
          Curve.getPoint(part.v, t),
          pen,
          getContacts(part, t, span).strips
        );
      } else if (cap === "square") {
        const sides = getSides(part, t, span);
        if (sides) {
          const axes = getAxes(pen), reach = new Point(
            pen.a * tangent.dot(axes[0]),
            pen.b * tangent.dot(axes[1])
          ).length, ahead = tangent.multiply(reach), side0 = sides[0].point, side1 = sides[1].point;
          addPolygon([
            side0,
            side0.add(ahead),
            side1.add(ahead),
            side1
          ]);
        }
      }
    }
    if (!length) {
      const segments = path._segments;
      if (segments.length && !closed && cap !== "butt") {
        const center = segments[0]._point, pen = getPen(0, true), axes = getAxes(pen);
        if (cap === "round") {
          addPen(center, pen);
        } else {
          const x = axes[0].multiply(pen.a), y = axes[1].multiply(pen.b);
          addPolygon([
            center.subtract(x).subtract(y),
            center.add(x).subtract(y),
            center.add(x).add(y),
            center.subtract(x).add(y)
          ]);
        }
      }
    } else {
      for (let i = 1, l = pens.length; i < l; i++) {
        if (pens[i].offset > pens[i - 1].offset)
          spans.push({ entry: pens[i - 1], next: pens[i] });
      }
      let offset = 0;
      for (let i = 0, l = curves.length; i < l; i++) {
        const curve = curves[i], curveLength = curve.length;
        if (curve.hasLength(geomEpsilon)) {
          const v = regularize(curve.getValues(), tolerance / 4), reversals = Curve.getReversals(v, tolerance), parts = [];
          if (reversals.length) {
            const points = [new Point(v[0], v[1])];
            for (let j = 0, m = reversals.length; j < m; j++)
              points.push(Curve.getPoint(v, reversals[j]));
            points.push(new Point(v[6], v[7]));
            for (let j = 1, start = offset, m = points.length; j < m; j++) {
              const p1 = points[j - 1], p2 = points[j], third = p2.subtract(p1).divide(3), distance = p1.getDistance(p2);
              parts.push({
                v: [
                  p1.x,
                  p1.y,
                  p1.x + third.x,
                  p1.y + third.y,
                  p2.x - third.x,
                  p2.y - third.y,
                  p2.x,
                  p2.y
                ],
                offset: start,
                length: distance
              });
              start += distance;
            }
          } else {
            parts.push({
              v: regularizeCusp(v, tolerance / 4),
              offset,
              length: curveLength
            });
          }
          parts.forEach(addPart2);
          for (let j = 1, m = parts.length; j < m; j++) {
            const part = parts[j], start = part.offset, span = getSpan(start);
            addPen(
              new Point(part.v[0], part.v[1]),
              getSpanPen(span, start),
              getContacts(parts[j - 1], 1, span).strips.concat(getContacts(part, 0, span).strips)
            );
          }
          allParts.push(...parts);
          const first = parts[0], last = parts[parts.length - 1];
          ends.push({
            point: curve._segment1._point,
            first,
            last,
            start: Curve.getTangent(first.v, 0),
            end: Curve.getTangent(last.v, 1)
          });
        }
        offset += curveLength;
      }
      for (let i = 0, l = pens.length; i < l; i++) {
        const offset2 = pens[i].offset, isStep = i > 0 && pens[i - 1].offset === offset2 || i < l - 1 && pens[i + 1].offset === offset2;
        if (!isStep && (closed ? offset2 < length : offset2 > 0 && offset2 < length)) {
          const pen = getPen(offset2, true), before = getPen(offset2, false), size = Math.max(pen.a, pen.b), jump = size * (Math.abs(pen.da - before.da) + Math.abs(pen.db - before.db) + size * Math.abs(pen.dAngle - before.dAngle));
          if (jump > geomEpsilon) {
            let j = 0;
            for (; j < allParts.length && allParts[j].offset + allParts[j].length <= offset2; j++) {
            }
            const part = allParts[j], t = getTime(part, offset2), previous = t ? part : allParts[j - 1] || allParts[allParts.length - 1];
            addPen(
              Curve.getPoint(part.v, t),
              pen,
              getContacts(
                previous,
                t || 1,
                getSpan(offset2, false)
              ).strips.concat(
                getContacts(
                  part,
                  t,
                  getSpan(offset2, true)
                ).strips
              )
            );
          }
        }
      }
      for (let i = 1, l = ends.length; i <= l; i++) {
        if (i < l || closed)
          addJoin2(ends[i - 1], ends[i % l]);
      }
      if (!closed && ends.length) {
        const first = ends[0], last = ends[ends.length - 1];
        addCap2(first.first, 0, first.start.negate());
        addCap2(last.last, 1, last.end);
      }
    }
  }
  for (let i = 0, l = paths.length; i < l; i++) {
    const path = paths[i];
    if (path._strokeProfile) {
      addProfilePath(path);
    } else {
      addPath(path);
    }
  }
  return areas.length ? areas.length > 1 ? areas[0].unite(areas.slice(1)) : areas[0] : createPath();
}
function pathConstructor() {
  const ctor = PathItem._pathClass;
  if (!ctor)
    throw new Error("Path 尚未注册：请从包入口导入，或先加载 ./path/Path");
  return ctor;
}
function offsetSide(path, offset, join, miterLimit) {
  const radius = abs(offset), outline = outlineStroke([path], radius, join, "butt", miterLimit), first = path.firstSegment, last = path.lastSegment, caps = [
    [first._point, path.firstCurve.getNormalAtTime(0)],
    [last._point, path.lastCurve.getNormalAtTime(1)]
  ], tolerance = radius / 1e4, paths = [];
  function isCap(curve) {
    if (!curve.hasHandles()) {
      for (let i = 0; i < 2; i++) {
        const point = caps[i][0], normal = caps[i][1], vector1 = curve._segment1._point.subtract(point), vector2 = curve._segment2._point.subtract(point);
        if (abs(vector1.cross(normal)) < tolerance && abs(vector2.cross(normal)) < tolerance)
          return true;
      }
    }
    return false;
  }
  function isOnSide(curve) {
    const point = curve.getPointAtTime(0.5), location = path.getNearestLocation(point);
    return !isCap(curve) && !!location && point.subtract(location.point).dot(location.normal) * offset > 0;
  }
  function addRun(curves) {
    const segments = [new Segment(
      curves[0]._segment1._point,
      void 0,
      curves[0]._segment1._handleOut
    )];
    for (let i = 0, l = curves.length; i < l; i++) {
      const segment = curves[i]._segment2;
      segments.push(new Segment(
        segment._point,
        segment._handleIn,
        i < l - 1 ? segment._handleOut : void 0
      ));
    }
    const run = createPath(segments);
    const first2 = run.firstSegment, lastSeg = run.lastSegment, from = path.getNearestLocation(first2._point), to = path.getNearestLocation(lastSeg._point);
    if (from && to && from.offset > to.offset)
      run.reverse();
    paths.push(run);
  }
  const contours = outline._children || [outline];
  for (let i = 0, l = contours.length; i < l; i++) {
    const contour = contours[i], curves = contour.curves, count = curves.length, keeps = [];
    let start = -1;
    for (let j = 0; j < count; j++) {
      keeps.push(isOnSide(curves[j]));
      if (!keeps[j])
        start = j;
    }
    if (count && start === -1) {
      paths.push(contour.clone());
    } else {
      let run = [];
      for (let j = 1; j <= count; j++) {
        const index = (start + j) % count;
        if (keeps[index]) {
          run.push(curves[index]);
        } else if (run.length) {
          addRun(run);
          run = [];
        }
      }
    }
  }
  return paths;
}
function getTurn(v, t1, t2) {
  const times = [t1].concat(getInflections(v).filter((t) => t > t1 && t < t2), t2);
  let turn = 0;
  for (let i = 1, l = times.length; i < l; i++) {
    turn += abs(Curve.getTangent(v, times[i - 1]).getDirectedAngle(
      Curve.getTangent(v, times[i])
    ));
  }
  return turn * Math.PI / 180;
}
function getCuspTimes(v, radius) {
  const times = getCurvatureExtrema(v).concat(getInflections(v), 0, 1).sort((a, b) => a - b), cusps = [];
  function f(t) {
    const curvature = Curve.getCurvature(v, t) * radius;
    return 1 - curvature * curvature;
  }
  for (let i = 1, l = times.length; i < l; i++) {
    const t0 = times[i - 1], t1 = times[i], f0 = f(t0), f1 = f(t1);
    if (f0 * f1 < 0)
      cusps.push(Numerical.findSignChange(f, t0, t1, f0, f1, epsilon));
  }
  return cusps;
}
function getEvoluteAt(v, t) {
  const x0 = v[0], y0 = v[1], cx = 3 * (v[2] - x0), cy = 3 * (v[3] - y0), bx = 3 * (v[4] - v[2]) - cx, by = 3 * (v[5] - v[3]) - cy, ax = v[6] - x0 - cx - bx, ay = v[7] - y0 - cy - by, dx = (3 * ax * t + 2 * bx) * t + cx, dy = (3 * ay * t + 2 * by) * t + cy, ddx = 6 * ax * t + 2 * bx, ddy = 6 * ay * t + 2 * by, cross = dx * ddy - dy * ddx, length2 = dx * dx + dy * dy, speed = 3 * (dx * ddx + dy * ddy) * cross - length2 * (dx * 6 * ay - dy * 6 * ax), perp = new Point(-dy, dx);
  return {
    point: Curve.getPoint(v, t).add(perp.multiply(length2 / cross)),
    derivative: perp.multiply(speed / (cross * cross)),
    speed,
    radius: length2 * Math.sqrt(length2) / cross
  };
}
function getCurvatureExtrema(v) {
  const count = 32, times = [];
  function f(t) {
    return getEvoluteAt(v, t).speed;
  }
  for (let i = 1, f0 = f(0); i <= count; i++) {
    const t0 = (i - 1) / count, t1 = i / count, f1 = f(t1);
    if (f0 * f1 < 0)
      times.push(Numerical.findSignChange(f, t0, t1, f0, f1, epsilon));
    f0 = f1;
  }
  return times;
}
function getEvolute(v, inner, tolerance) {
  const c = regularizeCusp(v, tolerance / 4), times = getCurvatureExtrema(c).concat(1), segments = [new Segment(evaluate(0).point)];
  let t0 = 0, e0 = evaluate(0);
  function evaluate(t) {
    let e = getEvoluteAt(c, t);
    const distance = inner > 0 ? -e.radius : e.radius;
    if (!(distance >= 0 && distance < abs(inner) - tolerance)) {
      const derivative = Curve.getWeightedTangent(c, t);
      e = {
        point: Curve.getPoint(c, t).add(
          Curve.getNormal(c, t).multiply(inner)
        ),
        derivative: derivative.multiply(
          1 + inner * Curve.getCurvature(c, t)
        ),
        speed: 0,
        radius: 0
      };
    }
    return e;
  }
  function fit(t02, e02, t1, e1, depth) {
    const tm = (t02 + t1) / 2, em = evaluate(tm), h0 = e02.derivative.multiply((t1 - t02) / 3), h1 = e1.derivative.multiply((t02 - t1) / 3), mid = e02.point.add(e1.point).multiply(0.5).add(h0.add(h1).multiply(3 / 8));
    if (depth < 8 && mid.getDistance(em.point) > tolerance / 10) {
      fit(t02, e02, tm, em, depth + 1);
      fit(tm, em, t1, e1, depth + 1);
    } else {
      segments[segments.length - 1].handleOut = h0;
      segments.push(new Segment(e1.point, h1));
    }
  }
  for (let i = 0, l = times.length; i < l; i++) {
    const e1 = evaluate(times[i]);
    fit(t0, e0, times[i], e1, 0);
    t0 = times[i];
    e0 = e1;
  }
  return segments;
}
function getOffsetSegments(v, offset, tolerance) {
  if (Curve.isStraight(v)) {
    return [
      new Segment(new Point(v[0], v[1]).add(
        Curve.getNormal(v, 0).multiply(offset)
      )),
      new Segment(new Point(v[6], v[7]).add(
        Curve.getNormal(v, 1).multiply(offset)
      ))
    ];
  } else {
    return offsetCubic(v, -offset, tolerance);
  }
}
function offsetCubic(v, d, tolerance) {
  const c = regularizeCusp(v, tolerance / 4), p0 = new Point(c[0], c[1]), p1 = new Point(c[2], c[3]), p2 = new Point(c[4], c[5]), p3 = new Point(c[6], c[7]), q0 = p1.subtract(p0).multiply(3), q1 = p2.subtract(p1).multiply(3), q2 = p3.subtract(p2).multiply(3), q1xq0 = q1.cross(q0), q2xq0 = q2.cross(q0), q2xq1 = q2.cross(q1), c0 = 2 * d * q1xq0, c1 = 2 * d * (q2xq0 - 2 * q1xq0), c2 = 2 * d * (q2xq1 - q2xq0 + q1xq0), utan0 = Curve.getTangent(c, 0), utan1 = Curve.getTangent(c, 1), segments = [new Segment(p0.add(getUnitNormal(utan0, d)))], count = 8, weights = [];
  for (let i = 0; i < count; i++) {
    const t = (i + 1) / (count + 1);
    weights.push(3 * (1 - t) * (1 - t) * t);
  }
  function getUnitNormal(utan, length) {
    return new Point(-utan.y, utan.x).multiply(length);
  }
  function evaluate(t) {
    return Curve.getPoint(c, t);
  }
  function derive(t) {
    const u = 1 - t, w0 = u * u, w1 = 2 * t * u, w2 = t * t;
    return new Point(
      w0 * q0.x + w1 * q1.x + w2 * q2.x,
      w0 * q0.y + w1 * q1.y + w2 * q2.y
    );
  }
  function getCusp(t) {
    const ds2 = derive(t).dot(derive(t));
    return ((c2 * t + c1) * t + c0) / (ds2 * Math.sqrt(ds2)) + 1;
  }
  function getEndCusp(tangent, y) {
    const length = Math.max(tangent.length, epsilon);
    return y / (length * length * length) + 1;
  }
  function getOffsetCurve(part, a, b) {
    const s = (part.t1 - part.t0) / 3, start = evaluate(part.t0).add(getUnitNormal(part.utan0, d)), end = evaluate(part.t1).add(getUnitNormal(part.utan1, d)), l0 = s * derive(part.t0).length + a * d, l1 = s * derive(part.t1).length - b * d;
    return [
      start,
      l0 * part.cusp0 > 0 ? start.add(part.utan0.multiply(l0)) : start,
      l1 * part.cusp1 > 0 ? end.subtract(part.utan1.multiply(l1)) : end,
      end
    ];
  }
  function getError(part, points, ts) {
    let error = 0;
    const normals = [], vectors = [], x0 = points[0].x, y0 = points[0].y, x1 = points[1].x, y1 = points[1].y, x2 = points[2].x, y2 = points[2].y, x3 = points[3].x, y3 = points[3].y, sign = part.cusp0 < 0 ? -1 : 1;
    for (let i = 0; i < count; i++) {
      const ta = (i + 1) / (count + 1), u = 1 - ta, w0 = u * u * u, w1 = 3 * u * u * ta, w2 = 3 * u * ta * ta, w3 = ta * ta * ta, px = w0 * x0 + w1 * x1 + w2 * x2 + w3 * x3, py = w0 * y0 + w1 * y1 + w2 * y2 + w3 * y3, tx = (x1 - x0) * u * u + (x2 - x1) * 2 * u * ta + (x3 - x2) * ta * ta, ty = (y1 - y0) * u * u + (y2 - y1) * 2 * u * ta + (y3 - y2) * ta * ta;
      let t = ts[i];
      const point = evaluate(t), derivative = derive(t);
      t += (tx * (px - point.x) + ty * (py - point.y)) / (tx * derivative.x + ty * derivative.y);
      t = ts[i] = clamp(t, part.t0, part.t1);
      const p = evaluate(t), length = Math.sqrt(tx * tx + ty * ty), nx = -ty / length * sign, ny = tx / length * sign, vx = px - p.x - nx * d, vy = py - p.y - ny * d, squared = vx * vx + vy * vy;
      normals.push(new Point(nx, ny));
      vectors.push(new Point(vx, vy));
      error = Math.max(error, isFinite(squared) ? squared : 1e12);
    }
    return { squared: error, normals, vectors };
  }
  function refine(part, a, b, error) {
    const blend = 1e-3;
    let aa = 0, ab = 0, ac = 0, bb = 0, bc = 0;
    for (let i = 0; i < count; i++) {
      const n = error.normals[i], vector = error.vectors[i], cn = vector.dot(n), ct = vector.cross(n), an = weights[i] * part.utan0.dot(n), at = weights[i] * part.utan0.cross(n), bn = weights[count - 1 - i] * part.utan1.dot(n), bt = weights[count - 1 - i] * part.utan1.cross(n);
      aa += an * an + blend * at * at;
      ab += an * bn + blend * at * bt;
      ac += an * cn + blend * at * ct;
      bb += bn * bn + blend * bt * bt;
      bc += bn * cn + blend * bt * ct;
    }
    const idet = 1 / (d * (aa * bb - ab * ab));
    return [
      a - idet * (ac * bb - ab * bc),
      b - idet * (aa * bc - ac * ab)
    ];
  }
  function getTimeWithTangent(utan02, t0, t1, tangent, force) {
    const z0 = tangent.cross(q0), z1 = tangent.cross(q1), z2 = tangent.cross(q2), roots = [], found = Numerical.solveQuadratic(
      z2 - 2 * z1 + z0,
      2 * (z1 - z0),
      z0,
      roots,
      t0,
      t1
    );
    let t = roots[0];
    if (found !== 1) {
      if (!force)
        return null;
      t = derive(t0).length > derive(t1).length ? t1 : t0;
    }
    const q = derive(t);
    return {
      t,
      utan: found === 1 && q.dot(q) >= epsilon ? q.normalize() : tangent.dot(tangent) >= epsilon ? tangent.normalize() : getUnitNormal(utan02, 1)
    };
  }
  function getSubdivision(part) {
    const t = (part.t0 + part.t1) / 2, q = derive(t), x0 = abs(part.utan0.cross(q)), x1 = abs(part.utan1.cross(q));
    if (x0 > 0.1 * x1 && x1 > 0.1 * x0)
      return { t, utan: q.normalize() };
    const chord = evaluate(part.t1).subtract(evaluate(part.t0));
    if (chord.cross(part.utan0) * chord.cross(part.utan1) < 0) {
      const split = getTimeWithTangent(
        part.utan0,
        part.t0,
        part.t1,
        part.utan0.add(part.utan1),
        false
      );
      if (split)
        return split;
    }
    const tangents = [part.utan0], ts = [part.t0], inflections = getInflections(c);
    for (let i = 0; i < inflections.length; i++) {
      const ti = inflections[i];
      if (ti > part.t0 && ti < part.t1) {
        tangents.push(derive(ti));
        ts.push(ti);
      }
    }
    tangents.push(part.utan1);
    ts.push(part.t1);
    const angles = [];
    let sum = 0;
    for (let i = 0; i < tangents.length - 1; i++) {
      const angle = Math.atan2(
        tangents[i].cross(tangents[i + 1]),
        tangents[i].dot(tangents[i + 1])
      );
      sum += abs(angle);
      angles.push(angle);
    }
    let target = sum / 2, j = 0;
    while (abs(angles[j]) < target) {
      target -= abs(angles[j]);
      j++;
    }
    const base = tangents[j], turn = angles[j] < 0 ? -target : target, tangent = base.rotate(turn * 180 / Math.PI);
    return getTimeWithTangent(
      j ? base.normalize() : part.utan0,
      ts[j],
      ts[j + 1],
      tangent,
      true
    );
  }
  function subdivide(part, t, utan, cuspMinus, cuspPlus) {
    offsetPart({
      t0: part.t0,
      t1: t,
      utan0: part.utan0,
      utan1: utan,
      cusp0: part.cusp0,
      cusp1: cuspMinus,
      depth: part.depth + 1
    });
    offsetPart({
      t0: t,
      t1: part.t1,
      utan0: utan,
      utan1: part.utan1,
      cusp0: cuspPlus,
      cusp1: part.cusp1,
      depth: part.depth + 1
    });
  }
  function offsetPart(part) {
    if (part.cusp0 * part.cusp1 < 0) {
      const t = Numerical.findSignChange(
        getCusp,
        part.t0,
        part.t1,
        part.cusp0,
        part.cusp1,
        epsilon
      );
      subdivide(
        part,
        t,
        derive(t).normalize(),
        part.cusp0 < 0 ? -epsilon : epsilon,
        part.cusp1 < 0 ? -epsilon : epsilon
      );
      return;
    }
    const angle = Math.atan2(
      part.utan1.cross(part.utan0),
      part.utan1.dot(part.utan0)
    );
    let a = 2 / 3 / (1 + Math.cos(angle / 2)) * 2 * Math.sin(angle / 2);
    let b = -a, points = getOffsetCurve(part, a, b);
    const dt = (part.t1 - part.t0) / (count + 1), ts = [];
    for (let i = 0; i < count; i++)
      ts.push(part.t0 + (i + 1) * dt);
    let error = getError(part, points, ts);
    const tolerance2 = tolerance * tolerance;
    for (let i = 0; i < 2 && error.squared > tolerance2; i++) {
      const refined = refine(part, a, b, error), points2 = getOffsetCurve(part, refined[0], refined[1]), error2 = getError(part, points2, ts);
      if (error2.squared >= error.squared)
        break;
      a = refined[0];
      b = refined[1];
      points = points2;
      error = error2;
    }
    const isShort = points[1].getDistance(points[0]) < tolerance && points[2].getDistance(points[0]) < tolerance && points[3].getDistance(points[0]) < tolerance;
    if (part.depth < 8 && error.squared > tolerance2 && !isShort) {
      const split = getSubdivision(part), cusp = getCusp(split.t);
      subdivide(part, split.t, split.utan, cusp, cusp);
    } else {
      const last = segments[segments.length - 1];
      last.handleOut = points[1].subtract(points[0]);
      segments.push(new Segment(
        points[3],
        points[2].subtract(points[3])
      ));
    }
  }
  offsetPart({
    t0: 0,
    t1: 1,
    utan0,
    utan1,
    cusp0: getEndCusp(q0, c0),
    cusp1: getEndCusp(q2, c0 + c1 + c2),
    depth: 0
  });
  return segments;
}
function getInflections(v) {
  const p0 = new Point(v[0], v[1]), p1 = new Point(v[2], v[3]), p2 = new Point(v[4], v[5]), p3 = new Point(v[6], v[7]), a = p1.subtract(p0), b = p2.subtract(p1).subtract(a), c = p3.subtract(p0).subtract(p2.subtract(p1).multiply(3)), roots = [], count = Numerical.solveQuadratic(
    b.cross(c),
    a.cross(c),
    a.cross(b),
    roots,
    0,
    1
  );
  return count > 0 ? roots.slice(0, count) : [];
}
function regularize(v, dimension) {
  const p0 = new Point(v[0], v[1]), p3 = new Point(v[6], v[7]), handle1 = new Point(v[2], v[3]).subtract(p0), handle2 = new Point(v[4], v[5]).subtract(p3);
  let p1 = new Point(v[2], v[3]), p2 = new Point(v[4], v[5]);
  if (handle1.length < dimension) {
    if (!handle1.isZero()) {
      p1 = p0.add(handle1.normalize(dimension));
    } else if (p0.getDistance(p2) >= dimension) {
      p1 = p0.add(p2.subtract(p0).normalize(dimension));
    } else {
      p1 = p0.add(p3.subtract(p0).divide(3));
      p2 = p3.add(p0.subtract(p3).divide(3));
    }
  }
  if (handle2.length < dimension) {
    if (!handle2.isZero()) {
      p2 = p3.add(handle2.normalize(dimension));
    } else if (p3.getDistance(p1) >= dimension) {
      p2 = p3.add(p1.subtract(p3).normalize(dimension));
    } else {
      p1 = p0.add(p3.subtract(p0).divide(3));
      p2 = p3.add(p0.subtract(p3).divide(3));
    }
  }
  return [p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y];
}
function regularizeCusp(v, dimension) {
  const p0 = new Point(v[0], v[1]), p3 = new Point(v[6], v[7]);
  let p1 = new Point(v[2], v[3]), p2 = new Point(v[4], v[5]);
  const d01 = p1.subtract(p0), d02 = p2.subtract(p0), d03 = p3.subtract(p0), d12 = p2.subtract(p1), d23 = p3.subtract(p2), det012 = d01.cross(d02), det123 = d12.cross(d23), det013 = d01.cross(d03), det023 = d02.cross(d03);
  if (det012 * det123 > 0 && det012 * det013 < 0 && det012 * det023 < 0) {
    const q0 = d01.multiply(3), q1 = d12.multiply(3), q2 = d23.multiply(3), t = Curve.getNearestTime(
      [
        q0.x,
        q0.y,
        q0.x + (q1.x - q0.x) * 2 / 3,
        q0.y + (q1.y - q0.y) * 2 / 3,
        q2.x + (q1.x - q2.x) * 2 / 3,
        q2.y + (q1.y - q2.y) * 2 / 3,
        q2.x,
        q2.y
      ],
      new Point(0, 0)
    ), u = 1 - t, q = q0.multiply(u * u).add(q1.multiply(2 * t * u)).add(q2.multiply(t * t)), dq = q1.subtract(q0).multiply(2 * u).add(q2.subtract(q1).multiply(2 * t)), cross = q.cross(dq), distance2 = q.dot(q);
    if (distance2 * distance2 * distance2 <= cross * dimension * cross * dimension) {
      const a = 3 * det012 + det023 - 2 * det013, b = -3 * det012 + det013, discriminant = b * b - 4 * a * det012, l01 = d01.length, l23 = d23.length;
      if (discriminant > 0) {
        if (l01 > 2 * dimension)
          p1 = p1.subtract(d01.multiply(dimension / l01));
        if (l23 > 2 * dimension)
          p2 = p2.add(d23.multiply(dimension / l23));
      } else {
        p1 = p1.add(d01.multiply(dimension / l01));
        p2 = p2.subtract(d23.multiply(dimension / l23));
      }
    }
  }
  return [p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y];
}
function prepare(item) {
  return reducePath(item.clone());
}
function createResult(item, result, options) {
  return result;
}
function offsetItem(item, distance, options) {
  const join = options && options.join || "miter", miterLimit = options && options.miterLimit || 10, path = prepare(item), paths = getPaths(path);
  let result;
  if (!distance) {
    result = path;
  } else if (item._children || item._closed) {
    const outline = outlineStroke(
      paths,
      abs(distance),
      join,
      "butt",
      miterLimit
    );
    result = distance > 0 ? path.unite(outline) : path.subtract(outline);
  } else {
    result = reducePath(createCompoundPath(path.isEmpty() ? [] : offsetSide(path, distance, join, miterLimit)));
  }
  return createResult(item, result);
}
function outlineItem(item, options) {
  const opts = options || {}, path = prepare(item), result = outlineStroke(
    getPaths(path),
    (opts.width || 0) / 2,
    opts.join || "miter",
    opts.cap || "butt",
    opts.miterLimit || 10
  );
  return createResult(item, reducePath(result));
}
export {
  offsetItem,
  outlineItem
};
