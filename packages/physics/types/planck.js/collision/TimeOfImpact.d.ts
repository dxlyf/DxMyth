import { Sweep } from '../common/Sweep';
import { DistanceProxy } from './Distance';
/**
 * Input parameters for TimeOfImpact.
 */
export declare class TOIInput {
    proxyA: DistanceProxy;
    proxyB: DistanceProxy;
    sweepA: Sweep;
    sweepB: Sweep;
    /** defines sweep interval [0, tMax] */
    tMax: number;
    recycle(): void;
}
export declare enum TOIOutputState {
    e_unset = -1,
    e_unknown = 0,
    e_failed = 1,
    e_overlapped = 2,
    e_touching = 3,
    e_separated = 4
}
/**
 * Output parameters for TimeOfImpact.
 */
export declare class TOIOutput {
    state: TOIOutputState;
    t: number;
    recycle(): void;
}
/**
 * Compute the upper bound on time before two shapes penetrate. Time is
 * represented as a fraction between [0,tMax]. This uses a swept separating axis
 * and may miss some intermediate, non-tunneling collisions. If you change the
 * time interval, you should call this function again.
 *
 * Note: use Distance to compute the contact point and normal at the time of
 * impact.
 *
 * CCD via the local separating axis method. This seeks progression by computing
 * the largest time at which separation is maintained.
 */
export declare const TimeOfImpact: {
    (output: TOIOutput, input: TOIInput): void;
    Input: typeof TOIInput;
    Output: typeof TOIOutput;
};
