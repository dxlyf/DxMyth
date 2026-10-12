// ============================================================
// Camera2D — 2D 相机
// 负责世界坐标与屏幕坐标之间的变换：平移(pan)、缩放(zoom)、旋转(rotate)。
//
// 变换模型（world → screen）：
//   screen = viewportCenter + scale · R(-rotation) · (world - position)
// 其中：
//   - position 为相机中心对准的世界坐标点
//   - scale = zoom / 100（与 ZoomTranslate / Ruler / Timeline 的约定保持一致）
//   - R(-rotation) 为反向旋转矩阵
// ============================================================

import { Matrix2D } from '../math/Matrix2D'
import { Point } from '../math/Point'
import { BoundingRect } from '../math/BoundingRect'
import type { Vector2Like } from '../math/Vector2'

export interface Camera2DOptions {
    /** 视口宽度（屏幕像素），默认 0 */
    width?: number
    /** 视口高度（屏幕像素），默认 0 */
    height?: number
    /** 相机中心的世界坐标 X，默认 0 */
    x?: number
    /** 相机中心的世界坐标 Y，默认 0 */
    y?: number
    /** 缩放百分比，100 表示 1:1，默认 100 */
    zoom?: number
    /** 最小缩放百分比，默认 10 */
    minZoom?: number
    /** 最大缩放百分比，默认 1000 */
    maxZoom?: number
    /** 旋转角度（弧度），默认 0 */
    rotation?: number
}

export class Camera2D {
    /** 相机中心对准的世界坐标点 */
    readonly position: Point
    /** 缩放范围（百分比） */
    minZoom: number
    maxZoom: number

    private _width: number
    private _height: number
    private _zoom: number
    private _rotation: number

    // 变换矩阵缓存
    private _matrix: Matrix2D = Matrix2D.identity()
    private _inverseMatrix: Matrix2D = Matrix2D.identity()
    private _dirty: boolean = true

    constructor(options: Camera2DOptions = {}) {
        this._width = options.width ?? 0
        this._height = options.height ?? 0
        this.position = new Point(options.x ?? 0, options.y ?? 0)
        this.minZoom = options.minZoom ?? 10
        this.maxZoom = options.maxZoom ?? 1000
        this._zoom = this.clampZoom(options.zoom ?? 100)
        this._rotation = options.rotation ?? 0
        // 位置变化时自动失效矩阵缓存
        this.position.onChange(() => this.markDirty())
    }

    // ============ 视口尺寸 ============

    get width(): number {
        return this._width
    }
    set width(value: number) {
        if (this._width !== value) {
            this._width = value
            this.markDirty()
        }
    }

    get height(): number {
        return this._height
    }
    set height(value: number) {
        if (this._height !== value) {
            this._height = value
            this.markDirty()
        }
    }

    /** 设置视口尺寸 */
    resize(width: number, height: number): this {
        this.width = width
        this.height = height
        return this
    }

    // ============ 缩放 ============

    get zoom(): number {
        return this._zoom
    }
    set zoom(value: number) {
        this.setZoom(value)
    }

    /** 缩放系数：zoom / 100 */
    get scaleFactor(): number {
        return this._zoom / 100
    }

    private clampZoom(zoom: number): number {
        return Math.max(this.minZoom, Math.min(this.maxZoom, zoom))
    }

    /** 设置缩放（自动按 minZoom/maxZoom 收敛） */
    setZoom(zoom: number): this {
        const next = this.clampZoom(zoom)
        if (next !== this._zoom) {
            this._zoom = next
            this.markDirty()
        }
        return this
    }

    /** 兼容 ZoomTranslate 的命名 */
    scale(zoom: number): this {
        return this.setZoom(zoom)
    }

    // ============ 旋转 ============

    /** 旋转角度（弧度） */
    get rotation(): number {
        return this._rotation
    }
    set rotation(value: number) {
        this.setRotation(value)
    }

    setRotation(rotation: number): this {
        if (this._rotation !== rotation) {
            this._rotation = rotation
            this.markDirty()
        }
        return this
    }

    // ============ 位置 ============

    get x(): number {
        return this.position.x
    }
    set x(value: number) {
        this.position.x = value
    }

    get y(): number {
        return this.position.y
    }
    set y(value: number) {
        this.position.y = value
    }

    /** 将相机中心移动到指定世界坐标 */
    moveTo(x: number, y: number): this {
        this.position.set(x, y)
        return this
    }

    // ============ 矩阵缓存 ============

    /** 标记变换矩阵需要重建 */
    markDirty(): this {
        this._dirty = true
        return this
    }

