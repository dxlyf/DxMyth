import { IMatrix2D, Matrix2DLike } from "src/interface/IMatrix2D";
import { PointLike } from "src/interface/IPoint";

export const copy=(out:Matrix2DLike,m:Matrix2DLike)=>{
    out[0]=m[0]
    out[1]=m[1]
    out[2]=m[2]
    out[3]=m[3]
    out[4]=m[4]
    out[5]=m[5]
    return out
}
export const identity=(out:Matrix2DLike)=>{
    out[0]=1
    out[1]=0
    out[2]=0
    out[3]=1
    out[4]=0
    out[5]=0
    return out
}
export const multiplyMatrices=(out:Matrix2DLike,m:Matrix2DLike,n:Matrix2DLike)=>{
    // 列主序
    const a0 = m[0], a1 = m[1], a2 = m[2], a3 = m[3], a4 = m[4], a5 = m[5]
    const b0 = n[0], b1 = n[1], b2 = n[2], b3 = n[3], b4 = n[4], b5 = n[5]
    out[0] = a0 * b0 + a2 * b1
    out[1] = a1 * b0 + a3 * b1
    out[2] = a0 * b2 + a2 * b3
    out[3] = a1 * b2 + a3 * b3
    out[4] = a0 * b4 + a2 * b5 + a4
    out[5] = a1 * b4 + a3 * b5 + a5
    return out
}
export const inverse=(out:Matrix2DLike,m:Matrix2DLike)=>{
    // 列主序
    const a0 = m[0], a1 = m[1], a2 = m[2], a3 = m[3], a4 = m[4], a5 = m[5]
    // 计算行列式
    const det = a0 * a3 - a2 * a1
    if(det===0){
        throw new Error("Matrix is singular, cannot be inverted.")
    }
    // 行列式为零时矩阵不可逆，这里假设输入矩阵可逆
    const invDet = 1.0 / det
    // 计算伴随矩阵并除以行列式
    out[0] = a3 * invDet
    out[1] = -a1 * invDet
    out[2] = -a2 * invDet
    out[3] = a0 * invDet
    out[4] = (a2 * a5 - a3 * a4) * invDet
    out[5] = (a1 * a4 - a0 * a5) * invDet
    return out
}
export const determinant=(m:Matrix2DLike)=>{
    // 列主序
    const a0 = m[0], a1 = m[1], a2 = m[2], a3 = m[3]
    return a0 * a3 - a2 * a1
}
// 伴随
export const adjoint=(out:Matrix2DLike,m:Matrix2DLike)=>{
    // 列主序
    const a0 = m[0], a1 = m[1], a2 = m[2], a3 = m[3], a4 = m[4], a5 = m[5]
    out[0] = a3
    out[1] = -a1
    out[2] = -a2
    out[3] = a0
    out[4] = (a2 * a5 - a3 * a4)
    out[5] = (a1 * a4 - a0 * a5)
    return out
}
export const mapPoint=(out:PointLike,point:PointLike,m:Matrix2DLike)=>{
    const x=point.x,y=point.y
    const a0 = m[0], a1 = m[1], a2 = m[2], a3 = m[3], a4 = m[4], a5 = m[5]
    out.x=a0 * x + a2 * y + a4
    out.y=a1 * x + a3 * y + a5
    return out
}
export const mapPoints=(out:PointLike[],points:PointLike[],m:Matrix2DLike)=>{
    for(let i=0;i<points.length;i++){
        mapPoint(out[i],points[i],m)
    }
    return out
}

export const fromTranslateRotateScale=(out:Matrix2DLike,translate:PointLike,rotate:number,scale:PointLike)=>{
    const cos=Math.cos(rotate),sin=Math.sin(rotate)
    const sx=scale.x,sy=scale.y
    out[0]=cos*sx
    out[1]=sin*sx
    out[2]=-sin*sy
    out[3]=cos*sy
    out[4]=translate.x
    out[5]=translate.y
    return out
}
export const fromTranslate=(out:Matrix2DLike,x:number,y:number)=>{
    out[0]=1
    out[1]=0
    out[2]=0
    out[3]=1
    out[4]=x
    out[5]=y
    return out
}
export const fromRotate=(out:Matrix2DLike,rotate:number)=>{
    const cos=Math.cos(rotate),sin=Math.sin(rotate)
    out[0]=cos
    out[1]=sin
    out[2]=-sin
    out[3]=cos
    out[4]=0
    out[5]=0
    return out
}
/**
 * 从倾斜角度创建矩阵
 * @param out 
 * @param skewX 倾斜系数（斜率）
 * @param skewY 倾斜系数（斜率）
 * @returns 
 */
