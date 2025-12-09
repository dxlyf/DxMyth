import { Body } from '../objects/Body';
import { Equation } from '../equations/Equation';
export type ConstraintOptions = ConstructorParameters<typeof Constraint>[2];
/**
 * Constraint base class
 */
export declare class Constraint {
    /**
     * Equations to be solved in this constraint.
     */
    equations: Equation[];
    /**
     * Body A.
     */
    bodyA: Body;
    /**
     * Body B.
     */
    bodyB: Body;
    id: number;
    /**
     * Set to false if you don't want the bodies to collide when they are connected.
     */
    collideConnected: boolean;
    static idCounter: number;
    constructor(bodyA: Body, bodyB: Body, options?: {
        /**
         * Set to false if you don't want the bodies to collide when they are connected.
         * @default true
         */
        collideConnected?: boolean;
        /**
         * Set to false if you don't want the bodies to wake up when they are connected.
         * @default true
         */
        wakeUpBodies?: boolean;
    });
    /**
     * Update all the equations with data.
     */
    update(): void;
    /**
     * Enables all equations in the constraint.
     */
    enable(): void;
    /**
     * Disables all equations in the constraint.
     */
    disable(): void;
}
