import {vec2,vec3,mat2d,mat3,glMatrix} from 'gl-matrix'
import {Vector2} from './Vector2'
import {Matrix2D} from './Matrix2D'
import {PoolService,type IPoolService,type IPoolServiceStatic} from 'src/core/PoolService'
export * from './BoundingRect'
export type * from './Vector2'
export type * from './Matrix2D'

export const toDegree=glMatrix.toDegree
export const toRadian=glMatrix.toRadian
declare module './Matrix2D' {
    namespace Matrix2D{
       const getPool:IPoolServiceStatic<Matrix2D>['getPool']
       const releasePool:IPoolServiceStatic<Matrix2D,[x:number,y:number]>['releasePool']
    }
    interface Matrix2D extends IPoolService<Vector2>{
       
    }
}
declare module './Vector2' {
    namespace Vector2{
        const getPool:IPoolServiceStatic<Vector2,[x:number,y:number]>['getPool']
        const releasePool:IPoolServiceStatic<Vector2,[x:number,y:number]>['releasePool']
    }
    interface Vector2 extends IPoolService<Vector2>{
       
    }
}
PoolService.mixin(Vector2,{
    maxSize:10,
    initialSize:10,
    create:(x:number,y:number)=>new Vector2(x,y),
    init:(v:Vector2,x:number,y:number)=>v.set(x,y),
    reset:(v:Vector2)=>v.set(0,0)
})
PoolService.mixin(Matrix2D,{
    maxSize:10,
    initialSize:10,
    create:()=>Matrix2D.identity(),
    init:(v:Vector2)=>v.set(0,0),
})

export {
    vec2,
    vec3,
    mat2d,
    mat3,
    glMatrix as utils,
    Vector2,
    Matrix2D,
}