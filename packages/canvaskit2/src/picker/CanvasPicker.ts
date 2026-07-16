import { Picker } from './Picker'
import { Engine } from 'src/core/Engine'
import { Element } from 'src/core/Element'
import { Shape } from 'src/core/Shape'
import { Matrix2D } from '@dxyl/math2'

/** 离屏上下文类型（兼容 OffscreenCanvas 与普通 canvas） */
type OffscreenCtx = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

/**
 * 基于颜色编码的拾取器
 *
 * 工作原理：
 * 1. 为场景中每个元素分配唯一的 RGB 颜色（由元素 id 编码）
 * 2. 将所有元素以纯色绘制到离屏画布（忽略原始填充/描边样式）
 * 3. 拾取时，将世界坐标转换为设备像素坐标，读取该位置像素颜色
 * 4. 通过颜色反查 id，再由 id → 元素映射得到目标元素
 *
 * 优势：像素级精确，复杂路径也能正确命中；
 * 劣势：每次场景变更需要重绘离屏画布。
 *
 * 性能优化：仅当场景脏标记（scene.flags.dirty）时才重绘离屏画布。
 */
export class CanvasPicker extends Picker {
    /** 离屏画布 */
    private _offCanvas: HTMLCanvasElement | OffscreenCanvas
    /** 离屏上下文 */
    private _offCtx: OffscreenCtx
    /** id → 元素 映射 */
    private _colorMap: Map<number, Shape> = new Map()
    /** 离屏画布是否需要重绘 */
    private _offscreenDirty: boolean = true
    /** 复用矩阵，避免频繁分配 */
    private _matrix: Matrix2D = new Matrix2D()

    constructor(engine: Engine) {
        super(engine)
        this._initOffscreen()
    }

    /** 初始化离屏画布 */
    private _initOffscreen(): void {
        const renderer = this.engine.renderer
        const width = renderer.width
        const height = renderer.height

        if (typeof OffscreenCanvas !== 'undefined') {
            this._offCanvas = new OffscreenCanvas(width, height)
            this._offCtx = this._offCanvas.getContext('2d', { willReadFrequently: true })!
        } else {
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            this._offCanvas = canvas
            this._offCtx = canvas.getContext('2d', { willReadFrequently: true })!
        }
    }

    /**
     * 将元素 id 编码为 RGB 颜色
     * id 拆分为 3 字节：R(高8位) G(中8位) B(低8位)，最多支持 16777215 个元素
     */
    private _idToColor(id: number): [number, number, number] {
        return [(id >> 16) & 0xff, (id >> 8) & 0xff, id & 0xff]
    }

    /** 将 RGB 颜色解码为元素 id */
    private _colorToId(r: number, g: number, b: number): number {
        return (r << 16) | (g << 8) | b
    }

    /**
     * 将场景渲染到离屏画布
     * 每个元素用其唯一颜色填充/描边，忽略原始样式
     */
    private _renderToOffscreen(): void {
        const ctx = this._offCtx
        const renderer = this.engine.renderer
        const viewport = renderer.viewport
        const dpr = renderer.dpr
        const width = renderer.width
        const height = renderer.height

        // 同步画布尺寸（处理 resize）
        if (this._offCanvas.width !== width || this._offCanvas.height !== height) {
            this._offCanvas.width = width
            this._offCanvas.height = height
        }

        ctx.clearRect(0, 0, width, height)
        this._colorMap.clear()
        
        const renderList = this.engine.scene.getRenderElements(this.engine.renderer.viewport) as Shape[]
        const viewportMatrix = viewport.getWorldToScreenMatrix()
        const m = this._matrix

        for (let i = 0; i < renderList.length; i++) {
            const shape = renderList[i]
            if (!shape.shouldRender() || !shape.shouldInteractive()) continue

            // 注册颜色映射
            this._colorMap.set(shape.id, shape)

            // 确保路径已构建
            shape.updateBuildPath()

            const [r, g, b] = this._idToColor(shape.id)
            const color = `rgb(${r},${g},${b})`

            ctx.save()
            ctx.beginPath()

            // 应用变换：dpr × viewport × shape.worldMatrix
            m.fromScale(dpr, dpr).multiply(viewportMatrix).multiply(shape.worldMatrix)
            ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5])

            // 用唯一颜色填充
            const path = shape.path
            const style = shape.style
            const hasFill = shape.hasFill()
            const hasStroke = shape.hasStroke()

            if (hasFill) {
                path.applyFillPath(ctx as any)
                ctx.fillStyle = color
                ctx.fill(style.fillRule)
            }

            if (hasStroke) {
                ctx.beginPath()
                path.applyFillPath(ctx as any)
                ctx.strokeStyle = color
                ctx.lineWidth = style.lineWidth
                ctx.lineCap = style.lineCap
                ctx.lineJoin = style.lineJoin
                ctx.miterLimit = style.miterLimit
                ctx.stroke()
            }

            ctx.restore()
        }
    }

    /**
     * 覆盖 pick：基于颜色编码的拾取
     * 仅在场景脏时重绘离屏画布，否则复用缓存
     */
    pick(x: number, y: number): Element | null {
        // 场景有变更时重绘离屏画布
        if (this._offscreenDirty || this.engine.scene.flags.dirty) {
            this._renderToOffscreen()
            this._offscreenDirty = false
        }

        const renderer = this.engine.renderer
        const viewport = renderer.viewport
        const dpr = renderer.dpr

        // 世界坐标 → 屏幕坐标 → 设备像素坐标
        const screen = viewport.worldToScreen({ x, y })
        const px = Math.floor(screen.x * dpr)
        const py = Math.floor(screen.y * dpr)

        if (px < 0 || py < 0 || px >= this._offCanvas.width || py >= this._offCanvas.height) {
            return null
        }

        const data = this._offCtx.getImageData(px, py, 1, 1).data
        // alpha 为 0 表示空白区域
        if (data[3] === 0) return null

        const id = this._colorToId(data[0], data[1], data[2])
        return this._colorMap.get(id) ?? null
    }

    /** 手动标记离屏画布需要重绘 */
    markDirty(): void {
        this._offscreenDirty = true
    }
}
