import { Matrix2DLike } from "src/interface/IMatrix2D"
import { PointLike } from "src/interface/IPoint"
import { IVector2D, Vector2DLike } from "src/interface/IVector2D"
export const copy=(out:Vector2DLike,vector:Vector2DLike)=>{
    out[0]=vector[0]
    out[1]=vector[1]
    return out
}
export const subtract = (out: Vector2DLike, vector: Vector2DLike, vector2: Vector2DLike) => {
    out[0] = vector[0] - vector2[0]
    out[1] = vector[1] - vector2[1]
    return out
}
export const add = (out: Vector2DLike, vector: Vector2DLike, vector2: Vector2DLike) => {
    out[0] = vector[0] + vector2[0]
    out[1] = vector[1] + vector2[1]
    return out
}
export const multiply = (out: Vector2DLike, vector: Vector2DLike, vector2: Vector2DLike) => {
    out[0] = vector[0] * vector2[0]
    out[1] = vector[1] * vector2[1]
    return out
}
export const divide = (out: Vector2DLike, vector: Vector2DLike, vector2: Vector2DLike) => {
    out[0] = vector[0] / vector2[0]
    out[1] = vector[1] / vector2[1]
    return out
}
export const multiplyScalar = (out: Vector2DLike, vector: Vector2DLike, scale: number) => {
    out[0] = vector[0] * scale
    out[1] = vector[1] * scale
    return out
}
export const divideScalar = (out: Vector2DLike, vector: Vector2DLike, scale: number) => {
    out[0] = vector[0] / scale
    out[1] = vector[1] / scale
    return out
}
export const negate = (out: Vector2DLike, vector: Vector2DLike) => {
    out[0] = -vector[0]
    out[1] = -vector[1]
    return out
}
export const magnitude = (vector: Vector2DLike) => {
    return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1])
}
export const squareMagnitude = (vector: Vector2DLike) => {
    return vector[0] * vector[0] + vector[1] * vector[1]
}
export const distanceTo = (vector: Vector2DLike, vector2: Vector2DLike) => {
    return Math.sqrt(distanceToSquared(vector, vector2))
}
export const distanceToSquared = (vector: Vector2DLike, vector2: Vector2DLike) => {
    const x = vector[0] - vector2[0]
    const y = vector[1] - vector2[1]
    return x * x + y * y
}
export const dot = (vector: Vector2DLike, vector2: Vector2DLike) => {
    return vector[0] * vector2[0] + vector[1] * vector2[1]
}
export const cross = (vector: Vector2DLike, vector2: Vector2DLike) => {
    return vector[0] * vector2[1] - vector[1] * vector2[0]
}
export const angleTo = (vector: Vector2DLike, vector2: Vector2DLike) => {
    return dot(vector, vector2) / (magnitude(vector) * magnitude(vector2))
}
export const angle = (vector: Vector2DLike) => {
    return Math.atan2(vector[1], vector[0])
}
export const normalize = (out: Vector2DLike, vector: Vector2DLike) => {
    const length = magnitude(vector)
    if (length === 0) {
        out[0] = 0
        out[1] = 0
        return out
    }
    out[0] = vector[0] / length
    out[1] = vector[1] / length
    return out
}
export const setLength = (out: Vector2DLike, vector: Vector2DLike, len: number) => {
    const length = magnitude(vector)
    if (length === 0) {
        return false
    }
    const scale = len / length
    out[0] = vector[0] * scale
    out[1] = vector[1] * scale
    return true
}
export const equals = (vector: Vector2DLike, vector2: Vector2DLike) => {
    return vector[0] === vector2[0] && vector[1] === vector2[1]
}
export const equalsEpsilon = (vector: Vector2DLike, vector2: Vector2DLike, epsilon: number = 1e-6) => {
    return Math.abs(vector[0] - vector2[0]) <= epsilon && Math.abs(vector[1] - vector2[1]) <= epsilon
}
export const applyMatrix2D=(out:Vector2DLike,vector:Vector2DLike,matrix:Matrix2DLike)=>{
    const x=vector[0]
    const y=vector[1]
    out[0]=x*matrix[0]+y*matrix[2]+matrix[4]
    out[1]=x*matrix[1]+y*matrix[3]+matrix[5]
    return out
}

export const isZero = (vector: Vector2DLike) => {
    return vector[0] === 0 && vector[1] === 0
}
export const isOne = (vector: Vector2DLike) => {
    return vector[0] === 1 && vector[1] === 1
}
export const isFinite = (vector: Vector2DLike) => {
    return Number.isFinite(vector[0]) && Number.isFinite(vector[1])
}

export const fromAngle = (out: Vector2DLike, angle: number, len: number) => {
    out[0] = len * Math.cos(angle) * Math.PI / 180
    out[1] = len * Math.sin(angle) * Math.PI / 180
    return out
}

export const from = (out: Vector2DLike, vector: Vector2DLike) => {
    out[0] = vector[0]
    out[1] = vector[1]
    return out
}
export const fromValues = (out: Vector2DLike, x: number, y: number) => {
    out[0] = x
    out[1] = y
    return out
}
export const fromPoint=(out:Vector2DLike,point:PointLike)=>{
    out[0]=point.x
    out[1]=point.y
    return out
}
export class Vector2D extends Float32Array implements IVector2D {
    static ZERO=new Vector2D([0,0])
    static ONE=new Vector2D([1,1])
    static fromRotation(radian:number){
        return new Vector2D([Math.cos(radian),Math.sin(radian)])
    }
    static fromPoint(point:PointLike){
        return new Vector2D([point.x,point.y])
    }
    static fromValues(x:number,y:number){
        return new Vector2D([x,y])
    }
    clone(): IVector2D {
        return new Vector2D(this)
    }
    copy(vector: Vector2DLike): IVector2D {
        copy(this,vector)
        return this
    }
    add(vector: Vector2DLike): IVector2D {
        add(this, this, vector)
        return this
    }
    subtract(vector: Vector2DLike): IVector2D {
        subtract(this, this, vector)
        return this
    }
    multiply(vector: Vector2DLike): IVector2D {
        multiply(this, this, vector)
        return this
    }
    divide(vector: Vector2DLike): IVector2D {
        divide(this, this, vector)
        return this
    }
    negate(): IVector2D {
        negate(this, this)
        return this
    }
    normalize(): IVector2D {
        normalize(this, this)
        return this
    }
    dot(vector: Vector2DLike): number {
        return dot(this, vector)
    }
    cross(vector: Vector2DLike): number {
        return cross(this, vector)
    }
    magnitude(): number {
        return magnitude(this)
    }
    squareMagnitude(): number {
        return squareMagnitude(this)
    }
    distanceTo(vector: Vector2DLike): number {
        return distanceTo(this, vector)
    }
    distanceToSquared(vector: Vector2DLike): number {
        return distanceToSquared(this, vector)
    }
    angleTo(vector: Vector2DLike): number {
        return angleTo(this, vector)
    }
    angle(): number {
        return angle(this)
    }
    applyMatrix2D(matrix: Matrix2DLike): IVector2D {
        applyMatrix2D(this,this, matrix)
        return this
    }
    equals(vector: Vector2DLike): boolean {
        return equals(this, vector)
    }
    equalsEpsilon(vector: Vector2DLike, epsilon: number): boolean {
        return equalsEpsilon(this, vector, epsilon)
    }


}