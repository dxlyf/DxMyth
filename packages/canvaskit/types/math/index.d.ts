import { vec2, vec3, mat2d, mat3, glMatrix } from 'gl-matrix';
import { Vector2 } from './Vector2';
import { Matrix2D } from './Matrix2D';
import { IPoolService, IPoolServiceStatic } from '../../../../../../../src/core/PoolService';
export * from './BoundingRect';
export type * from './Vector2';
export type * from './Matrix2D';
export declare const toDegree: typeof glMatrix.toDegree;
export declare const toRadian: typeof glMatrix.toRadian;
declare module './Matrix2D' {
    namespace Matrix2D {
        const getPool: IPoolServiceStatic<Matrix2D>['getPool'];
        const releasePool: IPoolServiceStatic<Matrix2D, [x: number, y: number]>['releasePool'];
    }
    interface Matrix2D extends IPoolService<Vector2> {
    }
}
declare module './Vector2' {
    namespace Vector2 {
        const getPool: IPoolServiceStatic<Vector2, [x: number, y: number]>['getPool'];
        const releasePool: IPoolServiceStatic<Vector2, [x: number, y: number]>['releasePool'];
    }
    interface Vector2 extends IPoolService<Vector2> {
    }
}
export { vec2, vec3, mat2d, mat3, glMatrix as utils, Vector2, Matrix2D, };
