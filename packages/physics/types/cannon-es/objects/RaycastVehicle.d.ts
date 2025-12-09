import { Body } from '../objects/Body';
import { WheelInfo, WheelInfoOptions } from '../objects/WheelInfo';
import { Transform } from '../math/Transform';
import { Constraint } from '../constraints/Constraint';
import { World } from '../world/World';
export type RaycastVehicleOptions = ConstructorParameters<typeof RaycastVehicle>[0];
/**
 * Vehicle helper class that casts rays from the wheel positions towards the ground and applies forces.
 */
export declare class RaycastVehicle {
    /** The car chassis body. */
    chassisBody: Body;
    /** The wheels. */
    wheelInfos: WheelInfo[];
    /** Will be set to true if the car is sliding. */
    sliding: boolean;
    world: World | null;
    /** Index of the right axis. x=0, y=1, z=2 */
    indexRightAxis: number;
    /** Index of the forward axis. x=0, y=1, z=2 */
    indexForwardAxis: number;
    /** Index of the up axis. x=0, y=1, z=2 */
    indexUpAxis: number;
    /** The constraints. */
    constraints: Constraint[];
    /** Optional pre-step callback. */
    preStepCallback: () => void;
    currentVehicleSpeedKmHour: number;
    /** Number of wheels on the ground. */
    numWheelsOnGround: number;
    constructor(options: {
        /** The car chassis body. */
        chassisBody: Body;
        /** Index of the right axis. x=0, y=1, z=2 */
        indexRightAxis?: number;
        /** Index of the forward axis. x=0, y=1, z=2 */
        indexForwardAxis?: number;
        /** Index of the up axis. x=0, y=1, z=2 */
        indexUpAxis?: number;
    });
    /**
     * Add a wheel. For information about the options, see `WheelInfo`.
     */
    addWheel(options?: WheelInfoOptions): number;
    /**
     * Set the steering value of a wheel.
     */
    setSteeringValue(value: number, wheelIndex: number): void;
    /**
     * Set the wheel force to apply on one of the wheels each time step
     */
    applyEngineForce(value: number, wheelIndex: number): void;
    /**
     * Set the braking force of a wheel
     */
    setBrake(brake: number, wheelIndex: number): void;
    /**
     * Add the vehicle including its constraints to the world.
     */
    addToWorld(world: World): void;
    /**
     * Get one of the wheel axles, world-oriented.
     */
    private getVehicleAxisWorld;
    updateVehicle(timeStep: number): void;
    updateSuspension(deltaTime: number): void;
    /**
     * Remove the vehicle including its constraints from the world.
     */
    removeFromWorld(world: World): void;
    castRay(wheel: WheelInfo): number;
    updateWheelTransformWorld(wheel: WheelInfo): void;
    /**
     * Update one of the wheel transform.
     * Note when rendering wheels: during each step, wheel transforms are updated BEFORE the chassis; ie. their position becomes invalid after the step. Thus when you render wheels, you must update wheel transforms before rendering them. See raycastVehicle demo for an example.
     * @param wheelIndex The wheel index to update.
     */
    updateWheelTransform(wheelIndex: number): void;
    /**
     * Get the world transform of one of the wheels
     */
    getWheelTransformWorld(wheelIndex: number): Transform;
    updateFriction(timeStep: number): void;
}
