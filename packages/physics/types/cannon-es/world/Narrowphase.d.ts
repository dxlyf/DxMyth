import { Shape } from '../shapes/Shape';
import { Vec3 } from '../math/Vec3';
import { Quaternion } from '../math/Quaternion';
import { Body } from '../objects/Body';
import { Vec3Pool } from '../utils/Vec3Pool';
import { ContactEquation } from '../equations/ContactEquation';
import { FrictionEquation } from '../equations/FrictionEquation';
import { Box } from '../shapes/Box';
import { Sphere } from '../shapes/Sphere';
import { ConvexPolyhedron } from '../shapes/ConvexPolyhedron';
import { Particle } from '../shapes/Particle';
import { Plane } from '../shapes/Plane';
import { Trimesh } from '../shapes/Trimesh';
import { Heightfield } from '../shapes/Heightfield';
import { Cylinder } from '../shapes/Cylinder';
import { ContactMaterial } from '../material/ContactMaterial';
import { World } from '../world/World';
export declare const COLLISION_TYPES: {
    sphereSphere: 1;
    spherePlane: 3;
    boxBox: 4;
    sphereBox: 5;
    planeBox: 6;
    convexConvex: 16;
    sphereConvex: 17;
    planeConvex: 18;
    boxConvex: 20;
    sphereHeightfield: 33;
    boxHeightfield: 36;
    convexHeightfield: 48;
    sphereParticle: 65;
    planeParticle: 66;
    boxParticle: 68;
    convexParticle: 80;
    cylinderCylinder: 128;
    sphereCylinder: 129;
    planeCylinder: 130;
    boxCylinder: 132;
    convexCylinder: 144;
    heightfieldCylinder: 160;
    particleCylinder: 192;
    sphereTrimesh: 257;
    planeTrimesh: 258;
};
export type CollisionType = typeof COLLISION_TYPES[keyof typeof COLLISION_TYPES];
/**
 * Helper class for the World. Generates ContactEquations.
 * @todo Sphere-ConvexPolyhedron contacts
 * @todo Contact reduction
 * @todo should move methods to prototype
 */
