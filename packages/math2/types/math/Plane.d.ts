import { Matrix3 } from './Matrix3';
import { Matrix4 } from './Matrix4';
import { Sphere } from './Sphere';
import { Vector3 } from './Vector3';
/** Infinite plane described by `normal · p + constant = 0`. */
export declare class Plane {
    readonly normal: Vector3;
    constant: number;
    constructor(normal?: Vector3, constant?: number);
    set(normal: Readonly<Vector3>, constant: number): this;
    setComponents(x: number, y: number, z: number, constant: number): this;
    setFromNormalAndCoplanarPoint(normal: Readonly<Vector3>, point: Readonly<Vector3>): this;
    setFromCoplanarPoints(a: Readonly<Vector3>, b: Readonly<Vector3>, c: Readonly<Vector3>): this;
    copy(plane: Readonly<Plane>): this;
    clone(): Plane;
    normalize(): this;
    negate(): this;
    distanceToPoint(point: Readonly<Vector3>): number;
    distanceToSphere(sphere: Readonly<Sphere>): number;
    projectPoint(point: Readonly<Vector3>, out?: Vector3): Vector3;
    coplanarPoint(out?: Vector3): Vector3;
    translate(offset: Readonly<Vector3>): this;
    applyMatrix4(m: Readonly<Matrix4>, normalMatrix?: Matrix3): this;
    equals(plane: Readonly<Plane>, epsilon?: number): boolean;
}
