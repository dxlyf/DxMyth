import { JacobianElement } from '../math/JacobianElement';
import { Body } from '../objects/Body';
import { Shape } from '../shapes/Shape';
/**
 * Equation base class.
 *
 * `a`, `b` and `eps` are {@link https://www8.cs.umu.se/kurser/5DV058/VT15/lectures/SPOOKlabnotes.pdf SPOOK} parameters that default to `0.0`. See {@link https://github.com/schteppe/cannon.js/issues/238#issuecomment-147172327 this exchange} for more details on Cannon's physics implementation.
 */
export declare class Equation {
    id: number;
    /**
     * Minimum (read: negative max) force to be applied by the constraint.
     */
    minForce: number;
    /**
     * Maximum (read: positive max) force to be applied by the constraint.
     */
    maxForce: number;
    bi: Body;
    bj: Body;
    si: Shape;
    sj: Shape;
    /**
     * SPOOK parameter
     */
    a: number;
    /**
     * SPOOK parameter
     */
    b: number;
    /**
     * SPOOK parameter
     */
    eps: number;
    jacobianElementA: JacobianElement;
    jacobianElementB: JacobianElement;
    enabled: boolean;
    /**
     * A number, proportional to the force added to the bodies.
     */
    multiplier: number;
    static idCounter: number;
    constructor(bi: Body, bj: Body, minForce?: number, maxForce?: number);
    /**
     * Recalculates a, b, and eps.
     *
     * The Equation constructor sets typical SPOOK parameters as such:
     * * `stiffness` = 1e7
     * * `relaxation` = 4
     * * `timeStep`= 1 / 60, _note the hardcoded refresh rate._
     */
    setSpookParams(stiffness: number, relaxation: number, timeStep: number): void;
    /**
     * Computes the right hand side of the SPOOK equation
     */
    computeB(a: number, b: number, h: number): number;
    /**
     * Computes G*q, where q are the generalized body coordinates
     */
    computeGq(): number;
    /**
     * Computes G*W, where W are the body velocities
     */
    computeGW(): number;
    /**
     * Computes G*Wlambda, where W are the body velocities
     */
    computeGWlambda(): number;
    /**
     * Computes G*inv(M)*f, where M is the mass matrix with diagonal blocks for each body, and f are the forces on the bodies.
     */
    computeGiMf(): number;
    /**
     * Computes G*inv(M)*G'
     */
    computeGiMGt(): number;
    /**
     * Add constraint velocity to the bodies.
     */
    addToWlambda(deltalambda: number): void;
    /**
     * Compute the denominator part of the SPOOK equation: C = G*inv(M)*G' + eps
     */
    computeC(): number;
}
