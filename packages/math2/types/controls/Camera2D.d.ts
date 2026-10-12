import { Matrix2D } from '../math/Matrix2D';
import { Point } from '../math/Point';
import { BoundingRect } from '../math/BoundingRect';
import { Vector2Like } from '../math/Vector2';
export interface Camera2DOptions {
    /** 视口宽度（屏幕像素），默认 0 */
    width?: number;
    /** 视口高度（屏幕像素），默认 0 */
    height?: number;
    /** 相机中心的世界坐标 X，默认 0 */
    x?: number;
    /** 相机中心的世界坐标 Y，默认 0 */
    y?: number;
    /** 缩放百分比，100 表示 1:1，默认 100 */
    zoom?: number;
    /** 最小缩放百分比，默认 10 */
    minZoom?: number;
    /** 最大缩放百分比，默认 1000 */
    maxZoom?: number;
    /** 旋转角度（弧度），默认 0 */
    rotation?: number;
}
export declare class Camera2D {
    /** 相机中心对准的世界坐标点 */
    readonly position: Point;
    /** 缩放范围（百分比） */
    minZoom: number;
    maxZoom: number;
    private _width;
    private _height;
    private _zoom;
    private _rotation;
    private _matrix;
    private _inverseMatrix;
    private _dirty;
    constructor(options?: Camera2DOptions);
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    /** 设置视口尺寸 */
    resize(width: number, height: number): this;
    get zoom(): number;
    set zoom(value: number);
    /** 缩放系数：zoom / 100 */
    get scaleFactor(): number;
    private clampZoom;
    /** 设置缩放（自动按 minZoom/maxZoom 收敛） */
    setZoom(zoom: number): this;
    /** 兼容 ZoomTranslate 的命名 */
    scale(zoom: number): this;
    /** 旋转角度（弧度） */
    get rotation(): number;
    set rotation(value: number);
    setRotation(rotation: number): this;
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    /** 将相机中心移动到指定世界坐标 */
    moveTo(x: number, y: number): this;
    /** 标记变换矩阵需要重建 */
    markDirty(): this;
    private ensureMatrix;
    /** 世界 → 屏幕 变换矩阵 */
    getWorldToScreenMatrix(): Matrix2D;
    /** 屏幕 → 世界 变换矩阵 */
    getScreenToWorldMatrix(): Matrix2D;
    /** 世界坐标 → 屏幕坐标 */
    worldToScreen(v: Vector2Like, out?: Vector2Like): Vector2Like;
    /** 屏幕坐标 → 世界坐标 */
    screenToWorld(v: Vector2Like, out?: Vector2Like): Vector2Like;
    /** 世界矩形 → 屏幕包围盒 */
    worldRectToScreen(rect: BoundingRect): BoundingRect;
    /** 屏幕包围盒 → 世界矩形 */
    screenRectToWorld(rect: BoundingRect): BoundingRect;
    /**
     * 以屏幕像素为单位平移画面（等价于拖拽画布 dx, dy 像素）。
     */
    translate(dx: number, dy: number): this;
    /**
     * 以屏幕上 (screenX, screenY) 为锚点缩放到指定 zoom，
     * 保证锚点下的世界坐标保持不动。
     */
    scaleOrigin(zoom: number, screenX: number, screenY: number): this;
    /** 以某个因子在锚点处缩放（factor > 1 放大，< 1 缩小） */
    zoomAt(factor: number, screenX: number, screenY: number): this;
    /** 当前视口可见区域（世界坐标包围盒） */
    getVisibleWorldBounds(): BoundingRect;
    /**
     * 缩放并平移，使世界包围盒完整显示在视口内。
     * @param bounds  世界坐标包围盒
     * @param padding 视口边距（屏幕像素）
     */
    fitToBounds(bounds: BoundingRect, padding?: number): this;
    /** 重置相机：位置归零、缩放 100、旋转 0 */
    reset(): this;
}
