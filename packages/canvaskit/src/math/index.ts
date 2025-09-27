import {vec2,vec3,mat2d,mat3,glMatrix} from 'gl-matrix'
export const toDegree=glMatrix.toDegree
export const toRadian=glMatrix.toRadian


export class Vec2 extends Float32Array{
    static add=vec2.add
    static sub=vec2.sub
    static default(){
        return new this(0,0)
    }
    static create(x:number,y:number){
        return new this(x,y)
    }
    constructor(x:number=0,y:number=0){
        super([x,y])
    }
    setXY(x:number,y:number){
        this[0]=x
        this[1]=y
    }
    copy(source:Vec2){
         this.set(source)
         return this
    }
    clone(){
        return 
    }
}

export {
    vec2,
    vec3,
    mat2d,
    mat3,
    glMatrix as utils
}