import { Vector3 } from './Vector3';
import { Plane } from './Plane';
import { Box3 } from './Box3';
import { EPSILON } from './MathUtils';

/** Triangle used by raycasters and normal computation helpers. */
export class Triangle {
  a: Vector3;
  b: Vector3;
  c: Vector3;

  constructor(a?: Vector3, b?: Vector3, c?: Vector3) {
    this.a = a ?? new Vector3();
    this.b = b ?? new Vector3();
    this.c = c ?? new Vector3();
  }

  static getNormal(a: Vector3, b: Vector3, c: Vector3, target = new Vector3()): Vector3 {
    target.subVectors(c, b);
    _v0.subVectors(a, b);
    target.cross(_v0);
    const len = target.length();
    return len === 0 ? target.set(0, 0, 0) : target.divideScalar(len);
  }

  static getBarycoord(
    point: Vector3,
    a: Vector3,
    b: Vector3,
    c: Vector3,
    target = new Vector3(),
  ): Vector3 {
    _v0.subVectors(c, a);
    _v1.subVectors(b, a);
    _v2.subVectors(point, a);
    const dot00 = _v0.dot(_v0);
    const dot01 = _v0.dot(_v1);
    const dot02 = _v0.dot(_v2);
    const dot11 = _v1.dot(_v1);
    const dot12 = _v1.dot(_v2);
    const denom = dot00 * dot11 - dot01 * dot01;
    if (denom === 0) return target.set(0, 0, 0);
    const invDenom = 1 / denom;
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
    return target.set(1 - u - v, v, u);
  }

  static containsPoint(
    point: Vector3,
    a: Vector3,
    b: Vector3,
    c: Vector3,
  ): boolean {
    Triangle.getBarycoord(point, a, b, c, _v3);
    return _v3.x >= 0 && _v3.y >= 0 && _v3.x + _v3.y <= 1;
  }

  set(a: Vector3, b: Vector3, c: Vector3): this {
    this.a.copy(a);
    this.b.copy(b);
    this.c.copy(c);
    return this;
  }

  setFromPointsAndIndices(points: Vector3[], i0: number, i1: number, i2: number): this {
    this.a.copy(points[i0]);
    this.b.copy(points[i1]);
    this.c.copy(points[i2]);
    return this;
  }

  copy(triangle: Triangle): this {
    return this.set(triangle.a, triangle.b, triangle.c);
  }

  clone(): Triangle {
    return new Triangle(this.a.clone(), this.b.clone(), this.c.clone());
  }

  getArea(): number {
    return _v0.subVectors(this.c, this.b).cross(_v1.subVectors(this.a, this.b)).length() * 0.5;
  }

  getMidpoint(target = new Vector3()): Vector3 {
    return target.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
  }

  getNormal(target = new Vector3()): Vector3 {
    return Triangle.getNormal(this.a, this.b, this.c, target);
  }

  getPlane(target = new Plane()): Plane {
    return target.setFromCoplanarPoints(this.a, this.b, this.c);
  }

  getBarycoord(point: Vector3, target = new Vector3()): Vector3 {
    return Triangle.getBarycoord(point, this.a, this.b, this.c, target);
  }

  containsPoint(point: Vector3): boolean {
    return Triangle.containsPoint(point, this.a, this.b, this.c);
  }

  getUV(point: Vector3, uv1: { x: number; y: number }, uv2: { x: number; y: number }, uv3: { x: number; y: number }, target: { x: number; y: number }): { x: number; y: number } {
    this.getBarycoord(point, _v3);
    target.x = uv1.x * _v3.x + uv2.x * _v3.y + uv3.x * _v3.z;
    target.y = uv1.y * _v3.x + uv2.y * _v3.y + uv3.y * _v3.z;
    return target;
  }

  intersectsBox(box: Box3): boolean {
    return box.intersectsTriangle(this);
  }

  closestPointToPoint(point: Vector3, target = new Vector3()): Vector3 {
    const a = this.a;
    const b = this.b;
    const c = this.c;

    _ab.subVectors(b, a);
    _ac.subVectors(c, a);
    _ap.subVectors(point, a);
    const d1 = _ab.dot(_ap);
    const d2 = _ac.dot(_ap);
    if (d1 <= 0 && d2 <= 0) return target.copy(a);

    _bp.subVectors(point, b);
    const d3 = _ab.dot(_bp);
    const d4 = _ac.dot(_bp);
    if (d3 >= 0 && d4 <= d3) return target.copy(b);

    const vc = d1 * d4 - d3 * d2;
    if (vc <= 0 && d1 >= 0 && d3 <= 0) {
      const v = d1 / (d1 - d3);
      return target.copy(a).addScaledVector(_ab, v);
    }

    _cp.subVectors(point, c);
    const d5 = _ab.dot(_cp);
    const d6 = _ac.dot(_cp);
    if (d6 >= 0 && d5 <= d6) return target.copy(c);

    const vb = d5 * d2 - d1 * d6;
    if (vb <= 0 && d2 >= 0 && d6 <= 0) {
      const w = d2 / (d2 - d6);
      return target.copy(a).addScaledVector(_ac, w);
    }

    const va = d3 * d6 - d5 * d4;
    if (va <= 0 && d4 - d3 >= 0 && d5 - d6 >= 0) {
      const w = (d4 - d3) / (d4 - d3 + (d5 - d6));
      return target.copy(b).addScaledVector(_bc.subVectors(c, b), w);
    }

    const denom = 1 / (va + vb + vc);
    const v = vb * denom;
    const w = vc * denom;
    return target.copy(a).addScaledVector(_ab, v).addScaledVector(_ac, w);
  }

  equals(triangle: Triangle): boolean {
    return triangle.a.equals(this.a) && triangle.b.equals(this.b) && triangle.c.equals(this.c);
  }

  /** Cheap degenerate check used by geometry validation in tests. */
  isDegenerate(): boolean {
    return (
      this.a.distanceToSquared(this.b) < EPSILON * EPSILON ||
      this.b.distanceToSquared(this.c) < EPSILON * EPSILON ||
      this.c.distanceToSquared(this.a) < EPSILON * EPSILON
    );
  }
}

const _v0 = new Vector3();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _ab = new Vector3();
const _ac = new Vector3();
const _bc = new Vector3();
const _ap = new Vector3();
const _bp = new Vector3();
const _cp = new Vector3();
