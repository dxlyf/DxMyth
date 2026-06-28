import { Matrix2D } from "./Matrix2D"
import { Point,PointLike } from "./Point"

export type TransformProps={
    position?:PointLike
    scale?:PointLike
    skew?:PointLike
    origin?:PointLike
    rotation?:number
}
export class Transform  {
    static default(){
        return new Transform()
    }
    position: Point
    scale: Point
    skew: Point
    origin: Point
    _rotation: number
    /** 本地变换矩阵 */
    _matrix: Matrix2D
    /** 世界变换矩阵（缓存） */
    _worldMatrix: Matrix2D
    /** 世界变换矩阵的逆矩阵（缓存） */
    _worldMatrixInvert: Matrix2D

    /** 本地版本号，每次本地矩阵变化时递增 */
    _version: number = 0
    /** 上次计算世界矩阵时父级的版本号 */
    _parentWorldVersion: number = 0
    _matrixDirty: boolean = true
    /** 世界矩阵是否需要重新计算 */
    _worldDirty: boolean = true
    /** 逆矩阵是否需要重新计算 */
    _invertDirty: boolean = true

    /** 父级 Transform */
    parent: Transform | null = null
    _changeCallback: (target: Transform) => void
    constructor() {
        this.position = Point.create(0, 0)
        this._rotation = 0
        this.skew = Point.create(0, 0)
        this.scale = Point.create(1, 1)
        this.origin = Point.create(0, 0)

        this.position.onChange(this.markDirty)
        this.skew.onChange(this.markDirty)
        this.scale.onChange(this.markDirty)
        this.origin.onChange(this.markDirty)
    }
    get roation() {
        return this._rotation
    }
    set rotation(v: number) {
        if (this._rotation !== v) {
            this._rotation = v;
            this.markDirty()
        }
    }
    setParent(parent: Transform | null) {
        this.parent = parent
        this.markDirty()
    }
    onChange(callback: () => void) {
        this._changeCallback = callback
    }
    setProps(prosp:TransformProps){
        if(prosp.position){
            this.position.set(prosp.position.x, prosp.position.y)
        }
        if(prosp.scale){
            this.scale.set(prosp.scale.x, prosp.scale.y)
        }
        if(prosp.skew){
            this.skew.set(prosp.skew.x, prosp.skew.y)
        }
        if(prosp.origin){
            this.origin.set(prosp.origin.x, prosp.origin.y)
        }
        if(prosp.rotation){
            this.rotation = prosp.rotation
        }
 
    }
    private markDirty = () => {
        this._matrixDirty = true
        this._worldDirty = true
        this._invertDirty = true
        this._changeCallback?.(this)
    }
    get matrix() {
        this.updateMatrix()
        return this._matrix
    }
    get worldMatrix() {
        this.updateWorldMatrix()
        return this._worldMatrix
    }
    get worldMatrixInvert() {
        this.updateWorldMatrixInvert()
        return this._worldMatrixInvert
    }
    updateMatrix() {
        if (this._matrixDirty) {
            if (!this._matrix) {
                this._matrix = Matrix2D.identity()
            }
            this._matrix.fromTranslateRotationSkewScaleOrigin(this.position, this._rotation, this.skew, this.scale, this.origin)
            this._matrixDirty = false
            this._worldDirty = true
            this._invertDirty = true
            this._version++
            
  
        }
    }
    hasParentDirty(): boolean {
        if (!this.parent) {
            return false
        }
        const parent=this.parent as Transform
        return parent._matrixDirty || this._parentWorldVersion !== parent._version || parent.hasParentDirty()
    }
    updateWorldMatrix() {
        if (this._worldDirty || this.hasParentDirty()) {
            if (!this._worldMatrix) {
                this._worldMatrix = Matrix2D.identity()
            }
            if (this.parent) {
                const parentWorldMatrix = this.parent.worldMatrix
                const matrix = this.matrix
                this._worldMatrix.multiplyMatrices(parentWorldMatrix, matrix)
                this._parentWorldVersion = (this.parent as Transform)._version
            } else {
                this._worldMatrix.copy(this.matrix)
            }
            this._worldDirty = false
            this._invertDirty = true

        }
    }
    updateWorldMatrixInvert() {
        this.updateWorldMatrix()
        if (this._invertDirty) {
            if (!this._worldMatrixInvert) {
                this._worldMatrixInvert = Matrix2D.identity()
            }
            this._worldMatrixInvert.copy(this._worldMatrix)
            this._worldMatrixInvert.invert()
            this._invertDirty = false

        }
    }

}
