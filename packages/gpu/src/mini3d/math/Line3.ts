import { Vector3 } from './Vector3';
import { Matrix4 } from './Matrix4';

/** Metric distance helpers. */
export const distance = (a: Vector3, b: Vector3): number => a.distanceTo(b);
export const distanceSquared = (a: Vector3, b: Vector3): number => a.distanceToSquared(b);
export const manhattanDistance = (a: Vector3, b: Vector3): number => a.manhattanDistanceTo(b);

/** 3D line segment (used by helpers, raycasters and the line geometry). */
export class Line3 {
  start: Vector3;
  end: Vector3;

  constructor(start: Vector3 = new Vector3(), end: Vector3 = new Vector3()) {
    this.start = start;
    this.end = end;
  }

  set(start: Vector3, end: Vector3): this {
    this.start.copy(start);
    this.end.copy(end);
    return this;
  }

  copy(line: Line3): this {
    return this.set(line.start, line.end);
  }

  clone(): Line3 {
    return new Line3(this.start.clone(), this.end.clone());
  }

  getCenter(target: Vector3 = new Vector3()): Vector3 {
    return target.addVectors(this.start, this.end).multiplyScalar(0.5);
  }

  delta(target: Vector3 = new Vector3()): Vector3 {
    return target.subVectors(this.end, this.start);
  }

  distanceSq(): number {
    return this.start.distanceToSquared(this.end);
  }

  distance(): number {
    return this.start.distanceTo(this.end);
  }

  at(t: number, target: Vector3 = new Vector3()): Vector3 {
    return this.delta(target).multiplyScalar(t).add(this.start);
  }

  closestPointToPointParameter(
    point: Vector3,
    clampToSegment = true,
  ): number {
    _startP.subVectors(point, this.start);
    _startEnd.subVectors(this.end, this.start);
    const dotProduct = _startEnd.dot(_startEnd) || 1;
    const t = _startP.dot(_startEnd) / dotProduct;
    return clampToSegment ? Math.max(0, Math.min(1, t)) : t;
  }

  closestPointToPoint(point: Vector3, clampToSegment = true, target: Vector3 = new Vector3()): Vector3 {
    const t = this.closestPointToPointParameter(point, clampToSegment);
    return this.at(t, target);
  }

  equals(line: Line3): boolean {
    return line.start.equals(this.start) && line.end.equals(this.end);
  }

  /** Transform (or just the endpoints) through a 4x4 matrix. */
  applyMatrix4(matrix: Matrix4): this {
    this.start.applyMatrix4(matrix);
    this.end.applyMatrix4(matrix);
    return this;
  }
}

const _startP = new Vector3();
const _startEnd = new Vector3();
