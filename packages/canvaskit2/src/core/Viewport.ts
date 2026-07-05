// ============ Viewport 核心定义 ============

import { Matrix2D } from "src/math/Matrix2D";
import { BoundingRect } from "src/math/BoundingRect";
import { Point } from "src/math/Point";
import { type Vector2Like } from "src/math/Vector2";
import { Element } from "./Element";

/**
 * Viewport 接口：定义视口的核心功能
 */
export interface IViewport {
    /** 视口变换矩阵 */
    // 视口的位置（在世界坐标系中）
    position: Point;
    
    // 缩放级别
    zoom: number;
    
    // 旋转角度（可选）
    rotation: number;
    
    // 视口大小（在屏幕坐标系中，通常是 Canvas 的尺寸）
    size: Point
    
    // 坐标转换
    worldToScreen(worldPos: Vector2Like): Vector2Like;
    screenToWorld(screenPos: Vector2Like): Vector2Like;
    
    // 矩形转换
    worldRectToScreen(worldRect: BoundingRect): BoundingRect;
    screenRectToWorld(screenRect: BoundingRect): BoundingRect;
    
    // 视口可见区域（在世界坐标系中）
    getVisibleWorldBounds(): BoundingRect;
    
    // 更新视口
    pan(dx: number, dy: number): void;
    zoomAt(zoomFactor: number, centerScreen?: Vector2Like): void;
    fitToBounds(bounds: BoundingRect, padding?: number): void;
    reset(): void;
}

/**
 * Canvas Viewport 实现
 */
export class Viewport implements IViewport {
    position: Point;
    size:Point;
    private _zoom: number = 1;
    private _rotation: number = 0;
 
    
    // 缓存变换矩阵（用于性能优化）
    private _worldToScreenMatrix: Matrix2D | null = null;
    private _screenToWorldMatrix: Matrix2D | null = null;
    private _dirty: boolean = true;
    private _screenToWorldMatrixDirty: boolean = true;
    
    // 可见区域缓存
    private _cachedVisibleBounds: BoundingRect | null = null;
    private _visibleBoundsDirty: boolean = true;
    
    constructor(width: number, height: number) {
        this._worldToScreenMatrix = Matrix2D.identity()
        this._screenToWorldMatrix = Matrix2D.identity()
        this._cachedVisibleBounds=BoundingRect.fromLTRB(0,0,width,height)
        this.position = new Point(0, 0);
        this.position.onChange(() => {
            this.markMatrixUpdate();
        });
        this.size = new Point(width, height);
        this.size.onChange(() => {
            this.markMatrixUpdate();
        });
        this.size.set(width, height);
    }
    
    // ============ 属性访问器 ============
    
    get zoom(): number {
        return this._zoom;
    }
    
    set zoom(value: number) {
        // 限制缩放范围，防止过于极端
        this._zoom = Math.max(0.01, Math.min(100, value));
        this.markMatrixUpdate();
    }
    get rotation(): number {
        return this._rotation;
    }
    
    set rotation(value: number) {
        this._rotation = value;
        this.markMatrixUpdate();
    }
    get width(){
        return this.size.x
    }
    set width(value:number){
        this.size.x=value
    }
    get height(){
        return this.size.y
    }
    set height(value:number){
        this.size.y=value
    }
    markMatrixUpdate(){
        this._dirty = true;
        this._visibleBoundsDirty = true;
    }
    // ============ 坐标转换 ============
    
    /**
     * 世界坐标 → 屏幕坐标
     */
    worldToScreen(worldPos: Vector2Like): Vector2Like {
        const matrix = this.getWorldToScreenMatrix();
        return matrix.transformPoint(worldPos);
    }
    
    /**
     * 屏幕坐标 → 世界坐标
     */
    screenToWorld(screenPos: Vector2Like): Vector2Like {
        const matrix = this.getScreenToWorldMatrix();
        return matrix.transformPoint(screenPos);
    }
    
    /**
     * 世界矩形 → 屏幕矩形
     */
    worldRectToScreen(worldRect: BoundingRect): BoundingRect {
        const topLeft = this.worldToScreen({ x: worldRect.x, y: worldRect.y });
        const bottomRight = this.worldToScreen({ 
            x: worldRect.x + worldRect.width, 
            y: worldRect.y + worldRect.height 
        });
        return BoundingRect.fromLTRB(topLeft.x,topLeft.y,bottomRight.x,bottomRight.y)

    }
    
    /**
     * 屏幕矩形 → 世界矩形
     */
    screenRectToWorld(screenRect: BoundingRect): BoundingRect {
        const topLeft = this.screenToWorld({ x: screenRect.x, y: screenRect.y });
        const bottomRight = this.screenToWorld({ 
            x: screenRect.x + screenRect.width, 
            y: screenRect.y + screenRect.height 
        });
        return BoundingRect.fromLTRB(topLeft.x,topLeft.y,bottomRight.x,bottomRight.y)
    }
    
    // ============ 变换矩阵 ============
    
    /**
     * 获取世界→屏幕变换矩阵
     */
    public getWorldToScreenMatrix(): Matrix2D {
        if (this._dirty) {
            this.updateWorldToScreenMatrix();
            this._dirty = false;
            this._screenToWorldMatrixDirty=true
        }
        return this._worldToScreenMatrix;
    }
    
