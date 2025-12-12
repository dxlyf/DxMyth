import { Mat3 } from '../math/Mat3';
/**
 * 3-dimensional vector
 * @example
 *     const v = new Vec3(1, 2, 3)
 *     console.log('x=' + v.x) // x=1
 */
export declare class Vec3 {
    x: number;
    y: number;
    z: number;
    static ZERO: Vec3;
    static UNIT_X: Vec3;
    static UNIT_Y: Vec3;
    static UNIT_Z: Vec3;
    constructor(x?: number, y?: number, z?: number);
    /**
     * Vector cross product
     * @param target Optional target to save in.
     */
    cross(vector: Vec3, target?: Vec3): Vec3;
    /**
     * Set the vectors' 3 elements
     */
    set(x: number, y: number, z: number): Vec3;
    /**
     * Set all components of the vector to zero.
     */
    setZero(): void;
    /**
     * Vector addition
     */
    vadd(vector: Vec3): Vec3;
    vadd(vector: Vec3, target: Vec3): void;
    /**
     * Vector subtraction
     * @param target Optional target to save in.
     */
    vsub(vector: Vec3): Vec3;
    vsub(vector: Vec3, target: Vec3): void;
    /**
     * Get the cross product matrix a_cross from a vector, such that a x b = a_cross * b = c
     *
     * See {@link https://www8.cs.umu.se/kurser/TDBD24/VT06/lectures/Lecture6.pdf Umeå University Lecture}
     */
    crossmat(): Mat3;
    /**
     * Normalize the vector. Note that this changes the values in the vector.
  
     * @return Returns the norm of the vector
     */
    normalize(): number;
    /**
     * Get the version of this vector that is of length 1.
     * @param target Optional target to save in
     * @return Returns the unit vector
     */
    unit(target?: Vec3): Vec3;
    /**
     * Get the length of the vector
     */
    length(): number;
    /**
     * Get the squared length of the vector.
     */
    lengthSquared(): number;
    /**
     * Get distance from this point to another point
     */
    distanceTo(p: Vec3): number;
    /**
     * Get squared distance from this point to another point
     */
    distanceSquared(p: Vec3): number;
    /**
     * Multiply all the components of the vector with a scalar.
     * @param target The vector to save the result in.
     */
    scale(scalar: number, target?: Vec3): Vec3;
    /**
     * Multiply the vector with an other vector, component-wise.
     * @param target The vector to save the result in.
     */
    vmul(vector: Vec3, target?: Vec3): Vec3;
    /**
     * Scale a vector and add it to this vector. Save the result in "target". (target = this + vector * scalar)
     * @param target The vector to save the result in.
     */
    addScaledVector(scalar: number, vector: Vec3, target?: Vec3): Vec3;
    /**
     * Calculate dot product
     * @param vector
     */
    dot(vector: Vec3): number;
    isZero(): boolean;
    /**
     * Make the vector point in the opposite direction.
     * @param target Optional target to save in
     */
    negate(target?: Vec3): Vec3;
    /**
     * Compute two artificial tangents to the vector
     * @param t1 Vector object to save the first tangent in
     * @param t2 Vector object to save the second tangent in
     */
    tangents(t1: Vec3, t2: Vec3): void;
    /**
     * Converts to a more readable format
     */
    toString(): string;
    /**
     * Converts to an array
     */
    toArray(): [number, number, number];
    /**
     * Copies value of source to this vector.
     */
    copy(vector: Vec3): Vec3;
    /**
     * Do a linear interpolation between two vectors
     * @param t A number between 0 and 1. 0 will make this function return u, and 1 will make it return v. Numbers in between will generate a vector in between them.
     */
    lerp(vector: Vec3, t: number, target: Vec3): void;
    /**
     * Check if a vector equals is almost equal to another one.
     */
    almostEquals(vector: Vec3, precision?: number): boolean;
    /**
     * Check if a vector is almost zero
     */
    almostZero(precision?: number): boolean;
    /**
     * Check if the vector is anti-parallel to another vector.
     * @param precision Set to zero for exact comparisons
     */
    isAntiparallelTo(vector: Vec3, precision?: number): boolean;
    /**
     * Clone the vector
     */
    clone(): Vec3;
}
