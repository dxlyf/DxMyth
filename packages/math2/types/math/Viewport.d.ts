import { Point } from './Point';
import { Matrix2D } from './Matrix2D';
import { Vector2Like } from './Vector2';
import { BoundingRect } from './BoundingRect';
/**
 * Viewport 接口：定义视口的核心功能
 */
export interface IViewport {
    /** 视口变换矩阵 */
    position: Point;
    zoom: number;
    rotation: number;
    size: Point;
    worldToScreen(worldPos: Vector2Like): Vector2Like;
    screenToWorld(screenPos: Vector2Like): Vector2Like;
    worldRectToScreen(worldRect: BoundingRect): BoundingRect;
    screenRectToWorld(screenRect: BoundingRect): BoundingRect;
    getVisibleWorldBounds(): BoundingRect;
    pan(dx: number, dy: number): void;
    zoomAt(zoomFactor: number, centerScreen?: Vector2Like): void;
    fitToBounds(bounds: BoundingRect, padding?: number): void;
    reset(): void;
}
/**
 * Canvas Viewport 实现
 */
export declare class Viewport implements IViewport {
    position: Point;
    size: Point;
    private _zoom;
    private _rotation;
    private _worldToScreenMatrix;
    private _screenToWorldMatrix;
    private _dirty;
    private _screenToWorldMatrixDirty;
    private _cachedVisibleBounds;
    private _visibleBoundsDirty;
    constructor(width: number, height: number);
    get zoom(): number;
    set zoom(value: number);
    get rotation(): number;
    set rotation(value: number);
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    markMatrixUpdate(): void;
    /**
     * 世界坐标 → 屏幕坐标
     */
    worldToScreen(worldPos: Vector2Like): Vector2Like;
    /**
     * 屏幕坐标 → 世界坐标
     */
    screenToWorld(screenPos: Vector2Like): Vector2Like;
    /**
     * 世界矩形 → 屏幕矩形
     */
    worldRectToScreen(worldRect: BoundingRect): BoundingRect;
    /**
     * 屏幕矩形 → 世界矩形
     */
    screenRectToWorld(screenRect: BoundingRect): BoundingRect;
    /**
     * 获取世界→屏幕变换矩阵
     */
    getWorldToScreenMatrix(): Matrix2D;
    /**
     * 获取屏幕→世界变换矩阵
     */
    getScreenToWorldMatrix(): Matrix2D;
    /**
     * 构建世界→屏幕变换矩阵
     * 变换顺序：世界 → 视口变换 → 屏幕
     */
    private updateWorldToScreenMatrix;
    /**
     * 平移视口
     */
    pan(dx: number, dy: number): void;
    /**
     * 在指定点缩放
     * @param zoomFactor 缩放因子（>1 放大，<1 缩小）
     * @param centerScreen 缩放中心（屏幕坐标），默认在视口中心
     */
    zoomAt(zoomFactor: number, centerScreen?: Vector2Like): void;
    /**
     * 使视口适应指定的边界
     */
    fitToBounds(bounds: BoundingRect, padding?: number): void;
    /**
     * 重置视口
     */
    reset(): void;
    /**
     * 获取在世界坐标系中的可见区域
     */
    getVisibleWorldBounds(): BoundingRect;
    /**
     * 检查一个世界矩形是否在可见区域内
     */
    isVisible(worldRect: BoundingRect, margin?: number): boolean;
}