    private ensureMatrix(): void {
        if (!this._dirty) return
        const m = this._matrix
        m.identity()
        // 1. 平移到视口中心
        m.translate(this._width * 0.5, this._height * 0.5)
        // 2. 反向旋转（世界坐标随相机旋转的反方向旋转）
        m.rotate(-this._rotation)
        // 3. 缩放
        m.scale(this.scaleFactor, this.scaleFactor)
        // 4. 平移到相机中心的世界坐标
        m.translate(-this.position.x, -this.position.y)
        // 逆矩阵：屏幕 → 世界
        this._inverseMatrix.copy(m).invert()
        this._dirty = false
    }

    /** 世界 → 屏幕 变换矩阵 */
    getWorldToScreenMatrix(): Matrix2D {
        this.ensureMatrix()
        return this._matrix
    }

    /** 屏幕 → 世界 变换矩阵 */
    getScreenToWorldMatrix(): Matrix2D {
        this.ensureMatrix()
        return this._inverseMatrix
    }

    // ============ 坐标转换 ============

    /** 世界坐标 → 屏幕坐标 */
    worldToScreen(v: Vector2Like, out: Vector2Like = { x: 0, y: 0 }): Vector2Like {
        const m = this.getWorldToScreenMatrix()
        const x = v.x, y = v.y
        out.x = m[0] * x + m[2] * y + m[4]
        out.y = m[1] * x + m[3] * y + m[5]
        return out
    }

    /** 屏幕坐标 → 世界坐标 */
    screenToWorld(v: Vector2Like, out: Vector2Like = { x: 0, y: 0 }): Vector2Like {
        const m = this.getScreenToWorldMatrix()
        const x = v.x, y = v.y
        out.x = m[0] * x + m[2] * y + m[4]
        out.y = m[1] * x + m[3] * y + m[5]
        return out
    }

    /** 世界矩形 → 屏幕包围盒 */
    worldRectToScreen(rect: BoundingRect): BoundingRect {
        const a = this.worldToScreen({ x: rect.left, y: rect.top })
        const b = this.worldToScreen({ x: rect.right, y: rect.bottom })
        return BoundingRect.fromLTRB(a.x, a.y, b.x, b.y)
    }

    /** 屏幕包围盒 → 世界矩形 */
    screenRectToWorld(rect: BoundingRect): BoundingRect {
        const a = this.screenToWorld({ x: rect.left, y: rect.top })
        const b = this.screenToWorld({ x: rect.right, y: rect.bottom })
        return BoundingRect.fromLTRB(a.x, a.y, b.x, b.y)
    }

    // ============ 视图操作 ============

    /**
     * 以屏幕像素为单位平移画面（等价于拖拽画布 dx, dy 像素）。
     */
    translate(dx: number, dy: number): this {
        const inv = this.getScreenToWorldMatrix()
        const wx = inv[0] * dx + inv[2] * dy
        const wy = inv[1] * dx + inv[3] * dy
        this.position.set(this.position.x - wx, this.position.y - wy)
        return this
    }

    /**
     * 以屏幕上 (screenX, screenY) 为锚点缩放到指定 zoom，
     * 保证锚点下的世界坐标保持不动。
     */
    scaleOrigin(zoom: number, screenX: number, screenY: number): this {
        const before = this.screenToWorld({ x: screenX, y: screenY })
        this.setZoom(zoom)
        const after = this.screenToWorld({ x: screenX, y: screenY })
        this.position.set(
            this.position.x + before.x - after.x,
            this.position.y + before.y - after.y,
        )
        return this
    }

    /** 以某个因子在锚点处缩放（factor > 1 放大，< 1 缩小） */
    zoomAt(factor: number, screenX: number, screenY: number): this {
        return this.scaleOrigin(this._zoom * factor, screenX, screenY)
    }

    /** 当前视口可见区域（世界坐标包围盒） */
    getVisibleWorldBounds(): BoundingRect {
        const corners = [
            this.screenToWorld({ x: 0, y: 0 }),
            this.screenToWorld({ x: this._width, y: 0 }),
            this.screenToWorld({ x: this._width, y: this._height }),
            this.screenToWorld({ x: 0, y: this._height }),
        ]
        return BoundingRect.fromPoints(corners)
    }

    /**
     * 缩放并平移，使世界包围盒完整显示在视口内。
     * @param bounds  世界坐标包围盒
     * @param padding 视口边距（屏幕像素）
     */
    fitToBounds(bounds: BoundingRect, padding: number = 0): this {
        if (bounds.isEmpty() || bounds.width <= 0 || bounds.height <= 0) return this
        const availW = Math.max(this._width - padding * 2, 1)
        const availH = Math.max(this._height - padding * 2, 1)
        const scale = Math.min(availW / bounds.width, availH / bounds.height)
        this.setZoom(scale * 100)
        this.position.set(bounds.centerX, bounds.centerY)
        return this
    }

    /** 重置相机：位置归零、缩放 100、旋转 0 */
    reset(): this {
        this._rotation = 0
        this._zoom = this.clampZoom(100)
        this.position.set(0, 0)
        return this.markDirty()
    }
}
