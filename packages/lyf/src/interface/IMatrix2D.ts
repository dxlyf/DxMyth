import { PointLike } from "./IPoint"

export type Matrix2DLike=number[]|Float32Array
export interface IMatrix2D extends Float32Array{
     a:number
     b:number
     c:number
     d:number
     tx:number
     ty:number
     clone():IMatrix2D
     copy(m:Matrix2DLike):IMatrix2D
     identity():IMatrix2D
     multiply(m:Matrix2DLike):IMatrix2D
     transformPoint(point:PointLike):PointLike
}