export declare class Narrowphase {
    /**
     * Internal storage of pooled contact points.
     */
    contactPointPool: ContactEquation[];
    frictionEquationPool: FrictionEquation[];
    result: ContactEquation[];
    frictionResult: FrictionEquation[];
    /**
     * Pooled vectors.
     */
    v3pool: Vec3Pool;
    world: World;
    currentContactMaterial: ContactMaterial;
    enableFrictionReduction: boolean;
    get [COLLISION_TYPES.sphereSphere](): (si: Sphere, sj: Sphere, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean) => boolean | void;
    get [COLLISION_TYPES.spherePlane](): (si: Sphere, sj: Plane, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean) => true | void;
    get [COLLISION_TYPES.boxBox](): (si: Box, sj: Box, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean) => true | void;
    get [COLLISION_TYPES.sphereBox](): (si: Sphere, sj: Box, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean) => true | void;
    get [COLLISION_TYPES.planeBox](): (si: Plane, sj: Box, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean) => true | void;
    get [COLLISION_TYPES.convexConvex](): (si: ConvexPolyhedron, sj: ConvexPolyhedron, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean, faceListA?: number[] | null, faceListB?: number[] | null) => true | void;
    get [COLLISION_TYPES.sphereConvex](): (si: Sphere, sj: ConvexPolyhedron, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean) => true | void;
    get [COLLISION_TYPES.planeConvex](): (planeShape: Plane, convexShape: ConvexPolyhedron, planePosition: Vec3, convexPosition: Vec3, planeQuat: Quaternion, convexQuat: Quaternion, planeBody: Body, convexBody: Body, si?: Shape, sj?: Shape, justTest?: boolean) => true | void;
    get [COLLISION_TYPES.boxConvex](): (si: Box, sj: ConvexPolyhedron, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean) => true | void;
    get [COLLISION_TYPES.sphereHeightfield](): (sphereShape: Sphere, hfShape: Heightfield, spherePos: Vec3, hfPos: Vec3, sphereQuat: Quaternion, hfQuat: Quaternion, sphereBody: Body, hfBody: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean) => true | void;
    get [COLLISION_TYPES.boxHeightfield](): (si: Box, sj: Heightfield, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean) => true | void;
    get [COLLISION_TYPES.convexHeightfield](): (convexShape: ConvexPolyhedron, hfShape: Heightfield, convexPos: Vec3, hfPos: Vec3, convexQuat: Quaternion, hfQuat: Quaternion, convexBody: Body, hfBody: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean) => true | void;
    get [COLLISION_TYPES.sphereParticle](): (sj: Sphere, si: Particle, xj: Vec3, xi: Vec3, qj: Quaternion, qi: Quaternion, bj: Body, bi: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean) => true | void;
    get [COLLISION_TYPES.planeParticle](): (sj: Plane, si: Particle, xj: Vec3, xi: Vec3, qj: Quaternion, qi: Quaternion, bj: Body, bi: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean) => true | void;
    get [COLLISION_TYPES.boxParticle](): (si: Box, sj: Particle, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean) => true | void;
    get [COLLISION_TYPES.convexParticle](): (sj: ConvexPolyhedron, si: Particle, xj: Vec3, xi: Vec3, qj: Quaternion, qi: Quaternion, bj: Body, bi: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean) => true | void;
    get [COLLISION_TYPES.cylinderCylinder](): (si: ConvexPolyhedron, sj: ConvexPolyhedron, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean, faceListA?: number[] | null, faceListB?: number[] | null) => true | void;
    get [COLLISION_TYPES.sphereCylinder](): (si: Sphere, sj: ConvexPolyhedron, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean) => true | void;
    get [COLLISION_TYPES.planeCylinder](): (planeShape: Plane, convexShape: ConvexPolyhedron, planePosition: Vec3, convexPosition: Vec3, planeQuat: Quaternion, convexQuat: Quaternion, planeBody: Body, convexBody: Body, si?: Shape, sj?: Shape, justTest?: boolean) => true | void;
    get [COLLISION_TYPES.boxCylinder](): (si: Box, sj: ConvexPolyhedron, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean) => true | void;
    get [COLLISION_TYPES.convexCylinder](): (si: ConvexPolyhedron, sj: ConvexPolyhedron, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean, faceListA?: number[] | null, faceListB?: number[] | null) => true | void;
    get [COLLISION_TYPES.heightfieldCylinder](): (hfShape: Heightfield, convexShape: Cylinder, hfPos: Vec3, convexPos: Vec3, hfQuat: Quaternion, convexQuat: Quaternion, hfBody: Body, convexBody: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean) => true | void;
    get [COLLISION_TYPES.particleCylinder](): (si: Particle, sj: Cylinder, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean) => true | void;
    get [COLLISION_TYPES.sphereTrimesh](): (sphereShape: Sphere, trimeshShape: Trimesh, spherePos: Vec3, trimeshPos: Vec3, sphereQuat: Quaternion, trimeshQuat: Quaternion, sphereBody: Body, trimeshBody: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean) => true | void;
    get [COLLISION_TYPES.planeTrimesh](): (planeShape: Plane, trimeshShape: Trimesh, planePos: Vec3, trimeshPos: Vec3, planeQuat: Quaternion, trimeshQuat: Quaternion, planeBody: Body, trimeshBody: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean) => true | void;
    constructor(world: World);
    /**
     * Make a contact object, by using the internal pool or creating a new one.
     */
    createContactEquation(bi: Body, bj: Body, si: Shape, sj: Shape, overrideShapeA?: Shape | null, overrideShapeB?: Shape | null): ContactEquation;
    createFrictionEquationsFromContact(contactEquation: ContactEquation, outArray: FrictionEquation[]): boolean;
    /**
     * Take the average N latest contact point on the plane.
     */
    createFrictionFromAverage(numContacts: number): void;
    /**
     * Generate all contacts between a list of body pairs
     * @param p1 Array of body indices
     * @param p2 Array of body indices
     * @param result Array to store generated contacts
     * @param oldcontacts Optional. Array of reusable contact objects
     */
    getContacts(p1: Body[], p2: Body[], world: World, result: ContactEquation[], oldcontacts: ContactEquation[], frictionResult: FrictionEquation[], frictionPool: FrictionEquation[]): void;
    sphereSphere(si: Sphere, sj: Sphere, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): boolean | void;
    spherePlane(si: Sphere, sj: Plane, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    boxBox(si: Box, sj: Box, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    sphereBox(si: Sphere, sj: Box, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    planeBox(si: Plane, sj: Box, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    convexConvex(si: ConvexPolyhedron, sj: ConvexPolyhedron, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean, faceListA?: number[] | null, faceListB?: number[] | null): true | void;
    sphereConvex(si: Sphere, sj: ConvexPolyhedron, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    planeConvex(planeShape: Plane, convexShape: ConvexPolyhedron, planePosition: Vec3, convexPosition: Vec3, planeQuat: Quaternion, convexQuat: Quaternion, planeBody: Body, convexBody: Body, si?: Shape, sj?: Shape, justTest?: boolean): true | void;
    boxConvex(si: Box, sj: ConvexPolyhedron, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    sphereHeightfield(sphereShape: Sphere, hfShape: Heightfield, spherePos: Vec3, hfPos: Vec3, sphereQuat: Quaternion, hfQuat: Quaternion, sphereBody: Body, hfBody: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    boxHeightfield(si: Box, sj: Heightfield, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    convexHeightfield(convexShape: ConvexPolyhedron, hfShape: Heightfield, convexPos: Vec3, hfPos: Vec3, convexQuat: Quaternion, hfQuat: Quaternion, convexBody: Body, hfBody: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    sphereParticle(sj: Sphere, si: Particle, xj: Vec3, xi: Vec3, qj: Quaternion, qi: Quaternion, bj: Body, bi: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    planeParticle(sj: Plane, si: Particle, xj: Vec3, xi: Vec3, qj: Quaternion, qi: Quaternion, bj: Body, bi: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    boxParticle(si: Box, sj: Particle, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    convexParticle(sj: ConvexPolyhedron, si: Particle, xj: Vec3, xi: Vec3, qj: Quaternion, qi: Quaternion, bj: Body, bi: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    heightfieldCylinder(hfShape: Heightfield, convexShape: Cylinder, hfPos: Vec3, convexPos: Vec3, hfQuat: Quaternion, convexQuat: Quaternion, hfBody: Body, convexBody: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    particleCylinder(si: Particle, sj: Cylinder, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion, bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    sphereTrimesh(sphereShape: Sphere, trimeshShape: Trimesh, spherePos: Vec3, trimeshPos: Vec3, sphereQuat: Quaternion, trimeshQuat: Quaternion, sphereBody: Body, trimeshBody: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
    planeTrimesh(planeShape: Plane, trimeshShape: Trimesh, planePos: Vec3, trimeshPos: Vec3, planeQuat: Quaternion, trimeshQuat: Quaternion, planeBody: Body, trimeshBody: Body, rsi?: Shape | null, rsj?: Shape | null, justTest?: boolean): true | void;
}
