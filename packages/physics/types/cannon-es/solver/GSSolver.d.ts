import { Solver } from '../solver/Solver';
import { World } from '../world/World';
/**
 * Constraint equation Gauss-Seidel solver.
 * @todo The spook parameters should be specified for each constraint, not globally.
 * @see https://www8.cs.umu.se/kurser/5DV058/VT09/lectures/spooknotes.pdf
 */
export declare class GSSolver extends Solver {
    /**
     * The number of solver iterations determines quality of the constraints in the world.
     * The more iterations, the more correct simulation. More iterations need more computations though. If you have a large gravity force in your world, you will need more iterations.
     */
    iterations: number;
    /**
     * When tolerance is reached, the system is assumed to be converged.
     */
    tolerance: number;
    /**
     * @todo remove useless constructor
     */
    constructor();
    /**
     * Solve
     * @return number of iterations performed
     */
    solve(dt: number, world: World): number;
}
