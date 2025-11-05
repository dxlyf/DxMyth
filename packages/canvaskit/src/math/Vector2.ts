import {glMatrix} from 'gl-matrix'
import type {Matrix2D} from './Matrix2D'
const toRadian=glMatrix.toRadian
const toDegree=glMatrix.toDegree
export type Vector2Like=Float32Array|number[]
export class Vector2 extends Float32Array{
    static toRadian=toRadian
    static toDegree=toDegree
    static default(){
        return new this(0,0);
    }
    static create(x:number=0,y:number=0){
        return new this(x,y);
    }
    static fromRadian(rad:number){
        return new this(Math.cos(rad),Math.sin(rad));
    }
    static fromDegree(deg:number){
        return this.fromRadian(toRadian(deg));
    }
    static fromVectorLike(vec:Vector2Like){
        return this.create(vec[0],vec[1]);
    }
    _onChange?:(v:Vector2)=>void;
    constructor(x:number=0,y:number=0){
        super(2);
        this[0]=x;
        this[1]=y;
    }
    set x(v:number){
        this.set(v,this[0]);
    }
    get x(){
        return this[0];
    }
    set y(v:number){
        this.set(this[0],v);
    }
    get y(){
        return this[1];
    }
    onChange(callback: (v:Vector2)=>void|null){
        this._onChange=callback;
        return this;
    }
    private change(){
        if(this._onChange){
            this._onChange(this);
        }
        return this
    }
    copy(v:Vector2Like){
        this.set(v[0],v[1]);
        return this;
    }
    clone(){
        return (this.constructor as typeof Vector2).create(this[0],this[1]);
    }
    set(x:any,y:any){
        if(this[0]!==x||this[1]!==y){
            this[0]=x;
            this[1]=y;
            this.change();
        }
        return this;
    }
    add(v:Vector2Like){
        return this.set(this[0]+v[0],this[1]+v[1]);
    }
    addVectors(a:Vector2Like,b:Vector2Like){
        return this.set(a[0]+b[0],a[1]+b[1]);
    }
    subtract(v:Vector2Like){
        return this.set(this[0]-v[0],this[1]-v[1]);
    }
    subtractVectors(a:Vector2Like,b:Vector2Like){
        return this.set(a[0]-b[0],a[1]-b[1]);
    }
    multiplyScalar(s:number){
        return this.set(this[0]*s,this[1]*s);
    }
    divideScalar(s:number){
        return this.multiplyScalar(1/s);
    }
    multiply(v:Vector2Like){
        return this.set(this[0]*v[0],this[1]*v[1]);
    }
    multiplyVectors(a:Vector2Like,b:Vector2Like){
        return this.set(a[0]*b[0],a[1]*b[1]);
    }
    divide(v:Vector2Like){
        return this.set(this[0]/v[0],this[1]/v[1]);
    }
    divideVectors(a:Vector2Like,b:Vector2Like){
        return this.set(a[0]/b[0],a[1]/b[1]);
    }
    dot(v:Vector2Like){
        return this[0]*v[0]+this[1]*v[1];
    }
    cross(v:Vector2Like){
        return this[0]*v[1] - this[1]*v[0];
    }
    squareMagnitude(){
        return this.dot(this);
    }
    magnitude(){
        return Math.sqrt(this.dot(this))
    }
    normalize(){
        const mag=this.magnitude();
        if(mag>0){
            return this.divideScalar(mag);
        }
        return this.set(0,0);
    }
    angle(){
        return Math.atan2(this[1],this[0]);
    }
    angleDegree(){
        return toDegree(this.angle());
    }
    distance(other:Vector2Like){
        return Math.sqrt(this.squareDistance(other));
    }
    squareDistance(other:Vector2Like){
        const dx=this[0] - other[0];
        const dy=this[1] - other[1];
        return dx*dx + dy*dy;
    }
    manhattanDistance(other: Vector2Like){
        return Math.abs(this[0]-other[0])+Math.abs(this[1]-other[1])
    }
    chebyshevDistance(other: Vector2Like) {
        return Math.max(Math.abs(this[0] - other[0]), Math.abs(this[1] - other[1]))
    }
    lerp(v:Vector2Like,alpha:number){
        return this.set(
            this[0]+(v[0]-this[0])*alpha,
            this[1]+(v[1]-this[1])*alpha
        );
    }
    translate(x:number,y:number){
        return this.set(this[0]+x,this[1]+y);
    }
    perpendicular(){
        return this.set(-this[1],this[0]);
    }
    ccw(){
        return this.set(this[1],-this[0]);
    }
    cw(){
        return this.set(-this[1],this[0]);
    }
    negate(){
        return this.set(-this[0],-this[1]);
    }
    floor(){
        return this.set(Math.floor(this[0]),Math.floor(this[1]));
    }
    ceil(){
        return this.set(Math.ceil(this[0]),Math.ceil(this[1]));
    }
    round(){
        return this.set(Math.round(this[0]),Math.round(this[1]));
    }
    min(v:Vector2Like){
        return this.set(Math.min(this[0],v[0]),Math.min(this[1],v[1]));
    }
    max(v:Vector2Like){
        return this.set(Math.max(this[0],v[0]),Math.max(this[1],v[1]));
    }
    projectOnVector(vector:Vector2Like){
        const scalar=this.dot(vector)/Vector2.fromVectorLike(vector).squareMagnitude();
        return this.set(
            vector[0]*scalar,
            vector[1]*scalar
        );
    }
    projectOnDirection(direction:Vector2Like){
        const len=this.dot(direction);
        return this.set(
            direction[0]*len,
            direction[1]*len
        );
    }
    reflect(normal:Vector2Like){
        // R = V - 2*(V dot N)*N
        const k=this.dot(normal)*2;
        return this.set(
            this[0] - k*normal[0],
            this[1] - k*normal[1]
        );
    }
    applyMatrix(m:Matrix2D){
        const x=this[0],y=this[1];
        return this.set(
            x*m[0]+y*m[2]+m[4],
            x*m[1]+y*m[3]+m[5]
        );
    }
    equals(v:Vector2Like){
        return this[0]===v[0]&&this[1]===v[1];
    }
    equalsWithEpsilon(v:Vector2Like,epsilon:number=1e-6){
        return Math.abs(this[0] - v[0])<=epsilon&&Math.abs(this[1] - v[1])<=epsilon;
    }
    toString(){
        return `Vector2(${this[0]},${this[1]})`;
    }
}