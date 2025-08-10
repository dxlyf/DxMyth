import { Vector2Like, Vector2Point } from './vec2'
import { Matrix2D } from './mat2d'

export class ObservablePoint extends Float32Array {
    static create(x: number, y: number) {
        return new this(x, y)
    }

    constructor(x: number, y: number) {
        super(2)
        this[0] = x;
        this[1] = y
    }
    get x() {
        return this[0]
    }
    get y() {
        return this[1]
    }
    set x(x: number) {
        if (this[0] !== x) {
            this[0] = x
            this._change(this)
        }
    }
    set y(y: number) {
        if (this[1] !== y) {
            this[1] = y
            this._change(this)
        }
    }
    _change(p: ObservablePoint) {
    }
    onChange(callback: (p: ObservablePoint) => void) {
        this._change = callback
    }
    copy(o: Vector2Like) {
        this.setXY(o[0], o[1])
    }
    setXY(x: number, y: number) {
        if (this[0] !== x || this[1] !== y) {
            this[0] = x
            this[1] = y
            this._change(this)
        }
    }
    set(a: any, length: number): void
    set(x: number, y: number) {
        this.setXY(x, y)
    }
}
export interface TransformableProps {
    position?: Vector2Point, // 位置向量
    rotation?: number, // 弧度
    angle?: number,
    scale?: Vector2Point, // 缩放向量

    origin?: Vector2Point, // 图形的变换原点
    pivot?: Vector2Point, // 图形的轴点
    skew?: Vector2Point// 斜切
}
export interface ITransformable  {
    parent:ITransformable|null
    position: ObservablePoint
    skew: ObservablePoint
    scale: ObservablePoint
    origin: ObservablePoint
    pivot: ObservablePoint
    angle:number
    rotation: number
    worldMatrixId:number
    matrix:Matrix2D
    worldMatrix:Matrix2D
    hasWorldMatrixDirty: boolean
    onTransformChange():void
}
// 定义一个可扩展的构造函数类型
type Constructor<T = {}> = new (...args: any[]) => T;

