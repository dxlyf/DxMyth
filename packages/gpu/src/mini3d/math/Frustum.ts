import { Vector3 } from './Vector3';
import { Plane } from './Plane';
import { Matrix4 } from './Matrix4';
import { Sphere } from './Sphere';
import { Box3 } from './Box3';

export type FrustumPlane = 'near' | 'far' | 'left' | 'right' | 'top' | 'bottom';

/**
 * View frustum built from a projection*view matrix. Backends use this for
 * cheap CPU-side culling of meshes whose bounding sphere lies outside.
 */
export class Frustum {
  planes: [Plane, Plane, Plane, Plane, Plane, Plane];

  constructor(
    p0?: Plane,
    p1?: Plane,
    p2?: Plane,
    p3?: Plane,
    p4?: Plane,
    p5?: Plane,
  ) {
    this.planes = [
      p0 ?? new Plane(),
      p1 ?? new Plane(),
      p2 ?? new Plane(),
      p3 ?? new Plane(),
      p4 ?? new Plane(),
      p5 ?? new Plane(),
    ];
  }

  set(
    p0: Plane, p1: Plane, p2: Plane, p3: Plane, p4: Plane, p5: Plane,
  ): this {
    const planes = this.planes;
    planes[0].copy(p0);
    planes[1].copy(p1);
    planes[2].copy(p2);
    planes[3].copy(p3);
    planes[4].copy(p4);
    planes[5].copy(p5);
    return this;
  }

  copy(frustum: Frustum): this {
    for (let i = 0; i < 6; i++) this.planes[i].copy(frustum.planes[i]);
    return this;
  }

  clone(): Frustum {
    return new Frustum().copy(this);
  }

  /**
   * Extracts the six planes from a combined projection*view matrix using the
   * Gribb/Hartmann method. Plane order is [left, right, bottom, top, near, far]
   * which is the order WebGPU/WebGL clipping uses.
   */
  setFromProjectionMatrix(m: Matrix4): this {
    const me = m.elements;
    const planes = this.planes;

    // Row-major access: me[column * 4 + row].
    const r0 = [me[0], me[4], me[8], me[12]];
    const r1 = [me[1], me[5], me[9], me[13]];
    const r2 = [me[2], me[6], me[10], me[14]];
    const r3 = [me[3], me[7], me[11], me[15]];

    planes[0].setComponents(r3[0] + r0[0], r3[1] + r0[1], r3[2] + r0[2], r3[3] + r0[3]).normalize();
    planes[1].setComponents(r3[0] - r0[0], r3[1] - r0[1], r3[2] - r0[2], r3[3] - r0[3]).normalize();
    planes[2].setComponents(r3[0] + r1[0], r3[1] + r1[1], r3[2] + r1[2], r3[3] + r1[3]).normalize();
    planes[3].setComponents(r3[0] - r1[0], r3[1] - r1[1], r3[2] - r1[2], r3[3] - r1[3]).normalize();
    planes[4].setComponents(r3[0] + r2[0], r3[1] + r2[1], r3[2] + r2[2], r3[3] + r2[3]).normalize();
    planes[5].setComponents(r3[0] - r2[0], r3[1] - r2[1], r3[2] - r2[2], r3[3] - r2[3]).normalize();

    return this;
  }

  intersectsObject(object: { boundingSphere?: Sphere | null; matrixWorld: Matrix4 }): boolean {
    const sphere = object.boundingSphere;
    if (!sphere) return true;
    _sphere.copy(sphere).applyMatrix4(object.matrixWorld);
    return this.intersectsSphere(_sphere);
  }

  intersectsSphere(sphere: Sphere): boolean {
    const planes = this.planes;
    const center = sphere.center;
    const negRadius = -sphere.radius;
    for (let i = 0; i < 6; i++) {
      if (planes[i].distanceToPoint(center) < negRadius) return false;
    }
    return true;
  }

  intersectsBox(box: Box3): boolean {
    const planes = this.planes;
    for (let i = 0; i < 6; i++) {
      const plane = planes[i];
      // Pick the box corner furthest along the plane normal.
      const x = plane.normal.x > 0 ? box.max.x : box.min.x;
      const y = plane.normal.y > 0 ? box.max.y : box.min.y;
      const z = plane.normal.z > 0 ? box.max.z : box.min.z;
      if (plane.distanceToPoint(_v.set(x, y, z)) < 0) return false;
    }
    return true;
  }

  containsPoint(point: Vector3): boolean {
    for (let i = 0; i < 6; i++) {
      if (this.planes[i].distanceToPoint(point) < 0) return false;
    }
    return true;
  }
}

const _sphere = new Sphere();
const _v = new Vector3();