export const fromSkew=(out:Matrix2DLike,skewX:number,skewY:number)=>{
    out[0]=1
    out[1]=skewY
    out[2]=skewX
    out[3]=1
    out[4]=1
    out[5]=1
    return out
}
export const fromSkewAngle=(out:Matrix2DLike,angleX:number,angleY:number)=>{
    const skewX=Math.tan(angleX),skewY=Math.tan(angleY)
    out[0]=1
    out[1]=skewY
    out[2]=skewX
    out[3]=1
    out[4]=1
    out[5]=1
    return out
}
export const fromScale=(out:Matrix2DLike,scale:number)=>{
    out[0]=scale
    out[1]=0
    out[2]=0
    out[3]=scale
    out[4]=0
    out[5]=0
    return out
}
export const fromTranslateSkewRotationScaleOrigin=(out:Matrix2DLike,translate:PointLike,skew:PointLike,rotate:number,scale:PointLike,origin:PointLike)=>{
    const cos=Math.cos(rotate),sin=Math.sin(rotate)
    const skewX=Math.tan(skew.x),skewY=Math.tan(skew.y)
    const sx=scale.x,sy=scale.y
    const originX=origin.x,originY=origin.y
    const translateX=translate.x,translateY=translate.y
    
    let a=cos+skewX*sin
    let b=skewY*cos+sin
    let c=-sin+skewX*cos
    let d=skewY*-sin+cos
    let e=originX+translateX
    let f=originY+translateY
    a*=sx
    b*=sx
    c*=sy
    d*=sy
    e-=(a*originX+c*originY)
    f-=(b*originX+d*originY)
    out[0]=a
    out[1]=b
    out[2]=c
    out[3]=d
    out[4]=e
    out[5]=f
    return out
}
/**
 * 根
 * @param m 
 * @param origin 
 */
export const extractTranslateSkewRotationScaleOrigin=(m:Matrix2DLike,origin:PointLike)=>{
    const a0 = m[0], a1 = m[1], a2 = m[2], a3 = m[3], a4 = m[4], a5 = m[5]
    // 提取缩放
    const scaleX = Math.sqrt(a0 * a0 + a1 * a1)
    const scaleY = Math.sqrt(a2 * a2 + a3 * a3)
    
    // 提取旋转
    const rotation = Math.atan2(a1, a0)
    
    // 计算去掉旋转和缩放后的矩阵元素
    const cos = Math.cos(-rotation)
    const sin = Math.sin(-rotation)
    
    // 应用逆旋转，得到倾斜矩阵
    const skewMatrix0 = (a0 * cos + a1 * sin) / scaleX
    const skewMatrix1 = (-a0 * sin + a1 * cos) / scaleX
    const skewMatrix2 = (a2 * cos + a3 * sin) / scaleY
    const skewMatrix3 = (-a2 * sin + a3 * cos) / scaleY
    
    // 提取倾斜
    const skewX = Math.atan2(skewMatrix2, skewMatrix0)
    const skewY = Math.atan2(skewMatrix1, skewMatrix3)
    
    // 计算平移
    const translateX = a4 - origin.x + origin.x * scaleX * Math.cos(rotation) - origin.y * scaleY * Math.sin(rotation + skewX)
    const translateY = a5 - origin.y + origin.x * scaleX * Math.sin(rotation) + origin.y * scaleY * Math.cos(rotation + skewX)
    
    return {
        translate: { x: translateX, y: translateY },
        skew: { x: skewX, y: skewY },
        rotation: rotation,
        scale: { x: scaleX, y: scaleY }
    }
}

export class Matrix2D extends Float32Array implements IMatrix2D{
    clone(): IMatrix2D {
        return new Matrix2D(this)
    }
    copy(m: Matrix2DLike): IMatrix2D {
        copy(this,m)
        return this
    }
    isIdentity(): boolean {
        return this[0] === 1 && this[1] === 0 && this[2] === 0 && this[3] === 1 && this[4] === 0 && this[5] === 0
    }
    isScaleIdentity(): boolean {
        return this[0] === 1 && this[1] === 0 && this[2] === 0 && this[3] === 1
    }
    isTranslateIdentity(): boolean {
        return this[4] === 0 && this[5] === 0
    }
    isRotateIdentity(): boolean {
        return this[1]===0&&this[2]===0
    }
    identity(): IMatrix2D {
        identity(this)
        return this
    }
    multiplyMatrices(m: Matrix2DLike, n: Matrix2DLike): IMatrix2D {
        multiplyMatrices(this,m,n)
        return this
    }
    preMultiply(m: Matrix2DLike): IMatrix2D {
        multiplyMatrices(this,m,this)
        return this
    }
    postMultiply(m: Matrix2DLike): IMatrix2D {
        multiplyMatrices(this,this,m)
        return this
    }
    inverse(): IMatrix2D {
        inverse(this,this)
        return this
    }
    determinant(): number {
        return determinant(this)
    }
    fromTranslateSkewRotationScaleOrigin(translate:PointLike,skew:PointLike,rotate:number,scale:PointLike,origin:PointLike): IMatrix2D {
        fromTranslateSkewRotationScaleOrigin(this,translate,skew,rotate,scale,origin)
        return this
    }
    mapPoint(point: PointLike): PointLike;
    mapPoint(out: PointLike, point: PointLike): PointLike;
    mapPoint(out: PointLike, point?: PointLike): PointLike {
        if(!point){
            point=out
        }
        return mapPoint(out,point,this)
    }
    mapPoints(points: PointLike[]): PointLike[];
    mapPoints(out: PointLike[], points: PointLike[]): PointLike[];
    mapPoints(out: PointLike[], points?: PointLike[]): PointLike[] {
        if(!points){
            points=out
        }
        return mapPoints(out,points,this)
    }
    
    
}