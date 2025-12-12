import { Vec3 } from '../math/Vec3';
import { Quaternion } from '../math/Quaternion';
export type TransformOptions = ConstructorParameters<typeof Transform>[0];
/**
 * Transformation utilities.
 */
export declare class Transform {
    /**
     * position
     */
    position: Vec3;
    /**
     * quaternion
     */
    quaternion: Quaternion;
    constructor(options?: {
        /**
         * position
         */
        position?: Vec3;
        /**
         * quaternion
         */
        quaternion?: Quaternion;
    });
    /**
     * Get a global point in local transform coordinates.
     */
    pointToLocal(worldPoint: Vec3, result?: Vec3): Vec3;
    /**
     * Get a local point in global transform coordinates.
     */
    pointToWorld(localPoint: Vec3, result?: Vec3): Vec3;
    /**
     * vectorToWorldFrame
     */
    vectorToWorldFrame(localVector: Vec3, result?: Vec3): Vec3;
    /**
     * pointToLocalFrame
     */
    static pointToLocalFrame(position: Vec3, quaternion: Quaternion, worldPoint: Vec3, result?: Vec3): Vec3;
    /**
     * pointToWorldFrame
     */
    static pointToWorldFrame(position: Vec3, quaternion: Quaternion, localPoint: Vec3, result?: Vec3): Vec3;
    /**
     * vectorToWorldFrame
     */
    static vectorToWorldFrame(quaternion: Quaternion, localVector: Vec3, result?: Vec3): Vec3;
    /**
     * vectorToLocalFrame
     */
    static vectorToLocalFrame(position: Vec3, quaternion: Quaternion, worldVector: Vec3, result?: Vec3): Vec3;
}
