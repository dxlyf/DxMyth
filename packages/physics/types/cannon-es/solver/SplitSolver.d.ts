import { Solver } from '../solver/Solver';
import { Body } from '../objects/Body';
import { Equation } from '../equations/Equation';
import { World } from '../world/World';
import { GSSolver } from './GSSolver';
type SplitSolverNode = {
    body: Body | null;
    children: SplitSolverNode[];
    eqs: Equation[];
    visited: boolean;
};
/**
 * Splits the equations into islands and solves them independently. Can improve performance.
 */
export declare class SplitSolver extends Solver {
    /**
     * The number of solver iterations determines quality of the constraints in the world. The more iterations, the more correct simulation. More iterations need more computations though. If you have a large gravity force in your world, you will need more iterations.
     */
    iterations: number;
    /**
     * When tolerance is reached, the system is assumed to be converged.
     */
    tolerance: number;
    /** subsolver */
    subsolver: GSSolver;
    nodes: SplitSolverNode[];
    nodePool: SplitSolverNode[];
    constructor(subsolver: GSSolver);
    /**
     * createNode
     */
    createNode(): SplitSolverNode;
    /**
     * Solve the subsystems
     * @return number of iterations performed
     */
    solve(dt: number, world: World): number;
}
export {};
