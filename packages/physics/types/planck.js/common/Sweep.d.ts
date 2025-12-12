import { Vec2, Vec2Value } from './Vec2';
import { TransformValue } from './Transform';
/**
 * This describes the motion of a body/shape for TOI computation. Shapes are
 * defined with respect to the body origin, which may not coincide with the
 * center of mass. However, to support dynamics we must interpolate the center
 * of mass position.
 */
export declare class Sweep {
    /** Local center of mass position */
    localCenter: Vec2;
    /** World center position */
    c: Vec2;
    /** World angle */
    a: number;
    /** Fraction of the current time step in the range [0,1], c0 and a0 are c and a at alpha0. */
    alpha0: number;
    c0: Vec2;
    a0: number;
    /** @internal */
    recycle(): void;
    setTransform(xf: TransformValue): void;
    setLocalCenter(localCenter: Vec2Value, xf: TransformValue): void;
    /**
     * Get the interpolated transform at a specific time.
     *
     * @param xf
     * @param beta A factor in [0,1], where 0 indicates alpha0
     */
    getTransform(xf: TransformValue, beta?: number): void;
    /**
     * Advance the sweep forward, yielding a new initial state.
     *
     * @param alpha The new initial time
     */
    advance(alpha: number): void;
    forward(): void;
    /**
     * normalize the angles in radians to be between -pi and pi.
     */
    normalize(): void;
    set(that: Sweep): void;
}
