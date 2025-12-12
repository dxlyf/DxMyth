import { Shape } from '../shapes/Shape';
import { ConvexPolyhedron } from '../shapes/ConvexPolyhedron';
import { Vec3 } from '../math/Vec3';
import { AABB } from '../collision/AABB';
import { Quaternion } from '../math/Quaternion';
export type HeightfieldOptions = ConstructorParameters<typeof Heightfield>[1];
type HeightfieldPillar = {
    convex: any;
    offset: any;
};
/**
 * Heightfield shape class. Height data is given as an array. These data points are spread out evenly with a given distance.
 * @todo Should be possible to use along all axes, not just y
 * @todo should be possible to scale along all axes
 * @todo Refactor elementSize to elementSizeX and elementSizeY
 *
 * @example
 *     // Generate some height data (y-values).
 *     const data = []
 *     for (let i = 0; i < 1000; i++) {
 *         const y = 0.5 * Math.cos(0.2 * i)
 *         data.push(y)
 *     }
 *
 *     // Create the heightfield shape
 *     const heightfieldShape = new CANNON.Heightfield(data, {
 *         elementSize: 1 // Distance between the data points in X and Y directions
 *     })
 *     const heightfieldBody = new CANNON.Body({ shape: heightfieldShape })
 *     world.addBody(heightfieldBody)
 */
export declare class Heightfield extends Shape {
    /**
     * An array of numbers, or height values, that are spread out along the x axis.
     */
    data: number[][];
    /**
     * Max value of the data points in the data array.
     */
    maxValue: number | null;
    /**
     * Minimum value of the data points in the data array.
     */
    minValue: number | null;
    /**
     * World spacing between the data points in X and Y direction.
     * @todo elementSizeX and Y
     * @default 1
     */
    elementSize: number;
    /**
     * @default true
     */
    cacheEnabled: boolean;
    pillarConvex: ConvexPolyhedron;
    pillarOffset: Vec3;
    private _cachedPillars;
    /**
     * @param data An array of numbers, or height values, that are spread out along the x axis.
     */
    constructor(data: number[][], options?: {
        /**
         * Max value of the data points in the data array.
         * Will be computed automatically if not given.
         */
        maxValue?: number | null;
        /**
         * Minimum value of the data points in the data array.
         * Will be computed automatically if not given.
         */
        minValue?: number | null;
        /**
         * World spacing between the data points in X direction.
         */
        elementSize?: number;
    });
    /**
     * Call whenever you change the data array.
     */
    update(): void;
    /**
     * Update the `minValue` property
     */
    updateMinValue(): void;
    /**
     * Update the `maxValue` property
     */
    updateMaxValue(): void;
    /**
     * Set the height value at an index. Don't forget to update maxValue and minValue after you're done.
     */
    setHeightValueAtIndex(xi: number, yi: number, value: number): void;
    /**
     * Get max/min in a rectangle in the matrix data
     * @param result An array to store the results in.
     * @return The result array, if it was passed in. Minimum will be at position 0 and max at 1.
     */
    getRectMinMax(iMinX: number, iMinY: number, iMaxX: number, iMaxY: number, result?: number[]): void;
    /**
     * Get the index of a local position on the heightfield. The indexes indicate the rectangles, so if your terrain is made of N x N height data points, you will have rectangle indexes ranging from 0 to N-1.
     * @param result Two-element array
     * @param clamp If the position should be clamped to the heightfield edge.
     */
    getIndexOfPosition(x: number, y: number, result: number[], clamp: boolean): boolean;
    getTriangleAt(x: number, y: number, edgeClamp: boolean, a: Vec3, b: Vec3, c: Vec3): boolean;
    getNormalAt(x: number, y: number, edgeClamp: boolean, result: Vec3): void;
    /**
     * Get an AABB of a square in the heightfield
     * @param xi
     * @param yi
     * @param result
     */
    getAabbAtIndex(xi: number, yi: number, { lowerBound, upperBound }: AABB): void;
    /**
     * Get the height in the heightfield at a given position
     */
    getHeightAt(x: number, y: number, edgeClamp: boolean): number;
    getCacheConvexTrianglePillarKey(xi: number, yi: number, getUpperTriangle: boolean): string;
    getCachedConvexTrianglePillar(xi: number, yi: number, getUpperTriangle: boolean): HeightfieldPillar;
    setCachedConvexTrianglePillar(xi: number, yi: number, getUpperTriangle: boolean, convex: ConvexPolyhedron, offset: Vec3): void;
    clearCachedConvexTrianglePillar(xi: number, yi: number, getUpperTriangle: boolean): void;
    /**
     * Get a triangle from the heightfield
     */
    getTriangle(xi: number, yi: number, upper: boolean, a: Vec3, b: Vec3, c: Vec3): void;
    /**
     * Get a triangle in the terrain in the form of a triangular convex shape.
     */
    getConvexTrianglePillar(xi: number, yi: number, getUpperTriangle: boolean): void;
    calculateLocalInertia(mass: number, target?: Vec3): Vec3;
    volume(): number;
    calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;
    updateBoundingSphereRadius(): void;
    /**
     * Sets the height values from an image. Currently only supported in browser.
     */
    setHeightsFromImage(image: HTMLImageElement, scale: Vec3): void;
}
export {};
