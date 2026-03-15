

export type Vector2DLike={
    x:number
    y:number
}
export interface IVector2D{
    x:number
    y:number
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
    length():number
    squareLength():number
    angleTo(vector:Vector2DLike):number
    angle():number
}
