import { Shape } from '../shapes/Shape';
import { Vec3 } from '../math/Vec3';
import { ConvexPolyhedron } from '../shapes/ConvexPolyhedron';
import { Quaternion } from '../math/Quaternion';
/**
 * A 3d box shape.
 * @example
 *     const size = 1
 *     const halfExtents = new CANNON.Vec3(size, size, size)
 *     const boxShape = new CANNON.Box(halfExtents)
 *     const boxBody = new CANNON.Body({ mass: 1, shape: boxShape })
 *     world.addBody(boxBody)
 */
export declare class Box extends Shape {
    /**
     * The half extents of the box.
     */
    halfExtents: Vec3;
    /**
     * Used by the contact generator to make contacts with other convex polyhedra for example.
     */
    convexPolyhedronRepresentation: ConvexPolyhedron;
    constructor(halfExtents: Vec3);
    /**
     * Updates the local convex polyhedron representation used for some collisions.
     */
    updateConvexPolyhedronRepresentation(): void;
    /**
     * Calculate the inertia of the box.
     */
    calculateLocalInertia(mass: number, target?: Vec3): Vec3;
    static calculateInertia(halfExtents: Vec3, mass: number, target: Vec3): void;
    /**
     * Get the box 6 side normals
     * @param sixTargetVectors An array of 6 vectors, to store the resulting side normals in.
     * @param quat Orientation to apply to the normal vectors. If not provided, the vectors will be in respect to the local frame.
     */
    getSideNormals(sixTargetVectors: Vec3[], quat: Quaternion): Vec3[];
    /**
     * Returns the volume of the box.
     */
    volume(): number;
    /**
     * updateBoundingSphereRadius
     */
    updateBoundingSphereRadius(): void;
    /**
     * forEachWorldCorner
     */
    forEachWorldCorner(pos: Vec3, quat: Quaternion, callback: (x: number, y: number, z: number) => void): void;
    /**
     * calculateWorldAABB
     */
    calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;
}
