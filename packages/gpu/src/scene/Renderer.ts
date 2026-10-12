// ============================================================
// Renderer — 渲染器抽象基类
//
// 渲染器是「渲染器无关显示列表」与「具体绘图后端」之间的适配层：
// 场景树只依赖 RenderContext 契约（本文件定义），Renderer 负责实现该
// 契约，并补齐后端的通用职责（表面尺寸 / 设备像素比 / 逐帧渲染入口）。
//
// 职责边界：
//   - 实现 RenderContext：状态管理（save / restore / transform /
//     setTransform / getTransform / resetTransform）、裁剪与清屏
//     （clipRect / setClearColor / clear）、路径原语（beginPath 等）
//     与带 Paint 的绘制（drawImage / drawRect / drawPath / drawText ...）
//   - 维护逻辑尺寸（width / height）与像素比（dpr）
//   - 提供逐帧渲染入口 render(root)
//   - 具体后端（Canvas / WebGL / CanvasKit）继承本类实现抽象方法
//
// 继承链：Renderer（抽象）→ CanvasRenderer（Canvas 2D 实现）
// ============================================================

import type { Matrix2DLike } from '../math/Matrix2D'
import type { Color, ColorInput } from '../math/Color'
import type { PathBuilder } from '../math/PathBuilder'
import type { Element } from './Element'
import type { Paint } from './Paint'


// ============================================================
// 渲染契约
// ============================================================
/**
 * 渲染上下文（渲染器无关的绘制契约）。
 * 具体后端（Canvas / WebGL / CanvasKit）负责实现该接口。
 */
export interface RenderContext {
    /** 保存当前渲染状态（变换/透明度/裁剪/样式） */
    save(): void
    /** 恢复上一次保存的渲染状态 */
    restore(): void
    /** 在当前变换基础上左乘叠加一个矩阵 */
    transform(matrix: Matrix2DLike): void
    setTransform(matrix: Matrix2DLike): void
    getTransform(): Matrix2DLike
    resetTransform(): void
    /** 以矩形区域裁剪后续绘制 */
    clipRect(x: number, y: number, width: number, height: number): void
    setClearColor(color: ColorInput): void
    clear(): void

    beginPath(): void
    moveTo(x: number, y: number): void
    lineTo(x: number, y: number): void
    quadraticCurveTo(cp1: number, cp1y: number, x: number, y: number): void
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void
    rect(x: number, y: number, width: number, height: number): void
    circle(x: number, y: number, radius: number): void
    ellipse(x: number, y: number, rx: number, ry: number): void
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void
    ellipseArc(x: number, y: number, rx: number, ry: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void
    closePath(): void

    drawImage(image: CanvasImageSource, dx: number, dy: number): void;
    drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
    drawRect(x: number, y: number, width: number, height: number, paint: Paint): void
    drawLine(x1: number, y1: number, x2: number, y2: number, paint: Paint): void
    drawCircle(x: number, y: number, radius: number, paint: Paint): void
    drawEllipse(x: number, y: number, rx: number, ry: number, paint: Paint): void
    drawPath(path: PathBuilder, paint: Paint): void
    drawText(text: string, x: number, y: number, paint: Paint): void
    drawPaint(paint: Paint): void
}

export interface RendererOptions {
    /** 逻辑宽度（与 dpr 无关） */
    width?: number
    /** 逻辑高度（与 dpr 无关） */
    height?: number
    /** 设备像素比（后备缓冲按此放大，绘制坐标仍为逻辑像素） */
    dpr?: number
    /** 逐帧清屏颜色；null 表示透明清屏 */
    background?: Color | null
}

export abstract class Renderer implements RenderContext {

    /** 逻辑宽度 */
    width: number
    /** 逻辑高度 */
    height: number
    /** 设备像素比 */
    dpr: number
    /** 逐帧清屏颜色；null 表示透明清屏 */
    background: Color | null

    constructor(options: RendererOptions = {}) {
        this.width = options.width ?? 0
        this.height = options.height ?? 0
        this.dpr = options.dpr ?? 1
        this.background = options.background ?? null
    }

    // ==================== RenderContext（抽象，由后端实现） ====================

