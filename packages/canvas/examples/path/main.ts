import { PathBuilder } from '../../src/math/PathBuilder'
import { PathStroke, LineJoin, LineCap } from '../../src/math/PathStroke'
import { ExampleBase, ExampleManager } from '../lib/Example'

/**
 * 路径示例：综合演示 PathBuilder 的绘制与包围盒、PathStroke 的描边轮廓生成、
 * 以及 isPointInPath 命中测试。
 *
 * 画布左右分两区，两侧均支持鼠标命中测试：
 *   左半区：原始路径（蓝色描边）+ 包围盒
 *           - 橙色虚线 = computeBounds（含控制点的控制点包围盒）
 *           - 绿色实线 = computeTightBounds（紧凑包围盒，曲线段会展开极值点）
 *           鼠标在左半区移动/点击 → 对原始 PathBuilder 调用 isPointInPath，
 *           命中显示绿色实心点，未命中显示红色空心点。
 *   右半区：PathStroke.stroke 生成的描边轮廓（青色填充），
 *           叠加红色虚线原始路径作为对照。
 *           鼠标在右半区移动/点击 → 对描边轮廓调用 isPointInPath，
 *           命中显示绿色实心点，未命中显示红色空心点。
 */
class PathExample extends ExampleBase {
    static title = '路径 / 描边 / 命中'

    stateOptions: Record<string, any> = {
        shape: {
            '圆 circle': 'circle',
            '矩形 rect': 'rect',
            '星形 star': 'star',
            '三角 triangle': 'triangle',
            '六边 hexagon': 'hexagon',
            '心形 heart': 'heart',
        },
        lineJoin: {
            'miter': LineJoin.Miter,
            'round': LineJoin.Round,
            'bevel': LineJoin.Bevel,
        },
        lineCap: {
            'butt': LineCap.Butt,
            'round': LineCap.Round,
            'square': LineCap.Square,
        },
        fillRule: {
            'nonzero': 'nonzero',
            'evenodd': 'evenodd',
        },
    }

    /** 鼠标测试点（左半区画布坐标，测试原始路径） */
    private testX = -1
    private testY = -1
    private hitResult: boolean | null = null
    /** 鼠标测试点（右半区局部坐标，测试描边轮廓） */
    private testXR = -1
    private testYR = -1
    private hitResultR: boolean | null = null

    /** 画布尺寸由 index.html 决定，这里与 HTML 保持一致以便分区绘制 */
    private readonly canvasW = 900
    private readonly canvasH = 560

    getDefaultState() {
        return {
            shape: 'heart',
            closePath: true,
            // 左半区显示开关
            showOriginalPath: true,
            showControlBounds: true,
            showTightBounds: true,
            // 右半区显示开关
            showStroke: true,
            showOriginalOnStroke: true,
            showStrokeBounds: true,
            // 描边参数
            lineWidth: 18,
            lineJoin: LineJoin.Miter,
            lineCap: LineCap.Butt,
            miterLimit: 10,
            // 命中测试
            fillRule: 'nonzero',
        }
    }

    enter() {
        const canvas = this.owner.canvas
        this._onMouseMove = (e: MouseEvent) => this.handleMouse(e)
        canvas.addEventListener('mousemove', this._onMouseMove)
        canvas.addEventListener('click', this._onMouseMove)
        this.onChange('', null)
    }

    exit() {
        const canvas = this.owner.canvas
        if (this._onMouseMove) {
            canvas.removeEventListener('mousemove', this._onMouseMove)
            canvas.removeEventListener('click', this._onMouseMove)
        }
    }

    private _onMouseMove: ((e: MouseEvent) => void) | null = null

