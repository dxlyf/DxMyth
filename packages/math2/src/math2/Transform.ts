import { EventEmitter } from "src/events/EventEmitter";
import { Point as Vector2,type PointLike as  Vector2Like } from "src/math/Point";
import { Matrix2D } from "src/math/Matrix2D";
import {degToRad,radToDeg} from 'src/math/MathUtils'


export interface TransformOptions {
    position?: Vector2Like
    rotation?: number // 旋转角度，单位弧度
    angle?: number // 旋转角度，单位度
    scale?: Vector2Like
    pivot?: Vector2Like
}
export class Transform<Options, E extends Record<string,any>> extends EventEmitter<E> {
    parent: Transform<Options, E> | null = null;
    pivot = Vector2.create(0, 0)
    position = Vector2.create(0, 0);
    protected _rotation = 0; // 旋转角度，单位度
    scale = Vector2.create(1, 1)
    protected _matrix: Matrix2D = null;
    protected _worldMatrix: Matrix2D = null;
    protected _worldInverseMatrix: Matrix2D = null;
    protected _matrixDirty = false
    protected _matrixId = 0
    /** 
     * -1：表示父矩阵无效，需要重新计算世界矩阵
     * 0： 表示世界矩阵有效，不需要重新计算世界矩阵
    */
    protected _parentMatrixId = 0
    constructor(options?: TransformOptions) {
        super()
        this.updateTransform = this.updateTransform.bind(this)
        this.position.onChange(this.updateTransform)
        this.scale.onChange(this.updateTransform)
        this.pivot.onChange(this.updateTransform)
        if (options) {
            if (options.position) {
                this.position.copy(options.position)
            }
            if (options.rotation) {
                this.rotation = options.rotation
            } else if (options.angle) {
                this.angle = options.angle
            }
            if (options.scale) {
                this.scale.copy(options.scale)
            }
            if (options.pivot) {
                this.pivot.copy(options.pivot)
            }

        }

    }
    get rotation() {
        return this._rotation;
    }
    set rotation(v: number) {
        this._rotation = v
        this.updateTransform()
    }
    get angle() {
        return degToRad(this._rotation);
    }
    set angle(v: number) {
        this.rotation = radToDeg(v)
    }
    get matrix() {
        this.updateMatrix()
        return this._matrix;
    }
    get worldMatrix() {
        this.updateWorldMatrix()
        return this._worldMatrix;
    }
    get worldInverseMatrix() {
        this.updateWorldMatrix()
        return this._worldInverseMatrix;
    }
    protected shouldUpdateWorldMatrix(): boolean {
        if (this.parent) {
            return this._parentMatrixId === -1 || this._parentMatrixId !== this.parent._matrixId || this.parent.shouldUpdateWorldMatrix()
        } else {
            return this._parentMatrixId === -1
        }
    }
    setTransformFromMatrix(matrix: Matrix2D) {
        matrix.decomposeTRSP(matrix, this)
    }
    worldToLocal(vec: Vector2Like, out = Vector2.create()): Vector2Like {
        return this.worldInverseMatrix.mapPoint(out, vec)
    }
    localToWorld(vec: Vector2Like, out = Vector2.create()): Vector2Like {
        return this.worldMatrix.mapPoint(out, vec)
    }
    updateTransform() {
        this._matrixDirty = true // 标记矩阵需要更新
        this._parentMatrixId = -1 // 标记父矩阵id为无效，需要重新计算世界矩阵
    }
    updateMatrix() {
        if (this._matrix === null) {
            this._matrix = Matrix2D.identity()
        }
        if (!this._matrixDirty) {
            return
        }
        // this._matrix.translate(this.position).rotate(this._rotation).scale(this.scale).translate(this.pivot.clone().negate())
        this._matrix.fromTranslationRotationScalePivot(this.position, this._rotation, this.scale, this.pivot)
        this._matrixId = (this._matrixId + 1) & 0x7FFFFFFF
        this._matrixDirty = false
    }
    updateWorldMatrix() {
        if (this._worldMatrix === null) {
            this._worldMatrix = Matrix2D.identity()
        }
        if (this._worldInverseMatrix === null) {
            this._worldInverseMatrix = Matrix2D.identity()
        }
        if (!this.shouldUpdateWorldMatrix) {
            return
        }
        if (this.parent == null) {
            this._worldMatrix.copy(this.matrix)
            this._parentMatrixId = 0
        } else {
            this._worldMatrix.multiplyMatrices(this.parent.worldMatrix, this.matrix)
            this._parentMatrixId = this.parent._matrixId
        }
        this._worldInverseMatrix.copy(this._worldMatrix).invert()

    }
 
}