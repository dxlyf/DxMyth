import { Shape } from '../shapes/Shape';
import { Vec3 } from '../math/Vec3';
import { Quaternion } from '../math/Quaternion';
/** ConvexPolyhedronContactPoint */
export type ConvexPolyhedronContactPoint = {
    point: Vec3;
    normal: Vec3;
    depth: number;
};
/**
 * A set of polygons describing a convex shape.
 *
 * The shape MUST be convex for the code to work properly. No polygons may be coplanar (contained
 * in the same 3D plane), instead these should be merged into one polygon.
 *
 * @author qiao / https://github.com/qiao (original author, see https://github.com/qiao/three.js/commit/85026f0c769e4000148a67d45a9e9b9c5108836f)
 * @author schteppe / https://github.com/schteppe
 * @see https://www.altdevblogaday.com/2011/05/13/contact-generation-between-3d-convex-meshes/
 *
 * @todo Move the clipping functions to ContactGenerator?
 * @todo Automatically merge coplanar polygons in constructor.
 * @example
 *     const convexShape = new CANNON.ConvexPolyhedron({ vertices, faces })
 *     const convexBody = new CANNON.Body({ mass: 1, shape: convexShape })
 *     world.addBody(convexBody)
 */
export declare class ConvexPolyhedron extends Shape {
    /** vertices */
    vertices: Vec3[];
    /**
     * Array of integer arrays, indicating which vertices each face consists of
     */
    faces: number[][];
    /** faceNormals */
    faceNormals: Vec3[];
    /** worldVertices */
    worldVertices: Vec3[];
    /** worldVerticesNeedsUpdate */
    worldVerticesNeedsUpdate: boolean;
    /** worldFaceNormals */
    worldFaceNormals: Vec3[];
    /** worldFaceNormalsNeedsUpdate */
    worldFaceNormalsNeedsUpdate: boolean;
    /**
     * If given, these locally defined, normalized axes are the only ones being checked when doing separating axis check.
     */
    uniqueAxes: Vec3[] | null;
    /** uniqueEdges */
    uniqueEdges: Vec3[];
    /**
     * @param vertices An array of Vec3's
     * @param faces Array of integer arrays, describing which vertices that is included in each face.
     */
    constructor(props?: {
        /** An array of Vec3's */
        vertices?: Vec3[];
        /** Array of integer arrays, describing which vertices that is included in each face. */
        faces?: number[][];
        /** normals */
        normals?: Vec3[];
        /** axes */
        axes?: Vec3[];
        /** boundingSphereRadius */
        boundingSphereRadius?: number;
    });
    /**
     * Computes uniqueEdges
     */
    computeEdges(): void;
    /**
     * Compute the normals of the faces.
     * Will reuse existing Vec3 objects in the `faceNormals` array if they exist.
     */
    computeNormals(): void;
    /**
     * Compute the normal of a face from its vertices
     */
    getFaceNormal(i: number, target: Vec3): void;
    /**
     * Get face normal given 3 vertices
     */
    static computeNormal(va: Vec3, vb: Vec3, vc: Vec3, target: Vec3): void;
    /**
     * @param minDist Clamp distance
     * @param result The an array of contact point objects, see clipFaceAgainstHull
     */
    clipAgainstHull(posA: Vec3, quatA: Quaternion, hullB: ConvexPolyhedron, posB: Vec3, quatB: Quaternion, separatingNormal: Vec3, minDist: number, maxDist: number, result: ConvexPolyhedronContactPoint[]): void;
    /**
     * Find the separating axis between this hull and another
     * @param target The target vector to save the axis in
     * @return Returns false if a separation is found, else true
     */
    findSeparatingAxis(hullB: ConvexPolyhedron, posA: Vec3, quatA: Quaternion, posB: Vec3, quatB: Quaternion, target: Vec3, faceListA?: number[] | null, faceListB?: number[] | null): boolean;
    /**
     * Test separating axis against two hulls. Both hulls are projected onto the axis and the overlap size is returned if there is one.
     * @return The overlap depth, or FALSE if no penetration.
     */
    testSepAxis(axis: Vec3, hullB: ConvexPolyhedron, posA: Vec3, quatA: Quaternion, posB: Vec3, quatB: Quaternion): number | false;
    /**
     * calculateLocalInertia
     */
    calculateLocalInertia(mass: number, target: Vec3): void;
    /**
     * @param face_i Index of the face
     */
    getPlaneConstantOfFace(face_i: number): number;
    /**
     * Clip a face against a hull.
     * @param worldVertsB1 An array of Vec3 with vertices in the world frame.
     * @param minDist Distance clamping
     * @param Array result Array to store resulting contact points in. Will be objects with properties: point, depth, normal. These are represented in world coordinates.
     */
    clipFaceAgainstHull(separatingNormal: Vec3, posA: Vec3, quatA: Quaternion, worldVertsB1: Vec3[], minDist: number, maxDist: number, result: ConvexPolyhedronContactPoint[]): void;
    /**
     * Clip a face in a hull against the back of a plane.
     * @param planeConstant The constant in the mathematical plane equation
     */
    clipFaceAgainstPlane(inVertices: Vec3[], outVertices: Vec3[], planeNormal: Vec3, planeConstant: number): Vec3[];
    /**
     * Updates `.worldVertices` and sets `.worldVerticesNeedsUpdate` to false.
     */
    computeWorldVertices(position: Vec3, quat: Quaternion): void;
    computeLocalAABB(aabbmin: Vec3, aabbmax: Vec3): void;
    /**
     * Updates `worldVertices` and sets `worldVerticesNeedsUpdate` to false.
     */
    computeWorldFaceNormals(quat: Quaternion): void;
    /**
     * updateBoundingSphereRadius
     */
    updateBoundingSphereRadius(): void;
    /**
     * calculateWorldAABB
     */
    calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;
    /**
     * Get approximate convex volume
     */
    volume(): number;
    /**
     * Get an average of all the vertices positions
     */
    getAveragePointLocal(target?: Vec3): Vec3;
    /**
     * Transform all local points. Will change the .vertices
     */
    transformAllPoints(offset: Vec3, quat: Quaternion): void;
    /**
     * Checks whether p is inside the polyhedra. Must be in local coords.
     * The point lies outside of the convex hull of the other points if and only if the direction
     * of all the vectors from it to those other points are on less than one half of a sphere around it.
     * @param p A point given in local coordinates
     */
    pointIsInside(p: Vec3): 1 | -1 | false;
    /**
     * Get max and min dot product of a convex hull at position (pos,quat) projected onto an axis.
     * Results are saved in the array maxmin.
     * @param result result[0] and result[1] will be set to maximum and minimum, respectively.
     */
    static project(shape: ConvexPolyhedron, axis: Vec3, pos: Vec3, quat: Quaternion, result: number[]): void;
}
