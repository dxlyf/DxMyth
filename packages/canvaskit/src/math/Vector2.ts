import {glMatrix} from 'gl-matrix'
import type {Matrix2D} from './Matrix2D'
const toRadian=glMatrix.toRadian
const toDegree=glMatrix.toDegree
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
    
    _onChange?:(v:Vector2)=>void;
    constructor(x:number=0,y:number=0){
        super(2);
        this[0]=x;
        this[1]=y;
    }
    set x(v:number){
        this.set(v,this.x);
    }
    get x(){
        return this[0];
    }
    set y(v:number){
        this.set(this.x,v);
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
    copy(v:Vector2){
        this.set(v.x,v.y);
        return this;
    }
    clone(){
        return (this.constructor as typeof Vector2).create(this.x,this.y);
    }
    set(x:any,y:any){
        if(this.x!==x||this.y!==y){
            this[0]=x;
            this[1]=y;
            this.change();
        }
        return this;
    }
    add(v:Vector2){
        return this.set(this.x+v.x,this.y+v.y);
    }
    addVectors(a:Vector2,b:Vector2){
        return this.set(a.x+b.x,a.y+b.y);
    }
    subtract(v:Vector2){
        return this.set(this.x-v.x,this.y-v.y);
    }
    subtractVectors(a:Vector2,b:Vector2){
        return this.set(a.x-b.x,a.y-b.y);
    }
    multiplyScalar(s:number){
        return this.set(this.x*s,this.y*s);
    }
    divideScalar(s:number){
        return this.multiplyScalar(1/s);
    }
    multiply(v:Vector2){
        return this.set(this.x*v.x,this.y*v.y);
    }
    multiplyVectors(a:Vector2,b:Vector2){
        return this.set(a.x*b.x,a.y*b.y);
    }
    divide(v:Vector2){
        return this.set(this.x/v.x,this.y/v.y);
    }
    divideVectors(a:Vector2,b:Vector2){
        return this.set(a.x/b.x,a.y/b.y);
    }
    dot(v:Vector2){
        return this.x*v.x+this.y*v.y;
    }
    cross(v:Vector2){
        return this.x*v.y - this.y*v.x;
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
        return Math.atan2(this.y,this.x);
    }
    angleDegree(){
        return toDegree(this.angle());
    }
    distance(other:Vector2){
        return Math.sqrt(this.squareDistance(other));
    }
    squareDistance(other:Vector2){
        const dx=this.x - other.x;
        const dy=this.y - other.y;
        return dx*dx + dy*dy;
    }
    manhattanDistance(other: Vector2){
        return Math.abs(this.x-other.x)+Math.abs(this.y-other.y)
    }
    chebyshevDistance(other: Vector2) {
        return Math.max(Math.abs(this.x - other.x), Math.abs(this.y - other.y))
    }
    lerp(v:Vector2,alpha:number){
        return this.set(
            this.x+(v.x-this.x)*alpha,
            this.y+(v.y-this.y)*alpha
        );
    }
    translate(x:number,y:number){
        return this.set(this.x+x,this.y+y);
    }
    perpendicular(){
        return this.set(-this.y,this.x);
    }
    ccw(){
        return this.set(this.y,-this.x);
    }
    cw(){
        return this.set(-this.y,this.x);
    }
    negate(){
        return this.set(-this.x,-this.y);
    }
    floor(){
        return this.set(Math.floor(this.x),Math.floor(this.y));
    }
    ceil(){
        return this.set(Math.ceil(this.x),Math.ceil(this.y));
    }
    round(){
        return this.set(Math.round(this.x),Math.round(this.y));
    }
    min(v:Vector2){
        return this.set(Math.min(this.x,v.x),Math.min(this.y,v.y));
    }
    max(v:Vector2){
        return this.set(Math.max(this.x,v.x),Math.max(this.y,v.y));
    }
    projectOnVector(vector:Vector2){
        const scalar=this.dot(vector)/vector.squareMagnitude();
        return this.set(
            vector.x*scalar,
            vector.y*scalar
        );
    }
    projectOnDirection(direction:Vector2){
        const len=this.dot(direction);
        return this.set(
            direction.x*len,
            direction.y*len
        );
    }
    reflect(normal:Vector2){
        // R = V - 2*(V dot N)*N
        const k=this.dot(normal)*2;
        return this.set(
            this.x - k*normal.x,
            this.y - k*normal.y
        );
    }
    applyMatrix(m:Matrix2D){
        const x=this.x,y=this.y;
        return this.set(
            x*m[0]+y*m[2]+m[4],
            x*m[1]+y*m[3]+m[5]
        );
    }
    equals(v:Vector2){
        return this.x===v.x&&this.y===v.y;
    }
    equalsWithEpsilon(v:Vector2,epsilon:number=1e-6){
        return Math.abs(this.x - v.x)<=epsilon&&Math.abs(this.y - v.y)<=epsilon;
    }
    toString(){
        return `Vector2(${this.x},${this.y})`;
    }
}