    private handleMouse(e: MouseEvent) {
        const canvas = this.owner.canvas
        const rect = canvas.getBoundingClientRect()
        // 缩放至画布逻辑坐标
        const x = (e.clientX - rect.left) * (canvas.width / rect.width)
        const y = (e.clientY - rect.top) * (canvas.height / rect.height)
        const s = this.state
        const halfW = this.canvasW / 2
        if (x <= halfW) {
            // 左半区：测试原始 PathBuilder 路径
            this.testX = x
            this.testY = y
            const path = this.buildShape(s.shape, halfW / 2, this.canvasH / 2, 110, s.closePath)
            this.hitResult = path.isPointInPath(x, y, s.fillRule as 'nonzero' | 'evenodd')
            this.refresh()
        } else {
            // 右半区：测试 PathStroke 生成的描边轮廓（局部坐标）
            const localX = x - halfW
            this.testXR = localX
            this.testYR = y
            const strokePath = this.buildStrokePath()
            this.hitResultR = strokePath.isPointInPath(localX, y, s.fillRule as 'nonzero' | 'evenodd')
            this.refresh()
        }
    }

    /** 构造右半区的描边轮廓 PathBuilder（中心位于右半区局部坐标 halfW/2, cy） */
    private buildStrokePath(): PathBuilder {
        const s = this.state
        const halfW = this.canvasW / 2
        const pathR = this.buildShape(s.shape, halfW / 2, this.canvasH / 2, 110, s.closePath)
        const stroker = new PathStroke()
        return stroker.stroke(pathR, {
            lineWidth: s.lineWidth,
            lineJoin: s.lineJoin as LineJoin,
            lineCap: s.lineCap as LineCap,
            miterLimit: s.miterLimit,
        })
    }

    /** 构造一个形状到 PathBuilder */
    private buildShape(kind: string, cx: number, cy: number, size: number, close: boolean): PathBuilder {
        const pb = new PathBuilder()
        if (kind === 'circle') {
            // 4 段二次贝塞尔近似圆
            const k = 0.5523 * size
            pb.moveTo(cx + size, cy)
            pb.quadraticCurveTo(cx + size, cy + k, cx, cy + size)
            pb.quadraticCurveTo(cx - size, cy + k, cx - size, cy)
            pb.quadraticCurveTo(cx - size, cy - k, cx, cy - size)
            pb.quadraticCurveTo(cx + size, cy - k, cx + size, cy)
            if (close) pb.closePath()
        } else if (kind === 'rect') {
            pb.moveTo(cx - size, cy - size)
            pb.lineTo(cx + size, cy - size)
            pb.lineTo(cx + size, cy + size)
            pb.lineTo(cx - size, cy + size)
            if (close) pb.closePath()
        } else if (kind === 'star') {
            const outer = size
            const inner = size * 0.4
            for (let i = 0; i < 10; i++) {
                const r = i % 2 === 0 ? outer : inner
                const a = (Math.PI / 5) * i - Math.PI / 2
                const x = cx + Math.cos(a) * r
                const y = cy + Math.sin(a) * r
                if (i === 0) pb.moveTo(x, y)
                else pb.lineTo(x, y)
            }
            if (close) pb.closePath()
        } else if (kind === 'triangle') {
            for (let i = 0; i < 3; i++) {
                const a = (Math.PI * 2 / 3) * i - Math.PI / 2
                const x = cx + Math.cos(a) * size
                const y = cy + Math.sin(a) * size
                if (i === 0) pb.moveTo(x, y)
                else pb.lineTo(x, y)
            }
            if (close) pb.closePath()
        } else if (kind === 'hexagon') {
            for (let i = 0; i < 6; i++) {
                const a = (Math.PI / 3) * i
                const x = cx + Math.cos(a) * size
                const y = cy + Math.sin(a) * size
                if (i === 0) pb.moveTo(x, y)
                else pb.lineTo(x, y)
            }
            if (close) pb.closePath()
        } else if (kind === 'heart') {
            // 心形：两段三次贝塞尔合成左右两瓣
            const s = size
            pb.moveTo(cx, cy + s * 0.6)
            pb.bezierCurveTo(
                cx + s * 1.2, cy + s * 0.2,
                cx + s * 0.9, cy - s * 0.8,
                cx, cy - s * 0.2,
            )
            pb.bezierCurveTo(
                cx - s * 0.9, cy - s * 0.8,
                cx - s * 1.2, cy + s * 0.2,
                cx, cy + s * 0.6,
            )
            if (close) pb.closePath()
        }
        return pb
    }

