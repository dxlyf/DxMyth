import { Vector2 } from "./Vector2.js";
function lineLineIntersection(p1, p2, p3, p4) {
  const denominator = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
  if (denominator === 0) {
    return null;
  }
  const t = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denominator;
  return new Vector2(p1.x + t * (p2.x - p1.x), p1.y + t * (p2.y - p1.y));
}
function lineSegmentIntersection(p1, p2, p3, p4) {
  const dx1 = p2.x - p1.x;
  const dy1 = p2.y - p1.y;
  const dx2 = p4.x - p3.x;
  const dy2 = p4.y - p3.y;
  const denominator = dx1 * dy2 - dy1 * dx2;
  if (denominator === 0) {
    return null;
  }
  const dx3 = p3.x - p1.x;
  const dy3 = p3.y - p1.y;
  const t = (dx3 * dy2 - dy3 * dx2) / denominator;
  const u = (dx3 * dy1 - dy3 * dx1) / denominator;
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return new Vector2(p1.x + t * dx1, p1.y + t * dy1);
  }
  return null;
}
function isPointOnLineSegment(point, segStart, segEnd) {
  const cross = (point.x - segStart.x) * (segEnd.y - segStart.y) - (point.y - segStart.y) * (segEnd.x - segStart.x);
  if (Math.abs(cross) > 1e-10) return false;
  const dot = (point.x - segStart.x) * (point.x - segEnd.x) + (point.y - segStart.y) * (point.y - segEnd.y);
  return dot <= 1e-10;
}
function pointInCircle(point, center, radius) {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return dx * dx + dy * dy <= radius * radius;
}
function pointInRect(point, rectMin, rectMax) {
  return point.x >= rectMin.x && point.x <= rectMax.x && point.y >= rectMin.y && point.y <= rectMax.y;
}
function pointInPolygon(point, vertices) {
  let inside = false;
  const x = point.x, y = point.y;
  const n = vertices.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = vertices[i].x, yi = vertices[i].y;
    const xj = vertices[j].x, yj = vertices[j].y;
    const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function circleCircle(center1, radius1, center2, radius2) {
  const dx = center1.x - center2.x;
  const dy = center1.y - center2.y;
  const distanceSq = dx * dx + dy * dy;
  const radiusSum = radius1 + radius2;
  return distanceSq <= radiusSum * radiusSum;
}
function rectRect(min1, max1, min2, max2) {
  return !(max1.x < min2.x || min1.x > max2.x || max1.y < min2.y || min1.y > max2.y);
}
function circleRect(center, radius, rectMin, rectMax) {
  const closestX = Math.max(rectMin.x, Math.min(center.x, rectMax.x));
  const closestY = Math.max(rectMin.y, Math.min(center.y, rectMax.y));
  const dx = center.x - closestX;
  const dy = center.y - closestY;
  return dx * dx + dy * dy <= radius * radius;
}
function lineCircle(p1, p2, center, radius) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const fx = p1.x - center.x;
  const fy = p1.y - center.y;
  const a = dx * dx + dy * dy;
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - radius * radius;
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return false;
  const sqrtDiscriminant = Math.sqrt(discriminant);
  const t1 = (-b - sqrtDiscriminant) / (2 * a);
  const t2 = (-b + sqrtDiscriminant) / (2 * a);
  return t1 >= 0 && t1 <= 1 || t2 >= 0 && t2 <= 1 || t1 < 0 && t2 > 1;
}
function lineRect(p1, p2, rectMin, rectMax) {
  if (pointInRect(p1, rectMin, rectMax) || pointInRect(p2, rectMin, rectMax)) {
    return true;
  }
  const corners = [
    rectMin,
    { x: rectMax.x, y: rectMin.y },
    rectMax,
    { x: rectMin.x, y: rectMax.y }
  ];
  for (let i = 0; i < 4; i++) {
    const corner1 = corners[i];
    const corner2 = corners[(i + 1) % 4];
    if (lineSegmentIntersection(p1, p2, corner1, corner2)) {
      return true;
    }
  }
  return false;
}
function polygonPolygon(vertices1, vertices2) {
  for (const vertex of vertices1) {
    if (pointInPolygon(vertex, vertices2)) return true;
  }
  for (const vertex of vertices2) {
    if (pointInPolygon(vertex, vertices1)) return true;
  }
  for (let i = 0; i < vertices1.length; i++) {
    const p1 = vertices1[i];
    const p2 = vertices1[(i + 1) % vertices1.length];
    for (let j = 0; j < vertices2.length; j++) {
      const p3 = vertices2[j];
      const p4 = vertices2[(j + 1) % vertices2.length];
      if (lineSegmentIntersection(p1, p2, p3, p4)) {
        return true;
      }
    }
  }
  return false;
}
function circlePolygon(center, radius, vertices) {
  for (const vertex of vertices) {
    if (pointInCircle(vertex, center, radius)) return true;
  }
  if (pointInPolygon(center, vertices)) return true;
  for (let i = 0; i < vertices.length; i++) {
    const p1 = vertices[i];
    const p2 = vertices[(i + 1) % vertices.length];
    if (lineCircle(p1, p2, center, radius)) {
      return true;
    }
  }
  return false;
}
function raycast(origin, direction, maxDistance, obstacles) {
  const hits = [];
  const dir = Vector2.from(direction).normalize();
  const end = dir.clone().multiplyScalar(maxDistance).add(origin);
  for (const obstacle of obstacles) {
    let hit = null;
    let normal = new Vector2(0, 0);
    switch (obstacle.type) {
      case "circle": {
        const circleData = obstacle.data;
        const oc = Vector2.from(origin).subtract(circleData.center);
        const a = dir.dot(dir);
        const b = 2 * oc.dot(dir);
        const c = oc.dot(oc) - circleData.radius * circleData.radius;
        const discriminant = b * b - 4 * a * c;
        if (discriminant >= 0) {
          const t = (-b - Math.sqrt(discriminant)) / (2 * a);
          if (t >= 0 && t <= maxDistance) {
            hit = Vector2.from(origin).add(dir.clone().multiplyScalar(t));
            normal = Vector2.from(hit).subtract(circleData.center).normalize();
          }
        }
        break;
      }
      case "rect": {
        const rectData = obstacle.data;
        if (lineRect(origin, end, rectData.min, rectData.max)) {
          const corners = [
            rectData.min,
            { x: rectData.max.x, y: rectData.min.y },
            rectData.max,
            { x: rectData.min.x, y: rectData.max.y }
          ];
          let closestHit = null;
          let closestDistance = Infinity;
          for (let i = 0; i < 4; i++) {
            const intersection = lineSegmentIntersection(origin, end, corners[i], corners[(i + 1) % 4]);
            if (intersection) {
              const distance = Vector2.distance(origin, intersection);
              if (distance < closestDistance) {
                closestDistance = distance;
                closestHit = intersection;
                const edge = Vector2.from(corners[(i + 1) % 4]).subtract(corners[i]);
                normal = new Vector2(-edge.y, edge.x).normalize();
              }
            }
          }
          hit = closestHit;
        }
        break;
      }
    }
    if (hit) {
      const distance = Vector2.distance(origin, hit);
      hits.push({ point: hit, distance, normal });
    }
  }
  return hits.sort((a, b) => a.distance - b.distance);
}
function distanceToLineSegment(point, segStart, segEnd) {
  const dx = segEnd.x - segStart.x;
  const dy = segEnd.y - segStart.y;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) {
    return Math.sqrt((point.x - segStart.x) ** 2 + (point.y - segStart.y) ** 2);
  }
  let t = ((point.x - segStart.x) * dx + (point.y - segStart.y) * dy) / lengthSq;
  t = Math.max(0, Math.min(1, t));
  const projX = segStart.x + t * dx;
  const projY = segStart.y + t * dy;
  return Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2);
}
function closestPointOnLineSegment(point, segStart, segEnd) {
  const dx = segEnd.x - segStart.x;
  const dy = segEnd.y - segStart.y;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) {
    return new Vector2(segStart.x, segStart.y);
  }
  let t = ((point.x - segStart.x) * dx + (point.y - segStart.y) * dy) / lengthSq;
  t = Math.max(0, Math.min(1, t));
  return new Vector2(segStart.x + t * dx, segStart.y + t * dy);
}
function lineCircleIntersections(p1, p2, center, radius) {
  const intersections = [];
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const fx = p1.x - center.x;
  const fy = p1.y - center.y;
  const a = dx * dx + dy * dy;
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - radius * radius;
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return intersections;
  const sqrtDiscriminant = Math.sqrt(discriminant);
  const t1 = (-b - sqrtDiscriminant) / (2 * a);
  const t2 = (-b + sqrtDiscriminant) / (2 * a);
  if (t1 >= 0 && t1 <= 1) {
    intersections.push(new Vector2(p1.x + t1 * dx, p1.y + t1 * dy));
  }
  if (t2 >= 0 && t2 <= 1 && Math.abs(t2 - t1) > 1e-10) {
    intersections.push(new Vector2(p1.x + t2 * dx, p1.y + t2 * dy));
  }
  return intersections;
}
function lineRectIntersections(p1, p2, rectMin, rectMax) {
  const intersections = [];
  const corners = [
    rectMin,
    { x: rectMax.x, y: rectMin.y },
    rectMax,
    { x: rectMin.x, y: rectMax.y }
  ];
  for (let i = 0; i < 4; i++) {
    const corner1 = corners[i];
    const corner2 = corners[(i + 1) % 4];
    const intersection = lineSegmentIntersection(p1, p2, corner1, corner2);
    if (intersection) {
      const isDuplicate = intersections.some(
        (point) => Math.abs(point.x - intersection.x) < 1e-10 && Math.abs(point.y - intersection.y) < 1e-10
      );
      if (!isDuplicate) {
        intersections.push(intersection);
      }
    }
  }
  return intersections;
}
function circleCircleIntersections(center1, radius1, center2, radius2) {
  const intersections = [];
  const dx = center2.x - center1.x;
  const dy = center2.y - center1.y;
  const distanceSq = dx * dx + dy * dy;
  const distance = Math.sqrt(distanceSq);
  const radiusSum = radius1 + radius2;
  const radiusDiff = Math.abs(radius1 - radius2);
  if (distance > radiusSum || distance < radiusDiff || distance === 0) {
    return intersections;
  }
  const a = (radius1 * radius1 - radius2 * radius2 + distanceSq) / (2 * distance);
  const h = Math.sqrt(radius1 * radius1 - a * a);
  const midX = center1.x + a * dx / distance;
  const midY = center1.y + a * dy / distance;
  const offsetX = h * dy / distance;
  const offsetY = -(h * dx) / distance;
  intersections.push(new Vector2(midX + offsetX, midY + offsetY));
  if (h > 1e-10) {
    intersections.push(new Vector2(midX - offsetX, midY - offsetY));
  }
  return intersections;
}
function rectRectIntersections(min1, max1, min2, max2) {
  const intersections = [];
  const overlapMin = {
    x: Math.max(min1.x, min2.x),
    y: Math.max(min1.y, min2.y)
  };
  const overlapMax = {
    x: Math.min(max1.x, max2.x),
    y: Math.min(max1.y, max2.y)
  };
  if (overlapMin.x <= overlapMax.x && overlapMin.y <= overlapMax.y) {
    intersections.push(new Vector2(overlapMin.x, overlapMin.y));
    intersections.push(new Vector2(overlapMax.x, overlapMin.y));
    intersections.push(new Vector2(overlapMax.x, overlapMax.y));
    intersections.push(new Vector2(overlapMin.x, overlapMax.y));
  }
  return intersections;
}
function circleRectIntersections(center, radius, rectMin, rectMax) {
  const intersections = [];
  const corners = [
    rectMin,
    { x: rectMax.x, y: rectMin.y },
    rectMax,
    { x: rectMin.x, y: rectMax.y }
  ];
  for (let i = 0; i < 4; i++) {
    const corner1 = corners[i];
    const corner2 = corners[(i + 1) % 4];
    const edgeIntersections = lineCircleIntersections(corner1, corner2, center, radius);
    intersections.push(...edgeIntersections);
  }
  const uniqueIntersections = [];
  for (const point of intersections) {
    const isDuplicate = uniqueIntersections.some(
      (existing) => Math.abs(existing.x - point.x) < 1e-10 && Math.abs(existing.y - point.y) < 1e-10
    );
    if (!isDuplicate) {
      uniqueIntersections.push(point);
    }
  }
  return uniqueIntersections;
}
function polygonPolygonIntersections(vertices1, vertices2) {
  const intersections = [];
  for (let i = 0; i < vertices1.length; i++) {
    const p1 = vertices1[i];
    const p2 = vertices1[(i + 1) % vertices1.length];
    for (let j = 0; j < vertices2.length; j++) {
      const p3 = vertices2[j];
      const p4 = vertices2[(j + 1) % vertices2.length];
      const intersection = lineSegmentIntersection(p1, p2, p3, p4);
      if (intersection) {
        const isDuplicate = intersections.some(
          (point) => Math.abs(point.x - intersection.x) < 1e-10 && Math.abs(point.y - intersection.y) < 1e-10
        );
        if (!isDuplicate) {
          intersections.push(intersection);
        }
      }
    }
  }
  return intersections;
}
function circlePolygonIntersections(center, radius, vertices) {
  const intersections = [];
  for (let i = 0; i < vertices.length; i++) {
    const p1 = vertices[i];
    const p2 = vertices[(i + 1) % vertices.length];
    const edgeIntersections = lineCircleIntersections(p1, p2, center, radius);
    intersections.push(...edgeIntersections);
  }
  const uniqueIntersections = [];
  for (const point of intersections) {
    const isDuplicate = uniqueIntersections.some(
      (existing) => Math.abs(existing.x - point.x) < 1e-10 && Math.abs(existing.y - point.y) < 1e-10
    );
    if (!isDuplicate) {
      uniqueIntersections.push(point);
    }
  }
  return uniqueIntersections;
}
function solveCubic(k3, k2, k1, k0, epsilon = 1e-10) {
  if (Math.abs(k3) < epsilon) {
    return solveQuadratic(k2, k1, k0);
  }
  const a = k2 / k3;
  const b = k1 / k3;
  const c = k0 / k3;
  const Q = (a * a - 3 * b) / 9;
  const R = (2 * a * a * a - 9 * a * b + 27 * c) / 54;
  const D = Q * Q * Q - R * R;
  const roots = [];
  if (D >= 0) {
    const theta = Math.acos(R / Math.sqrt(Q * Q * Q));
    const sqrtQ = Math.sqrt(Q);
    roots.push(-2 * sqrtQ * Math.cos(theta / 3) - a / 3);
    roots.push(-2 * sqrtQ * Math.cos((theta + 2 * Math.PI) / 3) - a / 3);
    roots.push(-2 * sqrtQ * Math.cos((theta - 2 * Math.PI) / 3) - a / 3);
  } else {
    const sqrtD = Math.sqrt(-D);
    const S = Math.cbrt(R + sqrtD);
    const T = Math.cbrt(R - sqrtD);
    roots.push(S + T - a / 3);
  }
  return roots;
}
function solveQuadratic(a, b, c, epsilon = 1e-10) {
  if (Math.abs(a) < epsilon) {
    if (Math.abs(b) < epsilon) return [];
    return [-c / b];
  }
  const D = b * b - 4 * a * c;
  if (D < 0) return [];
  if (D === 0) return [-b / (2 * a)];
  const sqrtD = Math.sqrt(D);
  return [(-b + sqrtD) / (2 * a), (-b - sqrtD) / (2 * a)];
}
function lineQuadraticBezierIntersections(start, end, cp) {
  const A_line = end.y - start.y;
  const B_line = start.x - end.x;
  const C_line = end.x * start.y - start.x * end.y;
  const A_bezier_x = cp[0].x - 2 * cp[1].x + cp[2].x;
  const B_bezier_x = 2 * (cp[1].x - cp[0].x);
  const C_bezier_x = cp[0].x;
  const A_bezier_y = cp[0].y - 2 * cp[1].y + cp[2].y;
  const B_bezier_y = 2 * (cp[1].y - cp[0].y);
  const C_bezier_y = cp[0].y;
  const A = A_line * A_bezier_x + B_line * A_bezier_y;
  const B = A_line * B_bezier_x + B_line * B_bezier_y;
  const C = A_line * C_bezier_x + B_line * C_bezier_y + C_line;
  const roots = solveQuadratic(A, B, C);
  return roots.filter((t) => t >= 0 && t <= 1).map((t) => {
    const tt = t * t;
    return Vector2.create(
      A_bezier_x * tt + B_bezier_x * t + C_bezier_x,
      A_bezier_y * tt + B_bezier_y * t + C_bezier_y
    );
  });
}
function lineCubicBezierIntersections(start, end, cp) {
  const A_bezier_x = cp[0].x - 3 * cp[1].x + 3 * cp[2].x - cp[3].x;
  const B_bezier_x = 3 * (cp[1].x - cp[0].x) - 6 * cp[2].x + 3 * cp[3].x;
  const C_bezier_x = 3 * (cp[2].x - cp[1].x) + 3 * cp[3].x - cp[0].x;
  const D_bezier_x = cp[0].x;
  const A_bezier_y = cp[0].y - 3 * cp[1].y + 3 * cp[2].y - cp[3].y;
  const B_bezier_y = 3 * (cp[1].y - cp[0].y) - 6 * cp[2].y + 3 * cp[3].y;
  const C_bezier_y = 3 * (cp[2].y - cp[1].y) + 3 * cp[3].y - cp[0].y;
  const D_bezier_y = cp[0].y;
  const A_line = end.y - start.y;
  const B_line = start.x - end.x;
  const C_line = end.x * start.y - start.x * end.y;
  const A = A_line * A_bezier_x + B_line * A_bezier_y;
  const B = A_line * B_bezier_x + B_line * B_bezier_y;
  const C = A_line * C_bezier_x + B_line * C_bezier_y + C_line;
  const D = A_line * D_bezier_x + B_line * D_bezier_y + C_line;
  const roots = solveCubic(A, B, C, D);
  return roots.filter((t) => t >= 0 && t <= 1).map((t) => {
    const tt = t * t;
    return Vector2.create(
      A_bezier_x * tt * tt + B_bezier_x * tt * 2 * t + C_bezier_x * tt + D_bezier_x,
      A_bezier_y * tt * tt + B_bezier_y * tt * 2 * t + C_bezier_y * tt + D_bezier_y
    );
  });
}
export {
  circleCircle,
  circleCircleIntersections,
  circlePolygon,
  circlePolygonIntersections,
  circleRect,
  circleRectIntersections,
  closestPointOnLineSegment,
  distanceToLineSegment,
  isPointOnLineSegment,
  lineCircle,
  lineCircleIntersections,
  lineCubicBezierIntersections,
  lineLineIntersection,
  lineQuadraticBezierIntersections,
  lineRect,
  lineRectIntersections,
  lineSegmentIntersection,
  pointInCircle,
  pointInPolygon,
  pointInRect,
  polygonPolygon,
  polygonPolygonIntersections,
  raycast,
  rectRect,
  rectRectIntersections
};
