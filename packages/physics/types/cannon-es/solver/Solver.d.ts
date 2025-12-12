import { Equation } from '../equations/Equation';
import { World } from '../world/World';
/**
 * Constraint equation solver base class.
 */
export declare class Solver {
    /**
     * All equations to be solved
     */
    equations: Equation[];
    /**
     * @todo remove useless constructor
     */
    constructor();
    /**
     * Should be implemented in subclasses!
     * @todo use abstract
     * @return number of iterations performed
     */
    solve(dt: number, world: World): number;
    /**
     * Add an equation
     */
    addEquation(eq: Equation): void;
    /**
     * Remove an equation
     */
    removeEquation(eq: Equation): void;
    /**
     * Add all equations
     */
    removeAllEquations(): void;
}
