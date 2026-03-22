import { Matrix2DLike } from "./IMatrix2D"


export type Vector2DLike=number[]|Float32Array
export interface IVector2D extends Float32Array{
    clone():IVector2D
    copy(vector:Vector2DLike):IVector2D
    add(vector:Vector2DLike):IVector2D
    subtract(vector:Vector2DLike):IVector2D
    multiply(vector:Vector2DLike):IVector2D
    divide(vector:Vector2DLike):IVector2D
    negate():IVector2D
    normalize():IVector2D
    dot(vector:Vector2DLike):number
    cross(vector:Vector2DLike):number
    magnitude():number
    squareMagnitude():number
    distanceTo(vector:Vector2DLike):number
    angleTo(vector:Vector2DLike):number
    angle():number
    applyMatrix2D(matrix:Matrix2DLike):IVector2D
    equals(vector:Vector2DLike):boolean
    equalsEpsilon(vector:Vector2DLike,epsilon:number):boolean
}
