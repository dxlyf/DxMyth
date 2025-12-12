import { Vec3 } from '../math/Vec3';
import { Transform } from '../math/Transform';
import { RaycastResult } from '../collision/RaycastResult';
import { Body } from '../objects/Body';
export type WheelInfoOptions = ConstructorParameters<typeof WheelInfo>[0];
export type WheelRaycastResult = RaycastResult & Partial<{
    suspensionLength: number;
    directionWorld: Vec3;
    groundObject: number;
}>;
/**
 * WheelInfo
 */
export declare class WheelInfo {
    /**
     * Max travel distance of the suspension, in meters.
     * @default 1
     */
    maxSuspensionTravel: number;
    /**
     * Speed to apply to the wheel rotation when the wheel is sliding.
     * @default -0.1
     */
    customSlidingRotationalSpeed: number;
    /**
     * If the customSlidingRotationalSpeed should be used.
     * @default false
     */
    useCustomSlidingRotationalSpeed: boolean;
    /**
     * sliding
     */
    sliding: boolean;
    /**
     * Connection point, defined locally in the chassis body frame.
     */
    chassisConnectionPointLocal: Vec3;
    /**
     * chassisConnectionPointWorld
     */
    chassisConnectionPointWorld: Vec3;
    /**
     * directionLocal
     */
    directionLocal: Vec3;
    /**
     * directionWorld
     */
    directionWorld: Vec3;
    /**
     * axleLocal
     */
    axleLocal: Vec3;
    /**
     * axleWorld
     */
    axleWorld: Vec3;
    /**
     * suspensionRestLength
     * @default 1
     */
    suspensionRestLength: number;
    /**
     * suspensionMaxLength
     * @default 2
     */
    suspensionMaxLength: number;
    /**
     * radius
     * @default 1
     */
    radius: number;
    /**
     * suspensionStiffness
     * @default 100
     */
    suspensionStiffness: number;
    /**
     * dampingCompression
     * @default 10
     */
    dampingCompression: number;
    /**
     * dampingRelaxation
     * @default 10
     */
    dampingRelaxation: number;
    /**
     * frictionSlip
     * @default 10.5
     */
    frictionSlip: number;
    /** forwardAcceleration */
    forwardAcceleration: number;
    /** sideAcceleration */
    sideAcceleration: number;
    /**
     * steering
     * @default 0
     */
    steering: number;
    /**
     * Rotation value, in radians.
     * @default 0
     */
    rotation: number;
    /**
     * deltaRotation
     * @default 0
     */
    deltaRotation: number;
    /**
     * rollInfluence
     * @default 0.01
     */
    rollInfluence: number;
    /**
     * maxSuspensionForce
     */
    maxSuspensionForce: number;
    /**
     * engineForce
     */
    engineForce: number;
    /**
     * brake
     */
    brake: number;
    /**
     * isFrontWheel
     * @default true
     */
    isFrontWheel: boolean;
    /**
     * clippedInvContactDotSuspension
     * @default 1
     */
    clippedInvContactDotSuspension: number;
    /**
     * suspensionRelativeVelocity
     * @default 0
     */
    suspensionRelativeVelocity: number;
    /**
     * suspensionForce
     * @default 0
     */
    suspensionForce: number;
    /**
     * slipInfo
     */
    slipInfo: number;
    /**
     * skidInfo
     * @default 0
     */
    skidInfo: number;
    /**
     * suspensionLength
     * @default 0
     */
    suspensionLength: number;
    /**
     * sideImpulse
     */
    sideImpulse: number;
    /**
     * forwardImpulse
     */
    forwardImpulse: number;
    /**
     * The result from raycasting.
     */
    raycastResult: WheelRaycastResult;
    /**
     * Wheel world transform.
     */
    worldTransform: Transform;
    /**
     * isInContact
     */
    isInContact: boolean;
    constructor(options?: {
        /**
         * Connection point, defined locally in the chassis body frame.
         */
        chassisConnectionPointLocal?: Vec3;
        /**
         * chassisConnectionPointWorld
         */
        chassisConnectionPointWorld?: Vec3;
        /**
         * directionLocal
         */
        directionLocal?: Vec3;
        /**
         * directionWorld
         */
        directionWorld?: Vec3;
        /**
         * axleLocal
         */
        axleLocal?: Vec3;
        /**
         * axleWorld
         */
        axleWorld?: Vec3;
        /**
         * suspensionRestLength
         * @default 1
         */
        suspensionRestLength?: number;
        /**
         * suspensionMaxLength
         * @default 2
         */
        suspensionMaxLength?: number;
        /**
         * radius
         * @default 1
         */
        radius?: number;
        /**
         * suspensionStiffness
         * @default 100
         */
        suspensionStiffness?: number;
        /**
         * dampingCompression
         * @default 10
         */
        dampingCompression?: number;
        /**
         * dampingRelaxation
         * @default 10
         */
        dampingRelaxation?: number;
        /**
         * frictionSlip
         * @default 10.5
         */
        frictionSlip?: number;
        /** forwardAcceleration */
        forwardAcceleration?: number;
        /** sideAcceleration */
        sideAcceleration?: number;
        /**
         * steering
         * @default 0
         */
        steering?: number;
        /**
         * Rotation value, in radians.
         * @default 0
         */
        rotation?: number;
        /**
         * deltaRotation
         * @default 0
         */
        deltaRotation?: number;
        /**
         * rollInfluence
         * @default 0.01
         */
        rollInfluence?: number;
        /**
         * maxSuspensionForce
         */
        maxSuspensionForce?: number;
        /**
         * isFrontWheel
         * @default true
         */
        isFrontWheel?: boolean;
        /**
         * clippedInvContactDotSuspension
         * @default 1
         */
        clippedInvContactDotSuspension?: number;
        /**
         * suspensionRelativeVelocity
         * @default 0
         */
        suspensionRelativeVelocity?: number;
        /**
         * suspensionForce
         * @default 0
         */
        suspensionForce?: number;
        /**
         * slipInfo
         */
        slipInfo?: number;
        /**
         * skidInfo
         * @default 0
         */
        skidInfo?: number;
        /**
         * suspensionLength
         * @default 0
         */
        suspensionLength?: number;
        /**
         * Max travel distance of the suspension, in meters.
         * @default 1
         */
        maxSuspensionTravel?: number;
        /**
         * If the customSlidingRotationalSpeed should be used.
         * @default false
         */
        useCustomSlidingRotationalSpeed?: boolean;
        /**
         * Speed to apply to the wheel rotation when the wheel is sliding.
         * @default -0.1
         */
        customSlidingRotationalSpeed?: number;
    });
    updateWheel(chassis: Body): void;
}
