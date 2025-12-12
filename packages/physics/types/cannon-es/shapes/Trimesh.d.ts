import { Shape } from '../shapes/Shape';
import { Vec3 } from '../math/Vec3';
import { AABB } from '../collision/AABB';
import { Octree } from '../utils/Octree';
import { Quaternion } from '../math/Quaternion';
/**
 * Trimesh.
 * @example
 *     // How to make a mesh with a single triangle
 *     const vertices = [
 *         0, 0, 0, // vertex 0
 *         1, 0, 0, // vertex 1
 *         0, 1, 0  // vertex 2
 *     ]
 *     const indices = [
 *         0, 1, 2  // triangle 0
 *     ]
 *     const trimeshShape = new CANNON.Trimesh(vertices, indices)
 */
export declare class Trimesh extends Shape {
    /**
     * vertices
     */
    vertices: Float32Array;
    /**
     * Array of integers, indicating which vertices each triangle consists of. The length of this array is thus 3 times the number of triangles.
     */
    indices: Int16Array;
    /**
     * The normals data.
     */
    normals: Float32Array;
    /**
     * The local AABB of the mesh.
     */
    aabb: AABB;
    /**
     * References to vertex pairs, making up all unique edges in the trimesh.
     */
    edges: Int16Array | null;
    /**
     * Local scaling of the mesh. Use .setScale() to set it.
     */
    scale: Vec3;
    /**
     * The indexed triangles. Use .updateTree() to update it.
     */
    tree: Octree;
    constructor(vertices: number[], indices: number[]);
    /**
     * updateTree
     */
    updateTree(): void;
    /**
     * Get triangles in a local AABB from the trimesh.
     * @param result An array of integers, referencing the queried triangles.
     */
    getTrianglesInAABB(aabb: AABB, result: number[]): number[];
    /**
     * setScale
     */
    setScale(scale: Vec3): void;
    /**
     * Compute the normals of the faces. Will save in the `.normals` array.
     */
    updateNormals(): void;
    /**
     * Update the `.edges` property
     */
    updateEdges(): void;
    /**
     * Get an edge vertex
     * @param firstOrSecond 0 or 1, depending on which one of the vertices you need.
     * @param vertexStore Where to store the result
     */
    getEdgeVertex(edgeIndex: number, firstOrSecond: number, vertexStore: Vec3): void;
    /**
     * Get a vector along an edge.
     */
    getEdgeVector(edgeIndex: number, vectorStore: Vec3): void;
    /**
     * Get face normal given 3 vertices
     */
    static computeNormal(va: Vec3, vb: Vec3, vc: Vec3, target: Vec3): void;
    /**
     * Get vertex i.
     * @return The "out" vector object
     */
    getVertex(i: number, out: Vec3): Vec3;
    /**
     * Get raw vertex i
     * @return The "out" vector object
     */
    private _getUnscaledVertex;
    /**
     * Get a vertex from the trimesh,transformed by the given position and quaternion.
     * @return The "out" vector object
     */
    getWorldVertex(i: number, pos: Vec3, quat: Quaternion, out: Vec3): Vec3;
    /**
     * Get the three vertices for triangle i.
     */
    getTriangleVertices(i: number, a: Vec3, b: Vec3, c: Vec3): void;
    /**
     * Compute the normal of triangle i.
     * @return The "target" vector object
     */
    getNormal(i: number, target: Vec3): Vec3;
    /**
     * @return The "target" vector object
     */
    calculateLocalInertia(mass: number, target: Vec3): Vec3;
    /**
     * Compute the local AABB for the trimesh
     */
    computeLocalAABB(aabb: AABB): void;
    /**
     * Update the `.aabb` property
     */
    updateAABB(): void;
    /**
     * Will update the `.boundingSphereRadius` property
     */
    updateBoundingSphereRadius(): void;
    /**
     * calculateWorldAABB
     */
    calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;
    /**
     * Get approximate volume
     */
    volume(): number;
    /**
     * Create a Trimesh instance, shaped as a torus.
     */
    static createTorus(radius?: number, tube?: number, radialSegments?: number, tubularSegments?: number, arc?: number): Trimesh;
}
