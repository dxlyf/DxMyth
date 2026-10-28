function lerp(a, b, t) {
  return a + (b - a) * t;
}
function lerpVec2(a, b, t) {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
}
function boundingBoxesIntersect(bbox1, bbox2) {
  const [b1min, b1max] = bbox1;
  const [b2min, b2max] = bbox2;
  return !(b1min[0] > b2max[0] || b1max[0] < b2min[0] || b1min[1] > b2max[1] || b1max[1] < b2min[1]);
}
class Geometry {
}
class GeometryEpsilon extends Geometry {
  epsilon;
  constructor(epsilon = 1e-10) {
    super();
    this.epsilon = epsilon;
  }
  snap0(v) {
    if (Math.abs(v) < this.epsilon) {
      return 0;
    }
    return v;
  }
  snap01(v) {
    if (Math.abs(v) < this.epsilon) {
      return 0;
    }
    if (Math.abs(1 - v) < this.epsilon) {
      return 1;
    }
    return v;
  }
  isCollinear(p1, p2, p3) {
    const dx1 = p1[0] - p2[0];
    const dy1 = p1[1] - p2[1];
    const dx2 = p2[0] - p3[0];
    const dy2 = p2[1] - p3[1];
    return Math.abs(dx1 * dy2 - dx2 * dy1) < this.epsilon;
  }
  solveCubicNormalized(a, b, c) {
    const a3 = a / 3;
    const b3 = b / 3;
    const Q = a3 * a3 - b3;
    const R = a3 * (a3 * a3 - b / 2) + c / 2;
    if (Math.abs(R) < this.epsilon && Math.abs(Q) < this.epsilon) {
      return [-a3];
    }
    const F = a3 * (a3 * (4 * a3 * c - b3 * b) - 2 * b * c) + 4 * b3 * b3 * b3 + c * c;
    if (Math.abs(F) < this.epsilon) {
      const sqrtQ = Math.sqrt(Q);
      return R > 0 ? [-2 * sqrtQ - a / 3, sqrtQ - a / 3] : [-sqrtQ - a / 3, 2 * sqrtQ - a / 3];
    }
    const Q3 = Q * Q * Q;
    const R2 = R * R;
    if (R2 < Q3) {
      const ratio = (R < 0 ? -1 : 1) * Math.sqrt(R2 / Q3);
      const theta = Math.acos(ratio);
      const norm = -2 * Math.sqrt(Q);
      const x0 = norm * Math.cos(theta / 3) - a3;
      const x1 = norm * Math.cos((theta + 2 * Math.PI) / 3) - a3;
      const x2 = norm * Math.cos((theta - 2 * Math.PI) / 3) - a3;
      return [x0, x1, x2].sort((x, y) => x - y);
    } else {
      const A = (R < 0 ? 1 : -1) * Math.pow(Math.abs(R) + Math.sqrt(R2 - Q3), 1 / 3);
      const B = Math.abs(A) >= this.epsilon ? Q / A : 0;
      return [A + B - a3];
    }
  }
  solveCubic(a, b, c, d) {
    if (Math.abs(a) < this.epsilon) {
      if (Math.abs(b) < this.epsilon) {
        if (Math.abs(c) < this.epsilon) {
          return Math.abs(d) < this.epsilon ? [0] : [];
        }
        return [-d / c];
      }
      const b2 = 2 * b;
      let D = c * c - 4 * b * d;
      if (Math.abs(D) < this.epsilon) {
        return [-c / b2];
      } else if (D > 0) {
        D = Math.sqrt(D);
        return [(-c + D) / b2, (-c - D) / b2].sort((x, y) => x - y);
      }
      return [];
    }
    return this.solveCubicNormalized(b / a, c / a, d / a);
  }
  isEqualVec2(a, b) {
    return Math.abs(a[0] - b[0]) < this.epsilon && Math.abs(a[1] - b[1]) < this.epsilon;
  }
  compareVec2(a, b) {
    if (Math.abs(b[0] - a[0]) < this.epsilon) {
      return Math.abs(b[1] - a[1]) < this.epsilon ? 0 : a[1] < b[1] ? -1 : 1;
    }
    return a[0] < b[0] ? -1 : 1;
  }
}
export {
  Geometry,
  GeometryEpsilon,
  boundingBoxesIntersect,
  lerp,
  lerpVec2
};