    /**
     * 获取屏幕→世界变换矩阵
     */
    public getScreenToWorldMatrix(): Matrix2D {
       // 世界→屏幕矩阵的逆矩阵
        const worldToScreen = this.getWorldToScreenMatrix();
        if (this._screenToWorldMatrixDirty) {
            this._screenToWorldMatrix.copy(worldToScreen).invert();
            this._screenToWorldMatrixDirty=false
        }
        return this._screenToWorldMatrix;
    }
    
    /**
     * 构建世界→屏幕变换矩阵
     * 变换顺序：世界 → 视口变换 → 屏幕
     */
    private updateWorldToScreenMatrix(): Matrix2D {
        const matrix = this._worldToScreenMatrix
        matrix.identity()
        // 1. 平移到视口中心（世界坐标）
        matrix.translate(-this.position.x, -this.position.y);
        
        // 2. 旋转（围绕视口中心）
        if (this._rotation !== 0) {
            matrix.rotate(-this._rotation);
        }
        
        // 3. 缩放
        matrix.scale(this._zoom, this._zoom);
        
        // 4. 平移到屏幕中心
       // matrix.translate(this.size.width / 2, this.size.height / 2);
        
        return matrix;
    }
    
    // ============ 视口操作 ============
    
    /**
     * 平移视口
     */
    pan(dx: number, dy: number): void {
        // 将屏幕空间的平移转换为世界空间
        const worldDelta = this.screenToWorld({ x: dx, y: dy });
        const current = this.screenToWorld({ x: 0, y: 0 });
        this.position.x = current.x - worldDelta.x;
        this.position.y = current.y - worldDelta.y;
        this.markMatrixUpdate()
    }
    
    /**
     * 在指定点缩放
     * @param zoomFactor 缩放因子（>1 放大，<1 缩小）
     * @param centerScreen 缩放中心（屏幕坐标），默认在视口中心
     */
    zoomAt(zoomFactor: number, centerScreen?: Vector2Like): void {
        const center = centerScreen || { x: this.size.x / 2, y: this.size.y / 2 };

        // 记录缩放中心的世界坐标
        const worldCenter = this.screenToWorld(center);

        // 应用缩放（直接赋值需手动标记矩阵为脏，否则 screenToWorld 返回旧矩阵）
        this._zoom = Math.max(0.01, Math.min(100, this._zoom * zoomFactor));
        this.markMatrixUpdate();

        // 调整位置，使缩放中心保持不变
        const newWorldCenter = this.screenToWorld(center);
        this.position.x += worldCenter.x - newWorldCenter.x;
        this.position.y += worldCenter.y - newWorldCenter.y;
    }
    
    /**
     * 使视口适应指定的边界
     */
    fitToBounds(bounds: BoundingRect, padding: number = 20): void {
        const aspect = this.size.width / this.size.height;
        const boundsAspect = bounds.width / bounds.height;
        
        let zoom: number;
        if (boundsAspect > aspect) {
            // 宽度适配
            zoom = (this.size.width - padding * 2) / bounds.width;
        } else {
            // 高度适配
            zoom = (this.size.height - padding * 2) / bounds.height;
        }
        
        // 计算中心位置
        const centerX = bounds.x + bounds.width / 2;
        const centerY = bounds.y + bounds.height / 2;
        
        this._zoom = zoom;
        this.position.set(centerX, centerY);
        this.markMatrixUpdate()
    }
    
    /**
     * 重置视口
     */
    reset(): void {
        this.position.set(0,0)
        this._zoom = 1;
        this._rotation = 0;
        this._dirty = true;
        this._cachedVisibleBounds = null;
    }
    
    // ============ 可见区域计算 ============
    
    /**
     * 获取在世界坐标系中的可见区域
     */
    getVisibleWorldBounds(): BoundingRect {
   
        if (!this._visibleBoundsDirty) {
            return this._cachedVisibleBounds;
        }
        // 屏幕四个角的世界坐标
        const corners = [
            this.screenToWorld({ x: 0, y: 0 }),
            this.screenToWorld({ x: this.size.width, y: 0 }),
            this.screenToWorld({ x: 0, y: this.size.height }),
            this.screenToWorld({ x: this.size.width, y: this.size.height })
        ];
        
      
        this._cachedVisibleBounds.fromPoints(corners)
        
        return this._cachedVisibleBounds;
    }
    
    /**
     * 检查一个世界矩形是否在可见区域内
     */
    isVisible(worldRect: BoundingRect, margin: number = 0): boolean {
        const visible = this.getVisibleWorldBounds();
        
        // 扩大可见区域（添加边距）
        const expandedVisible = {
            x: visible.x - margin,
            y: visible.y - margin,
            width: visible.width + margin * 2,
            height: visible.height + margin * 2
        };
        
        // 矩形相交检测
        return !(
            worldRect.x + worldRect.width < expandedVisible.x ||
            worldRect.x > expandedVisible.x + expandedVisible.width ||
            worldRect.y + worldRect.height < expandedVisible.y ||
            worldRect.y > expandedVisible.y + expandedVisible.height
        );
    }
    
    /**
     * 获取视口内的可见元素（用于渲染优化）
     */
    getVisibleElements(elements: Element[]): Element[] {
        const visible: Element[] = [];
        for (const elem of elements) {
            const bounds = elem.worldBounds;
            if (this.isVisible(bounds)) {
                visible.push(elem);
            }
        }
        return visible;
    }
}

