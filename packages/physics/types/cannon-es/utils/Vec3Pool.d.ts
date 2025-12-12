import { Pool } from '../utils/Pool';
import { Vec3 } from '../math/Vec3';
/**
 * Vec3Pool
 */
export declare class Vec3Pool extends Pool {
    type: typeof Vec3;
    /**
     * Construct a vector
     */
    constructObject(): Vec3;
}