    /** 保存当前渲染状态（变换/透明度/裁剪/样式） */
    abstract save(): void
    /** 恢复上一次保存的渲染状态 */
    abstract restore(): void
    /** 在当前变换基础上左乘叠加一个矩阵 */
    abstract transform(matrix: Matrix2DLike): void
    /** 用给定矩阵替换当前变换 */
    abstract setTransform(matrix: Matrix2DLike): void
    /** 读取当前变换矩阵 */
    abstract getTransform(): Matrix2DLike
    /** 重置为基准变换（单位变换 × dpr） */
    abstract resetTransform(): void
    /** 以矩形区域裁剪后续绘制（沿用当前变换） */
    abstract clipRect(x: number, y: number, width: number, height: number): void
    /** 预设清屏颜色（供 clear 使用） */
    abstract setClearColor(color: ColorInput): void
    /** 用预设清屏颜色清空当前绘制区域 */
    abstract clear(): void

    // -------- 路径原语 --------
    /** 开启一条新路径 */
    abstract beginPath(): void
    /** 移动到坐标点（开启新子路径） */
    abstract moveTo(x: number, y: number): void
    /** 从当前点连线到坐标点 */
    abstract lineTo(x: number, y: number): void
    /** 二次贝塞尔曲线（控制点 cp1，终点 x/y） */
    abstract quadraticCurveTo(cp1: number, cp1y: number, x: number, y: number): void
    /** 三次贝塞尔曲线（控制点 cp1/cp2，终点 x/y） */
    abstract bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void
    /** 追加矩形子路径 */
    abstract rect(x: number, y: number, width: number, height: number): void
    /** 追加整圆子路径 */
    abstract circle(x: number, y: number, radius: number): void
    /** 追加整椭圆子路径 */
    abstract ellipse(x: number, y: number, rx: number, ry: number): void
    /** 追加圆弧子路径 */
    abstract arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void
    /** 追加切线段后的圆弧 */
    abstract arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void
    /** 追加椭圆弧子路径（含旋转） */
    abstract ellipseArc(x: number, y: number, rx: number, ry: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void
    /** 闭合当前子路径 */
    abstract closePath(): void

    // -------- 带 Paint 的绘制 --------
    /** 绘制图像（仅目标位置） */
    abstract drawImage(image: CanvasImageSource, dx: number, dy: number): void
    /** 绘制图像（缩放） */
    abstract drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void
    /** 绘制图像（裁剪源区域并缩放） */
    abstract drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void
    /** 以 paint 绘制矩形 */
    abstract drawRect(x: number, y: number, width: number, height: number, paint: Paint): void
    /** 以 paint 绘制线段 */
    abstract drawLine(x1: number, y1: number, x2: number, y2: number, paint: Paint): void
    /** 以 paint 绘制圆 */
    abstract drawCircle(x: number, y: number, radius: number, paint: Paint): void
    /** 以 paint 绘制椭圆 */
    abstract drawEllipse(x: number, y: number, rx: number, ry: number, paint: Paint): void
    /** 以 paint 绘制任意路径 */
    abstract drawPath(path: PathBuilder, paint: Paint): void
    /** 以 paint 绘制文本 */
    abstract drawText(text: string, x: number, y: number, paint: Paint): void
    /** 以 paint 填充/描边由路径原语累积的当前路径 */
    abstract drawPaint(paint: Paint): void

    // ==================== 尺寸 ====================

    /** 更新逻辑尺寸（触发后端表面重建） */
    setSize(width: number, height: number): this {
        if (this.width === width && this.height === height) return this
        this.width = width
        this.height = height
        this.onResize(this.width, this.height, this.dpr)
        return this
    }

    /** 更新设备像素比（触发后端表面重建） */
    setDpr(dpr: number): this {
        if (this.dpr === dpr) return this
        this.dpr = dpr
        this.onResize(this.width, this.height, this.dpr)
        return this
    }

    // ==================== 渲染入口 ====================

    /** 渲染整棵场景树：先重置后端状态/清屏，再自根节点递归绘制 */
    render(root: Element): void {
        this.beginFrame()
        root.render(this)
    }

    // ==================== 后端钩子（子类覆写） ====================

    /** 尺寸/像素比变化时重建后端表面（画布尺寸、帧缓冲等） */
    protected onResize(width: number, height: number, dpr: number): void { }

    /** 每帧开始前重置后端状态并清屏 */
    protected beginFrame(): void { }
}
