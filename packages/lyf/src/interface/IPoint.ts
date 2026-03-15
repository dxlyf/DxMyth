import { Matrix2DLike } from "./IMatrix2D"

export type PointLike={
    x:number
    y:number
}

export interface IPoint{
    x:number
    y:number
    clone():IPoint
    copy(point:PointLike):IPoint
    add(point:PointLike):IPoint
    subtract(point:PointLike):IPoint
    multiply(point:PointLike):IPoint
    divide(point:PointLike):IPoint
    applyMatrix2D(matrix:Matrix2DLike):IPoint
}