    onChange(_property?: string, _value?: any) {
        // 触发 refresh 即可，实际绘制在 onUpdate
    }

    /** 绘制一个包围盒矩形（线框） */
    private drawBounds(ctx: CanvasRenderingContext2D, b: { minX: number; minY: number; maxX: number; maxY: number } | null, color: string, dash: number[]) {
        if (!b) return
        if (!isFinite(b.minX) || !isFinite(b.maxX)) return
        ctx.strokeStyle = color
        ctx.lineWidth = 1
        ctx.setLineDash(dash)
        ctx.strokeRect(b.minX, b.minY, b.maxX - b.minX, b.maxY - b.minY)
        ctx.setLineDash([])
    }

    onUpdate() {
        const ctx = this.owner.ctx
        const canvas = this.owner.canvas
        const s = this.state

        ctx.fillStyle = '#1a1a1a'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const halfW = canvas.width / 2

        // 中线分隔
        ctx.strokeStyle = '#444'
        ctx.lineWidth = 1
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.moveTo(halfW, 0)
        ctx.lineTo(halfW, canvas.height)
        ctx.stroke()
        ctx.setLineDash([])

        const cx = halfW / 2
        const cy = canvas.height / 2
        const size = 110
        const path = this.buildShape(s.shape, cx, cy, size, s.closePath)

        // ── 左半区：PathBuilder 绘制 + 包围盒 + 命中测试 ──
        ctx.save()
        ctx.beginPath()
        ctx.rect(0, 0, halfW, canvas.height)
        ctx.clip()

        if (s.showOriginalPath) {
            // 半透明填充展示填充区域
            ctx.fillStyle = 'rgba(80, 170, 255, 0.18)'
            ctx.beginPath()
            path.toCanvasPath2D(ctx)
            ctx.fill()
            // 描边
            ctx.strokeStyle = '#4af'
            ctx.lineWidth = 1.5
            ctx.beginPath()
            path.toCanvasPath2D(ctx)
            ctx.stroke()
        }

        // 包围盒：computeBounds（控制点包围盒，橙色虚线）
        if (s.showControlBounds) {
            const b = path.computeBounds()
            this.drawBounds(ctx, b, '#fa4', [6, 4])
        }
        // 包围盒：computeTightBounds（紧凑包围盒，绿色实线）
        if (s.showTightBounds) {
            const b = path.computeTightBounds()
            this.drawBounds(ctx, b, '#6e6', [])
        }

        // 命中测试点
        if (this.testX >= 0 && this.testY >= 0 && this.hitResult !== null) {
            if (this.hitResult) {
                ctx.fillStyle = '#6e6'
                ctx.beginPath()
                ctx.arc(this.testX, this.testY, 6, 0, Math.PI * 2)
                ctx.fill()
            } else {
                ctx.strokeStyle = '#f55'
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.arc(this.testX, this.testY, 6, 0, Math.PI * 2)
                ctx.stroke()
            }
        }
        ctx.restore()

        // ── 右半区：PathStroke 描边轮廓 ──
        ctx.save()
        ctx.beginPath()
        ctx.rect(halfW, 0, halfW, canvas.height)
        ctx.clip()
        ctx.translate(halfW, 0)

        // 右半区使用同样的形状（中心点平移到右半区中心）
        const pathR = this.buildShape(s.shape, halfW / 2, cy, size, s.closePath)

        if (s.showStroke) {
            const strokePath = this.buildStrokePath()

            // 填充描边轮廓
            ctx.fillStyle = 'rgba(80, 220, 220, 0.45)'
            ctx.beginPath()
            strokePath.toCanvasPath2D(ctx)
            ctx.fill()
            // 描边描边轮廓（红色细线）以看清轮廓边界
            ctx.strokeStyle = '#8ff'
            ctx.lineWidth = 1
            ctx.beginPath()
            strokePath.toCanvasPath2D(ctx)
            ctx.stroke()

            // 描边轮廓包围盒
            if (s.showStrokeBounds) {
                const b = strokePath.computeTightBounds()
                this.drawBounds(ctx, b, '#fa4', [4, 4])
            }

            // 右半区命中测试点（局部坐标，translate 已生效）
            if (this.testXR >= 0 && this.testYR >= 0 && this.hitResultR !== null) {
                if (this.hitResultR) {
                    ctx.fillStyle = '#6e6'
                    ctx.beginPath()
                    ctx.arc(this.testXR, this.testYR, 6, 0, Math.PI * 2)
                    ctx.fill()
                } else {
                    ctx.strokeStyle = '#f55'
                    ctx.lineWidth = 2
                    ctx.beginPath()
                    ctx.arc(this.testXR, this.testYR, 6, 0, Math.PI * 2)
                    ctx.stroke()
                }
            }
        }

        // 叠加原始路径（红色虚线）作为对照
        if (s.showOriginalOnStroke) {
            ctx.strokeStyle = '#f55'
            ctx.lineWidth = 1
            ctx.setLineDash([4, 3])
            ctx.beginPath()
            pathR.toCanvasPath2D(ctx)
            ctx.stroke()
            ctx.setLineDash([])
        }
        ctx.restore()

        // ── 标签 ──
        ctx.fillStyle = '#aaa'
        ctx.font = '12px sans-serif'
        ctx.fillText('PathBuilder + Bounds (左半区移动鼠标测试 isPointInPath)', 10, 18)
        ctx.fillText(`shape=${s.shape}  fillRule=${s.fillRule}  close=${s.closePath}`, 10, 34)
        ctx.fillText('PathStroke 描边轮廓 (右半区移动鼠标测试 isPointInPath)', halfW + 10, 18)
        ctx.fillText(
            `lineWidth=${s.lineWidth}  join=${s.lineJoin}  cap=${s.lineCap}  miterLimit=${s.miterLimit}`,
            halfW + 10, 34,
        )

        // 命中结果标签
        if (this.hitResult !== null) {
            ctx.fillStyle = this.hitResult ? '#6e6' : '#f55'
            ctx.fillText(
                `path.isPointInPath(${this.testX.toFixed(0)}, ${this.testY.toFixed(0)}) = ${this.hitResult} [${s.fillRule}]`,
                10, canvas.height - 12,
            )
        }
        if (this.hitResultR !== null) {
            ctx.fillStyle = this.hitResultR ? '#6e6' : '#f55'
            ctx.fillText(
                `stroke.isPointInPath(${this.testXR.toFixed(0)}, ${this.testYR.toFixed(0)}) = ${this.hitResultR} [${s.fillRule}]`,
                halfW + 10, canvas.height - 12,
            )
        }
        // 图例
        const legendY = canvas.height - 30
        ctx.fillStyle = '#fa4'
        ctx.fillRect(halfW + 10, legendY - 8, 12, 2)
        ctx.fillStyle = '#aaa'
        ctx.fillText('stroke bounds', halfW + 28, legendY)
        ctx.fillStyle = '#8ff'
        ctx.fillRect(halfW + 130, legendY - 8, 12, 2)
        ctx.fillStyle = '#aaa'
        ctx.fillText('stroke contour', halfW + 148, legendY)
        ctx.fillStyle = '#f55'
        ctx.fillRect(halfW + 250, legendY - 8, 12, 2)
        ctx.fillStyle = '#aaa'
        ctx.fillText('original path', halfW + 268, legendY)
    }
}

ExampleManager.examples = [PathExample]
ExampleManager.getSingleInstance().init()
