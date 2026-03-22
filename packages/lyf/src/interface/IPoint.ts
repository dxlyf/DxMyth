import { Matrix2DLike } from "./IMatrix2D"

export type PointLike={
    x:number
    y:number
}

export interface IPoint{
    x:number
    y:number
    onChange:(cb:(point:IPoint)=>void)=>void
    clone():IPoint
    copy(point:PointLike):IPoint
    set(x:number,y:number):IPoint
    add(point:PointLike):IPoint
    subtract(point:PointLike):IPoint
    multiply(point:PointLike):IPoint
    divide(point:PointLike):IPoint
    multiplyScalar(scalar:number):IPoint
    applyMatrix2D(matrix:Matrix2DLike):IPoint
}