import { IVector2D, Vector2DLike } from "src/interface/IVector2D"

export class Vector2D implements IVector2D{
    x:number
    y:number
    constructor(x:number=0,y:number=0){
        this.x=x
        this.y=y
    }
    negate(): IVector2D {
        this.x=-this.x
        this.y=-this.y
        return this
    }
    normalize(): IVector2D {
        const length=this.length()
        this.x/=length
        this.y/=length
        return this
    }
    dot(vector: Vector2DLike): number {
        return this.x*vector.x+this.y*vector.y
    }
    cross(vector: Vector2DLike): number {
        return this.x*vector.y-this.y*vector.x
    }
    length(): number {
        return Math.sqrt(this.x*this.x+this.y*this.y)
    }
    squareLength(): number {
        return this.x*this.x+this.y*this.y
    }
    clone():IVector2D{
        return new Vector2D(this.x,this.y)
    }
    copy(vector:Vector2DLike):IVector2D{
        this.x=vector.x
        this.y=vector.y
        return this
    }
    add(vector:Vector2DLike):IVector2D{
        this.x+=vector.x
        this.y+=vector.y
        return this
    }
    subtract(vector:Vector2DLike):IVector2D{
        this.x-=vector.x
        this.y-=vector.y
        return this
    }
    multiply(vector:Vector2DLike):IVector2D{
        this.x*=vector.x
        this.y*=vector.y
        return this
    }
    divide(vector:Vector2DLike):IVector2D{
        this.x/=vector.x
        this.y/=vector.y
        return this
    }
    angle():number{
        return Math.atan2(this.y,this.x)
    }
    angleTo(vector:Vector2DLike):number{
        const dot=this.dot(vector)
        const cross=this.cross(vector)
        return Math.atan2(cross,dot)
    }
}