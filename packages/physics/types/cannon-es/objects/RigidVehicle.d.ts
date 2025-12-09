import { Vec3 } from '../math/Vec3';
import { Body } from '../objects/Body';
import { HingeConstraint } from '../constraints/HingeConstraint';
import { World } from '../world/World';
export type RigidVehicleOptions = ConstructorParameters<typeof RigidVehicle>[0];
/**
 * Simple vehicle helper class with spherical rigid body wheels.
 */
export declare class RigidVehicle {
    /**
     * The bodies of the wheels.
     */
    wheelBodies: Body[];
    coordinateSystem: Vec3;
    /**
     * The chassis body.
     */
    chassisBody: Body;
    /**
     * The constraints.
     */
    constraints: (HingeConstraint & {
        motorTargetVelocity?: number;
    })[];
    /**
     * The wheel axes.
     */
    wheelAxes: Vec3[];
    /**
     * The wheel forces.
     */
    wheelForces: number[];
    constructor(options?: {
        /**
         * A Vector3 defining the world coordinate system.
         * @default new Vec3(1, 2, 3)
         */
        coordinateSystem?: Vec3;
        /**
         * Optionally pass a body for the chassis
         */
        chassisBody?: Body;
    });
    /**
     * Add a wheel
     */
    addWheel(options?: {
        /** The wheel body */
        body?: Body;
        /** Position of the wheel, locally in the chassis body. */
        position?: Vec3;
        /** Axis of rotation of the wheel, locally defined in the chassis. */
        axis?: Vec3;
        /** Slide direction of the wheel along the suspension. */
        direction?: Vec3;
    }): number;
    /**
     * Set the steering value of a wheel.
     * @todo check coordinateSystem
     */
    setSteeringValue(value: number, wheelIndex: number): void;
    /**
     * Set the target rotational speed of the hinge constraint.
     */
    setMotorSpeed(value: number, wheelIndex: number): void;
    /**
     * Set the target rotational speed of the hinge constraint.
     */
    disableMotor(wheelIndex: number): void;
    /**
     * Set the wheel force to apply on one of the wheels each time step
     */
    setWheelForce(value: number, wheelIndex: number): void;
    /**
     * Apply a torque on one of the wheels.
     */
    applyWheelForce(value: number, wheelIndex: number): void;
    /**
     * Add the vehicle including its constraints to the world.
     */
    addToWorld(world: World): void;
    private _update;
    /**
     * Remove the vehicle including its constraints from the world.
     */
    removeFromWorld(world: World): void;
    /**
     * Get current rotational velocity of a wheel
     */
    getWheelSpeed(wheelIndex: number): number;
}
