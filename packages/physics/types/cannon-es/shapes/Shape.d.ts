import { Vec3 } from '../math/Vec3';
import { Quaternion } from '../math/Quaternion';
import { Body } from '../objects/Body';
import { Material } from '../material/Material';
/**
 * The available shape types.
 */
export declare const SHAPE_TYPES: {
    /** SPHERE */
    readonly SPHERE: 1;
    /** PLANE */
    readonly PLANE: 2;
    /** BOX */
    readonly BOX: 4;
    /** COMPOUND */
    readonly COMPOUND: 8;
    /** CONVEXPOLYHEDRON */
    readonly CONVEXPOLYHEDRON: 16;
    /** HEIGHTFIELD */
    readonly HEIGHTFIELD: 32;
    /** PARTICLE */
    readonly PARTICLE: 64;
    /** CYLINDER */
    readonly CYLINDER: 128;
    /** TRIMESH */
    readonly TRIMESH: 256;
};
/**
 * ShapeType
 */
export type ShapeType = typeof SHAPE_TYPES[keyof typeof SHAPE_TYPES];
export type ShapeOptions = ConstructorParameters<typeof Shape>[0];
/**
 * Base class for shapes
 */
export declare class Shape {
    /**
     * Identifier of the Shape.
     */
    id: number;
    /**
     * The type of this shape. Must be set to an int > 0 by subclasses.
     */
    type: ShapeType | 0;
    /**
     * The local bounding sphere radius of this shape.
     */
    boundingSphereRadius: number;
    /**
     * Whether to produce contact forces when in contact with other bodies. Note that contacts will be generated, but they will be disabled.
     * @default true
     */
    collisionResponse: boolean;
    /**
     * @default 1
     */
    collisionFilterGroup: number;
    /**
     * @default -1
     */
    collisionFilterMask: number;
    /**
     * Optional material of the shape that regulates contact properties.
     */
    material: Material | null;
    /**
     * The body to which the shape is added to.
     */
    body: Body | null;
    static idCounter: number;
    /**
     * All the Shape types.
     */
    static types: {
        /** SPHERE */
        readonly SPHERE: 1;
        /** PLANE */
        readonly PLANE: 2;
        /** BOX */
        readonly BOX: 4;
        /** COMPOUND */
        readonly COMPOUND: 8;
        /** CONVEXPOLYHEDRON */
        readonly CONVEXPOLYHEDRON: 16;
        /** HEIGHTFIELD */
        readonly HEIGHTFIELD: 32;
        /** PARTICLE */
        readonly PARTICLE: 64;
        /** CYLINDER */
        readonly CYLINDER: 128;
        /** TRIMESH */
        readonly TRIMESH: 256;
    };
    constructor(options?: {
        /**
         * The type of this shape.
         */
        type?: ShapeType;
        /**
         * Whether to produce contact forces when in contact with other bodies.
         * @default true
         */
        collisionResponse?: boolean;
        /**
         * @default 1
         */
        collisionFilterGroup?: number;
        /**
         * @default -1
         */
        collisionFilterMask?: number;
        /**
         * Optional material of the shape that regulates contact properties.
         * @default null
         * @todo check this, the material is passed to the body, right?
         */
        material?: Material;
    });
    /**
     * Computes the bounding sphere radius.
     * The result is stored in the property `.boundingSphereRadius`
     */
    updateBoundingSphereRadius(): void;
    /**
     * Get the volume of this shape
     */
    volume(): number;
    /**
     * Calculates the inertia in the local frame for this shape.
     * @see http://en.wikipedia.org/wiki/List_of_moments_of_inertia
     */
    calculateLocalInertia(mass: number, target: Vec3): void;
    /**
     * @todo use abstract for these kind of methods
     */
    calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;
}