export function TransformableMixin<TBase extends Constructor>(BaseClass:TBase){
    return class extends BaseClass implements ITransformable  {
        position = ObservablePoint.create(0, 0)
        _rotation = 0
        _cx = 1
        _sx = 0
        _cy = 0
        _sy = 1
    
        skew = ObservablePoint.create(0, 0) // 斜切
        scale = ObservablePoint.create(1, 1) // 缩放向量
        origin = ObservablePoint.create(0, 0) // 图形的变换原点
        pivot = ObservablePoint.create(0, 0) // 图形的轴点
        public _matrix = Matrix2D.default() // 本地矩阵
        public _matrixWorld = Matrix2D.default() // 世界矩阵
        public localMatrixDirty = false // 本地矩阵是否需要更新
        public worldMatrixId = 0 // 当前世界矩阵每次更新的自增ID
        public parentWorldMatrixId = 0 // 父级世界矩阵ID，相同代表不需要更新
        parent: ITransformable | null = null
        children: ITransformable[] | null = null
        constructor(...args: any[]) {
            super(...args)
            const props = args[0] as TransformableProps | undefined
            this.position.onChange(this.onUpdateTransformable)
            this.scale.onChange(this.onUpdateTransformable)
            this.origin.onChange(this.onUpdateTransformable)
            this.pivot.onChange(this.onUpdateTransformable)
            this.skew.onChange(this.onUpdateTransformable)
            this.setTransformWithOptions(props)
        }
        get rotation() {
            return this._rotation
        }
        set rotation(rotation: number) {
            if (this._rotation !== rotation) {
                this._rotation = rotation
                this.onUpdateTransformable(this.skew)
            }
        }
        get angle() {
            return this._rotation / Math.PI * 180
        }
        set angle(angle: number) {
            this.rotation = angle / 180 * Math.PI
        }
        // 递归计算父级世界矩阵是否变化
        get hasWorldMatrixDirty(): boolean {
            if (this.parent) {
                // 如果父级世界矩阵没有变化，检查父级及祖先是否变化
                return this.parentWorldMatrixId === -1 || this.parentWorldMatrixId !== this.parent.worldMatrixId || this.parent.hasWorldMatrixDirty
            } else {
                return this.parentWorldMatrixId === -1 // 当前没有父级，为-1时，表示需要更新
            }
        }
        get matrix() {
            this.updateMatrix()
            return this._matrix
        }
        get worldMatrix() {
            this.updateWorldMatrix()
            return this._matrixWorld
        }
        setTransformWithOptions(options?: Partial<TransformableProps>) {
            if (!options) {
                return
            }
            if (options.position) {
                this.position.setXY(options.position.x, options.position.y)
            }
            if (options.rotation !== undefined) {
                this.rotation = options.rotation
            }
            if (options.angle !== undefined) {
                this.angle = options.angle
            }
            if (options.scale) {
                this.scale.setXY(options.scale.x, options.scale.y)
            }
            if (options.origin) {
                this.origin.setXY(options.origin.x, options.origin.y)
            }
            if (options.pivot) {
                this.pivot.setXY(options.pivot.x, options.pivot.y)
            }
            if (options.skew) {
                this.skew.setXY(options.skew.x, options.skew.y)
            }
        }
        setTransformFromMatrix(matrix: Matrix2D) {
            matrix.decompose(this)
            this.onUpdateTransformable()
        }
        // 更新局部矩阵，但不更新世界矩阵
        updateMatrix() {
            // 如果局部矩阵没有变化，不需要更新
            if (!this.localMatrixDirty) {
                return
            }
            this.localMatrixDirty = false // 标记为不需要更新
            const tx = this.position.x, ty = this.position.y
            const px = this.pivot.x, py = this.pivot.y
            const ox = -this.origin.x, oy = -this.origin.y
            const sx = this.scale.x, sy = this.scale.y
    
            const lt = this._matrix
            // get the matrix values of the container based on its this properties..
            lt.a = this._cx * sx;
            lt.b = this._sx * sx;
            lt.c = this._cy * sy;
            lt.d = this._sy * sy;
    
            lt.tx = tx - ((px * lt.a) + (py * lt.c)) // Pivot offset
                + ((ox * lt.a) + (oy * lt.c)) // Origin offset for rotation and scaling
                - (ox); 
            lt.ty = ty - ((px * lt.b) + (py * lt.d)) // Pivot offset
                + ((ox * lt.b) + (oy * lt.d)) // 旋转和缩放的原点偏移
                - (oy); 
            ;
            // lt.tx = tx - ((px * lt.a) + (py * lt.c)) // Pivot offset
            //     + ((ox * lt.a) + (oy * lt.c)) // Origin offset for rotation and scaling
            //     - (ox * sx); //移除未缩放的原点以保持位置，原点不影响缩放
            // lt.ty = ty - ((px * lt.b) + (py * lt.d)) // Pivot offset
            //     + ((ox * lt.b) + (oy * lt.d)) // 旋转和缩放的原点偏移
            //     - (oy * sy); //移除未缩放的原点以保持位置,原点不影响缩放
            // ;
        }
        updateWorldMatrix() {
            if (!this.hasWorldMatrixDirty) {
                return
            }
            if (this.parent) {
                this._matrixWorld.multiplyMatrices(this.parent.worldMatrix, this.matrix)
                this.parentWorldMatrixId = this.parent.worldMatrixId
            } else {
                this._matrixWorld.copy(this.matrix)
                this.parentWorldMatrixId = 0 // 没有父级，世界矩阵id为0
            }
            this.worldMatrixId += 1 // 每次世界矩阵更新，id加1
        }
        private onUpdateTransformable = (p?: ObservablePoint) => {
            if (p === this.skew) {
                this._updateSkew()
            }
            // 只是标记更新状态，用户使用matrix才会更新矩阵，这样可以减少不必要的计算
            this.localMatrixDirty = true // 这是矩阵需要更新的标志
            this.parentWorldMatrixId = -1 // 全局矩阵也需要更新
            this.onTransformChange()
        }
        private _updateSkew(): void {
            const rotation = this._rotation;
            const skew = this.skew;
            // 等MatrixMultiply(RotationMatrix, SkewMatrix)
            this._cx = Math.cos(rotation + skew.y);
            this._sx = Math.sin(rotation + skew.y);
            this._cy = -Math.sin(rotation - skew.x); // cos, added PI/2
            this._sy = Math.cos(rotation - skew.x); // sin, added PI/2
        }
        onTransformChange() { }
    
    }
}