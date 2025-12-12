import { ConvexPolyhedron } from '../shapes/ConvexPolyhedron';
/**
 * Cylinder class.
 * @example
 *     const radiusTop = 0.5
 *     const radiusBottom = 0.5
 *     const height = 2
 *     const numSegments = 12
 *     const cylinderShape = new CANNON.Cylinder(radiusTop, radiusBottom, height, numSegments)
 *     const cylinderBody = new CANNON.Body({ mass: 1, shape: cylinderShape })
 *     world.addBody(cylinderBody)
 */
export declare class Cylinder extends ConvexPolyhedron {
    /** The radius of the top of the Cylinder. */
    radiusTop: number;
    /** The radius of the bottom of the Cylinder. */
    radiusBottom: number;
    /** The height of the Cylinder. */
    height: number;
    /** The number of segments to build the cylinder out of. */
    numSegments: number;
    /**
     * @param radiusTop The radius of the top of the Cylinder.
     * @param radiusBottom The radius of the bottom of the Cylinder.
     * @param height The height of the Cylinder.
     * @param numSegments The number of segments to build the cylinder out of.
     */
    constructor(radiusTop?: number, radiusBottom?: number, height?: number, numSegments?: number);
}
